chrome.runtime.sendMessage({from:"popup"}, function (response) {
    app.yprice=response;
});

chrome.runtime.sendMessage({from:"getpwd"}, function (response) {
    if(response!=""){
        app.pwd=response;
    }
});

/*
chrome.runtime.onMessage.addListener(function(obj, sender, sendResponse){
    if(obj.from=="content"){
        var msg = obj.msg;
        for(var key in msg){
            console.log("属性：" + key + ",值："+ msg[key]);
            $("#biWrap").append("<option>"+msg[key]+"</option>");
        }
    }
});
*/


var biname = {
    ans: "小蚁股",
    blk: "黑币",
    btc: "比特币",
    bts: "比特股",
    dnc: "暗网币",
    doge: "狗狗币",
    eac: "地球币",
    etc: "以太经典",
    eth: "以太坊",
    fz: "冰河币",
    game: "游戏点",
    gooc: "谷壳币",
    hlb: "活力币",
    ifc: "无限币",
    jbc: "聚宝币",
    ktc: "肯特币",
    lkc: "幸运币",
    lsk: "LISK",
    ltc: "莱特币",
    max: "最大币",
    met: "美通币",
    mryc: "美人鱼币",
    mtc: "猴宝币",
    nxt: "未来币",
    peb: "普银",
    pgc: "乐园通",
    plc: "保罗币",
    ppc: "点点币",
    qec: "企鹅链",
    rio: "里约币",
    rss: "红贝壳",
    skt: "鲨之信",
    tfc: "传送币",
    vrc: "维理币",
    vtc: "绿币",
    wdc: "世界币",
    xas: "阿希币",
    xpm: "质数币",
    xrp: "瑞波币",
    xsgs: "雪山古树",
    ytc: "一号币",
    zcc: "招财币",
    zet: "泽塔币",
    mcc:"行云币"
};




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

//记录上一次的价格,来显示这次更新是增是减
var prevPrice={};
var isfirst=true;
//更新成交记录
function  detail() {
    httpRequest("https://www.jubi.com/coin/allcoin",function (text) {
        var msg = JSON.parse(text);
        //算增幅,并排序

        var  result = [];
        var totalLast=0;
        $.each(msg,function (key,value) {
            var obj={key:key,val:value};

            if(isfirst){
                prevPrice[key]=value[1];
            }else{
                if(value[1] != prevPrice[key]){
                    obj.arrow =  value[1] > prevPrice[key]?1:2;
                    obj.prePrice=prevPrice[key];
                    prevPrice[key]=value[1];
                }
            }


            //可用
            var balance = app.caiwu[key+"_balance"];
            //锁定
            var lock=app.caiwu[key+"_lock"];


            if(balance >0.001 || lock > 0.001){
                obj.balance=balance;
                obj.lock=lock;
            }


            //剩余币的当前价值
            var total = parseFloat(app.caiwu[key+"_total"])*value[1];

            //投入总价
            var touru = parseFloat((app.touru[key]||0));


            if(total >0.001 || Math.abs(touru )>0.001){
                obj.total=(total).toFixed(2);
                obj.touru=touru;
                //盈余
                var last = parseFloat(total) + parseFloat(touru);
                if(last!=0){
                    obj.last=last.toFixed(2);
                }
            }



            obj.weituo=app.weituo[key]||[];
            //总币
            var totalB = parseFloat(app.caiwu[key+"_total"]);
            if(obj.total!=0 && totalB > 0.001 ){
                //我的单价
                var sprice= (-1*parseFloat(obj.touru)/totalB).toFixed(4);
                if(sprice!=0  ){
                    obj.myprice= sprice;
                    //我的单价相对于当前价格的涨跌
                    obj.proportion=((value[1]/parseFloat(obj.myprice)-1)*100).toFixed(2);
                }
            }


            app.obeans[key]=obj;
            result.push(obj);
            totalLast+=parseFloat(obj.last||0);
        });

        isfirst=false;
        app.totalLast=totalLast;
        //增
        result.sort(function (a,b) {
            var updownA = 0;
            var updownB = 0;

            if(a.hasOwnProperty("updown")){
                updownA = a.updown;
            }else{
                var av=a.val[1];
                var ay=app.yprice[a.key];
                if(!(isNaN(av) || isNaN(ay))){
                    if(ay!=0){
                        updownA = ((av/ ay - 1) * 100).toFixed(2);
                    }
                }
                a.updown=updownA;
            }

            if(b.hasOwnProperty("updown")){
                updownB = b.updown;
            }else{
                var bv=b.val[1];
                var by=app.yprice[b.key];
                if(!(isNaN(bv) || isNaN(by))){
                    if(by!=0){
                        updownB = ((bv/by- 1) * 100).toFixed(2);
                    }
                }
                b.updown=updownB;
            }

            return updownB-updownA;
        });

        app.beans= result;
    });
}

