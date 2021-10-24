// multiple-converter.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 

// Open and close search currency 

$('.add-currency-btn').click(function() {
  var clicks = $(this).data('clicks');
  if (clicks) {
			 $(".currencysearch").hide();
				$(".resetcurrencysearch").hide();
				$('.notcurrencyfound').hide();
				$(".currencysearch").val("");
				$('.add-currency-list li').fadeIn(100);
				$("ul.add-currency-list").animate({ scrollTop: 0 }, 100);
  } else {
			 $(".currencysearch").show();
  }
  $(this).data("clicks", !clicks);
});

// Reset search 

$(".resetcurrencysearch").click(function() {
   $(".currencysearch").val("");
   $('.notcurrencyfound').hide();
   $(".resetcurrencysearch").hide();
			$('.add-currency-list li').fadeIn(100);
});

// Input reset

$(".currencysearch").keyup(function(event){
		var val = $(this).val();
		if (val.length > 0){
			$(".resetcurrencysearch").show();
			}
		else{
			$(".resetcurrencysearch").hide();
	}	
});

// Currency search 

$('#currencysearch').bind('keyup', function() {
		var searchString = $(this).val();
		var count = 0;
		$(".add-currency-list li").each(function(index, value) {
			currentName = $(value).text()
				if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
									$(value).show();
									count++;
							}
			else{
									$(value).hide();
							}  
		});
			if (count != 0) 
						{
								$('.add-currency-list').find('.notcurrencyfound').hide();
						}
		else{
								$('.add-currency-list').find('.notcurrencyfound').show();
						}						  
});

// Open currencies list		

$('.list').on('click', function() { 
    $("#currencysearch2").hide();
				$("#currencysearch3").hide();
				$(".active_fromDropdown").hide();
				$(".active_toDropdown").hide();
				$('.currencies-list').show(); 
				$(this).removeClass('list');
    $(this).addClass('list_active');
				$('.list_active').addClass('list'); 
				$('.list_active').removeClass('list'); 
				localStorage.setItem('List', 'on');
				$('body').removeClass('height_auto');
				$('body').removeClass('height_500_2');
				$('body').addClass('height_500');
				// close configuration
				$('.configuration-settings').hide(); 
				$('.configuration_active').addClass('configuration'); 
			 $('.configuration').removeClass('configuration_active');
			 localStorage.setItem('Configuration', 'off'); 			 				   
});

// Close currencies list / Back
		
$('.back').on('click', function() {
				$('.currencies-list').hide(); 
				$('.list_active').addClass('list'); 
				$('.list').removeClass('list_active');
				localStorage.setItem('List', 'off'); 
				$('body').addClass('height_auto'); 
				$('body').removeClass('height_500'); 
				$("#currencysearch2").hide();
				$("#fromDropdown	.dd-selected-text").show();
	   $("#fromDropdown	.dd-selected-image").show();
				$("#toDropdown	.dd-selected-text").show();
	   $("#toDropdown	.dd-selected-image").show();
				$(".active_fromDropdown").show();
				$(".active_toDropdown").show();
});

// Check status localstorage

var List = localStorage.getItem("List");

if (List == "on") {
		$(".active_fromDropdown").hide();
		$(".active_toDropdown").hide();
		$('.currencies-list').show(); 
  $('.list').addClass('list_active');	
		$('.list_active').removeClass('list');
		$('body').removeClass('height_auto');
		$('body').removeClass('height_500_2');
		$('body').addClass('height_500'); 
}
if (List == "off") {
	$('.currencies-list').hide(); 
	$('body').addClass('height_auto'); 
	$('body').removeClass('height_500');	
}

// Multiple currencies converter 


// Variables

const addCurrencyBtn = document.querySelector(".add-currency-btn");
const addCurrencyList = document.querySelector(".add-currency-list");
const currenciesList = document.querySelector(".currencies");
const dataURL = "https://api.exchangerate-api.com/v4/latest/EUR";


// Variables - Retrieve values stored in localStorage

