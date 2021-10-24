// var apiUrl =  "https://mywallet.bittubeapp.com/";
var apiUrl = `${localStorage.getItem('wallet_server')}/tube4/`;
// let extServerUrl = "https://us-central1-bittube-airtime-extension.cloudfunctions.net/app/";

var extServerUrl;
// TODO: FIXME INJECTED PAGE WORKAROUND
if (typeof functionBaseURL === 'undefined') {
    extServerUrl = 'https://us-central1-bittube-airtime-extension.cloudfunctions.net/app/';
} else {
    extServerUrl = functionBaseURL + '/app/';
}

class WalletHelpers
{
    static async getWalletsInfo(token){
        let res = await fetch(extServerUrl+"returnWallet",
            {
                headers: new Headers({
                'Authorization': 'Bearer '+token,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
        let data = await res.text();
        const bytes = CryptoJS.AES.decrypt(data, token);
        const walletInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return walletInfo.wallets;
    }

    static async getBlockchainHeight(public_address, view_key){
        let data = {};
        data.address = public_address;
        data.view_key = view_key;
        let url = apiUrl + 'get_address_info';
        let response = await this.sendPost(url, data);
        let address_info = await response.json();
        return address_info.blockchain_height;
    }

    static async addHistory(token, parameters)
    {
        let url = extServerUrl+'addHistory';
        let data = await this.sendPost(url, parameters, token);
        data = await data.text();
    }

    static async walletLogin(address, view_key)
    {
        let login_payload = {
            withCredentials: true,
            address: address,
            view_key: view_key,
            create_account: true,
            create_only: true,
            new_account_created: false,
            generated_locally: true
        }
        let data = await this.sendPost(apiUrl+'login', login_payload);
        data = await data.json();
        if(data.status == 'success')
            return true;
        else
            return false;
    }

    static async getUnspentOuts(parameters, fn)
    {
        let response = await this.reqToWalletAPI('get_unspent_outs', parameters, fn);
        return response;
    }

    static async getRandomOuts(parameters, fn)
    {
        let response = await this.reqToWalletAPI('get_random_outs', parameters, fn);
        return response;
    }

    static async submitRawTx(parameters, fn)
    {
        let response = await this.reqToWalletAPI('submit_raw_tx', parameters, fn);
        return response;
    }

    static async getAddressTxs(parameters)
    {
        let response = await this.reqToWalletAPI('get_address_txs', parameters);
        return response;
    }

    static async getAddressInfo(parameters) {
        let response = await this.reqToWalletAPI('get_address_info', parameters);
        return response;
    }

    static async reqToWalletAPI(endpoint, parameters, callback) {
        const resp = await this.sendPost(apiUrl + endpoint, parameters);
        const text = await resp.text();
        const data = JSON.parse(text);
        const err = (data || {}).error || (data || {}).Error;
        if (callback) {
            if (err) return callback(err);
            return callback(null, data);
        }
        if (err) throw new Error(err);
        return data;
    }

    static sendPost(url, parameters, token)
    {
        let options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(parameters)
        }
        if (token) { options.headers.Authorization = 'Bearer ' + token; }
        return fetch(url, options);
    }

}