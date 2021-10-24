'use strict';

// var console = chrome.extension.getBackgroundPage().console;
var uppward = chrome.extension.getBackgroundPage().uppward;
var tabId = '';

function initTabId() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs){
        tabId = tabs[0].id;
    });
}

function init() {
    initTabId();

    $(function() {
        //Initialzied Select
        uppward.monitor.options.get(function(opt) {
            // action
            var $switch = $('.switch');
            var $switchInput = $('.switch-checkbox');
            var $activeProtectInput = $('#activeprotect');
            var $twitterBadgeInput = $('#twitterbadge');
            var $cryptoAddressInput = $('#cryptoaddresshighlight');
            var $content = $('.uppward-content');
            var $resetSetting = $('#resetsetting');

            $switchInput.click(function() {
                var val = $(this).prop('checked');
                var name = $(this).attr('name');

                if (!val) {
                    $(this).removeAttr('checked');
                    $(this).parent().removeClass('checked');
                } else {
                    $(this).parent().addClass('checked');
                }
                if (name === 'activeprotect') {
                    uppward.pref.setIsMonitoring(val);
                    $twitterBadgeInput.prop('disabled', !val);
                    $cryptoAddressInput.prop('disabled', !val);
                    if (val) {
                        chrome.tabs.sendMessage(tabId, {operation: 'enableActiveProtect'});
                        $twitterBadgeInput.parent().find('.switch-inner').removeClass('disabled');
                        $cryptoAddressInput.parent().find('.switch-inner').removeClass('disabled');
                    } else {
                        $twitterBadgeInput.parent().find('.switch-inner').addClass('disabled');
                        $cryptoAddressInput.parent().find('.switch-inner').addClass('disabled');
                        chrome.tabs.sendMessage(tabId, {operation: 'disableLrd'});
                    }
                } else if (name === 'twitterbadge') {
                    uppward.monitor.options.set('twitterbadge', val, function(){
                        uppward.pref.setTweetBadge(val);
                    });
                } else if (name === 'cryptoaddresshighlight') {
                    uppward.monitor.options.set('cryptoaddresshighlight', val, function(){
                        uppward.pref.setCryptoAddr(val);
                    });
                }
            });

            $resetSetting.click(function() {
                chrome.storage.local.set({
                    options : {
                        activeprotect : true
                        , twitterbadge : true
                        , cryptoaddresshighlight : true
                        , punycodeurl : false
                        , suspiciousurl : 'Overlay'
                        , alterbar : true
                        , disptime : 3
                        , typefacesize : 13
                        , layouttype : 'Top'
                        , backgroundcolor : '#20C997'
                        , lrd : true
                        , lrdalert : true
                        , lrdlayouttype : 'Bottom'
                        , gaPrivacy: false
                    }
                }, function(){
                    window.location.href = "setting-general.html";
                });
            });

            // init value
            $activeProtectInput.prop('checked', opt.activeprotect);
            $twitterBadgeInput.prop('checked', opt.twitterbadge);
            $cryptoAddressInput.prop('checked', opt.cryptoaddresshighlight);

            // disabled if ...
            if (!opt.twitterbadge) {
                $twitterBadgeInput.parent().removeClass('checked');
            } else {
                $twitterBadgeInput.parent().addClass('checked');
            }
            if (!opt.cryptoaddresshighlight) {
                $cryptoAddressInput.parent().removeClass('checked');
            } else {
                $cryptoAddressInput.parent().addClass('checked');
            }
            if (!opt.activeprotect) {
                $twitterBadgeInput.prop('disabled', true);
                $twitterBadgeInput.parent().find('.switch-inner').addClass('disabled');
                $cryptoAddressInput.prop('disabled', true);
                $cryptoAddressInput.parent().find('.switch-inner').addClass('disabled');
                $activeProtectInput.parent().removeClass('checked');
            } else {
                $activeProtectInput.parent().addClass('checked');
            }

            // slide bug fix
            setTimeout(function() {
                $switch.removeClass('no-animation');
            }, 250);
            $content.removeClass('invisible');
        });
    });
}

Raven.config('https://750765379782454e9e109e9f90c4e487@sentry.io/1247921').install();
//Raven.config('https://e24a799e06fb4f41b19525ed84e476fd@sentry.io/1309531').install();
Raven.context(function () {
    init();
});