'use strict';

// var console = chrome.extension.getBackgroundPage().console;
var uppward = chrome.extension.getBackgroundPage().uppward;
var tabId = '';

$.fn.selectRange = function(start, end) {
    if(end === undefined) {
        end = start;
    }
    return this.each(function() {
        if('selectionStart' in this) {
            this.selectionStart = start;
            this.selectionEnd = end;
        } else if(this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

function initTabId() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs){
        tabId = tabs[0].id;
    });
}

function commitState(q, data) {
    uppward.monitor.tab.set(tabId, 'ba_q', q || '');
    data && uppward.monitor.tab.set(tabId, 'ba_data', data);
}

function restoreState() {
    var data = uppward.monitor.tab.get(tabId, 'ba_data');
    var q = uppward.monitor.tab.get(tabId, 'ba_q');

    if (q) {
        $('#search-input').val(q);
        $('#search-input').selectRange(0); // set cursor position
        if (data) {
            onValidate(q, data);
        } else {
            validate();
        }
    }

    chrome.storage.local.get('isMonitoring', function(data) {
        var obj = $('body');
        if (data.isMonitoring) {
            //Hide Active Protect Disabled Message Layer
            obj.removeClass('monitor-disabled');

            chrome.storage.local.get(['options'], function(opt){
                //Show Alter bar Disabled Message Layer
                if (opt.options.alterbar) obj.removeClass('alterbar-disabled');
                //Hide Alter Bar Disabled Message Layer
                else obj.addClass('alterbar-disabled');
            });

        } else {
            //Show Active Protect Disabled Message Layer
            obj.addClass('monitor-disabled');
        }
    });

    var lrdNum = uppward.pref.getLrdNum()

    if (lrdNum && lrdNum > 0) {
        // adding lrd bar
        // console.log('lrd num: ' + lrdNum.toString())
        try {
            $('#lrd-bar').addClass('alerting')
        } catch (err) {
            console.log('error')
            //console.log(err)
        }
    } else {
        // remove lrd bar if exists
        $('#lrd-quietmode-notification').removeClass('alerting')
    }

    var showDetailsBtn = document.querySelector("#open-lrd-list");
    showDetailsBtn && showDetailsBtn.addEventListener('click',function(){
        // send message to bg script - show loaded resources dets
        chrome.runtime.sendMessage({operation: "showLoadedResourceDetails", flaggedResources: uppward.pref.getFlaggedResources()});

        // sending to cs.js
        try {
            chrome.tabs.sendMessage(tabId, {operation: 'resourceUnflag'});
        } catch (err) {
            console.log('error sending')
            //console.log(err)
        }

    }, false);
}

function buildICO(html, ico) {
    html.push('<div class="item item-ico">');
    if (ico.image) {
        html.push('  <img src="' + ico.image + '" class="image" />');
    } else {
        html.push('  <img class="image" />');
    }
    html.push('  <div class="content">');
    html.push('    <div class="type">' + ico.name + '</div>');
    html.push('    <div class="desc">' + ico.symbol + '</div>');
    if (ico.website) {
        html.push('    <div class="pattern"><a href="' + ico.website + '" target="_blank">' + ico.website + '</a></div>');
    } else {
        html.push('    <div class="pattern"></div>');
    }
    html.push('  </div>');
    ico.link && html.push('<a class="button positive-button casedetail-link" href="' + ico.link + '" target="_ blank"></a>');
    html.push('</div>');
}

function buildIndicator(html, indicator) {
    var isWhite = indicator.security_category === 'whitelist';

    html.push('<div class="item item-indicator ' + (isWhite ? 'item-whitelist' : 'item-blacklist') + '">');

    if (isWhite) {
        html.push('<img src="images/update/new_ic_safe.svg" class="image" />');
    } else {
        html.push('<img src="images/update/new_ic_attention.svg" class="image" />');
    }

    html.push('<div class="content">');

    /** requested by cw to remove searched pattern under icon
    html.push('     <div class="pattern">');

    //if (indicator.pattern_type === 'cryptoaddr') {
    //    html.push('<p class="pattern_subtype">' + indicator.pattern_subtype + '</p>');
    //}

    if (isWhite && indicator.pattern_subtype === 'url') {
        if (!/^https?:\/\//i.test(indicator.pattern)) {
            html.push('<a href="http://' + indicator.pattern + '" target="_blank">' + indicator.pattern + '</a>');
        }else {
            html.push('<a href="' + indicator.pattern + '" target="_blank">' + indicator.pattern + '</a>');
        }
    } else {
        html.push(indicator.pattern);
    }

    html.push('     </div>');
    **/

    html.push('     <div class="type"></div>');
    html.push('     <div class="desc"></div>');
    html.push('     <div class="desc line2"></div>');

    // new section - indicator information
    var link = (indicator.ico && indicator.ico.link) || null;
    link = link || indicator.link;

    html.push('     <div class="details">');
    html.push('         <div class="row">');
    html.push('             <div class="header info"></div>');
    html.push('             <a href="' + link + '" target="_ blank" class="detail link"></a>');
    html.push('         </div>');
    html.push('         <div class="row">');
    html.push('             <div class="header number"></div>');
    html.push('             <div class="detail">#' + indicator.id + '</div>');
    html.push('         </div>');
    html.push('         <div class="row">');
    html.push('             <div class="header itype"></div>');
    html.push('             <div class="detail">' + indicator.pattern_type_full + ' (' + indicator.pattern_subtype_full + ') </div>');
    html.push('         </div>');
    html.push('         <div class="row">');
    html.push('             <div class="header ipattern"></div>');
    html.push('             <div class="detail-container">');
    html.push('                 <div class="detail">');

    if (isWhite && indicator.pattern_type === 'addr') {
        if (indicator.pattern_subtype === 'email') {
            html.push('<a href="mailto:' + indicator.pattern + '" target="_blank">' + indicator.pattern + '</a>');
        } else if (!/^https?:\/\//i.test(indicator.pattern)) {
            html.push('<a href="http://' + indicator.pattern + '" target="_blank">' + indicator.pattern + '</a>');
        } else {
            html.push('<a href="' + indicator.pattern + '" target="_blank">' + indicator.pattern + '</a>');
        }
    } else {
        html.push(indicator.pattern);
    }

    html.push('                 </div>');
   if (isWhite) {
       html.push('              <img src="images/update/ic_safe_small.svg" class="image" />');
   } else {
       html.push('              <img src="images/update/ic_blacklist_small.svg" class="image" />');
   }
    html.push('             </div>');
    html.push('         </div>');
    html.push('     </div>');

    html.push('     </div>');


    html.push('</div>');

}

function buildEmpty(html, pattern) {
    html.push('<div class="item item-empty">');
    html.push('  <img src="images/update/new_ic_search.svg" class="image" />');
    html.push('  <div class="content">');
    html.push('    <div class="pattern">' + pattern + '</div>');
    html.push('    <div class="type"></div>');
    html.push('    <div class="desc"></div>');
    html.push('  </div>');
    html.push('</div>');
}

function buildItem(html, pattern, results) {
    var cnt = Math.min(results.length, 5);
    if (cnt > 1) {
        html.push('<div class="item-cnt">' + cnt + ' results</div>');
        //html.push('<div class="item-cnt" style="height:50px;"></div>');
    }
    html.push('<div class="items ' + (results.length > 1 ? 'items-multiple' : 'items-single') + '">');
    for (var i=0; i<cnt; i++) {
        var item = results[i];
        if (item.type === 'ico') {
            buildICO(html, item);
        } else if (item.type === 'indicator') {
            buildIndicator(html, item);
        }
    }

    if (cnt === 0) {
        buildEmpty(html, pattern);
    }
    html.push('</div>');
    return html;
}

var lastwheel = 0;
var continuewheelDelta = 0;
var continuewheelTs = 0;
var hasSlick = false;

function onValidate(pattern, data) {
    // deregister
    $('.items').off('init');
    $('.slick-slide').off('keydown');
    hasSlick && $('.items').slick('unslick');
    hasSlick = false;

    commitState(pattern, data);
    $('body').addClass('has-result');

    //검색결과 표시화면 : 뒤로가기
    $("#mainLink").attr("href", "ba.html").removeClass().addClass("button-back").on("click", function(e){
        e.preventDefault();
        commitState("");
        document.location = "ba.html";
    });

    var html = [];

    data.results = data.results || [];
    buildItem(html, pattern, data.results);

    html.push('<div class="buttons ' + (data.results.length === 1 ? 'buttons-animation' : '') + '">');
    html.push('     <div class="caseopen-title"></div>');
    html.push('     <a class="caseopen-link" href="' + uppward.pref.CASEOPEN_URL + '?pattern=' + encodeURI(pattern) + '" target="_blank"></a>');
    html.push('</div>');

    $('.result').html(html.join(''));

    if (data.results.length > 1) {
        $('.items').on('init', function(){
            $('.items').on('wheel', { $slider: $('.items') }, function(event) {
                event.preventDefault();
                var $slider = event.data.$slider;
                var delta = event.originalEvent.deltaY;


                var now = new Date().getTime();

                var wheelDelta = continuewheelDelta;
                var wheelTs = continuewheelTs;

                continuewheelDelta = delta;
                continuewheelTs = now;

                if (wheelDelta > 0) {
                    if (delta > 0 && delta <= wheelDelta && (wheelTs + 100 > now)) {
                        return;
                    }
                } else if (wheelDelta < 0) {
                    if (delta < 0 && delta >= wheelDelta && (wheelTs + 100 > now)) {
                        return;
                    }
                }

                if (lastwheel + 500 > now) return;

                if(delta <= -1) {
                    $slider.slick('slickPrev');
                    lastwheel = now;
                } else if (delta >= 1) {
                    $slider.slick('slickNext');
                    lastwheel = now;
                }
            });
        }).slick({
            adaptiveHeight: true,
            vertical: true,
            verticalSwiping: true,
            verticalScrolling: true,
            dots: true,
            arrows: false,
            infinite: true,
            slidesToShow: 1
        });
        hasSlick = true;
        $('.slick-slide').on('keydown', function( event ) {
            event.stopImmediatePropagation();
            if(event.which == 38 ) { // UP / CIMA
                $('.items').slick('slickPrev');
            }
            if(event.which == 40 ) { // DOWN / BAIXO
                $('.items').slick('slickNext');
            }
        });
    }
}

function validate() {
    // console.log('validating')
    var pattern = $('#search-input').val();

    uppward.ga.ba.search(pattern);
    uppward.api.search(pattern, function(err, result){
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
            onValidate(pattern, result.data);
        }
    });
}

