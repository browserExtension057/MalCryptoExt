// Copyright (c) 2014-2015, MyBittube.com
// 
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
// 
// 1. Redistributions of source code must retain the above copyright notice, this list of
//    conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//    of conditions and the following disclaimer in the documentation and/or other
//    materials provided with the distribution.
// 
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//    used to endorse or promote products derived from this software without specific
//    prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

thinwalletCtrls.controller('AccountCtrl', function($scope, $rootScope, $http, $q,
                                                   $interval, AccountService,
                                                   EVENT_CODES, ApiCalls, $location) {
    "use strict";
    $scope.loggedIn = AccountService.loggedIn;
    $scope.logout = AccountService.logout;
    $scope.isStakeableWallet = AccountService.isStakeableWallet;
    $scope.checkStakingWallet = AccountService.checkStakingWallet;

    $scope.balance = BigInteger.ZERO;
    $scope.locked_balance = BigInteger.ZERO;
    $scope.total_received = BigInteger.ZERO;
    $scope.received_unlocked = BigInteger.ZERO;
    $scope.total_received_unlocked = BigInteger.ZERO;
    $scope.total_sent = BigInteger.ZERO;;
    $scope.address = AccountService.getAddress();
    $scope.view_key = $scope.viewkey = AccountService.getViewKey();
    $scope.view_only  = AccountService.isViewOnly();
    $scope.spend_key = AccountService.getSpendKey();
    $scope.mnemonic = AccountService.getMnemonic();

    $scope.nettype = config.nettype;

    $scope.transactions = [];
    $scope.blockchain_height = 0;
    $scope.error = "";

    $scope.done_loading = false;
    // var private_view_key = AccountService.getViewKey();
    

    // decrypt_payment_id();


    $scope.tx_is_confirmed = function(tx) {
       // return ($scope.blockchain_height - tx.height) > config.txMinConfirms;
        if (!tx.coinbase)
        {
            // for regular txs, by defalut 10 blocks is required for it to
            // be confirmed/spendable
            return ($scope.blockchain_height - tx.height) > config.txMinConfirms;
        }
        else
        {
            // coinbase txs require much more blocks (default 60)
            // for it to be confirmed/spendable
            return ($scope.blockchain_height - tx.height) > config.txCoinbaseMinConfirms;
        }
    };

    $scope.tx_is_unlocked = function(tx) {
        return cnUtil.is_tx_unlocked(tx.unlock_time || 0, $scope.blockchain_height);
        //return false;
    };

    $scope.tx_is_mempool = function(tx) {
        //console.log(tx.mempool);
        return tx.mempool;
    };

    $scope.tx_locked_reason = function(tx) {
        return cnUtil.tx_locked_reason(tx.unlock_time || 0, $scope.blockchain_height);
    };

    $scope.set_locked_balance = function(locked_balance) {
        $scope.locked_balance = locked_balance;
    };
    $scope.set_total_received = function(total_received) {
        $scope.total_received = total_received;
    };
    $scope.set_total_sent = function(total_sent) {
        $scope.total_sent = total_sent;
    };

    $scope.$on(EVENT_CODES.authStatusChanged, function() {
        $scope.address = AccountService.getAddress();
        $scope.view_key = $scope.viewkey = AccountService.getViewKey();
        $scope.spend_key = AccountService.getSpendKey();
        $scope.mnemonic = AccountService.getMnemonic();
        $scope.view_only = AccountService.isViewOnly();
        if (!AccountService.loggedIn()) {
            $scope.transactions = [];
            $scope.blockchain_height = 0;
            $scope.balance = BigInteger.ZERO;
            $scope.locked_balance = BigInteger.ZERO;
            $scope.total_received = BigInteger.ZERO;
            $scope.total_received_unlocked = BigInteger.ZERO;
            $scope.received_unlocked = BigInteger.ZERO;
            $scope.total_sent = BigInteger.ZERO;
        }
    });

    $scope.fetchAddressInfo = function() {
        if (AccountService.loggedIn()) {
            ApiCalls.fetchAddressInfo(AccountService.getAddress(), AccountService.getViewKey())
                .then(function(response) {

                    var data = response.data;

                    if (data.status === "error")
                    {
                        $scope.error = "An error occured in fetchAddressInfo: "
                                + data.reason;
                        $scope.transactions = [];
                        return;
                    }

                    var promises = [];

                    var view_only = AccountService.isViewOnly();
                    for (var i = 0; i < (data.spent_outputs || []).length; ++i)
                    {
                        var deferred = $q.defer();
                        promises.push(deferred.promise);

                        if (view_only === false)
                        {
                            (function(deferred, spent_output) {
                                setTimeout(function() {
                                    var key_image = AccountService.cachedKeyImage(
                                        spent_output.tx_pub_key,
                                        spent_output.out_index
                                    );
                                    if (spent_output.key_image !== key_image) {
                                        data.total_sent = new BigInteger(data.total_sent).subtract(spent_output.amount);
                                    }
                                    deferred.resolve();
                                }, 0);
                            })(deferred, data.spent_outputs[i]);
                        }
                    }
                    $q.all(promises).then(function() {

                        var scanned_block_timestamp = data.scanned_block_timestamp || 0;

                        if (scanned_block_timestamp > 0)
                            scanned_block_timestamp = new Date(scanned_block_timestamp * 1000)


                        $scope.locked_balance = new BigInteger(data.locked_funds || 0);
                        $scope.total_sent = new BigInteger(data.total_sent || 0);
                        //$scope.account_scanned_tx_height = data.scanned_height || 0;
                        $scope.account_scanned_block_height = data.scanned_block_height || 0;
                        $scope.account_scanned_block_timestamp = scanned_block_timestamp;
                        $scope.account_scan_start_height = data.start_height || 0;
                        //$scope.transaction_height = data.transaction_height || 0;
                        $scope.blockchain_height = data.blockchain_height || 0;
                        $scope.done_loading = true;
                    });
                    // mymonero_core_js.monero_utils_promise.then(bridge => bridge.set_current_blockchain_height(data.scanned_block_height));

            }, function(response) {
                    console.log(response)
                });
        }
    };

    $scope.fetchTransactions = function() {
        if (AccountService.loggedIn())
        {
            var view_only = AccountService.isViewOnly();

            ApiCalls.get_address_txs(AccountService.getAddress(), AccountService.getViewKey())
                .then(function(response) {

                    var data = response.data;

                    if (data.status === "error")
                    {
                        $scope.error = "An error occured in fetchTransactions: "
                                + data.reason;
                        $scope.transactions = [];
                        return;
                    }

                    var scanned_block_timestamp = data.scanned_block_timestamp || 0;

                    if (scanned_block_timestamp > 0)
                        scanned_block_timestamp = new Date(scanned_block_timestamp * 1000)

                    $scope.account_scanned_height = data.scanned_height || 0;
                    $scope.account_scanned_block_height = data.scanned_block_height || 0;
                    $scope.account_scanned_block_timestamp = scanned_block_timestamp;
                    $scope.account_scan_start_height = data.start_height || 0;
                    //$scope.transaction_height = data.transaction_height || 0;
                    $scope.blockchain_height = data.blockchain_height || 0;


                    var transactions = data.transactions || [];
                    
                    for (var i = 0; i < transactions.length; ++i) {
                        if ((transactions[i].spent_outputs || []).length > 0)
                        {
                            if (view_only === false)
                            {
                                for (var j = 0; j < transactions[i].spent_outputs.length; ++j)
                                {
                                    var key_image = AccountService.cachedKeyImage(
                                        transactions[i].spent_outputs[j].tx_pub_key,
                                        transactions[i].spent_outputs[j].out_index
                                    );
                                    if (transactions[i].spent_outputs[j].key_image !== key_image)
                                    {
                                        transactions[i].total_sent = new BigInteger(transactions[i].total_sent).subtract(transactions[i].spent_outputs[j].amount).toString();
                                        transactions[i].spent_outputs.splice(j, 1);
                                        j--;
                                    }
                                }
                            }
                        }
                        //console.log(transactions[i].total_received, transactions[i].total_sent);


                        // decrypt payment_id8 which results in using
                        // integrated address
                        if (transactions[i].payment_id.length == 16) {
                            if (transactions[i].tx_pub_key) {
                                var decrypted_payment_id8
                                    = decrypt_payment_id(transactions[i].payment_id,
                                                        transactions[i].tx_pub_key,
                                                        AccountService.getViewKey());
                                //console.log("decrypted_payment_id8: " + decrypted_payment_id8);
                                transactions[i].payment_id = decrypted_payment_id8;
                            }
                        }


                        if (view_only === false)
                        {

                            if (new BigInteger(transactions[i].total_received || 0).add(transactions[i].total_sent || 0).compare(0) <= 0)
                            {
                                transactions.splice(i, 1);
                                i--;
                                continue;
                            }


                            transactions[i].amount = new BigInteger(transactions[i].total_received || 0)
                                .subtract(transactions[i].total_sent || 0).toString();
                        }
                        else
                        {
                            //remove tx if zero xmr recievied. probably spent only tx,
                            //but we dont have spendkey to verify this.
                            //console.log(new BigInteger(transactions[i].total_received));
                            //console.log(new BigInteger(transactions[i].total_received).compare(0));
                            if (new BigInteger(transactions[i].total_received).compare(0) <= 0)
                            {
                                transactions.splice(i, 1);
                                i--;
                                continue;
                            }
                            transactions[i].amount = new BigInteger(transactions[i].total_received).toString();

                        }

                        transactions[i].approx_float_amount = parseFloat(cnUtil.formatMoney(transactions[i].amount));
                        transactions[i].timestamp = new Date(transactions[i].timestamp);
                    }

                    transactions.sort(function(a, b)
                    {
                        return b.id - a.id; // sort by id in database

                        //var t1 = b.timestamp;
                        //var t2 = a.timestamp;

                        //return ((t1 < t2) ? -1 : ((t1 > t2) ? 1 : 0));
                    });
                    $scope.transactions = transactions;
                    $scope.total_received = new BigInteger(data.total_received || 0);
                    $scope.total_received_unlocked = new BigInteger(data.total_received_unlocked || 0);
                    if (firebase.auth().currentUser != null){
                        document.getElementById('divWalletLoader').style.opacity = '0';
                        document.getElementById('divFullHeader').classList.remove('displayNone');
                        document.getElementById('mainSection').classList.remove('displayNone');
                        setTimeout(function(e){
                            document.getElementById('divWalletLoader').style.visibility = 'hidden';
                        }, 200);
                    }
                    
                }, function(response){
                    console.log("error")
                });
        }
    };

    $scope.isAccountCatchingUp = function() {
        return ($scope.blockchain_height - $scope.account_scanned_block_height) >= 10;
    };

    $scope.$watch(
        function(scope) {
            return {
                sent: scope.total_sent,
                received: scope.total_received,
                received_unlocked: scope.total_received_unlocked
            };
        },
        function(data) {
            $scope.balance = data.received.subtract(data.sent);
            $scope.balance_unlocked = data.received_unlocked.subtract(data.sent);
        },
        true
    );

    $rootScope.$watch('account', $scope.fetchAddressInfo);
    var fetchInterval = $interval($scope.fetchAddressInfo, 10 * 1000);
    $scope.fetchAddressInfo();
    $scope.$on('$destroy', function() {
        $interval.cancel(fetchInterval);
    });
    const fetchLoggedInData = () => {
        getUserWalletInfo(function(wallets){
          document.getElementById('selectWallets').innerHTML = '';
          const arrayUserWallets = Object.entries(wallets).map(([key, value]) => ({key,value}));
          if (arrayUserWallets.length > 0){
            for(let j = 0; j < arrayUserWallets.length; j++){
              if (!arrayUserWallets[j].value || arrayUserWallets[j].value.staking) continue;
              let spanWallet = document.createElement('span');
              if (arrayUserWallets[j].key == 'Onlinewallet' || arrayUserWallets[j].key == 'onlinewallet'){
                spanWallet.innerText = 'Online Wallet';
              }else if (arrayUserWallets[j].key == 'Cardwallet' || arrayUserWallets[j].key == 'cardwallet'){
                spanWallet.innerText = 'Card Wallet';
              }else{
                // spanWallet.innerText = arrayUserWallets[j].key.charAt(0).toUpperCase() + arrayUserWallets[j].key.slice(1);
                if (arrayUserWallets[j].value.displayName) {
                  spanWallet.innerText = arrayUserWallets[j].value.displayName.charAt(0).toUpperCase() + arrayUserWallets[j].value.displayName.slice(1);
                } else {
                  spanWallet.innerText = arrayUserWallets[j].key.charAt(0).toUpperCase() + arrayUserWallets[j].key.slice(1);
                }
              }

              spanWallet.setAttribute('data-wallet-id', arrayUserWallets[j].key);
              // spanWallet.setAttribute('data-publicaddres', arrayUserWallets[j].value.public_addr);
              if ( arrayUserWallets[j].value && arrayUserWallets[j].value.spend ){
                const public_address = cnUtil.pubkeys_to_string(arrayUserWallets[j].value.spend.pub, arrayUserWallets[j].value.view.pub);
                spanWallet.setAttribute('data-publicaddres', public_address);
              }
              spanWallet.className = 'w-dropdown-link dropdown-styling pointer bottom optionWallet';
              spanWallet.addEventListener('click', function(e){
                // const address = this.getAttribute('data-publicaddres');
                const address = cnUtil.pubkeys_to_string(arrayUserWallets[j].value.spend.pub, arrayUserWallets[j].value.view.pub);
                const wallet_id = this.getAttribute('data-wallet-id');
                const walletName = arrayUserWallets[j].key.charAt(0).toLowerCase() + arrayUserWallets[j].key.slice(1);
                const walletOptions = document.getElementsByClassName('optionWallet');
                for (let i = 0; i < walletOptions.length; i++){
                  walletOptions[i].classList.remove('walletSelected');
                }
                this.classList.add('walletSelected');
                loadWallet(walletName, address, wallet_id);
              });
              if (arrayUserWallets[j].key == 'onlinewallet'){
                spanWallet.classList.add('walletSelected');
              }
              document.getElementById('selectWallets').appendChild(spanWallet);
            }
          }
          var onlinewallet = wallets.onlinewallet;
          // var address = onlinewallet.public_addr
          var address = cnUtil.pubkeys_to_string(onlinewallet.spend.pub, onlinewallet.view.pub);
          var viewKey = onlinewallet.view.sec;
          var spendKey = onlinewallet.spend.sec;

          AccountService.login(address, viewKey, spendKey, undefined, true, 'onlinewallet').then(function(data) {
            $location.path("/overview");
          });

          function loadWallet(walletName, address, wallet_id){
            // console.log('LoadWallet', walletName, address);

            if (walletName == 'Onlinewallet' || walletName == 'onlinewallet'){
              document.getElementById('walletName').innerText = 'Online Wallet';
            }else if (walletName == 'Cardwallet' || walletName == 'cardwallet'){
              document.getElementById('walletName').innerText = 'Card Wallet';
            }else{
              if (wallets[walletName].displayName) {
                document.getElementById('walletName').innerText = wallets[walletName].displayName.charAt(0).toUpperCase() + wallets[walletName].displayName.slice(1);
              } else {
                document.getElementById('walletName').innerText = walletName.charAt(0).toUpperCase() + walletName.slice(1);
              }
            }

            AccountService.logout(false);
            document.getElementById('divWalletLoader').style.visibility = 'visible';
            document.getElementById('divWalletLoader').style.opacity = '1';
            $scope.done_loading = false;
            //CLOSE DROPDOWN
            document.getElementById('selectWallets').classList.remove('w--open');
            // AccountService.login(wallets[walletName].public_addr, wallets[walletName].view.sec, wallets[walletName].spend.sec, undefined, true, wallet_id)
            const addr = cnUtil.pubkeys_to_string(wallets[walletName].spend.pub, wallets[walletName].view.pub);
            AccountService.login(addr, wallets[walletName].view.sec, wallets[walletName].spend.sec, undefined, true, wallet_id)
            .then(function(data){
              $location.path("/overview");
              // document.getElementById('divWalletLoader').style.visibility = 'hidden';
              // document.getElementById('divWalletLoader').style.opacity = '0';
            });
          }
        });
      };

    //Auto log in routine
    // if(!AccountService.loggedIn())
    // {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                if (document.getElementById('submit-secret') != null ){
                    document.getElementById('submit-secret').addEventListener('click', function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        showHideButtonLoader('submit-secret', 'showLoader');
                        var form = document.getElementById("verify2FA"),
                            addedToFields = false;
                        if (document.getElementById('secret-2fa').value != '' ){
                            var secret = document.getElementById('secret-2fa').value;
                            $scope.verify2FASecret(secret, function(response){
                                console.log(response)
                            });
                        }else{
                            const errors = ['Please enter the 2FA code'];
                            const elementsWithErrors = ['secret-2fa'];
                            setErrors(errors, elementsWithErrors);
                            showHideButtonLoader('submit-secret', 'hideLoader');
                        }
                    });
                }

                if (document.getElementById('secret-2fa') != null){
                    document.getElementById('secret-2fa').addEventListener('keydown', function(e){

                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 ) {
                            if (e.keyCode != 13){
                              e.preventDefault();
                            }else if(e.keyCode == 13 ){
                                e.preventDefault();
                                e.stopPropagation();
                                showHideButtonLoader('submit-secret', 'showLoader');
                                var form = document.getElementById("verify2FA"),
                                addedToFields = false;
                                if (validateForm(e, form, addedToFields)){
                        
                                    var secret = document.getElementById('secret-2fa').value;
                                    $scope.verify2FASecret(secret, function(response){
                                        console.log(response)
                                    });
                                }else{
                                    showHideButtonLoader('submit-secret', 'hideLoader');
                                }
                            }
                          }
                    })
                }
                
                document.getElementById('divLoginWallet').classList.add('displayNone');
                document.getElementById('divWalletLoader').style.visibility = 'visible';
                document.getElementById('divWalletLoader').style.opacity = '1';
                
                AccountService.has2FA = false;
                AccountService.checkUser2FAEnabled(function(has2FA){
                    if(has2FA)
                    {
                        AccountService.has2FA = true;
                        document.getElementById('divWalletLoader').style.visibility = 'hidden';
                        document.getElementById('divWalletLoader').style.opacity = '0';
                        require2FAToken().then(() => {
                            document.getElementById('divWalletLoader').style.visibility = 'visible';
                            document.getElementById('divWalletLoader').style.opacity = '1';
                            fetchLoggedInData();
                        });
                    }else{
                        if(!AccountService.loggedIn())
                        {
                            fetchLoggedInData();
                        }
                    }
                });

                $scope.verifySecret = '';
                $scope.verify2FASecret = function(secret)
                {
                    if(secret.length != 6){
                        const errors = ['Please enter a valid code'];
                        const elementsWithErrors = ['secret-2fa'];
                        setErrors(errors, elementsWithErrors);
                        showHideButtonLoader('submit-secret', 'hideLoader');
                        $scope.secretError = '2FA code should be 6 digits!';
                    }else{
                        AccountService.auth2FA(secret, function(secretValid){
                            if(secretValid)
                            {
                                document.body.style.overflow = 'auto';
                                $scope.verifySecret = '';
                                showHideButtonLoader('submit-secret', 'hideLoader');
                                if(!AccountService.loggedIn())
                                {
                                    document.getElementById('divWalletLoader').style.visibility = 'visible';
                                    document.getElementById('divWalletLoader').style.opacity = '1';
                                    document.getElementById('verifySecretModal').style.display = 'none';
                                    fetchLoggedInData();
                                }else{
                                    document.getElementById('verifySecretModal').style.display = 'none';
                                }
                            }else{
                                const errors = ['Please enter a valid code'];
                                const elementsWithErrors = ['secret-2fa'];
                                setErrors(errors, elementsWithErrors);
                                showHideButtonLoader('submit-secret', 'hideLoader');
                            }
                        })
                    }
                }   
            }else{
                document.getElementById('divFullHeader').classList.add('displayNone');
                document.getElementById('mainSection').classList.add('displayNone');
                
                document.getElementById('divLoginWallet').classList.remove('displayNone');
                if(AccountService.loggedIn())
                {
                    AccountService.logout(false);
                }
            }
        });
    // }
    
    //Used in idle-timeout modal
    $scope.close_window = function(){
        window.close();
    }

});
