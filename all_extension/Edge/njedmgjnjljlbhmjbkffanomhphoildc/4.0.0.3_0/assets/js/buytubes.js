// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';
// ^^^ You guys know that this needs to be the VERY FIRST line for it to work, right? ~F

const disableSection = (type, message) => {
    let hideElem;
    let showElem;
    switch (type) {
        case 'wire':
            hideElem = document.getElementById('bankTransferForm');
            showElem = document.getElementById('wireMaintMsg');
            break;
        case 'crypto':
            hideElem = document.getElementById('buyWithCryptoForm');
            showElem = document.getElementById('cryptoMaintMsg');
            break;
        case 'cc':
            hideElem = document.getElementById('creditCarForm');
            showElem = document.getElementById('ccMaintMsg');
            break;
    }
    if (hideElem && showElem) {
        hideElem.classList.add('hidden');
        showElem.innerHTML = '<div class="divCircleIcon"><div class="whiteDiv"><i class="mbsc-ic mbsc-ic-ion-alert iconMaintenance"></i></div></div> <br>' + message;
        showElem.classList.remove('hidden');
    }
};

const getBuyTubeStatus = async () => {

    try {
        document.getElementById('loaderBuyWire').classList.remove('hidden');
        document.getElementById('loaderBuyCrypto').classList.remove('hidden');
        document.getElementById('loaderBuyCC').classList.remove('hidden');

        const status = await firebaseXhr(functionBaseURL + '/app/buyTubesStatus');
        console.log('getBuyTubeStatus', status);
        if (status.wire && status.wire.maintenance) disableSection('wire', status.wire.message || 'Under Maintenance');
        if (status.crypto && status.crypto.maintenance) disableSection('crypto', status.crypto.message || 'Under Maintenance');
        if (status.cc && status.cc.maintenance) disableSection('cc', status.cc.message || 'Under Maintenance');

        document.getElementById('loaderBuyWire').classList.add('hidden');
        document.getElementById('loaderBuyCrypto').classList.add('hidden');
        document.getElementById('loaderBuyCC').classList.add('hidden');
    } catch (err) {
        console.error('getBuyTubeStatus Error', err);
        const errorMessage = 'Failed to get maintenance status.<br>Please try again later.';
        disableSection('wire', errorMessage);
        disableSection('crypto', errorMessage);
        disableSection('cc', errorMessage);
    }
};

const getCountryList = async () => {

    try {
        const countryList = await firebaseXhr(functionBaseURL + '/app/getCountryList');
        if ( countryList.success ){
            countryList.countries.forEach((country)=>{
                const option = document.createElement('option');
                option.setAttribute('value', country.code);
                if ( country.disabledForCC ){
                    option.setAttribute('data-disabledcc', true);
                }else{
                    option.setAttribute('data-disabledcc', false);
                }
                option.innerText = country.name;
                document.getElementById('selectCountry').appendChild(option)
                document.getElementById('selectCountryExtraData').appendChild(option)
            })
        }
        document.getElementById('selectCountry').addEventListener('change', () => {
            if ( document.getElementById('selectCountry').selectedOptions[0].getAttribute('data-disabledcc') == 'true' ){
                document.getElementById('payWithCC').setAttribute('disabled', true);
                document.getElementById('noteBuyCCForm').classList.remove('displayNone');
            }else{
                document.getElementById('payWithCC').removeAttribute('disabled');
                document.getElementById('noteBuyCCForm').classList.add('displayNone');
            }
        })


        document.getElementById('selectCountryExtraData').addEventListener('change', () => {
          console.log('Change Here !!!! ')
        })

    } catch (err) {
        console.error('getCountryList Error', err);

    }
};
const fillCurrentPrice = async (currency) => {
    let currencySymb;
    switch (currency){
        case 'USD':
          currencySymb = '&dollar;'
        break;
        case 'AUD':
          currencySymb = 'A&dollar;'
        break;
        case 'GBP':
          currencySymb = '&pound;'
        break;
        case 'NZD':
          currencySymb = 'N&dollar;'
        break;
        case 'EUR':
          currencySymb = '&euro;'
        break;
      }
    let rate;
    if ( localStorageEx.get('coinRate') == null || currency != localStorageEx.get('coinRate').currency){
        const priceToken = await getConversionRateToken(currency);
        localStorageEx.set('coinRate', {rate: priceToken.rate, currency: currency}, 900);
        rate = priceToken.rate;
    }else{
        rate = localStorageEx.get('coinRate').rate;
    }

    document.getElementById('currentPriceDiv').classList.remove('displayNone');
    document.getElementById('loaderCurrentPrice').classList.add('displayNone');
    document.getElementById('spanCurrentPrice').innerHTML = rate.toFixed(5) + ' ' + currencySymb;
}
const fillCurrencies = (element, type) => {
    const inputSelectCoin = document.getElementById(element);
    const currencies = localStorageEx.get('currencies');
    currencies.forEach((currency) => {
        const option = document.createElement('option');
        switch (type){
            case 'wire':
                console.log('Wire !!!!! ', currency)
                if ( currency == 'EUR' || currency === 'GBP'){
                    option.value = currency;
                    option.innerText = currency;
                    inputSelectCoin.appendChild(option);
                }
            break;
            case 'cc':
                if ( currency !== 'NZD' && currency !== 'AUD'){
                    option.value = currency;
                    option.innerText = currency;
                    inputSelectCoin.appendChild(option);
                }
            break;
        }

    })
    inputSelectCoin.value = localStorage.getItem('currencySelected');
    const event = new Event('change');
    inputSelectCoin.dispatchEvent(event);
}

