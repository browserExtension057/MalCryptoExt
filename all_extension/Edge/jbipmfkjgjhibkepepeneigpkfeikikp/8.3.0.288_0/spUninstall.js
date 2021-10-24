
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Uninstall engine                                                      }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

// Microsoft Edge support
if (typeof browser != 'undefined')
  chrome = browser;

(function() {

'use strict';

var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;



// TspExtensionUninstallView ---------------------------------------------------

function TspExtensionUninstallView()
{
  // empty
}

TspExtensionUninstallView.prototype =
{
  Initialize: function()
  {
    //   localize controls
    try
    {
      var s = chrome.i18n.getMessage('UninstallAutofillPlugin');
      document.title = s;
      this.SetElementInnerHTML('lblHeader', s);
    }
    catch (e)
    {
      // keep silence
    }
  },
  
  Uninstall: function()
  {
    this.Initialize();

    try
    {
      // try to uninstall extension
      if (chrome.management.uninstallSelf)
      {
        this.ShowAutoUninstallingMessage();
        var Self = this;
        var cancelCallback = function () {
          // this event handler is called when user canceled the uninstall operation
          Self.ShowDivManualUninstall();
        };
        var options = { showConfirmDialog: false };
        var browserClientName = spAutofillCore.Tools.GetBrowserClientName();
        if (browserClientName == spAutofillCore.Tools.BrowserClientName.Firefox)
        {
          // Firefox implementation
          var uninstalling = chrome.management.uninstallSelf(options);
          if (uninstalling)
            uninstalling.then(null, cancelCallback);
          else
            cancelCallback();
        }
        else
        {
          // default Chromium implementation
          chrome.management.uninstallSelf(options, cancelCallback);
        }
      }
      else
      {
        // chrome.management.uninstallSelf is undefined
        this.ShowDivManualUninstallEx('chrome.management.uninstallSelf is undefined');
      }
    }
    catch (ErrorMessage)
    {
      // error uninstalling extension
      this.ShowDivManualUninstallEx(ErrorMessage);
    }
  },
  
  SetElementInnerHTML: function(AElementID, AValue)
  {
    document.getElementById(AElementID).innerHTML = AValue;
  },
  
  ShowAutoUninstallingMessage: function()
  {
    var s = chrome.i18n.getMessage('AutoUninstallingMessage');
    this.SetElementInnerHTML('divUninstallAction', s);
  },

  ShowDivManualUninstall: function()
  {
    var s = chrome.i18n.getMessage('ManualUninstallMessage');    
    this.SetElementInnerHTML('divUninstallAction', s);
  },
  
  ShowDivManualUninstallEx: function(AErrorMessage)
  {
    var s = chrome.i18n.getMessage('AutoUninstallErrorMessage');
    this.SetElementInnerHTML('lblErrorMessage', s);
    document.getElementById('memErrorMessage').value = AErrorMessage;
    var div = document.getElementById('divErrorMessage');
    div.style.display = 'block';
    
    this.ShowDivManualUninstall();
  }
}



var spExtensionUninstallView = new TspExtensionUninstallView();

document.addEventListener('DOMContentLoaded', function () {
  spExtensionUninstallView.Uninstall();  
});

})();