
//https://www.jubi.com/ajax/user/finance
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

var isfirst=true;
var yprice=null;
function init() {
    httpRequest("https://www.jubi.com/coin/trends",function (text) {
        var msg = JSON.parse(text);
        if(isfirst){
            yprice={};
            isfirst=false;
        }

        for (var key in msg){
            yprice[key]=msg[key].yprice;
        }
    });
}
init();
function keeplogin() {
    httpRequest("https://www.jubi.com/ajax/trade/order/coin/doge/type/3",function (text) {
        console.log("keep login:"+text);
    })
}
setInterval(keeplogin,1000 * 60 * 5)

var password="";

chrome.runtime.onMessage.addListener(function(obj, sender, sendResponse){
    console.log(obj);
    if(obj.from=="popup"){
        if(yprice!=null){
            sendResponse(yprice);
        }else{
            init();
        }
    }else if(obj.from=="setpwd"){
        password = obj.pwd;
        sendResponse(password);
    }else if(obj.from=="getpwd"){
        sendResponse(password);
    }else if(obj.from=="cancelpwd"){
        password="";
        sendResponse(password);
    }
});



