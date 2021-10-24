function geoplugin_request() { return '88.19.182.171';} 
function geoplugin_status() { return '200';} 
function geoplugin_credit() { return 'Some of the returned data includes GeoLite data created by MaxMind, available from <a href=\'http://www.maxmind.com\'>http://www.maxmind.com</a>.';} 
function geoplugin_delay() { return '2ms';} 
function geoplugin_city() { return 'Getafe';} 
function geoplugin_region() { return 'Madrid';} 
function geoplugin_regionCode() { return 'M';} 
function geoplugin_regionName() { return 'Madrid';} 
function geoplugin_areaCode() { return '';} 
function geoplugin_dmaCode() { return '';} 
function geoplugin_countryCode() { return 'ES';} 
function geoplugin_countryName() { return 'Spain';} 
function geoplugin_inEU() { return 1;} 
function geoplugin_euVATrate() { return 21;} 
function geoplugin_continentCode() { return 'EU';} 
function geoplugin_latitude() { return '40.3057';} 
function geoplugin_longitude() { return '-3.7329';} 
function geoplugin_locationAccuracyRadius() { return '5';} 
function geoplugin_timezone() { return 'Europe/Madrid';} 
function geoplugin_currencyCode() { return 'EUR';} 
function geoplugin_currencySymbol() { return '&#8364;';} 
function geoplugin_currencySymbol_UTF8() { return '€';} 
function geoplugin_currencyConverter(amt, symbol) { 
	if (!amt) { return false; } 
	var converted = amt * 0.867; 
	if (converted <0) { return false; } 
	if (symbol === false) { return Math.round(converted * 100)/100; } 
	else { return '&#8364;'+(Math.round(converted * 100)/100);} 
	return false; 
} 
