// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let toBrowser;
if (typeof(browser) != 'undefined'){
    toBrowser = browser;
}else{
    toBrowser = chrome
}
function checkBrowser(){

    var google_chrome   = navigator.userAgent.indexOf('Chrome') > -1;
    var edge = (/Edge\/\d./i.test(navigator.userAgent))
    var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
    var safari   = navigator.userAgent.indexOf("Safari") > -1;
    var opera    = navigator.userAgent.indexOf(' OPR/') > -1;

    var browserName;
    if ((google_chrome) && (safari)) safari = false;
      if((google_chrome) && (edge)){
          google_chrome = false;
      }

      if( (google_chrome) && (opera)) google_chrome = false;

      if (google_chrome){
        browserName = 'chrome';
      }else if(firefox){
        browserName = 'firefox';
      }else if(safari){
        browserName = 'safari';
      }else if (edge){
        browserName = 'edge';
      }else if (opera){
        browserName = 'opera';
      }
      return browserName;
}

toBrowser.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.message == 'getTubeRate'){
        //Utilities
        const getAmountToBuy = async (tubeAmount = '', amount = '', type, buyType = undefined,curr) => {
            const token = await getFirebaseToken();
            let currency=curr;
            const url = functionBaseURL + '/app/getFIATTUBEPrice?tubeAmount=' + tubeAmount + '&currency=' + currency + '&fiatAmount=' + amount

            sendGetRequest(url, token, function (user, response) {
                const result = JSON.parse(response);
                switch (type) {
                    case 'getTubes':
                        if ( buyType === 'buyWithCrypto'){
                            if(checkBrowser() == "chrome"){
                                sendResponse({message:result.tubeAmount.toFixed(8),token:result.token})
                            }
                            else{
                                chrome.tabs.query({active: true}, function (tab) {
                                    chrome.tabs.sendMessage(tab[0].id, {message:'getTubeValue',value:result.tubeAmount.toFixed(8),token:result.token,type:type});
                                });
                            }
                        }
                        else{
                            if(checkBrowser() == "chrome"){
                                sendResponse({message: result.tubeAmount.toFixed(2),token:result.token})
                            }
                            else{
                                chrome.tabs.query({active: true}, function (tab) {
                                    chrome.tabs.sendMessage(tab[0].id, {message:'getTubeValue',value:result.tubeAmount.toFixed(2),token:result.token,type:type});
                                });
                            }

                        }

                    break;
                    case 'getFiat':
                        if (buyType === 'creditCard') {
                            if(checkBrowser() == "chrome"){
                                sendResponse({message: applyFeeForPurchase(result.fiatAmount, 'getFiat'),token:result.token})
                            }
                            else{
                                chrome.tabs.query({active: true}, function (tab) {
                                    chrome.tabs.sendMessage(tab[0].id, {message:'getTubeValue',value:applyFeeForPurchase(result.fiatAmount, 'getFiat'),token:result.token,type:type});
                                });
                            }

                        }
                        else {
                            if ( buyType === 'buyWithCrypto'){
                                if(checkBrowser() == "chrome"){
                                    sendResponse({message: result.fiatAmount.toFixed(8),token:result.token})
                                }
                                else{
                                    chrome.tabs.query({active: true}, function (tab) {
                                        chrome.tabs.sendMessage(tab[0].id, {message:'getTubeValue',value:result.fiatAmount.toFixed(8),token:result.token,type:type});
                                    });
                                }

                            }
                            else{
                                if(checkBrowser() == "chrome"){
                                    sendResponse({message: result.fiatAmount.toFixed(2),token:result.token})
                                }
                                else{
                                    chrome.tabs.query({active: true}, function (tab) {
                                        chrome.tabs.sendMessage(tab[0].id, {message:'getTubeValue',value:result.fiatAmount.toFixed(2),token:result.token,type:type});
                                    });
                                }

                            }
                        }
                    break;
                }
            });
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
        if(request.target=='getTubes'){
            getAmountToBuy(undefined,request.value,request.target,request.type,request.currency)
        }
        else if (request.target == 'getFiat'){
            getAmountToBuy(request.value,undefined,request.target,request.type,request.currency)
        }

    }
    if(request.message == 'getTubePrice'){
        //Utilities
        const getTubePrice = async ( amount = '',curr) => {
            const token = await getFirebaseToken();
            let currency=curr;
            let url
            if(checkBrowser() == "chrome"){
                url = functionBaseURL + '/app/getFIATTUBEPrice?tubeAmount=1&currency=' + currency + '&fiatAmount=' + amount
            }
            else{
                url = functionBaseURL + '/app/getFIATTUBEPrice?tubeAmount=1&currency=' + currency + '&fiatAmount='
            }

            sendGetRequest(url, token, function (user, response) {
                const result = JSON.parse(response);
                if(checkBrowser() == "chrome"){
                    sendResponse({value:result.fiatAmount,currency:currency})
                }
                else{
                    chrome.tabs.query({active: true}, function (tab) {
                        chrome.tabs.sendMessage(tab[0].id, {message:'getTubePrice',value:result.fiatAmount,currency:currency,amount:amount});
                    });
                }

            });
        }
        if(checkBrowser() == "chrome"){
            getTubePrice(undefined,request.currency)
        }
        else{
            getTubePrice(request.amount,request.currency)
        }

    }
    if(request.message == 'getFavCurrency'){

        if(checkBrowser() == 'chrome'){
            if(localStorage.getItem("currencySelected") != undefined){
                sendResponse({currency:localStorage.getItem("currencySelected")})
            }
            else{
                sendResponse({message:"USD"})
            }
        }
        else{
            chrome.tabs.query({active: true}, function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {message:'favCur',currency: 'USD',amount:request.value});
            });

        }

    }

    if(request.message == 'getBuyTubeStatus'){
        const getBuyTubeStatus = async () => {
            try {
                const status = await firebaseXhr(functionBaseURL + '/app/buyTubesStatus');
                if (status.wire && status.wire.maintenance){

                    if(checkBrowser() == "chrome"){
                        sendResponse({disabled:['wire'],message:status.wire.message})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {disabled:['wire'],message:'getBuyTubeStatus',error:status.wire.message});
                        });
                    }
                }
                if (status.crypto && status.crypto.maintenance){
                    if(checkBrowser() == "chrome"){
                        sendResponse({disabled:['crypto'],message:status.crypto.message})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {disabled:['crypto'],message:'getBuyTubeStatus',error:status.crypto.message});
                        });
                    }
                }
                if (status.cc && status.cc.maintenance){
                    if(checkBrowser() == "chrome"){
                        sendResponse({disabled:['cc'],message:status.cc.message})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {disabled:['cc'],message:'getBuyTubeStatus',error:status.cc.message});
                        });
                    }
                }

            } catch (err) {
                console.error('getBuyTubeStatus Error', err);
                if(err == "Error: No current user to get token for!"){
                    if(checkBrowser() == "chrome"){
                        sendResponse({disabled:['token'],error:'token'})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {disabled:['token'],message:'getBuyTubeStatus',error:'token'});
                        });
                    }
                }
                else{
                    if(checkBrowser() == "chrome"){
                        sendResponse({disabled:['wire','cc','crypto'],message:'Impossible to get buy tube status'})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {disabled:['wire','cc','crypto'],message:'getBuyTubeStatus'});
                        });
                    }
                }

            }
        };
        getBuyTubeStatus()
    }
    if(request.message == 'createTransferOrder'){
        let createOrder = true;

        const checkUserHasPhone = async () => {
            const claims = await getFirebaseClaims();
            if ( !claims.hasPhone && !claims.verified){
                createOrder = false;
                chrome.tabs.query({active: true}, function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {message:'createTransferOrder',error:'unverified'});
                });
            }
        }

        checkUserHasPhone();
        function randomReferenceNumber(){
            return (Math.floor((Math.random() * 982451653) + 982451653).toString(36) + Date.now().toString(36)).toUpperCase();
        }

        if (createOrder === true) {

            const refNo='TUBE-'+randomReferenceNumber();
            firebase.auth().currentUser.getIdToken().then(function (token) {
                var params = {};
                params.referenceId = refNo
                params.tubeamount = request.tubeAmount
                params.amount = request.amount
                params.currency = request.currency
                params.tubeValue=null
                params.timeTube = Date.now();
                params.token = encodeURIComponent(request.purchaseData)
                const url = functionBaseURL + '/app/createOrderTransferNew';
                var data = 'data=' + encodeURIComponent(JSON.stringify(params));
                sendPostRequest(url, data, null, token, function (user, response) {
                    const resultOrder = JSON.parse(response);
                    if(checkBrowser() == "chrome"){
                        sendResponse({message:resultOrder,data:params})
                    }
                    else{

                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {message:'createTransferOrder',data:params,result:resultOrder});
                        });
                    }

                });
            });
        } else {

            if(checkBrowser() == "chrome"){
                sendResponse({error:'phoneError'})
            }
            else{
                chrome.tabs.query({active: true}, function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {message:'createTransferOrder',error:'unverified'});
                });
            }
        }
    }
    if(request.message == 'createCryptoOrder'){
        const getCoinbaseCommerceData = async (data) => {
            try {
                const token = await getFirebaseToken();
                const url = functionBaseURL + '/app/createCharge?token=' + encodeURIComponent(data);
                sendGetRequest(url, token, function (user, response) {
                    const resultOrder = JSON.parse(response);
                    if (resultOrder.message == 'success') {
                        if(checkBrowser() == "chrome"){
                            sendResponse({message:resultOrder})
                        }
                        else{
                            chrome.tabs.query({active: true}, function (tab) {
                                chrome.tabs.sendMessage(tab[0].id, {message:'createCryptoOrder',data:resultOrder});
                            });
                        }

                    }
                });
            } catch (err) {
                sendResponse({error:err})
            }
        }
        getCoinbaseCommerceData(request.purchaseData)
    }
    if(request.message == 'buyWithCreditCard'){
        const startProcessBuyWithCC = async (dataCC) => {
            try {
                const token = await getFirebaseToken();
                let params = {};
                if (dataCC != null) {
                    params.data = dataCC
                    params.token = encodeURIComponent(request.purchaseData)
                }
                const url = functionBaseURL + '/app/buyWithCreditCard';
                var data = 'data=' + encodeURIComponent(JSON.stringify(params));
                sendPostRequest(url, data, null, token, function (user, response) {
                    const result = JSON.parse(response);
                    if(checkBrowser() == "chrome"){
                        sendResponse({message:result})
                    }
                    else{
                        chrome.tabs.query({active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {message:'buyWithCreditCard',data:result});
                        });
                    }

                });
            } catch (err) {
                console.error('Error starting buy with cc process ', err);
            }
        }
        startProcessBuyWithCC(request.data)
    }
    if (request.message == 'sendDonation'){
    let walletAddress = request.wallet;
    let ammount = request.amount;
    let paymentId = request.paymentid;
    let reqUseToDonate = request.usertodonate;
    localStorage.setItem('userToDonate', reqUseToDonate)
    let platform = request.platform;
    localStorage.setItem('userPlatform', platform);
    let action = request.action;
    if( action == 'sendDonation'){
            if (firebase.auth().currentUser != null ){
                // // console.log('before get user security ', ammount)
                getUserSecurity(function(response){
                    // // console.log('get user security ==> ', response, ' ', ammount)
                    if(response == 'userHasSecurity')
                    {
                        // document.getElementById("donate-2fa-modal").style.display = 'block';
                        if (checkBrowser() == 'chrome'){
                            sendResponse({message: 'userHasSecurity'})
                        }else{
                            chrome.tabs.query({errorOnDonation: true, active: true}, function (tab) {
                                chrome.tabs.sendMessage(tab[0].id, {message: 'userHasSecurity'});
                            });
                        }
                    }
                    else if (response == 'userHasNoSecurity'){
                        new_send_coins(walletAddress, ammount, paymentId);
                    }
                });
            }else{
                if (checkBrowser() == 'chrome'){
                    sendResponse({message: 'userNotLoggedIn'})
                }else{
                    chrome.tabs.query({errorOnDonation: true, active: true}, function (tab) {
                        chrome.tabs.sendMessage(tab[0].id, {message: 'userNotLoggedIn'});
                    });
                }
            }

        }
    else if( action == 'verifyCode' ){
            let code = request.code;
            update2FAToken(code)
                .then(() => {
                    if (checkBrowser() == 'chrome'){
                        sendResponse({message: 'correctCode', error: 'The 2FA code is correct'})
                    }else{
                        chrome.tabs.query({errorOnDonation: true, active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {message: 'correctCode', error: 'The 2FA code is correct'});
                        });
                    }
                })
                .catch(err => {
                    if (checkBrowser() == 'chrome'){
                        sendResponse({message: 'errorCode', error: err.message})
                    }else{
                        chrome.tabs.query({errorOnDonation: true, active: true}, function (tab) {
                            chrome.tabs.sendMessage(tab[0].id, {message: 'errorCode', error: err.message});
                        });
                    }
                });
    }
    else if (action == 'sendCoins'){
        new_send_coins(walletAddress, ammount, paymentId);
    }

    async function new_send_coins(walletAddress, ammount, paymentId){
        let token = await firebase.auth().currentUser.getIdToken();
        let wallets = await WalletHelpers.getWalletsInfo(token);
        var onlinewallet = wallets.onlinewallet;
        // let public_address = onlinewallet.public_addr;
        let public_address = cnUtil.pubkeys_to_string(onlinewallet.spend.pub, onlinewallet.view.pub);
        let pub_keys = {
        view: onlinewallet.view.pub,
        spend: onlinewallet.spend.pub
        }
        let sec_keys = {
        view: onlinewallet.view.sec,
        spend: onlinewallet.spend.sec
        }
        let login_success = await WalletHelpers.walletLogin(public_address, sec_keys.view);
        if(!login_success)
        {
            showDonationError('Something went wrong. Please try again');
            return;
        }
        let parsed_amount;
        console.log('Amount !! ==> ', ammount, '   ', typeof(ammount))
        try {
            parsed_amount = mymonero_core_js.monero_amount_format_utils.parseMoney(ammount);
        } catch (e) {
            showDonationError("Please enter a valid amount");
            return;
        }
        var params = {
            is_sweeping: false,
            payment_id_string: paymentId,//payId, // passed in
            sending_amount: parsed_amount.toString(), // sending amount
            from_address_string: public_address,
            sec_viewKey_string: sec_keys.view,
            sec_spendKey_string: sec_keys.spend,
            pub_spendKey_string: pub_keys.spend,
            to_address_string: walletAddress,
            priority: 1,
            unlock_time: 0, // unlock_time
            nettype: 0,
            get_unspent_outs_fn: function(req_params, cb)
            {
                WalletHelpers.getUnspentOuts(req_params, function(err_msg, res){
                    cb(err_msg, res);
                })
            },
            get_random_outs_fn: function(req_params, cb)
            {
                WalletHelpers.getRandomOuts(req_params, function(err_msg, res)
                {
                    cb(err_msg, res);
                });
            },
            submit_raw_tx_fn: function(req_params, cb)
            {
                WalletHelpers.submitRawTx(req_params, function(err_msg, res)
                {
                    cb(err_msg, res);
                });
            },
            status_update_fn: function(params)
            {
            },
            error_fn: function(params)
            {
                showDonationError(params.err_msg);
            },
            success_fn: async function(params)
            {
                const sent_tx = {
                    userSocialId: localStorage.getItem('userSocialId'),
                    userPlatorm: platform, //localStorage.getItem('userPlatform'),
                    username: reqUseToDonate, //localStorage.getItem('userToDonate'),
                    address: walletAddress,
                    amount: ammount,
                    paymentId: params.final_payment_id,
                    tx_hash: params.tx_hash,
                    tx_key: params.tx_prvkey,
                    tx_fee: params.used_fee
                };

                const data = {
                    suffix: 'donations',
                    type: 0,
                    data: sent_tx
                };
                showTransactionSent(sent_tx);
                await WalletHelpers.addHistory(token, data);
                // showHideButtonLoader('buttonConfirm', 'hideLoader');
            },
        }
        let blockchain_height = await WalletHelpers.getBlockchainHeight(public_address, sec_keys.view);
        if(!blockchain_height)
        {
            showDonationError('Failed to retrieve blockchain height please try again');
            return;
        }
        let coreBridge_instance = await mymonero_core_js.monero_utils_promise;
        // coreBridge_instance.set_current_blockchain_height(blockchain_height);
        coreBridge_instance.async__send_funds(params);
    }

    function getUserSecurity(callback)
        {
          firebase.auth().currentUser.getIdToken().then(function(token)
          {
            const url = functionBaseURL + '/app/getUserSecurity';
            sendGetRequest(url, token, function(user, response){
              try{
                if(callback)
                  callback(response);
              }
              catch(ex)
              {
                  //// console.log(ex);
                //// console.log(response);
              }
            });
          });
    }
    function verify2FASecret(secret, callback)
        {
          firebase.auth().currentUser.getIdToken().then(function(token)
          {
            const url = functionBaseURL + '/app/verifySecret?userToken='+secret+'&action=verifySecret';
            sendGetRequest(url, token, function(user, response){
              try{
                if(callback)
                  callback(response);
              }
              catch(ex)
              {
                //// console.log(response);
              }
            });
          });
    }

    function showTransactionSent(data_transaction){
        // console.log('SHOW TRANSACTION SENT');
        // console.log(data_transaction)
        if (checkBrowser() == 'chrome'){
            sendResponse({message: "donationSent", data: data_transaction});
        }else{
            chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {message: 'donationSent', data: data_transaction});
            });
        }
    }
    function showDonationError(error){
        // console.log('SHOW DONATION ERROR');
        // console.log(error)
        if (checkBrowser() == 'chrome'){
            sendResponse({message: "errorOnDonation", data: error});
        }else{
            chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {message: 'errorOnDonation', data: error});
            });
        }

    }

    }

    return true;
});