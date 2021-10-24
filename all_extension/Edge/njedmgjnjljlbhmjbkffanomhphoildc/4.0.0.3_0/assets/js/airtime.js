'use strict';

async function parallel(num, arr, func) {
  const thread = (item) => {
    if (!item) return;
    return func(item) // eslint-disable-line consistent-return
      .catch(err => {
        console.error('Error in parallel, should be handled in func!', err);
        return true;
      })
      .then(() => { // eslint-disable-line consistent-return
        if (arr.length) return thread(arr.shift());
      });
  }
  const promises = []; // eslint-disable-next-line no-plusplus
  for (let i = 0; i < num; ++i) promises.push(thread(arr.shift()));
  await Promise.all(promises);
}

function navigateToConfirmTXOrVerify(user_verified, amount) {
  if (user_verified == 'true') {
    window.location.href = "/confirmtx.html";
    localStorage.setItem('ammontToDonate', amount);
    localStorage.setItem('userToDonate', document.getElementById('spanPublisherName').innerText); // maybe webinfo.js should this to userID, not userName??
  } else {
    showPopupVerificationPhone();
  }
}

function validateAndGetDonationAmountInput() {
  const inputDonateAmount = document.getElementById('inputDonateAmount');
  if (!inputDonateAmount.value || parseFloat(inputDonateAmount.value) === NaN || parseFloat(inputDonateAmount.value) < 0.01) {
    return false;
  } else {
    return inputDonateAmount.value;
  }
}

const donateButtonClick = async (amount) => { // Also gets an event argument
  const claims = await getFirebaseClaims();
  let user_verified;
  if (!amount) { // For custom amount
    amount = validateAndGetDonationAmountInput();
    if (!amount) {
      return;
    }
  }

  if ( !claims.hasPhone ){
    if (!claims.verified){
      user_verified = 'false';
    }else{
      user_verified = 'true';
    }

  }else{
    user_verified = 'true';
  }
  navigateToConfirmTXOrVerify(user_verified, amount);
}


function setChartFilterClick(span) {
  setButtonFilterActive(this);
  localStorage.setItem('dataChart', span);
  updateChart(this, span);
}

