// theme.js - Copyright © 2019 Jaime Cuesta Lozano (jlozano developer). see copyright file - Version 1.7 


$(document).ready(function() {


// Theme

var darkmode = function () {	
  localStorage.setItem('Theme', 'dark'); 
		$('head').append('<link rel="stylesheet" id="theme_dark" href="assets/css/dark.css" />');
  $("#theme_light").remove();
  $("#theme_light").remove();
		$("#theme_light").remove();
		$("#theme_light").remove();
		$("#theme_light").remove();
		$("#theme_light").remove();
  $(".on_light").hide();
  $(".on_dark").show();	
  $("#light").show();
  $("#dark").hide();
		$(".bt_light").show();	
  $(".bt_dark").hide();		
},

lightmode = function () {	
  localStorage.setItem('Theme', 'light');
		$('head').append('<link rel="stylesheet" id="theme_light" href="assets/css/light.css" />');
  $("#theme_dark").remove();
  $("#theme_dark").remove();
		$("#theme_dark").remove();
		$("#theme_dark").remove();
		$("#theme_dark").remove();
		$("#theme_dark").remove();
  $(".on_dark").hide();
  $(".on_light").show();
  $("#dark").show()	
  $("#light").hide();	
		$(".bt_dark").show()	
  $(".bt_light").hide();		
};

if (localStorage.getItem('Theme') == 'light') {
   lightmode(); 		
} 

else if (localStorage.getItem('Theme') == 'dark') {
   darkmode(); 
}

// Dark button 

$('.dark').on('click', function() {darkmode();});
$('#dark_config').on('click', function() {darkmode();});

// Light button 

$('.light').on('click', function() {lightmode();});
$('#light_config').on('click', function() {lightmode();});


});


// theme.js - Copyright © 2019 Jaime Cuesta Lozano (jlozano developer). see copyright file - Version 1.7