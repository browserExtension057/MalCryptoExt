function convertToLocalStorage() {
	var keys = Object.keys(localStorage);
	for (i = 0; i < keys.length; i++) {
		var currentKey = keys[i];
		var val = helpers.storage.getValue(currentKey);
		helpers.storageLocal.setValue(currentKey, val);
	}
}

function convertToStorage() {
	chrome.storage.local.get(null, function(items) {
		var keys = Object.keys(items);
		for (i = 0; i < keys.length; i++) {
			var currentKey = keys[i];
			helpers.storageLocal.getValue(currentKey).then(function(data) {
				helpers.storage.setValue(data.key, data.val);
			});
		}
	});
}

convertToLocalStorage();
convertToStorage();
