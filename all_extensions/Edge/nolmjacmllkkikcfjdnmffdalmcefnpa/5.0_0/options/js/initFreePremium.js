var prodButPrefix = "btnProdID-";

$(window).ready(function(){
	$("[id='appVersion']").text(chrome.runtime.getManifest().version);
	$("[id='appName']").text(chrome.runtime.getManifest().name);
	document.title = chrome.runtime.getManifest().name;
	document.getElementById('chromeSignIn').addEventListener('click', openChromeFlagsTab);
	if ($('#infowebsite')) {
		$('#infowebsite').attr('href', chrome.i18n.getMessage("chrome_extension_link"));
	}
	
	var row = $("<tr style='background-color: #bdd4fd8a !important;'></tr>");
	var colName = $("<td></td>").text("Unlock Premium Content 💰");
	var colDesc = $("<td></td>").text("Just install 2 or more of our FREE extensions 💻 and automatically unlock this: Window Screenshots 📷 Incognito 👻 High-Res Video/Image Downloads 💾 and many more 🚀⚓");
	var colPrice = $("<td style='font-weight: 600;'></td>").text("Free");
	var butAct = $("<button type='button'></button>")
	.data("sku", "premium_unlock")
	.attr("id", prodButPrefix + "premium_unlock")
	.addClass("btn btn-sm")
	.click(onActionButtonFreePremium)
	.text("Get extensions")
	.addClass("btn-success");
	var colBut = $("<td></td>").append(butAct);
	row
	.append(colName)
	.append(colDesc)
	.append(colPrice)
	.append(colBut);
	$("#inAppPayment").append(row);
	$("#load").hide();
	$("#infoPremiumWebsite").text(i18n.get("premium-features-click"));

	checkFreemium();
	
});

function checkFreemium() {
	chrome.runtime.sendMessage({ hasFreemiumActive: "status" }, function (response) {
	    if (response != null && response.hasFreemiumActive === "true") {
	        var butAction = $("#" + prodButPrefix + "premium_unlock");
	        butAction
              .text("Installed")
              .removeClass("btn-success")
              .removeClass("btn-default")
              .addClass("btn-info")
			  .removeData("sku")
              .data("license", "Unlock Premium Content: You have 2+ of our extensions installed");
	    } else if (response == null || response.hasFreemiumActive === "false") {
			var butAction = $("#" + prodButPrefix + "premium_unlock");
	        butAction
              .text("Get extensions")
              .removeClass("btn-info")
              .addClass("btn btn-sm btn-success")
			  .removeData("license")
              .data("sku", "premium_unlock");
		}
	});
	setTimeout(checkFreemium,5000);
}

function onActionButtonFreePremium(evt) {
  //console.log("onActionButton", evt);
  var actionButton = $(evt.currentTarget);
  if (actionButton.data("license")) {
    showFreePremium(actionButton.data("license"));
  } else {
    var sku = actionButton.data("sku");
    buyFreePremium(sku);
  }
}

function showFreePremium(license) {
  var modal = $("#modalLicense");
  modal.find(".license").text(JSON.stringify(license, null, 2));
  modal.modal('show');
}

function buyFreePremium(sku) {
	updateStatusDiv("Kicking off flow", "Item: " + sku);
	window.open(chrome.i18n.getMessage("chrome_extension_download_all_link"));
}

function updateStatusDiv(method,output) {
    $("#status").text(method + " - " + output);
}

function openChromeFlagsTab() {
  chrome.tabs.create({url: "chrome://chrome-signin"});
}