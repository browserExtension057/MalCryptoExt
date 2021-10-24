var timer;
$(document).ready(function(){
  getData();
  timer = setInterval(getData, 5000);
});

var active_exchange = "bithumb";

function getData() {
  if (active_exchange == "bithumb")
  {
     $.get("https://api.bithumb.com/public/ticker/ALL", setData);
  } else {
     $.get("https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-NEO,KRW-MTL,KRW-LTC,KRW-STRAT,KRW-XRP,KRW-ETC,KRW-OMG,KRW-SNT,KRW-WAVES,KRW-PIVX,KRW-XEM,KRW-ZEC,KRW-XMR,KRW-QTUM,KRW-GNT,KRW-LSK,KRW-STEEM,KRW-XLM,KRW-ARDR,KRW-KMD,KRW-ARK,KRW-STORJ,KRW-GRS,KRW-VTC,KRW-REP,KRW-EMC2,KRW-ADA,KRW-SBD,KRW-TIX,KRW-POWR,KRW-MER,KRW-BTG,KRW-ICX,KRW-EOS,KRW-STORM,KRW-TRX,KRW-MCO,KRW-SC,KRW-GTO,KRW-IGNIS,KRW-ONT,KRW-DCR,KRW-ZIL,KRW-POLY,KRW-ZRX,KRW-SRN,KRW-LOOM,KRW-BCH,KRW-ADT,KRW-ADX,KRW-BAT,KRW-IOST", setDataUpbit);
  }
  
}

function setData(data, status) {
  var coins = data.data;
  var html;
  var update_time;
  html = "<table border=1><thead><tr>";
  html += "<th scope='col' width='12%'>코인</th><th scope='col' width='25%'>시세</th><th scope='col'>변동률 (%)</th><th scope='col' width='20%'>거래금액</th>";
  html += "</tr></thead><tbody>";

  for ( coin in coins )
  {
    if (coin == "date") {
      update_time = coins[coin];
      continue;
    }
    html += createCoinData(coin, coins[coin]);  
  }
  
  html += "</tbody></table>";
  var price = $("#price-data");
  price.html(html);
  //$("#date").html('기준 시간: ' + unix_to_date(update_time));
}

function setDataUpbit(data, status) {
  var coins = data;
  var html;
  html = "<table border=1><thead><tr>";
  html += "<th scope='col' width='12%'>코인</th><th scope='col' width='25%'>시세</th><th scope='col'>변동률 (%)</th><th scope='col' width='20%'>거래금액</th>";
  html += "</tr></thead><tbody>";

  for ( coin in coins )
  {
    html += createCoinDataUpbit(coin, coins[coin]);  
  }
  
  html += "</tbody></table>";
  var price = $("#price-data");
  price.html(html);
}


function createCoinData(coin, data) {
  var price = parseInt(data.closing_price);
  var diff = data.closing_price - data.opening_price;
  var ratio = (diff / data.opening_price * 100).toFixed(2);
  var trade = parseInt(data.units_traded * data.closing_price/100000000);
  var add_style;
  if (diff > 0)
    add_style = "red";
  else
    add_style = "blue";

  var html = "<tr><td scope='row' data-label='코인' class='center'>" + coin + "</td>";
      html += "<td data-label='시세' class='right'>" + price.toLocaleString() + " 원 </td>";
      html += "<td data-label='변동률 (%)' class='right " + add_style +"'>" + diff.toLocaleString() + " 원 (" + ratio + "%)</td>";
      html += "<td data-label='거래금액' class='right'>" + trade.toLocaleString() + " 억원 </td>";
      html += "</tr>";
  return html;
}

function createCoinDataUpbit(coin, data) {
  var price = parseInt(data.trade_price);
  var diff = data.trade_price - data.opening_price;
  var ratio = (diff / data.opening_price * 100).toFixed(2);
  var trade = parseInt(data.acc_trade_price_24h/100000000);
  var add_style;
  if (diff > 0)
    add_style = "red";
  else
    add_style = "blue";

  var html = "<tr><td scope='row' data-label='코인' class='center'>" + data.market.substr(4) + "</td>";
      html += "<td data-label='시세' class='right'>" + price.toLocaleString() + " 원 </td>";
      html += "<td data-label='변동률 (%)' class='right " + add_style +"'>" + diff.toLocaleString() + " 원 (" + ratio + "%)</td>";
      html += "<td data-label='거래금액' class='right'>" + trade.toLocaleString() + " 억원 </td>";
      html += "</tr>";
  return html;
}

function unix_to_date(unixtime){
  var t = unixtime / 1000;
   var a = new Date(t * 1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = year + '.' + month + '.' + date + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

window.addEventListener(`dragover`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);

window.addEventListener(`drop`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);

function tab_change(tab) {
  active_exchange = tab;
  getData();
}

document.addEventListener('DOMContentLoaded', function () {
	var bithumb = document.getElementById('bithumb');
	var upbit = document.getElementById('upbit');
	bithumb.onclick = function() { tab_change('bithumb'); }
	upbit.onclick = function() { tab_change('upbit'); }
});