get_i18n();	

function get_i18n() {
	var matches = document.querySelectorAll('[data-i18n]');
	for (var i = 0; i < matches.length; i++) {
		matches[i].innerHTML = chrome.i18n.getMessage(matches[i].getAttribute('data-i18n'));
	}

	var matches_values = document.querySelectorAll('.tooltip');
	for (var i = 0; i < matches_values.length; i++) {
		matches_values[i].setAttribute('title' ,chrome.i18n.getMessage(matches_values[i].getAttribute('data-i18ntitle')));
	}
}