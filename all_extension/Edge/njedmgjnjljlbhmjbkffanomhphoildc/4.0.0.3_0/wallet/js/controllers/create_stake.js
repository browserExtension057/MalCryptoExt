thinwalletCtrls.controller("CreateStakeCtrl", function($scope, $location, AccountService, ModalService, Idle) {
    "use strict";
    $scope.error='';
    $scope.step = 'start';
    $scope.staking_id = AccountService.getSelectedWallet();
    $scope.msig = '';
    $scope.model = {
        address: '',
        msig: '',
        save_keys: true
    };
    $scope.downloaded = false;

    $scope.$on('$destroy', () => {
        if (!Idle.running()) Idle.watch();
    });

    $scope.name = $scope.staking_id === 'onlinewallet' ? i18next.t('userRewards') : i18next.t('moduleRewards');

    $scope.simpleStakingSettings = () => {
        $scope.step = 'simple';
    }

    $scope.goToStart = () => {
        $scope.step = 'start';
    }

    $scope.generateSimpleStaking = async () => {
        $scope.loading = true;
        Idle.unwatch();
        callStakingApi('genStakingSimple', {staking_id: $scope.staking_id, save_keys: $scope.model.save_keys}).then(async data => {
            $scope.wallet = data.wallet;
            $scope.client = data.client;
            $scope.step = 'confirm';
        }).catch(err => {
            $scope.error = err.message;
        }).then(() => {
            $scope.loading = false;
            $scope.$apply();
        });
    }

    $scope.downloadWalletKeys = ($event) => {
        const lnk = document.createElement('a');
        lnk.download = `staking-${$scope.staking_id}.keys`;
        lnk.href = 'data:application/octet-stream;base64,' + $scope.client.download.file;
        document.documentElement.appendChild(lnk);
        lnk.click();
        document.documentElement.removeChild(lnk);
        $scope.downloaded = true;
    }

    const goToStaking = async (wallet) => {
        // somewhat hacky way to not have to re request wallets info for new staking wallet
        const wallets = await getUserWalletsAsync();
        wallets[`staking-${$scope.staking_id}`] = wallet;
        ModalService.hide('create-stake');
        location.hash = '!/stake';
    }

    $scope.confirmSimpleStaking = async () => {
        await goToStaking($scope.wallet);
    }

    $scope.generateSelfStaking = async () => {
        $scope.loading = true;
        callStakingApi('genStakingSetup', {staking_id: $scope.staking_id}).then(setup => {
            $scope.msig = setup.msig;
            $scope.step = 'self';
        }).catch(err => {
            $scope.error = err.message;
        }).then(() => {
            $scope.loading = false;
            $scope.$apply();
        });       
    }

    $scope.generateStakingWallet = async () => {
        $scope.loading = true;
        callStakingApi('genStakingFinal', {staking_id: $scope.staking_id, address: $scope.model.address, msig: $scope.model.msig}).then(async data => {
            await goToStaking(data.wallet);
        }).catch(err => {
            $scope.loading = false;
            $scope.error = err.message;
            $scope.$apply();
        })
    }
});