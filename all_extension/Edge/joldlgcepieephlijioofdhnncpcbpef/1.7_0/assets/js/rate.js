// rate.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 

// Buttons

$('.bt_yes').click(function() {  
  $(".overlay").fadeOut(200);  
  $(".rate_extension").fadeOut(200); 
		localStorage.setItem('Ratepopup', 'hide'); 
});

$('.bt_no').click(function() { 
  $(".overlay").fadeOut(200);  
  $(".rate_extension").fadeOut(200); 
		localStorage.setItem('Ratepopup', 'hide');  
});

// Check localStorage

// Show modal 

if (localStorage.getItem("Ratepopup") === null) {
  $("#overlay_rate").delay(100).fadeIn(200);
  $(".rate_extension").delay(100).fadeIn(200);
}

// Hide modal 

if (localStorage.getItem('Ratepopup') == 'hide') { 
  $(".overlay").hide();
  $(".rate_extension").hide();
}

// rate.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 