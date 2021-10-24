// TspPopupView ----------------------------------------------------------------

function TspPopupView()
{
  // empty
}

TspPopupView.prototype =
{
  Initialize: function()
  {
    // localize controls
    document.getElementById('NotInstalledNotify').innerHTML = chrome.i18n.getMessage('NotInstalledNotify');
  }
}

var spPopupView = new TspPopupView();

document.addEventListener('DOMContentLoaded', function () {
  spPopupView.Initialize();
});