// add donate button twitter

console.log('in content js');

let fullWallet;
//creates css Class
function createClass(name, rules) {
  var style = document.createElement('style');
  style.type = 'text/css';
  if (document.getElementsByTagName('head' [0] != null)) {
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  if (!(style.sheet || {}).insertRule)
    (style.styleSheet || style.sheet).addRule(name, rules);
  else
    style.sheet.insertRule(name + "{" + rules + "}", 0);
}
//adds css class to element (or removes)
function applyClass(name, element, doRemove) {
  if (typeof element.valueOf() == "string") {
    element = document.getElementById(element);
  }
  if (!element) return;
  if (doRemove) {
    element.className = element.className.replace(new RegExp("\\b" + name + "\\b", "g"));
  } else {
    element.className = element.className + " " + name;
  }
}

function randHex(len) {
  var maxlen = 8,
    min = Math.pow(16, Math.min(len, maxlen) - 1),
    max = Math.pow(16, Math.min(len, maxlen)) - 1,
    n = Math.floor(Math.random() * (max - min + 1)) + min,
    r = n.toString(16);
  while (r.length < len) {
    r = r + randHex(len - maxlen);
  }
  return r;
};

function createModalDonation(platform = '') {

  // ELEMENTS MAIN DIV
  let needFee;
  let using_outs_amount;
  var bittube = document.createElement("div");
  var bittubecontent = document.createElement("div");
  bittube.id = "myBittube";
  bittubecontent.className = "bittube-content";
  bittube.className = "bittube";
  // console.log('HELLO !!! ****** ===> ')
  // BUTTON FOR CLOSE
  var close = document.createElement("span");
  close.id = "closeBitTubeModal";
  close.innerText = "×";
  close.className = "close";
  close.onclick = function () {
    document.getElementById('myBittube').removeAttribute('data-profile');
    document.getElementById('myBittube').style.display = "none";
    document.getElementById('myBittube').dataset.userinfo = "";
    document.getElementById('myBittube').children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + "  ";
    document.getElementById('donationSection').style.display = "block";
    document.getElementById('divConfirmDonation').style.display = "none";
    document.getElementById('divResultDonation').style.display = 'none';
    document.getElementById('div2FA').style.display = "none";
    document.getElementById('verify2fa').innerText = "Verify";
    document.getElementById('verify2fa').removeAttribute("disabled");
    document.getElementById('input2fa').value = '';
    document.getElementById('input2fa').innerText = "Confirm";
    document.getElementById('input2fa').removeAttribute('disabled');
    document.getElementById('needsLogin').style.display = "none";

    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //"Confirm";
    document.getElementById('buttonConfirm').removeAttribute("disabled");
    document.getElementById('buttonConfirm').setAttribute("data-action", "sendDonation");
    document.getElementById('spanTube').innerText = '';
    document.getElementById('inputDonation').value = "1"

  }

  // ELEMENTS NEEDED FOR DONATION FORM
  /* HEADER */
  const divSectionSeparator = document.createElement("div");
  divSectionSeparator.className = "sectionSeparator";
  const spanDonatioText = document.createElement("span");
  spanDonatioText.className = 'translate';
  spanDonatioText.id = "spanTitleModal";
  spanDonatioText.innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span><span id='spanTube'></span> " + i18next.t('to') + " ";
  divSectionSeparator.appendChild(spanDonatioText);
  /* FORM */
  const divDonateSection = document.createElement("div");
  divDonateSection.className = "donateSection";
  divDonateSection.id = "donationSection";
  const divPadding10 = document.createElement("div");
  divPadding10.className = "padding10";
  const divNoOverFlow = document.createElement("div");
  divNoOverFlow.className = "overflowHidden";
  const buttonDonate1 = document.createElement("button");
  buttonDonate1.className = "customButtonStyle customButtonStyleSelected floatLeft";
  buttonDonate1.id = "donate1";
  buttonDonate1.innerText = "1";
  const buttonDonate2 = document.createElement("button");
  buttonDonate2.className = "customButtonStyle floatLeft buttondonate2";
  buttonDonate2.id = "donate2";
  buttonDonate2.innerText = "2";
  const buttonDonate5 = document.createElement("button");
  buttonDonate5.className = "customButtonStyle floatLeft buttondonate5";
  buttonDonate5.id = "donate5";
  buttonDonate5.innerText = "5";
  const buttonDonate10 = document.createElement("button");
  buttonDonate10.className = "customButtonStyle floatLeft";
  buttonDonate10.id = "donate10";
  buttonDonate10.innerText = "10";
  // Append buttons to div;
  divNoOverFlow.appendChild(buttonDonate1);
  divNoOverFlow.appendChild(buttonDonate2);
  divNoOverFlow.appendChild(buttonDonate5);
  divNoOverFlow.appendChild(buttonDonate10);

  // Append div with buttons to padding10
  divPadding10.appendChild(divNoOverFlow);

  // Create div with input for custom donation
  const divCustomFormGroup = document.createElement("div");
  divCustomFormGroup.className = "customFormGroup";
  const labelInput = document.createElement("label");
  labelInput.className = "labelInput";
  const spanInput = document.createElement("span");
  spanInput.className = "spanInput translate";
  spanInput.innerHTML = i18next.t('OtherAmount'); //"Other amount...";
  // spanInput.setAttribute('data-i18n', 'OtherAmount');
  const spanWrap = document.createElement("span");
  spanWrap.className = "spanWrap";
  const inputDonation = document.createElement("input");

  inputDonation.className = "inputDonation";
  inputDonation.id = "inputDonation";
  inputDonation.step = "0.01";
  inputDonation.value = "1";
  inputDonation.min = "0.01";
  inputDonation.type = "number";
  const buttonDonate = document.createElement("button");
  buttonDonate.id = "donate";
  buttonDonate.innerHTML = i18next.t('donate'); //"Donate";
  // buttonDonate.setAttribute('data-i18n', 'donate');
  buttonDonate.className = "customButtonStyle customButtonStyleSelected buttonInput translate";

  // CREATE CONFIRM DONATION.
  const divConfirmDonation = document.createElement('div');
  divConfirmDonation.id = 'divConfirmDonation';
  divConfirmDonation.style.display = 'none';
  divConfirmDonation.className = "padding10";
  divConfirmDonation.align = "center";
  const pWallet = document.createElement('p');
  pWallet.className = "font13 pDonateToPublisher breakWord noMarginTop";
  const spanTitleWalletAddress = document.createElement('span');
  spanTitleWalletAddress.id = "titleWallet";
  // spanTitleWalletAddress.setAttribute('data-i18n', "walletAddress");
  spanTitleWalletAddress.className = 'translate';
  console.log('********************* =====> ', i18next.t('walletAddress'));
  spanTitleWalletAddress.innerHTML = i18next.t('walletAddress');

  const breakLineWallet = document.createElement('br');
  const breakLine = document.createElement('br');
  const spanWalletAddress = document.createElement('span');
  spanWalletAddress.id = "spanWalletAddress";
  spanWalletAddress.className = 'breakAll';

  pWallet.appendChild(spanTitleWalletAddress);
  pWallet.appendChild(breakLineWallet);
  pWallet.appendChild(spanWalletAddress);
  divConfirmDonation.appendChild(pWallet);

  const pAmountPlusFees = document.createElement('p');
  pAmountPlusFees.className = "font13 pDonateToPublisher breakWord noMarginTop";

  const breakLineAmount = document.createElement('br');

  const feesTitle = document.createElement('span');
  // feesTitle.setAttribute('data-i18n', 'amount');
  feesTitle.className = 'translate';
  feesTitle.innerHTML = i18next.t('amount'); // 'Amount: ';

  const spanFees = document.createElement('span');
  spanFees.id = 'spanFees';
  spanFees.className = 'translate';
  // spanFees.setAttribute('data-i18n', 'calculating');
  spanFees.innerHTML = i18next.t('calculating');

  pAmountPlusFees.appendChild(feesTitle);
  pAmountPlusFees.appendChild(breakLineAmount);
  pAmountPlusFees.appendChild(spanFees);
  divConfirmDonation.appendChild(pAmountPlusFees);

  const pPaymentId = document.createElement('p');
  pPaymentId.className = 'font13 pDonateToPublisher breakWord noMarginTop translate';
  const spanTitlePaymentId = document.createElement('span');
  spanTitlePaymentId.innerText = i18next.t('paymentID'); //'Payment ID:';
  // spanTitlePaymentId.setAttribute('data-i18n', '[prepend]paymentID');
  const spanPaymentId = document.createElement('span');
  spanPaymentId.id = 'spanPaymentId';
  pPaymentId.appendChild(spanTitlePaymentId);
  pPaymentId.appendChild(breakLine);
  pPaymentId.appendChild(spanPaymentId);
  divConfirmDonation.appendChild(pPaymentId);

  // CREATE DIV RESULT DONATION
  const divResultDonation = document.createElement('div');
  divResultDonation.id = "divResultDonation";
  divResultDonation.style.display = 'none';
  divResultDonation.className = 'padding20';

  const pTitleResult = document.createElement('p');
  pTitleResult.id = "pTitleResult";
  pTitleResult.align = "center";
  pTitleResult.className = 'translate';
  pTitleResult.style = "font-size: 12px; margin-top: 0px; margin-bottom: 10px;";
  const divResult = document.createElement('div');
  divResult.className = 'divResult';

  const divContent = document.createElement('div');
  divContent.id = "contentResult";
  divContent.align = "center";
  const labelResult = document.createElement('label');
  labelResult.className = 'labelResult translate';
  // labelResult.setAttribute('data-i18n', 'transactionInfo');
  labelResult.innerText = i18next.t('transactionInfo'); //'Transaction info';

  divResult.appendChild(labelResult);
  divResult.appendChild(divContent);
  divResultDonation.appendChild(pTitleResult);
  divResultDonation.appendChild(divResult);

  // CREATE DIV WITH BUTTONS CONFIRM CANCEL DONATION
  const divButtonsConfirmDonation = document.createElement('div');
  divButtonsConfirmDonation.className = "divButtonsConfirmCancel marginTop20 marginBottom20";
  divButtonsConfirmDonation.align = "center";
  const buttonConfirmDonation = document.createElement('button');
  buttonConfirmDonation.id = "buttonConfirm";
  buttonConfirmDonation.className = "confirmCancelButton buttonGreen marginRight10 translate";
  buttonConfirmDonation.innerHTML = i18next.t('confirm'); // "Confirm";
  // buttonConfirmDonation.setAttribute('data-i18n', 'confirm');
  buttonConfirmDonation.setAttribute('data-action', 'sendDonation');

  //
  const needsLogin = document.createElement('div');
  needsLogin.id = "needsLogin";
  needsLogin.style.display = "none";
  const needsLogin10 = document.createElement('div');
  needsLogin10.className = "padding10";
  needsLogin10.innerText = i18next.t('needsExtensionLogin'); //"To continue with the donation please login in the extension.";
  needsLogin10.align = "center";
  needsLogin10.style.display = "grid";
  needsLogin10.style.fontSize = "13px";
  const needsLoginButton = document.createElement('button');
  needsLoginButton.className = "confirmCancelButton buttonGreen marginRight10";
  needsLoginButton.innerHTML = "OK";
  needsLoginButton.style.width = "23%";
  needsLoginButton.style.margin = "10px auto";

  needsLoginButton.onclick = function () {
    document.getElementById('closeBitTubeModal').click();
  }

  needsLogin10.appendChild(needsLoginButton);
  needsLogin.appendChild(needsLogin10);

  // CREATE DIV 2FA CODE !
  // CREATE DIV WITH BUTTONS CONFIRM CANCEL DONATION
  const div2faSection = document.createElement('div');
  div2faSection.className = 'donateSection';
  div2faSection.id = "div2FA";
  div2faSection.style.height = "130px";
  div2faSection.style.display = "none";

  const div2faPadding = document.createElement('div');
  div2faPadding.className = 'padding10';
  div2faPadding.align = "center";

  const div2faCustomFormGroup = document.createElement('div');
  div2faCustomFormGroup.className = 'customFormGroup';

  const label2faInput = document.createElement('label');
  label2faInput.className = 'labelInput';

  const spanInput2fa = document.createElement('span');
  spanInput2fa.className = 'spanInput';
  spanInput2fa.innerText = "2FA Code";

  const spanWrapInfo2fa = document.createElement('span');
  spanWrapInfo2fa.id = "spanWrapInfo2fa";
  spanWrapInfo2fa.className = 'spanWrap';

  const input2fa = document.createElement('input');
  input2fa.className = 'inputDonation';
  input2fa.id = "input2fa";
  input2fa.maxLength = "6";
  input2fa.type = "text";

  const buttonVerify2fa = document.createElement('button');
  buttonVerify2fa.className = 'customButtonStyle customButtonStyleSelected';
  buttonVerify2fa.id = "verify2fa";
  buttonVerify2fa.innerText = "Verify";
  buttonVerify2fa.style.width = "90%";
  // buttonVerify2fa.style.marginTop = "10px";

  spanWrapInfo2fa.appendChild(input2fa);
  label2faInput.appendChild(spanInput2fa);
  label2faInput.appendChild(spanWrapInfo2fa);
  div2faCustomFormGroup.appendChild(label2faInput);
  div2faPadding.appendChild(div2faCustomFormGroup);
  div2faPadding.appendChild(buttonVerify2fa);
  div2faSection.appendChild(div2faPadding);

  buttonVerify2fa.onclick = function () {
    if (document.getElementById('error2fa') != null) {
      document.getElementById('error2fa').remove();
    }
    const code = input2fa.value;
    chrome.runtime.sendMessage({
      message: "sendDonation",
      action: 'verifyCode',
      code: code,
      amount: document.getElementById('ammountToDonate').innerText,
      wallet: fullWallet,
      paymentid: spanPaymentId.innerText,
      usertodonate: document.getElementById('userToDonate').innerText,
      platform: platform
    }, function (responseDonation) {
      if (checkBrowser() == 'chrome') {
        if (responseDonation.message == 'errorCode') {
          handleErrorCode(responseDonation.error);
        } else if (responseDonation.message == 'correctCode') {
          handleCorrectCode();
        }
      }
    })

  }

  input2fa.onkeypress = function (e) {
    if (e.keyCode == 13) {

      if (input2fa.value == '') {
        document.getElementById('input2fa').style.borderColor = '#ff0000';
        const spanError = document.createElement('span');
        spanError.id = "error2fa";
        spanError.innerText = 'The code is required';
        spanError.className = "error";
        spanWrapInfo2fa.appendChild(spanError);
      } else {
        buttonVerify2fa.click();
      }

    }
  }

  buttonConfirmDonation.onclick = function () {
    console.log('click on button !?? ')
    var tube = document.getElementById("myBittube");
    //makeApiCall(document.getElementById("myBittube").getAttribute('data-domaininfo'))

    // TODO SEND DONATION
    let action = buttonConfirmDonation.getAttribute('data-action');
    console.log('ACTION !!!! ===> ', action)
    buttonConfirmDonation.innerHTML = '<i id="loaderDonation" class="loader"></i>';
    buttonConfirmDonation.setAttribute("disabled", "disabled");
    document.getElementById('contentResult').innerHTML = '';
    chrome.runtime.sendMessage({
      message: "sendDonation",
      action: action,
      amount: document.getElementById('ammountToDonate').innerText,
      wallet: fullWallet,
      paymentid: spanPaymentId.innerText,
      usertodonate: document.getElementById('userToDonate').innerText,
      platform: platform
    }, function (responseDonation) {
      if (checkBrowser() == 'chrome') {
        console.log('RESPONSEDONATION');
        console.log(responseDonation);
        if (responseDonation.message == 'userNotLoggedIn') {
          handleUserNotLoggedIn();
        } else if (responseDonation.message == 'userHasSecurity') {
          handleUserHasSecurity();
        } else if (responseDonation.message == 'errorOnDonation') {
          handleErrorOnDonation(responseDonation.data);
        } else if (responseDonation.message == 'donationSent') {
          handleDonationSent(responseDonation.data);

        }

      }

    });

  }

  const buttonCancelDonation = document.createElement('button');
  buttonCancelDonation.id = "buttonCancel";
  buttonCancelDonation.className = "confirmCancelButton buttonGray translate";
  // buttonCancelDonation.setAttribute('data-i18n', 'cancel');
  buttonCancelDonation.innerHTML = i18next.t('cancel'); //"Cancel";

  divButtonsConfirmDonation.appendChild(buttonConfirmDonation);
  divButtonsConfirmDonation.appendChild(buttonCancelDonation);
  divConfirmDonation.appendChild(divButtonsConfirmDonation);
  // CLICKS ON BUTTONS DONATE
  buttonDonate.onclick = function () {
    const user = getUser(platform);
    const amount = parseFloat(inputDonation.value).toFixed(2);

    if (amount == 0) {
      document.getElementById('inputDonation').style.borderColor = '#ff0000';
      const spanError = document.createElement('span');
      spanError.id = "error2fa";
      spanError.innerText = 'The minimun amount is 0.01';
      spanError.className = "error";
      spanError.style.top = "44px";
      labelInput.appendChild(spanError);
    } else {

      if (document.getElementById('error2fa') != null) {
        document.getElementById('error2fa').remove();
      }
      document.getElementById('inputDonation').style.borderColor = "#dfdfdf";

      chrome.runtime.sendMessage({
        message: "getWallet",
        username: user,
        domain: platform
      }, function (response) {
        if (checkBrowser() == 'chrome') {
          if (response.message == "gotWallet") {

            document.getElementById('donationSection').style.display = "none";
            document.getElementById('divConfirmDonation').style.display = "block";
            document.getElementById('spanWalletAddress').innerText = localStorage.getItem('walletToDonate');
            // document.getElementById('spanFees').setAttribute('data-i18n', 'calculating');
            // document.getElementById('spanFees').innerText = i18next.t('calculating'); //'Calculating';
            fullWallet = convertAddress(response.wallet);
            spanWalletAddress.innerText = fullWallet;
            spanPaymentId.innerText = randHex(64);

            sendDonationMessage('ammountToDonate', platform)

            if (amount <= 1) {
              document.getElementById('ammountToDonate').innerText = amount;
              document.getElementById('spanTube').innerText = 'TUBE';
            } else if (amount > 1) {
              document.getElementById('ammountToDonate').innerText = amount;
              document.getElementById('spanTube').innerText = 'TUBEs';
            }

          } else if (response.message == 'noAllow') {
            showNeedsLogin();
          }
        }
      });
    }
  }

  buttonDonate1.onclick = function () {
    sendDonationMessage('donate1', platform);
  }

  buttonDonate2.onclick = function () {
    sendDonationMessage('donate2', platform);
  }
  buttonDonate5.onclick = function () {
    sendDonationMessage('donate5', platform);
  }
  buttonDonate10.onclick = function () {
    sendDonationMessage('donate10', platform);
  }

  buttonCancelDonation.onclick = function () {
    if (document.getElementById('error2fa') != null) {
      document.getElementById('error2fa').remove();
    }
    document.getElementById('inputDonation').style.borderColor = "#dfdfdf";
    document.getElementById('inputDonation').value = "1";

    document.getElementById('donationSection').style.display = "block";
    document.getElementById('divConfirmDonation').style.display = "none";
    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm') //"Confirm";
    document.getElementById('buttonConfirm').removeAttribute("disabled");
    document.getElementById('buttonConfirm').setAttribute("data-action", "sendDonation");
    document.getElementById('ammountToDonate').innerText = '';
    document.getElementById('spanTube').innerText = '';
  }

  spanWrap.appendChild(inputDonation);
  labelInput.appendChild(spanInput);
  labelInput.appendChild(spanWrap);
  labelInput.appendChild(buttonDonate);
  divCustomFormGroup.appendChild(labelInput);
  divPadding10.appendChild(divCustomFormGroup);
  divDonateSection.appendChild(divPadding10);

  // APPEND DONATION TO MODAL
  bittubecontent.appendChild(close);
  bittubecontent.appendChild(divSectionSeparator);
  bittubecontent.appendChild(divDonateSection);
  bittubecontent.appendChild(divConfirmDonation);
  bittubecontent.appendChild(divResultDonation);
  bittubecontent.appendChild(div2faSection);
  bittubecontent.appendChild(needsLogin);

  bittube.appendChild(bittubecontent);

  // STYLE DONATION IN MODAL

  // CLASSES MAIN DIV
  createClass('.translate', 'font-weight: normal;');
  createClass('.divButtonsConfirmCancel', 'display: flex; margin: 0 auto; width: 60%;')
  createClass('.loader', 'position: absolute; width: 10px; height: 10px; left: 40px; top: 7px; border: 2px dotted #ffffff;border-radius: 50%;border-top: 2px dotted #ffffff;');
  createClass('.bittube', "color: #343434; display: none; position: fixed !important; z-index: 10000; padding-top: 100px; left: 0;  top: 0 !important;  width: 100% !important; height: 100%;  overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);");
  createClass('.bittube-content', "background-color: #ffffff; margin: 15% auto; padding: 0px; border:none;width: 360px; position: relative");
  // CLASSES CLOSE BUTTON
  if (platform == 'twitch') {
    createClass('.close', "position: absolute; font-size: 20px; font-weight: normal;right: 10px;color:#ffffff;z-index: 9;top: -4px;");
  } else if (platform == 'soundcloud') {
    createClass('.close', "position: absolute; font-size: 20px; font-weight: normal;right: 10px;color:#ffffff;z-index: 9;top: 3px;");
  } else {
    createClass('.close', "position: absolute; font-size: 20px; font-weight: normal;right: 10px;color:#ffffff;z-index: 9;top: 5px;");
  }

  createClass('.close:hover', "color:#ffffff;opacity: 0.8; cursor: pointer;");
  createClass('.close:focus', "color:#ffffff;opacity: 0.8; cursor: pointer;");
  createClass('.margin5', "margin: 5px !important");
  // CLASSES FOR STYLE DONATE FORM
  if (platform == 'twitch' || platform == 'amazon') {
    createClass('.sectionSeparator', "box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;float: none;margin: 0;overflow: hidden;position: relative;text-align: center;width: 100%;background-color: #343434;color: white;z-index: 0;height: 25px;padding-top: 4px;font-family: 'Open Sans',sans-serif !important;font-size: 13px !important;");
  } else {
    createClass('.sectionSeparator', "box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;float: none;margin: 0;overflow: hidden;position: relative;text-align: center;width: 100%;background-color: #343434;color: white;z-index: 0;height: 25px;padding-top: 10px;font-family: 'Open Sans',sans-serif !important;font-size: 13px !important;");
  }

  createClass('.donateSection', "height: 110px;background: transparent;min-height: 110px;position: relative;");
  createClass('.padding10', "padding: 10px;");
  createClass('.overflowHidden', "overflow: hidden;");
  createClass('.customButtonStyle', "outline: none !important; text-align: center; height: 32px;font-size: 13px;padding: 6px;background: transparent;width: 23%;text-decoration: none;margin: 0;outline: 0;overflow: visible;cursor: pointer;color: #333333;border: 1px solid #dfdfdf;border-radius: 4px;");
  createClass('.customButtonStyle:hover', "outline: none !important; box-shadow: none; border-color: #dfdfdf;");
  createClass('.customButtonStyle:focus', "outline: none !important; box-shadow: none; border-color: #dfdfdf;");
  createClass('.floatLeft', "float: left;");
  createClass('.customButtonStyleSelected', "outline: none !important; background: #00abff;color: #ffffff;cursor: pointer;border-color: #00abff;border-radius: 4px;");
  createClass('.customButtonStyle:hover', "outline: none !important; box-shadow: none; border-color: #00abff;");
  createClass('.customButtonStyle:focus', "outline: none !important; box-shadow: none; border-color: #00abff;");
  createClass('.customFormGroup', "float: left;width: 100%;");
  createClass('.labelInput', "margin: .875em 1em 1.75em 1em !important;width: 93%;position: relative;float: left;");
  if (platform == 'twitter' || platform == 'amazon') {
    createClass('.spanInput', "color: #343434; left: 1.083334em;right: auto;position: absolute;top: 6px;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;");
  } else if (platform == 'soundcloud' || platform == "twitch") {
    createClass('.spanInput', "color: #343434; left: 1.083334em;right: auto;position: absolute;top: 8px;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;");
  } else {
    createClass('.spanInput', "color: #343434; left: 1.083334em;right: auto;position: absolute;top: .833334em;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;");
  }

  createClass('.inputDonation:hover', "box-shadow: none !important; border-color: #dfdfdf; outline: none !important; color:#343434;");
  createClass('.inputDonation:focus', "box-shadow: none !important; border-color: #dfdfdf; outline: none !important; color:#343434;");

  createClass('.spanWrap', "    padding-top: 1em;position: relative;display: block;");
  createClass('.inputDonation', "outline: none !important; background: #ffffff; color: #343434; outline: 0;height: 32px;border-radius: 4px !important;padding: 8px;border: 1px solid #dfdfdf;box-sizing: border-box;line-height: 20px;font-size: 13px !important;text-align: center;width: 100%;");

  if (platform == 'facebook' || platform == 'twitch' || platform == 'soundcloud') {
    createClass('.buttonInput', "outline: none !important; text-transform: uppercase;position: absolute !important;top: 12px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;");
  } else if (platform == "twitter") {
    createClass('.buttonInput', "outline: none !important; text-transform: uppercase;position: absolute !important;top: 14px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;");
  } else if (platform == "amazon") {
    createClass('.buttonInput', "outline: none !important; text-transform: uppercase;position: absolute !important;top: 13px;right: 0px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;");
  } else {
    createClass('.buttonInput', "outline: none !important; text-transform: uppercase;position: absolute !important;top: 10px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;");
  }

  createClass('.buttondonate2', 'margin: 0 2.3%;');
  createClass('.buttondonate5', "margin: 0 2.3% 0 0;");
  createClass('.error', "position: absolute;left: 10px;top: 48px;color: red;")

  // CREATE CLASS FOR CONFIRM DONATION SECTION
  createClass('.divConfirmDonation', "padding-left: 10px;padding-right: 10px;");
  createClass('.textConfirmDonation', "font-size: 13px;word-break: break-word;margin-bottom: 10px; margin-top: 10px");
  createClass('.noMarginBottom', "margin-bottom: 0px !important;");
  createClass('.noMarginTop', "margin-top: 0px !important;");
  createClass('.margin20', "margin-top: 20px !important; margin-bottom: 20px !important;");
  createClass('.marginRight10', "margin-right: 10px;");

  createClass('.breakAll', "word-break: break-all;");

  createClass('.font13', "font-size: 13px;");
  createClass('.pDonateToPublisher', "margin-bottom: 10px; margin-top: 10px;");
  createClass('.breakWord', "word-break: break-all");
  createClass('.marginTop20', "margin-top: 20px !important;");
  createClass('.padding20', "padding: 20px !important;");

  createClass('.confirmCancelButton', "position: relative; outline: none !important; font-size: 14px; height: 32px; width: auto; outline: none; cursor: pointer; min-width: 100px");
  createClass('.buttonGray', "outline: none !important; background: #ffffff; color: #343434; border: 1px solid #dfdfdf; height: 32px; cursor: pointer; border-radius: 4px;");
  createClass('.buttonGreen', "outline: none !important; min-width: 100px; background: #00baff; color: #ffffff; border: 1px solid #00abff; height: 32px; cursor: pointer; border-radius: 4px;");
  createClass('.labelResult', "position: absolute; top: -6px; font-size: 10px; padding-left: 5px; padding-right: 5px; background: #ffffff;");
  createClass('.divResult', "    min-height: 140px;border: 1px solid #dfdfdf;border-radius: 4px;padding: 10px;font-size: 13px;font-weight: normal;position: relative;")
  // Apply classes
  applyClass('translate', 'translate');
  applyClass('loader', 'loader');
  applyClass("labelResult", "labelResult");
  applyClass("error", "error");
  applyClass("divResult", "divResult");
  applyClass("padding20", "padding20");

  applyClass("bittube", "bittube");
  applyClass("bittube-content", "bittube-content");
  applyClass("close", "close");
  applyClass("close:hover", "close");
  applyClass("close:focus", "close");
  applyClass("inputDonation:hover", "inputDonation");
  applyClass("inputDonation:focus", "inputDonation");
  applyClass("margin5", "margin5");
  applyClass("sectionSeparator", "sectionSeparator");
  applyClass("donateSection", "donateSection");
  applyClass("padding10", "padding10");
  applyClass("overflowHidden", "overflowHidden");
  applyClass("customButtonStyle", "customButtonStyle");
  applyClass("customButtonStyle:hover", "customButtonStyle");
  applyClass("customButtonStyle:focus", "customButtonStyle");
  applyClass("floatLeft", "floatLeft");
  applyClass("customButtonStyleSelected", "customButtonStyleSelected");
  applyClass("customButtonStyleSelected:hover", "customButtonStyleSelected");
  applyClass("customButtonStyleSelected:focus", "customButtonStyleSelected");
  applyClass("customFormGroup", "customFormGroup");
  applyClass("labelInput", "labelInput");
  applyClass("spanInput", "spanInput");
  applyClass("spanWrap", "spanWrap");
  applyClass("inputDonation", "inputDonation");
  applyClass("buttonInput", "buttonInput");
  applyClass("buttondonate2", "buttondonate2");
  applyClass("buttondonate5", "buttondonate5");
  applyClass('divConfirmDonation', 'divConfirmDonation');
  applyClass('textConfirmDonation', 'textConfirmDonation');
  applyClass('noMarginBottom', 'noMarginBottom');
  applyClass('noMarginTop', 'noMarginTop');
  applyClass('margin20', 'margin20');
  applyClass('breakAll', 'breakAll');
  applyClass('font13', "font13");
  applyClass('pDonateToPublisher', "pDonateToPublisher");
  applyClass('breakWord', "breakWord");
  applyClass('marginTop20', "marginTop20");
  applyClass('marginRight10', "marginRight10");

  return bittube;
}
var currentUser;
var currentUserYt;
var currentLink;
var currentVideoYT;
var currentUserTwitter;
var currentSong;
var currentUserAmazon;

// CALL FUNCTION TO CREATE MODAL;
// const bittube = createModalDonation();
//   close.onclick = function() {
//     document.getElementById('myBittube').style.display="none";
//   }

//Get message from Background on UrlChange

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  fbhash = request.hash;
  console.log(request)
  if (request.message == 'errorCode') {
    handleErrorCode(request.error)
  } else if (request.message == 'correctCode') {
    handleCorrectCode();
  } else if (request.message == 'userNotLoggedIn') {
    handleUserNotLoggedIn();
  } else if (request.message == 'userHasSecurity') {
    handleUserHasSecurity();
  } else if (request.message == 'errorOnDonation') {
    handleErrorOnDonation(request.data);
  } else if (request.message == 'donationSent') {
    handleDonationSent(request.data);
  } else if (request.message == 'gotWallet' && document.getElementById('myBittube').style.display == 'block') {
    responseGotWallet(request, localStorage.getItem('buttonDonate'), request.platform);
  } else if (request.message == "newUrl") {
    var gotdata = false
    console.log("***************** newurl *****************");
    setTranslations(request.lang);
    //----------------------------------------------------------------------if on twitter----------------------------------------------------------------------------------
    if (window.location.href.indexOf("twitter.com") > -1) {
      //creation of popup
      const bittube = createModalDonation('twitter');
      if (document.getElementById("doc") != undefined) {
        document.getElementById("doc").appendChild(bittube)
      }

      if (window.location.href.split("https://twitter.com/")[1] != "" && window.location.href.split("https://twitter.com/")[1].split("?")[0] != "") {

        if (document.readyState == 'complete') {
          console.log('READY STATE !!! ')
          var hasusername = false;
          var User = window.location.href.split("https://twitter.com/")[1].split("/")[0].split("?")[0];
          var elemente = document.getElementsByClassName("ProfileHeading-toggle")[0];
          if (elemente != undefined && elemente != null) {
            if (elemente.dataset.bitTube == undefined) {
              elemente.dataset.bitTube = "true"
              var div = document.createElement("li")
              var button = document.createElement("button")
              var logo = document.createElement("img");
              // div.style.position = "absolute";
              // div.style.left = "65%";
              // div.style.bottom = "14px";
              div.className = 'ProfileHeading-toggleItem  u-textUserColor';
              // button.style.paddingRight="6px";
              // button.style.paddingLeft="6px";
              // button.style.borderRadius = "100px";
              // button.style.boxShadow = "none";
              // button.style.cursor = "pointer";
              // button.style.fontSize = "14px";
              // button.style.fontWeight = "bold";
              // button.style.lineHeight = "20px";
              // button.style.padding = "6px 16px";
              // button.style.position = "relative";
              // button.style.textAlign = "center";
              // button.style.whiteSpace = "nowrap";
              // button.style.backgroundColor = "transparent";
              // button.style.border = "1px solid #66757f";
              // button.style.color = "#66757f";
              // button.style.cursor="pointer";
              button.className = 'ProfileHeading-toggleLink js-nav';
              button.style.outline = 'none';
              button.innerText = "Donate TUBEs"
              button.onclick = function () {
                tube = document.getElementById('myBittube')
                tube.style.display = "block";
                var User = window.location.href.split("https://twitter.com/")[1].split("/")[0].split("?")[0]

                if (User != undefined) {
                  tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>";
                  tube.setAttribute('data-userinfo', User);
                  tube.setAttribute('data-domaininfo', "twitter.com/")
                  console.log(User);

                }
              }

              div.appendChild(button)
              elemente.insertBefore(div, elemente.children[4]);
            }

          }

          if (currentUserTwitter != User && !hasusername) {

            hasusername = true
            currentUserTwitter = User;
            console.log('111');
            console.log("UserName: " + User)
            chrome.runtime.sendMessage({
              message: "UserContentjs",
              User: User,
              Domain: "twitter"
            })
          }

        }
      } else if (window.location.href.indexOf("status") > -1) {
        var elemente = document.getElementsByClassName("ProfileTweet-actionList js-actions");
        for (i = 0; i < elemente.length; i++) {
          if ((elemente[i].dataset.bitTube == undefined) && (elemente[i].clientHeight != "0")) {
            elemente[i].dataset.bitTube = "true"
            var div = document.createElement("div")
            var button = document.createElement("button")
            div.style.display = "inline-block";
            div.style.minWidth = "80px"
            div.style.verticalAlign = "top"

            button.style.position = "absolute"
            button.style.width = "150px";
            button.style.height = "20px";
            button.style.right = "50px"
            button.style.fontSize = "13px"
            button.style.fontWeight = "bold";
            button.style.paddingRight = "6px"
            button.style.paddingLeft = "6px";
            button.style.lineHeight = "2";
            button.style.color = "#657786"
            button.style.left = "65%"
            button.style.cursor = "pointer";
            button.innerText = "Donate TUBEs"
            button.onclick = function () {
              tube = document.getElementById('myBittube')
              tube.style.display = "block";
              var User = this.parentElement.parentElement.parentElement.parentElement.dataset.screenName;
              var ItemId = this.parentElement.parentElement.parentElement.parentElement.dataset.itemId;
              if (User != undefined && ItemId != undefined) {
                tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                tube.setAttribute('data-userinfo', User);
                tube.setAttribute('data-iteminfo', ItemId);
                tube.setAttribute('data-domaininfo', "twitter.com")
                console.log(User);
                console.log(ItemId);
              } else {
                User = this.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.screenName;
                ItemId = this.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.itemId;
                tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                tube.setAttribute('data-userinfo', User);
                tube.setAttribute('data-iteminfo', ItemId);
                tube.setAttribute('data-domaininfo', "twitter.com")
                console.log(User);
                console.log(ItemId);
              }
            }
            div.appendChild(button)
            elemente[i].appendChild(div);
          }
        }

      } else {
        var Domain = "twitter.com"
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        });

        // INSERT DONATE TUBEs BUTTON ON EACH TWEET MAIN PAGE;
        document.addEventListener('DOMNodeInserted', function (e) {
          var bool1 = false;
          if (document.getElementsByClassName("js-stream-item stream-item stream-item").length > 0) {
            var elemente = document.getElementsByClassName("ProfileTweet-actionList js-actions");
            for (i = 0; i < elemente.length; i++) {
              if ((elemente[i].dataset.bitTube == undefined) && (elemente[i].clientHeight != "0")) {
                elemente[i].dataset.bitTube = "true"
                var div = document.createElement("div");
                var button = document.createElement("button");
                div.style.display = "inline-block";
                div.style.minWidth = "80px";
                div.style.verticalAlign = "top";

                button.style.position = "absolute"
                button.style.width = "150px";
                button.style.height = "20px";
                button.style.right = "50px"
                button.style.fontSize = "13px"
                button.style.paddingRight = "6px"
                button.style.paddingLeft = "6px";
                button.style.lineHeight = "2";
                button.style.color = "#657786"
                button.style.left = "65%"
                button.style.cursor = "pointer";
                button.innerText = "Donate TUBEs";
                button.onclick = function () {
                  tube = document.getElementById('myBittube')
                  tube.style.display = "block";
                  var User = this.parentElement.parentElement.parentElement.parentElement.dataset.screenName;
                  var ItemId = this.parentElement.parentElement.parentElement.parentElement.dataset.itemId;
                  if (User != undefined && ItemId != undefined) {
                    tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                    tube.setAttribute('data-userinfo', User);
                    tube.setAttribute('data-iteminfo', ItemId);
                    tube.setAttribute('data-domaininfo', "twitter.com")
                    console.log(User);
                    console.log(ItemId);
                  } else {
                    User = this.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.screenName;
                    ItemId = this.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.itemId;
                    tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                    tube.setAttribute('data-userinfo', User);
                    tube.setAttribute('data-iteminfo', ItemId);
                    tube.setAttribute('data-domaininfo', "twitter.com")
                    console.log(User);
                    console.log(ItemId);
                  }
                }
                // button.appendChild(logo);
                try {
                  div.appendChild(button)
                  elemente[i].appendChild(div);
                  bool1 = true;
                } catch (e) {
                  console.log('Error => ', e)
                }
              }
            }
          }
        });

      }

    }
    //----------------------------------------------------------------------if on facebook----------------------------------------------------------------------------------
    else if (window.location.href.indexOf("facebook.") > 1) {
      var gotname = false;
      var eventgotname = false;
      var ActualUser;
      var ActualId;
      const bittube = createModalDonation('facebook');
      if (document.getElementById('myBittube') != null) {
        document.getElementById('myBittube').removeAttribute('data-profile');
      }
      if (document.getElementById("fbNotificationsJewel") != undefined) {
        document.getElementById("fbNotificationsJewel").appendChild(bittube)
      }

      if (window.location.href.split("facebook.com/")[1] == undefined || window.location.href.split("facebook.com/")[1] == "" || window.location.href.indexOf("groups/") > -1) {
        var Domain = "facebook.com"
        console.log(Domain)
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        });
      } else if (window.location.href.split("facebook.com/")[1] != undefined && window.location.href.indexOf("groups/") < 0) {

        document.addEventListener('DOMNodeInserted', function (e) {
          if (!gotname) {
            if (document.getElementsByClassName("_64-f")[0] != undefined && (!eventgotname) && (!gotname)) {
              var Domain = "facebook";
              var User = document.getElementsByClassName("_64-f")[0].pathname.split("/")[1];
              if (document.getElementsByClassName("_2dgj")[0] != undefined) {
                var UserId = document.getElementsByClassName("_2dgj")[0].href.split(".com/")[1].split("/")[0]

              }
              if (User != undefined && Domain != undefined) {
                if (User != currentUser && User != "" && Domain != "") {
                  currentUser = User;
                  currentLink = Domain;
                  console.log("User1: " + User)
                  console.log("Domain: " + Domain);
                  const contentDonate = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ActualUser + "'>" + ActualUser + "</span>";
                  const elementDonate = document.getElementById('spanTitleModal');
                  // const elementDonate = document.getElementById('myBittube').children[0].children[1].children[0];
                  if (elementDonate.innerHTML != contentDonate) {
                    gotname = true
                    elementDonate.innerHTML = contentDonate
                  }

                  ActualUser = User;
                  ActualId = UserId
                  chrome.runtime.sendMessage({
                    message: "UserContentjs",
                    User: User,
                    Domain: Domain,
                    UserID: ActualId
                  });
                }
              }
            } else if (document.getElementsByClassName("_2nlw _2nlv")[0] != undefined && (!eventgotname) && (!gotname)) {
              var Domain = "facebook";
              try {
                var User = document.getElementsByClassName("_2nlw _2nlv")[0].href.split("facebook.com/")[1];
                var UserId = document.getElementsByClassName("_1nv3 _11kg _1nv5 profilePicThumb")[0].href.split("fbid=")[1].split("&")[0];
              } catch (e) {

              }
              if (User != undefined && UserId != undefined) {
                if (User != currentUser) {

                  currentUser = User;
                  currentLink = Domain;
                  console.log("User1: " + User)
                  console.log("UserId: " + UserId)
                  console.log("Domain: " + Domain)
                  if (document.getElementById('myBittube') != null) {
                    document.getElementById('myBittube').setAttribute('data-profile', User);
                  }
                  gotname = true;
                  ActualUser = User;
                  ActualId = UserId
                  chrome.runtime.sendMessage({
                    message: "UserContentjs",
                    User: User,
                    Domain: Domain,
                    UserID: ActualId
                  });
                }
              }

            } else if (document.getElementsByClassName("_2dgj")[0] != undefined && (!eventgotname) && (!gotname)) {
              if (document.getElementsByClassName("_2dgj")[0].innerText != undefined && document.getElementsByClassName("_19s-")[0].pathname != undefined) {
                var Domain = "facebook";
                var User = document.getElementsByClassName("_19s-")[0].pathname.split("/")[1];
                var UserID = document.getElementsByClassName("_2dgj")[0].href.split(".com/")[1].split("/")[0];
                if (User != currentUser) {

                  currentUser = User;
                  currentLink = Domain;
                  console.log("User1: " + User)
                  console.log("UserId: " + UserId)
                  console.log("Domain: " + Domain);

                  if (document.getElementById('myBittube') != null) {
                    document.getElementById('myBittube').setAttribute('data-profile', User);
                  }
                  gotname = true;
                  ActualId = UserId
                  ActualUser = User;
                  chrome.runtime.sendMessage({
                    message: "UserContentjs",
                    User: User,
                    Domain: Domain,
                    UserID: ActualId
                  });
                }
              }
            }
            //checks if username has loaded
            if (!gotname && !eventgotname) {
              if (e.target.children != undefined) {
                if (e.target.children[0] != undefined) {
                  if (e.target.children[0].className != undefined) {
                    if (e.target.children[0].className.indexOf("_4jy0 _4jy3 _4jy2 _51sy selected _42ft") > -1 && (!eventgotname) && (!gotname)) {
                      if (document.getElementsByClassName("_64-f")[0] != undefined) {
                        var Domain = "facebook";
                        var User = document.getElementsByClassName("_64-f")[0].pathname.split("/")[1];

                        currentUser = User;
                        currentLink = Domain;
                        console.log("User4: " + User)
                        console.log("Domain: " + Domain);

                        if (document.getElementById('myBittube') != null) {
                          document.getElementById('myBittube').setAttribute('data-profile', User);
                        }

                        eventgotname = true;
                        ActualUser = User;
                        chrome.runtime.sendMessage({
                          message: "UserContentjs",
                          User: User,
                          Domain: Domain
                        });
                      } else if (document.getElementsByClassName("_2nlw _2nlv")[0] != undefined && (!eventgotname) && (!gotname)) {
                        var Domain = "facebook";
                        var User = document.getElementsByClassName("_2nlw _2nlv")[0].href.split("facebook.com/")[1];

                        currentUser = User;
                        currentLink = Domain;
                        console.log("User5: " + User)
                        console.log("Domain: " + Domain)

                        if (document.getElementById('myBittube') != null) {
                          document.getElementById('myBittube').setAttribute('data-profile', User);
                        }

                        eventgotname = true;
                        ActualUser = User;
                        chrome.runtime.sendMessage({
                          message: "UserContentjs",
                          User: User,
                          Domain: Domain
                        });
                      } else if (document.getElementsByClassName("_19s-")[0] != undefined && (!eventgotname) && (!gotname)) {
                        var Domain = "facebook";
                        var User = document.getElementsByClassName("_19s-")[0].pathname.split("/")[1];

                        currentUser = User;
                        currentLink = Domain;
                        console.log("User6: " + User)
                        console.log("Domain: " + Domain)

                        if (document.getElementById('myBittube') != null) {
                          document.getElementById('myBittube').setAttribute('data-profile', User);
                        }

                        eventgotname = true;
                        ActualUser = User;
                        chrome.runtime.sendMessage({
                          message: "UserContentjs",
                          User: User,
                          Domain: Domain
                        });
                      }

                    }
                  }
                }
              }
            }

            if (document.getElementById('myBittube') != undefined) {
              if (ActualUser == "undefined") {
                if (window.location.href.indexOf("profile.php?id=") > -1) {
                  UserId = window.location.href.split("profile.php?id=")[1].split("?")[0].split("&")[0]
                }

                try {
                  ActualUser = document.getElementsByClassName("_2nlw _2nlv")[0].innerText
                } catch (e) {

                }
              }

              if (ActualUser != undefined && !gotdata) {

                document.getElementById('myBittube').setAttribute('data-userinfo', ActualUser)
                document.getElementById('myBittube').setAttribute('data-userid', ActualId)

                try {
                  User = document.getElementsByClassName("_2nlw _2nlv")[0].innerText
                } catch (e) {

                }
                if (User != undefined) {

                  if (User.indexOf('?') > -1) {
                    User = User.split('?')[0];
                  } else {
                    User = User;
                  }
                  try {

                    const wantedContent = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ActualUser + "'>" + ActualUser + "</span>";
                    const el = document.getElementById('myBittube').children[0].children[1].children[0];
                    if (el.innerHTML != wantedContent) {
                      gotname = true
                      el.innerHTML = wantedContent
                    }

                  } catch (e) {

                  }
                }
              }

              var elemente4 = document.getElementsByClassName("_6_7 clearfix")[0];

              if (elemente4 != undefined) {

                if ((elemente4.dataset.bitTube == undefined) && (elemente4.clientHeight != "0")) {
                  gotdata = true;

                  elemente4.dataset.bitTube = "true"
                  var div = document.createElement("div")
                  var button = document.createElement("button");

                  var logo = document.createElement("img");
                  div.style.position = "absolute";
                  div.style.left = "200px";
                  div.style.bottom = "97px";
                  div.style.background = "#f5f6f7";
                  div.style.height = "26px";
                  div.style.border = "1px solid #5a5a5a";
                  button.style.position = "relative"
                  button.style.width = "110px";
                  button.style.height = "20px";
                  button.style.top = "0px"
                  button.style.left = "-6px"
                  button.style.fontSize = "12px"
                  button.style.fontWeight = "bold";
                  button.style.border = "none";
                  button.style.background = "transparent";
                  button.style.lineHeight = "26px";
                  button.style.color = "#4b4f56"

                  button.style.cursor = "pointer";
                  button.innerText = "Donate TUBEs";

                  console.log('AQUI DONATE TUBES !???? ')
                  button.onclick = function () {
                    tube = document.getElementById('myBittube')
                    tube.style.display = "block";

                    if (window.location.href.indexOf("profile.php?id=") > -1) {

                      UserId = window.location.href.split("profile.php?id=")[1].split("?")[0].split("&")[0]
                    }
                    try {
                      ActualUser = document.getElementsByClassName("_2nlw _2nlv")[0].innerText
                    } catch (e) {

                    }
                    if (ActualUser != undefined && ActualUser != 'undefined') {
                      tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + UserId + "'>" + ActualUser + "</span>"
                      console.log(this.ActualUser)
                      tube.setAttribute('data-userinfo', UserId);
                    }

                  }
                  div.appendChild(logo)
                  div.appendChild(button)
                  elemente4.appendChild(div);

                }
              } else {

                var elemente4 = document.getElementsByClassName("_4-u2 _hoc clearfix _4-u8")[0]
                if (elemente4 != undefined) {

                  if ((elemente4.dataset.bitTube == undefined) && (elemente4.clientHeight != "0")) {
                    gotdata = true;
                    elemente4.dataset.bitTube = "true"
                    var button = document.createElement("button");

                    button.className = '_rfh _4jy0 _4jy4 _517h _51sy _42ft';
                    button.style.marginLeft = '5px';
                    button.innerText = 'Donate TUBEs';

                    button.onclick = function () {
                      // tube = document.getElementById('myBittube')
                      // tube.style.display="block";
                      console.log('buttonClick !!! ')
                      document.getElementById('myBittube').style.display = 'block';
                    }

                    elemente4.children[0].insertBefore(button, elemente4.children[0].children[1]);
                  }
                }

              }
            }

          }

        })

      }

      document.addEventListener('DOMNodeInserted', function (e) {
        var bool3 = false
        //adds button to all content
        if (e.target.className != undefined) {

          if (e.target.className.indexOf("_4ikz") > -1 || e.target.className == "label" || e.target.className == "bittube" || e.target.className == "_zbd _400z _1vek _42ft" || e.target.className == "_3t5i" || e.target.className == " _3qry _4ubd _2lwf _3rno _6xrt" || e.target.className == "_4-u2 mbm _4mrt _5v3q _4-u8" || e.target.className == "_3a-4" || e.target.className == "_5qth _5vm9 uiPopover _6a _6e" || e.target.className == "_1dnh") {
            bool3 = true;
          }
        }
        if (bool3) {
          if (document.getElementsByClassName("_sa_ _gsd _fgm _5vsi _192z _1sz4 _1i6z").length > 0) {
            var elemente = document.getElementsByClassName("_sa_ _gsd _fgm _5vsi _192z _1sz4 _1i6z");
          } else {
            var elemente = document.getElementsByClassName('_78bu');
          }

          for (i = 0; i < elemente.length; i++) {
            if ((elemente[i].dataset.bitTube == undefined) && (elemente[i].clientHeight != "0")) {
              elemente[i].dataset.bitTube = "true";
              var button = document.createElement("button");
              button.style = "color: #616770;" +
                "font-size: 13px;" +
                "font-weight: 600;" +
                "height: 32px;" +
                "justify-content: center;" +
                "margin: 0;" +
                "padding: 0;" +
                "white-space: nowrap;" +
                "width: calc(100% - 20px);" +
                "border-top: 1px solid #e5e5e5;" +
                "border-bottom: none;" +
                "border-left: none;" +
                "border-right: none;" +
                "margin-left: 10px;" +
                "margin-right: 10px;" +
                "padding-top: 3px;" +
                "font-family: inherit;" +
                "text-align: center;" +
                "cursor: pointer;";
              button.innerText = "Donate TUBEs";
              button.onclick = function () {
                tube = document.getElementById('myBittube')
                tube.style.display = "block";
                var User2;
                try {
                  var User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                  User2 = this
                  console.log(User)
                } catch (e) {

                }
                try {
                  while (User2.className != "_3x-2") {
                    User2 = User2.parentElement;
                  }
                  console.log(User)
                } catch (e) {

                }
                if (User == undefined) {
                  try {
                    User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)
                  } catch (e) {

                  }
                }
                var Usertmp;
                if (User2 != undefined) {
                  if (User2.className != "_3x-2" || User == "groups") {
                    try {

                      User2 = this

                      for (i = 0; i < 20; i++) {
                        if (User2.className != "_5pcr userContentWrapper") {
                          User2 = User2.parentElement;
                        } else {
                          Usertmp = User2;
                          User2 = User2.parentElement;
                        }

                      }
                    } catch (e) {

                    }
                    try {
                      UserId = User2.children[0].children[1].children[0].children[0].children[0].dataset.hovercard.split("id=")[1].split("&")[0]
                      console.log(UserId)
                      try {
                        User = User2.children[0].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                        console.log(User)
                      } catch (e) {

                      }
                    } catch (e) {

                    }
                  }
                } else {

                  try {
                    User2 = this

                    for (i = 0; i < 20; i++) {
                      if (User2.className != "_5pcr userContentWrapper") {
                        User2 = User2.parentElement;

                      } else {
                        Usertmp = User2;
                        User2 = User2.parentElement;

                      }

                    }
                  } catch (e) {

                  }

                  try {

                    UserId = Usertmp.children[0].children[1].children[0].children[0].children[0].dataset.hovercard.split("id=")[1].split("&")[0]
                    console.log(UserId)
                  } catch (e) {

                  }

                  try {
                    UserId = Usertmp.children[0].children[0].children[1].children[0].children[0].dataset.hovercard.split("id=")[1].split("&")[0]
                    console.log(UserId)
                  } catch (e) {

                  }

                  try {

                    UserId = Usertmp.children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].dataset.hovercard.split("id=")[1].split("&")[0]
                    console.log(UserId)
                  } catch (e) {

                  }

                  try {
                    User = Usertmp.children[0].children[1].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)
                  } catch (e) {

                  }
                  try {
                    User = Usertmp.children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)
                  } catch (e) {

                  }

                }

                if (User == undefined || User == "groups") {
                  try {
                    User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)
                  } catch (e) {

                  }
                }
                if (User == undefined || User == "groups") {
                  try {
                    User = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(this)
                  } catch (e) {

                  }
                }

                if (User == undefined || User == "groups") {
                  try {
                    User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)

                  } catch (e) {

                  }
                }

                if (User == undefined || User == "groups") {
                  try {
                    User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)

                  } catch (e) {

                  }
                  try {

                    var User = this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].href.split("?")[0].split(".com/")[1].split("/")[0];
                    console.log(User)
                  } catch (e) {

                  }
                }
                if (window.location.href.indexOf("profile.php?id=") > -1) {

                  UserId = window.location.href.split("profile.php?id=")[1].split("?")[0].split("&")[0]
                }
                try {
                  User = document.getElementsByClassName("_2nlw _2nlv")[0].innerText
                } catch (e) {

                }
                if (User != undefined) {
                  tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                  console.log(User)
                  tube.setAttribute('data-userinfo', User);
                  tube.setAttribute('data-userid', UserId);
                  tube.setAttribute('data-domaininfo', "facebook.com");
                }

              }
              // div.appendChild(logo)
              // div.appendChild(button)
              elemente[i].appendChild(button);
              bool1 = false
            }
          }
        }

      })

    }
    //----------------------------------------------------------------------if on youtube----------------------------------------------------------------------------------
    else if (window.location.href.indexOf("youtube.") != -1) {
      const bittube = createModalDonation('youtube');
      youtubehasname = false;

      if (window.location.href.indexOf("channel") > -1 || window.location.href.indexOf("user") > -1) {

        if (document.readyState == 'complete') {

          console.log('DOCUMENT HAS BEEN LOADED !!! ');

          if (!youtubehasname) {
            if (document.getElementById("content") != undefined && document.getElementById("myBittube") == undefined) {
              document.getElementById("content").appendChild(bittube)
            }
            if (document.getElementById("channel-title") != undefined) {
              var ChannelName = document.getElementById("channel-title").innerHTML;
              var ChannelID = document.getElementById("channel-title").baseURI;
              var Domain = "youtube"
              if (currentVideoYT != ChannelID) {
                currentVideoYT = ChannelID;

                if (ChannelID != undefined) {
                  try {
                    ChannelID = ChannelID.split("/channel/")[1].split("/")[0]
                  } catch (e) {

                  }
                }

                console.log("ChannelID: " + ChannelID)
                console.log("ChannelName: " + ChannelName)
                console.log("Domain: " + Domain)
                youtubehasname = true;
                chrome.runtime.sendMessage({
                  message: "UserContentjs",
                  User: ChannelID,
                  Domain: Domain
                });
              }

              var elemente2 = document.getElementById("channel-header-container");

              if (elemente2.dataset.bitTube == undefined) {
                elemente2.dataset.bitTube = "true"
                var div = document.createElement("div");
                var button = document.createElement("button");
                var render = document.createElement("div");
                var string = document.createElement('span');
                // START THE MAGIC
                div.className = 'style-scope ytd-video-secondary-info-renderer';
                div.style.display = 'flex';
                div.style.flexDirection = 'column';
                div.style.justifyContent = 'center';
                render.style = '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
                  ' --yt-formatted-string-deemphasize_-_margin-left: 4px;' +
                  '--yt-formatted-string-deemphasize_-_display: initial;' +
                  'display: flex;' +
                  '-ms-flex-direction: row;' +
                  '-webkit-flex-direction: row;' +
                  'flex-direction: row;';
                render.style.color = 'hsl(0, 0%, 100%)';

                button.style = "background-color: var(--yt-spec-brand-button-background);" +
                  "border-radius: 2px;" +
                  "color: var(--yt-subscribe-button-text-color);" +
                  "padding: 10px 16px;" +
                  "margin: auto var(--ytd-subscribe-button-margin, 4px);" +
                  "white-space: nowrap;" +
                  "font-size: 1.4rem;" +
                  "font-weight: 500;" +
                  "letter-spacing: 0.007px;" +
                  "display: flex;" +
                  "flex-direction: row;" +
                  "border: none;" +
                  "transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);" +
                  "--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);" +
                  "--yt-formatted-string-deemphasize_-_margin-left: 4px;" +
                  "--yt-formatted-string-deemphasize_-_display: initial;" +
                  "-webkit-tap-highlight-color: transparent;" +
                  "font: inherit;" +
                  "justify-content: center;" +
                  "position: relative;" +
                  "box-sizing: border-box;" +
                  "min-width: 5.14em;" +
                  "font-family: 'Roboto', 'Noto', sans-serif;" +
                  "-webkit-font-smoothing: antialiased;" +

                  "border: var(--paper-button_-_border);" +
                  "color: var(--paper-button_-_color);" +
                  "width: var(--paper-button_-_width);" +
                  "margin: var(--paper-button_-_margin, 0 0.29em);" +
                  "text-transform: var(--paper-button_-_text-transform, uppercase);" +
                  "font-size: 1.4rem;" +
                  "font-weight: 500;" +
                  "letter-spacing: .007px;" +
                  "text-transform: uppercase;" +
                  "display: flex;";

                string.style = "white-space: nowrap;" +
                  "font-size: 1.4rem;" +
                  "font-weight: 500;" +
                  "letter-spacing: .007px;" +
                  "text-transform: uppercase;" +
                  "-webkit-tap-highlight-color: transparent;" +
                  "font: inherit;" +
                  "user-select: none;" +
                  "cursor: pointer;" +
                  "z-index: 0;" +
                  "font-family: 'Roboto', 'Noto', sans-serif;" +
                  "-webkit-font-smoothing: antialiased;";
                string.textContent = 'Donate TUBEs';

                button.onclick = function () {
                  tube = document.getElementById('myBittube')
                  tube.style.display = "block";

                  if (window.location.href.indexOf("/user/") > -1) {
                    User = window.location.href.split("user/")[1].split("/")[0];
                  } else if (window.location.href.indexOf("/channel/") > -1) {
                    User = window.location.href.split("/channel/")[1].split("/")[0];
                  }
                  // User = window.location.href.split("/channel/")[1].split("/")[0];
                  try {
                    User = this.parentElement.parentElement.parentElement.children[2].children[0].children[0].innerText
                  } catch (e) {

                  }
                  if (User != undefined) {
                    tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                    console.log(User)

                    tube.setAttribute('data-userinfo', User);
                    tube.setAttribute('data-userid', ChannelID);
                    tube.setAttribute('data-domaininfo', "youtube.com");

                  }

                }
                button.appendChild(string);
                render.appendChild(button);
                div.appendChild(render)
                elemente2.insertBefore(div, elemente2.children[4]);
                youtubehasname = true;
              } else {
                youtubehasname = true;
              }
            }
          }

        }

      } else if (window.location.href.indexOf("playlist?list") > -1) {
        Domain = "youtube.com"
        console.log("Domain: " + Domain)
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        });

      } else if (window.location.href.indexOf("watch?v") > -1) {
        var hasmodal = false;
        // CALL FUNCTION TO CREATE MODAL;
        // const bittube = createModalDonation('youtube');

        if (document.readyState == 'complete') {
          if (!hasmodal) {
            if ((document.getElementById("content") != undefined && document.getElementById("myBittube") == undefined) ||
              (document.getElementById("content") != undefined && document.getElementById("myBittube") == null)) {
              document.getElementById("content").appendChild(bittube)
              hasmodal = true;
            }
          }

          if (document.getElementsByTagName("YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER").length > 0) {

          }
        }

        document.addEventListener('DOMNodeInserted', function (e) {
          if (e.target.tagName != undefined) {
            if (e.target.tagName.indexOf("YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER") > -1) {
              var elemente2 = document.getElementsByClassName("style-scope ytd-video-secondary-info-renderer");
              for (i = 0; i < elemente2.length; i++) {
                if (elemente2[i].dataset.bitTube == undefined && elemente2[i].id == "top-row") {
                  elemente2[i].dataset.bitTube = "true"
                  var div = document.createElement("div");
                  var button = document.createElement("button");
                  var logo = document.createElement("img");
                  var render = document.createElement("div");
                  var string = document.createElement('span');

                  // START THE MAGIC
                  div.className = 'style-scope ytd-video-secondary-info-renderer';
                  div.style.display = 'flex';
                  div.style.flexDirection = 'column';
                  div.style.justifyContent = 'center';

                  render.style = '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
                    ' --yt-formatted-string-deemphasize_-_margin-left: 4px;' +
                    '--yt-formatted-string-deemphasize_-_display: initial;' +
                    'display: flex;' +
                    '-ms-flex-direction: row;' +
                    '-webkit-flex-direction: row;' +
                    'flex-direction: row;';
                  render.style.color = 'hsl(0, 0%, 100%)';

                  button.style = "background-color: var(--yt-spec-brand-button-background);" +
                    "border-radius: 2px;" +
                    "color: var(--yt-subscribe-button-text-color);" +
                    "padding: 10px 16px;" +
                    "margin: auto var(--ytd-subscribe-button-margin, 4px);" +
                    "white-space: nowrap;" +
                    "font-size: 1.4rem;" +
                    "font-weight: 500;" +
                    "letter-spacing: 0.007px;" +
                    "display: flex;" +
                    "flex-direction: row;" +
                    "border: none;" +
                    "transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);" +
                    "--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);" +
                    "--yt-formatted-string-deemphasize_-_margin-left: 4px;" +
                    "--yt-formatted-string-deemphasize_-_display: initial;" +
                    "-webkit-tap-highlight-color: transparent;" +
                    "font: inherit;" +
                    "justify-content: center;" +
                    "position: relative;" +
                    "box-sizing: border-box;" +
                    "min-width: 5.14em;" +
                    "font-family: 'Roboto', 'Noto', sans-serif;" +
                    "-webkit-font-smoothing: antialiased;" +

                    "border: var(--paper-button_-_border);" +
                    "color: var(--paper-button_-_color);" +
                    "width: var(--paper-button_-_width);" +
                    "margin: var(--paper-button_-_margin, 0 0.29em);" +
                    "text-transform: var(--paper-button_-_text-transform, uppercase);" +
                    "font-size: 1.4rem;" +
                    "font-weight: 500;" +
                    "letter-spacing: .007px;" +
                    "text-transform: uppercase;" +
                    "display: flex;";

                  string.style = "white-space: nowrap;" +
                    "font-size: 1.4rem;" +
                    "font-weight: 500;" +
                    "letter-spacing: .007px;" +
                    "text-transform: uppercase;" +
                    "-webkit-tap-highlight-color: transparent;" +
                    "font: inherit;" +
                    "user-select: none;" +
                    "cursor: pointer;" +
                    "z-index: 0;" +
                    "font-family: 'Roboto', 'Noto', sans-serif;" +
                    "-webkit-font-smoothing: antialiased;";
                  string.textContent = 'Donate TUBEs';

                  logo.src = "https://i.imgur.com/Yf2TkbY.png";
                  logo.style.position = "relative"
                  logo.width = "17";
                  logo.style.color = "#657786"
                  logo.height = "17";
                  logo.style.paddingRight = "6px"
                  logo.style.paddingLeft = "6px";
                  logo.style.right = "70px"
                  logo.style.bottom = "22px";
                  button.onclick = function () {
                    tube = document.getElementById('myBittube')
                    tube.style.display = "block";
                    var videoId = window.location.href.split("?v=")[1].split("&")[0].split("?")[0]
                    for (i = 0; i < document.getElementsByClassName("style-scope ytd-video-owner-renderer").length; i++) {
                      if (document.getElementsByClassName("style-scope ytd-video-owner-renderer")[i].id == "owner-name") {
                        User = document.getElementsByClassName("style-scope ytd-video-owner-renderer")[i].children[0].href.split("channel/")[1];
                        UserName = document.getElementsByClassName("style-scope ytd-video-owner-renderer")[i].children[0].innerHTML
                      }
                    }

                    if (UserName != undefined) {
                      console.log(videoId)
                      tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + UserName + "'>" + UserName + "</span>"
                    }
                    if (User != undefined) {

                      console.log(User)
                      tube.setAttribute('data-videoid', videoId);
                      tube.setAttribute('data-userid', User);
                      tube.setAttribute('data-userinfo', UserName);
                      tube.setAttribute('data-domaininfo', "https://www.youtube.com");
                      chrome.runtime.sendMessage({
                        message: "saveVideoId",
                        videoId: videoId,
                        Domain: 'youtube'
                      });
                    }

                  }
                  button.appendChild(string);
                  render.appendChild(button);
                  div.appendChild(render)
                  elemente2[i].insertBefore(div, elemente2[i].children[1]);
                }
              }
            }
          }
        })

        //Gets information from Youtube and sends it to webinfo.js and webinfodonation.js with message: "Youtube"
        youtubehasname = false;
        document.addEventListener('DOMNodeInserted', function (e) {
          if (e.target.tagName != undefined) {
            //console.log(e.target.tagName)
            if (e.target.tagName.indexOf("YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER") > -1 || e.target.tagName.indexOf("YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER" > -1)) {
              if (window.location.href.split("https://www.youtube.com/")[1] != undefined && window.location.href.split("https://www.youtube.com/")[1] != "") {
                var elemente = document.getElementsByTagName("yt-formatted-string");
                for (i = 0; i < elemente.length; i++) {
                  if ((elemente[i].id.indexOf("owner-name") > -1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1) && !youtubehasname) {
                    if ((elemente[i].children[0] != undefined)) {
                      try {
                        ChannelID = elemente[i].children[0].href.split("channel/")[1].split("&")[0];
                        VideoID = elemente[i].children[0].baseURI.split("watch?v=")[1].split("&")[0];
                        ChannelName = elemente[i].children[0].innerHTML;
                        Domain = "youtube"
                      } catch (e) {

                      }

                      if (currentUserYt != ChannelID) {
                        youtubehasname = true;
                        currentUserYt = ChannelID
                        console.log("ChannelID: " + ChannelID)
                        console.log("VideoID: " + VideoID)
                        console.log("ChannelName: " + ChannelName)
                        console.log("Domain: " + Domain)
                        chrome.runtime.sendMessage({
                          message: "UserContentjs",
                          User: ChannelID,
                          Domain: Domain
                        })
                      }
                    }
                  }
                }

              }

            }
          }

        })

      } else {
        Domain = "youtube.com"
        console.log("Domain: " + Domain)
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        });
      }
    }

    //----------------------------------------------------------------------if on twitch----------------------------------------------------------------------------------
    else if (window.location.href.indexOf("twitch.") > -1) {
      var currentUserTwitch
      var twitchhasname = false;
      if (window.location.href.indexOf("/videos") > -1) {
        document.addEventListener('DOMNodeInserted', function (e) {
          if (e.path.length == "6") {
            var elemente = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
            if (elemente.length != "0" && !twitchhasname) {
              ChannelName = elemente[0].nextSibling.innerHTML;
              if (ChannelName.indexOf("<span") < 0) {
                if (ChannelName != currentUserTwitch) {
                  VideoID = elemente[0].baseURI.split("videos/")[0].split(".tv/")[1].split("?")[0].split("/")[0];
                  twitchhasname = true;
                  currentUserTwitch = ChannelName;
                  Domain = "twitch.tv"
                  console.log("Channel: " + ChannelName)
                  console.log("VideoID: " + VideoID)
                  chrome.runtime.sendMessage({
                    message: "UserContentjs",
                    User: ChannelName,
                    Domain: Domain
                  });
                }
              }
            }

            // CALL FUNCTION TO CREATE MODAL;
            const bittube = createModalDonation('twitch');
            if (document.getElementById("root") != undefined && document.getElementById("myBittube") == undefined) {
              document.getElementById("root").appendChild(bittube)
            }

            var elemente2 = document.getElementsByClassName("channel-header__right tw-align-items-center tw-flex tw-flex-nowrap tw-flex-shrink-0")[0];
            if (elemente2 != undefined) {
              if (elemente2.dataset.bitTube == undefined) {
                elemente2.dataset.bitTube = "true"
                var div = document.createElement("div")
                var button = document.createElement("button")
                var logo = document.createElement("img");
                var text = document.createElement("span");
                div.className = 'tw-align-items-stretch tw-flex tw-mg-l-1';
                button.className = 'tw-interactive tw-button';
                text.className = 'tw-button__text';
                text.textContent = 'Donate TUBEs';
                button.onclick = function () {
                  tube = document.getElementById('myBittube')
                  tube.style.display = "block";
                  tube.setAttribute('data-userinfo', ChannelName);
                  tube.setAttribute('data-domaininfo', "twitch.tv");
                  tube.children[0].children[1].children[0].innerHTML = i18next.t("donate") + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ChannelName + "'>" + ChannelName + "</span>"
                }
                button.appendChild(text)
                div.appendChild(button)
                elemente2.insertBefore(div, elemente2.children[0]);
              }
            }

          }

        })
      } else if (window.location.href.split("twitch.tv/")[1] != "" && window.location.href.indexOf("directory/") < 0) {

        if (document.readyState == 'complete') {
          var elemente = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
          if (elemente.length != "0" && !twitchhasname) {
            ChannelName = elemente[0].baseURI.split("twitch.tv/")[1].split("/")[0];
            Domain = "twitch"
            twitchhasname = true;
            console.log("Channel: " + ChannelName)
            console.log("Domain: " + Domain)
            chrome.runtime.sendMessage({
              message: "UserContentjs",
              User: ChannelName,
              Domain: Domain
            });
          }

          const bittube = createModalDonation('twitch');
          if (document.getElementById("root") != null && document.getElementById("myBittube") == null) {
            document.getElementById("root").appendChild(bittube);
          }

          var elemente2 = document.getElementsByClassName("channel-header__right tw-align-items-center tw-flex tw-flex-nowrap tw-flex-shrink-0")[0];
          if (elemente2.dataset.bitTube == undefined) {

            elemente2.dataset.bitTube = "true";
            var div = document.createElement("div");
            var button = document.createElement("button");
            var logo = document.createElement("img");
            var text = document.createElement("span");
            div.className = 'tw-align-items-stretch tw-flex tw-mg-l-1';
            button.className = 'tw-interactive tw-button';
            text.className = 'tw-button__text';
            text.textContent = 'Donate TUBEs';

            button.onclick = function () {
              // tube = document.getElementById('myBittube');
              // tube.style.display="block";
              // tube.setAttribute('data-userinfo', ChannelName);
              document.getElementById('myBittube').style.display = "block";
              document.getElementById('myBittube').setAttribute('data-userinfo', ChannelName);
              document.getElementById('myBittube').setAttribute('data-domaininfo', "twitch.tv");
              document.getElementById('spanTitleModal').innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ChannelName + "'>" + ChannelName + "</span>";
            }

            button.appendChild(text)
            div.appendChild(button)
            elemente2.insertBefore(div, elemente2.children[0]);
          }
        }

      } else if (window.location.href.indexOf("directory/") > -1) {
        var Domain = "twitch.tv"
        console.log("Domain: " + Domain)
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        })
      } else {
        var Domain = "twitch.tv"
        console.log("Domain: " + Domain)
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        })
      }

    }
    //----------------------------------------------------------------------if on soundcloud----------------------------------------------------------------------------------
    else if (window.location.href.indexOf("soundcloud.") > -1) {
      var hasdomain = false;
      var hassong = false;
      if ((window.location.href == "https://soundcloud.com/stream" || window.location.href == "https://soundcloud.com/") && !hasdomain) {
        var Domain = "soundcloud.com"
        console.log("Domain: " + Domain)
        hasdomain = true;
        chrome.runtime.sendMessage({
          message: "DomainContentjs",
          Domain: Domain
        });
      }
      // CALL FUNCTION TO CREATE MODAL;
      const bittube = createModalDonation('soundcloud');
      if (document.getElementById("app") != undefined && document.getElementById("myBittube") == undefined) {
        document.getElementById("app").appendChild(bittube)
      }

      document.addEventListener('DOMNodeInserted', function (e) {

        if (e.relatedNode.className == "playControl sc-ir playControls__control playControls__play" || e.relatedNode.className == "playControl sc-ir playControls__control playControls__play playing") {
          var ChannelNamePlayer = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].innerText;
          var ChannelIDPlayer = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].href.split("soundcloud.com/")[1];
          var ChannelSongPlayer = document.getElementsByClassName("playbackSoundBadge__titleLink sc-truncate")[0].href;

          if (currentSong != ChannelSongPlayer) {
            if (!hassong) {
              hassong = true;

            }
            var Domain = "soundcloud";
            currentSong = ChannelSongPlayer
            console.log(ChannelNamePlayer)
            console.log(ChannelIDPlayer)
            chrome.runtime.sendMessage({
              message: "UserContentjs",
              User: ChannelIDPlayer,
              Domain: Domain
            })

          }
        }
        if (e.target.className != undefined) {

          if (e.target = "div" || e.target.className == "sc-list-nostyle sc-clearfix" || e.target.className == "sc-visuallyhidden" || e.target.className == "waveform__layer waveform__scene" || e.target.className == "commentPopover__scrub" || e.target.className == "soundTitle__titleContainer") {

            if (document.getElementsByClassName("sidebarModule g-all-transitions-200-linear relatedSoundsModule").length < 1) {
              var elemente3 = document.getElementsByClassName("sc-button-more sc-button sc-button-medium sc-button-icon sc-button-responsive");
              var elemente2 = document.getElementsByClassName("sc-button-like sc-button sc-button-small sc-button-responsive");
              for (i = 0; i < elemente2.length; i++) {
                if (elemente2[i].dataset.bitTube == undefined) {
                  elemente2[i].dataset.bitTube = "true"
                  // var div = document.createElement("div")
                  var button = document.createElement("button")

                  button.innerText = "Donate TUBEs";
                  button.className = 'sc-button sc-button-small sc-button-responsive';
                  button.onclick = function () {

                    tube = document.getElementById('myBittube')
                    tube.style.display = "block";
                    try {
                      var User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[1].children[0].children[0].href.split(".com/")[1];
                      var Title = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[1].children[1].innerText;
                    } catch (e) {

                    }
                    if (User == undefined || User == "groups") {
                      try {
                        User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[1].href.split("?")[0].split(".com/")[1].split("/")[0];

                      } catch (e) {

                      }
                      if (User == undefined || User == "groups") {
                        try {
                          User = this.parentElement.parentElement.children[1].children[0].href.split(".com/")[1];

                        } catch (e) {

                        }
                      }
                    }
                    if (User != undefined) {
                      console.log(User)
                      console.log(Title)
                      tube.setAttribute('data-userinfo', User);
                      tube.setAttribute('data-Title', Title);
                      tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                    }

                  }
                  // button.appendChild(logo)
                  // div.appendChild(button)
                  elemente2[i].parentElement.appendChild(button);
                }
              }
              if (elemente3[0] != undefined) {
                if (elemente3[0].dataset.bitTube == undefined) {
                  elemente3[0].dataset.bitTube = "true"
                  // var div = document.createElement("div")
                  var button = document.createElement("button")

                  button.innerText = "Donate TUBEs";
                  button.className = 'sc-button sc-button-small sc-button-responsive';
                  button.style.height = "26px";
                  button.onclick = function () {

                    tube = document.getElementById('myBittube')
                    tube.style.display = "block";
                    User = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].baseURI.split(".com/")[1]

                    if (User != undefined) {
                      console.log(User)

                      tube.setAttribute('data-userinfo', User);

                      tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                    }

                  }
                  // button.appendChild(logo)
                  // div.appendChild(button)
                  elemente3[0].parentElement.insertBefore(button, elemente3[0].parentElement.children[0]);
                }
              }

            } else {

              var elemente2 = document.getElementsByClassName("sc-button-group sc-button-group-medium");

              if (elemente2[0].dataset.bitTube == undefined) {
                elemente2[0].dataset.bitTube = "true"
                // var div = document.createElement("div")
                var button = document.createElement("button");

                button.innerText = "Donate TUBEs";
                button.className = 'sc-button sc-button-medium sc-button-responsive';

                button.onclick = function () {

                  tube = document.getElementById('myBittube')
                  tube.style.display = "block";
                  try {
                    var User = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].children[0].href.split(".com/")[1]
                    var Title = document.getElementsByClassName("soundTitle__title sc-font g-type-shrinkwrap-inline g-type-shrinkwrap-large-primary")[0].innerText;
                  } catch (e) {

                  }
                  if (User == undefined || User == "groups") {
                    try {
                      User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[1].href.split("?")[0].split(".com/")[1].split("/")[0];

                    } catch (e) {

                    }
                  }

                  if (User != undefined) {
                    console.log(User)
                    console.log(Title)
                    tube.setAttribute('data-userinfo', User);
                    tube.setAttribute('data-Title', Title);
                    tube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + "</span>"
                  }

                }
                // button.appendChild(logo)
                // div.appendChild(button)

                elemente2[0].appendChild(button);

              }
            }
          }

        }
      })
    }
    //----------------------------------------------------------------------if on amazon----------------------------------------------------------------------------------
    else if (window.location.href.indexOf("amazon.") > -1) {
      Domain = "amazon.com"
      console.log(Domain)
      chrome.runtime.sendMessage({
        message: "DomainContentjs",
        Domain: Domain
      });
    }

    //----------------------------------------------------------------------if on any other domain----------------------------------------------------------------------------------
    else {
      Domain = window.location.href;
      console.log(Domain)
      chrome.runtime.sendMessage({
        message: "DomainContentjs",
        status: "unparsed",
        Domain: Domain
      });
      if (checkBrowser() == 'firefox') {
        if (['https://bittubeapp.com/notify/index.html', 'https://bittubeapp.com/notify/', 'https://bittube.app/notify/index.html', 'https://bittube.app/notify/', 'https://pay.bittube.cash/notify/index.html', 'https://pay.bittube.cash/notify/'].indexOf(window.location.href) !== -1) {
          var timesRun = 0;
          var interval = setInterval(function () {
            timesRun += 1;
            if (timesRun === 100) {
              clearInterval(interval);
            }
            if (localStorage.getItem('channel') != null && localStorage.getItem('channel') != undefined) {
              chrome.runtime.sendMessage({
                message: "channel",
                token: localStorage.getItem('channel')
              });
              clearInterval(interval);
            }
          }, 1000);

        } else {
          if (['https://bittubeapp.com/', 'https://bittubeapp.com', 'https://bittube.app/', 'https://bittube.app', 'https://pay.bittube.cash/', 'https://pay.bittube.cash'].indexOf(window.location.href) !== -1) {
            var timesRun = 0;
            var interval = setInterval(function () {
              timesRun += 1;
              if (timesRun === 100) {
                clearInterval(interval);
              }
              if (localStorage.getItem('referredbykey') != null && localStorage.getItem('referredbykey') != undefined) {
                chrome.runtime.sendMessage({
                  message: "setReferralKey",
                  referredbykey: localStorage.getItem('referredbykey')
                });
                clearInterval(interval);
              }
            }, 1000);
          }
        }
      }
    }

  } else if (request.message == "SoundcloudVerification") {
    if (document.getElementsByClassName("truncatedUserDescription__content")[0] != undefined) {
      var hash = document.getElementsByClassName("truncatedUserDescription__content")[0].children[0].innerText;
      console.log(hash)
      chrome.runtime.sendMessage({
        message: "SoundcloudVerification",
        hash: hash
      });
    } else {
      chrome.runtime.sendMessage({
        message: "SoundcloudVerification",
        hash: ''
      });
    }
  } else if (request.message == "FacebookVerification") {
    if (document.getElementsByClassName("_4ihn _2ph-")[0] != undefined) {
      var hash = document.getElementsByClassName("_4ihn _2ph-")[0].children[0].children[0].innerText;
      console.log(hash)
      chrome.runtime.sendMessage({
        message: "FacebookVerification",
        hash: hash
      });
    } else {
      document.addEventListener('DOMNodeInserted', facebookVerifyPage);
    }

  }
  return true;
});