//我的历史交易记录
function  myTotal(bcode,total,pageno) {
    httpRequest("https://www.jubi.com/ajax/trade/order/coin/"+bcode+"/type/3?p="+pageno,function (text) {
        var result = JSON.parse(text);
        if(result.status!=0){
            var datas = result.data.datas;
            var pagemax = result.data.page.pagemax;
            if(pageno==1){
                app.history[bcode]=[];
            }
            for(var i=0;i<datas.length;i++){
                var data = datas[i];

                app.history[bcode].push(data);

                if(data.t=="买入"){
                    total=total-data.s;
                }else{
                    total=total+data.s;
                }
            }
            pagemax = parseInt(pagemax);
            if(pagemax > pageno){
                myTotal(bcode,total,++pageno)
            }else{
                app.totalPrice=app.totalPrice+total;
                app.touru[bcode]=total.toFixed(2);
            }
        }else{
            app.touru[bcode]=0;
        }
    })

}
//币种  拥有与冻结数量
function caiwu() {
    httpRequest("https://www.jubi.com/ajax/user/finance",function (text) {
        var result = JSON.parse(text);
        if(result.status!=0){
            var data = result.data;
            for(var key  in  biname){
                var balance = data[key+"_balance"];
                var lock = data[key+"_lock"];
                app.caiwu[key+"_balance"]=balance.toFixed(4);
                app.caiwu[key+"_lock"]=lock.toFixed(4);
                app.caiwu[key+"_total"]=(balance+lock).toFixed(4);
            }

            app.cny.balance=data["cny_balance"].toFixed(2);
            app.cny.lock=data["cny_lock"].toFixed(2);
            app.cny.total=data["cny_total"].toFixed(2);
            detail();
        }
    })
}


//最后委托管理
function weituo(bcode) {
    //未成交
    httpRequest("https://www.jubi.com/ajax/trade/list/coin/"+bcode+"/type/0/status/2",function (text) {
        var result = JSON.parse(text);
        if(result.status!=0){
            var datas = result.data.datas;
            if(datas.length<1){
                app.weituo[bcode]=[];
            }else{
                var weihuos =[];
                for(var i=0;i<datas.length;i++){
                    var data = datas[i];
                    weihuos.push(data);
                };
                app.weituo[bcode]=weihuos;
            }
        }
    })
}


//获取最新下单的数据
function execute() {
    app.totalPrice=0;
    for(var key  in  biname){
        myTotal(key,0,1);
        weituo(key);
    }
    caiwu();
}


