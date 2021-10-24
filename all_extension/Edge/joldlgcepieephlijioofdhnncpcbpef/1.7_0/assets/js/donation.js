// donation.js - Copyright © 2019 Jaime Cuesta Lozano (jlozano developer). see copyright file - Version 1.7

// Buttons

// Open

$('.donate').on('click', function() {  	
  $("#overlay_donation").fadeIn(200);
  $('.donation').fadeIn(150);	
  $('.donation').removeClass('animated fadeOutDown delay-03s');
  $('.donation').addClass('animated fadeInUp delay-03s');	
});

// Close

$('.donation_close').on('click', function() {  	
  $("#overlay_donation").fadeOut(800);
  $('.donation').removeClass('animated fadeInUp delay-03s');
  $('.donation').addClass('animated fadeOutDown delay-03s');	
		$('.donation').hide();
});

// donation.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 