function facebookVerifyPage(e) {
  if (e.target.className != undefined) {
    if (document.getElementsByClassName("_5pbx userContent _3ds9 _3576")[0] != undefined) {
      console.log("test2")
      var elements = document.getElementsByClassName("_5pbx userContent _3ds9 _3576")
      var bool = false;
      for (i = 0; i < elements.length; i++) {
        if (elements[i].innerText.indexOf(fbhash) > -1) {
          var hash = elements[i].innerText
          chrome.runtime.sendMessage({
            message: "FacebookVerification",
            hash: hash
          });
          i = elements.length
          bool = true;
        }
        if (!bool) {
          chrome.runtime.sendMessage({
            message: "FacebookVerification",
            hash: ''
          });
        }
      }
      document.removeEventListener('DOMNodeInserted', facebookVerifyPage);
    } else if (e.target.className == "_6shg _3-91") {
      if (document.getElementsByClassName("_5pbx userContent _3576")[0] != undefined) {
        console.log("test")
        var elements = document.getElementsByClassName("_5pbx userContent _3576")
        var bool = false;
        for (i = 0; i < elements.length; i++) {
          if (elements[i].innerText.indexOf(fbhash) > -1) {
            var hash = elements[i].innerText
            chrome.runtime.sendMessage({
              message: "FacebookVerification",
              hash: hash
            });
            i = elements.length
            bool = true;
          }
          if (!bool) {
            chrome.runtime.sendMessage({
              message: "FacebookVerification",
              hash: ''
            });
          }
        }
        document.removeEventListener('DOMNodeInserted', facebookVerifyPage);
      }
    }
  }

}

