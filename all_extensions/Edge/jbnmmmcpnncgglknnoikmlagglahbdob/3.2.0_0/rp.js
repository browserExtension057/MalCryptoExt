'use strict';

// var console = chrome.extension.getBackgroundPage().console;
var uppward = chrome.extension.getBackgroundPage().uppward;
var tabId = '';
var pattern = '';
var pattern_type = '';
var pattern_subtype= '';
var detail = '';
var reporter_info = '';
var security_tags = '';
var security_category = '';
var PatternType = {};

function initTabId() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs){
        tabId = tabs[0].id;
    });
}

function showSuccessPage() {
    //console.log('enter show success page')
    // hide uppward-content
    $('#uppward-content').hide();
    // show popup
    $('#success-popup').show();

}
function post(){

    const indicator = {
        security_category: security_category,
        pattern_type: pattern_type,
        pattern_subtype: pattern_subtype,
        pattern: pattern,
        detail: detail,
        security_tags: security_tags,
        annotation: ''
    }
    const files = [];
    const data = {
        title: pattern,
        detail: detail,
        reporter_info: reporter_info,
        indicators: [indicator],
        files
    };

    var formattedData = JSON.stringify(data)
    uppward.api.createCase(data, pattern, function(err, result) {

        if (err) {
            console.log('error')
            //console.log(err)
            showErrorPopup('serverErr');
            return;
        }
        //console.log('here123')
        //console.log(result.data)
        if (result.data.status) {
            if (result.data.status == 'true') {
                //console.log('inside123')
                showSuccessPage();
                return;
            } else {
                showErrorPopup('serverErr');
                return;
            }
        }
    });
}

function showErrorPopup(errorType){

    if (errorType==='serverErr') {
        $('#serverErrorMsg').addClass('display');
        setTimeout(function() {
            $('#serverErrorMsg').removeClass('display');
        }, 5000);
    } else {
        // field validation error
        $('#fieldErrorMsg').addClass('display');
        setTimeout(function() {
            $('#fieldErrorMsg').removeClass('display');
        }, 3000);
    }

}

function setDataSubtype(dataType) {

    var subTypes = getDataSubTypes(dataType);
    var nodeBefore = document.getElementById('subtypeList');

    //clear existing
    while (nodeBefore.childNodes.length > 1) {
        nodeBefore.removeChild(nodeBefore.lastChild);
    }

    for (var subtype in subTypes) {
        //iterate dictionary, create li element, append to parent
        var list = document.createElement('li');
        list.id= subTypes[subtype]

        var anchor = document.createElement('a');
        anchor.href = '#'
        anchor.innerHTML = subtype

        list.appendChild(anchor)

        nodeBefore.appendChild(list)
    }
}

function getDataSubTypes(dataType){

    var subTypes = {}

    switch(dataType) {
        case 'addr':
            subTypes['Domain'] = 'domain'
            subTypes['URL'] = 'url'
            subTypes['Email'] = 'email'
            subTypes['IPV4'] = 'ipv4'
            subTypes['Other'] = 'other'

            break;
        case 'cryptoaddr':
            subTypes['Binance Coin'] = 'BNB'
            subTypes['Bitcoin'] = 'BTC'
            subTypes['Bitcoin Cash'] = 'BCH'
            subTypes['Cardano'] = 'ADA'
            subTypes['DASH'] = 'DASH'
            subTypes['EOS'] = 'EOS'
            subTypes['Ethereum'] = 'ETH'
            subTypes['Ethereum Classic'] = 'ETC'
            subTypes['Klaytn'] = 'KLAY'
            subTypes['LiteCoin'] = 'LTC'
            subTypes['Monero'] = 'XMR'
            subTypes['Neo'] = 'NEO'
            subTypes['Ripple'] = 'XRP'
            subTypes['Stellar'] = 'XLM'
            subTypes['Tron'] = 'TRX'
            subTypes['Zcash'] = 'ZEC'
            subTypes['Not Applicable'] = 'NA'

            break;

        case 'filehash':
            subTypes['SHA256'] = 'sha256'
            subTypes['MD5'] = 'md5'

            break;

        case 'socialmedia':
            subTypes['Facebook'] = 'facebook'
            subTypes['Telegram'] = 'telegram'
            subTypes['Twitter'] = 'twitter'
            subTypes['Youtube'] = 'youtube'

            break;

        case 'other':
            subTypes['Phone Number'] = 'phone'
            subTypes['Others'] = 'other'

            break;
    }
    return subTypes;
}

