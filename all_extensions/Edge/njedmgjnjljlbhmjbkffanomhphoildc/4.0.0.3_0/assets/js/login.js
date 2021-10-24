// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
document.addEventListener('DOMContentLoaded', function() {
    //LOGIN ANIMAtIONS
    if(document.getElementById('loginForm') != null ){

        const allLabels=document.querySelectorAll(".dynamicLabel")
        const allInput=document.querySelectorAll(".loginInput")
        for(let i=0;i<allLabels.length;i++){
            switch(i){
                case 0:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('email');//"Email";
                }, 800)

                break;
                case 1:
                setTimeout(function(e){
                    allInput[i].placeholder = i18next.t('password');//"Password";
                }, 800)

                break;
            }
            allInput[i].addEventListener("focus",() => {
                allInput[i].placeholder=""
                allLabels[i].style.animation="labelAppear 0.5s ease-out forwards"
            });


            allInput[i].addEventListener("blur",() => {
                if ( allInput[i].value == ''){
                    switch(i){
                        case 0:

                            allInput[i].placeholder = i18next.t('email');//"Email";


                        break;
                        case 1:

                            allInput[i].placeholder = i18next.t('password');//"Password";


                        break;
                    }
                    allLabels[i].style.animation="labelDisappear 0.5s ease-out forwards";
                }

            })

        }
        document.getElementById('email').focus();
    }
})