function responseGotWallet(response, elementWithAmount, platform) {
  if (response.message == "gotWallet") {
    fullWallet = convertAddress(response.wallet);
    document.getElementById('buttonConfirm').innerHTML = '<i id="loaderDonation" class="loader"></i>';
    document.getElementById('buttonConfirm').setAttribute("disabled", "disabled");
    document.getElementById('donationSection').style.display = "none";
    document.getElementById('divConfirmDonation').style.display = "block";
    document.getElementById('spanWalletAddress').innerText = localStorage.getItem('walletToDonate');
    document.getElementById('spanWalletAddress').innerHTML = convertAddress(response.wallet);
    document.getElementById('spanPaymentId').innerText = randHex(64)
    document.getElementById('ammountToDonate').innerText = document.getElementById(elementWithAmount).innerText; //buttonDonate1.innerText;
    document.getElementById('spanTube').innerText = 'TUBE';
    // document.getElementById('spanFees').setAttribute('data-i18n', 'calculating');
    document.getElementById('spanFees').innerText = i18next.t('calculating'); //'Calculating'; //document.getElementById('ammountToDonate').innerText + '<span id="fees"></span>';
    requestFees(platform);

  } else if (response.message == 'noAllow') {
    showNeedsLogin();
  }
}

function requestFees(platform) {
  fillFees(platform);
}

