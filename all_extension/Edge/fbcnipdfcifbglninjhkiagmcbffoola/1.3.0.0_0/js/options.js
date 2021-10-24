requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-1.12.1.min'
    }
});

define(['jquery', 'config'], function($, config) {
    function progressBar($selector) {
        var pb = $('<div/>')
            .addClass('progress progress-striped active')
            .css('width', '200px'),
            b = $('<div>').addClass('bar').css('width', '0%');
        pb.append(b).appendTo($selector);
        return {
            _state: 0,
            _activeTimeout: null,
            start: function() {
                this._activeTimeout = setTimeout(this._loading.bind(this), 100);
                return this;
            },
            stop: function() {
                clearTimeout(this._activeTimeout);
                pb.remove()
            },
            _loading: function() {
                if (this._state>=100){
                    this._state = 70;
                }
                this._state++;
                b.css('width', this._state+'%');
                this._activeTimeout = setTimeout(this._loading.bind(this), 100);
            }
        }
    }
    function genTargets(market){
        $pairs = $(".pairs");
        $pairs.empty();
        if (MASTER_ARRAY[market].src == 'new') {
            var pb = progressBar($pairs).start();
            var url = 'http://'+HOST+'/'+market+'/get_symbols/BTC';
            $.getJSON(url, function (data) {
                pb.stop()
                if (!data) {return;}
                var select = $('<select name="radios" />').appendTo($pairs);
                $('<option />')
                    .addClass('targetCurrency')
                    .html('---- select pair ----')
                    .appendTo(select);
                $(data).each(function(i, v){
                    $('<option />')
                    .addClass('targetCurrency')
                    .val(v).html(v)
                    .appendTo(select);
                });
                if(data.indexOf(config["targetCurrency"]) != -1){
                    $("select[name=radios]")
                        .val(config["targetCurrency"])
                        .attr('checked', 'checked');
                }
            }).fail(function() {
                pb.stop()
            });
        } else {
            $.each(MASTER_ARRAY[market], function(key, pair){
                if (key == 'src') return true;
                $(".pairs").append(
                    '<label class="radio">' +
                    '<input class="targetCurrency" type="radio" name="radios" value="'+key+'" ' +
                    'data-currency="'+key+'">'+pair.title+'</label>'
                )
            });
            $(".targetCurrency[data-currency='" + config["targetCurrency"] + "']").attr('checked', 'checked');
        }
    }

    //Set current values
    $(".exchangeService[data-service='" + config["exchangeService"] + "']").attr('checked', 'checked');
    genTargets(config["exchangeService"]);
    $("#alertsCheckbox").prop('checked', !!parseInt(+config["alertsActive"], 10));
    $("#chartCheckbox").prop('checked', !!parseInt(+config["chartActive"], 10));
    $("#notisoundsCheckbox").prop('checked', config["notisounds"]=='true');
    $("#alertsAmountChange").val(config["alertsAmountChange"]);
    $("#updateDelay").val(config["updateDelay"]);

    if (config["sourceCurrency"] == "BTC") {
        //Quitar BTCBTC
        $(".targetCurrency[data-currency='BTC']").parent().remove();
    }

    $(".exchangeService").change(function(){
        if ($(this).is(':checked')) {
            // config["exchangeService"] = $(this).val();
            genTargets($(this).val());
        }
    });

    $("#saveOptionsButton").click(function () {
        var $this = $(this);

        config["exchangeService"] = $(".exchangeService:checked").val();
        config["targetCurrency"] = $(".targetCurrency:checked,.targetCurrency:selected").attr('value');
        config["alertsActive"] = parseInt(+($("#alertsCheckbox:checked").length > 0), 10);
        config["chartActive"] = parseInt(+($("#chartCheckbox:checked").length > 0), 10);
        config["notisounds"] = $("#notisoundsCheckbox:checked").length>0;
        config["alertsAmountChange"] = parseFloat($("#alertsAmountChange").val());
        config["updateDelay"] = parseInt($("#updateDelay").val());

        if (isNaN(config["alertsAmountChange"])) {
            config["alertsAmountChange"] = 1;
            $("#alertsAmountChange").val(1);
        }

        if (isNaN(config["updateDelay"])) {
            config["updateDelay"] = 30;
            $("#updateDelay").val(30);
        }

        if (!$("#chartCheckbox:checked").length){
            chrome.browserAction.setPopup({popup: ""});
        }else{
            chrome.browserAction.setPopup({popup: "popup.html"});
        }

        chrome.extension.sendMessage({msg: "wsRecreate"});
        chrome.extension.sendMessage({msg: "resetTickerReq"});
        chrome.extension.sendMessage({msg: "updateTickerReq"});
        chrome.extension.sendMessage({msg: "resetInterval"});
        $this.removeClass("btn-primary").addClass("btn-success").text("OK");
    });
})