var USD = JSON.parse(localStorage.getItem("USD")) || [];
var EUR = JSON.parse(localStorage.getItem("EUR")) || [];
var JPY = JSON.parse(localStorage.getItem("JPY")) || [];
var BGN = JSON.parse(localStorage.getItem("BGN")) || [];
var CZK = JSON.parse(localStorage.getItem("CZK")) || [];
var DKK = JSON.parse(localStorage.getItem("DKK")) || [];
var GBP = JSON.parse(localStorage.getItem("GBP")) || [];
var HUF = JSON.parse(localStorage.getItem("HUF")) || [];
var PLN = JSON.parse(localStorage.getItem("PLN")) || [];
var RON = JSON.parse(localStorage.getItem("RON")) || [];
var SEK = JSON.parse(localStorage.getItem("SEK")) || [];
var CHF = JSON.parse(localStorage.getItem("CHF")) || [];
var ISK = JSON.parse(localStorage.getItem("ISK")) || [];
var NOK = JSON.parse(localStorage.getItem("NOK")) || [];
var HRK = JSON.parse(localStorage.getItem("HRK")) || [];
var RUB = JSON.parse(localStorage.getItem("RUB")) || [];
var TRY = JSON.parse(localStorage.getItem("TRY")) || [];
var AUD = JSON.parse(localStorage.getItem("AUD")) || [];
var BRL = JSON.parse(localStorage.getItem("BRL")) || [];
var CAD = JSON.parse(localStorage.getItem("CAD")) || [];
var CNY = JSON.parse(localStorage.getItem("CNY")) || [];
var HKD = JSON.parse(localStorage.getItem("HKD")) || [];
var IDR = JSON.parse(localStorage.getItem("IDR")) || [];
var ILS = JSON.parse(localStorage.getItem("ILS")) || [];
var INR = JSON.parse(localStorage.getItem("INR")) || [];
var KRW = JSON.parse(localStorage.getItem("KRW")) || [];
var MXN = JSON.parse(localStorage.getItem("MXN")) || [];
var MYR = JSON.parse(localStorage.getItem("MYR")) || [];
var NZD = JSON.parse(localStorage.getItem("NZD")) || [];
var PHP = JSON.parse(localStorage.getItem("PHP")) || [];
var SGD = JSON.parse(localStorage.getItem("SGD")) || [];
var THB = JSON.parse(localStorage.getItem("THB")) || [];
var ZAR = JSON.parse(localStorage.getItem("ZAR")) || [];

// ----- NEW CURRENCIES 1.4 -------

var AED = JSON.parse(localStorage.getItem("AED")) || [];
var ARS = JSON.parse(localStorage.getItem("ARS")) || [];
var BSD = JSON.parse(localStorage.getItem("BSD")) || [];
var CLP = JSON.parse(localStorage.getItem("CLP")) || [];
var COP = JSON.parse(localStorage.getItem("COP")) || [];
var DOP = JSON.parse(localStorage.getItem("DOP")) || [];
var EGP = JSON.parse(localStorage.getItem("EGP")) || [];
var FJD = JSON.parse(localStorage.getItem("FJD")) || [];
var GTQ = JSON.parse(localStorage.getItem("GTQ")) || [];
var KZT = JSON.parse(localStorage.getItem("KZT")) || [];
var PAB = JSON.parse(localStorage.getItem("PAB")) || [];
var PEN = JSON.parse(localStorage.getItem("PEN")) || [];
var PKR = JSON.parse(localStorage.getItem("PKR")) || [];
var PYG = JSON.parse(localStorage.getItem("PYG")) || [];
var SAR = JSON.parse(localStorage.getItem("SAR")) || [];
var TWD = JSON.parse(localStorage.getItem("TWD")) || [];
var UAH = JSON.parse(localStorage.getItem("UAH")) || [];
var UYU = JSON.parse(localStorage.getItem("UYU")) || [];
var VND = JSON.parse(localStorage.getItem("VND")) || [];


// const initiallyDisplayedCurrencies = [USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,SEK,NZD,MXN,SGD,HKD,NOK,KRW,TRY,RUB,INR,BRL,ZAR,PHP,CZK,IDR,MYR,HUF,ISK,HRK,BGN,RON,DKK,THB,PLN,ILS];

const initiallyDisplayedCurrencies = [USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,SEK,NZD,MXN,SGD,HKD,NOK,KRW,TRY,RUB,INR,BRL,ZAR,PHP,CZK,IDR,MYR,HUF,ISK,HRK,BGN,RON,DKK,THB,PLN,ILS,AED,ARS,BSD,CLP,COP,DOP,EGP,FJD,GTQ,KZT,PAB,PEN,PKR,PYG,SAR,TWD,UAH,UYU,VND];

// let

