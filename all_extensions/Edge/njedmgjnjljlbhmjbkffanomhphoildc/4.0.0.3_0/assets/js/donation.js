// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
const getMonthlyDonations = async () => {
    try {
        const url = functionBaseURL + '/app/getMonthlyDonations';
        const resultMonthlyDonations = await firebaseXhr(url);
        if (resultMonthlyDonations.result && resultMonthlyDonations.donations.length > 0) {
            fillMonthlyDonations(resultMonthlyDonations.donations);
        } else {
            document.getElementById('divMonthlyDonations').classList.add('displayNone')
            document.getElementById('divNoMonthlyDonations').classList.remove('displayNone');
        }
    } catch (err) {
        console.log('Error getting monthly donations', err);

    }
}

const fillMonthlyDonations = (data) => {
    if (data.length > 0) {
        document.getElementById('ulMonthlyDonations').innerHTML = '';
        data.forEach((element, i) => {
            var li = document.createElement('li');
            li.classList.add("linkedContainer")
            li.classList.add('positionRelative');
            li.style.opacity = "0"
            li.style.animation = "listPop 0.4s ease forwards"
            li.style.animationDelay = i * 0.05 + 's'

            const user_receiver = document.createElement('h3');
            user_receiver.innerHTML = element.userToDonate;

            var platformName = document.createElement('img');
            platformName.src = "./assets/images/linksLogo/" + element.userPlatorm + ".svg"

            var buttonDelete = document.createElement('button');
            buttonDelete.classList.add('mbsc-ic');
            buttonDelete.setAttribute('data-donationid', element.donationId);
            var iconDelete = document.createElement('img');
            iconDelete.src = './assets/images/trashIcon.svg';
            buttonDelete.appendChild(iconDelete)
            buttonDelete.classList.add('buttonRemoveAccount');
            buttonDelete.addEventListener('click', function (e) {
                showModalConfirmDeleteMonthlyDonation(element);
            });
            const buttonDonationInfo = document.createElement('button');
            buttonDonationInfo.classList.add('buttonDonationInfo');
            buttonDonationInfo.setAttribute('data-donationId', element.donationId);
            const iconInfo = document.createElement('i');
            iconInfo.className = 'mbsc-ic mbsc-ic-material-info-outline';
            buttonDonationInfo.appendChild(iconInfo);
            buttonDonationInfo.addEventListener('click', function (e) {
                showModalInfoMonthlyDonation(element);
            })

            li.appendChild(user_receiver)
            li.appendChild(platformName)
            li.appendChild(buttonDelete);
            li.appendChild(buttonDonationInfo);

            document.getElementById('ulMonthlyDonations').appendChild(li);
        });
        mobiscroll.listview('#ulMonthlyDonations', {
            theme: 'ios',
            enhance: true,
            swipe: false
        });
        document.getElementById('divMonthlyDonations').classList.remove('displayNone');
        document.getElementById('divNoMonthlyDonations').classList.add('displayNone');
    }
}


const showModalConfirmDeleteMonthlyDonation = async (element) => {
    const modalConfirmDeleteDonation = mobiscroll.popup('#modalConfirmDeleteDonation', {
        display: 'center',
        closeOnOverlayTap: false,
        cssClass: 'popUpResendEmail',
        buttons: [{
                text: i18next.t('confirm'),
                cssClass: 'buttonModdal',
                handler: async (event, inst) => {
                    const donationId = element.donationId;
                    const url = functionBaseURL + '/app/deleteMonthlyDonation';
                    const dataDelete = {
                        donationId: donationId
                    }
                    const resultDelete = await firebaseXhr(url, JSON.stringify(dataDelete));
                    if (resultDelete.success) {
                        inst.hide();
                        getMonthlyDonations();
                    }
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
            const iconTube = '<i class="icon-font-tube tubeFont9"></i>';
            if (element.userPlatorm == 'domain') {
                document.getElementById('textConfirmDeleteDonation').innerHTML = `Are you sure you want to remove the monthly donation of  ${element.amount} ${iconTube} for ${element.userToDonate}`;
            } else {
                document.getElementById('textConfirmDeleteDonation').innerHTML = `Are you sure you want to remove the monthly donation of  ${element.amount} ${iconTube} for ${element.userToDonate} on ${element.userPlatorm} platform?`;
            }

        }
    });

    modalConfirmDeleteDonation.show();
}

const showModalInfoMonthlyDonation = async (element) => {
    const modalInfoMonthlyDonation = mobiscroll.popup('#modalInfoMonthlyDonation', {
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
            text: 'Cancel donation',
            cssClass: 'buttonModdalGrey',
            handler: function (event, inst) {
                inst.hide();
                showModalConfirmDeleteMonthlyDonation(element);
            }
        }],
        onBeforeShow: function (ev, inst) {
            let dateStarted = new Date(element.startDate).toLocaleString().split(',')[0];
            dateStarted = dateStarted.split('/');
            dateStarted = dateStarted[1] + '/' + dateStarted[0] + '/' + dateStarted[2];
            document.getElementById('receiverDonation').innerText = element.userToDonate;
            document.getElementById('receiverPlatform').innerText = element.userPlatorm;
            document.getElementById('receiverAmount').innerText = element.amount;
            document.getElementById('donationStarted').innerText = dateStarted;
            document.getElementById('donationDay').innerText = element.donation_day;
            document.getElementById('receiverWallet').innerText = element.wallet;

        }
    });

    modalInfoMonthlyDonation.show();
}

