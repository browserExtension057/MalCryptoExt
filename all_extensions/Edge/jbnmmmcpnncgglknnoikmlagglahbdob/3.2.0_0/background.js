(function(){
    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};

    var PatternParser = {};

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = PatternParser;
        }
        exports.PatternParser = PatternParser;
    } else {
        root.PatternParser = PatternParser;
    }

    var URL = root.URL === undefined ? require('url').URL : root.URL;

    function _compact(arr) {
        var newarr = [];
        for (var i=0; i<arr.length; i++) {
            arr[i] && newarr.push(arr[i]);
        }
        return newarr;
    }

    function _parseHostname(hostname) {
        var result = _compact(hostname.split('.').reverse());
        if (result[result.length-1] === 'www') {
            result.pop();
        }
        return result;
    }

    PatternParser.parseHostname = function(hostname) {
        return _parseHostname(new URL('http://' + hostname).hostname);
    }

    PatternParser.parseURL = function(url) {
        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url;
        }
        var url = new URL(url);
    
        var sb = _parseHostname(url.hostname);
        
        if (url.username) {
            var auth = '@' + url.username;
            if (url.password) {
                auth += ':' + url.password;
            }
            sb.push(auth);
        }
    
        url.port && sb.push(':' + url.port);
    
        var path = _compact(url.pathname.split('/'));
        path.length > 0 && sb.push('/');
        return sb.concat(path);
    }

    PatternParser.parseEmail = function(email) {
        // email은 case insensitive 하다. lowercase로 저장하겠다.
        email = email.toLowerCase().split('@');

        // gmail.com은 dot을 무시한다. dot을 다 뺀다.
        if (email[1] === 'gmail.com') {
            email[0] = email[0].replace(/\./g, '');
        }

        var result = _parseHostname(email[1]);
        result.push('@');
        result.push(email[0]);
        return result;
    }
    
}());
/* eslint no-unused-vars: "off" */

Raven.config('https://750765379782454e9e109e9f90c4e487@sentry.io/1247921').install();
//Raven.config('https://e24a799e06fb4f41b19525ed84e476fd@sentry.io/1309531').install();
window.uppward = {};

(function (uppward) {
    'use strict';

    function verify(xhr, pattern) {
        var signature = xhr.getResponseHeader('X-Signature');
        var decrypt = new JSEncrypt();
        decrypt.setPublicKey(uppward.pref.PUBLIC_KEY);

        var verified = decrypt.verify(xhr.response, signature, CryptoJS.SHA256);
        if (verified) {
            if (xhr.parsedResponse && xhr.parsedResponse.data && xhr.parsedResponse.data.q === pattern) {
                return true;
            }
        }
        return false;
    }

    function get(pattern, url, identity, callback) {
        identity.client = uppward.pref.getClient();
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open('GET', url, true);

        xhr.setRequestHeader('x-sp-identity', JSON.stringify(identity));

        xhr.onload = function(e) {
            var status = 0;
            if(typeof e.srcElement !== 'undefined') {
                status = e.srcElement.status;
            }
            else if(typeof e.target !== 'undefined') {
                status = e.target.status;
            }
            if (status === 200) {
                try {
                    xhr.parsedResponse = JSON.parse(xhr.response);
                    if (verify(xhr, pattern)) {
                        callback && callback(null, xhr.parsedResponse);
                    } else {
                        callback && callback({
                            status: 421
                        });
                    }
                } catch (e) {
                    // TODO: error message for server doesn't return json
                }
            } else {
                callback && callback(xhr);
            }
        };

        xhr.onerror = function() {
            callback && callback(xhr);
        };

        xhr.ontimeout = function() {
            callback && callback(xhr);
        };
        xhr.send();
    }

    function post(pattern, url, data, identity, callback) {
        identity.client = uppward.pref.getClient();
        var xhr = new XMLHttpRequest();

        if (url === 'uppward.pref.CREATE_CASE_API') {
            xhr.timeout = 15000;
        } else {
            xhr.timeout = 5000;
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('x-sp-identity', JSON.stringify(identity));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function(e) {
            var status = 0;
            if(typeof e.srcElement !== 'undefined') {
                status = e.srcElement.status;
            }
            else if(typeof e.target !== 'undefined') {
                status = e.target.status;
            }
            if (status === 200) {
                try {
                    xhr.parsedResponse = JSON.parse(xhr.response);
                    if (verify(xhr, pattern)) {
                        callback && callback(null, xhr.parsedResponse);
                    } else {
                        callback && callback({
                            status: 421
                        });
                    }
                } catch (e) {
                    // TODO: error message for server doesn't return json
                }
            } else {
                callback && callback(xhr);
            }
        };

        xhr.onerror = function() {
            callback && callback(xhr);
        };

        xhr.ontimeout = function() {
            callback && callback(xhr);
        };
        xhr.send(JSON.stringify(data));
    }

    function getSafePattern(pattern) {
        return encodeURIComponent(uppward.Base64.encode(pattern));
    }

    uppward.api = {
        search: function(pattern, callback) {
            pattern = _.trim(pattern);
            get(
                pattern,
                uppward.pref.SEARCH_API + '?q=' + getSafePattern(pattern),
                {},
                callback
            );
        },
        urlmon: function(pattern, identity, callback) {
            pattern = _.trim(pattern);
            get(
                pattern,
                uppward.pref.URLMON_API + '?q=' + getSafePattern(pattern) + "&o=" + getSafePattern(identity.url),
                identity,
                callback
            );
        },
        searchTweet: function(pattern, callback) {
            pattern = _.trim(pattern);
            get(
                pattern,
                uppward.pref.SEARCH_API + '?q=' + getSafePattern(pattern) + "&pattern_type=socialmedia",
                {},
                callback
            );
        },
        searchTweetBulk: function(userIds, callback) {
            var q = '';
            userIds.forEach(function(id) {
                if (!q) {
                    q = '?q=' + id;
                } else {
                    q += ('&q=' + id)
                }
            });
            get(
                userIds[0],
                uppward.pref.SEARCH_BULK_API + q + '&type=socialmedia',
                {},
                callback
            );
        },
        searchCryptoAddressHighlight: function(addresses, callback) {
            var data = {
                q: addresses,
                type: 'cryptoaddr'
            };
            post(addresses[0], uppward.pref.SEARCH_BULK_API, data, {}, callback);
        },
        searchResources: function(addresses, callback) {
            var data = {
                q: addresses,
                type: 'addr'
            };
            post(addresses[0], uppward.pref.SEARCH_BULK_API, data, {}, callback);
        },
        createCase: function(formattedData, pattern, callback) {
            var data = {
                data: formattedData,
                pattern: pattern
            };
            post(pattern, uppward.pref.CREATE_CASE_API, data, {}, callback);
        },
        retrieve_stag: function(callback) {
            get('', uppward.pref.RETRIEVE_STAG_API, {}, callback);
        }
    };
}(uppward));
(function(uppward){
    var Base64 = {
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function(input) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, '\n');
            var utftext = '';

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

    };

    uppward.Base64 = {
        encode: function(s) {
            return Base64.encode(s);
        }
    };
}(uppward));


