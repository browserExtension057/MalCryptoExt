'use strict';
let public_address;
let public_keys;
let secret_keys;
let key_images = {};
const tube_icon = '<i class="icon-font-tube tubeFont10"></i>';
let availableBalanceDiv;

document.addEventListener('DOMContentLoaded', function () {
  availableBalanceDiv = document.getElementById('available');
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      getUserWallets();
      const changeWallet = document.getElementById('changeWallet');
      if (changeWallet != null) {
        changeWallet.addEventListener('change', function (e) {
          const dataSelected = this.options[this.options.selectedIndex].getAttribute('data-data');
          loadSelectedWallet(dataSelected);
        })
      }
    }
  })

  mobiscroll.nav('#tabsGetVerified', {
    theme: 'ios',
    type: 'tab',
    cssClass: 'divTabsPublisher',
    onItemTap: function (event, inst) {
      document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
      document.querySelector('#apps-tab-' + event.target.getAttribute('data-tab')).classList.add('md-apps-tab-sel');


    }
  });

  const iconInfoFee = document.getElementById('iconInfoFee');
  if (iconInfoFee != null) {
    iconInfoFee.addEventListener('mouseenter', function (e) {
      document.getElementById('spanFeeHint').style.visibility = 'visible';
      document.getElementById('spanFeeHint').style.opacity = '1';
    });

    iconInfoFee.addEventListener('mouseleave', function (e) {
      document.getElementById('spanFeeHint').style.visibility = 'hidden';
      document.getElementById('spanFeeHint').style.opacity = '0';
    })
  }

  const verifyByPhoneNumber = document.getElementById('verifyByPhoneNumber');
  if (verifyByPhoneNumber != null) {
    verifyByPhoneNumber.addEventListener('click', function (e) {
      document.getElementById('divRegisterPhoneNumber').classList.remove('displayNone');
      document.getElementById('divRegisterPhoneNumber').style.animation = "listPop 0.7s ease";
      document.getElementById('mainDivBasicVerification').classList.add('displayNone');
    })
  }

  const backToGetVerified = document.getElementById('backToGetVerified');
  if (backToGetVerified != null) {
    backToGetVerified.addEventListener('click', function (e) {
      document.getElementById('divRegisterPhoneNumber').classList.add('displayNone');
      document.getElementById('mainDivBasicVerification').style.animation = "listPop 0.7s ease";
      document.getElementById('mainDivBasicVerification').classList.remove('displayNone');
    });
  }
  if (document.querySelector(".year")) {
    let dt = new Date()
    document.querySelector(".year").innerHTML = dt.getYear() + 1900

  }

  const formInstance = mobiscroll.form('#changeCurrencyForm');
  if (formInstance != null && formInstance != undefined) {
    document.getElementById('selectFiat').value = localStorage.getItem('currencySelected');
    const event = new Event('change');
    document.getElementById('selectFiat').dispatchEvent(event);

  }

  document.getElementById('profileImageIcon').src = localStorage.getItem('image') || 'assets/images/logo-header.svg';

  if (document.getElementById('defaultCurrency') != null) {
    if (localStorage.getItem('currencySelected') != null) {
      document.getElementById('defaultCurrency').innerText = localStorage.getItem('currencySelected');
    } else {
      localStorage.setItem('currencySelected', 'USD')
      document.getElementById('defaultCurrency').innerText = 'USD';
    }
  }


  if (localStorage.getItem('toRegisterPhone') == 'true') {
    document.getElementById('divAccountOptions').classList.add('displayNone');
    document.getElementById('divGetVerified').classList.remove('displayNone');
    document.getElementById("divGetVerified").style.animation = "panelLeft 0.4s ease";
    localStorage.setItem('toRegisterPhone', false)
  }

  if (localStorage.getItem('goToReferral') == 'true') {
    document.getElementById('divAccountOptions').classList.add('displayNone');
    document.getElementById('divProfileReferral').classList.remove('displayNone');
    document.getElementById("divProfileReferral").style.animation = "panelLeft 0.4s ease";
    localStorage.setItem('goToReferral', false)
  }

  if (localStorage.getItem('goToSecurity') == 'true') {
    setTimeout(function (e) {
      document.getElementById('showSecurity').click();
    }, 500);
    localStorage.setItem('goToSecurity', false)
  }


  const showProfile = document.getElementById('showProfile');
  if (showProfile != null) {
    showProfile.addEventListener('click', function (e) {
      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divProfile').classList.remove('displayNone');
      document.getElementById("divProfile").style.animation = "panelLeft 0.4s ease";
    });

    const closeProfile = document.getElementById('closeProfile');
    closeProfile.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      document.getElementById('divProfile').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";

    });
  }




  const showReferral = document.getElementById('showReferral');
  if (showReferral != null) {
    showReferral.addEventListener('click', function (e) {
      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divProfileReferral').classList.remove('displayNone');
      document.getElementById("divProfileReferral").style.animation = "panelLeft 0.4s ease";
    });

    const closeReferral = document.getElementById('closeReferral');
    closeReferral.addEventListener('click', function (e) {
      document.getElementById('divProfileReferral').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
    })

  }

  const showGetVerified = document.getElementById('showGetVerified');
  if (showGetVerified != null) {
    showGetVerified.addEventListener('click', function (e) {
      showGetVerifiedProcess();
    });
  }

  const closeGetVeried = document.getElementById('closeGetVeried');
  if (closeGetVeried != null) {
    closeGetVeried.addEventListener('click', async (e) => {
      document.getElementById('divTabsGetVerified').classList.remove('displayNone');
      document.getElementById('divVerifyDocuments').classList.add('displayNone');
      document.getElementById('divVerifySelfie').classList.add('displayNone');
      document.getElementById('basicVerification').classList.remove('displayNone');
      document.getElementById('divGetVerified').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "panelLeft 0.4s ease";
      const claims = await getFirebaseClaims();
      if (!claims.hasPhone) {
        if (!claims.verified) {
          showVerifyPhone();
        }else{
          if ( document.getElementById('showReferral') != null ){
            document.getElementById('showReferral').classList.remove('displayNone')
          }
        }
      }
    });
  }

  const buttonBackToGetVerified = document.getElementById('buttonBackToGetVerified');
  if (buttonBackToGetVerified != null) {
    buttonBackToGetVerified.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('divVerifyDocuments').classList.add('displayNone');
      document.getElementById('divTabsGetVerified').classList.remove('displayNone');
      document.getElementById('basicVerification').classList.remove('displayNone');
      document.getElementById('basicVerification').style.animation = "listPop 0.7s ease";
    })
  }
  const buttonStartVerifyDocuments = document.getElementById('buttonStartVerifyDocuments');
  if (buttonStartVerifyDocuments != null) {
    buttonStartVerifyDocuments.addEventListener('click', async (e) => {
      if ( checkBrowser() == 'firefox' ){
        const url = functionBaseURL + '/app/createCustomToken';
        let customToken = await firebaseXhr(url);
        customToken = JSON.parse(customToken)
        if ( customToken.success ){
          chrome.tabs.create({
            url: 'https://bittubeapp.com/getVerified.html?customToken=' + customToken.token
          });
        }

      }else{
        if (buttonStartVerifyDocuments.getAttribute('data-step') != undefined && buttonStartVerifyDocuments.getAttribute('data-step') == 'selfie') {
          document.getElementById('basicVerification').classList.add('displayNone');
          document.getElementById('divVerifySelfie').classList.remove('displayNone');
          document.getElementById('divTabsGetVerified').classList.add('displayNone');
        } else {
          document.getElementById('basicVerification').classList.add('displayNone');
          document.getElementById('divVerifyDocuments').classList.remove('displayNone');
          document.getElementById('divTabsGetVerified').classList.add('displayNone');
        }
      }
    });
  }

  const checkBoxDocuments = document.querySelectorAll('.checkBoxDocuments');
  if (checkBoxDocuments.length > 0) {
    for (let i = 0; i < checkBoxDocuments.length; i++) {
      checkBoxDocuments[i].addEventListener('change', (e) => {
        localStorage.setItem('documentsUploaded', 'false');
        switch (checkBoxDocuments[i].value) {
          case 'nationalId':
            document.getElementById('divImage2').classList.remove('displayNone');
            localStorage.setItem('documentType', checkBoxDocuments[i].value);
            break;
          case 'passport':
            document.getElementById('divImage2').classList.add('displayNone');
            localStorage.setItem('documentType', checkBoxDocuments[i].value);
            break;
        }
      })
    }
  }
  const showChangeCurrency = document.getElementById('showChangeCurrency');
  if (showChangeCurrency != null) {
    showChangeCurrency.addEventListener('click', function (e) {
      document.getElementById('selectFiat').value = localStorage.getItem('currencySelected')
      const event = new Event('change');
      document.getElementById('selectFiat').dispatchEvent(event);
      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divChangeCurrency').classList.remove('displayNone');
      document.getElementById("divChangeCurrency").style.animation = "panelLeft 0.4s ease";

    });


    const closeChangeCurrency = document.getElementById('closeChangeCurrency');
    closeChangeCurrency.addEventListener('click', function (e) {
      document.getElementById('divChangeCurrency').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
    })
  }
  const showSecurity = document.getElementById('showSecurity');
  if (showSecurity != null) {
    showSecurity.addEventListener('click', (e) => {
      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divSecurity').classList.remove('displayNone');
      document.getElementById("divSecurity").style.animation = "panelLeft 0.4s ease";
    });

    const closeSecurity = document.getElementById('closeSecurity');
    closeSecurity.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('divSecurity').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";

    });

    const closeSecurity2FA = document.getElementById('closeSecurity2FA');
    closeSecurity2FA.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showHideDeletePhone();
      document.getElementById('divSecurity').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
    });

  }

  const stakeTUBEs = document.getElementById('stakeTUBEs');
  if (stakeTUBEs != null) {
    stakeTUBEs.addEventListener('click', function (e) {
      showModalStake();
    })
  }

  const saveCurrency = document.getElementById('saveCurrency');
  if (saveCurrency != null) {
    saveCurrency.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      localStorage.setItem('currencySelected', document.getElementById('selectFiat').value);
      document.getElementById('defaultCurrency').innerHTML = document.getElementById('selectFiat').value;
      document.getElementById('divChangeCurrency').classList.add('displayNone');
      document.getElementById('divAccountOptions').classList.remove('displayNone');
      document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
    });
  }

  const showConvertTubes = document.getElementById('showConvertTubes');
  if (showConvertTubes != null) {
    showConvertTubes.addEventListener('click', function (e) {
      checkVerifyStatus();
    });

    const closeConvertTubes = document.querySelectorAll('.closeConvertTubes');
    for (let i = 0; i < closeConvertTubes.length; i++) {
      closeConvertTubes[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('divConvertTubes').classList.add('displayNone');
        document.getElementById('divAccountOptions').classList.remove('displayNone');
        document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
        document.getElementById('formVerifyBank').classList.add('displayNone');
        document.getElementById("formVerifyBank").style.animation = "";

        document.getElementById('linkBankForm').classList.add('displayNone');
        document.getElementById("linkBankForm").style.animation = "";

        document.getElementById('submitPhotosForm').classList.add('displayNone');
        document.getElementById("submitPhotosForm").style.animation = "";

        removeErrors(document.getElementById('transferTUBEs'));
        fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
          const value = (25 / responseFetch.value).toFixed(2);
          const spanBalance = document.getElementById('spanBalance');
          let currencySymb = responseFetch.currency;
          switch (responseFetch.currency) {
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
          if (spanBalance != null) {
            document.getElementById('valueBalance').innerHTML = (Number(spanBalance.innerText) * responseFetch.value).toFixed(2) + ' ' + currencySymb;
          }
          document.getElementById('transferTUBEs').value = value;
          document.getElementById('quantityToTransfer').innerHTML = value + ' <i class="icon-font-tube tubeFont10"></i> / <span id="totalQuantity">' + 25 + '</span> ' + currencySymb;
          document.getElementById('fiatAmountWithdraw').innerHTML = 25 + ' ' + currencySymb;
        });
      })
    }

  }

  const checkVerifyStatus = async () => {
    try {
      const claims = await getFirebaseClaims();
      if (!claims.hasKYC) {
        showModalUserNotVerified('startProcess');
      } else {
        if (localStorage.getItem('userAccountLinked') == 'true') {
          showWithdrawView();
        } else {
          document.getElementById('divAccountOptions').classList.add('displayNone');
          document.getElementById('divConvertTubes').classList.remove('displayNone');
          document.getElementById('linkBankForm').classList.remove('displayNone');
          document.getElementById("linkBankForm").style.animation = "panelLeft 0.4s ease";
        }
      }
    } catch (err) {
      console.log('Error getting user documents ==> ', err)
    }
  }

  const verifySecret = document.getElementById('verifySecret');
  if (verifySecret != null) {
    const label2FA = document.getElementById('label2FA');
    verifySecret.placeholder = i18next.t('2FACode');
    verifySecret.addEventListener('focus', function (e) {
      verifySecret.placeholder = "";
      label2FA.style.animation = "labelAppear 0.5s ease-out forwards";
    });

    verifySecret.addEventListener('blur', function (e) {
      if (verifySecret.value == '') {
        verifySecret.placeholder = i18next.t('2FACode');
        label2FA.style.animation = "labelDisappear 0.5s ease-out forwards";
      }
    })

  }

  const verifySecretDeletePhone = document.getElementById('verifySecretDeletePhone');
  if (verifySecretDeletePhone != null) {
    const label2FADeletePhone = document.getElementById('label2FADeletePhone');
    verifySecretDeletePhone.placeholder = i18next.t('2FACode');
    verifySecretDeletePhone.addEventListener('focus', function (e) {
      verifySecretDeletePhone.placeholder = '';
      label2FADeletePhone.animation = "labelAppear 0.5s ease-out forwards";
    });

    verifySecretDeletePhone.addEventListener('blur', function (e) {
      if (verifySecretDeletePhone.value == '') {
        verifySecretDeletePhone.placeholder = i18next.t('2FACode');
        label2FADeletePhone.style.animation = "labelDisappear 0.5s ease-out forwards";
      }
    })
  }

  const linkBankButton = document.getElementById('linkBankButton');
  if (linkBankButton != null) {
    linkBankButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var form = document.getElementById("linkBankForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        // if (validateIBAN(document.getElementById('userIBAN').value)) {
          const params = {
            account_name: document.getElementById('accountName').value,
            first_name: document.getElementById('firstName').value,
            last_name: document.getElementById('lastName').value,
            IBAN: document.getElementById('userIBAN').value,
            // BICSWIFT: document.getElementById('bic-swift').value,
          }
          firebase.auth().currentUser.getIdToken().then((token) => {
            var encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), token);
            const url = functionBaseURL + '/app/newLinkUserBankAccount';
            var data = 'encryptedData=' + encodeURIComponent(encrypted.toString());
            sendPostRequest(url, data, null, token, function (user, response) {
              const result = JSON.parse(response);
              if (result.result == 'Success' && result.message !== 'Account Exists') {
                localStorage.setItem('userAccountLinked', true);
                localStorage.setItem('account_name', result.account_name)
                showUserConvertTubes(result.data, true);
              } else if (result.result == 'Success' && result.message == 'Account Exists') {
                localStorage.setItem('userAccountLinked', true);
                localStorage.removeItem('account_name');
                showUserConvertTubes(result.data, true);
              }
            });
          })
        // } else {
        //   const error = ['The IBAN is not valid'];
        //   const elementWithError = ['userIBAN'];
        //   setErrors(error, elementWithError);
        // }



      }

    })
  }

  const verifyBankAccount = document.getElementById('verifyBankAccount');
  if (verifyBankAccount != null) {
    verifyBankAccount.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var form = document.getElementById("formVerifyBank"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        const params = {
          code: document.getElementById('verificationCode').value,
          account_name: localStorage.getItem('account_name'),
        }

        firebase.auth().currentUser.getIdToken().then((token) => {
          var encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), token);
          const url = functionBaseURL + '/app/verifyBankAccount';
          var data = 'encryptedData=' + encodeURIComponent(encrypted.toString());

          sendPostRequest(url, data, null, token, function (user, response) {
            const result = JSON.parse(response);
            if (result.result == 'Success') {
              localStorage.setItem('userAccountLinked', true);
              localStorage.removeItem('account_name');
              showUserConvertTubes(result.data);
            } else if (result.result == 'Error') {
              const errors = ['The code is not correct'];
              const elementsWithErrors = ['verificationCode'];
              setErrors(errors, elementsWithErrors);
            }
          });
        });
      }
    })
  }

  const transferTUBEs = document.getElementById('transferTUBEs');
  if (transferTUBEs != null) {
    transferTUBEs.addEventListener('keydown', debounce(function (e) {

      var charCode = e.which || e.keyCode;
      if (charCode == 46) {
        fillTransferButton(transferTUBEs.value);
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else {
        fillTransferButton(transferTUBEs.value);
      }


    }));

    transferTUBEs.addEventListener('focus', function (e) {
      removeErrors(this);
    });

  }

  const modifyAccount = document.getElementById('modifyAccount');
  if (modifyAccount != null) {
    modifyAccount.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const claims = await getFirebaseClaims();
      if (claims.has2FA) {
        document.getElementById('confirm2FAAccount').setAttribute('data-action', 'modifyAccount');
        document.getElementById('text2fa').innerText = 'To modify your bank account please enter the 6 digits code from your 2FA.';
        document.getElementById('formConvertTubes').classList.add('displayNone');
        document.getElementById("deleteAccount2FA").classList.remove('displayNone');
        document.getElementById("deleteAccount2FA").style.animation = "listPop 0.7s ease";
      } else {
        showModalConfirm();
      }
    })
  }

  const input2FAdeleteAccount = document.getElementById('input2FAdeleteAccount');
  const confirm2FAAccount = document.getElementById('confirm2FAAccount');

  if (input2FAdeleteAccount != null) {
    input2FAdeleteAccount.placeholder = i18next.t('2FACode');
    input2FAdeleteAccount.addEventListener('focus', function (e) {
      input2FAdeleteAccount.placeholder = '';
      document.getElementById('labelConfir2FA').style.animation = "labelAppear 0.5s ease-out forwards";
      removeErrors(this);
    });
    input2FAdeleteAccount.addEventListener('keydow', function (e) {
      if (e.keyCode != 13) {
        e.preventDefault();
        confirm2FAAccount.click();
      }
    });
    input2FAdeleteAccount.addEventListener('blur', function (e) {
      if (e.keyCode != 13) {
        e.preventDefault();
        if (input2FAdeleteAccount.value == '') {
          input2FAdeleteAccount.placeholder = i18next.t('2FACode');
          document.getElementById('labelConfir2FA').style.animation = "labelDisappear 0.5s ease-out forwards";
        }
      }
    });
  }

  if (confirm2FAAccount != null) {
    confirm2FAAccount.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const securityCode = document.getElementById('input2FAdeleteAccount').value;
      verify2FASecret(securityCode, function (response) {

        if (response == 'SecurityEnable') {
          if (confirm2FAAccount.getAttribute('data-action') == 'modifyAccount') {
            document.getElementById("deleteAccount2FA").classList.add('displayNone');
            document.getElementById("deleteAccount2FA").style.animation = "";
            document.getElementById('formConvertTubes').classList.remove('displayNone');
            setTimeout(function (e) {
              showModalConfirm();
            }, 1000)

          } else if (confirm2FAAccount.getAttribute('data-action') == 'transferTUBEs') {
            showConfirmTransaction();
          }

        } else {
          const error = [i18next.t(the2FANotCorrect)];
          const inputWithError = ['input2FAdeleteAccount'];
          setErrors(error, inputWithError);
        }
      });
    });
  }

  const buttonTransferTUBEs = document.getElementById('buttonTransferTUBEs');
  if (buttonTransferTUBEs != null) {
    buttonTransferTUBEs.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const quantity = new Number(document.getElementById('totalQuantity').innerText);
      const availableQuantity = new Number(document.getElementById('spanBalance').innerText);
      const tubesQuantity = new Number(document.getElementById('transferTUBEs').value);
      if (quantity < 25) {
        const error = ['The minimum amount is 25 ' + localStorage.getItem('currencySelected')];
        const inputWithError = ['transferTUBEs'];
        setErrors(error, inputWithError);
      } else if (availableQuantity < tubesQuantity) {
        const error = ['You have not enough balance'];
        const inputWithError = ['transferTUBEs'];
        setErrors(error, inputWithError);
      } else {
        const claims = await getFirebaseClaims();
        if (claims.has2FA) {
          confirm2FAAccount.setAttribute('data-action', 'transferTUBEs');
          document.getElementById('text2fa').innerText = 'To withdraw your TUBEs, please enter the 6 digits code from your 2FA.';
          document.getElementById('formConvertTubes').classList.add('displayNone');
          document.getElementById("deleteAccount2FA").classList.remove('displayNone');
          document.getElementById("deleteAccount2FA").style.animation = "listPop 0.7s ease";
        } else {
          showConfirmTransaction();
        }
      }

    });
  }
  const allCopyTx = document.querySelectorAll(".txCopy")
  for (let i = 0; i < 3; i++) {
    allCopyTx[i].addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = e.path[1].parentElement.querySelector(".inputContent").innerHTML;
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    })
  }

  const buttonCancel = document.getElementById('buttonCancel');
  if (buttonCancel != null) {
    buttonCancel.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      hideConfirmTransaction();
    })
  }

  const buttonConfirm = document.getElementById('buttonConfirm');
  if (buttonConfirm != null) {
    buttonConfirm.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const wallet = document.getElementById('spanWalletAddress').innerText;
      const payment_id = document.getElementById('spanPaymentId').innerText;
      const amount = document.getElementById('transferTUBEs').value;
      const selectInput = document.getElementById('changeWallet');
      const dataSelected = selectInput.options[selectInput.options.selectedIndex].getAttribute('data-data');
      // console.log('AMOUNT !!!!! ', amount)
      showHideButtonLoader('buttonConfirm', 'showLoader');
      transaction(wallet, amount, payment_id, dataSelected);
    });
  }


  const minusAmountWithdraw = document.getElementById('minusAmountWithdraw');
  if (minusAmountWithdraw != null) {
    minusAmountWithdraw.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const value = new Number(document.getElementById('transferTUBEs').value) - 1;
      if (value >= 0) {
        document.getElementById('transferTUBEs').value = value;
        fillTransferButton(value);
      }

    })
  }
  const plusAmountWithdraw = document.getElementById('plusAmountWithdraw');
  if (plusAmountWithdraw != null) {
    plusAmountWithdraw.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const value = new Number(document.getElementById('transferTUBEs').value) + 1;
      document.getElementById('transferTUBEs').value = value;
      fillTransferButton(value);
    })
  }

  const showAbout = document.getElementById('showAbout');
  if (showAbout != null) {
    showAbout.addEventListener('click', function (e) {
      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divInfoAbout').classList.remove('displayNone');
      document.getElementById("divInfoAbout").style.animation = "panelLeft 0.4s ease";

    });
  }

  const closeAbout = document.getElementById('closeAbout');
  closeAbout.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    document.getElementById('divInfoAbout').classList.add('displayNone');
    document.getElementById('divAccountOptions').classList.remove('displayNone');
    document.getElementById("divAccountOptions").style.animation = "listPop 0.7s ease";
  });

  const divImagePassport = document.getElementById('divImagePassport');
  if (divImagePassport != null) {
    divImagePassport.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    })
  }

  let image1;
  const inputImage1 = document.getElementById('inputImage1');
  if (inputImage1 != null) {
    inputImage1.addEventListener('change', function (e) {
      var reader = new FileReader();
      reader.onload = function (e) {
        image1 = e.currentTarget.result;
        if (!document.getElementById('divWrongImage1').classList.contains('displayNone')) {
          localStorage.setItem('documentsError', false)
        }
        localStorage.setItem('document1', '')
        document.getElementById('divImageDocument1').classList.add('displayNone')
        document.getElementById('divImage1').style.backgroundImage = 'url("' + e.currentTarget.result + '")';
        // document.getElementById('divImageDocument1').classList.remove('displayNone');
        document.getElementById('divWrongImage1').classList.add('displayNone');
        document.getElementById('divIconWrontImage1').classList.add('displayNone');
      }
      reader.readAsDataURL(inputImage1.files[0]);
    })
  }
  let image2;
  const inputImage2 = document.getElementById('inputImage2');
  if (inputImage2 != null) {
    inputImage2.addEventListener('change', function (e) {
      var reader = new FileReader();
      reader.onload = function (e) {
        image2 = e.currentTarget.result;
        if (!document.getElementById('divWrongImage1').classList.contains('displayNone')) {
          localStorage.setItem('documentsError', false)
        }
        localStorage.setItem('document2', '')
        document.getElementById('divImageDocument2').classList.add('displayNone')
        document.getElementById('divImage2').style.backgroundImage = 'url("' + e.currentTarget.result + '")';
        // document.getElementById('divImageDocument2').classList.remove('displayNone');
        document.getElementById('divWrongImage2').classList.add('displayNone');
        document.getElementById('divIconWrontImage2').classList.add('displayNone');
      }
      reader.readAsDataURL(inputImage2.files[0]);
    })
  }


  const divImage1 = document.getElementById('divImage1');
  if (divImage1 != null) {
    divImage1.addEventListener('click', function (e) {
      inputImage1.click();

    })
  }
  const divImage2 = document.getElementById('divImage2');
  if (divImage2 != null) {
    divImage2.addEventListener('click', function (e) {
      inputImage2.click();
    })
  }

  const buttonUploadPhotos = document.getElementById('buttonUploadPhotos');
  if (buttonUploadPhotos != null) {
    buttonUploadPhotos.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const type = localStorage.getItem('documentType');
      let upload = false;
      switch (type) {
        case 'nationalId':
          if ((inputImage1.value != '' && inputImage2.value != '') || (document.getElementById('divImage1').style.backgroundImage != '' && document.getElementById('divImage2').style.backgroundImage != '')) {
            upload = true;
          }
          break;
        case 'passport':
          if (inputImage1.value != '' || document.getElementById('divImage1').style.backgroundImage != '') {
            upload = true;
          }
          break;
      }

      if (upload) {
        showHideButtonLoader('buttonUploadPhotos', 'showLoader');
        uploadUserDocuments(type);
      } else {
        showModalImagesError('imagesEmpty');
      }


    });
  }
  const backToDocuments = document.getElementById('backToDocuments');
  if (backToDocuments != null) {
    backToDocuments.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (localStorage.getItem('documentType') == 'passport') {
        document.getElementById('passportCheck').click();
      } else if (localStorage.getItem('documentType') == 'nationalId') {
        document.getElementById('nationalIdCheck').click();
      }
      document.getElementById('divVerifySelfie').classList.add('displayNone');
      document.getElementById('divVerifyDocuments').classList.remove('displayNone');
    })
  }

  const divSelfie = document.getElementById('divSelfie');
  const inputSelfie = document.getElementById('inputSelfie');
  const buttonUploadSelfie = document.getElementById('buttonUploadSelfie');
  let selfie;

  if (divSelfie != null) {
    divSelfie.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      inputSelfie.click();
    })
  }

  if (inputSelfie != null) {
    inputSelfie.addEventListener('change', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var reader = new FileReader();
      reader.onload = function (e) {
        selfie = e.currentTarget.result;

        divSelfie.style.backgroundImage = 'url("' + e.currentTarget.result + '")';
        localStorage.setItem('selfie', '');
        if (!document.getElementById('divWrongSelfie').classList.contains('displayNone')) {
          localStorage.setItem('documentsError', false)
        }
        document.getElementById('divImagesSelfie').classList.add('displayNone');
        // document.getElementById('divImagesSelfie').classList.remove('displayNone');
        document.getElementById('divWrongSelfie').classList.add('displayNone');
        document.getElementById('divIconWrongSelfie').classList.add('displayNone');
      }
      reader.readAsDataURL(inputSelfie.files[0]);
    })
  }

  if (buttonUploadSelfie != null) {
    buttonUploadSelfie.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const fullName = document.getElementById('fullName').value;
      if (inputSelfie.value != '' || divSelfie.style.backgroundImage != '') {
        if (fullName != '') {
          showHideButtonLoader('buttonUploadSelfie', 'showLoader');
          uploadUserSelfie();
        } else {
          const error = [i18next.t('fieldRequired')];
          const inputWithError = ['fullName'];
          setErrors(error, inputWithError);
        }
      } else {
        showModalImagesError('imagesEmpty');
      }

    })
  }
  const fullName = document.getElementById('fullName');
  if (fullName != null) {
    fullName.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      removeErrors(this);
    })
  }

  const buttonSaveSettings = document.querySelector("#buttonSaveSettings")
  if (buttonSaveSettings != null) {
    buttonSaveSettings.addEventListener("click", (e) => {
      // Display name
      e.preventDefault();
      e.stopPropagation();
      const newdisplayName = document.getElementById('username').value;
      var form = document.getElementById("profileForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        firebase.auth().currentUser.updateProfile({
          displayName: newdisplayName
        });
        showHideButtonLoader('buttonSaveSettings', 'showLoader');
        updateDisplayName(newdisplayName);
      }
      //Language
      const userLanguage = document.getElementById('changeLanguage').value;
      // console.log(userLanguage)
      if (typeof (browser) != 'undefined') {
        setCookieFf('userLanguage', userLanguage);
      } else {
        setCookie('userLanguage', userLanguage);
      }

      firebase.auth().languageCode = userLanguage;
      localStorage.setItem('i18nextLng', userLanguage);
      i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
          detection: {
            // order and from where user language should be detected
            order: ['localStorage', 'navigator'],
            // keys or params to lookup language from
            lookupLocalStorage: 'i18nextLng',
            // cache user language on
            caches: ['localStorage'],
            excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
          },
          fallbackLng: 'en',
          load: 'languageOnly',
          backend: {
            loadPath: '/_locales/{{lng}}/extension.json',
          }
        }, function (err, t) {
          localize = locI18next.init(i18next);
          localize('.translate');
        });
    })
  }



  // FUNCTIONS

  const updateDisplayName = async (newdisplayName) => {
    try {
      const token = await getFirebaseToken();
      const url = functionBaseURL + '/app/updateDisplayName?displayname=' + newdisplayName;
      sendGetRequest(url, token, function (user, response) {
        showHideButtonLoader('buttonSaveSettings', 'hideLoader');
        if (JSON.parse(response).message == 'success') {
          let updateSuccessfull = document.getElementById('updateSuccessfull');
          if (updateSuccessfull == null) {
            document.getElementById('airtimeMessagesContainer').innerHTML += '<div class="airtimeMessage" id="updateSuccessfull"></div>';
            updateSuccessfull = document.getElementById('updateSuccessfull');
            updateSuccessfull.innerHTML = i18next.t('profileUpdated');
            updateSuccessfull.style.backgroundColor = '#20ce0b';
            document.getElementById('airtimeMessagesContainer').style.top = '96px';
            document.getElementById('airtimeMessagesContainer').style.opacity = '1';

            setTimeout(function (e) {
              document.getElementById('airtimeMessagesContainer').style.top = '70px';
              document.getElementById('airtimeMessagesContainer').style.opacity = '';
              setTimeout(function (e) {
                updateSuccessfull.remove();
              }, 1000)

            }, 3000);
          }
        }
      })

    } catch (err) {
      console.error('Error updating display name ', err);
    }
  }
  const uploadUserDocuments = async (type) => {
    try {
      let urlImage1, urlImage2;
      let data = {};
      const url = functionBaseURL + '/app/saveUserDocuments';
      localStorage.setItem('currentUserID', firebase.auth().currentUser.uid)
      if (localStorage.getItem('documentsUploaded') != 'incomplete' && localStorage.getItem('documentsUploaded') != 'true') {
        switch (type) {
          case 'nationalId':
            if (localStorage.getItem('document1') == '') {
              await firebase.storage().ref().child('userdocuments/' + 'Document-1-' + localStorage.getItem('currentUserID')).putString(image1, 'data_url');
              urlImage1 = await firebase.storage().ref().child('userdocuments/' + 'Document-1-' + localStorage.getItem('currentUserID')).getDownloadURL();
              localStorage.setItem('document1', urlImage1);
              data.document1URL = urlImage1;
            }

            if (localStorage.getItem('document2') == '') {
              await firebase.storage().ref().child('userdocuments/' + 'Document-2-' + localStorage.getItem('currentUserID')).putString(image2, 'data_url')
              urlImage2 = await firebase.storage().ref().child('userdocuments/' + 'Document-2-' + localStorage.getItem('currentUserID')).getDownloadURL();
              data.document2URL = urlImage2;
              localStorage.setItem('document2', urlImage2);
            }

            break;
          case 'passport':
            if (localStorage.getItem('document1') == '') {
              await firebase.storage().ref().child('userdocuments/' + 'Document-1-' + localStorage.getItem('currentUserID')).putString(image1, 'data_url');
              urlImage1 = await firebase.storage().ref().child('userdocuments/' + 'Document-1-' + localStorage.getItem('currentUserID')).getDownloadURL();
              data.document1URL = urlImage1;
              localStorage.setItem('document1', urlImage1);
            }

            break;
        }
        data.documentType = type;
        const result = await firebaseXhr(url, encodeURIComponent(JSON.stringify(data)));
        if (result.result) {
          localStorage.setItem('documentsUploaded', 'incomplete');
          showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
          document.getElementById('divVerifyDocuments').classList.add('displayNone');
          document.getElementById('divVerifySelfie').classList.remove('displayNone');
          document.getElementById("divVerifySelfie").style.animation = "panelLeft 0.4s ease";
        }
      } else {
        if (localStorage.getItem('documentsUploaded') == 'incomplete' || localStorage.getItem('documentsUploaded') == 'true') {
          showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
          switch (type) {
            case 'nationalId':
              if (document.getElementById('divWrongImage1').classList.contains('displayNone') || document.getElementById('divWrongImage2').classList.contains('displayNone')) {
                showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
                showSelfieStep();
              } else {
                showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
                showModalImagesError('imagesError');
              }
              break;
            case 'passport':
              if (document.getElementById('divWrongImage1').classList.contains('displayNone')) {
                showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
                showSelfieStep();
              } else {
                showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
                showModalImagesError('imagesError');
              }
              break;
          }
        } else {
          if (document.getElementById('divWrongImage1').classList.contains('displayNone') || document.getElementById('divWrongImage2').classList.contains('displayNone')) {
            showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
            showSelfieStep();
          } else {
            showHideButtonLoader('buttonUploadPhotos', 'hideLoader');
            showModalImagesError('imagesError');
          }
        }
      }
    } catch (err) {
      console.log('Error on  upload user documents ===> ', err)
    }

  }
  const showSelfieStep = () => {
    document.getElementById('divVerifyDocuments').classList.add('displayNone');
    document.getElementById('divVerifySelfie').classList.remove('displayNone');
    document.getElementById("divVerifySelfie").style.animation = "panelLeft 0.4s ease";
  }
  const uploadUserSelfie = async () => {
    try {
      if (localStorage.getItem('selfie') == '') {
        await firebase.storage().ref().child('userdocuments/' + 'Selfie-' + localStorage.getItem('currentUserID')).putString(selfie, 'data_url');
        const urlSelfie = await firebase.storage().ref().child('userdocuments/' + 'Selfie-' + localStorage.getItem('currentUserID')).getDownloadURL();
        const fullName = document.getElementById('fullName').value;
        const data = {
          selfie: urlSelfie,
          real_name: fullName,
          code: document.getElementById('pCode').innerText
        };
        const url = functionBaseURL + '/app/saveUserDocuments';
        const result = await firebaseXhr(url, encodeURIComponent(JSON.stringify(data)));
        if (result.result) {
          document.getElementById('divVerifySelfie').classList.add('displayNone');
          document.getElementById('basicVerification').classList.remove('displayNone');
          document.getElementById('divTabsGetVerified').classList.remove('displayNone');
          setDivVerified('inprocess');
          localStorage.setItem('selfie', urlSelfie);
          localStorage.setItem('documentsUploaded', 'true');
        }
      } else {
        if (document.getElementById('divIconWrongSelfie').classList.contains('displayNone')) {
          document.getElementById('divVerifySelfie').classList.add('displayNone');
          document.getElementById('basicVerification').classList.remove('displayNone');
          setDivVerified('inprocess');
        } else {
          showModalImagesError('imagesError');
        }
      }


      showHideButtonLoader('buttonUploadSelfie', 'hideLoader');
    } catch (err) {
      showHideButtonLoader('buttonUploadSelfie', 'hideLoader');
      console.log('Error on uploading selfie ==> ', err);
    }

  }

  const showModalImagesError = (errorType) => {
    const instanceImageError = mobiscroll.popup('#modalImagesError', {
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
        switch (errorType) {
          case 'imagesError':
            document.getElementById('textImagesError').innerHTML = i18next.t('imagesWrong');
            break;

          case 'imagesEmpty':
            document.getElementById('textImagesError').innerHTML = i18next.t('pleaseSelectTheDocuments');
            break;
        }

      }
    });
    instanceImageError.show();

  }

  function hideConfirmTransaction() {
    document.getElementById('spanWalletAddress').innerText = '';
    document.getElementById('spanAmount').innerText = '';
    document.getElementById('spanPaymentId').innerText = '';
    document.getElementById('fiatAmountWithdraw').innerText = '';

    document.getElementById('confirmWithdraw').classList.add('displayNone');
    document.getElementById('confirmWithdraw').style.animation = "";

    document.getElementById('formConvertTubes').classList.remove('displayNone');
    document.getElementById('donationAmountTubeIcon').classList.add('displayNone');
    document.getElementById('formConvertTubes').style.animation = 'listPop 0.7s ease';


  }

  function showConfirmTransaction() {

    // const wallet = 'bxdaKnt164beX5ttnoTWEQfLt6C6ReJwoG6k1zntjG9kbLB4SG8CU4d1TQZaL8ZsT974N1TCANK1b86etYSiJWdK2DjemW7pH';
    //const wallet = 'bxcXDHXdRh3VigYDeyjUk5DXtw647Fu5rNxYQGEgDyKCCtJRTYc7wMpAGchhqLbC7FSr2xTycfJstVT4f6BmRpT21UyruJbct';
    const wallet = 'Tubed9cu85xHtFsAro495WPuJL7dTZFj19JrJL2ZuNebYpmSd98iRgBHT7obUZRQ31UG95gayFJfDauuu5r434Hd6pXZrQmUU2C';
    const amount = document.getElementById('transferTUBEs').value;
    const paymentId = randHex(64);
    document.getElementById('fiatAmountWithdraw').innerText = document.getElementById('totalQuantity').innerText + ' ' + localStorage.getItem('currencySelected');
    document.getElementById('spanWalletAddress').innerText = wallet;
    document.getElementById('spanAmount').innerHTML = amount; //+ ' <i class="icon-font-tube tubeFont10"></i> + fee';
    document.getElementById('spanPaymentId').innerText = paymentId;
    document.getElementById('formConvertTubes').classList.add('displayNone');
    document.getElementById('donationAmountTubeIcon').classList.remove('displayNone');
    document.getElementById('formConvertTubes').style.animation = '';
    document.getElementById('confirmWithdraw').classList.remove('displayNone');
    document.getElementById('confirmWithdraw').style.animation = "listPop 0.7s ease";
  }

  function verify2FASecret(secret, callback) {
    if (secret != '') {
      firebase.auth().currentUser.getIdToken().then(function (token) {
        const url = functionBaseURL + '/app//verifySecret?userToken=' + secret + '&action=verifySecret';
        sendGetRequest(url, token, function (user, response) {
          try {
            if (callback)
              callback(response);
          } catch (ex) {
            console.log(response);
          }
        });
      });
    } else {
      const error = [i18next.t('fieldRequired')];
      const inputWithError = ['input2FAdeleteAccount'];
      setErrors(error, inputWithError);
    }

  }

  const showModalStake = () => {
    const instanceModalStake = mobiscroll.popup('#modalStake', {
      display: 'center',
      closeOnOverlayTap: false,
      cssClass: 'popUpResendEmail',
      buttons: [{
        text: i18next.t('close'),
        cssClass: 'buttonModdal',
        handler: function (event, inst) {
          inst.hide();
        }
      }, {
        text: i18next.t('proceed'),
        cssClass: 'buttonModdal marginLeft10px',
        handler: function (event, inst) {
          window.open(window.location.origin + '/wallet/index.html#!/stake');
        }
      }],
      onBeforeShow: function (ev, inst) {

      }
    });
    instanceModalStake.show();
  }
  const showModalUserNotVerified = (status) => {
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
        switch (status) {
          case 'processingDocuments':
            document.getElementById('textUserModal').innerHTML = i18next.t('processingText');
            break;
          case 'finishProcess':
            document.getElementById('textUserModal').innerHTML = i18next.t('completeVerification');
            break;
          case 'startProcess':
            document.getElementById('textUserModal').innerHTML = i18next.t('userInfoConvertMyTubes');
            break;
        }
      }
    });
    instanceModalUserNotVerified.show();
  }

  function showModalConfirm() {
    const instanceModalLogin = mobiscroll.popup('#modifyAccountModal', {
      display: 'center',
      closeOnOverlayTap: false,
      cssClass: 'popUpResendEmail',
      buttons: [{
          text: i18next.t('confirm'),
          cssClass: 'buttonModdal',
          handler: function (event, inst) {
            const url = functionBaseURL + '/app/modifyAccount?account_name=' + document.getElementById('bankName').innerText;
            showHideButtonLoader('modifyAccount', 'showLoader');

            firebase.auth().currentUser.getIdToken().then(function (token) {
              sendGetRequest(url, token, function (user, response) {
                showHideButtonLoader('modifyAccount', 'hideLoader');
                if (JSON.parse(response).result == 'Success') {
                  localStorage.setItem('userAccountLinked', false);
                  localStorage.setItem('accountMarkedForDelete', true);
                  document.getElementById('formConvertTubes').classList.add('displayNone');
                  document.getElementById('linkBankForm').classList.remove('displayNone');
                  document.getElementById('linkBankForm').style.animation = "listPop 0.7s ease";
                  inst.hide();
                }
              });
            });
          }
        },

        {
          text: i18next.t('cancel'),
          cssClass: 'buttonModdalGrey',
          handler: function (event, inst) {
            inst.hide();

          }
        }
      ],
      onBeforeShow: function (ev, inst) {
        // document.getElementById('userLoginEmail').textContent = email;
      }
    });

    instanceModalLogin.show();
  }

  function showVerifyBankAccount() {
    localStorage.removeItem('userInfoAccount');
    const form = document.getElementById('linkBankForm');
    if (form != undefined) {
      for (var f = 0; f < form.elements.length; f++) {
        form.elements[f].value = '';
      }
    }

    form.classList.add('displayNone');
    document.getElementById('formVerifyBank').classList.remove('displayNone');
    document.getElementById('verificationCode').value = 'TUBE-';
    document.getElementById('formVerifyBank').style.animation = "listPop 0.7s ease";

  }

  const showWithdrawView = async () => {
    try {

      document.getElementById('divAccountOptions').classList.add('displayNone');
      document.getElementById('divConvertTubes').classList.remove('displayNone');
      document.getElementById('formConvertTubes').classList.remove('displayNone');
      document.getElementById("formConvertTubes").style.animation = "panelLeft 0.4s ease";

      const tubeValue = await fetchTUBEValue(localStorage.getItem('currencySelected'));
      if (tubeValue != undefined) {
        let currencySymb = tubeValue.currency;
        switch (tubeValue.currency) {
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
        const value = (25 / tubeValue.value).toFixed(2);
        const valueAvailable = (new Number(document.getElementById('spanBalance').innerText) * tubeValue.value).toFixed(2);
        document.getElementById('valueBalance').innerHTML = valueAvailable + ' ' + currencySymb;
        document.getElementById('transferTUBEs').value = value;
        document.getElementById('quantityToTransfer').innerHTML = value + ' <i class="icon-font-tube tubeFont10"></i> / <span id="totalQuantity">' + 25 + '</span> ' + currencySymb;
      }

    } catch (err) {

    }

  }

  function showUserConvertTubes(data, fromVerify = false) {
    const form = document.getElementById('formVerifyBank');
    if (form != undefined) {
      for (var f = 0; f < form.elements.length; f++) {
        form.elements[f].value = '';
      }
    }

    if (fromVerify) {
      const form = document.getElementById('linkBankForm');
      if (form != undefined) {
        for (var f = 0; f < form.elements.length; f++) {
          form.elements[f].value = '';
        }
      }
      form.classList.add('displayNone');
    }
    fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
      let currencySymb = responseFetch.currency;
      switch (responseFetch.currency) {
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
      const value = (25 / responseFetch.value).toFixed(2);
      document.getElementById('transferTUBEs').value = value;
      document.getElementById('quantityToTransfer').innerHTML = value + ' <i class="icon-font-tube tubeFont10"></i> / <span id="totalQuantity">' + 25 + '</span> ' + currencySymb;
      document.getElementById('fiatAmountWithdraw').innerHTML = 25 + ' ' + currencySymb;
    });

    document.getElementById('bankName').innerText = data.account_name;
    document.getElementById('accountUserName').innerText = data.first_name + ' ' + data.last_name;
    document.getElementById('bankIBAN').innerText = data.IBAN;
    form.classList.add('displayNone');
    document.getElementById('formConvertTubes').classList.remove('displayNone');
    document.getElementById('formConvertTubes').style.animation = "listPop 0.7s ease";
  }

});

