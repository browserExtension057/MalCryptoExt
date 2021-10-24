// decimals.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 

// Modal 

// Open modal
	
$("#decimal_bt").click(function(){
	 $("#decimalmodal").fadeIn(100);
		$('#decimalmodal').animate({left:'0%'}, 200, 'swing', function() {});	
});

// Close modal

$("#decimalclose").click(function(){
 $('#decimalmodal').animate({left:'+=100%'}, 200, 'swing', function() {});	
});

// Save 

savedecimal = function () {
 $(".ticksave").fadeIn(150);
 $(".ticksave").delay(500).fadeOut(200);
};

// Decimal settings

$(document).ready(function() {
	
	
// Default 

if (localStorage.getItem("Decimal") === null) {	
   localStorage.setItem('Decimal', '2');	
			localStorage.setItem('Separator', '.');	
}


// point

point = function () {
  localStorage.setItem('Separator', '.');
		$('#point').addClass('separator_active');	
		$('#comma').removeClass('separator_active');
		$('.digits_point').show();	
		$('.digits_comma').hide();			
};


// comma

comma = function () {
  localStorage.setItem('Separator', ',');
		$('#comma').addClass('separator_active');	
		$('#point').removeClass('separator_active');	
		$('.digits_point').hide();	
		$('.digits_comma').show();						
};


// d_0

d_0 = function () {
  localStorage.setItem('Decimal', '0');
		$('#separatortype').text(".");
		$('#decimalselected').text("0");
		$('#digits_point').text("1");
		$('#digits_comma').text("1");
		$('#d_0').addClass('active');	
		$('#d_1').removeClass('active');		
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');		
};

// d_1

d_1 = function () {
  localStorage.setItem('Decimal', '1');
		$('#decimalselected').text("1");
		$('#digits_point').text("1.0");
		$('#digits_comma').text("1,0");
		$('#d_1').addClass('active');
		$('#d_0').removeClass('active');				
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');						
};

// d_2

d_2 = function () {
  localStorage.setItem('Decimal', '2');
		$('#decimalselected').text("2");
		$('#digits_point').text("1.00");
		$('#digits_comma').text("1,00");
		$('#d_2').addClass('active');
		$('#d_0').removeClass('active');				
		$('#d_1').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');	
};

// d_3

d_3 = function () {
  localStorage.setItem('Decimal', '3');
		$('#decimalselected').text("3");
		$('#digits_point').text("1.000");
		$('#digits_comma').text("1,000");
		$('#d_3').addClass('active');
		$('#d_0').removeClass('active');		
		$('#d_1').removeClass('active');			
		$('#d_2').removeClass('active');	
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');			
};

// d_4

d_4 = function () {
  localStorage.setItem('Decimal', '4');
		$('#decimalselected').text("4");
		$('#digits_point').text("1.0000");
		$('#digits_comma').text("1,0000");
		$('#d_4').addClass('active');
		$('#d_0').removeClass('active');	
		$('#d_1').removeClass('active');				
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');			
};

// d_5

d_5 = function () {
  localStorage.setItem('Decimal', '5');
		$('#decimalselected').text("5");
		$('#digits_point').text("1.00000");
		$('#digits_comma').text("1,00000");
		$('#d_5').addClass('active');
		$('#d_0').removeClass('active');	
		$('#d_1').removeClass('active');				
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_6').removeClass('active');	
		$('#d_7').removeClass('active');				
};

// d_6

d_6 = function () {
  localStorage.setItem('Decimal', '6');
		$('#decimalselected').text("6");
		$('#digits_point').text("1.000000");
	 $('#digits_comma').text("1,000000");
		$('#info').text("6");
		$('#d_6').addClass('active');
		$('#d_0').removeClass('active');	
		$('#d_1').removeClass('active');				
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_7').removeClass('active');			
};

// d_7

d_7 = function () {
  localStorage.setItem('Decimal', '7');
		$('#decimalselected').text("7");
		$('#digits_point').text("1.0000000");
		$('#digits_comma').text("1,0000000");
		$('#info').text("7");
		$('#d_7').addClass('active');
		$('#d_0').removeClass('active');	
		$('#d_1').removeClass('active');				
		$('#d_2').removeClass('active');	
		$('#d_3').removeClass('active');
		$('#d_4').removeClass('active');	
		$('#d_5').removeClass('active');	
		$('#d_6').removeClass('active');		
};


// Buttons

$("#point").click(function(){localStorage.setItem('Separator', '.'); point(); savedecimal();});	
$("#comma").click(function(){localStorage.setItem('Separator', ','); comma(); savedecimal();});	
$("#d_0").click(function(){localStorage.setItem('Decimal', '0'); d_0(); savedecimal();});	
$("#d_1").click(function(){localStorage.setItem('Decimal', '1'); d_1(); savedecimal();});	
$("#d_2").click(function(){localStorage.setItem('Decimal', '2'); d_2(); savedecimal();});	
$("#d_3").click(function(){localStorage.setItem('Decimal', '3'); d_3(); savedecimal();});	
$("#d_4").click(function(){localStorage.setItem('Decimal', '4'); d_4(); savedecimal();});	
$("#d_5").click(function(){localStorage.setItem('Decimal', '5'); d_5(); savedecimal();});	
$("#d_6").click(function(){localStorage.setItem('Decimal', '6'); d_6(); savedecimal();});	
$("#d_7").click(function(){localStorage.setItem('Decimal', '7'); d_7(); savedecimal();});	

// Check localStorage

if (localStorage.getItem('Separator') == '.') { point();}
if (localStorage.getItem('Separator') == ',') { comma();}
if (localStorage.getItem('Decimal') == '0') { d_0();}
if (localStorage.getItem('Decimal') == '1') { d_1();}
if (localStorage.getItem('Decimal') == '2') { d_2();}
if (localStorage.getItem('Decimal') == '3') { d_3();}
if (localStorage.getItem('Decimal') == '4') { d_4();}
if (localStorage.getItem('Decimal') == '5') { d_5();}
if (localStorage.getItem('Decimal') == '6') { d_6();}
if (localStorage.getItem('Decimal') == '7') { d_7();}

});
	
// decimals.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 