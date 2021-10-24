/**
* * Howdy!! p1ngM3 @d09r
*
* * CryptoMining Blocker
* * Version 0.0.1
* * Author: D09r
* * Repository: https://github.com/D09r
*
*/

var minersCount;

function minersCount() {
    $('#minersCount').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 600,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

function cFormatter(num) {
     if (num >= 1000000000) {
         minersCount = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
         document.getElementById('minersCount').innerHTML = minersCount;
     } else if (num >= 1000000) {
         minersCount = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
         document.getElementById('minersCount').innerHTML = minersCount;
     } else if (num >= 500000) {
         minersCount = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
         document.getElementById('minersCount').innerHTML = minersCount;
     } else {
         document.getElementById('minersCount').innerHTML = num;
         minersCount();
     }
}

$(function() {
    chrome.storage.sync.get(['minersBlocked'], function(n) {
        if (n.minersBlocked == undefined) {
            document.getElementById('minersCount').innerHTML = 0;
        } else {
            cFormatter(n.minersBlocked);
        }
    });
});