function randHex(length) {
  const maxLen = 8;
  const bound = Math.min(length, maxLen);
  const min = Math.pow(16, bound - 1);
  const max = Math.pow(16, bound) - 1;
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  let r = n.toString(16);
  while (r.length < length) {
    r += randHex(length - maxLen);
  }
  return r;
}

async function getUserWallets() {
  let token = await firebase.auth().currentUser.getIdToken();
  let wallets = await WalletHelpers.getWalletsInfo(token);
  const formInstance = mobiscroll.form('#formConvertTubes');
  var sel = document.getElementById('changeWallet');
  for (var key in wallets) {
    if (wallets.hasOwnProperty(key)) {
      var opt = document.createElement('option');
      opt.setAttribute('data-data', CryptoJS.AES.encrypt(JSON.stringify(wallets[key]), token));
      switch (key) {
        case 'onlinewallet':
          opt.innerHTML = 'Online wallet';
          loadSelectedWallet(CryptoJS.AES.encrypt(JSON.stringify(wallets[key]), token))
          break;
        case 'cardwallet':
          opt.innerHTML = 'Card wallet';
          break;
        default:
          opt.innerHTML = key;
          break;
      }

      if (key.indexOf('twitter') > -1 ||
        key.indexOf('youtube') > -1 ||
        key.indexOf('soundcloud') > -1 ||
        key.indexOf('facebook') > -1 ||
        key.indexOf('twitch') > -1 ||
        key.indexOf('module') > -1) {
        opt.innerHTML = key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ');
      } else if (key.indexOf('domain') > -1) {
        opt.innerHTML = key.replace('-', ' ').replace('_', '.');
      }

      opt.value = key;
      sel.appendChild(opt);
    }

    sel.value = 'onlinewallet';
    formInstance.controls.changeWallet._setText('Online wallet');

  }
}