(function (uppward) {
    'use strict';


    var IGNORE_TABS = [
        '^secure://',
        '^chrome:\\/\\/',
        '^chrome-extension:',
        '^moz-extension:',
        '^ms-browser-extension:',
        '^chrome-devtools:\\/\\/',
        // '^https:\\/\\/chrome\\.google\\.com\\/webstore',
        '^about:',
        '^view-source:',
        '^file:\\/\\/',
        '^http(s)?:\\/\\/([\\w|\\d]+:[\\w|\\d]+@)?localhost',
        '^data:text\\/html',
    ];

    uppward.bs = {
        retrieveRequestHeaderValue: function(headers, k) {
            var found = _.find(headers, function(header){
                return header.name === k;
            });
            return found ? found.value : null;
        },

        checkUrl: function (url) {
            if (_.isEmpty(url)) return false;
            var matched = _.some(IGNORE_TABS, function(p){
                return url.match(new RegExp(p, 'i')) ? true : false;
            });
            return !matched;
        },

        tabExists: function (tabId, callback) {
            var self = this;
            chrome.windows.getAll({populate: true}, function(windows) {
                var matched = _.some(windows, function(w){
                    return _.some(w.tabs, function(t){
                        return t.id === tabId;
                    });
                });
                matched && callback && callback.call(self);
            });
        },

        // common

        getTransitionType: function(type, qualifiers) {
            var qualifier = '';

            if (_.isArray(qualifiers) && !_.isEmpty(qualifiers)) {
                qualifier = qualifiers[0];
            }

            if (typeof type !== 'string' && typeof qualifier !== 'string') return 'other';

            if (qualifier === 'forward_back') return 'stepback';
            if (type === 'auto_bookmark') return 'bookmark';

            if (qualifier === 'from_address_bar' || type === 'typed') return 'addressbar';
            if (type === 'generated') return 'searchwindow';

            if (qualifier.indexOf('redirect') !== -1) return 'redirect';

            if (type === 'link') return 'link';
            if (type === 'reload') return 'reload';
            
            
            if (type === 'form_submit') return 'javascript';
            if (type === 'start_page') return 'homepage';
            
            return 'other';
        },

        getHostFromUrl: function(url) {
            if (!url) {
                return undefined;
            }

            var lcUrl = url.toLowerCase();

            if (lcUrl.indexOf('http') != 0 ||
                lcUrl.indexOf('chrome') == 0 ||
                lcUrl.indexOf('data') == 0 ||
                lcUrl == 'about:newtab' ||
                lcUrl == 'about:blank')
            {
                return undefined;
            }

            var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/);
            return match.length > 2 ? match[2] : undefined;
        },

        toolbar: {
            setBadge: function(tabId, text, bgcolor) {
                chrome.browserAction.setBadgeText({
                    tabId: tabId,
                    text: text || ''
                });
            
                bgcolor && chrome.browserAction.setBadgeBackgroundColor({
                    tabId: tabId,
                    color: bgcolor
                });
            },
    
            setTitle: function(tabId, title) {
                chrome.browserAction.setTitle({
                    tabId: tabId,
                    title: title || ''
                });
            },

            setIcon: function(tabId, name) {
                var iconPath = {
                    '16': 'images/app_ic_' + name + '_16.png',
                    '32': 'images/app_ic_' + name + '_32.png',
                    '48': 'images/app_ic_' + name + '_48.png'
                };

                chrome.browserAction.setIcon({
                    tabId: tabId,
                    path: iconPath
                }, function (){
                    if (chrome.runtime.lastError) {
                    }
                });
            }
        }
    };



}(uppward));
(function (uppward){
    'use strict';

    var PatternTree = function() {
        this._root = {};
        this._tweet = {};
        this._cryptoHighlight = {};
    };

    PatternTree.prototype.search = function(url) {
        var keys = PatternParser.parseURL(url.toLowerCase());
        var node = this._root;
        var data = null;
        for (var i=0; i<keys.length; i++) {
            var key = keys[i];
            data = node['?'] || data;
            if (node[key] === undefined) {
                break;
            } else {
                node = node[key];
            }
        }
        node = node['?'] || data;
        if (node && node.ttl && node.ttl < Date.now()/1000) {
            return null;
        } else {
            return node;
        }
    };

    PatternTree.prototype.add = function(url, data) {
        var keys = PatternParser.parseURL(url.toLowerCase());
        var node = this._root;
        for (var i=0; i<keys.length; i++) {
            node = node[keys[i]] = node[keys[i]] || {};
        }
        data.ttl = data.ttl || (Date.now()/1000 + uppward.pref.DEFAULT_CACHE_TTL);
        node['?'] = data;
    };

    PatternTree.prototype.searchTweet = function(dataUserId) {
        return this._tweet[dataUserId];
    };

    PatternTree.prototype.addTweet = function(dataUserId, data) {
        this._tweet[dataUserId] = data;
    };

    PatternTree.prototype.resetTweet = function() {
        this._tweet = {};
    };

    PatternTree.prototype.hasBlacklistCryptoAddress = function(url) {
        return this._cryptoHighlight[url] === true;
    };

    PatternTree.prototype.setBlacklistCryptoAddress = function(url) {
        this._cryptoHighlight[url] = true;
    };

    var tree = new PatternTree();
    uppward.cache = {
        _tree: tree,
        add: function(url, data) {
            tree.add(url, data);
        },
        search: function(url) {
            return tree.search(url);
        },
        addTweet: function(url, data){
            return tree.addTweet(url, data);
        },
        searchTweet: function(url) {
            return tree.searchTweet(url);
        },
        resetTweet: function() {
            return tree.resetTweet();
        },
        hasBlacklistCryptoAddress(url) {
            return tree.hasBlacklistCryptoAddress(url);
        },
        setBlacklistCryptoAddress(url) {
            return tree.setBlacklistCryptoAddress(url);
        }
    };

}(uppward));