function sendDonationMessage(buttonDonate, platform) {
  const user = getUser(platform);
  localStorage.setItem('buttonDonate', buttonDonate);
  chrome.runtime.sendMessage({
    message: "getWallet",
    username: user,
    domain: platform
  }, function (response) {
    if (checkBrowser() == 'chrome') {
      responseGotWallet(response, buttonDonate, platform);
    }

  });
}

function showNeedsLogin() {
  document.getElementById('needsLogin').style.display = "block";
  document.getElementById('donationSection').style.display = "none";
}

function fillFees(response) {
  document.getElementById('spanFees').innerHTML = document.getElementById('ammountToDonate').innerText + ' (+ ' + i18next.t('fee') + ')';
  setTimeout(function (e) {
    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm');
    document.getElementById('buttonConfirm').removeAttribute("disabled");
  }, 3000);
}

function showErrorOnDonation(response) {
  document.getElementById('buttonConfirm').setAttribute('data-action', 'sendDonation');
  const buttonOk = document.createElement('button');
  buttonOk.align = "left";
  buttonOk.className = "buttonGreen";
  buttonOk.innerText = "Ok";
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';

  const pResponseError = document.createElement('p');
  pResponseError.align = "left";
  pResponseError.className = "margin5";
  pResponseError.innerText = response.data;

  document.getElementById('pTitleResult').innerHTML = i18next.t('anErrorOccurredDonation') + '<br>' + i18next.t('tryAgainLater'); // "An error has occurred and the donation has not been sent.<br>Please try again later";
  document.getElementById('pTitleResult').style.color = "#ff0000";
  document.getElementById('contentResult').appendChild(pResponseError);
  document.getElementById('contentResult').appendChild(buttonOk);

  buttonOk.onclick = function () {
    document.getElementById('donationSection').style.display = "block";
    document.getElementById('divConfirmDonation').style.display = "none";
    document.getElementById('divResultDonation').style.display = 'none';
    document.getElementById('spanTube').innerText = '';
    document.getElementById('ammountToDonate').innerText = '';
  }

  document.getElementById('divConfirmDonation').style.display = 'none';

  document.getElementById('div2FA').style.display = "none";
  document.getElementById('divResultDonation').style.display = 'block';
  document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //'Confirm';
  document.getElementById('buttonConfirm').removeAttribute("disabled");
  document.getElementById('verify2fa').innerText = "Verify";
  document.getElementById('verify2fa').removeAttribute("disabled");
  document.getElementById('input2fa').value = '';

  if (document.getElementById('error2fa') != null) {
    document.getElementById('error2fa').remove();
  }
  document.getElementById('inputDonation').style.borderColor = "#dfdfdf";
  document.getElementById('inputDonation').value = "1";
}

