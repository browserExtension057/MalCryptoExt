var app = app || {};
! function(doc) {
    "use strict";
    $(doc).ready(function()
    {
        var timePlusCurrent = 3600000,
            // timePlusCurrent = 3000,
        isFound = function( string, substring )
        {
            if( !!string )
            {
                return !!( string.indexOf( substring ) > -1 );
            }
            return false;
        },
        isFoundAndAfterTime = function( string, substring )
        {
            var timeSaved = parseInt( sessionStorage.getItem( substring ), 10 ) || 0 ;

            // return isFound( string, substring );

            return isFound( string, substring )
                && ( timeSaved < new Date().getTime() );
        },
        updateQueryString = function(url, key, value)
        {
            if (!url) url = window.location.href;
            var re = new RegExp("([?&])" + key + "=.*?(&|#|$|;)(.*)", "gi"),
                hash;

            if (re.test(url)) {
                if (typeof value !== 'undefined' && value !== null)
                    return url.replace(re, '$1' + key + "=" + value + '$2$3');
                else {
                    hash = url.split('#');
                    url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                    return url;
                }
            }
            else {
                if (typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    hash = url.split('#');
                    url = hash[0] + separator + key + '=' + value;
                    if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                    return url;
                }
                else
                    return url;
            }
        },
        urlList = [
            // {
            //     url: 'amazon.ca',
            //     key: 'tag',
            //     id: 'cv053-20',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.co.uk',
            //     key: 'tag',
            //     id: 'cv01d-21',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.de',
            //     key: 'tag',
            //     id: 'cv086-21',
            //     redirect: false,
            // },
            {
                url: 'amazon.fr',
                key: 'tag',
                id: 'cv02b-21',
                redirect: false,
            },
            // {
            //     url: 'amazon.com.mx',
            //     key: 'tag',
            //     id: 'cv029-20',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.in',
            //     key: 'tag',
            //     id: 'cv0d63-21',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.it',
            //     key: 'tag',
            //     id: 'cv022-21',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.ae',
            //     key: 'tag',
            //     id: 'cv079-21',
            //     redirect: false,
            // },
            // {
            //     url: 'amazon.com.au',
            //     key: 'tag',
            //     id: 'cv03-22',
            //     redirect: false,
            // },
            {
                url: 'amazon.es',
                key: 'tag',
                id: 'nat07b-21',
                redirect: false,
            }
        ],
        urlListLen = urlList.length,
        newUrl;

        $(doc).on("mouseenter", "a", function()
        {
            // e.preventDefault();

            var currentUrl = $(this).attr('href'), //$(this)[0].href.split('#')[0],
                i = 0;

            for(i; i < urlListLen; i++ )
            {
                if( isFoundAndAfterTime( currentUrl, urlList[i].url ) )
                {
                    if( urlList[i].redirect )
                    {
                        newUrl = urlList[i].id + currentUrl;
                    }
                    else
                    {
                        newUrl = updateQueryString( currentUrl, urlList[i].key, urlList[i].id );
                    }

                    $(this).attr('href', newUrl);
                    sessionStorage.setItem( urlList[i].url, new Date().getTime() + timePlusCurrent );

                    // console.log(2, newUrl);
                }
            }
        });
    })
}(document);