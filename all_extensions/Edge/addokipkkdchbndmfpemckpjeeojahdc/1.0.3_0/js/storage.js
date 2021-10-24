if (!window.helpers) {
	window.helpers = {};
}

window.helpers.storage = (function () {
	var buildKey = function (key) {
		if (key.startsWith('ls-')) {
			return key;
		}

		return 'ls-' + key;
	};

	var getValue = function (key) {
		if (!localStorage) {
			return null;
		}

		var value = localStorage.getItem(buildKey(key));
		try {
			return value && JSON.parse(value);
		} catch (e) {
			return value;
		}
	};

	var setValue = function (key, value) {
		if (!localStorage) {
			return null;
		}

		try {
			var newKey = buildKey(key);
			if (value != null && value !== '') {
				localStorage.setItem(newKey, JSON.stringify(value));
				helpers.storageLocal.setValue(newKey, value);
			} else {
				localStorage.removeItem(newKey);
			}
		} catch (e) {
			// Safari throws an exception here when in private mode
		}
	};

	return {
		getValue: getValue,
		setValue: setValue,
	};
})();