let baseCurrency;
let baseCurrencyAmount;


// Currencies list 

let currencies = [

// 1. US Dollar
  {
    name: currencytag1,
    abbreviation: "USD",
    symbol: "\u0024",
    flagURL: "assets/countries/united-states.svg"
  },
// 2. Euro		
  {
    name: currencytag2,
    abbreviation: "EUR",
    symbol: "\u20AC",
    flagURL: "assets/countries/european-union.svg"
  },
// 3. Japanese Yen		
  {
    name: currencytag3,
    abbreviation: "JPY",
    symbol: "\u00A5",
    flagURL: "assets/countries/japan.svg"
  },
// 4. Pound Sterling		
  {
    name: currencytag4,
    abbreviation: "GBP",
    symbol: "\u00A3",
    flagURL: "assets/countries/united-kingdom.svg"
  },
// 5. Australian Dollar		
  {
    name: currencytag5,
    abbreviation: "AUD",
    symbol: "\u0024",
    flagURL: "assets/countries/australia.svg"
  },
// 6. Canadian Dollar		
  {
    name: currencytag6,
    abbreviation: "CAD",
    symbol: "\u0024",
    flagURL: "assets/countries/canada.svg"
  },
// 7. Swiss Franc	
  {
    name: currencytag7,
    abbreviation: "CHF",
    symbol: "₣",
    flagURL: "assets/countries/switzerland.svg"
  },
// 8. Chinese Yuan			
  {
    name: currencytag8,
    abbreviation: "CNY",
    symbol: "\u00A5",
    flagURL: "assets/countries/china.svg"
  },
// 9. Swedish Krona		
  {
    name: currencytag9,
    abbreviation: "SEK",
    symbol: "\u006B\u0072",
    flagURL: "assets/countries/sweden.svg"
  },
// 10. New Zealand Dollar		
  {
    name: currencytag10,
    abbreviation: "NZD",
    symbol: "\u0024",
    flagURL: "assets/countries/new-zealand.svg"
  },
// 11. Mexican Peso		
  {
    name: currencytag11,
    abbreviation: "MXN",
    symbol: "\u0024",
    flagURL: "assets/countries/mexico.svg"
  },
// 12. Singapore Dollar				
  {
    name: currencytag12,
    abbreviation: "SGD",
    symbol: "\u0024",
    flagURL: "assets/countries/singapore.svg"
  },
// 13. Hong Kong Dollar		
  {
    name: currencytag13,
    abbreviation: "HKD",
    symbol: "\u0024",
    flagURL: "assets/countries/hong-kong.svg"
  },
// 14. Norwegian Krone			
  {
    name: currencytag14,
    abbreviation: "NOK",
    symbol: "\u006B\u0072",
    flagURL: "assets/countries/norway.svg"
  },
// 15. South Korean Won		
  {
    name: currencytag15,
    abbreviation: "KRW",
    symbol: "\u20A9",
    flagURL: "assets/countries/south-korea.svg"
  },
// 16. Turkish Lira		
  {
    name: currencytag16,
    abbreviation: "TRY",
    symbol: "\u20BA",
    flagURL: "assets/countries/turkey.svg"
  },
// 17. Russian Ruble		
  {
    name: currencytag17,
    abbreviation: "RUB",
    symbol: "\u20BD",
    flagURL: "assets/countries/russia.svg"
  },
// 18. Indian Rupee		
  {
    name: currencytag18,
    abbreviation: "INR",
    symbol: "\u20B9",
    flagURL: "assets/countries/india.svg"
  },
// 19. Brazilian Real		
  {
    name: currencytag19,
    abbreviation: "BRL",
    symbol: "\u0052\u0024",
    flagURL: "assets/countries/brazil.svg"
  },
// 20. South African Rand		
  {
    name: currencytag20,
    abbreviation: "ZAR",
    symbol: "\u0052",
    flagURL: "assets/countries/south-africa.svg"
  },
// 21. Philippine Peso		
  {
    name: currencytag21,
    abbreviation: "PHP",
    symbol: "\u20B1",
    flagURL: "assets/countries/philippines.svg"
  },
// 22. Czech Koruna		
  {
    name: currencytag22,
    abbreviation: "CZK",
    symbol: "\u004B\u010D",
    flagURL: "assets/countries/czech-republic.svg"
  },
// 23. Indonesian Rupiah		
  {
    name: currencytag23,
    abbreviation: "IDR",
    symbol: "\u0052\u0070",
    flagURL: "assets/countries/indonesia.svg"
  },
// 24. Malaysian Ringgit		
  {
    name: currencytag24,
    abbreviation: "MYR",
    symbol: "\u0052\u004D",
    flagURL: "assets/countries/malaysia.svg"
  },
// 25. Hungarian Forint		
  {
    name: currencytag25,
    abbreviation: "HUF",
    symbol: "\u0046\u0074",
    flagURL: "assets/countries/hungary.svg"
  },
// 26. Icelandic krona			
  {
    name: currencytag26,
    abbreviation: "ISK",
    symbol: "\u006B\u0072",
    flagURL: "assets/countries/iceland.svg"
  },
// 27. Croatian Kuna		
  {
    name: currencytag27,
    abbreviation: "HRK",
    symbol: "\u006B\u006E",
    flagURL: "assets/countries/croatia.svg"
  },
// 28. Bulgarian Lev		
  {
    name: currencytag28,
    abbreviation: "BGN",
    symbol: "\u043B\u0432",
    flagURL: "assets/countries/bulgaria.svg"
  },
// 29. Romanian Leu		
  {
    name: currencytag29,
    abbreviation: "RON",
    symbol: "\u006C\u0065\u0069",
    flagURL: "assets/countries/romania.svg"
  },
// 30. Danish Krone		
  {
    name: currencytag30,
    abbreviation: "DKK",
    symbol: "\u006B\u0072",
    flagURL: "assets/countries/denmark.svg"
  },
// 31. Thai Baht		
  {
    name: currencytag31,
    abbreviation: "THB",
    symbol: "\u0E3F",
    flagURL: "assets/countries/thailand.svg"
  },
// 32. Polish Zloty		
  {
    name: currencytag32,
    abbreviation: "PLN",
    symbol: "\u007A\u0142",
    flagURL: "assets/countries/poland.svg"
  },
// 33. Israeli Shekel		
  {
    name: currencytag33,
    abbreviation: "ILS",
    symbol: "\u20AA",
    flagURL: "assets/countries/israel.svg"
  },
		

// ----- NEW CURRENCIES 1.4 -------		


// 34. United Arab Emirates
  {
    name: currencytag34,
    abbreviation: "AED",
    symbol: "د.إ,",
    flagURL: "assets/countries/united-arab-emirates.svg"
  },	
// 35. Argentine Peso
  {
    name: currencytag35,
    abbreviation: "ARS",
    symbol: "$",
    flagURL: "assets/countries/argentina.svg"
  },		
// 36. Bahamian Dollar
  {
    name: currencytag36,
    abbreviation: "BSD",
    symbol: "$",
    flagURL: "assets/countries/bahamas.svg"
  },	
// 37. Chilean Peso
  {
    name: currencytag37,
    abbreviation: "CLP",
    symbol: "$",
    flagURL: "assets/countries/chile.svg"
  },
// 38. Colombian Peso
  {
    name: currencytag38,
    abbreviation: "COP",
    symbol: "$",
    flagURL: "assets/countries/colombia.svg"
  },	
// 39. Dominican Peso
  {
    name: currencytag39,
    abbreviation: "DOP",
    symbol: "$",
    flagURL: "assets/countries/dominican-republic.svg"
  },			
// 40. Egyptian Pound
  {
    name: currencytag40,
    abbreviation: "EGP",
    symbol: "£",
    flagURL: "assets/countries/egypt.svg"
  },		
// 41. Fiji Dollar
  {
    name: currencytag41,
    abbreviation: "FJD",
    symbol: "$",
    flagURL: "assets/countries/fiji.svg"
  },
// 42. Guatemalan Quetzal
  {
    name: currencytag42,
    abbreviation: "GTQ",
    symbol: "Q",
    flagURL: "assets/countries/guatemala.svg"
  },	
// 43. Kazakhstani Tenge
  {
    name: currencytag43,
    abbreviation: "KZT",
    symbol: "₸",
    flagURL: "assets/countries/kazakhstan.svg"
  },			
// 44. Panamanian Balboa
  {
    name: currencytag44,
    abbreviation: "PAB",
    symbol: "B/.",
    flagURL: "assets/countries/panama.svg"
  },	
// 45. Peruvian Nuevo Sol
  {
    name: currencytag45,
    abbreviation: "PEN",
    symbol: "S/.",
    flagURL: "assets/countries/peru.svg"
  },			
// 46. Pakistani Rupee
  {
    name: currencytag46,
    abbreviation: "PKR",
    symbol: "Rs",
    flagURL: "assets/countries/pakistan.svg"
  },	
// 47. Paraguayan Guarani
  {
    name: currencytag47,
    abbreviation: "PYG",
    symbol: "Gs",
    flagURL: "assets/countries/paraguay.svg"
  },	
// 48. Saudi Riyal
  {
    name: currencytag48,
    abbreviation: "SAR",
    symbol: "﷼",
    flagURL: "assets/countries/saudi-arabia.svg"
  },
// 49. New Taiwan Dollar
  {
    name: currencytag49,
    abbreviation: "TWD",
    symbol: "T$",
    flagURL: "assets/countries/taiwan.svg"
  },		
// 50. Ukrainian Hryvnia
  {
    name: currencytag50,
    abbreviation: "UAH",
    symbol: "₴",
    flagURL: "assets/countries/ukraine.svg"
  },	
// 51. Uruguayan Peso
  {
    name: currencytag51,
    abbreviation: "UYU",
    symbol: "$U",
    flagURL: "assets/countries/uruguay.svg"
  },
// 52. Vietnamese Dong
  {
    name: currencytag52,
    abbreviation: "VND",
    symbol: "Đ",
    flagURL: "assets/countries/vietnam.svg"
  }
								
];


								
// Event Listeners

