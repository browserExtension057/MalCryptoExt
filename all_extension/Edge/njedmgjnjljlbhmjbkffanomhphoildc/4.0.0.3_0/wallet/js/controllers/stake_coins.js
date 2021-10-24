// Copyright (c) 2014-2017, MyBittube.com
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

thinwalletCtrls.controller('StakeCoinsCtrl', function($scope, $rootScope, AccountService, ModalService, $timeout, $i18next) {
  "use strict";

  $scope.error = "";
  $scope.staking_id = AccountService.getSelectedWallet();
  $scope.staking = {address: '', view: {sec: ''}};
  $scope.staking_balance = 0;
  $scope.staking_amount = 0;
  $scope.staking_level = '';
  $scope.staking_done_loading = false;
  $scope.staking_scanned_block_height = 0;
  $scope.staking_scanned_block_timestamp = 0;
  $scope.staking_blockchain_height = 0;
  $scope.transactions = [];
  $scope.sync_interval = null;

  console.log('Loaded', $scope.staking_id);
  if ($scope.staking_id === null) {
    $rootScope.jumpToStaking = true;
  }

  const stakingLevelString = (reward_level) => {
    const type = $scope.staking_id == 'onlinewallet' ? 'user' : 'module';
    const level = reward_level === null ? 'none' : reward_level;
    return $i18next.t(`reward_level_${type}_${level}`);
  }

  // const url = 'https://mywallet.bittubeapp.com';
  // const url = `${localStorage.getItem('wallet_server')}/tube4`;
  const url = `${localStorage.getItem('wallet_server')}`; // TODO ~JM staking functionality to tube4
  const loginWallet = async (wallet) => {
    const headers = {'Content-Type': 'application/json'};
    const login = JSON.stringify({address: wallet.public_addr, create_account: true, view_key: wallet.view.sec, withCredentials: true});
    const login_json = await fetch(`${url}/login`, {method: 'POST', headers, body: login}).then(resp => resp.json());
    if (login_json.status != 'success') throw new Error('Error logging in to mywallet');
  }

  const getTransactions = async (wallet) => {
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({address: wallet.public_addr, view_key: wallet.view.sec});
    const json = await fetch(`${url}/get_address_txs`, {method: 'POST', headers, body}).then(resp => resp.json());
    if (json.status != 'success') throw new Error(`Call didn't return success status: ${JSON.stringify(json)}`);
    return json;
  }

  const updateTransactions = async (data) => {
    let total = 0;
    const wallets = await getUserWalletsAsync();
    const withdraws = Object.values(wallets[`staking-${$scope.staking_id}`].withdraws || {}).filter(withdraw => withdraw.success);

    $scope.transactions = data.transactions
      .map(tx => {
        if (tx.total_sent !== 0) {
          const sent_index = withdraws.findIndex(withdraw => {
            if (withdraw.result.tx_sent.indexOf(tx.hash) != -1) return true;
            return false;
          });
          if (sent_index === -1) return;
        }
        tx.amount = +tx.total_received - (+tx.total_sent);
        total += tx.amount;
        return tx;
      })
      .filter(v => !!v)
      .sort((a, b) => b.timestamp - a.timestamp);
    $scope.staking_scanned_block_height = data.scanned_block_height;
    $scope.staking_blockchain_height = data.blockchain_height;
    $scope.staking_scanned_block_timestamp = data.scanned_block_timestamp * 1000;
    $scope.staking_balance = total;
    $scope.staking_done_loading = true;

    if (data.scanned_block_height >= data.blockchain_height && $scope.staking_amount !== $scope.staking_balance) {
      const updated = await callStakingApi('updateStaking', {staking_id: $scope.staking_id});
      await updateCustomClaims();
      $scope.staking.staking_amount = $scope.staking_amount = updated.staking_amount;
      $scope.staking_level = stakingLevelString($scope.staking.reward_level = updated.reward_level);
    }
  }

  const syncTransactions = async (wallet) => {
    try {
      await updateTransactions(await getTransactions(wallet));
    } catch (err) {
      console.error('Error syncing transactions', err);
      $scope.error = err.message;
    } finally {
      $scope.$apply();
    }
  }

  getUserWalletsAsync().then(async wallets => {
    $scope.staking = wallets[`staking-${$scope.staking_id}`];
    if (!$scope.staking) return;
    $scope.staking_amount = $scope.staking.staking_amount || 0;
    if (!$scope.staking.reward_level && $scope.staking_id === 'onlinewallet') {
      const claims = await getFirebaseClaims();
      $scope.staking.reward_level = claims.verified ? 0 : null;
    }
    $scope.staking_level = stakingLevelString($scope.staking.reward_level);
    $scope.$apply();

    await loginWallet($scope.staking);
    await syncTransactions($scope.staking);
    let fetching = false;
    $scope.sync_interval = setInterval(async () => {
      if (fetching) return;
      fetching = true;
      await syncTransactions($scope.staking);
      fetching = false;
    }, 10000); // TODO: variable update rate based on blocks needing to be synced
  }).catch(err => {
    console.error(err);
    $scope.error = err.message;
    $scope.$apply();
  });

  $scope.$on('$destroy', () => {
    clearInterval($scope.sync_interval);
  });
});