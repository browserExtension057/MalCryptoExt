// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  //Form animation
  if(document.getElementById('registerForm') != null ){
    const allLabels=document.querySelectorAll(".dynamicLabel")
    const allInput=document.querySelectorAll(".loginInput")
    for(let i=0;i<allLabels.length;i++){
        switch(i){
            case 0:
            setTimeout(function(e){
              allInput[i].placeholder = i18next.t('username');
            }, 700);

            break;
            case 1:
            setTimeout(function(e){
              allInput[i].placeholder = i18next.t('email');
            }, 700);

            break;
            case 2:
            setTimeout(function(e){
              allInput[i].placeholder = i18next.t('password');
            }, 700);

            break;
            case 3:
            setTimeout(function(e){
              allInput[i].placeholder= i18next.t('confirmPassword');
            }, 700);

            break;
        }
        allInput[i].addEventListener("focus",() => {
            allInput[i].placeholder=""
            allLabels[i].style.animation="labelAppear 0.5s ease-out forwards"
        });


        allInput[i].addEventListener("blur",() => {
          if ( allInput[i].value == '' ){
            switch(i){
              case 0:

                allInput[i].placeholder = i18next.t('username');


              break;
              case 1:

                allInput[i].placeholder = i18next.t('email');


              break;
              case 2:

                allInput[i].placeholder = i18next.t('password');


              break;
              case 3:

                allInput[i].placeholder= i18next.t('confirmPassword');


              break;
            }
            allLabels[i].style.animation="labelDisappear 0.5s ease-out forwards";
          }


      });

    }
    document.getElementById('username').focus();
  }
  // Buttons to add click
  const divCountryCode = document.getElementById('divCountryCode');

  // input search countries.
  const countrySearch = document.getElementById('countrySearch');
  const countryButton = document.getElementsByClassName('liCountry');
  let countries
  //regioncode read more under https://www.sitepoint.com/geo-location-2-lines-javascript/
  if (window.location.pathname == '/account.html'){
    try{
      let country_id;
      if (localStorage.getItem('countryId') == null){
        country_id = geoplugin_countryCode();
      }else{
        country_id = localStorage.getItem('countryId');
      }


      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            if (xmlHttp.responseText != null){
              countries = JSON.parse(xmlHttp.responseText);
              // console.log(countries[country_id])
              document.getElementById('countryExtension').setAttribute('data-language', country_id.toLowerCase());
              document.getElementById('countryExtension').textContent = '+' + countries[country_id];
              document.getElementById('flagCountry').className = '';
              document.getElementById('flagCountry').className = 'spanFlag flag-'+country_id;
            }


      }
      xmlHttp.open( "GET", window.location.origin + '/assets/country.json', true ); // false for synchronous request
      xmlHttp.send(null);

    }catch(err){
      // console.log(err);
      document.getElementById('countryExtension').setAttribute('data-language', 'en');
    }
  }


  if (countryButton != null){
    for (let i=0; i < countryButton.length; i++){
      countryButton[i].addEventListener('click', function(){
        const extension = this.getAttribute('data-extension');
        const flag = this.getElementsByClassName('spanFlag')[0].className;
        const countryId = this.getElementsByClassName('spanFlag')[0].classList[1].replace('flag-', '');
        localStorage.setItem('countryId', countryId);

        document.getElementById('countryExtension').setAttribute('data-language', countryId.toLowerCase());
        document.getElementById('countryExtension').textContent = '+' + countries[countryId];
        document.getElementById('flagCountry').className = '';
        document.getElementById('flagCountry').className = 'spanFlag flag-'+countryId;
        document.getElementById('countriesDiv').style.top = '600px';
        document.getElementById('countrySearch').value = '';
        const country = document.getElementsByClassName('liCountry');
        for (let i=0; i < country.length; i++){
          country[i].style.display = 'block';
        }
      });
    }
  }

  const code = document.getElementById('code');
  if (code != null){
    setTimeout(function(e){
      code.placeholder = i18next.t('verificationCode');
    }, 500);

    code.addEventListener('focus', function(e){
      removeErrors(this);
      this.placeholder = "";
      document.getElementById('verificationLabel').style.animation = "labelAppear 0.5s ease-out forwards";
    })
  }

  if (countrySearch != null){
    countrySearch.placeholder = i18next.t('search');
    countrySearch.addEventListener('keyup', function(e){
        let val = this.value;
        const country = document.getElementsByClassName('liCountry');
        for (let i=0; i < country.length; i++){
          if (country[i].getAttribute('data-countryname').toLowerCase().indexOf(val.toLowerCase()) == -1){
            if (country[i].getAttribute('data-extension').indexOf(val.toLowerCase()) == -1){
              country[i].style.display = 'none';
            }
          }else{
            country[i].style.display = 'block';
          }
        }
    });

    countrySearch.addEventListener('focus', function(e){
      countrySearch.placeholder = ""
      document.getElementById('labelInputLinkAccount').style.animation = "labelAppear 0.5s ease-out forwards"
    });

    countrySearch.focus();
  };


  // check params for country
  // setCountry();
  //check params for register if user has not phone number
  if (localStorage.getItem('socialLogin') == 'true'){
    setDataRegisterFromSocialLogin();
  }


});
// function to set the data to register the user when he tries to login with a social media network and doesnt have phoneNumber
function setDataRegisterFromSocialLogin(){
  const url_string = window.location.href
  const url = new URL(url_string);
  const username = url.searchParams.get("name");
  const useremail = url.searchParams.get("email");

  if (username != null && useremail != null){
    document.getElementById('username').value = username;
    document.getElementById('email').value = useremail;
    blockInputs('username', 'email');
    hidePasswordFields();
  }

}

function keepValuesFiled(){
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm_password = document.getElementById('confirm_password').value;

  if (username != ''){
    localStorage.setItem('username', username);
  }

  if (email != ''){
    localStorage.setItem('email', email);
  }

  if (password != ''){
    localStorage.setItem('password', password);
  }

  if (confirm_password != ''){
    localStorage.setItem('confirm_password', confirm_password);
  }
}

function hidePasswordFields(){
  document.getElementById('password').removeAttribute('required');
  document.getElementById('confirm_password').removeAttribute('required');

  document.getElementById('divPassword').style.display = 'none';
  document.getElementById('divConfirmPassword').style.display = 'none';
}

function blockInputs(input1, input2){
  document.getElementById(input1).setAttribute('disabled', true);
  document.getElementById(input2).setAttribute('disabled', true);
}