function getUser(platform) {
  let user;
  if (platform == 'youtube') {
    if (document.getElementById('myBittube').getAttribute('data-userid') != null && document.getElementById('myBittube').getAttribute('data-userid') != 'null') {
      user = document.getElementById('myBittube').getAttribute('data-userid');
    } else {
      user = document.getElementById('userToDonate').innerText;
    }
  } else if (platform == 'facebook') {
    if (document.getElementById('myBittube').getAttribute('data-profile') != null && document.getElementById('myBittube').getAttribute('data-profile') != 'null') {
      user = document.getElementById('myBittube').getAttribute('data-profile');
    } else {
      user = document.getElementById('userToDonate').innerText;
    }
  } else {
    user = document.getElementById('userToDonate').innerText;
  }

  return user;
}

function setTranslations(lang) {

  var path;
  switch (checkBrowser()) {
    case 'chrome':
      path = 'chrome-extension://cnogbbmciffpibmkphohpebghmomaemi/_locales/{{lng}}/extension.json';
      break;
    default:
      path = window.location.origin + '/_locales/{{lng}}/extension.json';
      break;
  }
  localStorage.setItem('i18nextLng', lang);

  setTimeout(function (e) {
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
          loadPath: path, //'/_locales/{{lng}}/extension.json',
        }
      }, function (err, t) {
        localize = locI18next.init(i18next);
        localize('.translate');
      });
  }, 1000);

}

