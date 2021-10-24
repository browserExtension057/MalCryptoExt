(function (chrome) {
    'use strict';

    var currentIndicator = null;
    var cryptoAddressHighlightMap = {};
    var cryptoAddressCandidate = [];
    var cryptoAddressCandidateTimer = null;

    // console.log('new content script/redirection - reset lrdnumber')
    chrome.runtime.sendMessage({operation: "setLRDPopup", lrdNum: 0});

    function getFlagMarkup(indicator, options) {

        var m = [];

        if (indicator.security_category === 'whitelist') {
            var icConfirmed = chrome.extension.getURL('images/ic_confirmed.svg');
            var icClose = chrome.extension.getURL('images/ic_close.svg');

            var icsafecheck = chrome.extension.getURL('images/update/ic-safecheck.svg');
            var icsafeclose = chrome.extension.getURL('images/update/ic-cancel.svg');

            switch(options.layouttype){
                case 'Top Banner' :   m.push('<div class="uppward-flag-whitelist uppward-type-banner top font-' + options.typefacesize + '">'); break;
                case 'Bottom Banner' : m.push('<div class="uppward-flag-whitelist uppward-type-banner bottom font-' + options.typefacesize + '">'); break;
                case 'Top' : m.push('<div class="uppward-flag-whitelist top font-' + options.typefacesize + '">'); break;
                case 'Bottom' : m.push('<div class="uppward-flag-whitelist bottom font-' + options.typefacesize + '">'); break;
            }

            m.push('	<div class="uppward-flag-wrap" style=\'background:'+options.backgroundcolor+'\'>') ;
            m.push('		<div class="uppward-inner-container">');
            m.push('			<div class="uppward-flag-whitelist-desc">');
            m.push('				<i class="uppward-icon-check" style="font-size:'+options.typefacesize+'px !important;background-image: url(\''+icsafecheck+'\');"></i>');
            m.push('				<strong style="font-size:'+options.typefacesize+'px !important;">&nbsp;This Website is safe.</strong>');
            m.push('				<a href="javascript:false;" class="uppward-flag-whitelist-info uppward-flag-whitelist-check pull-right">Don’t show again</a>');
            m.push('			</div>');
            m.push('            <div class="uppward-flag-whitelist-close" style="font-size:'+options.typefacesize+'px !important;background-image: url(\''+icsafeclose+'\');"></div>');
            m.push('		</div>');
            m.push('	</div>');
            m.push('</div>');

        } else if (indicator.security_category === 'blacklist') {
            var imgURL = chrome.extension.getURL('images/update/ic-warning.svg');
            var desc = chrome.i18n.getMessage('monitoringBlacklistDesc', [indicator.pattern]);
            m.push('<div class="uppward-flag-blacklist">');
            m.push('    <div class="uppward-flag-blacklist-content">');
            m.push('        <img src="' + imgURL + '" />');
            m.push('        <div class="uppward-flag-blacklist-title" style="font-size:26px !important;">' + chrome.i18n.getMessage('monitoringBlacklistTitle') + '</div>');
            m.push('        <div class="uppward-flag-blacklist-desc" style="font-size: 15px !important;">' + desc + '</div>');
            m.push('        <div id="uppward-btn-backtosafety" class="uppward-flag-button" style="font-size: 14px !important;">' + chrome.i18n.getMessage('monitoringBlacklistGoBack') + '</div>');
            m.push('        <div id="uppward-btn-proceedanyway" class="uppward-flag-button uppward-flag-button-clear" style="font-size: 12px !important;">' + chrome.i18n.getMessage('monitoringBlacklistProceed') + '</div>');
            m.push('    </div>');
            m.push('</div>');
        } else if (indicator.security_category === 'punycode') {
            var imgURL = chrome.extension.getURL('images/update/ic-warning.svg');
            var desc = chrome.i18n.getMessage('monitoringPunycodeDesc', [indicator.pattern]);
            m.push('<div class="uppward-flag-blacklist">');
            m.push('    <div class="uppward-flag-blacklist-content">');
            m.push('        <img src="' + imgURL + '" />');
            m.push('        <div class="uppward-flag-blacklist-title" style="font-size:26px !important;">' + chrome.i18n.getMessage('monitoringPunycodeTitle') + '</div>');
            m.push('        <div class="uppward-flag-blacklist-desc" style="font-size: 15px !important;">' + desc + '</div>');
            m.push('        <div id="uppward-btn-backtosafety" class="uppward-flag-button" style="font-size: 15px !important;">' + chrome.i18n.getMessage('monitoringPunycodeGoBack') + '</div>');
            m.push('        <div id="uppward-btn-proceedanyway" class="uppward-flag-button uppward-flag-button-clear" style="font-size: 14px !important;">' + chrome.i18n.getMessage('monitoringPunycodeProceed') + '</div>');
            m.push('        <div id="uppward-btn-turnoff" class="uppward-flag-button uppward-flag-button-clear pull-right" style="font-size: 12px !important; margin: 0.13em 0px;">'+ chrome.i18n.getMessage('monitoringPunycodTrunoff') +'</div>');
            m.push('    </div>');
            m.push('</div>');
        }
        return m.join('');
    }

    function getResourceFlagMarkup(indicators, options) {

        //console.log('getResourceFlagMarkup function')
        try {
            var m = [];
            var warningicon = chrome.extension.getURL('images/update/ic_blacklist_noti.svg');
            var icsafeclose = chrome.extension.getURL('images/update/ic-cancel.svg');

            var count = indicators.length

            switch(options.lrdlayouttype){
                case 'Top Banner' :   m.push('<div class="uppward-resource-flag uppward-type-banner top">'); break;
                case 'Bottom Banner' : m.push('<div class="uppward-resource-flag uppward-type-banner bottom">'); break;
                case 'Top' : m.push('<div class="uppward-resource-flag top">'); break;
                case 'Bottom' : m.push('<div class="uppward-resource-flag bottom">'); break;
            }

            m.push('    <div class="uppward-resource-flag-main">');
            m.push('        <i class="warning-icon" style="background-image: url(\''+warningicon+'\');"></i>');
            m.push('        <div class="uppward-resource-flag-title"">' + count + chrome.i18n.getMessage('monitoringLoadedResourcesOverview') + '</div>');
            m.push('        <a class="uppward-resource-flag-details">' + chrome.i18n.getMessage('loadedResourcesMoreDetails') + '</a>');
            m.push('				<a class="uppward-resource-flag-back pull-right">Go Back</a>');
            m.push('        <div class="uppward-resource-flag-close" style="background-image: url(\''+icsafeclose+'\');"></div>');
            m.push('    </div>');
            m.push('</div>');

            return m.join('');
        } catch (err) {
            console.log('error')
            //console.log(err)
        }
    }

    function flag(request) {
        currentIndicator = request.indicator;

        dispUnflag();

        var body = document.getElementsByTagName('body');
        if (!body || body.length === 0) {
            body = document.getElementsByTagName('html');
        }
        body = body[0];

        var element = null;
        var addedClasses = '';
        switch(request.opt.layouttype){
            case 'Top Banner' :
                element = document.querySelector(".uppward-flag-container.top")
                addedClasses = 'top'
                break;
            case 'Bottom Banner' :
                element = document.querySelector(".uppward-flag-container.bottom")
                addedClasses = 'bottom'
                break;
            case 'Top' :
                element = document.querySelector(".uppward-flag-container.top")
                addedClasses = 'top'
                break;
            case 'Bottom' :
                element = document.querySelector(".uppward-flag-container.bottom")
                addedClasses = 'bottom'
                break;
        }

        if (!element) {
            element = document.createElement('div');
            element.className = 'uppward-flag-container ' + addedClasses;
            element.innerHTML = getFlagMarkup(request.indicator, request.opt);
            body.insertBefore(element, body.firstChild);
        } else {
            if (request.opt.layouttype=='Top Banner'){
                var wrapper = document.createElement('div')
                wrapper.innerHTML = getFlagMarkup(request.indicator, request.opt)
                element.insertBefore(wrapper.firstChild, element.firstChild);
            } else {
                element.innerHTML = element.innerHTML + getFlagMarkup(request.indicator, request.opt);
            }
        }

        var e = document.querySelector('.uppward-flag-container .uppward-flag-whitelist-close');
        e && e.addEventListener('click', function(){
            unflag();
        }, false);

        var aa = document.querySelector(".uppward-flag-whitelist-info");
        aa && aa.addEventListener('click',function(){
            dontShow();
        }, false);

        e = document.querySelector('.uppward-flag-container #uppward-btn-backtosafety');
        e && e.addEventListener('click', function(){
            window.history.back();
        }, false);

        e = document.querySelector('.uppward-flag-container #uppward-btn-proceedanyway');
        e && e.addEventListener('click', function(){
            unflag();
        }, false);

        e = document.querySelector('.uppward-flag-container #uppward-btn-turnoff');
        e && e.addEventListener('click', function(){
            punycodeTurnoff();
        }, false);
    }

    var flaggedResources = null;

    Array.prototype.extend = function (newarray) {
        newarray.forEach(function(fr) {this.push(fr)}, this);
    }

    function resourceFlag(request) {


        try {
            if (!flaggedResources){
                //console.log('flagged resources empty, just assign')
                flaggedResources = request.indicators;
            } else {
                //console.log('flagged resources not empty, append')
                //console.log('current length: ' + flaggedResources.length)
                //flaggedResources.extend(request.indicators)
                var newFlagged = request.indicators
                //console.log('iterating new flagged')
                newFlagged.forEach(function(toAdd){
                    //console.log(toAdd)
                    if (!flaggedResources.includes(toAdd)){
                        flaggedResources.push(toAdd);
                    }
                })
            }
        } catch (err) {
            console.log('resourceflag error')
            //console.log(err)
        }

        // for when LRD is set to ON (includes both quiet and alert lrd modes)
        // add number to icon on toolbar - setbadgetext
        ///// https://stackoverflow.com/questions/5759130/google-chrome-extension-numbers-on-the-icon
        flaggedResources.length
        // console.log('send message to bg script - back')
        chrome.runtime.sendMessage({operation: "setLRDPopup", lrdNum: flaggedResources.length, flaggedResources: flaggedResources});

        // showing alerts - ONLY when alert mode ON
        if (request.opt && request.opt.lrdalert) {
            //console.log('lrd alert is ON. creating notif.')
            try {
                //console.log('creating html cs.js popup')
                dispResourceUnflag();

                var body = document.getElementsByTagName('body');
                if (!body || body.length === 0) {
                    body = document.getElementsByTagName('html');
                }
                body = body[0];

                var element = null;
                var addedClasses = '';
                switch(request.opt.lrdlayouttype){
                    case 'Top Banner' :
                        element = document.querySelector(".uppward-flag-container.top")
                        addedClasses = 'top'
                        break;
                    case 'Bottom Banner' :
                        element = document.querySelector(".uppward-flag-container.bottom")
                        addedClasses = 'bottom'
                        break;
                    case 'Top' :
                        element = document.querySelector(".uppward-flag-container.top")
                        addedClasses = 'top'
                        break;
                    case 'Bottom' :
                        element = document.querySelector(".uppward-flag-container.bottom")
                        addedClasses = 'bottom'
                        break;
                }

                if (!element) {
                    element = document.createElement('div');
                    element.className = 'uppward-flag-container ' + addedClasses;
                    element.innerHTML = getResourceFlagMarkup(flaggedResources, request.opt);
                    body.insertBefore(element, body.firstChild);
                } else {
                    if (request.opt.lrdlayouttype.includes('Top')) {
                        if (request.opt.lrdlayouttype == 'Top Banner' && !element.contains(document.querySelector('.uppward-type-banner'))){
                            // if lrd alert type is banner, check if there is a whitelist banner. if do not have (i.e. not present or is non-banner, insert lrd alert as first child.
                            var wrapper = document.createElement('div')
                            wrapper.innerHTML = getResourceFlagMarkup(flaggedResources, request.opt)
                            element.insertBefore(wrapper.firstChild, element.firstChild);
                        } else {
                            element.innerHTML = element.innerHTML + getResourceFlagMarkup(flaggedResources, request.opt);
                        }
                    } else {
                        // request.opt.lrdlayouttyoe includes bottom
                        if (request.opt.lrdlayouttype == 'Bottom Banner' && !element.contains(document.querySelector('.uppward-type-banner'))){
                            element.innerHTML = element.innerHTML + getResourceFlagMarkup(flaggedResources, request.opt);
                        } else {
                            var wrapper = document.createElement('div')
                            wrapper.innerHTML = getResourceFlagMarkup(flaggedResources, request.opt)
                            element.insertBefore(wrapper.firstChild, element.firstChild);
                        }
                    }
                }

                //console.log('adding listener')
                var showDetailsBtn = document.querySelector(".uppward-resource-flag-details");
                showDetailsBtn && showDetailsBtn.addEventListener('click',function(){
                    //console.log('send message to bg script - show loaded resources dets')
                    chrome.runtime.sendMessage({operation: "showLoadedResourceDetails", flaggedResources: flaggedResources});
                }, false);

                var backBtn = document.querySelector(".uppward-resource-flag-back");
                backBtn && backBtn.addEventListener('click',function(){
                    //console.log('send message to bg script - back')
                    chrome.runtime.sendMessage({operation: "loadedResourcesBack"});
                    resourceUnflag()
                }, false);

                var closeBtn = document.querySelector(".uppward-resource-flag-close");
                closeBtn && closeBtn.addEventListener('click',function(){
                    //console.log('cancel lrd notif - reset array')
                    resourceUnflag()
                }, false);

            } catch (err){
                console.log('error')
                //console.log(err)
            }
        }
    }

    function dontShow() {
        var el = document.querySelector('.uppward-flag-container');
        if (!el) return;
        el.parentNode.removeChild(el);
        chrome.runtime.sendMessage({operation: "dontshow", indicator: currentIndicator});
        currentIndicator = null;
    }

    function unflag() {
        var el = document.querySelector('.uppward-flag-container');
        if (!el) return;
        el.parentNode.removeChild(el);
        try {
            chrome.runtime.sendMessage({operation: "remove", indicator: currentIndicator});
            currentIndicator = null;
        } catch(err) {
            console.log(err);
        }
    }

    function dispResourceUnflag() {
        //console.log('remove resourceflag')
        var el = document.querySelector('.uppward-resource-flag');
        if (!el) return;
        if (el.parentElement.childElementCount == 1) {
            el.parentElement.remove();
        } else {
            el.remove();
        }
    }

    function resourceUnflag() {
        dispResourceUnflag();
        flaggedResources = null;
        //console.log('resource unflag - reset lrdnumber')
        chrome.runtime.sendMessage({operation: "setLRDPopup", lrdNum: 0});

    }

    function reinstateLrd() {
        //console.log('reinstate tab x lrd info - this function is invoked when returning to tab x')
        if (flaggedResources) {
            chrome.runtime.sendMessage({operation: "setLRDPopup", lrdNum: flaggedResources.length, flaggedResources: flaggedResources});
        } else {
            chrome.runtime.sendMessage({operation: "setLRDPopup", lrdNum: 0 , flaggedResources: ''});
        }
    }

    function restartProtection() {
        //console.log('active protect switched on. request background script to start listeners')
        chrome.runtime.sendMessage({operation: "restartProtection"});
    }

    function killLrd() {
        //console.log('killing lrd')
        chrome.runtime.sendMessage({operation: "killLrd"});
        //console.log('calling resourceUnflag')
        resourceUnflag();
        //console.log('end of kill Lrd');
    }

    function punycodeTurnoff(){
        var el = document.querySelector('.uppward-flag-container');
        if (!el) return;
        chrome.runtime.sendMessage({operation: "punycodeTurnoff", indicator: currentIndicator});
        currentIndicator = null;
    }

    function dispUnflag() {
        var el = document.querySelector('.uppward-flag-whitelist');
        if (!el) return;
        if (el.parentElement.childElementCount == 1) {
            el.parentElement.remove();
        } else {
            el.remove();
        }
    }

    // not in use - twitter filter phased out
    function tweetBadge(res){
        var annotation = res.annotation;
        var securityCategory = res.security_category;
        if (!securityCategory) {
            return;
        }
        if (annotation) {
            var handles = [];
            if (res.type === 'twitStream') {
                handles = document.querySelectorAll('[data-user-id="' + annotation + '"] span.u-dir:not(.uppward-tweet-badge-done)');
            } else if (res.type === 'twitMain') {
                handles = document.querySelectorAll('.ProfileHeaderCard .username.u-dir:not(.uppward-tweet-badge-done)')
            }
            if (!annotation) {
                return;
            }
            handles.forEach(function(handle) {
                // handle annotation value check
                if (handle.parentNode &&
                    handle.parentNode.hasAttribute('data-user-id') &&
                    handle.parentNode.getAttribute('data-user-id') !== annotation) {
                    return;
                }
                var a = document.createElement('a');
                a.href = 'https://uppward.sentinelprotocol.io';
                a.target = '_blank';
                a.className = 'uppward-twitter-badge';
                var i = document.createElement('img');
                i.style.position = 'relative';
                i.style.display = 'inline-block';
                i.style.width = 'auto';
                i.style.height = '14px';
                i.style.top = '2px';
                i.style.marginRight = '2px';
                i.src = securityCategory === 'whitelist' ? chrome.runtime.getURL('/images/update/ic_green.png') : chrome.runtime.getURL('/images/update/ic_red.png');
                a.append(i);
                handle.className = handle.className + ' uppward-tweet-badge-done';
                handle.parentNode.insertBefore(a, handle);

                if (securityCategory === 'blacklist' && res.type === 'twitStream') {
                    var parent = handle.parentNode;
                    while(true) {
                        if (parent.className === 'ReplyingToContextBelowAuthor') {
                            break;
                        }
                        var tagName = parent.tagName.toLowerCase();
                        if (tagName === 'body' || parent.hasAttribute('data-item-id')) {
                            if (parent.hasAttribute('data-item-id')) {
                                parent.className = parent.className + ' uppward-tweet-blacklist-card';
                                parent.style.backgroundColor = '#F1B6B6';
                            }
                            break;
                        } else {
                            parent = parent.parentNode;
                        }
                    }
                }
            });
        }
    }

    // not in use - twitter filter phased out
    function tweetRemove() {
        var handles = document.querySelectorAll('.uppward-tweet-badge-done');
        var blacklistCards = document.querySelectorAll('.uppward-tweet-blacklist-card');
        handles.forEach(function(handle) {
            var prevSibling = handle.previousSibling;
            if (typeof prevSibling === 'object' && prevSibling.className === 'uppward-twitter-badge') {
                handle.parentNode.removeChild(prevSibling);
            }
        });
        blacklistCards.forEach(function(card) {
            card.style.background = '';
        });
    }

    // not in use - twitter filter phased out
    function onTweetUpdate() {
        var twitStream = document.querySelectorAll('[data-user-id]');
        var dataUserIds = [];
        twitStream.forEach((el) => {
            var dataUserId = el.getAttribute('data-user-id');
            if (dataUserIds.indexOf(dataUserId) !== -1) {
                return;
            }
            dataUserIds.push(dataUserId);
        });
        if (twitStream.length > 0) {
            chrome.runtime.sendMessage({
                operation: 'tweet',
                type: 'twitStream',
                dataUserIds: dataUserIds
            });
        }
    }

    // not in use - twitter filter phased out
    function checkTweetMain() {
        var profileNav = document.querySelector('.ProfileNav');
        var mainUdir = document.querySelector('.ProfileHeaderCard .username.u-dir:not(.uppward-tweet-badge-done)');
        if (!profileNav) {
            return;
        }
        var dataUserId = profileNav.getAttribute('data-user-id');
        if (profileNav && mainUdir && dataUserId) {
            chrome.runtime.sendMessage({
                operation: 'tweet',
                type: 'twitMain',
                dataUserIds: [dataUserId]
            });
        }
    }

    function checkCryptoAddress(nodeList) {
        var dfs = function(n, d) {
            if (n.childNodes.length > 0) {
                n.childNodes.forEach(function(c) {
                    dfs(c, d);
                });
            } else {
                d.push(n);
            }
        };
        var leafs = [];
        var isCryptoAddress = function (pattern) {
            return /^0x[a-f0-9]{40}$/i.test(pattern) ||
                /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(pattern) ||
                /^(bitcoincash:)?(q|p)[a-z0-9]{41}$/i.test(pattern) ||
                /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(pattern) ||
                /^X[a-km-zA-HJ-NP-Z1-9]{33}$/.test(pattern) ||
                /^t[13][a-km-zA-HJ-NP-Z1-9]{25,33}$/.test(pattern) ||
                /^4[0-9AB][a-km-zA-HJ-NP-Z1-9]{93}$/.test(pattern) ||
                /^T[0-9a-zA-Z]{33}$/.test(pattern) ||
                /^A[0-9a-zA-Z]{33}$/.test(pattern)
        };

        nodeList.forEach(function(node) {
            dfs(node, leafs);
        });

        var resultWithoutAPI = [];

        leafs.forEach(function(node) {
            node.textContent.split(/[\s]/).forEach(function(pattern){

                // remove common symbols that might be appended before/after cryptoaddr in sentences.
                pattern = pattern.replace(/[\]\)\.\;]+$/,'').replace(/^[\[\(\.\:\,\-\=]+/,'')

                if (isCryptoAddress(pattern)) {
                    if (!cryptoAddressHighlightMap.hasOwnProperty(pattern)) {
                        cryptoAddressHighlightMap[pattern] = {
                            nodes: [],
                            security_category: ''
                        };
                    }
                    if (cryptoAddressHighlightMap[pattern].nodes.indexOf(node) === -1) {
                        cryptoAddressHighlightMap[pattern].nodes.push(node);
                    }
                    if (cryptoAddressHighlightMap[pattern].security_category === 'blacklist') {
                        resultWithoutAPI.push({
                            node: node,
                            pattern: pattern,
                            security_category: cryptoAddressHighlightMap[pattern].security_category
                        });
                    } else if (cryptoAddressCandidate.indexOf(pattern) === -1) {
                        cryptoAddressCandidate.push(pattern);
                    }
                }
            });
        });

        if (cryptoAddressCandidate.length > 0) {
            if (cryptoAddressCandidateTimer !== null) {
                clearTimeout(cryptoAddressCandidateTimer);
            }
            cryptoAddressCandidateTimer = setTimeout(function() {
                chrome.runtime.sendMessage({
                    operation: 'checkCryptoAddressHighlight',
                    addresses: cryptoAddressCandidate
                });
                cryptoAddressCandidateTimer = null;
                cryptoAddressCandidate = [];
            }, 250);
        }

        observer.disconnect();

        var executeHighlightWithoutAPI = [];
        // console.log(resultWithoutAPI)
        resultWithoutAPI.forEach(function(data) {

            var p = data.node.parentElement;

            if (!p || p.innerHTML.indexOf('uppward-flag-cryptoaddresshighlight') !== -1 || p.innerHTML.indexOf('uppward-flag-cryptoaddresshighlight-link') !== -1 ) {
                return;
            }
            if (!data.security_category || data.security_category !== 'blacklist') {
                return;
            }
            var pattern = data.pattern;
            //console.log(pattern)
            var span = [
                '<span class="uppward-flag-cryptoaddresshighlight" style="background-color:red !important;color: white !important;">',
                '<a class="uppward-flag-cryptoaddresshighlight-link" href="https://portal.sentinelprotocol.io/indicator/pattern/' + pattern + '" target="_blank" style="background-color:red !important;color: white !important;">',
                '(Suspicious) ',
                '</a>',
                pattern,
                '</span>'
            ];
            executeHighlightWithoutAPI.push({
                                parent: p,
                                pattern: pattern,
                                span: span
                            });
        });
        executeHighlightWithoutAPI.forEach(function(add){
            var p = add.parent
            var pattern = add.pattern
            var span = add.span
            p.innerHTML = p.innerHTML.replace(new RegExp(pattern, 'g'), span.join(''));
        });

        observer.start();
    }

    function cryptoAddressHighlight(results) {
        observer.disconnect();
        var executeHighlight = [];
        var added = [];
        results.forEach(function(result) {
            if (!added.includes(result.pattern)){
                added.push(result.pattern)
                if (!result.security_category || result.security_category !== 'blacklist' || !cryptoAddressHighlightMap[result.pattern]) {
                    return;
                }
                cryptoAddressHighlightMap[result.pattern].security_category = result.security_category;
                var nodes = cryptoAddressHighlightMap[result.pattern].nodes;
                var pattern = result.pattern;

                nodes.forEach(function(n) {
                    var p = n.parentElement;
                    if (!p || p.innerHTML.indexOf('uppward-flag-cryptoaddresshighlight') !== -1 || p.innerHTML.indexOf('uppward-flag-cryptoaddresshighlight-link') !== -1 ) {
                        return;
                    }

                    var span = [
                        '<span class="uppward-flag-cryptoaddresshighlight" style="background-color:red !important ;color: white !important;">',
                        '<a class="uppward-flag-cryptoaddresshighlight-link" href="https://portal.sentinelprotocol.io/indicator/pattern/' + pattern + '" target="_blank" style="background-color:red !important;color: white !important;"   >',
                        '(Suspicious) ',
                        '</a>',
                        pattern,
                        '</span>'
                    ];
                    executeHighlight.push({
                                parent: p,
                                pattern: pattern,
                                span: span
                            });
                });
            }
        });
        executeHighlight.forEach(function(add){
            var p = add.parent
            var pattern = add.pattern
            var span = add.span
            p.innerHTML = p.innerHTML.replace(new RegExp(pattern, 'g'), span.join(''));
        });

        observer.start();
    }

    chrome.runtime.onMessage.addListener(function(response/*, sender, sendResponse*/) {
        switch (response.operation) {
            case 'flag':
                flag(response);
                break;
            case 'remove':
                unflag(response);
                break;
            case 'dispUnflag':
                dispUnflag();
                break;
            case 'resourceFlag':
                resourceFlag(response);
                break;
            case 'resourceUnflag':
                resourceUnflag();
                break;
            case 'reinstateLrd':
                reinstateLrd();
                break;
            case 'enableActiveProtect':
                restartProtection();
                break;
            case 'enableLrd':
                // invoke onTabActivated function which will enable protection features based on user's settings
                restartProtection();
                break;
            case 'disableLrd':
                // kill lrd listeners
                killLrd();
                break;
            case 'disableLrdAlert':
                dispResourceUnflag();
                break;
            /** not required. twitter filter phased out.
            case 'tweet':
                if (window.location.hostname === 'twitter.com') {
                    tweetBadge(response);
                }
                break;
            case 'tweetRemove':
                if (window.location.hostname === 'twitter.com') {
                    tweetRemove();
                }
                break;
            case 'tweetReset':
                if (window.location.hostname === 'twitter.com') {
                    checkTweetMain();
                    onTweetUpdate();
                }
                break;
            **/
            case 'cryptoAddressHighlight':
                cryptoAddressHighlight(response.results);
                break;
        }
    });

    var observer = new MutationObserver(function(mutations){
        if (!this.isFirstMutation) {
            //this change will prevent duplicate dfs check of intermediate nodes (i.e. node already checked when dfs ran on it's parent)
            checkCryptoAddress(document.getElementsByTagName('body')[0].childNodes);
            this.isFirstMutation = true;
        } else {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    checkCryptoAddress(mutation.addedNodes);
                }
            });
        }
        // not required. twitter filter phased out.
        //checkTweetMain();
        //onTweetUpdate();
    });
    observer.isFirstMutation = false;

    observer.start = function() {
        var timer = setInterval(function() {
            try {
                observer.observe(document.getElementsByTagName('body')[0], {
                    childList: true,
                    subtree: true
                });
                clearTimeout(timer);
            } catch(err) {
                console.log(err);
            }
        }, 50);
    };

    observer.start();

}(chrome));