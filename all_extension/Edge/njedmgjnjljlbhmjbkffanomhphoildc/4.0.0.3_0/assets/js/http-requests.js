function sendPostRequest(url, data, content_type, token, callback)
{
    if (!content_type)
        content_type = 'application/x-www-form-urlencoded';
    var req = new XMLHttpRequest();
    req.onload = function(){
        if(callback)
            callback(firebase.auth().currentUser, req.responseText);
    }
    req.onerror = function() {
        console.log('There was an error');
    }
    req.open('POST', url, true);
    if(token)
        req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.setRequestHeader('Content-Type', content_type);
    req.send(data); //url form encoded string
}

function sendGetRequest(url, token, callback)
{
    var req = new XMLHttpRequest();
    req.onload = function(){
        if(callback)
        callback(firebase.auth().currentUser, req.responseText);
    }
    req.open('GET', url, true);
    if(token)
        req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.send();
}