(function (uppward) {
    'use strict';

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    function sendEvent(category, action, label, value) {
        var data = {
            hitType: 'event',
            eventCategory: category,
            eventAction: action
        };
        if (label) data.eventLabel = label;
        if (value) data.eventValue = value;

        ga('send', data);
    }

    uppward.ga = {
        init: function() {
            uppward.monitor.options.get(function(opt) {
                if (opt.gaPrivacy) {
                    ga('create', {
                        trackingId: 'UA-114007205-3',
                        userId: uppward.pref.getClient().uid
                    });
                    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
                    ga('send', 'pageview', '/background.html');
                }
            });
        },
        ba: {
            open: function() {
                uppward.monitor.options.get(function(opt) {
                    if (opt.gaPrivacy) {
                        sendEvent('Popup', 'Open', '');
                    }
                });
            },
            search: function(q) {
                uppward.monitor.options.get(function(opt) {
                    if (opt.gaPrivacy) {
                        sendEvent('Popup', 'Search', q);
                    }
                });
            },
            update: function(){                
                uppward.monitor.options.get(function(opt) {
                    if (opt.gaPrivacy) {
                        sendEvent('Popup', 'Update', uppward.pref.getClient().uid);
                    }
                });
            }

        }
    };
}(uppward));
(function (uppward){
    'use strict';

    var dispTimer = null;
    var resourceListener = null;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        var durationSec = 1800; // 30mins
        if (request.operation === 'remove' && request.indicator) {
            var data = uppward.cache.search(request.indicator.pattern);
            data.hide_ttl = Date.now()/1000 + durationSec;
        }else if (request.operation === 'dontshow' && request.indicator) {
            uppward.monitor.options.set("alterbar" , $(this).text().substring(0,1), function(){
                chrome.tabs.sendMessage(sender.tab.id, {operation: 'remove', indicator:request.indicator});
            });
        }else if (request.operation === 'punycodeTurnoff' && request.indicator) {
            uppward.monitor.options.set("punycodeurl" , false, function(){
                chrome.tabs.sendMessage(sender.tab.id, {operation: 'remove', indicator:request.indicator});
            });
        /** not in use. twitter filter phased out.
        }else if (request.operation === 'tweet') {
            uppward.monitor.options.get(function(opt) {
                if (opt.activeprotect && opt.twitterbadge) {
                    tweetSearch(request, sender, sendResponse);
                }
            });
        **/
        } else if (request.operation === 'checkCryptoAddressHighlight') {
            var hostname = sender.tab.url.split('://')[1].split('/')[0];
            uppward.monitor.options.get(function(opt) {
                if (uppward.pref.CRYPTO_ADDRESS_HIGHLIGHT_SKIP.indexOf(hostname) !== -1) {
                    return;
                }
                if (opt.activeprotect && opt.cryptoaddresshighlight) {
                    checkCryptoAddressHighlight(request, sender, sendResponse);
                }
            })
        } else if (request.operation === 'showLoadedResourceDetails') {
            try {
                chrome.tabs.create({url:"lrd.html"}, function(tab){})
                // set flaggedResourcesLrdPage
                uppward.pref.setFlaggedResourcesLrdPage(request.flaggedResources)
            } catch (err) {
                console.log('error')
                //console.log(err)
            }
        } else if (request.operation === 'loadedResourcesBack') {
            // back button on loaded resources checker notification - returns user back to safety (i.e. prev page)
            //console.log('invoking loaded resources back')
            try {
                chrome.tabs.goBack(sender.tab.id);
            } catch (err) {
                console.log('error')
                //console.log(err)
            }
        } else if (request.operation === 'setLRDPopup') {
            var lrdNum = ''
            if (request.lrdNum < 100) {
                if (request.lrdNum !== 0) {
                    lrdNum = request.lrdNum.toString();
                }
            } else {
                // if lrdNum >= 100, set lrdNum to 99+.
                lrdNum = '99+';
            }

            // set number on icon
            chrome.browserAction.setBadgeText({text: lrdNum});
            chrome.browserAction.setBadgeBackgroundColor({color: '#F03E3E'});

            // setting lrd num in pref
            uppward.pref.setLrdNum(request.lrdNum)

            // setting lrd resources list in pref
            uppward.pref.setFlaggedResources(request.flaggedResources)

        } else if (request.operation === 'restartProtection') {
            // calling ontabactivated which will restart services based on users feature settings/preferences
            //console.log(sender)
            //console.log(sender.tab.id)
            onTabActivated(sender.tab);
        } else if (request.operation === 'killLrd') {
            // kill LRD
            killResourceListeners()
        }
    });

    // not in use. twitter filter phased out.
    /* Twiiter Badge - Search API Call function*/
    function tweetSearch(request, sender, sendResponse) {
        if (request.type === 'twitStream' || request.type === 'twitMain') {
            var dataUserIds = request.dataUserIds;
            var nonCachedDataUserIds = [];
            for (var i = 0; i < dataUserIds.length; i++) {
                var cached = uppward.cache.searchTweet(dataUserIds[i]);
                if (cached) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        operation: 'tweet',
                        type: request.type,
                        security_category: cached.security_category,
                        annotation: cached.annotation
                    });
                } else if (dataUserIds[i]){
                    nonCachedDataUserIds.push(dataUserIds[i]);
                }
            }
            if (nonCachedDataUserIds.length > 0) {
                uppward.api.searchTweetBulk(nonCachedDataUserIds, function(err, result) {
                    var results = result && result.data && result.data.results ? result.data.results : [];
                    results.forEach(function (item) {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            operation: 'tweet',
                            type: request.type,
                            security_category: item.security_category,
                            annotation: item.annotation
                        });
                        uppward.cache.addTweet(item.annotation, {
                            security_category: item.security_category,
                            annotation: item.annotation
                        });
                    });
                });
            }
        }
    }

    function checkCryptoAddressHighlight(request, sender, sendResponse) {
        var addresses = request.addresses;
        if (addresses && addresses.length > 0) {
            uppward.api.searchCryptoAddressHighlight(addresses, function(err, result) {
                var hasBlacklist = false;
                var results = result && result.data && result.data.results ? result.data.results : [];
                var isCastReverted = false;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].security_category === 'blacklist') {
                        hasBlacklist = true;
                        uppward.cache.setBlacklistCryptoAddress(sender.tab.url);
                    }
                    for (var j = 0; j < addresses.length; j++) {
                        if (results[i].pattern.toLowerCase() === addresses[j].toLowerCase()) {
                            results[i].pattern = addresses[j];
                            isCastReverted = true;
                            break;
                        }
                    }
                    if (isCastReverted) {
                        break;
                    }
                }
                addresses.forEach(function(address){
                    var found = false;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].pattern.toLowerCase() === address.toLowerCase()) {
                            found = true;
                            if (Array.isArray((results.filter(result => (result.pattern === address)))) && (results.filter(result => (result.pattern === address))).length===0) {
                                results.push({
                                    security_category: results[i].security_category,
                                    pattern: address
                                });
                            }
                            break;
                        }
                    }
                    if (!found) {
                        results.push({
                            security_category: '',
                            pattern: address
                        });
                    }
                });
                if (results && results.length > 0) {
                    chrome.tabs.sendMessage(sender.tab.id, {
                        operation: 'cryptoAddressHighlight',
                        results: results
                    });
                }
                if (hasBlacklist) {
                    uppward.bs.toolbar.setIcon(sender.tab.id, 'scam');
                }
            });

        }
    }

    function onValidate(tab, url, indicator) {
        if (!indicator) return;

        switch (indicator.security_category) {
        case 'whitelist':
            uppward.monitor.tab.set(tab.id, 'ba_data', null);
            uppward.monitor.tab.set(tab.id, 'ba_q', url);
            uppward.bs.toolbar.setIcon(tab.id, 'safe');

            if (!indicator.hide_ttl || (indicator.hide_ttl < Date.now()/1000)) {
                chrome.storage.local.get(['options'], function(data){
                    /* Enable Alter Bar */
                    if(data.options.alterbar === true) {
                        chrome.tabs.sendMessage(tab.id, {operation: 'flag', indicator:indicator, opt : data.options});
                        /* Display Timer */
                        if(data.options.disptime > 0 && data.options.disptime < 8) {
                            if (!dispTimer) {
                                clearTimeout(dispTimer);
                            }
                            dispTimer = setTimeout(function(){
                                chrome.tabs.sendMessage(tab.id, {operation: 'dispUnflag', indicator:indicator});
                                dispTimer = null;
                            }, (data.options.disptime * 1000), '')
                        }
                    }
                });
            }
            break;
        case 'blacklist':
            //Blacklist Overlay
            chrome.storage.local.get(['options'], function(data){

                if(data.options.suspiciousurl === 'Overlay'){
                    /* Page Layer */
                    uppward.monitor.tab.set(tab.id, 'ba_data', null);
                    uppward.monitor.tab.set(tab.id, 'ba_q', url);
                    uppward.bs.toolbar.setIcon(tab.id, 'scam');

                    /* blacklist Overlay*/
                    chrome.tabs.sendMessage(tab.id, {operation: 'flag', indicator:indicator, opt : data.options});
                }else if(data.options.suspiciousurl === 'Redirection'){
                    /* Page Redirect */
                    chrome.tabs.update(tab.id, {url: "https://uppward.sentinelprotocol.io/redirect.html?refer=" + (tab.url) + "&type=blacklist"}, function(){});
                }
            });
            break;
        default:
            uppward.bs.toolbar.setIcon(tab.id, 'activate');
        }
    }

    function _validate(url, tab, change, event) {
        if (!uppward.pref.getIsMonitoring()) {
            chrome.tabs.sendMessage(tab.id, {operation: 'remove'});
            uppward.bs.toolbar.setIcon(tab.id, 'gray');
            return;
        }

        try {
            var data = uppward.cache.search(url);
            if (data) {
                onValidate(tab, url, data);
            } else {
                //console.log('_validte')
                //console.log(uppward.monitor.tab.get(tab.id, 'referer'))
                uppward.api.urlmon(new URL(url), {
                    tabId: tab.id,
                    winId: tab.windowId,
                    tabUpdated: event,
                    origin: uppward.monitor.tab.get(tab.id, 'origin'),
                    referer: uppward.monitor.tab.get(tab.id, 'referer'),
                    url: url
                }, function(err, result){
                    if (err) {
                        uppward.bs.toolbar.setIcon(tab.id, 'gray');
                        return;
                    }

                    if (!_.isEmpty(result.data.indicators)) {
                        _.each(_.reverse(result.data.indicators), function(indicator){
                            uppward.cache.add(indicator.pattern, indicator);
                        });
                    }

                    var data = uppward.cache.search(url);
                    if (data) {
                        onValidate(tab, url, data);
                    } else {
                        uppward.bs.toolbar.setIcon(tab.id, 'activate');
                    }
                });
            }
            // crypto address highlight
            if (uppward.cache.hasBlacklistCryptoAddress(url)) {
                uppward.bs.toolbar.setIcon(tab.id, 'scam');
            }

        } catch(e) {
            console.log('error')
            //console.log(e)
        }
    }

    function _bulkValidate(url, tab, change, event) {
        /**if (!uppward.pref.getIsMonitoring()) {
            chrome.tabs.sendMessage(tab.id, {operation: 'remove'});
            uppward.bs.toolbar.setIcon(tab.id, 'gray');
            return;
        }**/

        try {
            var data = uppward.cache.search(url);
            if (data) {
                onValidate(tab, url, data);
            } else {
                uppward.api.urlmon(new URL(url), {
                    tabId: tab.id,
                    winId: tab.windowId,
                    tabUpdated: event,
                    origin: uppward.monitor.tab.get(tab.id, 'origin'),
                    referer: uppward.monitor.tab.get(tab.id, 'referer'),
                    url: url
                }, function(err, result){
                    if (err) {
                        uppward.bs.toolbar.setIcon(tab.id, 'gray');
                        return;
                    }

                    if (!_.isEmpty(result.data.indicators)) {
                        _.each(_.reverse(result.data.indicators), function(indicator){
                            uppward.cache.add(indicator.pattern, indicator);
                        });
                    }

                    var data = uppward.cache.search(url);
                    if (data) {
                        onValidate(tab, url, data);
                    } else {
                        uppward.bs.toolbar.setIcon(tab.id, 'activate');
                    }
                });
            }
            // crypto address highlight
            if (uppward.cache.hasBlacklistCryptoAddress(url)) {
                uppward.bs.toolbar.setIcon(tab.id, 'scam');
            }

        } catch(e) {
            console.log('error')
            //console.log(e)
        }
    }

    var validate = _.throttle(_validate, 250);

    //Punycode Check Logic
    function punycodeCheck(q) {
        chrome.tabs.get(q.tabId, function(tab){
            if (!tab || typeof tab.url === 'undefined') {
                return;
            }
            var hostname = new URL(tab.url).hostname;

            // Punycode : ture, Action : Overlay or Redirection
            if(hostname.indexOf("xn--") > -1 && q.options.punycodeurl === true) {
                uppward.monitor.tab.set(tab.id, 'ba_data', null);
                uppward.monitor.tab.set(tab.id, 'ba_q', tab.url);
                var indicator = {"security_category" : "punycode","pattern":hostname};

                if(q.options.suspiciousurl === 'Overlay'){
                    /* Page Layer */
                    chrome.tabs.sendMessage(tab.id, {operation: 'flag', indicator:indicator, opt : q.options});
                    uppward.bs.toolbar.setIcon(tab.id, 'scam');
                }else if(q.options.suspiciousurl === 'Redirection'){
                    /* Page Redirect */
                    chrome.tabs.update(tab.id, {url: "https://uppward.sentinelprotocol.io/redirect-punycode.html?refer=" + (tab.url) + "&type=punycode"}, function(){});
                }
            }
        });
    }

    //Storage Option Gettering
    function getStorageOptions(callback){
        chrome.storage.local.get(['options'], function(data){
            callback(data.options);
        });
    }

    //Storage Option Settering
    function setStorageOptions(k, v, callback){
        chrome.storage.local.get(['options'], function(data){
            if(data.options === undefined) {
                data = {options : {k:v}};
            } else {
                data.options[k] = v;
            }

            chrome.storage.local.set(data, function(){
                callback();
            });
        });
    }

    //var blocklistedLoaded = []
    var alreadyChecked = []
    var resourcesToCheck = []

    function listenResources(info) {
        //console.log('url resource:')
        //console.log(info.url)
        if (!alreadyChecked.includes(info.url)) {
            // if not yet checked
            alreadyChecked.push(info.url)
            resourcesToCheck.push(info.url)
        }
    }

    function sendResourcesToCheck(tabId) {
        //console.log(sendResourcesToCheck)
        var flaggedResources = []
        if (resourcesToCheck && resourcesToCheck.length > 0) {
            // sending to uppward api searchbulk endpoint
            // console.log(resourcesToCheck)
            var toSend = resourcesToCheck.splice(0)
            uppward.api.searchResources(toSend, function(err, result) {

                if (err) {
                    console.log('error')
                    //console.log(err)
                    //uppward.bs.toolbar.setIcon(tab.id, 'gray');
                    return;
                }

                if (!_.isEmpty(result.data.results)) {
                    _.each(_.reverse(result.data.results), function(indicator){
                        flaggedResources.push(indicator)
                    });

                    // sending to cs.js
                    chrome.storage.local.get(['options'], function(data){
                        try {
                            chrome.tabs.sendMessage(tabId, {operation: 'resourceFlag', indicators:flaggedResources, opt : data.options});
                        } catch (err) {
                            console.log('error')
                            //console.log(err)
                        }
                    })
                }
            });
        }
    }

    var interval = null;
    var currentUrl = '';
    // invoked whenever state of page changes (e.g. url). this will also get invoked when you move to another url
    function onTabUpdated(tabId, changeInfo, tab) {
        /* browser storage select */
        if (tab.url !== currentUrl) {
            // url changed. reset alreadyChecked and resourcesToCheck')
            alreadyChecked = []
            resourcesToCheck = []

            //console.log('currentUrl: ' + currentUrl)
            currentUrl = tab.url
            //console.log('newCurrentUrl: ' + currentUrl)
            chrome.tabs.sendMessage(tabId, {operation: 'resourceUnflag'});
        }

        uppward.monitor.options.get(function(opt){
            if (opt && opt.punycodeurl && opt.activeprotect) {
                punycodeCheck({tabId : tabId, options : opt});
            }
        });

        uppward.bs.tabExists.call(this, tabId, function () {
            if (!uppward.bs.checkUrl(tab.url)) {
                return;
            }

            switch(changeInfo.status) {
            case 'loading':
                chrome.tabs.sendMessage(tabId, {operation: 'remove'});
                break;

            case 'complete':
                validate(tab.url, tab, 'update', true);
                if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url === '') {
                    // console.log('inside')
                    // set number on icon to 0
                    chrome.browserAction.setBadgeText({text: ''});
                    chrome.browserAction.setBadgeBackgroundColor({color: '#F03E3E'});

                    // console.log('setting lrd num in pref')
                    uppward.pref.setLrdNum(0)

                    // console.log('setting lrd resources list in pref')
                    uppward.pref.setFlaggedResources('')
                }
                break;
            }
        });
    }

    function killResourceListeners(){
        // kill interval
        if (interval){
            // console.log('killing existing interval');
            clearInterval(interval);
        }

        // kill resource listener
        chrome.webRequest.onBeforeRequest.removeListener(listenResources)
    }

    function startResourcesListener(tabId){

        if (interval){
            // killing existing interval
            clearInterval(interval);
        }

        resourcesToCheck = []
        alreadyChecked = []

        //console.log('startresourceslistener for tab id ')
        //console.log(tabId)
        chrome.webRequest.onBeforeRequest.addListener(
            listenResources,
            { tabId:tabId, urls: ['http://*/*', 'https://*/*'] });

        // console.log('listener started')

        // console.log('starting interval')
        interval = setInterval(function(){
            // console.log('sending resources for checking')
            getStorageOptions(function(opt) {
                if (opt && opt.activeprotect) {
                    if (resourcesToCheck && resourcesToCheck.length > 0) {
                        sendResourcesToCheck(tabId)
                    } else {
                        // console.log('no resources to check')
                    }
                } else {
                    // console.log('kill resource listener')
                    chrome.webRequest.onBeforeRequest.removeListener(listenResources)
                    // console.log('kill send resource to uppward api interval')
                    clearInterval(interval);
                    chrome.tabs.sendMessage(tabId, {operation: 'resourceUnflag'});
                }
            })
        }, 5000);
    }

    // invoked whenever you switch to that particular tab
    function onTabActivated(activeInfo) {
        /* browser storage select */
        //console.log(activeInfo)
        //console.log(activeInfo.tabId)
        var tabid = null;

        if (activeInfo.tabId) {
            tabid = activeInfo.tabId;
        } else {
            tabid = activeInfo.id;
        }

        getStorageOptions(function(opt) {
            if (opt && opt.punycodeurl && opt.activeprotect) {
                punycodeCheck({tabId : tabid, options : opt});
            }

            // kill resource listener from previous tab
            chrome.webRequest.onBeforeRequest.removeListener(listenResources)

            uppward.bs.tabExists.call(this, tabid, function () {
                chrome.tabs.get(tabid, function (tab) {
                    // check if lrd and active protection is enabled. if yes, start listener
                    if (opt && opt.lrd && opt.activeprotect) {
                        // monitor.js reinstate lrd
                        chrome.tabs.sendMessage(tabid, {operation: 'reinstateLrd'});

                        if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url === '') {
                            // set number on icon to 0
                            chrome.browserAction.setBadgeText({text: ''});
                            chrome.browserAction.setBadgeBackgroundColor({color: '#F03E3E'});

                            // setting lrd num in pref
                            uppward.pref.setLrdNum(0)

                            // setting lrd resources list in pref
                            uppward.pref.setFlaggedResources('')
                        }
                        startResourcesListener(tabid)
                    } else {
                        chrome.tabs.sendMessage(tabid, {operation: 'disableLrd'});
                    }

                    if (!uppward.bs.checkUrl(tab.url)) {
                        return;
                    }
                    validate(tab.url, tab, 'activate', false);
                });
            });
        });
    }

    function onTabRemoved(tabId) {
        uppward.monitor.tab.drop(tabId);
    }

    function onRedirect(info) {
        uppward.bs.tabExists.call(this, info.tabId, function () {
            chrome.tabs.get(info.tabId, function (tab) {
                if (!uppward.bs.checkUrl(tab.url)) {
                    return;
                }
                validate(info.url, tab, 'redirect', true);
            });
        });
    }

    function onSendHeaders(details) {
        var referer = uppward.bs.retrieveRequestHeaderValue(details.requestHeaders, 'Referer');
        uppward.monitor.tab.set(details.tabId, 'referer', referer);
    }

    function onCommitted(details) {
        if (details.transitionType === undefined || details.transitionType === 'auto_subframe') {
            return;
        }

        uppward.bs.tabExists.call(this, details.tabId, function(){
            chrome.tabs.get(details.tabId, function (tab) {
                if (!uppward.bs.checkUrl(tab.url)) {
                    return;
                }

                var origin = {
                    url: details.url,
                    winId: tab.windowId,
                    tabId: details.tabId,
                    transition: uppward.bs.getTransitionType(details.transitionType, details.transitionQualifiers)
                };

                uppward.monitor.tab.set(details.tabId, 'origin', origin);
            });
        });
    }

    uppward.monitor = {
        init: function(){
            chrome.tabs.onUpdated.addListener(onTabUpdated);
            chrome.tabs.onActivated.addListener(onTabActivated);

            /*
             * Handler for tabs.onRemoved events. Clears the tab cache.
             * If tab was closed, sends a request containing object {url, tabId, windowId}
             * If whole browser was closed, sends an array of objects {url, tabId}             *
             */
            chrome.tabs.onRemoved.addListener(onTabRemoved);

            // Fires when a redirect is about to be executed.
            // A redirection can be triggered by an HTTP response code or
            // by an extension. This event is informational and handled
            // asynchronously. It does not allow you to modify or cancel the request.

            // chrome.webNavigation might also be an option,
            // but it has a bug that affects google search result page:
            // https://bugs.chromium.org/p/chromium/issues/detail?id=115138
            chrome.webRequest.onBeforeRedirect.addListener(
                onRedirect,
                { urls: ['http://*/*', 'https://*/*'], types: ['main_frame'] });

            // https://developer.chrome.com/extensions/webRequest
            // Fires after all extensions have had a chance to modify
            // the request headers, and presents the final (*) version.
            // The event is triggered before the headers are sent to the network.
            // This event is informational and handled asynchronously.
            // It does not allow modifying or cancelling the request.
            chrome.webRequest.onSendHeaders.addListener(
                onSendHeaders,
                { urls: ['http://*/*', 'https://*/*'], types: ['main_frame'] }, ['requestHeaders']);

            // https://developer.chrome.com/extensions/webNavigation
            // web navigation related,
            // onBeforeNavigate -> onCommitted -> onDOMContentLoaded -> onCompleted
            // Fired when a navigation is committed.
            // The document (and the resources it refers to, such as images and subframes)
            // might still be downloading, but at least part of the document
            // has been received from the server and the browser has decided to
            // switch to the new document.
            chrome.webNavigation.onCommitted.addListener(onCommitted);

            chrome.storage.onChanged.addListener(function(changes, areaname){
                /*Listener Comment*/
                //console.log("chrome.storage.onChanged.addListener");
            });
        },
        updateCurrentTab: function(){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs && tabs.length > 0) {
                    var tab = tabs[0];
                    if (!uppward.bs.checkUrl(tab.url)) {
                        return;
                    }
                    validate(tab.url, tab, 'activate', false);
                }
            });
        },
        tab: {
            _cache: {},

            set: function (tabId, k, v) {
                var item = this._cache[tabId] = this._cache[tabId] || {};
                item[k] = v;
            },

            get: function (tabId, k) {
                return (this._cache[tabId] || {})[k];
            },

            drop: function (tabId) {
                if (this._cache[tabId]) {
                    delete this._cache[tabId];
                }
            },
        },
        options : {
            get : function(callback){
                getStorageOptions(callback);
            },

            set : function(k, v, callback){
                setStorageOptions(k, v, callback);
            }
        }
    };

}(uppward));