const saveUserExtraData = async (data) => {
    try{
        const token = await getFirebaseToken();
        const url = functionBaseURL + '/app/saveUserExtraData';
        var data = 'userExtraData=' + encodeURIComponent(JSON.stringify(data));
        sendPostRequest(url, data, null, token, async (user, response) => {
            const result = JSON.parse(response);
            if (result.result == 'Success' ) {
                await updateCustomClaims();
                showHideButtonLoader('submitExtraData', 'hideLoader');
                document.getElementById('bankTransferForm').classList.remove('hidden');
                document.getElementById('userExtraData').classList.add('hidden');
                showModalTerms('wire');
            }else{
                showModalErrorExtraData();
            }

        });
    }catch(error){
        console.log('Error saving user extra data', error)
    }
}

const getUserKYCData = async () => {
    const result = await firebaseXhr(functionBaseURL + '/app/getUserKYCName');
    if ( result.success && result.data ){
        const userName = result.data.split(' ');
        document.getElementById('first_name').value = userName[0] || '';
        document.getElementById('last_name').value = userName[1] || '';

    }
}

document.addEventListener('DOMContentLoaded', function () {
    getBuyTubeStatus();
    getUserKYCData();
    getCountryList();
    getAvailableCurrencies();
    if ( localStorageEx.get('buyTubesInfo') != null ){
        setDataByTubes(localStorageEx.get('buyTubesInfo'))
    }


    if (document.getElementById('creditCarForm') != null) {
        const allLabels = document.querySelectorAll(".labelBank")
        const allInput = document.querySelectorAll(".bankInput")
        console.log('All ', allLabels.length)
        for (let i = 0; i < allLabels.length; i++) {
            switch (i) {
                case 0:
                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('firstName');
                    }, 800)

                    break;
                case 1:
                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('lastName');
                    }, 800)

                    break;
                case 2:
                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('cardNumber');
                    }, 800)

                    break;
                case 3:
                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('expirtyMonth');
                    }, 800);
                    break;
                case 4:

                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('expirityYear');
                    }, 800)

                    break;
                case 5:

                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('cvv');
                    }, 800)

                    break;
                case 6:

                    setTimeout(function (e) {
                        allInput[i].placeholder = i18next.t('addressCard');
                    }, 800)

                    break;
                case 7:

                setTimeout(function (e) {
                    allInput[i].placeholder = i18next.t('city');
                }, 800)
                    break;
                case 8:


                setTimeout(function (e) {
                    allInput[i].placeholder = i18next.t('zip');
                }, 800)

                    break;

            }
            allInput[i].addEventListener("focus", () => {
                removeErrors(allInput[i])
                allInput[i].placeholder = ""
                allLabels[i].style.animation = "labelAppear 0.5s ease-out forwards"
            });


            allInput[i].addEventListener("blur", () => {
                setLocalStorageBuyTubesData();
                if (allInput[i].value == '') {
                    switch (i) {
                        case 0:
                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('firstName');
                            }, 800)

                            break;
                        case 1:
                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('lastName');
                            }, 800)

                            break;
                        case 2:
                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('cardNumber');
                            }, 800)

                            break;
                        case 3:
                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('expirtyMonth');
                            }, 800);
                            break;
                        case 4:

                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('expirityYear');
                            }, 800)

                            break;
                        case 5:

                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('cvv');
                            }, 800)

                            break;
                        case 6:

                            setTimeout(function (e) {
                                allInput[i].placeholder = i18next.t('addressCard');
                            }, 800)

                            break;
                        case 7:

                        setTimeout(function (e) {
                            allInput[i].placeholder = i18next.t('city');
                        }, 800)

                            break;
                        case 8:

                        setTimeout(function (e) {
                            allInput[i].placeholder = i18next.t('zip');
                        }, 800)
                            break;

                    }
                    allLabels[i].style.animation = "labelDisappear 0.5s ease-out forwards";
                }

            })

        }
    }


    const firstNameInfo = document.getElementById('firstNameInfo');
    if ( firstNameInfo != null ){
        firstNameInfo.addEventListener('mouseenter', () => {
            document.getElementById('first_nameTooltip').style.visibility = 'visible'
            document.getElementById('first_nameTooltip').style.opacity = '1';
        });
        firstNameInfo.addEventListener('mouseleave', () => {
            document.getElementById('first_nameTooltip').style.visibility = 'hidden';
            document.getElementById('first_nameTooltip').style.opacity = '0'
        })
    }
    const lastNameInfo = document.getElementById('lastNameInfo');
    if ( lastNameInfo != null ){
        lastNameInfo.addEventListener('mouseenter', () => {
            document.getElementById('last_nameTooltip').style.visibility = 'visible'
            document.getElementById('last_nameTooltip').style.opacity = '1';
        });
        lastNameInfo.addEventListener('mouseleave', () => {
            document.getElementById('last_nameTooltip').style.visibility = 'hidden';
            document.getElementById('last_nameTooltip').style.opacity = '0'
        })
    }
    const arrowBackPayment = document.getElementById('arrowBackPayment');
    if ( arrowBackPayment != null ){
        arrowBackPayment.addEventListener('click', function(e){
            document.getElementById('arrowBackPayment').classList.add('displayNone');
            document.getElementById('cryptoBuyBtn').classList.remove('displayNone');
            document.getElementById('wireBuyBtn').classList.remove('displayNone');
            document.getElementById('creditBuyBtn').classList.remove('displayNone');
            document.getElementById('apps-tab-wireTransfer').classList.add('displayNone');
            document.getElementById('apps-tab-creditcard').classList.add('displayNone');
            document.getElementById('apps-tab-buyWithcrypto').classList.add('displayNone');
            document.getElementById('acceptedCryptos').classList.remove('displayNone');
            document.getElementById('acceptedCards').classList.remove('displayNone');
        })
    }
    const wireBuyBtn = document.getElementById('wireBuyBtn');
    if ( wireBuyBtn != null ){
        wireBuyBtn.addEventListener('click', function(e){
            checkVerifyStatus('wire');
        });
    }

    const creditBuyBtn = document.getElementById('creditBuyBtn');
    if ( creditBuyBtn != null ){
        creditBuyBtn.addEventListener('click', function(e){
            checkVerifyStatus('cc');

        });
    }


    const form = document.getElementById('userExtraData');
    if( form != null ){
        form.addEventListener('change', () => {
            if ( form.checkValidity() ){
                document.getElementById('submitExtraData').removeAttribute('disabled');
            }
        });

        const allLabelsUserExtraData = document.querySelectorAll(".userExtraDataLabelBank")
        const allInputUserExtraData = document.querySelectorAll(".userExtraDataInput");
        for (let i = 0; i < allLabelsUserExtraData.length; i++) {
            switch (i) {
                case 0:
                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('fullName');
                    }, 800)

                    break;
                case 1:
                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('phoneNumberWire');
                    }, 800)

                    break;
                case 2:
                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('birthday');
                    }, 800)

                    break;
                // case 3:
                //     setTimeout(function (e) {
                //         allInputUserExtraData[i].placeholder = i18next.t('countryCode');
                //     }, 800);
                //     break;
                case 3:

                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('city');
                    }, 800)

                    break;
                case 4:

                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('street');
                    }, 800)

                    break;
                case 5:

                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('postalCode');
                    }, 800)

                    break;
                // case 6:

                // setTimeout(function (e) {
                //     allInputUserExtraData[i].placeholder = i18next.t('documentType');
                // }, 800)
                //     break;
                case 6:


                setTimeout(function (e) {
                    allInputUserExtraData[i].placeholder = i18next.t('documentNumber');
                }, 800)

                break;
                case 7:
                    setTimeout(function (e) {
                        allInputUserExtraData[i].placeholder = i18next.t('documentIssuedBy');
                    }, 800)
                break;

            }
            allInputUserExtraData[i].addEventListener("focus", () => {
                removeErrors(allInputUserExtraData[i])
                allInputUserExtraData[i].placeholder = ""
                allLabelsUserExtraData[i].style.animation = "labelAppear 0.5s ease-out forwards"
            });


            allInputUserExtraData[i].addEventListener("blur", () => {
                if (allInputUserExtraData[i].value == '') {
                    switch (i) {
                        case 0:
                            if ( allInputUserExtraData[i].value != '' ){
                                document.getElementById('submitExtraData').removeAttribute('disabled');
                            }
                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('fullName');
                            }, 800)

                            break;
                        case 1:
                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('phoneNumberWire');
                            }, 800)

                            break;
                        case 2:
                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('birthday');
                            }, 800)

                            break;
                        // case 3:
                        //     setTimeout(function (e) {
                        //         allInputUserExtraData[i].placeholder = i18next.t('countryCode');
                        //     }, 800);
                        //     break;
                        case 3:

                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('city');
                            }, 800)

                            break;
                        case 4:

                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('street');
                            }, 800)

                            break;
                        case 5:

                            setTimeout(function (e) {
                                allInputUserExtraData[i].placeholder = i18next.t('postalCode');
                            }, 800)

                            break;
                        // case 6:

                        // setTimeout(function (e) {
                        //     allInputUserExtraData[i].placeholder = i18next.t('documentType');
                        // }, 800)

                        //     break;
                        case 6:

                        setTimeout(function (e) {
                            allInputUserExtraData[i].placeholder = i18next.t('documentNumber');
                        }, 800)
                            break;
                        case 7:

                        setTimeout(function (e) {
                            allInputUserExtraData[i].placeholder = i18next.t('documentIssuedBy');
                        }, 800)
                                break;

                    }
                    allLabelsUserExtraData[i].style.animation = "labelDisappear 0.5s ease-out forwards";
                }

            })

        }
    }

    const checkVerifyStatus = async (buyWith) => {
        try {
          const claims = await getFirebaseClaims();
          if (!claims.hasKYC) {
            showModalUserNotVerified();
          } else {
              if ( buyWith === 'cc'){
                fillCurrencies('selectCoin', 'cc');
                document.getElementById('cryptoBuyBtn').classList.add('displayNone');
                document.getElementById('acceptedCryptos').classList.add('displayNone');
                document.getElementById('wireBuyBtn').classList.add('displayNone');
                document.getElementById('acceptedCards').classList.add('displayNone');
                document.getElementById('apps-tab-creditcard').classList.remove('displayNone');
                document.getElementById('arrowBackPayment').classList.remove('displayNone');
              }else if ( buyWith === 'wire'){
                const currency = localStorage.getItem('currencySelected') || 'USD';
                fillCurrentPrice(currency);
                fillCurrencies('selectCurrencyCrypto', 'wire');
                document.getElementById('cryptoBuyBtn').classList.add('displayNone');
                document.getElementById('acceptedCryptos').classList.add('displayNone');
                document.getElementById('creditBuyBtn').classList.add('displayNone');
                document.getElementById('acceptedCards').classList.add('displayNone');
                document.getElementById('apps-tab-wireTransfer').classList.remove('displayNone');
                document.getElementById('arrowBackPayment').classList.remove('displayNone');
              }

          }
        } catch (err) {
          console.log('Error getting user status ==> ', err)
        }
      }
      const showModalUserNotVerified = () => {
        const instanceModalUserNotVerified = mobiscroll.popup('#modalUserNotVerified', {
          display: 'center',
          closeOnOverlayTap: false,
          cssClass: 'popUpResendEmail',
          buttons: [{
            text: i18next.t('close'),
            cssClass: 'buttonModdal',
            handler: function (event, inst) {
              inst.hide();
            }
          }],
          onBeforeShow: function (ev, inst) {

          }
        });
        instanceModalUserNotVerified.show();
      }

    const cryptoBuyBtn = document.getElementById('cryptoBuyBtn');
    if ( cryptoBuyBtn != null ){
        cryptoBuyBtn.addEventListener('click', function(e){
            document.getElementById('wireBuyBtn').classList.add('displayNone');
            document.getElementById('acceptedCryptos').classList.add('displayNone');
            document.getElementById('creditBuyBtn').classList.add('displayNone');
            document.getElementById('acceptedCards').classList.add('displayNone');
            document.getElementById('apps-tab-buyWithcrypto').classList.remove('displayNone');
            document.getElementById('arrowBackPayment').classList.remove('displayNone');

        });
    }
    const createTransferOrder = document.getElementById('createTransferOrder');
    if (createTransferOrder != null) {
        createTransferOrder.addEventListener('click', async (e) =>{
            var form = document.getElementById("paypalForm"),
                addedToFields = false;
            let createOrder = true;
            const claims = await getFirebaseClaims();
            if ( !claims.hasPhone ){
                if (!claims.verified){
                    createOrder = false;
                }else{
                    createOrder = true;
                }
            }

            if (validateForm(e, form, addedToFields)) {
                if (createOrder === true) {
                    showHideButtonLoader('createTransferOrder', 'showLoader');
                    try {
                        const claims = await getFirebaseClaims();
                        if ( claims.userWireCustomeId){
                            showModalTerms('wire');
                        }else{
                            showHideButtonLoader('createTransferOrder', 'hideLoader');
                            document.getElementById('bankTransferForm').classList.add('hidden');
                            document.getElementById('userExtraData').classList.remove('hidden')
                        }
                        // const token = await getFirebaseToken();
                        // const url = functionBaseURL + '/app/checkUserKYC';
                        // sendGetRequest(url, token, function (user, response) {

                        //   const result = JSON.parse(response);
                        //   if (result.success) {
                        //     if ( result.data ){
                        //         showModalTerms('wire');
                        //     }else{
                        //        showHideButtonLoader('createTransferOrder', 'hideLoader');
                        //        document.getElementById('bankTransferForm').classList.add('hidden');
                        //        document.getElementById('userExtraData').classList.remove('hidden')
                        //     }

                        //   } else if (result.error) {
                        //     return false;
                        //     //showModalErrorBuyingWithCC(result.message);
                        //   }
                        // });
                      } catch (err) {
                        console.error('Error starting buy with cc process ', err);
                      }

                } else {
                    showPopupVerificationPhone();
                }
            }
        })
    }

    const payWithCryptoButton = document.getElementById('payWithCryptoButton');
    if (payWithCryptoButton != null) {
        payWithCryptoButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showModalTerms('crypto')
            // startBuyCryptoProcess(e);
        })
    }



    const preferredFiat = localStorage.getItem('preferredFiat');
    if (preferredFiat) {
        document.getElementById('selectCoin').value = preferredFiat;
        document.getElementById('selectCurrencyCrypto').value = preferredFiat;
        const evt = new Event('change');
        document.getElementById('selectCoin').dispatchEvent(evt);
        document.getElementById('selectCurrencyCrypto').dispatchEvent(evt);
    }

    const selectCurrencyBuyCrypto = document.getElementById('selectCurrencyBuyCrypto');
    if (selectCurrencyBuyCrypto != null) {

        // setCurrencyOnSelect('buyWithCryptoForm', 'selectCurrencyBuyCrypto');
        let currency;
        if (localStorage.getItem('cryptoCurrencySelected') != null) {
            currency = localStorage.getItem('cryptoCurrencySelected');
        } else {
            currency = 'BTC';
        }

        document.getElementById('selectCurrencyBuyCrypto').value = currency;
        mobiscroll.form('#buyWithCryptoForm').controls.selectCurrencyBuyCrypto._setText(currency);

        selectCurrencyBuyCrypto.addEventListener('change', debounce(function (e) {
            document.getElementById('tubeInput').value = '';
            // localStorage.setItem('currencySelected', this.value);
            localStorage.setItem('cryptoCurrencySelected', this.value);
            if (document.getElementById('fiatInput').value != '') {
                document.getElementById('tubeInput').setAttribute('disabled', 'disabled');
                document.getElementById('loadingTubeInput').classList.remove('displayNone');
                FetchCMC('selectCurrencyBuyCrypto', this.value);

            }

        }))
    }

    // input payment ammount
    const coinSelect = document.getElementById('coinSelect');
    if (coinSelect != null) {
        coinSelect.addEventListener('keydown', debounce(function (e) {
            getCoinSelectValue(e)
        }))

        coinSelect.addEventListener('change', debounce(function (e) {
            getCoinSelectValue(e)
        }))
    }

    const getCoinSelectValue = (e) => {
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 190) {
            if (e.keyCode != 13) {
                e.preventDefault();
            }

        } else {
            document.getElementById('cryptoCoin').value = '';
            document.getElementById('cryptoCoin').setAttribute('disabled', 'disabled');
            document.getElementById('loadingCrypto').classList.remove('displayNone');

            const currency = document.getElementById('selectCoin').value;
            FetchCMC('selectCoin', currency);
        }
    }

    // input TUBE amount
    const cryptoCoin = document.getElementById('cryptoCoin');
    if (cryptoCoin != null) {
        cryptoCoin.addEventListener('paste', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        cryptoCoin.addEventListener('keydown', debounce(function (e) {
            getCryptoCoinValue(e)
        }))
        cryptoCoin.addEventListener('change', debounce(function (e) {
           getCryptoCoinValue(e)
        }))
    }

    const getCryptoCoinValue = (e) => {
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 190) {
            if (e.keyCode != 13) {
                e.preventDefault();
            }

        } else {
            document.getElementById('coinSelect').value = '';
            document.getElementById('coinSelect').setAttribute('disabled', 'disabled');
            document.getElementById('loadingCoinSelect').classList.remove('displayNone');

            const currency = document.getElementById('selectCoin').value;
            FetchCMC('cryptoCoin', currency);
        }
    }

    // Select coin
    const selectCoin = document.getElementById('selectCoin');
    if (selectCoin != null) {
        setCurrencyOnSelect('creditCarForm', 'selectCoin');

        selectCoin.addEventListener('change', debounce(function (e) {
            document.getElementById('tubesInputCC').value = '';
            localStorage.setItem('currencySelected', this.value);
            if (document.getElementById('fiatCC').value != '') {
                document.getElementById('tubesInputCC').setAttribute('disabled', 'disabled');
                document.getElementById('loadingTUBEsCC').classList.remove('displayNone');
                FetchCMC('selectCoin', this.value);
            }
        }))
    }

    const fiatCC = document.getElementById('fiatCC');
    if (fiatCC != null) {
        addListenerToTUBEInput(fiatCC, 'loadingTUBEsCC', 'tubesInputCC', 'payWithCCButton', 'selectCoin', 'selectCoin');

    }

    const tubesInputCC = document.getElementById('tubesInputCC');
    if (tubesInputCC != null) {
        addListenerToTUBEInput(tubesInputCC, 'loadingFiatCC', 'fiatCC', 'payWithCCButton', 'selectCoin', 'fiatCC');

    }

    const cryptoSelect = document.getElementById('cryptoSelect');
    if (cryptoSelect != null) {
        addListenerToTUBEInput(cryptoSelect, 'loadingcryptoSelect', 'cryptoCoinCrypto', 'createTransferOrder', 'selectCurrencyCrypto', 'selectCurrencyCrypto');

    }
    const fiatInput = document.getElementById('fiatInput');
    if (fiatInput != null) {
        addListenerToTUBEInput(fiatInput, 'loadingTubeInput', 'tubeInput', 'payWithCryptoButton', 'selectCurrencyBuyCrypto', 'selectCurrencyBuyCrypto');
    }

    // input TUBE amount
    const cryptoCoinCrypto = document.getElementById('cryptoCoinCrypto');
    if (cryptoCoinCrypto != null) {
        addListenerToTUBEInput(cryptoCoinCrypto, 'loadingCryptoSelect', 'cryptoSelect', 'createTransferOrder', 'selectCurrencyCrypto', 'cryptoCoinCrypto');
    }

    const tubeInput = document.getElementById('tubeInput');
    if (tubeInput != null) {
        addListenerToTUBEInput(tubeInput, 'loadingFiat', 'fiatInput', 'payWithCryptoButton', 'selectCurrencyBuyCrypto', 'tubeInput');
    }

    // Select coin
    const selectCurrencyCrypto = document.getElementById('selectCurrencyCrypto');
    if (selectCurrencyCrypto != null) {
        setCurrencyOnSelect('bankTransferForm', 'selectCurrencyCrypto');
        selectCurrencyCrypto.addEventListener('change', function (e) {
            document.getElementById('cryptoCoinCrypto').value = '';
            localStorage.setItem('currencySelected', this.value);
            localStorage.setItem('currencySelected', this.value)
            if (cryptoSelect.value != '') {
                FetchCMC('selectCurrencyCrypto', this.value);
                document.getElementById('cryptoCoinCrypto').setAttribute('disabled', 'disabled');
                document.getElementById('loadingcryptoSelect').classList.remove('displayNone');
                document.getElementById('createTransferOrder').setAttribute('disabled', 'disabled');
            }
            fillCurrentPrice(this.value)
        })
    }

    const payWithCCButton = document.getElementById('payWithCCButton');
    if (payWithCCButton != null) {
        payWithCCButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var form = document.getElementById("creditCarForm"),
                addedToFields = false;
            if (validateForm(e, form, addedToFields)) {

                if (checkMinMaxAmountCreditCard().minAmount && checkMinMaxAmountCreditCard().maxAmount) {
                    document.getElementById('creditCarForm').classList.add('displayNone');
                    document.getElementById('creditCarFormStep2').classList.remove('displayNone');
                    document.getElementById("creditCarFormStep2").style.animation = "listPop 0.7s ease";
                } else {
                    let error;
                    const elementWithError = ['fiatCC'];
                    if (!checkMinMaxAmountCreditCard().minAmount) {
                        error = ['The minimun amount is 1 ' + localStorage.getItem('currencySelected')];
                        setErrors(error, elementWithError);
                    }
                    if (!checkMinMaxAmountCreditCard().maxAmount) {
                        error = ['The maximun amount is 1000 ' + localStorage.getItem('currencySelected')];
                        setErrors(error, elementWithError);
                    }


                }
            }


        })
    }

    const submitExtraData = document.getElementById('submitExtraData');
    if (submitExtraData != null) {
        submitExtraData.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var form = document.getElementById("userExtraData"),
                addedToFields = false;
            if (validateForm(e, form, addedToFields)) {
                showHideButtonLoader('submitExtraData', 'showLoader');
                const extraDataObject = {
                    name: document.getElementById('fullName').value,
                    phone: document.getElementById('phoneNumber').value,
                    birthday: new Date(document.getElementById('birthday').value).toISOString(),
                    countryCode: document.getElementById('selectCountryExtraData').selectedOptions[0].getAttribute('value'),
                    city: document.getElementById('city').value,
                    street: document.getElementById('street').value,
                    postalCode: document.getElementById('postalCode').value,
                    documentType: document.getElementById('selectDocumentType').selectedOptions[0].getAttribute('value'),
                    documentNumber: document.getElementById('documentNumber').value,
                    documentIssuedBy: document.getElementById('documentIssuedBy').value,
                }
                console.log('extraDataObject => ', extraDataObject)
                saveUserExtraData(extraDataObject);
            }


        })
    }

    const payWithCC = document.getElementById('payWithCC');
    if (payWithCC != null) {
        payWithCC.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const claims = await getFirebaseClaims();
            if ( !claims.hasKYC ){
                showModalErrorBuyingWithCC('accountNotVerified');
            }else{
                var form = document.getElementById("creditCarFormStep2"),
                addedToFields = false;
                let error, elementWithError;
                if (validateForm(e, form, addedToFields)) {
                    if (document.getElementById('cardExpirityYear').value.length < 2 || document.getElementById('cardExpirityYear').value.length > 2) {
                        error = ['Incorrect format'];
                        elementWithError = ['cardExpirityYear'];
                        setErrors(error, elementWithError)
                    } else {
                        showHideButtonLoader('payWithCC', 'showLoader');
                        showModalTerms('cc')
                    }

                }
            }

        })
    }

    const backToCCForm = document.getElementById('backToCCForm');
    if ( backToCCForm != null ){
        backToCCForm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('creditCarFormStep2').classList.add('displayNone');
            document.getElementById('creditCarForm').classList.remove('displayNone');
            document.getElementById("creditCarForm").style.animation = "listPop 0.7s ease";
        });
    }
});