function init() {
    initTabId();

    //contextMenu,  activeprotect sync
    chrome.storage.local.get(['isMonitoring'], function(result) {
        uppward.monitor.options.set("activeprotect", result.isMonitoring, function(){});
    });

    uppward.monitor.options.get(function(opt) {
        if (opt.firstOpen) {
            window.location.replace("setting-privacy.html")
        }
    });

    $(function() {
        $('#search-input').attr('placeholder', chrome.i18n.getMessage('searchHint'));
        restoreState();

        uppward.ga.ba.open();

        $('#search-form').submit(function(e) {
            e.preventDefault();
            if ($('#search-input').val().length > 1) {
                validate();
            }
        });

        $('.clearable').click(function(){
            var v = $('#search-input').val();
            if (v) {
                $('#search-input').val('');
                $('.clearable').removeClass('clearable-close');
            }
            $('#search-input').focus();
        });

        $('#search-input').focus().change(function(){
            commitState($('#search-input').val());
        }).on('input', function(){
            var v = $('#search-input').val();
            if (v) {
                $('.clearable').addClass('clearable-close');
            } else {
                $('.clearable').removeClass('clearable-close');
            }
        });
    });
}

Raven.config('https://750765379782454e9e109e9f90c4e487@sentry.io/1247921').install();
//Raven.config('https://e24a799e06fb4f41b19525ed84e476fd@sentry.io/1309531').install();
Raven.context(function () {
    init();
});
