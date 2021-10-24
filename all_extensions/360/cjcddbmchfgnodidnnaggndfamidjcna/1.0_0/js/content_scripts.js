$(".header").remove();
$(".coin_tab").remove();
$(".sidetool").remove();
$("#chat-div").remove();
$(".bg_w").remove();
$(".safety_tips").remove();
$(".footer").remove();
$(".footer_bottom").remove();
$(".mana-adv").remove();
$("#pebprice_today_ul").remove();
var size = $("#price_today_ul").find("li").size();


/**
 * 扩展date函数
 * author:c3gen
 */

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**
 date 为long类型
 pattern 为格式化参数
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}

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
function opentip(obj,bcode) {

    httpRequest("https://www.jubi.com/ajax/trade/order/coin/"+bcode+"/type/3",function (text) {
        var result = JSON.parse(text);
        if(result.status==0){
            alert("请先去登录");
        }else{
            var datas = result.data.datas;
            var table = $("<table class='table table-hover table-bordered table-striped table-condensed' ></table>");

            var tr =$("<tr></tr>");
            tr.append($("<td></td>").text("买/卖"));
            tr.append($("<td></td>").text("成交价格"));
            tr.append($("<td></td>").text("成交数量"));
            tr.append($("<td></td>").text("成交金额"));
            tr.append($("<td></td>").text("单价"));
            tr.append($("<td></td>").text("时间"));
            table.append(tr);


            for(var i=0;i<datas.length;i++){
                var data = datas[i];
                var tr =$("<tr></tr>");
                tr.append($("<td></td>").text(data.t));
                tr.append($("<td></td>").text(data.p));
                tr.append($("<td></td>").text(data.n));
                tr.append($("<td></td>").text(data.s));
                tr.append($("<td></td>").text(data.f));
                var s = new Date(data.c*1000);
                tr.append($("<td></td>").text(getFormatDate(s)));
                table.append(tr);
            }
            var html = $("<div></div>").append(table).html();
            layer.tips(html,obj,{tips: [3,"rgb(232, 235, 243)"],time:0,shade:0.001,shadeClose:true,maxWidth:"auto"});
        }

    });
}

function getCode(index) {
    var aa =$("#price_today_ul").find("li").eq(index).find("a");
    var href = aa.attr("href");
    var bcode = href.substring(6,href.length-1);
    return bcode;
}
var ul = $("<ul id='bisheng' class='price_today_ul' style='top:52px;position: absolute;left: 10px;'></ul>");
for(var i=0;i<size;i++){
    var li = $("<li style='background-color:rgba(0, 0, 0, 0);' ></li>").text("-------------------");
    li.click(function () {
        var index = $("#bisheng").find("li").index(this);
        var bcode = getCode(index);
        var aa =$("#price_today_ul").find("li").eq(index).find("a");
        var  dd = aa.find("dl").find("dd").eq(0);
        opentip(dd,bcode);
    });
   ul.append(li);

};
$(".list_1").append(ul);

function ctr() {
    //获取最新挂单价,并检测有没有过交易
    $("#bisheng").find("li").each(function (i) {
        var bcode = getCode(i);
        var $this =$(this);
        $this.removeClass("text-shadow");

        //获取交易记录
        httpRequest("https://www.jubi.com/ajax/trade/order/coin/"+bcode+"/type/3",function (text) {
            var result = JSON.parse(text);
            if(result.status!=0){
                var datas = result.data.datas;
                if(datas.length<1){
                    $this.text("-------------------");
                }else{
                    var t = datas[0].t;
                    if(t=="买入"){
                        //取新买入
                        $this.text("￥"+datas[0].p+" - "+datas[0].n+"个");
                    }else{
                        $this.text("----------"+datas.length+"-------");
                    }

                }
            }
        })



        httpRequest("https://www.jubi.com/ajax/trade/list/coin/"+bcode+"/type/0/status/2",function (text) {
            var result = JSON.parse(text);
            if(result.status!=0){
                var datas = result.data.datas;
                if(datas.length<1){
                    //$this.text("-------------------");
                }else{
                    var data= datas[0];
                    $this.text(data.type+" - ￥"+data.price+" - "+data.num_total+"个").addClass("text-shadow");
                }
            }
        })
    })
}
//tips层-下
ctr();
setInterval(ctr,5000);


