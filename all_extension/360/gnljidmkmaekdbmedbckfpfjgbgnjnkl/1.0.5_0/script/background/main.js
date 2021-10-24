var KU = {
	inputOnHeadersReceived: [], //存入状态数组
	outOnHeadersReceived: {}, //取出状态对象
	onBeforeSendHeaders: {}, //存入发送前的数据
};
window.platform = 'PoloniexCom'; //设置平台

var config = {
	translate: 1,
}; //用于存储配置信息

/**
 * 设置配置项
 * @param {*} param 
 */
var pageConfig = {
	remove: function () {
		chrome.storage.local.remove('translate', function () {});
	},
	set: function (param) {
		var translate = param.translate;
		config = param;
		chrome.storage.local.set({
			translate: translate
		}, function () {
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: 'setConfig' + platform,
					data: {
						translate: translate
					}
				}, function (response) {});
			});
		});
	},
	get: function (callback) {
		callback(config);
	}
};

chrome.storage.local.get('translate', function (json) {
	if (json && typeof (json.translate) != 'undefined') {
		config = json;
	} else {
		pageConfig.set(config);
	}
});


chrome.runtime.onMessage.addListener(function (request, sender, response) {
	var url = request.url;
	var data = request.data || {};
	var type = request.type || 'get';
	var dataType = request.dataType || '';
	var headers = request.headers || {};
	var onBeforeSendHeaders = request.onBeforeSendHeaders || '';
	var timeout = request.timeout || 10000;

	switch (type) {
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