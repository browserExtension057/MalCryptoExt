
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Chromium Background Tools                                             }
//                                                                             }
//       Copyright (C) 2018 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {
  
'use strict';

var spLog = spRequire('spLog').spLog;
var spStrings = spRequire('spStrings').spStrings;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;



// TspWebStorage ---------------------------------------------------------------

function TspWebStorage()
{
  // do nothing
}

TspWebStorage.prototype.get = function (AKey, AResultCallback)
{
  var value = undefined;
  try
  {
    value = localStorage[AKey];
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.get() Error: ' + ErrorMessage);
  }
  if (AResultCallback)
    AResultCallback(value);
};

TspWebStorage.prototype.set = function (AKey, AValue)
{
  try
  {
    localStorage[AKey] = AValue;
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.set() Error: ' + ErrorMessage);
  }
};

TspWebStorage.prototype.remove = function (AKey)
{
  try
  {
    delete localStorage[AKey];
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.remove() Error: ' + ErrorMessage);
  }
};



// TspChromiumStorage ----------------------------------------------------------

function TspChromiumStorage()
{
  // do nothing
}

TspChromiumStorage.prototype.get = function (AKey, AResultCallback)
{
  var value = undefined;
  try
  {
    // try to load old data from WebStorage
    try
    {
      value = localStorage[AKey];
      if (value)
      {
        this.set(AKey, value);
        delete localStorage[AKey];
        if (AResultCallback)
          AResultCallback(value);
        return;
      }
    }
    catch (ErrorMessage)
    {
      // ?? spLog.logError(this.constructor.name + '.get() Error loading data from WebStorage: ' + ErrorMessage);
    }

    chrome.storage.local.get(AKey, function(item) {
      if (item)
        value = item[AKey];
      if (AResultCallback)
        AResultCallback(value);
    });
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.get() Error: ' + ErrorMessage);
  }
};

TspChromiumStorage.prototype.set = function (AKey, AValue)
{
  try
  {
    var item = {};
    item[AKey] = AValue;
    chrome.storage.local.set(item);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.set() Error: ' + ErrorMessage);
  }
};

TspChromiumStorage.prototype.remove = function (AKey)
{
  try
  {
    chrome.storage.local.remove(AKey);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.remove() Error: ' + ErrorMessage);
  }
};



const spBackgroundTools =
{
  CreateExtensionStorage: function ()
  {
    try
    {
      // Firefox has issue: the Web Storage API doesn't work for extension if Cookies storing is denied,
      // got "SecurityError: The operation is insecure." message while accessing localStorage.
      var browserClientName = spAutofillCore.Tools.GetBrowserClientName();
      if (browserClientName == spAutofillCore.Tools.BrowserClientName.Firefox)
        return new TspChromiumStorage();
    }
    catch (ErrorMessage)
    {
      spLog.logError(this.constructor.name + '.CreateExtensionStorage() Error: ' + ErrorMessage);
    }
      
    return new TspWebStorage();
  },

  ExecuteUrl: function (AUrl, AInActiveTab, AReusedTabCallback)
  {
    function _isBlankTab(tab)
    {
      if (tab)
      {
        if (spStrings.SameText(tab.url, 'about:blank') ||
            spStrings.SameText(tab.url, 'chrome://newtab/')
           )
        {
          return true;
        }
      }
      return false;
    }

    try
    {
      chrome.tabs.query({currentWindow: true}, function (tabs) {
        var blankTab = null;
        // AInActiveTab means, that we should close all opened tabs (used for autofill testing)
        if (!AInActiveTab)
        {
          // check each tab for our AUrl
          for (var i = 0, lenTabs = tabs.length; i < lenTabs; i++)
          {
            var tab = tabs[i];
            if (_isBlankTab(tab))
            {
              // tab is blank - store it
              blankTab = tab;
            } 
            else if (spStrings.SameText(tab.url, AUrl) ||
                     spStrings.SameText(tab.url, AUrl + '/')
                    )
            {
              // the AUrl is already opened, just activate this tab
              chrome.tabs.update(tab.id, {active: true});
              if (AReusedTabCallback)
                AReusedTabCallback(tab);
              return;
            }
          }
        }
        if (blankTab)
        {
          // select blank tab and navigate AUrl in it
          chrome.tabs.update(blankTab.id, {active: true, url: AUrl});
        }
        else
        {
          // open AUrl in new tab
          chrome.tabs.create({url: AUrl}, function (createdTab) {
            if (AInActiveTab)
            try
            {
              // we should close all opened tabs (used for autofill testing)
              for (var i = 0, lenTabs = tabs.length; i < lenTabs; i++)
              {
                var tab = tabs[i];
                chrome.tabs.remove(tab.id);
              }
            }
            catch (ErrorMessage)
            {
              spLog.logError(this.constructor.name + '.ExecuteUrl() Error closing tabs: ' + ErrorMessage);
            }
          });
        }
      });
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError(this.constructor.name + '.ExecuteUrl() Error: ' + ErrorMessage);
    }
    return false;
  }
}



var __exports = {};
__exports.spBackgroundTools = spBackgroundTools;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spBackgroundTools', __exports);

})();