function setup() {

  // console.log(localStorage.getItem('chart'))
  if (localStorage.getItem('chart') != null && localStorage.getItem('chart') != 'airtimeValue') {
    showCoinValueTab();
  } else {
    showAirtimeValueTab();
  }

  initializeTabs();
  // Add clicks to buttons

  // buttons donate
  const donate = document.getElementById('donate');
  const donate1 = document.getElementById('donate1');
  const donate2 = document.getElementById('donate2');
  const donate5 = document.getElementById('donate5');
  const donate10 = document.getElementById('donate10');

  if (donate) {
    donate.addEventListener('click', donateButtonClick.bind(donate, undefined));
  }
  if (donate1) {
    donate1.addEventListener('click', donateButtonClick.bind(donate1, '1'));
  }
  if (donate2) {
    donate2.addEventListener('click', donateButtonClick.bind(donate2, '2'));
  }
  if (donate5) {
    donate5.addEventListener('click', donateButtonClick.bind(donate5, '5'));
  }
  if (donate10) {
    donate10.addEventListener('click', donateButtonClick.bind(donate10, '10'));
  }


  const inputDonateAmount = document.getElementById('inputDonateAmount');
  if (inputDonateAmount) {
    let errorSet = false;

    function recheckInput() {
      if (validateAndGetDonationAmountInput() !== false) {
        if (errorSet) {
          errorSet = false;
          removeErrors(inputDonateAmount);
        }
      } else {
        if (!errorSet) {
          errorSet = true;
          const errors = [i18next.t('TheMinimunAmount')];
          const elementsWithErrors = ['inputDonateAmount'];
          setErrors(errors, elementsWithErrors);
        }
      }
    }
    inputDonateAmount.addEventListener('keyup', recheckInput);
    inputDonateAmount.addEventListener('change', recheckInput);
  }



  // button buy tubes
  // const buttonBuyTubes = document.getElementById('buttonBuyTubes');
  // if (buttonBuyTubes) {
  //   buttonBuyTubes.addEventListener('click', () => {
  //     window.location.href = '/buytubes.html';
  //   });
  // }

  //Get wallet balance
  firebase.auth().onAuthStateChanged((user) => {
    const tube_icon = '<i class="icon-font-tube tubeFont10"></i>';

    let public_address;
    let public_keys;
    let secret_keys;
    let key_images = {};

    function getAddressInfo(address, view_key, callback) {
      // const url = 'https://mywallet.bittubeapp.com/get_address_info';
      const url = `${localStorage.getItem('wallet_server')}/tube4/get_address_info`
      var data = {
        address: address,
        view_key: view_key,
      };
      sendPostRequest(url, JSON.stringify(data), 'application/json;charset=UTF-8', null, function (user, response) {
        try {
          var data = JSON.parse(response);
          if (callback)
            callback(data);
        } catch (ex) {
          console.log(response);
          console.log(ex);
        }
      });
    }

    function getAddressTxs(address, view_key, callback) {
      // const url = 'https://mywallet.bittubeapp.com/get_address_txs';
      const url = `${localStorage.getItem('wallet_server')}/tube4/get_address_txs`;
      var data = {
        address: address,
        view_key: view_key,
      };
      sendPostRequest(url, JSON.stringify(data), 'application/json;charset=UTF-8', null, function (user, response) {
        try {
          var data = JSON.parse(response);
          if (callback)
            callback(data);
        } catch (ex) {
          console.log(response);
          console.log(ex);
        }
      });
    }

    function getWalletInfo(callback) {
      firebase.auth().currentUser.getIdToken().then(function (token) {
        const url = functionBaseURL + '/app/returnWallet';
        sendGetRequest(url, token, function (user, response) {
          try {
            const bytes = CryptoJS.AES.decrypt(response, token);
            const walletInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (callback)
              callback(walletInfo);
          } catch (ex) {
            console.log(ex);
            console.log(response);
          }
        });
      });
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

    if (user) {
      getWalletInfo(function (walletInfo) {
        const onlinewallet = walletInfo.wallets.onlinewallet;
        // public_address = onlinewallet.public_addr;
        public_address = cnUtil.pubkeys_to_string(onlinewallet.spend.pub, onlinewallet.view.pub);
        public_keys = {
          view: onlinewallet.view.pub,
          spend: onlinewallet.spend.pub
        }
        secret_keys = {
          view: onlinewallet.view.sec,
          spend: onlinewallet.spend.sec
        }

        getAddressTxs(public_address, secret_keys.view, function (data) {
          const total_received = new BigInteger(data.total_received || 0);
          const total_received_unlocked = new BigInteger(data.total_received_unlocked || 0);
          getAddressInfo(public_address, secret_keys.view, function (data) {
            const availableBalanceDiv = document.getElementById('available');
            const spent_outputs = (data.spent_outputs || []);

            function loadAvailBal() {
              var sent = new BigInteger(data.total_sent);
              var balance = total_received.subtract(sent);
              var unlocked_balance = total_received_unlocked.subtract(sent);
              var formatted_balance = parseFloat(cnUtil.formatMoneyFull(balance)).toFixed(2);
              var formatted_available_balance = parseFloat(cnUtil.formatMoneyFull(unlocked_balance)).toFixed(2);
              if (formatted_balance == formatted_available_balance) {
                fetchTUBEValue(localStorage.getItem('currencySelected')).then((responseFetch) => {
                  if (responseFetch != undefined) {
                    let currencySymb = responseFetch.currency;
                    switch (responseFetch.currency){
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
                    availableBalanceDiv.innerHTML = `<span id="spanBalance">${formatted_balance}</span> ${tube_icon} / <span id="valueBalance" class="cursorPointer"> ` + (formatted_balance * responseFetch.value).toFixed(2) + ' ' + currencySymb + `</span>`;
                    document.getElementById('loadingAvailable').classList.add('displayNone');
                    availableBalanceDiv.classList.remove('displayNone');
                    if ( document.getElementById('buttonTransferTUBEs') != null ){
                      document.getElementById('buttonTransferTUBEs').removeAttribute('disabled');
                    }
                    // switchValuesCMC(document.getElementById('valueBalance'));
                  }

                });
              } else {
                availableBalanceDiv.innerHTML = `${tube_icon}${formatted_balance} / ${tube_icon}${formatted_available_balance}`;
                document.getElementById('loadingAvailable').classList.add('displayNone');
                availableBalanceDiv.classList.remove('displayNone');
                // document.getElementById('twoBalance').classList.remove('displayNone');
                // document.getElementById('availableBalance').classList.remove('displayNone');
                // document.getElementById('separatorBalance').classList.remove('displayNone');
                // document.getElementById('balanceCurrentValue').classList.add('displayNone'); // / ${tube_icon}${formatted_available_balance}`;
              }
            }

            parallel(5, spent_outputs, async function (spent_output) {
              const key_image = cachedKeyImage(
                spent_output.tx_pub_key,
                spent_output.out_index
              );
              if (spent_output.key_image !== key_image) {
                data.total_sent = new BigInteger(data.total_sent).subtract(spent_output.amount);
              }
              await new Promise((resolve) => setTimeout(resolve, 1));
            }).then(loadAvailBal);
          });
        });
      });
    }
  });


}
document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user){
      setup();
    }
  });
})
// document.addEventListener('DOMContentLoaded', setup);