const loadSelectedWallet = async (dataSelected) => {

  document.getElementById('loadingAvailable').classList.remove('displayNone');
  document.getElementById('available').innerHTML = '';
  document.getElementById('changeWallet').setAttribute('disabled', 'disabled');
  document.getElementById('buttonTransferTUBEs').setAttribute('disabled', 'disabled');

  try {
    const token = await getFirebaseToken();
    const data = CryptoJS.AES.decrypt(dataSelected, token);
    const walletInfo = JSON.parse(data.toString(CryptoJS.enc.Utf8));

    // public_address = walletInfo.public_addr;
    public_address = cnUtil.pubkeys_to_string(walletInfo.spend.pub, walletInfo.view.pub);
    public_keys = {
      view: walletInfo.view.pub,
      spend: walletInfo.spend.pub
    }
    secret_keys = {
      view: walletInfo.view.sec,
      spend: walletInfo.spend.sec
    }

    var parameters = {
      address: public_address,
      view_key: secret_keys.view,
    };

  } catch (error) {
    throw new Error(error);
  }

  try {
    const addressTxs = await WalletHelpers.getAddressTxs(parameters);
    const total_received = new BigInteger(addressTxs.total_received || 0);
    const total_received_unlocked = new BigInteger(addressTxs.total_received_unlocked || 0);
    const getAddressInfo = await WalletHelpers.getAddressInfo(parameters);
    const spent_outputs = (getAddressInfo.spent_outputs || []);

    if (spent_outputs.length > 0)
      processing(spent_outputs, getAddressInfo, total_received, total_received_unlocked);
    else {
      loadAvailBal(getAddressInfo, total_received, total_received_unlocked);
    }

  } catch (error) {
    throw new Error(error);
  }

}