//显示  最近下单列表
function opentip(bcode,obj) {
    var datas = app.history[bcode];
    var table = $("<table class='table table-hover table-bordered table-striped table-condensed' ></table>");
    var tr =$("<tr></tr>");
    tr.append($("<td></td>").text("买/卖"));
    tr.append($("<td></td>").text("成交价格"));
    tr.append($("<td></td>").text("成交数量"));
    tr.append($("<td></td>").text("成交金额"));
    tr.append($("<td></td>").text("?"));
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


var model = {
    beans:{},
    totalPrice:0,
    yprice:{},
    caiwu:{},
    touru:{},
    totalLast:0,
    weituo:{},
    history:{},
    pwd:null,
    obeans:{},
    showKey:null,
    price:0,
    number:0,
    maxcanbuy:0,
    cny:{},
    ordertype:"buy",
    minprice:null,
    maxprice:null,
    mulitynum:null,
    picked:0,
    mulitypars:[],
    everynum:null,
    pickedNum:0,
    mulityparsNum:[],
    mulityparsPrice:[]

};

var app = new Vue({
    el: '#bisheng_div',
    data: model,
    methods:{
        setMax:function(value){
            $("#ex1").slider("setValue",value);
        },
        setPrice:function (value) {
            $("#ex2").slider("setValue",value);
        },
        setBuyMax:function(value){
            $("#ex3").slider("setValue",value);
        },
        setBuyPrice:function (value) {
            $("#ex4").slider("setValue",value);
        },
        orderok:function () {
            var price = app.price;
            var number = app.number;
            var name=app.obeans[app.showKey].val[0];
            var key=app.showKey;
            var orderType = app.ordertype;
            if(window.confirm(orderType+"!!! "+name+"("+key+")"+"  "+"price:￥"+price+" number:"+number)){
                $.ajax({
                    type:"post",
                    dataType : "json",
                    url:"https://www.jubi.com/ajax/trade/add/coin/"+key,
                    data:{price:price,number:number,pwtrade:app.pwd,ga:"",type:orderType},
                    success:function (data) {
                        if(data.status==1){
                            layer.closeAll();
                            layer.msg("挂单成功");
                            execute();
                        }else{
                            layer.msg("挂单失败:"+data.msg);
                        }
                    }
                });
            }
        },
        startMulity:function () {//开始分段
            var min  = parseFloat(app.minprice);
            var max  = parseFloat(app.maxprice);
            var picked = app.picked;
            var mulitynum = app.mulitynum;
            var eve = ((max-min)/(mulitynum-1));
            var arr =[];
            $("#partwrap").empty();
            for(var i=0;i<mulitynum;i++){
                var part = min+eve*i;
                arr.push(part.toFixed(3));
                $("#partwrap").append('<input type="text" style="width:60px;margin-right: 10px;" value="'+part.toFixed(3)+'"  class="mulitypart"   >')
            }
            // app.mulitypars=arr;
            totalMoney();
        },
        startMulityNum:function () {
            //数量基数
            var num = app.everynum;
            var picked = app.pickedNum;
            //段数
            var mulitynum = app.mulitynum;
            var arr =[];
            var prices=[];
            $("#numwrap").empty();
            $("#pricewrap").empty();
            for(var i=0;i<mulitynum;i++){
                // arr.push(num);
                // prices.push(num*app.mulitypars[i]);
                var vv = $(".mulitypart").eq(i).val();
                var p = (num*vv);
                $("#numwrap").append('<input type="text" style="width:60px;margin-right: 10px;" value="'+num+'"  class="mulityparsNum"   >');
                $("#pricewrap").append('<input type="text" style="width:60px;margin-right: 10px;" value="'+p+'"  class="mulitypartPrice"   >')
            }
            // app.mulityparsNum=arr;
            // app.mulityparsPrice=prices;
            // console.log(app.mulityparsNum);
            totalMoney();
        }
    }
    ,
    watch: {
        minprice:function () {
            app.startMulity();
        },
        maxprice:function () {
            app.startMulity();
        },
        picked:function () {
            app.startMulity();
        },
        mulitynum:function () {//分成几段
            app.startMulity();
            app.startMulityNum();
         },

        everynum:function () {//每段数量
            app.startMulityNum();
        },
        pickedNum:function () {
            app.startMulityNum();
        }
        
        
    }

});


setTimeout(detail,100);
setInterval(detail,5000);
execute();
setInterval(execute,30000);





//改钱
$("#bisheng_div").on("keyup",".mulitypartPrice",function () {
    var index = $(this).index();
    var v = $(this).val();
    var price  = $(".mulitypart").eq(index).val();
    $(".mulityparsNum").eq(index).val((v/parseFloat(price)).toFixed(4));
    totalMoney();
});

//改数量
$("#bisheng_div").on("keyup",".mulityparsNum",function () {
    var index = $(this).index();
    var v = $(this).val();
    var price  = $(".mulitypart").eq(index).val();
    $(".mulitypartPrice").eq(index).val((v*parseFloat(price)).toFixed(4));
    totalMoney();
});

//改单价
$("#bisheng_div").on("keyup",".mulitypars",function () {
    var index = $(this).index();
    var v = $(this).val();
    var num  = $(".mulityparsNum").eq(index).val();
    $(".mulitypartPrice").eq(index).val((v*parseFloat(num)).toFixed(4));
    totalMoney();
});

function totalMoney() {
    var total =0;
    $(".mulitypartPrice").each(function () {
        total = total + parseFloat($(this).val());
    });

    var totalNum=0;
    $(".mulityparsNum").each(function () {
        totalNum= totalNum + parseFloat($(this).val());
    });

    $("#totalNum").text(totalNum);
    $("#totalMoney").text(total);
}



$("#bisheng_div").on("click","#subpwd",function () {
    var pwd = $("#pwd").val();
    chrome.runtime.sendMessage({from:"setpwd",pwd:pwd}, function (response) {
        if(response!=""){
            app.pwd=response;
        }
    });
});
$("#bisheng_div").on("click","#cancelpwd",function () {
    chrome.runtime.sendMessage({from:"cancelpwd"}, function (response) {
        if(response==""){
            app.pwd=null;
        }
    });
});

$("#bisheng_div").on("click",".history",function () {
   var key = $(this).attr("title");
   opentip(key,this);
});







//-----------------买卖







var iskeyup=false;
$("#bisheng_div").on("keyup","#price",function () {
    iskeyup=true;
    var v = $(this).val();
    var price = app.obeans[app.showKey].val[1];
    var v = (v/price - 1 )*100
    $("#ex2").slider("setValue",v);

});
$("#bisheng_div").on("keyup","#number",function () {
    iskeyup=true;
    var v = $(this).val();
    var balance = app.obeans[app.showKey].balance||0;
    balance =parseFloat(balance);
    if(balance==0){
        $("#ex1").slider("setValue",0);
    }else{
        if(v>balance){
            $("#ex1").slider("setValue",100);
        }else{
            $("#ex1").slider("setValue",v/balance*100);
        }

    }
});
$("#bisheng_div").on("keyup","#pricebuy",function () {
    iskeyup=true;
    var v = $(this).val();
    var price = app.obeans[app.showKey].val[1];
    var v = (1- v/price  )*100
    $("#ex4").slider("setValue",v);
    if(v==0 || v==""){
        app.maxcanbuy =0;
    }else{
        app.maxcanbuy= app.cny.balance/v;
    }

});
$("#bisheng_div").on("keyup","#numberbuy",function () {
    iskeyup=true;
    var v = $(this).val();
    var balance = app.maxcanbuy||0;
    if(balance==0){
        $("#ex3").slider("setValue",0);
    }else{
        if(v>balance){
            $("#ex3").slider("setValue",100);
        }else{
            $("#ex3").slider("setValue",v/balance*100);
        }

    }
});

$("#bisheng_div").on("blur","#price,#number,#pricebuy,#numberbuy",function () {
    iskeyup=false;
});



//取消订单
$("#bisheng_div").on("click",".cancel",function () {
    if(window.confirm("确定取消")){
        var id = $(this).attr("id");
        var key = $(this).data("key");
        var url = "https://www.jubi.com/ajax/trade/cancel/coin/"+key+"/id/"+id;
        httpRequest(url,function (text) {
            var result = JSON.parse(text);
            if(result.status==1){
                execute();
                layer.msg("取消成功");
            }else{
                layer.msg(result.msg);
            }
        })
    }
});


//分段买与卖  下单
$("#bisheng_div").on("click","#mulityOrder",function () {
    var name=app.obeans[app.showKey].val[0];
    var key=app.showKey;
    var orderType = app.ordertype;
    if(window.confirm(orderType+"!!! "+name+"("+key+")")){
       $(".mulitypart").each(function (i) {
            var price = $(".mulitypart").eq(i).val();
            var number = $(".mulityparsNum").eq(i).val();
           $.ajax({
               type: "post",
               dataType: "json",
               url: "https://www.jubi.com/ajax/trade/add/coin/" + key,
               data: {price: price, number: number, pwtrade: app.pwd, ga: "", type: orderType},
               success: function (data) {
                   if (data.status == 1) {
                       layer.closeAll();
                       layer.msg("挂单成功");
                   } else {
                       layer.msg("挂单失败:" + data.msg);
                   }
               }
           });
        });
        execute();
    }
});



//最大可卖量
function maxNumber(value){
    try {
        var balance = app.obeans[app.showKey].balance||0;
        if (value != 0) {
            var number = (balance * parseInt(value) / 100).toFixed(4);
            app.number=parseFloat(number);
        } else {
            app.number=0;
        }
    } catch (e) {

    }
}
function maxPrice(value) {
    try {
        var price = app.obeans[app.showKey].val[1];
        if (value != 0) {
            var number = (price * (1+parseInt(value) / 100)).toFixed(4);
            app.price=parseFloat(number);
        } else {
            app.price=parseFloat(price);
        }
    } catch (e) {

    }
}

$("#ex1").slider({
    formatter: function (value) {
        $("#ex1tip").text(value+"%");
        if(!iskeyup){
            maxNumber(value);
        }
        return  value;
    }
});

$("#ex2").slider({
    formatter: function (value) {
        $("#ex1tip2").text(value+"%");
        if(!iskeyup){
            maxPrice(value);
        }
        return  value;
    }
});



//最大可买
function maxBuyNumber(value){
    try {

        var canbuy = (app.cny.balance/app.obeans[app.showKey].val[1]);
        if (value != 0) {
            var number = (canbuy * parseInt(value) / 100).toFixed(4);
            app.number=parseFloat(number);
        } else {
            app.number=0;
        }
    } catch (e) {

    }
}
function maxBuyPrice(value) {
    try {
        var price = app.obeans[app.showKey].val[1];
        if (value != 0) {
            var number = (price*(1-value/100)).toFixed(4);
            app.price=parseFloat(number);
        } else {
            app.price=parseFloat(price);
        }
        app.maxcanbuy= (app.cny.balance/app.price).toFixed(4);
    } catch (e) {

    }
}



$("#ex3").slider({
    formatter: function (value) {
        $("#ex1tip3").text(value+"%");
        if(!iskeyup){
            maxBuyNumber(value);
        }

        return  value;
    }
});

$("#ex4").slider({
    formatter: function (value) {
        $("#ex1tip4").text("-"+value+"%");
        if(!iskeyup){
            maxBuyPrice(value);
        }
        return  value;
    }
});





$("#bisheng_div").on("click",".down-order",function () {
    var key =$(this).data("key");
    app.showKey=key;
    app.ordertype="sell";

    $("#ex1").slider("setValue",0);

    $("#ex2").slider("setValue",0);

    //捕获页
    layer.open({
        type: 1,
        shade: false,
        title: false,
        content: $('#layer_notice'),
        maxWidth:"auto",
        cancel: function(){
        }
    });
});
$("#bisheng_div").on("click",".down-order-buy",function () {
    var key =$(this).data("key");
    app.showKey=key;
    app.ordertype="buy";

    $("#ex3").slider("setValue",0);

    $("#ex4").slider("setValue",0);
    layer.open({
        type: 1,
        shade: false,
        title: false,
        content: $('#layer_notice_buy'),
        maxWidth:"auto",
        cancel: function(){
        }
    });
});



//-------------------------分段买卖
$("#bisheng_div").on("click",".mulitybuy",function () {
    var key =$(this).data("key");
    app.ordertype=$(this).data("type");
    app.showKey=key;
    if(app.ordertype=="buy"){
        app.minprice = (app.obeans[key].val[1]*0.8).toFixed(3);
        app.maxprice = (app.obeans[key].val[1]*0.95).toFixed(3);
    }else{
        app.minprice =  (app.obeans[key].val[1]*1.05).toFixed(3);
        app.maxprice = (app.obeans[key].val[1]*1.2).toFixed(3);
    }


    //捕获页
    layer.open({
        type: 1,
        shade: false,
        title: false,
        content: $('#mulitybuy'),
        maxWidth:"auto",
        cancel: function(){
        }
    });
});