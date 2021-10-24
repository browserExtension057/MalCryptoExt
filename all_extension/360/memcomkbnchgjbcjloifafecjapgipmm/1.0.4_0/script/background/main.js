window._platform = 'LianmishuCom'; //设置平台
var KU = {
	inputOnHeadersReceived: [], //存入状态数组
	outOnHeadersReceived: {}, //取出状态对象
	onBeforeSendHeaders: {}, //存入发送前的数据
};

/**
 * 设置配置项
 * @param {*} param 
 */
var _config = {
	timeout: 10,
};
var pageConfig = {
	clear: function () {
		chrome.storage.local.clear(function () {});
	},
	remove: function (key) {
		chrome.storage.local.remove(key, function () {});
	},
	set: function (key, val) {
		var def = $.Deferred();
		var setData = {};
		setData[key] = val;
		_config[key] = val;
		chrome.storage.local.set(setData, function () {
			return def.resolve(setData);
		});
		return def.promise();
	},
	setAll: function (data) {
		var def = $.Deferred();
		var self = this;
		var returnData = {};
		var arr = [];
		for (var i in data) {
			(function (key) {
				arr.push(function () {
					self.set(key, data[key]).done(function (json) {
						$.extend(returnData, json);
						arr.shift()();
					});
				});
			})(i);
		}
		arr.push(function () {
			return def.resolve(returnData);
		});
		arr.shift()();
		return def.promise();
	},
	get: function (key) {
		var def = $.Deferred();
		chrome.storage.local.get(key, function (json) {
			var returnData = json || {};
			if (typeof json[key] == 'undefined') {
				returnData[key] = typeof _config[key] != 'undefined' ? _config[key] : '';
			}

			_config[key] = returnData[key];
			return def.resolve(returnData[key]);
		});
		return def.promise();
	},
	getAll: function () {
		var def = $.Deferred();
		var len = Object.keys(_config).length;
		var returnData = {};
		var configArr = [];
		var execCount = 0;
		for (var i in _config) {
			configArr.push(i);
			chrome.storage.local.get(i, function (json) {
				execCount++;
				var key = configArr.shift();
				if (typeof json[key] != 'undefined') {
					returnData[key] = json[key];
					_config[key] = json[key];
				}
				if (len == execCount) {
					return def.resolve(returnData);
				}
			});
		}
		return def.promise();
	},
};
pageConfig.getAll().done(function (json) {});


chrome.runtime.onMessage.addListener(function (request, sender, response) {
	var url = request.url;
	var data = request.data || {};
	var type = request.type || 'get';
	var dataType = request.dataType || '';
	var headers = request.headers || {};
	var onBeforeSendHeaders = request.onBeforeSendHeaders || '';
	var timeout = request.timeout || _config.timeout * 1000;
	switch (type) {
		case 'getConfig':
			pageConfig.getApi().done(function (json) {
				response({
					original: request, //原始参数
					status: true,
					data: json,
				});
			});
			return true;
			break;
		case 'get':
		case 'delete':
		case 'post': //取页面或ajax接口
			var _url = url;
			var param = $.param(data);
			if (type == 'get' && param) {
				_url = url.indexOf('?') == -1 ? url + '?' + param : url + '&' + param;
			}

			if (onBeforeSendHeaders) {
				if (!KU.onBeforeSendHeaders[_url]) {
					KU.onBeforeSendHeaders[_url] = [];
				}
				KU.onBeforeSendHeaders[_url].push(onBeforeSendHeaders);
			}
			$.ajax({
				url: url,
				type: type,
				timeout: timeout,
				data: data,
				dataType: dataType,
				headers: headers
			}).done(function (json) {
				response({
					original: request, //原始参数
					status: true,
					data: json,
					header: KU.outOnHeadersReceived[_url] ? KU.outOnHeadersReceived[_url] : {}
				});

				if (KU.outOnHeadersReceived[_url]) {
					delete KU.outOnHeadersReceived[_url];
				}

			}).fail(function (json) {
				response({
					original: request, //原始参数
					status: false,
					data: json,
					header: KU.outOnHeadersReceived[_url] ? KU.outOnHeadersReceived[_url] : {}
				});
				if (KU.outOnHeadersReceived[_url]) {
					delete KU.outOnHeadersReceived[_url];
				}
			});

			KU.inputOnHeadersReceived.push(_url);
			return true;
		case 'cookie': //获取页面cookie值
			chrome.cookies.get({
				url: url,
				name: request.name
			}, function (cookies) {
				if (cookies !== null) {
					response({
						original: request, //原始参数
						status: true,
						data: cookies.value
					});
				} else {
					response({
						original: request, //原始参数
						status: false,
					});
				}
			});
			return true;
	}
});

//发送请求前修改参数
chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
	var headers = details.requestHeaders;
	for (var i in KU.onBeforeSendHeaders) {
		if (i == details.url) {
			var item = KU.onBeforeSendHeaders[i][0];
			if (!item) {
				continue;
			}
			for (var j in item) {
				headers.push({
					name: j,
					value: item[j]
				});
			}
			KU.onBeforeSendHeaders[i].splice(0, 1);
			if (KU.onBeforeSendHeaders[i].length == 0) {
				delete KU.onBeforeSendHeaders[i];
			}
		}
	}
	return {
		requestHeaders: headers
	};
}, {
	urls: ['<all_urls>']
}, ['blocking', 'requestHeaders']);


//请求接收时
chrome.webRequest.onHeadersReceived.addListener(function (details) {
	for (var i = 0, len = KU.inputOnHeadersReceived.length; i < len; i++) {
		if (KU.inputOnHeadersReceived[i] == details.url) {
			KU.outOnHeadersReceived[details.url] = details;
			KU.inputOnHeadersReceived.splice(i, 1);

			delete KU.inputOnHeadersReceived[i];
			break;
		}
	}
}, {
	urls: ['<all_urls>']
}, ["blocking"]);



(function () {
	//首次安装打开页面
	chrome.runtime.onInstalled.addListener(function (data) {
		if (data.reason === 'install') {
			chrome.tabs.create({
				url: 'http://lianzhuli.com/k.htm'
			});
		}
	})
})();