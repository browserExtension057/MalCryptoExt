// exchange-currencies-1.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 


// Top Currency List 

var ddData1 = [

// 1. US Dollar
		{
			text: "USD / " + currencytag1,
			value: "USD",
			selected: false,
			imageSrc: "assets/countries/united-states.svg"
		},
// 2. Euro
		{
			text: "EUR / " + currencytag2,
			value: "EUR",
			selected: false,
			imageSrc: "assets/countries/european-union.svg"
		},
// 3. Japanese Yen
		{
			text: "JPY / " + currencytag3,
			value: "JPY",
			selected: false,
			imageSrc: "assets/countries/japan.svg"
		},
// 4. Pound Sterling
		{
			text: "GBP / " + currencytag4,
			value: "GBP",
			selected: false,
			imageSrc: "assets/countries/united-kingdom.svg"
		},
// 5. Australian Dollar
		{
			text: "AUD / " + currencytag5,
			value: "AUD",
			selected: false,
			imageSrc: "assets/countries/australia.svg"
		},
// 6. Canadian Dollar
		{
			text: "CAD / " + currencytag6,
			value: "CAD",
			selected: false,
			imageSrc: "assets/countries/canada.svg"
		},
// 7. Swiss Franc
		{
			text: "CHF / " + currencytag7,
			value: "CHF",
			selected: false,
			imageSrc: "assets/countries/switzerland.svg"
		},
// 8. Chinese Yuan
		{
			text: "CNY / " + currencytag8,
			value: "CNY",
			selected: false,
			imageSrc: "assets/countries/china.svg"
		},
// 9. Swedish Krona
		{
			text: "SEK / " + currencytag9,
			value: "SEK",
			selected: false,
			imageSrc: "assets/countries/sweden.svg"
		},
// 10. New Zealand Dollar
		{
			text: "NZD / " + currencytag10,
			value: "NZD",
			selected: false,
			imageSrc: "assets/countries/new-zealand.svg"
		},
// 11. Mexican Peso
		{
			text: "MXN / " + currencytag11,
			value: "MXN",
			selected: false,
			imageSrc: "assets/countries/mexico.svg"
		},
// 12. Singapore Dollar
		{
			text: "SGD / " + currencytag12,
			value: "SGD",
			selected: false,
			imageSrc: "assets/countries/singapore.svg"
		},
// 13. Hong Kong Dollar
		{
			text: "HKD / " + currencytag13,
			value: "HKD",
			selected: false,
			imageSrc: "assets/countries/hong-kong.svg"
		},
// 14. Norwegian Krone
		{
			text: "NOK / " + currencytag14,
			value: "NOK",
			selected: false,
			imageSrc: "assets/countries/norway.svg"
		},
// 15. South Korean Won
		{
			text: "KRW / " + currencytag15,
			value: "KRW",
			selected: false,
			imageSrc: "assets/countries/south-korea.svg"
		},
// 16. Turkish Lira
		{
			text: "TRY / " + currencytag16,
			value: "TRY",
			selected: false,
			imageSrc: "assets/countries/turkey.svg"
		},
// 17. Russian Ruble
		{
			text: "RUB / " + currencytag17,
			value: "RUB",
			selected: false,
			imageSrc: "assets/countries/russia.svg"
		},
// 18. Indian Rupee
		{
			text: "INR / " + currencytag18,
			value: "INR",
			selected: false,
			imageSrc: "assets/countries/india.svg"
		},
// 19. Brazilian Real
		{
			text: "BRL / " + currencytag19,
			value: "BRL",
			selected: false,
			imageSrc: "assets/countries/brazil.svg"
		},
// 20. South African Rand
		{
			text: "ZAR / " + currencytag20,
			value: "ZAR",
			selected: false,
			imageSrc: "assets/countries/south-africa.svg"
		},
// 21. Philippine Peso
		{
			text: "PHP / " + currencytag21,
			value: "PHP",
			selected: false,
			imageSrc: "assets/countries/philippines.svg"
		},
// 22. Czech Koruna
		{
			text: "CZK / " + currencytag22,
			value: "CZK",
			selected: false,
			imageSrc: "assets/countries/czech-republic.svg"
		},
// 23. Indonesian Rupiah
		{
			text: "IDR / " + currencytag23,
			value: "IDR",
			selected: false,
			imageSrc: "assets/countries/indonesia.svg"
		},
// 24. Malaysian Ringgit
		{
			text: "MYR / " + currencytag24,
			value: "MYR",
			selected: false,
			imageSrc: "assets/countries/malaysia.svg"
		},
// 25. Hungarian Forint
		{
			text: "HUF / " + currencytag25,
			value: "HUF",
			selected: false,
			imageSrc: "assets/countries/hungary.svg"
		},
// 26. Icelandic krona
		{
			text: "ISK / " + currencytag26,
			value: "ISK",
			selected: false,
			imageSrc: "assets/countries/iceland.svg"
		},
// 27. Croatian Kuna
		{
			text: "HRK / " + currencytag27,
			value: "HRK",
			selected: false,
			imageSrc: "assets/countries/croatia.svg"
		},
// 28. Bulgarian Lev
		{
			text: "BGN / " + currencytag28,
			value: "BGN",
			selected: false,
			imageSrc: "assets/countries/bulgaria.svg"
		},
// 29. Romanian Leu
		{
			text: "RON / " + currencytag29,
			value: "RON",
			selected: false,
			imageSrc: "assets/countries/romania.svg"
		},
// 30. Danish Krone
		{
			text: "DKK / " + currencytag30,
			value: "DKK",
			selected: false,
			imageSrc: "assets/countries/denmark.svg"
		},
// 31. Thai Baht
		{
			text: "THB / " + currencytag31,
			value: "THB",
			selected: false,
			imageSrc: "assets/countries/thailand.svg"
		},
// 32. Polish Zloty
		{
			text: "PLN / " + currencytag32,
			value: "PLN",
			selected: false,
			imageSrc: "assets/countries/poland.svg"
		},
// 33. Israeli Shekel
		{
			text: "ILS / " + currencytag33,
			value: "ILS",
			selected: false,
			imageSrc: "assets/countries/israel.svg"
		},
	
		
// ----- NEW CURRENCIES 1.4 -------


// 34. United Arab Emirates
		{
			text: "AED / " + currencytag34,
			value: "AED",
			selected: false,
			imageSrc: "assets/countries/united-arab-emirates.svg"
		},	
// 35. Argentine Peso
		{
			text: "ARS / " + currencytag35,
			value: "ARS",
			selected: false,
			imageSrc: "assets/countries/argentina.svg"
		},			
// 36. Bahamian Dollar
		{
			text: "BSD / " + currencytag36,
			value: "BSD",
			selected: false,
			imageSrc: "assets/countries/bahamas.svg"
		},		
// 37. Chilean Peso
		{
			text: "CLP / " + currencytag37,
			value: "CLP",
			selected: false,
			imageSrc: "assets/countries/chile.svg"
		},
// 38. Colombian Peso
		{
			text: "COP / " + currencytag38,
			value: "COP",
			selected: false,
			imageSrc: "assets/countries/colombia.svg"
		},
// 39. Dominican Peso
		{
			text: "DOP / " + currencytag39,
			value: "DOP",
			selected: false,
			imageSrc: "assets/countries/dominican-republic.svg"
		},									
// 40. Egyptian Pound
		{
			text: "EGP / " + currencytag40,
			value: "EGP",
			selected: false,
			imageSrc: "assets/countries/egypt.svg"
		},	
// 41. Fiji Dollar
		{
			text: "FJD / " + currencytag41,
			value: "FJD",
			selected: false,
			imageSrc: "assets/countries/fiji.svg"
		},
// 42. Guatemalan Quetzal
		{
			text: "GTQ / " + currencytag42,
			value: "GTQ",
			selected: false,
			imageSrc: "assets/countries/guatemala.svg"
		},					
// 43. Kazakhstani Tenge
		{
			text: "KZT / " + currencytag43,
			value: "KZT",
			selected: false,
			imageSrc: "assets/countries/kazakhstan.svg"
		},	
// 44. Panamanian Balboa
		{
			text: "PAB / " + currencytag44,
			value: "PAB",
			selected: false,
			imageSrc: "assets/countries/panama.svg"
		},					
// 45. Peruvian Nuevo Sol
		{
			text: "PEN / " + currencytag45,
			value: "PEN",
			selected: false,
			imageSrc: "assets/countries/peru.svg"
		},				
// 46. Pakistani Rupee
		{
			text: "PKR / " + currencytag46,
			value: "PKR",
			selected: false,
			imageSrc: "assets/countries/pakistan.svg"
		},
// 47. Paraguayan Guarani
		{
			text: "PYG / " + currencytag47,
			value: "PYG",
			selected: false,
			imageSrc: "assets/countries/paraguay.svg"
		},		
// 48. Saudi Riyal
		{
			text: "SAR / " + currencytag48,
			value: "SAR",
			selected: false,
			imageSrc: "assets/countries/saudi-arabia.svg"
		},								
// 49. New Taiwan Dollar
		{
			text: "TWD / " + currencytag49,
			value: "TWD",
			selected: false,
			imageSrc: "assets/countries/taiwan.svg"
		},
// 50. Ukrainian Hryvnia
		{
			text: "UAH / " + currencytag50,
			value: "UAH",
			selected: false,
			imageSrc: "assets/countries/ukraine.svg"
		},	
// 51. Uruguayan Peso
		{
			text: "UYU / " + currencytag51,
			value: "UYU",
			selected: false,
			imageSrc: "assets/countries/uruguay.svg"
		},
// 52. Vietnamese Dong
		{
			text: "VND / " + currencytag52,
			value: "VND",
			selected: false,
			imageSrc: "assets/countries/vietnam.svg"
		},											
					
		
]	

// exchange-currencies-1.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 