function checkBrowser() {

  var google_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  var edge = (/Edge\/\d./i.test(navigator.userAgent))
  var firefox = navigator.userAgent.indexOf('Firefox') > -1;
  var safari = navigator.userAgent.indexOf("Safari") > -1;
  var opera = navigator.userAgent.indexOf(' OPR/') > -1;

  var browserName;

  if ((google_chrome) && (safari)) safari = false;

  if ((google_chrome) && (edge)) {
    google_chrome = false;
  }

  if ((google_chrome) && (opera)) google_chrome = false;

  if (google_chrome) {
    browserName = 'chrome';
  } else if (firefox) {
    browserName = 'firefox';
  } else if (safari) {
    browserName = 'safari';
  } else if (edge) {
    browserName = 'edge';
  } else if (opera) {
    browserName = 'opera';
  }
  return browserName;
}

function handleErrorCode(data) {
  document.getElementById('input2fa').style.borderColor = '#ff0000';
  const spanError = document.createElement('span');
  spanError.id = "error2fa";
  spanError.innerText = data;
  spanError.className = "error";
  document.getElementById('spanWrapInfo2fa').appendChild(spanError);
}

function handleCorrectCode() {
  document.getElementById('buttonConfirm').removeAttribute('disabled');
  document.getElementById('buttonConfirm').setAttribute('data-action', 'sendCoins');
  document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //'Confirm';
  document.getElementById('verify2fa').innerHTML = 'Verify';
  document.getElementById('div2FA').style.display = 'none';
  document.getElementById('divConfirmDonation').style.display = 'block';
  document.getElementById('buttonConfirm').click();
}