addCurrencyBtn.addEventListener("click", addCurrencyBtnClick);
function addCurrencyBtnClick(event) {addCurrencyBtn.classList.toggle("open"); }
addCurrencyList.addEventListener("click", addCurrencyListClick);



// Add currency 

function addCurrencyListClick(event) {
  const clickedListItem = event.target.closest("li");
  if(!clickedListItem.classList.contains("disabled")) {
    const newCurrency = currencies.find(c => c.abbreviation===clickedListItem.getAttribute("data-currency"));
    if(newCurrency) newCurrenciesListItem(newCurrency);
  }
}

currenciesList.addEventListener("click", currenciesListClick);

// Remove currencies 

function currenciesListClick(event) {
  if(event.target.classList.contains("close")) {
    const parentNode = event.target.parentNode;
    localStorage.setItem(parentNode.id, 'false');				
		  setTimeout(function(){
				$(parentNode).remove();
		  }, 500);
		 $(parentNode).animate({
    left: "-370px",
				height: "20px",
				opacity: 0.4
   }, 210);
	 addCurrencyList.querySelector(`[data-currency=${parentNode.id}]`).classList.remove("disabled");
    if(parentNode.classList.contains("base-currency")) {
      const newBaseCurrencyLI = currenciesList.querySelector(".currency");
      if(newBaseCurrencyLI) {
        setNewBaseCurrency(newBaseCurrencyLI);
        baseCurrencyAmount = Number(newBaseCurrencyLI.querySelector(".input input").value);
						 
      }
    }
  }
}