(function (uppward) {
    'use strict';

    var isReady = false;
    var pref = {};

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function initUserId(callback) {
        chrome.storage.sync.get(['userId'], function(result) {
            if (_.isEmpty(result.userId)) {
                var v = uuidv4();
                chrome.storage.sync.set({userId: v}, function() {
                    callback && callback(null, v);
                });
            } else {
                callback && callback(null, result.userId);
            }
        });
    }

    function initClientId(callback) {
        chrome.storage.local.get(['clientId'], function(result) {
            if (_.isEmpty(result.clientId)) {
                var v = uuidv4();
                chrome.storage.local.set({clientId: v}, function() {
                    callback && callback(null, v);
                });
            } else {
                callback && callback(null, result.clientId);
            }
        });
    }

    function initIsMonitoring(callback) {
        chrome.storage.local.get(['isMonitoring'], function(result) {
            if (result.isMonitoring === true || result.isMonitoring === false) {
                callback && callback(null, result.isMonitoring);
            } else {
                var v = true;
                chrome.storage.local.set({isMonitoring: v}, function() {
                    callback && callback(null, v);
                });
            }
        });
    }

    function updateToolbarIcon(isMonitoring) {
        uppward.bs.toolbar.setIcon(null, (isMonitoring ? 'activate' : 'gray'));
        uppward.monitor.updateCurrentTab();
    }

    uppward.pref = {
        DEFAULT_CACHE_TTL: 60 * 60 * 24,
        init: function(callback) {
            async.parallel({
                userId: initUserId,
                clientId: initClientId,
                isMonitoring: initIsMonitoring
            }, function(err, results) {
                if (!err) {
                    pref = results;
                    isReady = true;
                    updateToolbarIcon(pref.isMonitoring);
                }
                callback && callback();
            });
        },
        isReady: function() {
            return isReady;
        },
        getIsMonitoring: function() {
            return pref.isMonitoring;
        },
        setIsMonitoring: function(isMonitoring) {
            pref.isMonitoring = isMonitoring;
            chrome.storage.local.set({isMonitoring: isMonitoring});
            uppward.monitor.options.set("activeprotect" , isMonitoring, function(){
                /**
                chrome.tabs.query({currentWindow: true}, function(arrTabs, onError){
                    for(var i=0 ; i < arrTabs.length ; ++i) {
                        chrome.tabs.sendMessage(arrTabs[i].id, {
                            operation: isMonitoring ? 'tweetReset' : 'tweetRemove'
                        });
                    }
                });
                uppward.cache.resetTweet();
                **/
            });
            updateToolbarIcon(isMonitoring);
        },
        getLrdNum: function() {
            return pref.lrdNum;
        },
        setLrdNum: function(lrdNum) {
            pref.lrdNum = lrdNum;
            chrome.storage.local.set({lrdNum: lrdNum});
        },
        getFlaggedResources: function() {
            return pref.flaggedResources;
        },
        setFlaggedResources: function(flaggedResources) {
            pref.flaggedResources = flaggedResources;
            chrome.storage.local.set({flaggedResources: flaggedResources});
        },
        getFlaggedResourcesLrdPage: function() {
            return pref.flaggedResourcesLrdPage;
        },
        setFlaggedResourcesLrdPage: function(flaggedResources) {
            pref.flaggedResourcesLrdPage = flaggedResources;
            chrome.storage.local.set({flaggedResourcesLrdPage: flaggedResources});
        },
        /** not in use. twitter filter phased out
        setTweetBadge: function(isMonitoring) {
            chrome.tabs.query({currentWindow: true}, function(arrTabs, onError){
                for(var i=0 ; i < arrTabs.length ; ++i){
                    chrome.tabs.sendMessage(arrTabs[i].id, {
                        operation: isMonitoring ? 'tweetReset' : 'tweetRemove'
                    });
                }
                uppward.cache.resetTweet();
            });
        },
        **/
        setCryptoAddr: function(val) {
            chrome.tabs.query({currentWindow: true}, function(arrTabs, onError){
                for(var i=0 ; i < arrTabs.length ; ++i){
                    chrome.tabs.sendMessage(arrTabs[i].id, {
                        operation: val ? 'cryptoHighlightReset' : 'cryptoHighlightRemove'
                    });
                }
            });
        },
        buildUrlWithId: function(url) {
            return url
                .replace('{uid}', pref.userId || '')
                .replace('{cid}', pref.clientId || '')
                .replace('{aid}', uppward.pref.APP_ID);
        },
        getClient: function() {
            return {
                aid: uppward.pref.APP_ID,
                uid: pref.userId,
                cid: pref.clientId
            };
        }
    };

    var VERSION = '3.2.0';

    var PORTAL_WEB;
    var UPPWARD_WEB;
    var UPPWARD_API;





    uppward.pref.APP_ID = 'CRX/' + VERSION;
    PORTAL_WEB = 'https://portal.sentinelprotocol.io';
    UPPWARD_WEB = 'https://uppward.sentinelprotocol.io';
    UPPWARD_API = 'https://uppward.api.sentinelprotocol.io';
    uppward.pref.PUBLIC_KEY = '\
-----BEGIN PUBLIC KEY-----\
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxqcY/w5zJtk4rPDsDTLj\
U/aUmm//QqvSIZuLP/iFPqz7D/bB8OvOiG8u4UBb/bpa6vakTvP/yKDzhPWI7fOh\
IFpBkTt41qGCejzI/yeTDBC52/1AACJrBKGjF+lTTYNg9AOecre4wGS5fz42d+1T\
yowArjPtreOo/CGe7Id4c/Lpz+1UeAip/qKktbOiOv0RD51wWfJabp6JMth3UCug\
MjbZSGBBTGY6KTNE5Flmxk7Eh+te1IxQEE9wRpebUzIR1F7aacJjqyaiT0xKiJHT\
vmNRn5Inzo86R0XVg84nK6PLw5dFebuvBOlb2FfZCF3pmIGJPi5lT2PfV6ckyM9O\
tQIDAQAB\
-----END PUBLIC KEY-----';

    uppward.pref.WELCOME_URL = UPPWARD_WEB + '/welcome?uid={uid}&cid={cid}&aid={aid}';
    uppward.pref.GOODBYE_URL = UPPWARD_WEB + '/goodbye?uid={uid}&cid={cid}&aid={aid}';
    uppward.pref.CASEOPEN_URL = PORTAL_WEB + '/create/case';
    uppward.pref.URLMON_API = UPPWARD_API + '/v1/urlmon';
    uppward.pref.SEARCH_API = UPPWARD_API + '/v1/search';
    uppward.pref.SEARCH_BULK_API = UPPWARD_API + '/v1/searchbulk';
    uppward.pref.CREATE_CASE_API = UPPWARD_API + '/v1/createcase';
    uppward.pref.RETRIEVE_STAG_API = UPPWARD_API + '/v1/search_stag';

    uppward.pref.CRYPTO_ADDRESS_HIGHLIGHT_SKIP = [
        'blockexplorer.com',
        'blockscout.com',
        'bloks.io',
        'bloxy.info',
        'dogechain.info',
        'enjinx.io',
        'eosflare.io',
        'etherchain.org',
        'etherscan.io',
        'ethplorer.io',
        'explorer.bitcoin.com',
        'explorer.nemchina.com',
        'tracker.icon.foundation',
        'transcan.org',
        'trxplorer.io',
        'walletexplorer.com',
        'portal.sentinelprotocol.io',
        'monitor.sentinelprotocol.io',
        'forum.sentinelprotocol.io',
        'uppsalasecurity.com',
        'sentinelprotocol.io'
    ];

}(uppward));

