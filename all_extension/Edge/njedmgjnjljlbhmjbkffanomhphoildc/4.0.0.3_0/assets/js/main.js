// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

document.addEventListener('DOMContentLoaded', function() {

  if (typeof getBrowser != 'undefined'){
    checkBrowser();
  }

  var buttonMenu = document.getElementById('buttonMenu');
  // var closeMenu = document.getElementById('buttonCloseMenu');

  // onClick's logic below:
  if (buttonMenu != null){
    buttonMenu.addEventListener('click', function() {
      if (this.getAttribute('data-menu') == 'open'){
        openNav();
        this.setAttribute('data-menu', 'close');
      }else if (this.getAttribute('data-menu') == 'close'){
        closeNav();
        this.setAttribute('data-menu', 'open');
      }

    });
  }

  /* if (closeMenu != null){
    closeMenu.addEventListener('click', function() {
      closeNav();
    });
  }*/

});

function openNav(){
  document.getElementById("mySidenav").style.width = "150px";
  document.getElementById("mySidenav").style.borderRight = "1px solid #dfdfdf";
  document.getElementById("mainContentAirtime").style.marginLeft = "150px";
 /*  document.getElementById("buttonCloseMenu").style.display = "block";
  document.getElementById('buttonMenu').style.display="none"; */

  if (document.getElementById('divBuyTubes') != null ){
    document.getElementById('divBuyTubes').style.right="-141px";
  }

  if (document.getElementById('divLogout') != null ){
    document.getElementById('divLogout').style.right="-150px";
  }


  document.getElementById('buttonMenu').classList.add('toggled');

}

function closeNav(){
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mainContentAirtime").style.marginLeft = "0";
/*   document.getElementById("buttonCloseMenu").style.display = "none";
  document.getElementById('buttonMenu').style.display="block"; */
  document.getElementById("mySidenav").style.borderRight = "none";
  if (document.getElementById('divBuyTubes') != null ){
    document.getElementById('divBuyTubes').style.right="9px";
  }

  if (document.getElementById('divLogout') != null ){
    document.getElementById('divLogout').style.right="0";
  }
  document.getElementById('buttonMenu').classList.remove('toggled');
}


  function checkBrowser(){
    var browser = getBrowser().browser;
    if (browser == 'Chrome'){
      document.getElementsByTagName('body')[0].classList.add('chrome_browser');
    }else if(browser == 'Firefox'){
      document.getElementsByTagName('body')[0].classList.add('firefox_browser');
    }else if(browser == 'Safari'){
      document.getElementsByTagName('body')[0].classList.add('safari_browser');
    }else if(browser == 'Microsoft Edge'){
      document.getElementsByTagName('body')[0].classList.add('edge_browser');
    }
  }