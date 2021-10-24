var config = {
    // apiUrl: "https://mywallet.bittubeapp.com/",
    apiUrl: `${localStorage.getItem('wallet_server')}/tube4/`,
    mainnetExplorerUrl: "https://explorer.bittube.cash/",
    testnetExplorerUrl: "",
    stagenetExplorerUrl: "",
    nettype: 0, /* 0 - MAINNET, 1 - TESTNET, 2 - STAGENET */
    coinUnitPlaces: 9,
    txMinConfirms: 10,         // corresponds to CRYPTONOTE_DEFAULT_TX_SPENDABLE_AGE in Monero
    txCoinbaseMinConfirms: 60, // corresponds to CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW in Monero
    coinSymbol: 'TUBE',
    openAliasPrefix: "bittubecash",
    coinName: 'BitTubeCash',
    coinUriPrefix: 'bittubecash:',
    addressPrefix: 2453152,
    integratedAddressPrefix: 2584224,
    subAddressPrefix: 2879136,
    addressPrefixTestnet: 159,
    integratedAddressPrefixTestnet: 12666,
    subAddressPrefixTestnet: 27034,
    addressPrefixStagenet: 153,
    integratedAddressPrefixStagenet: 9210,
    subAddressPrefixStagenet: 23578,
    feePerKB: new BigInteger('2000000000'),//20^10 - not used anymore, as fee is dynamic.
    dustThreshold: new BigInteger('1000000000'),//10^10 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
    txChargeRatio: 0.5,
    defaultMixin: 2, // minimum mixin for hardfork v8 is 10 (ring size 11)
    txChargeAddress: '',
    idleTimeout: 30,
    idleWarningDuration: 20,
    maxBlockNumber: 500000000,
    avgBlockTime: 15,
    debugMode: false
};
