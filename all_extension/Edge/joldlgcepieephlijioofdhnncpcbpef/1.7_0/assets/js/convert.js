// convert.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 

// Open popup

var Popup = localStorage.getItem("Popup");

$(".popup").on('click', function () {
	var myWidth = 400;
 var myHeight = 600;
 var left = (screen.width - myWidth) / 1.05;
 var top = 60;
 window.open(location.href, "popUpWindow",'scrollbars=no,resizable=no,titlebar=no,toolbar=no,menubar=no,location=no,directories=no,status=yes,width=' + myWidth + ',height=' + myHeight + ',top=' + top + ', left=' + left);
	// window.close();
});

// Save amount if change input value
					
$('.importe').change(function () {
    localStorage[$(this).attr('name')] = $(this).val();
});

// Load amount saved 

$(document).ready(function () {
    function init() {
					if (localStorage["importe"]) {
									$('#amount').val(localStorage["importe"]);
					}		
    }		
	 init();	
});

// Button Swap currencies

$('#swap').on('click', function () {			
	var Currency_1 = localStorage.getItem("Currency_1");
	var Currency_2 = localStorage.getItem("Currency_2");
	localStorage.setItem('Currency_1', Currency_2);	
	localStorage.setItem('Currency_2', Currency_1);	
});

// Swap currencies on press space bar

swapcurrencies = function () {
	var Currency_1 = localStorage.getItem("Currency_1");
	var Currency_2 = localStorage.getItem("Currency_2");
	localStorage.setItem('Currency_1', Currency_2);	
	localStorage.setItem('Currency_2', Currency_1);	
 window.top.location.reload();
};

// spacebar key 
$(document).on('keypress',function(e) {
  if (e.which == 32){
			swapcurrencies();
  }
});

// Active selects currencies


// Currency_1

$("#fromDropdown").ddslick({
    data: ddData1,
    width: 300,
    height: 200,
    imagePosition: "left",
    selectText: tag1,
    onSelected: function selection(data) {
				console.log(data);
    selFrom = data.selectedData.value;
				localStorage.setItem('Currency_1', data.selectedData.value);
    }
});

// Currency_2

$("#toDropdown").ddslick({
    data: ddData2,
    width: 300,
    height: 200,
    imagePosition: "left",
    selectText: tag1,
    onSelected: function(data) {
				console.log(data);
    selTo = data.selectedData.value;
				localStorage.setItem('Currency_2', data.selectedData.value);
    }
});

// Button convert

document.getElementById("convert").addEventListener('click', convertCurrency);

// Convert currency on Enter key

$(document).on('keypress',function(e) {
  if(e.which == 13) {
				convertCurrency();
  }
});

// Convert currency

function convertCurrency() {
	   var decimalnumber = localStorage.getItem('Decimal');
				var separator = localStorage.getItem('Separator');  
    var fromCurrency = selFrom;
    var toCurrency = selTo;
    var xmlhttp = new XMLHttpRequest();
			 var url = "https://api.exchangerate-api.com/v4/latest/EUR";

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = xmlhttp.responseText;
            var jsResult = JSON.parse(result);
            $('.bt_send_money').css('display','block');
        if (selFrom === "EUR") {
            oneUnit = jsResult.rates[toCurrency];
        }							
								else if (selTo === "EUR") {
            oneUnit = 1/jsResult.rates[fromCurrency];
        }
								else 
            var oneUnit = jsResult.rates[toCurrency]/jsResult.rates[fromCurrency];
            var amount = document.getElementById('amount').value;
            var res = document.getElementById('result');
            var calculation = oneUnit*amount;
            if(amount == 0){
            res.innerHTML = tag2;
												$('.bt_send_money').css('display','none');
            }
				   else {
        if (selTo == selFrom) {
            res.textContent = tag3;
								}
        else { 
            res.textContent = amount.replace(".", separator) + " " + selFrom + " = " + calculation.toFixed(decimalnumber).replace(".", separator) + " " + selTo;
												}
        }
    }
}
}

// convert.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 