const conversionRateTokenCache = {};
const getConversionRateToken = (currency) => {
    const cached = conversionRateTokenCache[currency];
    if (!cached || (Date.now() - cached.time) >= 180000) {
        const promise = firebaseFunc(`conversionRate`, {
                query: {
                    currency
                }
            })
            .then(resp => resp.json())
            .catch(err => {
                delete conversionRateTokenCache[currency];
                throw err;
            });
        conversionRateTokenCache[currency] = {
            time: Date.now(),
            promise
        };
    }
    return conversionRateTokenCache[currency].promise;
}

const applyFeeForPurchase = (total, type) => {
    const fee = 0.25;
    const transactionFee = ((total * 4.5) / 100);
    switch (type) {
        case 'getTubes':
            return parseFloat(total - (fee + transactionFee)).toFixed(2);
        case 'getFiat':
            return parseFloat(total + (fee + transactionFee)).toFixed(2);
    }

}

let fetchingCMC = null;
let priceRefreshTimer = null;
const FetchCMC = async (from, currency) => {
    if (fetchingCMC == currency) return;
    fetchingCMC = currency;
    try {
        console.log('From ===> ', from);
        localStorage.setItem('preferredFiat', currency);
        // const priceToken = await getConversionRateToken(currency);
        // localStorage.setItem('conversionRateToken', priceToken.token);
        let amountCoinSelect;
        switch (from) {
            case 'selectCurrencyCrypto':
                amountCoinSelect = document.getElementById('cryptoSelect').value;
                getAmountToBuy(undefined, amountCoinSelect, 'cryptoCoinCrypto', 'loadingcryptoSelect', 'createTransferOrder', 'getTubes');
                break;
            case 'cryptoCoinCrypto':
                amountCoinSelect = document.getElementById('cryptoCoinCrypto').value;
                getAmountToBuy(amountCoinSelect, undefined, 'cryptoSelect', 'loadingCryptoSelect', 'createTransferOrder', 'getFiat');
                break;
            case 'selectCurrencyBuyCrypto':
                amountCoinSelect = document.getElementById('fiatInput').value;
                getAmountToBuy(undefined, amountCoinSelect, 'tubeInput', 'loadingTubeInput', 'payWithCryptoButton', 'getTubes', 'buyWithCrypto');
                break;
            case 'tubeInput':
                amountCoinSelect = document.getElementById('tubeInput').value;
                getAmountToBuy(amountCoinSelect, undefined, 'fiatInput', 'loadingFiat', 'payWithCryptoButton', 'getFiat', 'buyWithCrypto');
                break;
            case 'selectCoin':
                amountCoinSelect = document.getElementById('fiatCC').value//applyFeeForPurchase(document.getElementById('fiatCC').value, 'getTubes');
                getAmountToBuy(undefined, amountCoinSelect, 'tubesInputCC', 'loadingTUBEsCC', 'payWithCCButton', 'getTubes');
                break;
            case 'fiatCC':
                amountCoinSelect = document.getElementById('tubesInputCC').value
                getAmountToBuy(amountCoinSelect, undefined, 'fiatCC', 'loadingFiatCC', 'payWithCCButton', 'getFiat', 'creditCard');
                break;

        }

    } catch (error) {
        console.log(error);
    } finally {
        clearTimeout(priceRefreshTimer);
        priceRefreshTimer = setTimeout(() => FetchCMC(from, currency), 240000);
        fetchingCMC = null;
    }
}

