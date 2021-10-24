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
        uppward.monitor.options.get(function(opt) {

            // var: suspicious url blocker dropdown
            var $button = $('.select-button');
            var $selectList = $('.select-list');
            var $anchor = $('.select-list > li > a');
            var $list = $('.select-list > li');
            var $content = $('.uppward-content');

            // var: general switches
            var $switch = $('.switch');
            var $switchInput = $('.switch-checkbox');

            // var: punycode switch
            var $punycodeSwitchInput = $('#punycode');

            // var: LRD main switch
            var $lrdSwitch = $('.lrd.switch');
            var $lrdSwitchInput = $('#lrd');

            // var: LRD allow alert switch
            var $lrdAlertInput = $('#lrd-alert');

            // var: alert layouts
            var $layoutButton = $('.button-layout');

            // action: switch
            $switchInput.click(function() {
                //console.log('switch action')
                var val = $(this).prop('checked');
                var name = $(this).attr('name');

                if (!val) {
                    $(this).removeAttr('checked');
                    $(this).parent().removeClass('checked');
                } else {
                    $(this).parent().addClass('checked');
                }

                if (name === 'lrd') {
                    $lrdAlertInput.prop('disabled', !val);

                    if (val) {
                        //console.log('remove disable')
                        $lrdAlertInput.parent().find('.switch-inner').removeClass('disabled');
                        $layoutButton.prop('disabled', !$('#lrd-alert').prop('checked'));
                        chrome.tabs.sendMessage(tabId, {operation: 'enableLrd'});
                    } else {
                        //console.log('add disable')
                        $lrdAlertInput.parent().find('.switch-inner').addClass('disabled');
                        $layoutButton.prop('disabled', true);
                        chrome.tabs.sendMessage(tabId, {operation: 'disableLrd'});
                    }
                    uppward.monitor.options.set('lrd' , val, function(){});

                } else if (name === 'punycode') {
                    uppward.monitor.options.set('punycodeurl' , val, function(){});
                } else if (name === 'lrd-alert') {
                    uppward.monitor.options.set('lrdalert' , val, function(){});
                    $layoutButton.prop('disabled', !val);

                    if (!val) {
                        chrome.tabs.sendMessage(tabId, {operation: 'disableLrdAlert'});
                    }
                }
            });

            $button.click(function(){
                $selectList.slideToggle(200);
            });

            $anchor.click(function() {
                var $parent = $(this).parent();
                var $ul = $parent.parent();
                var $button = $ul.prev();
                var value = $parent.attr('data-value');
                $parent.siblings().removeClass('selected');
                $parent.addClass('selected');
                if (value==='Overlay') {
                    var newSUrl = chrome.i18n.getMessage('settings_bl_blocksurl_overlay')
                } else {
                    var newSUrl = chrome.i18n.getMessage('settings_bl_blocksurl_redirection')
                }
                $button.text(newSUrl);
                $ul.slideUp(200);
                uppward.monitor.options.set("suspiciousurl" , value, function(){});
            });

            // action: layout buttons
            $layoutButton.click(function() {
                var value = $(this).val();
                $layoutButton.removeClass('selected');
                $(this).addClass('selected');
                uppward.monitor.options.set('lrdlayouttype' , value, function(){});
            });

            //init value
            $list.removeClass('selected');
            $layoutButton.removeClass('selected');


            $('[data-value="' + opt.suspiciousurl + '"').addClass('selected');
            $('.button-layout[value="' + opt.lrdlayouttype +'"]').addClass('selected');

            if (opt.suspiciousurl==='Overlay') {
                var surlToDisplay = chrome.i18n.getMessage('settings_bl_blocksurl_overlay')
            } else {
                var surlToDisplay = chrome.i18n.getMessage('settings_bl_blocksurl_redirection')
            }

            $button.text(surlToDisplay);
            $punycodeSwitchInput.prop('checked', opt.punycodeurl);
            $lrdSwitchInput.prop('checked', opt.lrd);
            $lrdAlertInput.prop('checked', opt.lrdalert);

            // disabled if ...
            if (opt.punycodeurl) {
                $punycodeSwitchInput.parent().addClass('checked');
            }
            if (opt.lrd) {
                $lrdSwitchInput.parent().addClass('checked');
            } else {
                $layoutButton.prop('disabled', true);
                $lrdAlertInput.prop('disabled', true);
                $lrdAlertInput.parent().find('.switch-inner').addClass('disabled');
            }
            if (opt.lrdalert) {
                $lrdAlertInput.parent().addClass('checked');
            }
            if (!opt.activeprotect) {
                $punycodeSwitchInput.prop('disabled', true);
                $punycodeSwitchInput.parent().find('.switch-inner').addClass('disabled');
                $lrdSwitchInput.prop('disabled', true);
                $lrdSwitchInput.parent().find('.switch-inner').addClass('disabled');
                $lrdAlertInput.prop('disabled', true);
                $lrdAlertInput.parent().find('.switch-inner').addClass('disabled');
                $button.prop('disabled', true);
                $layoutButton.prop('disabled', true);
            }

            // slide bug fix
            setTimeout(function() {
                $switch.removeClass("no-animation");
                $lrdSwitchInput.removeClass("no-animation");
                $lrdAlertInput.removeClass("no-animation");
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