function handleUserNotLoggedIn() {
  document.getElementById('needsLogin').style.display = "block";
  document.getElementById('divConfirmDonation').style.display = "none";
}

function handleUserHasSecurity() {
  console.log('USER HAS 2FA SHOW THE BOX !!!!!!');
  document.getElementById('div2FA').style.display = "block";
  document.getElementById('divConfirmDonation').style.display = "none";
}

function handleDonationSent(data) {
  var userNotification;
  var domainNotification = document.getElementById('myBittube').getAttribute('data-domaininfo');
  var userWillGetNotification = false;
  switch (domainNotification) {
    case 'https://www.youtube.com':
    case 'youtube.com':
    case 'twitter.com/':
    case 'twitter.com':
    case 'twitch.tv':
      userWillGetNotification = true;
      break;
  }

  if (document.getElementById('myBittube').getAttribute('data-userid') != undefined) {
    userNotification = document.getElementById('myBittube').getAttribute('data-userid');
  } else {
    userNotification = document.getElementById('myBittube').getAttribute('data-userinfo')
  }
  if (userWillGetNotification) {
    chrome.runtime.sendMessage({
      message: "ApiSocial",
      Domain: domainNotification,
      User: userNotification,
      videoId: document.getElementById('myBittube').getAttribute('data-videoId'),
      amount: document.getElementById("ammountToDonate").innerText
    }, function (response) {
      if (checkBrowser() == 'chrome') {
        console.log('Response API SOCIAL ===> ', response);
      }
    });
  }

  if (document.getElementById('error2fa') != null) {
    document.getElementById('error2fa').remove();
  }
  document.getElementById('inputDonation').style.borderColor = "#dfdfdf";
  document.getElementById('inputDonation').value = "1";

  document.getElementById('buttonConfirm').setAttribute('data-action', 'sendDonation');
  const pResponseAmount = document.createElement('p');
  pResponseAmount.align = "left";
  pResponseAmount.className = "margin5";
  pResponseAmount.innerText = i18next.t('amount') + ": " + data.amount;
  const pResponseWallet = document.createElement('p');
  pResponseWallet.align = "left";
  pResponseWallet.className = "margin5 translate breakWord";
  pResponseWallet.innerHTML = i18next.t('wallet') + ": <span class='breakAll'>" + data.address + "</span";
  const pResponseTransactionHash = document.createElement('p');
  pResponseTransactionHash.align = "left";
  pResponseTransactionHash.className = "margin5 translate breakWord";
  pResponseTransactionHash.innerHTML = i18next.t('transactionHash') + ": <span class='breakAll'>" + data.tx_hash + "</span";
  const pTransactionKey = document.createElement('p');
  pTransactionKey.align = "left";
  pTransactionKey.className = "margin5 translate breakWord";
  pTransactionKey.innerHTML = i18next.t('transactionKey') + ": <span class='breakAll'>" + data.tx_key + "</span";
  const pResponsePaymentId = document.createElement('p');
  pResponsePaymentId.align = "left";
  pResponsePaymentId.className = "margin5 translate breakWord";
  pResponsePaymentId.innerHTML = i18next.t('paymentID') + ": <span class='breakAll'>" + data.paymentId + "</span";
  const buttonOpenInExplorer = document.createElement('button');
  buttonOpenInExplorer.setAttribute('disabled', 'disabled');
  buttonOpenInExplorer.className = "buttonGreen translate";
  buttonOpenInExplorer.innerHTML = i18next.t('openExplorer');
  buttonOpenInExplorer.id = "buttonOpenExplorer";
  buttonOpenInExplorer.style.textTransform = 'uppercase';
  buttonOpenInExplorer.style.marginTop = '10px';
  buttonOpenInExplorer.style.marginLeft = '10px';
  buttonOpenInExplorer.style.paddingLeft = '5px';
  buttonOpenInExplorer.style.paddingRight = '5px';

  setTimeout(function (e) {
    document.getElementById('buttonOpenExplorer').removeAttribute('disabled');
  }, 3000);

  const buttonOk = document.createElement('button');
  buttonOk.align = "left";
  buttonOk.className = "buttonGreen";
  buttonOk.innerText = "Ok";
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';

  buttonOk.onclick = function () {
    document.getElementById('closeBitTubeModal').click();
  }

  document.getElementById('pTitleResult').innerHTML = i18next.t('yourDonationSuccessfully') + ' ' + document.getElementById('userToDonate').innerText;
  document.getElementById('pTitleResult').style.color = "#00abff";
  document.getElementById('contentResult').appendChild(pResponseAmount);
  document.getElementById('contentResult').appendChild(pResponseWallet);
  document.getElementById('contentResult').appendChild(pResponsePaymentId);
  document.getElementById('contentResult').appendChild(pResponseTransactionHash);
  document.getElementById('contentResult').appendChild(pTransactionKey);
  document.getElementById('contentResult').appendChild(buttonOk);
  document.getElementById('contentResult').appendChild(buttonOpenInExplorer);

  buttonOpenInExplorer.onclick = function () {
    window.open('https://explorer.bittube.cash/tx/' + data.tx_hash, '_blank');
  }

  document.getElementById('div2FA').style.display = "none";
  document.getElementById('divConfirmDonation').style.display = 'none';
  document.getElementById('divResultDonation').style.display = 'block';

  setTimeout(function (e) {
    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //'Confirm';
    document.getElementById('buttonConfirm').removeAttribute("disabled");
  }, 3000);

  document.getElementById('verify2fa').innerText = "Verify";
  document.getElementById('verify2fa').removeAttribute("disabled");
  document.getElementById('input2fa').value = '';
}