function setSTags(tags) {
    var nodeBefore = document.getElementById('stagdd');

    //clear existing
    while (nodeBefore.childNodes.length > 1) {
        nodeBefore.removeChild(nodeBefore.lastChild);
    }
    //console.log('iterating tags')
    for (var tag in tags) {
        //console.log(tags[tag])
        // iterate list, create option element, append to parent
        var option = document.createElement('option');
        option.value = tags[tag]
        option.innerHTML = tags[tag]

        nodeBefore.appendChild(option)
    }
}

PatternType.isURL = function(pattern) {
    return /^((https?:\/\/[^\s/$.?#][^\s]*)|((([a-z0-9]|[^\x00-\x7F])([a-z0-9-]|[^\x00-\x7F])*\.)+([a-z]|[^\x00-\x7F])([a-z0-9-]|[^\x00-\x7F]){1,}(:\d{1,5})?(\/.*)?))$/i.test(pattern);
}

PatternType.isEmail = function(pattern) {
    // http://emailregex.com/
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(pattern);
}

PatternType.isIPv4 = function(pattern) {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(pattern);
}

PatternType.isCryptoETH = function(pattern) {
    // 0x prefix + 40-length hexademical
    // https://github.com/k4m4/ethereum-regex
    return /^0x[a-f0-9]{40}$/i.test(pattern);
}

PatternType.isCryptoBTC = function(pattern) {
    // https://en.bitcoin.it/wiki/Address
    // 1,3 prefix + 25~34 base58 encoding (hash validation까지는 필요없을듯)
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(pattern);
}

PatternType.isCryptoBCH = function(pattern) {
    // btc 포맷과 같으나 같은걸 막기 위해 bch만의 포맷이 새로 추천되고 있음. 둘 다 사용됨.
    return /^(bitcoincash:)?(q|p)[a-z0-9]{41}$/i.test(pattern);
}

PatternType.isCryptoTRX = function(pattern) {
    return /^T[0-9a-zA-Z]{33}$/.test(pattern);
}

PatternType.isCryptoLTC = function(pattern) {
    // btc 와 3이 겹치긴한다.
    return /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(pattern);
}

PatternType.isCryptoDASH = function(pattern) {
    return /^X[a-km-zA-HJ-NP-Z1-9]{33}$/.test(pattern);
}

PatternType.isCryptoZEC = function(pattern) {
    return /^t[13][a-km-zA-HJ-NP-Z1-9]{25,33}$/.test(pattern);
}

PatternType.isCryptoXMR = function(pattern) {
    return /^4[0-9AB][a-km-zA-HJ-NP-Z1-9]{93}$/.test(pattern);
}

PatternType.isCryptoNEO = function(pattern) {
    return /^A[0-9a-zA-Z]{33}$/.test(pattern);
}

PatternType.isHostname = function(pattern) {
    if (/^(([a-z0-9]|[^\x00-\x7F])([a-z0-9-]|[^\x00-\x7F])*\.)+([a-z]|[^\x00-\x7F])([a-z0-9-]|[^\x00-\x7F]){1,}$/i.test(pattern)) {
        var strippedPattern = pattern.replace('//','')
        if (typeof strippedPattern.split('/')[1]=== 'undefined' || strippedPattern.split('/')[1]==='') {
            return true
        }
    }
    return false;
}

PatternType.getType = function(pattern) {
    var tests = [
        ['isHostname', ['addr', 'domain']],
        ['isEmail', ['addr', 'email']],
        ['isURL', ['addr', 'url']],
        ['isIPv4', ['addr', 'ipv4']],
        ['isCryptoETH', ['cryptoaddr', 'ETH']],
        ['isCryptoBTC', ['cryptoaddr', 'BTC']],
        ['isCryptoBCH', ['cryptoaddr', 'BCH']],
        ['isCryptoTRX', ['cryptoaddr', 'TRX']],
        ['isCryptoLTC', ['cryptoaddr', 'LTC']],
        ['isCryptoDASH', ['cryptoaddr', 'DASH']],
        ['isCryptoZEC', ['cryptoaddr', 'ZEC']],
        ['isCryptoXMR', ['cryptoaddr', 'XMR']],
        ['isCryptoNEO', ['cryptoaddr', 'NEO']]
    ];

    var found = [];

    for (var i=0; i<tests.length; i++) {
        var test = tests[i];
        if (PatternType[test[0]](pattern)) {
            found.push(test[1]);
        }
    }
    return found;
}

function init() {
    initTabId();
    var patternValid = false;
    var dataTypeValid = false;
    var subtypeValid = false;
    var detailsValid = false;
    var tags = [];
    var $submitBtn = $('#submitbtn')

    $(function() {

        var $content = $('.uppward-content');

        // add text to security type buttons
        var $blacklist = $('#blacklist');
        $blacklist.prop('value', chrome.i18n.getMessage('rp_secType_bl'));

        var $whitelist = $('#whitelist');
        $whitelist.prop('value', chrome.i18n.getMessage('rp_secType_wl'));

        var $patternTitle = $('#patterntitle');
        $patternTitle.append(chrome.i18n.getMessage('rp_pattern_header'))

        var $patternPlaceholder = $('#pattern');
        $patternPlaceholder.prop('placeholder',chrome.i18n.getMessage('rp_pattern_placeholder') )

        var $datatypePlaceholder = $('#datatypebtn');
        $datatypePlaceholder.prop('text',chrome.i18n.getMessage('rp_datatype_placeholder') )

        var $datatypetitle = $('#datatypetitle');
        $datatypetitle.append(chrome.i18n.getMessage('rp_datatype_header'))

        var $datasubtypetitle = $('#datasubtypetitle');
        $datasubtypetitle.append(chrome.i18n.getMessage('rp_datasubtype_header'))

        var $detailstitle = $('#detailsheader');
        $detailstitle.append(chrome.i18n.getMessage('rp_details_header'))

        var $detailsPlaceholder = $('#details');
        $detailsPlaceholder.prop('placeholder',chrome.i18n.getMessage('rp_details_placeholder') )

        $('#stagdd').select2({
            maximumSelectionLength: 3
        });
        // get s_tags
        uppward.api.retrieve_stag(function(err, result){
           if (err) {
             if (err.status === 0) {
                //console.log(err)
                alert(chrome.i18n.getMessage('errorConn'));
             } else if (err.status === 421) {
                //console.log(err)
                alert(chrome.i18n.getMessage('errorSignature'));
             } else {
                try {
                    var msg = chrome.i18n.getMessage('errorServer', [JSON.parse(err.response).error.msg + ' (code:' + err.status + ')']);
                    alert(msg);
                } catch(e) {
                    alert(chrome.i18n.getMessage('errorConn'));
                }
             }
           } else {
             var data = result.data;
             tags = data.tags
             setSTags(tags);

           }
        })

        // security category
        var $blbutton = $('#blacklist');
        var $wlbutton = $('#whitelist');

        // action - security category
         $blbutton.click(function(){
            $blbutton.addClass('selected');
            $wlbutton.removeClass('selected');
         });

         $wlbutton.click(function(){
            $wlbutton.addClass('selected');
            $blbutton.removeClass('selected');
         });

        // data type
        var $button = $('.select-button.type');
        var $selectList = $('.select-list.type');
        var $anchor = $('.select-list.type > li > a');
        var $list = $('.select-list.type > li');

        // data subtype
        var $buttonSubType = $('.select-button.subtype');
        var $selectListSubType = $('.select-list.subtype');
        var $anchorSubType = $('.select-list.subtype > li > a');
        var $listSubType = $('.select-list.subtype > li');

        // dynamic identification of pattern type and subtype
        $('#pattern').keyup(function(){

            var patternInput = $('#pattern').val();
            var returntype = PatternType.getType(patternInput)

            if (returntype.length >0 ) {

                var $listType = $('ul.type')
                $listType.siblings().removeClass('selected');
                var $newSelected = $listType.find("[data-value='" + returntype[0][0] + "']")
                var $buttonType = $('button.type')
                $newSelected.addClass('selected')
                $buttonType.text($newSelected.text());
                $buttonType.removeClass('disabled');

                setDataSubtype(returntype[0][0])

                var $listSubtype = $('ul.subtype')
                $listSubtype.siblings().removeClass('selected');
                var $newSelectedSubtype = $('ul.subtype #' + returntype[0][1])
                var $buttonSubtype = $('button.subtype')
                $newSelectedSubtype.addClass('selected')
                $buttonSubtype.text($newSelectedSubtype.text());
                $buttonSubtype.removeClass('disabled');
            }

        });

        // action
        $buttonSubType.click(function(){
            $selectListSubType.slideToggle(200);
        });

        $('.select-list.subtype').on("click", 'li a', function(){
            var $parent = $(this).parent();
            var $ul = $parent.parent();
            var $button = $ul.prev();
            var value = $parent.attr('data-value');
            $parent.siblings().removeClass('selected');
            $parent.addClass('selected');
            $button.text($(this).text());
            $ul.slideUp(200);
            $button.removeClass('disabled');
            subtypeValid = true;
            //updateSubmitBtn();
        })

        $button.click(function(){
            $selectListSubType.slideUp();
            $selectList.slideToggle(200);
        });

        $anchor.click(function() {
            var $parent = $(this).parent();
            var $ul = $parent.parent();
            var $button = $ul.prev();
            var value = $parent.attr('data-value');
            $parent.siblings().removeClass('selected');
            $parent.addClass('selected');
            $button.text($(this).text());
            $ul.slideUp(200);
            // set data subtype based on selected value
            setDataSubtype(value)
            $buttonSubType.text('Select Data Type First');
            $button.removeClass('disabled')
            dataTypeValid = true;
            //updateSubmitBtn();
        });

        //submit button
        $('#submitbtn').click(function() {

            var hasError = false;

            // pattern
            pattern = $('#pattern').val()
            if (pattern === '') {
                var errorPattern = $('#error-pattern')
                errorPattern.text('Please enter pattern.');
                hasError = true;
            }

            // pattern type
            pattern_type = $('.select-list.type li.selected').data('value');
            if (typeof pattern_type === 'undefined') {
                var errorPattern = $('#error-patterntype')
                errorPattern.text('Please choose pattern type.');
                hasError = true;
            }

            // pattern subtype
            pattern_subtype = $('.select-list.subtype li.selected').attr('id');
            if (typeof pattern_subtype === 'undefined') {
                var errorPattern = $('#error-patternsubtype')
                errorPattern.text('Please choose pattern subtype.');
                hasError = true;
            }

            // security tags
            security_tags = $('#stagdd').find(':selected').map(function(){
                return $(this).attr('value');
            }).get();

            // detail
            detail = $('#details').val();
            if (detail === '') {
                var errorPattern = $('#error-details')
                errorPattern.text('Please provide details.');
                hasError = true;
            }

            // reporter_info
            reporter_info = $('#contact').val();

            if (reporter_info!=='') {
                if (!PatternType.isEmail(reporter_info)) {
                    var errorPattern = $('#error-contact')
                    errorPattern.text('Please provide valid email address.');
                    hasError = true;
                }
            }

            // security_category
            security_category = $('.button-row.sectype input.selected').attr('id');

            if (!hasError) {
                post();
            } else {
                $(window).scrollTop(0);
                showErrorPopup('fieldErr');
            }

        });

        //init value
        $list.removeClass('selected');
        $listSubType.removeClass('selected');

        $wlbutton.removeClass('selected')
        $blbutton.addClass('selected')

        $button.text('Select Data Type');
        $button.addClass('disabled')
        $buttonSubType.text('Select Data Type First');
        $buttonSubType.addClass('disabled')

        $content.removeClass('invisible');

    });
}

Raven.config('https://750765379782454e9e109e9f90c4e487@sentry.io/1247921').install();
//Raven.config('https://e24a799e06fb4f41b19525ed84e476fd@sentry.io/1309531').install();
Raven.context(function () {
    init();
});