const loadAvailBal = async (getAddressInfo, total_received, total_received_unlocked) => {
  var sent = new BigInteger(getAddressInfo.total_sent);
  var balance = total_received.subtract(sent);
  var unlocked_balance = total_received_unlocked.subtract(sent);
  var formatted_balance = parseFloat(cnUtil.formatMoneyFull(balance)).toFixed(2);
  var formatted_available_balance = parseFloat(cnUtil.formatMoneyFull(unlocked_balance)).toFixed(2);

  if (formatted_balance == formatted_available_balance) {
    try {
      const tubeValue = await fetchTUBEValue(localStorage.getItem('currencySelected'));
      if (tubeValue != undefined) {
        let currencySymb = tubeValue.currency;
        switch (tubeValue.currency) {
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
        availableBalanceDiv.innerHTML = `<span id="spanBalance">${formatted_balance}</span>${tube_icon} / <span id="valueBalance"> ` + (formatted_balance * tubeValue.value).toFixed(2) + ' ' + currencySymb + `</span>`;
        document.getElementById('loadingAvailable').classList.add('displayNone');
        availableBalanceDiv.classList.remove('displayNone');
        if (document.getElementById('buttonTransferTUBEs') != null) {
          document.getElementById('buttonTransferTUBEs').removeAttribute('disabled');
        }

        if (document.getElementById('changeWallet') != null) {
          document.getElementById('changeWallet').removeAttribute('disabled');
        }
      }

    } catch (error) {
      throw error;
    }

  } else {
    availableBalanceDiv.innerHTML = `<span id="spanBalance">${formatted_balance}</span>${tube_icon} / ${tube_icon}${formatted_available_balance} `;

    availableBalanceDiv.innerHTML = `${formatted_balance}${tube_icon} / ${tube_icon}${formatted_available_balance}`;
    document.getElementById('loadingAvailable').classList.add('displayNone');
    availableBalanceDiv.classList.remove('displayNone');
    if (document.getElementById('changeWallet') != null) {
      document.getElementById('changeWallet').removeAttribute('disabled');
    }

    if (document.getElementById('buttonTransferTUBEs') != null) {
      document.getElementById('buttonTransferTUBEs').removeAttribute('disabled');
    }

  }
}


function processing(spent_outputs, getAddressInfo, total_received, total_received_unlocked) {
  const spent_output = spent_outputs.shift();
  const key_image = cachedKeyImage(
    spent_output.tx_pub_key,
    spent_output.out_index
  );

  if (spent_output.key_image !== key_image) {
    getAddressInfo.total_sent = new BigInteger(getAddressInfo.total_sent).subtract(spent_output.amount);
  }

  if (spent_outputs.length > 0) {
    setTimeout(() => processing(spent_outputs, getAddressInfo, total_received, total_received_unlocked), 0);
  } else {
    loadAvailBal(getAddressInfo, total_received, total_received_unlocked);
  }
}

function cachedKeyImage(tx_pub_key, out_index) {
  var cache_index = tx_pub_key + ':' + public_address + ':' + out_index;
  if (key_images[cache_index]) {
    return key_images[cache_index];
  }
  key_images[cache_index] = cnUtil.generate_key_image(
    tx_pub_key,
    secret_keys.view,
    public_keys.spend,
    secret_keys.spend,
    out_index
  ).key_image;
  return key_images[cache_index];
}

async function transaction(walletAddress, ammount, paymentId, walletFrom) {

  const token = await getFirebaseToken();
  const data = CryptoJS.AES.decrypt(walletFrom, token);
  const walletInfo = JSON.parse(data.toString(CryptoJS.enc.Utf8));
  const selectInput = document.getElementById('changeWallet');

  // let public_address = walletInfo.public_addr;
  let public_address = cnUtil.pubkeys_to_string(walletInfo.spend.pub, walletInfo.view.pub);

  let pub_keys = {
    view: walletInfo.view.pub,
    spend: walletInfo.spend.pub
  }

  let sec_keys = {
    view: walletInfo.view.sec,
    spend: walletInfo.spend.sec
  }

  let login_success = await WalletHelpers.walletLogin(public_address, sec_keys.view);
  if (!login_success) {
    showTransactionError('Something went wrong. Please try again');
    return;
  }
  let parsed_amount;

  try {
    parsed_amount = mymonero_core_js.monero_amount_format_utils.parseMoney(ammount);
  } catch (e) {
    showTransactionError("Please enter a valid amount");
    return;
  }
  var params = {
    is_sweeping: false,
    payment_id_string: paymentId, //payId, // passed in
    sending_amount: parsed_amount.toString(), // sending amount
    from_address_string: public_address,
    sec_viewKey_string: sec_keys.view,
    sec_spendKey_string: sec_keys.spend,
    pub_spendKey_string: pub_keys.spend,
    to_address_string: walletAddress,
    priority: 1,
    unlock_time: 0, // unlock_time
    nettype: 0,
    get_unspent_outs_fn: function (req_params, cb) {
      WalletHelpers.getUnspentOuts(req_params, function (err_msg, res) {
        cb(err_msg, res);
      })
    },
    get_random_outs_fn: function (req_params, cb) {
      WalletHelpers.getRandomOuts(req_params, function (err_msg, res) {
        cb(err_msg, res);
      });
    },
    submit_raw_tx_fn: function (req_params, cb) {
      WalletHelpers.submitRawTx(req_params, function (err_msg, res) {
        cb(err_msg, res);
      });
    },
    status_update_fn: function (params) {},
    error_fn: function (params) {
      showTransactionError(params.err_msg);
    },
    success_fn: async function (params) {
      const sent_tx = {
        address: walletAddress,
        amount: ammount,
        paymentId: params.final_payment_id,
        tx_hash: params.tx_hash,
        tx_key: params.tx_prvkey,
        tx_fee: params.used_fee,
        fiat: localStorage.getItem('currencySelected'), //document.getElementById('quantityToTransfer').innerText.split(' ')[1],
        fiat_amount: document.getElementById('totalQuantity').innerText,
        status: 'incomplete',
        type: 'withdraw',
        name: document.getElementById('accountUserName').innerText,
        account_name: document.getElementById('bankName').innerText,
        fromWallet: selectInput.options[selectInput.options.selectedIndex].innerText
      };

      const data = {
        suffix: 'withdraw',
        type: 0,
        data: sent_tx
      };
      showTransactionSent(sent_tx);
      await WalletHelpers.addHistory(token, data);
      // showHideButtonLoader('buttonConfirm', 'hideLoader');
    },
  }

  let blockchain_height = await WalletHelpers.getBlockchainHeight(public_address, sec_keys.view);
  if (!blockchain_height) {
    showTransactionError('Failed to retrieve blockchain height please try again');
    return;
  }

  let coreBridge_instance = await mymonero_core_js.monero_utils_promise;
  // coreBridge_instance.set_current_blockchain_height(blockchain_height);
  coreBridge_instance.async__send_funds(params);
}


function showTransactionSent(data_transaction) {
  const instanceTransactionSent = mobiscroll.popup('#transactionSent', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail transactionModal',
    buttons: [{
      text: i18next.t('close'),
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        inst.hide();
        document.getElementById('buttonCancel').click();
        const selectWallet = document.getElementById('changeWallet');
        const dataSelected = selectWallet.options[selectWallet.options.selectedIndex].getAttribute('data-data');

        loadSelectedWallet(dataSelected);
        // window.location.href = '/airtime.html';
      }
    }],
    onBeforeShow: function (ev, inst) {
      showHideButtonLoader('buttonConfirm', 'hideLoader');
      // document.getElementById('userDonated').innerText = data_transaction.username;
      document.getElementById('amountDonated').innerHTML = '<i class="icon-font-tube tubeFont"></i>' + data_transaction.amount + ' / <label id="fiatValueDonated"></label> <br><label class="modalDate">' + new Date(Date.now()).toUTCString().split('GMT')[0];
      fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {

        if (responseFetch != undefined) {
          let currencySymb = responseFetch.currency;
          switch (responseFetch.currency) {
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
          document.getElementById('fiatValueDonated').innerHTML = (new Number(data_transaction.amount) * responseFetch.value).toFixed(2) + ' ' + currencySymb
        }
      });
      document.getElementById('paymentIdSpan').innerText = data_transaction.paymentId;
      // document.getElementById('addrUserWallet').innerText = data_transaction.address;
      document.getElementById('tx_hash').innerHTML = '<a target="blank" href=https://explorer.bittube.cash/tx/' + data_transaction.tx_hash + '>' + data_transaction.tx_hash + '</a>';

      new QRCode(document.getElementById('qrDonation'), {
        text: "https://explorer.bittube.cash/tx/" + data_transaction.tx_hash,
        width: 75,
        height: 75,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
      });

      const labelQR = document.createElement('label');
      labelQR.className = 'labelQR';
      labelQR.innerHTML = i18next.t('bittube') + '<br>' + i18next.t('transactionExplorer'); //'BitTube <br> transaction explorer';
      document.getElementById('qrDonation').appendChild(labelQR);
    }
  });

  instanceTransactionSent.show();
}

