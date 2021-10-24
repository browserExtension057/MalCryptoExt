var $translate = $('input[name=translate]');
var pageConfig = chrome.extension.getBackgroundPage().pageConfig;

//读取配置
pageConfig.get(function (json) {
    if (json) {
        if (json.translate) {
            $translate.attr('checked', true);
        } else {
            $translate.attr('checked', false);
        }
    }
});

$translate.on('change', function () {
    var checked = +$(this).is(':checked');
    //修改配置
    pageConfig.set({
        translate: checked,
    });
    // window.close();
    return false;
});