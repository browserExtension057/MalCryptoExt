// tooltip.js - Copyright © 2019 Jaime Cuesta Lozano (jlozano developer). see copyright file - Version 1.0


// Tooltip document ready 

$(document).ready(function() {
	
  $.minimalTips();
		
});

// Tooltip config  

$.minimalTips = function(){

  var xOffset = 20;
  var yOffset = 20;

  var posX;
  var posY;

  var largura;
  var altura;

// Position
		
function setPos(e){
	
  largura = $("#tooltip").width();
  altura = $("#tooltip").height();

  posX = ((e.pageX + largura + (yOffset*2)) > $(window).width()) ? e.pageX - (largura + 50) + yOffset : e.pageX + yOffset;

  if((e.pageY + altura + (xOffset*2)) > $(window).height()){
  
  posY = e.pageY - (altura + 40) + xOffset;
		
  $("#tooltip").removeClass('arrow-up');
  $("#tooltip").addClass('arrow-down');
		
  } 
		else{
  posY = e.pageY + xOffset;
		
  $("#tooltip").removeClass('arrow-down');
  $("#tooltip").addClass('arrow-up');
		
  }

  $("#tooltip")
				
  .css("top", posY + "px")
  .css("left", posX + "px")						
  .fadeIn(200); 
		
}

// When the cursor is over the element
		
$(".tooltip").hover(function(e){

  if (this.title != "") { this.t = this.title; }
				
    else { this.t = "Default Tooltip"; } 

    this.title = "";

    $("body").append("<div id='tooltip'>"+ this.t +"</div>");

    setPos(e);

},

function(){
			
  this.title = this.t;
  $("#tooltip").remove();
		
});

  // Moving the cursor
		
  $(".tooltip").mousemove(function(e){ setPos(e); });

};

// November 2019

// tooltip.js - Copyright © 2019 Jaime Cuesta Lozano (jlozano developer). see copyright file - Version 1.0