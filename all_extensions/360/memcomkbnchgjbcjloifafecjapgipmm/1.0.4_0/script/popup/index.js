var pageConfig = chrome.extension.getBackgroundPage().pageConfig;

(function () {
    //设置版本号
    var getManifest = chrome.runtime.getManifest();
    var version = getManifest.version;
    $('#version').html('v'+version);

    $('#description').html(getManifest.description);

})();