function addListenerToTUBEInput(inputTube, loadingInput, fiatInput, buttonPay, selectCurrency, tubeInputName) {
    inputTube.addEventListener('paste', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    const getInputTubeValue = (e) => {
        if (((e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 190) {
            if (e.keyCode != 13) {
                e.preventDefault();
            }
        } else {
            if (inputTube.value == '') {
                document.getElementById(fiatInput).value = '';
                document.getElementById(loadingInput).classList.add('displayNone');
                document.getElementById(buttonPay).setAttribute('disabled', 'disabled');
            } else {

                document.getElementById(fiatInput).value = '';
                document.getElementById(fiatInput).setAttribute('disabled', 'disabled');
                document.getElementById(loadingInput).classList.remove('displayNone');
                document.getElementById(buttonPay).setAttribute('disabled', 'disabled');
                const currency = document.getElementById(selectCurrency).value;
                FetchCMC(tubeInputName, currency);
            }
        }
    }

    inputTube.addEventListener('keydown', debounce(function (e) {
        getInputTubeValue(e)

    }))

    inputTube.addEventListener('change', debounce(function (e) {
        getInputTubeValue(e)
    }))


}


const getAmountToBuy = async (tubeAmount = '', amount = '', input, loading, button, type, buyType = undefined) => {
    const token = await getFirebaseToken();
    let currency;

    if (buyType == 'buyWithCrypto') {
        if (localStorage.getItem('cryptoCurrencySelected') != null) {
            currency = localStorage.getItem('cryptoCurrencySelected');
        } else {
            currency = 'BTC';
        }

    } else {
        if (localStorage.getItem('currencySelected') != null) {
            currency = localStorage.getItem('currencySelected');
        } else {
            currency = 'USD';
        }

    }

    const url = functionBaseURL + '/app/getFIATTUBEPrice?tubeAmount=' + tubeAmount + '&currency=' + currency + '&fiatAmount=' + amount

    sendGetRequest(url, token, function (user, response) {
        const result = JSON.parse(response);
        document.getElementById(input).removeAttribute('disabled');
        document.getElementById(loading).classList.add('displayNone');
        switch (type) {
            case 'getTubes':
                if (buyType === 'buyWithCrypto') {
                    document.getElementById(input).value = result.tubeAmount.toFixed(8);
                } else {
                    document.getElementById(input).value = result.tubeAmount.toFixed(2);
                }

                break;
            case 'getFiat':
                if (buyType === 'creditCard') {
                    document.getElementById(input).value = result.fiatAmount.toFixed(2)//applyFeeForPurchase(result.fiatAmount, 'getFiat');
                } else {
                    if (buyType === 'buyWithCrypto') {
                        document.getElementById(input).value = result.fiatAmount.toFixed(8);
                    } else {
                        document.getElementById(input).value = result.fiatAmount.toFixed(2);
                    }

                }

                break;
        }

        localStorage.setItem('purchaseData', result.token);

        // document.getElementById(input).setAttribute('data-actualprice', result[i].Rate );
        document.getElementById(button).removeAttribute('disabled');
    });
}


function setLocalStorageBuyTubesData() {
    const obj = {
        first_name: document.getElementById('first_name').value || '',
        last_name: document.getElementById('last_name').value || '',
        card_no: document.getElementById('cardNumber').value || '',
        ccExpiryMonth: document.getElementById('cardExpirityMonth').value || '',
        ccExpiryYear: document.getElementById('cardExpirityYear').value || '',
        // card_type: document.getElementById('selectCardType').value || '',
        address: document.getElementById('address').value || '',
        country: document.getElementById('selectCountry').value || '',
        cvvNumber: document.getElementById('cvvNumber').value || '',
        // state: document.getElementById('state').value || '',
        city: document.getElementById('city').value || '',
        zip: document.getElementById('zip').value || ''
    }
    localStorageEx.set('buyTubesInfo', obj, 300);
}

function setDataByTubes(data) {
    console.log(data)
    document.getElementById('first_name').value = data.first_name || '';
    document.getElementById('last_name').value = data.last_name || '';
    document.getElementById('cardNumber').value = data.card_no || '';
    document.getElementById('cardExpirityMonth').value = data.ccExpiryMonth || '';
    document.getElementById('cardExpirityYear').value = data.ccExpiryYear || '';
    // document.getElementById('selectCardType').value = data.card_type || '1';
    document.getElementById('address').value = data.address || '';
    document.getElementById('selectCountry').value = data.country || '';
    document.getElementById('city').value = data.city || '';
    // document.getElementById('state').value = data.state || '';
    document.getElementById('zip').value = data.zip || '';

    const allLabels = document.querySelectorAll(".labelBank");
    const allInput = document.querySelectorAll(".bankInput")
    for (let i = 0; i < allLabels.length; i++) {
        if (allInput[i].value != '') {
            allLabels[i].style.animation = "labelAppear 0.5s ease-out forwards"
        }

    }
}


const setCurrencyOnSelect = (form, select) => {
    form = '#' + form;
    let currency;
    if (localStorage.getItem('currencySelected') != null) {
        currency = localStorage.getItem('currencySelected');
    } else {
        currency = 'USD';
    }

    document.getElementById(select).value = currency;
    mobiscroll.form(form).controls[select]._setText(currency);
}

const checkMinMaxAmountCreditCard = () => {
    const fiatAmount = new Number(document.getElementById('fiatCC').value);
    const objChecks = {
        minAmount: false,
        maxAmount: false
    }
    switch (localStorage.getItem('currencySelected')) {
        case 'EUR':
        case 'USD':
        case 'GBP':
        case 'NZD':
        case 'AUD':
            if (fiatAmount >= 1 && fiatAmount <= 1000) {
                objChecks.minAmount = true;
                objChecks.maxAmount = true;
            } else if (fiatAmount < 1 && fiatAmount <= 1000) {
                objChecks.minAmount = false;
                objChecks.maxAmount = true;
            } else if (fiatAmount >= 1 && fiatAmount > 1000) {
                objChecks.minAmount = true;
                objChecks.maxAmount = false;
            }

            return objChecks;
    }
}


const showModalErrorBuyingWithCC = (message) => {
    const instance = mobiscroll.popup('#errorPurchaseWithCC', {
        display: 'center',
        cssClass: 'popUpResendEmail',
        closeOnOverlayTap: false,
        buttons: [{
            text: i18next.t('close'),
            cssClass: 'buttonModdal',
            handler: function (event, inst) {
                inst.hide();
            }
        }],
        onBeforeShow: function (ev, inst) {
            if ( message == 'accountNotVerified'){
                document.getElementById('errorToSupport').classList.add('displayNone');
                document.getElementById('errorNotKYC').classList.remove('displayNone');
                const errorMessage = i18next.t('startVerification');
                document.getElementById('errorNotKYC').innerHTML = errorMessage;
            }else{
                document.getElementById('errorToSupport').classList.remove('displayNone');
                document.getElementById('errorNotKYC').classList.add('displayNone');
                document.getElementById('errorNotKYC').innerHTML = '';
                let messageError;
                switch (message.responseMessage){
                    case 'ERROR CODE (RC_INVALID_CARDNUMBER)':
                        messageError = 'The card number is not valid';
                    break;
                    case 'Insufficient funds':
                        messageError = 'Insufficient funds in your credit or debit card';
                    break;
                    default:
                        messageError = message.responseMessage.toLowerCase()
                    break;
                }
                document.getElementById('infoPurchaseError').innerHTML = 'Your purchase has been declined by the following reason: <br>' + messageError + ' <br><br> Your order Id is <br> <b>' + message.order_id + '</b>';
                document.getElementById('supportLink').addEventListener('click', function (e) {
                    chrome.tabs.create({
                        url: 'https://bittube.app/'
                    });
                })
            }

        }
    });
    instance.show();
}


const showModalErrorExtraData = () => {
    const instance = mobiscroll.popup('#errorExtraData', {
        display: 'center',
        cssClass: 'popUpResendEmail',
        closeOnOverlayTap: false,
        buttons: [{
            text: i18next.t('close'),
            cssClass: 'buttonModdal',
            handler: function (event, inst) {
                inst.hide();
            }
        }],
        onBeforeShow: function (ev, inst) {

            document.getElementById('errorUserExtraData').innerHTML = i18next.t('errorSavingExtraData')

        }
    });
    instance.show();
}