function showDonationError(error) {

  const instanceDonationError = mobiscroll.popup('#transactionError', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail transactionModal',
    buttons: [{
      text: i18next.t('close'),
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        window.location.href = '/airtime.html';
        inst.hide();
      }
    }],
    onBeforeShow: function (ev, inst) {
      showHideButtonLoader('buttonConfirm', 'hideLoader');
      document.getElementById('donationError').innerText = error;

    }
  });

  instanceDonationError.show();
}

function fillTransferButton(amount) {
  fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
    if (responseFetch != undefined) {
      let currencySymb = responseFetch.currency;
      switch (responseFetch.currency) {
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
      const result = '<span id="totalQuantity">' + (new Number(amount) * new Number(responseFetch.value)).toFixed(2) + '</span>' + ' ' + currencySymb;
      document.getElementById('quantityToTransfer').innerHTML = amount + ' <i class="icon-font-tube tubeFont10"></i> / ' + result;
      document.getElementById('fiatAmountWithdraw').innerHTML = result;
    }
  });


}

function showTransactionError(error) {
  const instanceTransactionError = mobiscroll.popup('#transactionError', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
      text: 'Ok',
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        inst.hide();
        document.getElementById('buttonCancel').click();
      }
    }],
    onBeforeShow: function (ev, inst) {
      showHideButtonLoader('buttonConfirm', 'hideLoader')
      document.getElementById('donationError').innerText = error;

    }
  });

  instanceTransactionError.show();
}