function setNewBaseCurrency(newBaseCurrencyLI) {
		var decimalnumber = localStorage.getItem('Decimal'); 
  newBaseCurrencyLI.classList.add("base-currency");
  baseCurrency = newBaseCurrencyLI.id;
  const baseCurrencyRate = currencies.find(currency => currency.abbreviation===baseCurrency).rate;
  currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
    const currencyRate = currencies.find(currency => currency.abbreviation===currencyLI.id).rate;
    const exchangeRate = currencyLI.id===baseCurrency ? 1 : (currencyRate/baseCurrencyRate).toFixed(decimalnumber);
    currencyLI.querySelector(".base-currency-rate").textContent = `1 ${baseCurrency} = ${exchangeRate} ${currencyLI.id}`;
  });
}

currenciesList.addEventListener("input", currenciesListInputChange);

function currenciesListInputChange(event) {
  const isNewBaseCurrency = event.target.closest("li").id!==baseCurrency;
  if(isNewBaseCurrency) {
    currenciesList.querySelector(`#${baseCurrency}`).classList.remove("base-currency");
    setNewBaseCurrency(event.target.closest("li"));
  }
  const newBaseCurrencyAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
  if(baseCurrencyAmount!==newBaseCurrencyAmount || isNewBaseCurrency) {
			
    baseCurrencyAmount = newBaseCurrencyAmount;
    const baseCurrencyRate = currencies.find(currency => currency.abbreviation===baseCurrency).rate;
    currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
      if(currencyLI.id!==baseCurrency) {
								var decimalnumber = localStorage.getItem('Decimal'); 
								var separator = localStorage.getItem('Separator'); 
        const currencyRate = currencies.find(currency => currency.abbreviation===currencyLI.id).rate;
        const exchangeRate = currencyLI.id===baseCurrency ? 1 : (currencyRate/baseCurrencyRate).toFixed(7);
        currencyLI.querySelector(".input input").value = exchangeRate*baseCurrencyAmount!==0 ? (exchangeRate*baseCurrencyAmount).toFixed(decimalnumber).replace(".", separator) : "";
      }
    });
  }
}

