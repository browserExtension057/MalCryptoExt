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
        uppward.monitor.options.get(function(opt){
            var $switch = $(".switch");
            var $switchAlertInput = $("#alterbar");
            var $selectButton = $('.select-button');
            var $selectList = $('.select-list');
            var $dispList = $('li.disp');
            var $anchor = $('.select-list > li > a');
            var $layoutButton = $('.button-layout');
            var $content = $('.uppward-content');

            // action

            // action: slide switch
            $switchAlertInput.click(function() {
                var val = $(this).prop('checked');
                if (!val) {
                    $(this).removeAttr('checked');
                    $(this).parent().removeClass('checked');
                    $selectList.slideUp(200);
                } else {
                    $(this).parent().addClass('checked');
                }
                $selectButton.prop('disabled', !val);
                $layoutButton.prop('disabled', !val);
                uppward.monitor.options.set('alterbar' , val, function(){});
            });

            // action: dropdown button
            $selectButton.click(function(e){
                var type = $(this).attr('data-type');
                if (type === 'disptime') {
                    $selectList.eq(0).slideToggle(200);
                } else {
                    $selectList.eq(1).slideToggle(200);
                }
                e.preventDefault();
            });

            // action: dropdown item select
            $anchor.click(function() {
                var $parent = $(this).parent();
                var $ul = $parent.parent();
                var $button = $ul.prev();
                var value = $parent.attr('data-value');
                var type = $(this).parent().parent().attr('data-type');
                $parent.siblings().removeClass('selected');
                $parent.addClass('selected');
                $button.text($(this).text());
                $ul.slideUp(200);
                uppward.monitor.options.set(type , value, function(){});
            });

            // action: layout buttons
            $layoutButton.click(function() {
                var value = $(this).val();
                $layoutButton.removeClass('selected');
                $(this).addClass('selected');
                uppward.monitor.options.set('layouttype' , value, function(){
                    window.location.href = "setting-whitelist.html";
                });
            });

            // init value
            $switchAlertInput.prop('checked', opt.alterbar);
            $dispList.removeClass('selected');
            $layoutButton.removeClass('selected');

            $('.disp[data-value="' + opt.disptime + '"]').addClass('selected');
            $('.button-layout[value="' + opt.layouttype +'"]').addClass('selected');

            $selectButton.eq(0).text($('.disp[data-value="' + opt.disptime + '"]').text());

            // disabled if ...
            if (!opt.alterbar) {
                $selectButton.prop('disabled', true);
                $layoutButton.prop('disabled', true);
            } else {
                $switchAlertInput.parent().addClass('checked')
            }
            if (!opt.activeprotect) {
                $switchAlertInput.prop('disabled', true);
                $switchAlertInput.parent().find('.switch-inner').addClass('disabled');
                $selectButton.prop('disabled', true);
                $layoutButton.prop('disabled', true);
            }

            // slide bug fix
            setTimeout(function() {
                $switch.removeClass('no-animation');
            }, 250);
            $content.removeClass('invisible');
        });

    });
    document.addEventListener('touchstart', function (e) { e.preventDefault(); }, {passive: true});
}

Raven.config('https://750765379782454e9e109e9f90c4e487@sentry.io/1247921').install();
//Raven.config('https://e24a799e06fb4f41b19525ed84e476fd@sentry.io/1309531').install();
Raven.context(function () {
    init();
});