const showNewMonthlyDonation = () => {
    document.getElementById('divHeaderMonthlyDontions').classList.add('displayNone');
    document.getElementById('createNewMonthlyDonationDiv').classList.remove('displayNone');
    document.getElementById('createNewMonthlyDonationDiv').style.animation = "listPop 0.4s ease forwards";
}

const hideNewMonthlyDonation = () => {
    document.getElementById('divHeaderMonthlyDontions').classList.remove('displayNone');
    document.getElementById('createNewMonthlyDonationDiv').classList.add('displayNone');
    document.getElementById('divHeaderMonthlyDontions').style.animation = "listPop 0.4s ease forwards";
}

document.addEventListener('DOMContentLoaded', function () {

    getMonthlyDonations();
    //Donation Wallet functions
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // Buttons to add click
            const buttonCancelMonthly = document.getElementById('buttonCancelMonthly');
            const walletItem = document.getElementById('walletItem');
            let instanceDonationError;
            let instanceTransactionSent;
            buttonCancel.addEventListener('click', function () {
                window.location.href = 'airtime.html'
            });
            buttonCancelMonthly.addEventListener('click', function () {
                // window.location.href = 'airtime.html'
                hideNewMonthlyDonation();

            });

            walletItem.addEventListener('click', function () {
                //window.open(window.location.origin + '/wallet/index.html#!/overview');
                chrome.tabs.create({
                    url: "https://pay.bittube.cash/wallet/index.html#!/overview"
                  });
            });

            //load title on publisher view


            mobiscroll.calendar('#startDonationDate', {
                theme: 'mobiscroll',
                dateFormat: 'dd/mm/yy',
                onInit: function (event, inst) {
                    inst.setVal(new Date(), true);
                }
            });

            const startDonationDate = document.getElementById('startDonationDate');
            if (startDonationDate != null) {

            }

            const buttonConfirmMonthly = document.getElementById('buttonConfirmMonthly');
            if (buttonConfirmMonthly != null) {
                buttonConfirmMonthly.addEventListener('click', function (e) {
                    setMonthlyDonation();
                });
            }

            // initialize mobiscroll calendar
            mobiscroll.settings = {
                theme: 'mobiscroll',
                lang: 'de'
            };

            mobiscroll.nav('#tabsDonate', {
                theme: 'ios',
                type: 'tab',
                cssClass: 'divTabsPublisher',
                onItemTap: function (event, inst) {
                    document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
                    document.querySelector('#apps-tab-' + event.target.getAttribute('data-tab')).classList.add('md-apps-tab-sel');
                    if (event.target.getAttribute('data-tab') == 'monthly') {
                        document.getElementById('userDonateMonthly').innerText = localStorage.getItem('userNameToDonate');
                        document.getElementById('monthlyAmount').innerText = localStorage.getItem('ammontToDonate');
                    } else {
                        document.getElementById('userDonateMonthly').innerText = '';
                        document.getElementById('monthlyAmount').innerText = '';
                    }
                }
            });



            let walletAddress = localStorage.getItem('walletToDonate'); //'bxdJo3NJrnVS3Vah2h7B3JKNes5Pss5yLjmLoto2trPCgfuLR6Kxfea9qijdBtxh1nMLENCUJsdZC6AUM698Zi3x2ZDxE2kV3';

            document.getElementById('spanWalletAddress').innerHTML = walletAddress;
            document.getElementById('spanWalletAddressMonthly').innerHTML = walletAddress;

            document.getElementById('spanPaymentId').innerText = randHex(64);

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

            // Copy TX data
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


            // document.getElementById('donationAmountTubeIcon').classList.remove('displayNone');
            document.getElementById('spanAmount').innerHTML = `${localStorage.getItem('ammontToDonate')} <i class="icon-font-tube tubeFont10"></i> + ` + i18next.t('fee');
            document.getElementById('spanAmountMonthly').innerHTML = `${localStorage.getItem('ammontToDonate')} <i class="icon-font-tube tubeFont10"></i> + ` + i18next.t('fee');
            // showHideButtonLoader('buttonConfirm', 'hideLoader');

            document.getElementById('buttonConfirm').addEventListener('click', async (e) => {
                const claims = await getFirebaseClaims();
                if (claims.has2FA) {
                    showModal2FA('onetime');
                } else {
                    new_send_coins(walletAddress, localStorage.getItem('ammontToDonate'), document.getElementById('spanPaymentId').innerText);
                }
            });

            document.getElementById('donate-verify2FASecret').placeholder = i18next.t('2FACode');

            document.getElementById('donate-verify2FASecret').addEventListener('focus', function (e) {
                removeErrors(this);
                document.getElementById('donate-verify2FASecret').placeholder = '';
                document.getElementById('labelConfirmDonate').style.animation = "labelAppear 0.5s ease-out forwards";
            });

            document.getElementById('donate-verify2FASecret').addEventListener('blur', function (e) {
                if (this.value == '') {
                    document.getElementById('donate-verify2FASecret').placeholder = i18next.t('2FACode');
                    document.getElementById('labelConfirmDonate').style.animation = "labelDisappear 0.5s ease-out forwards";
                }

            });



            function showTransactionSent(data_transaction) {
                instanceTransactionSent = mobiscroll.popup('#transactionSent', {
                    display: 'center',
                    closeOnOverlayTap: false,
                    cssClass: 'popUpResendEmail transactionModal',
                    buttons: [{
                        text: i18next.t('close'),
                        cssClass: 'buttonModdal',
                        handler: function (event, inst) {
                            inst.hide();
                            window.location.href = '/airtime.html';
                        }
                    }],
                    onBeforeShow: function (ev, inst) {

                        document.getElementById('userDonated').innerText = data_transaction.username;
                        document.getElementById('amountDonated').innerHTML = data_transaction.amount + ' <i class="icon-font-tube tubeFont"></i> / <label id="fiatValueDonated"></label> <br><label class="modalDate">' + new Date(Date.now()).toUTCString().split('GMT')[0];
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
                        document.getElementById('addrUserWallet').innerText = data_transaction.address;
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
                instanceDonationError = mobiscroll.popup('#transactionError', {
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
                        document.getElementById('donationError').innerText = error;

                    }
                });

                instanceDonationError.show();
            }
            async function new_send_coins(Address, Amount, payId) {
                // Address = public_address;
                showHideButtonLoader('buttonConfirm', 'showLoader');
                let parsed_amount;
                try {
                    parsed_amount = mymonero_core_js.monero_amount_format_utils.parseMoney(Amount);
                } catch (e) {
                    showDonationError("Please enter a valid amount");
                    return;
                }
                var params = {
                    is_sweeping: false,
                    payment_id_string: payId, // passed in
                    sending_amount: parsed_amount.toString(), // sending amount
                    from_address_string: public_address,
                    sec_viewKey_string: sec_keys.view,
                    sec_spendKey_string: sec_keys.spend,
                    pub_spendKey_string: pub_keys.spend,
                    to_address_string: Address,
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
                        showDonationError(params.err_msg);
                        return;
                    },
                    success_fn: async function (params) {
                        const sent_tx = {
                            userSocialId: localStorage.getItem('userSocialId'),
                            userPlatorm: localStorage.getItem('userPlatform'),
                            username: localStorage.getItem('userToDonate'),
                            address: Address,
                            amount: Amount,
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

                        if (localStorage.getItem('videoId') != undefined) {
                            var videoId = localStorage.getItem('videoId');
                        } else {
                            var videoId = '';
                        }
                        var userWillGetNotification = false;
                        var domainNotification = document.getElementById('headerTitle').getAttribute('data-platform');
                        switch (domainNotification) {
                            case 'https://www.youtube.com':
                            case 'youtube.com':
                            case 'youtube':
                            case 'twitter.com/':
                            case 'twitter.com':
                            case 'twitter':
                            case 'twitch':
                            case 'twitch.tv':
                                userWillGetNotification = true;
                                break;
                        }
                        if (userWillGetNotification) {
                            chrome.runtime.sendMessage({
                                message: "ApiSocial",
                                Domain: domainNotification,
                                User: document.getElementById('headerTitle').getAttribute('data-userinfo'),
                                videoId: videoId,
                                amount: localStorage.getItem('ammontToDonate')
                            }, function (response) {
                                console.log('Response API SOCIAL ===> ', response);
                            });
                        }
                        await WalletHelpers.addHistory(token, data);
                        showHideButtonLoader('buttonConfirm', 'hideLoader');
                    },
                }

                let login_success = await WalletHelpers.walletLogin(public_address, sec_keys.view);
                if (!login_success) {
                    showDonationError('Something went wrong. Please try again');
                    return;
                }

                let blockchain_height = await WalletHelpers.getBlockchainHeight(public_address, sec_keys.view);
                if (!blockchain_height) {
                    showDonationError('Failed to retrieve blockchain height please try again');
                    return;
                }

                let coreBridge_instance = await mymonero_core_js.monero_utils_promise;
                // coreBridge_instance.set_current_blockchain_height(blockchain_height);
                coreBridge_instance.async__send_funds(params);
            }

            const setMonthlyDonation = async () => {
                try {
                    const claims = await getFirebaseClaims();
                    if (claims.has2FA) {
                        showHideButtonLoader('buttonConfirmMonthly', 'showLoader');
                        saveMonthlyDonation();
                    } else {
                        showModal2FA('monthly');
                    }
                } catch (error) {
                    console.log('Error setting monthly donation', error);

                }
            }

            const saveMonthlyDonation = async () => {
                try {
                    let startDateToDonate = document.getElementById('startDonationDate').value.split('/');
                    const dayInMonth = startDateToDonate[0];
                    startDateToDonate = startDateToDonate[1] + ',' + startDateToDonate[0] + ',' + startDateToDonate[2];
                    startDateToDonate = new Date(startDateToDonate).getTime();
                    const url = functionBaseURL + '/app/saveMonthlyDonation';
                    const dataDonation = {
                        userToDonate: localStorage.getItem('userNameToDonate'),
                        wallet: document.getElementById('spanWalletAddressMonthly').innerText,
                        amount: Number(document.getElementById('spanAmountMonthly').innerText.split(' ')[0]),
                        startDate: startDateToDonate,
                        userSocialId: localStorage.getItem('userSocialId'),
                        userPlatorm: localStorage.getItem('userPlatform'),
                        type: 'donation',
                        processed: false,
                        canceled: false,
                        donation_day: dayInMonth
                    }
                    const resultSave = await firebaseXhr(url, JSON.stringify(dataDonation));
                    showHideButtonLoader('buttonConfirmMonthly', 'hideLoader');
                    if (resultSave.sucess == true && resultSave.data != undefined) {
                        document.getElementById('createNewMonthlyDonationDiv').classList.add('displayNone');
                        document.getElementById('divHeaderMonthlyDontions').classList.remove('displayNone');
                        document.getElementById('divHeaderMonthlyDontions').style.animation = "listPop 0.4s ease forwards";
                        fillMonthlyDonations(resultSave.data)
                    }

                } catch (err) {
                    console.log('Error saving monthly donation', err)
                }
            }

            const showModal2FA = (type) => {
                const instanceModal2fa = mobiscroll.popup('#donate-2fa-modal', {
                    display: 'center',
                    closeOnOverlayTap: false,
                    cssClass: 'popUpResendEmail',
                    buttons: [{
                            text: i18next.t('confirm'),
                            cssClass: 'buttonModdal',
                            handler: async (event, inst) => {
                                var secret = document.getElementById('donate-verify2FASecret').value;
                                console.log('secret !! ', secret)
                                const url = functionBaseURL + '/app/verifySecret?userToken=' + secret + '&action=verifySecret'
                                const verify2fa = await firebaseXhr(url);
                                if (verify2fa == 'SecurityEnable') {
                                    if (type == 'onetime') {
                                        inst.hide();
                                        new_send_coins(walletAddress, localStorage.getItem('ammontToDonate'), document.getElementById('spanPaymentId').innerText);
                                    } else if (type == 'monthly') {
                                        inst.hide();
                                        showHideButtonLoader('buttonConfirmMonthly', 'showLoader');
                                        saveMonthlyDonation();
                                    }
                                } else {
                                    const error = [i18next.t('the2FANotCorrect')];
                                    const inputWithError = ['donate-verify2FASecret'];
                                    setErrors(error, inputWithError);
                                }
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

                    }
                });

                instanceModal2fa.show();

            }
        }



    });

});