currenciesList.addEventListener("focusout", currenciesListFocusOut);

function currenciesListFocusOut(event) {
	 var decimalnumber = localStorage.getItem('Decimal');
		var separator = localStorage.getItem('Separator');  
  const inputValue = event.target.value;
  if(isNaN(inputValue) || Number(inputValue)===0) event.target.value="";
  else event.target.value = Number(inputValue).toFixed(decimalnumber).replace(".", separator);
}

currenciesList.addEventListener("keydown", currenciesListKeyDown);

function currenciesListKeyDown(event) {
  if(event.key==="Enter") event.target.blur();
}

// Auxiliary Functions

function populateAddCyrrencyList() {
  for(let i=0; i<currencies.length; i++) {
    addCurrencyList.insertAdjacentHTML(
      "beforeend", 
      `<li data-currency=${currencies[i].abbreviation}>
        <img src=${currencies[i].flagURL} class="flag"><span>${currencies[i].abbreviation} - ${currencies[i].name}</span>
      </li>`
    );
  }
}

// Populate currencies list

function populateCurrenciesList() {
  for(let i=0; i<initiallyDisplayedCurrencies.length; i++) {
    const currency = currencies.find(c => c.abbreviation===initiallyDisplayedCurrencies[i]);
    if(currency) newCurrenciesListItem(currency);
  }
}


// Currencies list

function newCurrenciesListItem(currency) {
		
  // localStorage		
		var decimalnumber = localStorage.getItem('Decimal'); 
		var separator = localStorage.getItem('Separator'); 
  var codes = '"' + currency.abbreviation + '"' ;
  localStorage.setItem(currency.abbreviation, codes);

  if(currenciesList.childElementCount===0) {
    baseCurrency = currency.abbreviation;
    baseCurrencyAmount = 0;
			 $(".help_message").hide();
				console.log("delete .help_message");
  }
	
  addCurrencyList.querySelector(`[data-currency=${currency.abbreviation}]`).classList.add("disabled");
  const baseCurrencyRate = currencies.find(c => c.abbreviation===baseCurrency).rate;
  const exchangeRate = currency.abbreviation===baseCurrency ? 1 : (currency.rate/baseCurrencyRate).toFixed(decimalnumber).replace(".", separator);
  const inputValue = baseCurrencyAmount ? (baseCurrencyAmount*exchangeRate).toFixed(decimalnumber) : "";

  currenciesList.insertAdjacentHTML(
    "beforeend",
    `<li class="currency ${currency.abbreviation===baseCurrency ? "base-currency" : ""}" id=${currency.abbreviation}>
      <img src=${currency.flagURL} class="flag">
      <div class="info" lang="en-US">
        <p class="input"><span class="currency-symbol">${currency.symbol}</span><input placeholder="0" class="input_exchange" value=${inputValue}></p>
        <p class="currency-name">${currency.abbreviation} - ${currency.name}</p>
        <p class="base-currency-rate">1 ${baseCurrency} = ${exchangeRate} ${currency.abbreviation}</p>
      </div>
      <span class="close">&times;</span>
    </li>`
  );
}

fetch(dataURL)
  .then(res => res.json())
  .then(data => {
    data.rates["EUR"] = 1;
    currencies = currencies.filter(currency => data.rates[currency.abbreviation]);
    currencies.forEach(currency => currency.rate = data.rates[currency.abbreviation]);
    populateAddCyrrencyList();
    populateCurrenciesList();
  })
.catch(err => console.log(err));


// multiple-converter.js - jlozano developer Copyright (c) | jlozano.net/license  - Version 1.7 