(function (uppward) {
    'use strict';

    function onInstalled() {
        chrome.storage.local.get("options", function(data){
            var opts = data.options;
            if(opts != undefined && opts != {}) {
                var opt = {
                        activeprotect : (opts.activeprotect != undefined) ? opts.activeprotect : true
                        , twitterbadge : false
                        , cryptoaddresshighlight : (opts.cryptoaddresshighlight != undefined) ? opts.cryptoaddresshighlight : true
                        , punycodeurl : (opts.punycodeurl != undefined) ? opts.punycodeurl : false
                        , suspiciousurl : (opts.suspiciousurl != undefined) ? opts.suspiciousurl : 'Overlay'
                        , alterbar : (opts.alterbar != undefined) ? opts.alterbar : true
                        , disptime : (opts.disptime != undefined) ? opts.disptime : 3
                        , typefacesize : (opts.typefacesize != undefined) ? opts.typefacesize : 13
                        , layouttype : (opts.layouttype != undefined) ? opts.layouttype : 'Top'
                        , backgroundcolor : (opts.backgroundcolor != undefined) ? opts.backgroundcolor : '#20C997'
                        , lrd : (opts.lrd != undefined) ? opts.lrd : true
                        , lrdalert : (opts.lrdalert != undefined) ? opts.lrdalert : true
                        , lrdlayouttype : (opts.lrdlayouttype != undefined) ? opts.lrdlayouttype : 'Bottom'
                        , lrdNum : 0
                        , gaPrivacy: (opts.gaPrivacy != undefined) ? opts.gaPrivacy : false
                        , firstOpen: true
                };
                chrome.storage.local.set({options : opt});
            }else {
                chrome.storage.local.set({
                    options : {
                        activeprotect : true
                        , twitterbadge : false
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
                        , lrdNum : 0
                        , gaPrivacy: false
                        , firstOpen: true
                    }
                }, function(){});
            }
        });
        chrome.runtime.setUninstallURL(uppward.pref.buildUrlWithId(uppward.pref.GOODBYE_URL));
        chrome.tabs.create({
            url: uppward.pref.buildUrlWithId(uppward.pref.WELCOME_URL)
        });
    }

    var isInstalled = false;

    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason === 'install') {
            if (uppward.pref.isReady()) {
                onInstalled();
            }else {
                isInstalled = true;
            }
        }else if(details.reason === "update") {
            onInstalled();
            uppward.ga.ba.update();
        }
    });

    uppward.pref.init(function(){
        uppward.monitor.options.get(function(opt) {
            if (uppward.pref.getGaPrivacy) {
                uppward.ga.init();
            }
        });

        chrome.runtime.setUninstallURL(uppward.pref.buildUrlWithId(uppward.pref.GOODBYE_URL));
        isInstalled && onInstalled();
        uppward.monitor.init();
        var contextMenusID = chrome.contextMenus.create({
            title: chrome.i18n.getMessage('monitoring'),
            type: 'checkbox',
            checked: uppward.pref.getIsMonitoring(),
            contexts: ['browser_action'],
            onclick: function(info){
                uppward.pref.setIsMonitoring(info.checked);
            }
        });
        //contextMenuID
        chrome.storage.local.set({contextMenusID: contextMenusID});
    });


}(uppward));