function validateIBAN(iban) {
  var newIban = iban.toUpperCase(),
    modulo = function (divident, divisor) {
      var cDivident = '';
      var cRest = '';

      for (var i in divident) {
        var cChar = divident[i];
        var cOperator = cRest + '' + cDivident + '' + cChar;

        if (cOperator < parseInt(divisor)) {
          cDivident += '' + cChar;
        } else {
          cRest = cOperator % divisor;
          if (cRest == 0) {
            cRest = '';
          }
          cDivident = '';
        }

      }
      cRest += '' + cDivident;
      if (cRest == '') {
        cRest = 0;
      }
      return cRest;
    };

  if (newIban.search(/^[A-Z]{2}/gi) < 0) {
    return false;
  }

  newIban = newIban.substring(4) + newIban.substring(0, 4);

  newIban = newIban.replace(/[A-Z]/g, function (match) {
    return match.charCodeAt(0) - 55;
  });

  return parseInt(modulo(newIban, 97), 10) === 1;
}

function setDataAccount(data) {
  if (data.accountName != '') {
    document.getElementById('accountName').placeholder = '';
    document.getElementById('accountName').value = data.accountName;
    document.getElementById('labelAccountName').style.animation = 'labelAppear 0.5s ease-out forwards';
  }

  if (data.firstName != '') {
    document.getElementById('firstName').placeholder = '';
    document.getElementById('firstName').value = data.firstName;
    document.getElementById('labelFirstName').style.animation = 'labelAppear 0.5s ease-out forwards';

  }

  if (data.lastName != '') {
    document.getElementById('lastName').placeholder = '';
    document.getElementById('lastName').value = data.lastName;
    document.getElementById('labelLastName').style.animation = 'labelAppear 0.5s ease-out forwards';
  }

  if (data.IBAN != '') {
    document.getElementById('userIBAN').placeholder = '';
    document.getElementById('userIBAN').value = data.IBAN;
    document.getElementById('labelIBAN').style.animation = 'labelAppear 0.5s ease-out forwards';
  }

  if (data.BIC != '') {
    document.getElementById('bic-swift').value = data.BIC;
    document.getElementById('bic-swift').placeholder = '';
    document.getElementById('labelBIC').style.animation = 'labelAppear 0.5s ease-out forwards';
  }

}

