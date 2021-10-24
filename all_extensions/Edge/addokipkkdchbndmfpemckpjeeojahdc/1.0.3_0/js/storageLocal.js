if (!window.helpers) {
	window.helpers = {};
}

window.helpers.storageLocal = (function () {
	var buildKey = function (key) {
		if (key.startsWith('ls-')) {
			return key;
		}

		return 'ls-' + key;
	};
	var getValue = function (key) {
		return new Promise(function (resolve, reject) {
			if (!chrome || !chrome.storage || !chrome.storage.local) {
				return reject(new Error('Storage required'));
			}

			var newKey = buildKey(key);
			console.log('Getting: ' + newKey);
			chrome.storage.local.get(newKey, function (val) {
				if (val) {
					return resolve({ key: key, val: val[Object.keys(val)[0]] });
				}

				resolve();
			});
		});
	};

	var setValue = function (key, dataValue) {
		return new Promise(function (resolve, reject) {
			if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
				var newKey = buildKey(key);
				console.log('Saving: ' + newKey);
				chrome.storage.local.set(
					{
						[newKey]: dataValue,
					},
					function () {
						resolve(newKey);
					}
				);
			}
		});
	};

	return {
		getValue: getValue,
		setValue: setValue,
	};
})();
