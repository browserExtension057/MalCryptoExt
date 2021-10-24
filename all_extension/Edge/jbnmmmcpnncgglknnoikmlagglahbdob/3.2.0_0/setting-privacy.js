'use strict';

// var console = browser.extension.getBackgroundPage().console;
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
        uppward.monitor.options.get(function(opt) {

            var $content = $('.uppward-content');
            var $firstOpenText = $('.section-thanks');

            // add link to privacy page
            $('.gadesc').append(chrome.i18n.getMessage('settings_priv_ga_desc1') + "<a target='_blank' href='https://uppsalasecurity.com/privacy/'>" + chrome.i18n.getMessage('settings_priv_ga_desclink') + '</a>' + chrome.i18n.getMessage('settings_priv_ga_desc2'))

            // var: general switches
            var $switch = $('.switch');
            var $switchInput = $('.switch-checkbox');

            // var: ga switch
            var $gaSwitchInput = $('#ga-btn');

            // action: switch
            $switchInput.click(function() {
                var val = $(this).prop('checked');
                var name = $(this).attr('name');

                if (!val) {
                    $(this).removeAttr('checked');
                    $(this).parent().removeClass('checked');
                } else {
                    $(this).parent().addClass('checked');
                }
                if (name === 'ga-btn') {
                    uppward.monitor.options.set('gaPrivacy' , val, function(){});
                }

            });

            //init value
            $gaSwitchInput.prop('checked', opt.gaPrivacy);

            // disabled if ...
            if (opt.gaPrivacy) {
                $gaSwitchInput.parent().addClass('checked');
            }
            if (!opt.firstOpen) {
                $firstOpenText.addClass('hide');
            } else {
                uppward.monitor.options.set('firstOpen' , false, function(){});
            }

            // slide bug fix
            setTimeout(function() {
                $switch.removeClass("no-animation");
                $gaSwitchInput.removeClass("no-animation");
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