const showHideDeletePhone = async () => {
  const claims = await getFirebaseClaims();
  if (!claims.hasPhone) {
    if (!claims.verified) {
      showVerifyPhone();
    }else{
      if ( document.getElementById('showReferral') != null ){
        document.getElementById('showReferral').classList.remove('displayNone')
      }
    }
    document.getElementById('showReferral').classList.add('displayNone');
    document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
  } else {
    document.getElementById('showReferral').classList.remove('displayNone');
    document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
  }

}

const showGetVerifiedProcess = async () => {
  const claims = await getFirebaseClaims();
  if ( !claims.hasKYC ){
    if ( localStorageEx.get('rmdCd') != null ){
      document.getElementById('pCode').innerHTML = localStorageEx.get('rmdCd');
    }else{
      const code = Math.floor(1000 + Math.random() * 9000);
      document.getElementById('pCode').innerHTML = code;
      localStorageEx.set('rmdCd', code , 800);
    }

    document.getElementById('pDate').innerHTML = new Date(Date.now()).toLocaleString().split(',')[0].replace(/\//g, '.')
  }

  if (!claims.hasPhone && document.getElementById('airtimeMessagesContainer').style.top == '96px') {
    document.getElementById('airtimeMessagesContainer').style.top = '70px';
    document.getElementById('airtimeMessagesContainer').style.opacity = '0';
  }
  if (claims.verified) {
    document.getElementById('stakeTUBEs').setAttribute('disabled', 'disabled');
  }
  if (claims.verified || claims.hasPhone) {
    document.getElementById('checkBasicTab').classList.remove('displayNone');
  } else {
    document.getElementById('checkBasicTab').classList.add('displayNone');
  }
  if (claims.hasKYC) {
    document.getElementById('checkPlusTab').classList.remove('displayNone');
  } else {
    document.getElementById('checkPlusTab').classList.add('displayNone');
  }

  document.getElementById('divAccountOptions').classList.add('displayNone');
  document.getElementById('divGetVerified').classList.remove('displayNone');
  document.getElementById("divGetVerified").style.animation = "panelLeft 0.4s ease";
  if (localStorage.getItem('documentType') == null) {
    localStorage.setItem('documentType', 'nationalId');
  } else {
    if (localStorage.getItem('documentType') == 'passport') {
      document.getElementById('passportCheck').click();
    }
  }

}