function handleErrorOnDonation(data) {
  document.getElementById('buttonConfirm').setAttribute('data-action', 'sendDonation');
  const buttonOk = document.createElement('button');
  buttonOk.align = "left";
  buttonOk.className = "buttonGreen";
  buttonOk.innerText = "Ok";
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';

  const pResponseError = document.createElement('p');
  pResponseError.align = "left";
  pResponseError.className = "margin5";
  pResponseError.innerText = data;

  document.getElementById('pTitleResult').innerHTML = i18next.t('anErrorOccurredDonation') + '<br>' + i18next.t('tryAgainLater'); //"An error has occurred and the donation has not been sent.<br>Please try again later";
  document.getElementById('pTitleResult').style.color = "#ff0000";
  document.getElementById('contentResult').appendChild(pResponseError);
  document.getElementById('contentResult').appendChild(buttonOk);

  buttonOk.onclick = function () {
    document.getElementById('donationSection').style.display = "block";
    document.getElementById('divConfirmDonation').style.display = "none";
    document.getElementById('divResultDonation').style.display = 'none';
    document.getElementById('spanTube').innerText = '';
    document.getElementById('ammountToDonate').innerText = '';
  }

  document.getElementById('divConfirmDonation').style.display = 'none';

  document.getElementById('div2FA').style.display = "none";
  document.getElementById('divResultDonation').style.display = 'block';

  setTimeout(function (e) {
    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //'Confirm';
    document.getElementById('buttonConfirm').removeAttribute("disabled");
  }, 3000);

  document.getElementById('verify2fa').innerText = "Verify";
  document.getElementById('verify2fa').removeAttribute("disabled");
  document.getElementById('input2fa').value = '';

  if (document.getElementById('error2fa') != null) {
    document.getElementById('error2fa').remove();
  }
  document.getElementById('inputDonation').style.borderColor = "#dfdfdf";
  document.getElementById('inputDonation').value = "1";
}