
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Chromium Background Module                                            }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

// Microsoft Edge support
if (typeof browser != 'undefined')
  chrome = browser;

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;
spLog.setProductName('Sticky Password');
var spStrings = spRequire('spStrings').spStrings;
var spFormElementPrototype = spRequire('spFormElementPrototype').spFormElementPrototype;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;
var spBackgroundTools = spRequire('spBackgroundTools').spBackgroundTools;
var spCommonBackgroundTools = spRequire('spCommonBackgroundTools').spCommonBackgroundTools;
var spCustomHost = spRequire('spCustomHost').spCustomHost;
var spTransportProtocol = spRequire('spTransportProtocol').spTransportProtocol;



// TspNativeHost ---------------------------------------------------------------

var TspCustomHost = spCustomHost.TspCustomHost;

function TspNativeHost()
{
  this.nmhPort = null;

  TspCustomHost.apply(this, arguments); // inherited call
}

TspNativeHost.prototype = Object.create(TspCustomHost.prototype);

TspNativeHost.prototype.constructor = TspNativeHost;

TspNativeHost.prototype.destroyHost = function()
{
  this.nmhPort = null; // clear the port variable
};

TspNativeHost.prototype.postMessage = function(message)
{
  this.nmhPort.postMessage(message);
};

TspNativeHost.prototype.IsAvailable = function()
{
  return this.nmhPort != null;
};

TspNativeHost.prototype.Connect = function()
{
  try
  {
    TspCustomHost.prototype.Connect.apply(this, arguments); // inherited call

    // create the connection to the Native Message Host application
    var hostName = 'com.Sticky Password';
    // WARNING: Host name should be in lower case and without spaces!
    hostName = hostName.toLowerCase();
    hostName = hostName.replace(/ /g, '_');
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.Connect() Try to connect to NMH name <' + hostName + '>.');
    this.nmhPort = chrome.runtime.connectNative(hostName);
    this.nmhPort.onDisconnect.addListener(function() {
      this.hstOnDisconnected(chrome.runtime.lastError.message);
    }.bind(this));
    this.nmhPort.onMessage.addListener(this.hstOnMessage.bind(this));
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Connect() Error: ' + ErrorMessage);
  }
};



// TspBackground ---------------------------------------------------------------

function TspBackground()
{
  this.Log = {
    // log modes
    Info: false,
    TransportMessages: false,
    IncompleteDOMXml: false,
    OnTabSelect: false,
    Popup: false
  };

  this.IncompleteMessageCacheManager = spCommonBackgroundTools.CreateIncompleteMessageCacheManager();
  this.IncompleteMessageCacheManager.OnProcessLifeEndedItemCallback = function (AItem)
  {
    if (AItem && AItem.Message && AItem.sender)
      this.ProcessContentMessage(AItem.Message, AItem.sender);
  }.bind(this);

  this.PasswordManagerConfiguration = {};
  this.DebugMinigui = false;
  this.UseMinigui = null;
  this.IsPasswordManagerLocked = null;
  this.DOMXmlLockedUsageEvents = {};

  this.ExtensionStorage = spBackgroundTools.CreateExtensionStorage();

  this.MiniguiPopupTransport = spCommonBackgroundTools.CreateMiniguiPopupTransport();
  this.MiniguiPopupTransport.onGetPopupWindow = this.mgOnGetPopupWindow.bind(this);

  this.Host = new TspNativeHost();
  this.Host.onProtocolOutdated = this.hstOnProtocolOutdated.bind(this);
  this.Host.onNotInitialized = this.hstOnNotInitialized.bind(this);
  this.Host.onInitialized = this.hstOnInitialized.bind(this);

  this.TransportProtocol = spTransportProtocol.CreateTransportProtocol();
  this.TransportProtocol.Host = this.Host;
  this.TransportProtocol.ExtensionStorage = this.ExtensionStorage;
  this.TransportProtocol.MiniguiPopupTransport = this.MiniguiPopupTransport;
  this.TransportProtocol.onChangeProtocolState = this.tsOnChangeProtocolState.bind(this);
  this.TransportProtocol.onDisconnect = this.tsOnDisconnect.bind(this);
  this.TransportProtocol.onMessage = this.tsOnMessage.bind(this);
  this.TransportProtocol.onGetActiveWindowInfo = this.tsOnGetActiveWindowInfo.bind(this);
  this.TransportProtocol.onMiniguiLoad = this.tsOnMiniguiLoad.bind(this);

  this.LoadPasswordManagerConfiguration();
  this.SetPasswordManagerLocked(true);
  this.TransportProtocol.Start();

  // connect to Content scripts
  chrome.runtime.onMessage.addListener(this.csOnMessage.bind(this));
  // event handler for clicking on Caption Button
  chrome.browserAction.onClicked.addListener(this.ProcessCaptionButtonClick.bind(this));
  // connect to tabs
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    if (chrome.runtime.lastError || !activeInfo)
      return;
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      if (chrome.runtime.lastError || !tab)
        return;
      this.TabSelected(tab);
    }.bind(this));
  }.bind(this));
  var browserClientName = spAutofillCore.Tools.GetBrowserClientName();
  if (browserClientName == spAutofillCore.Tools.BrowserClientName.Firefox)
  {
    // Firefox uses random internal extension ID within moz-extension:// protocol,
    // therefore immidiately redirect the external uninstall page to internal one
    var processUninstallPage = function (tab) {
      if (!tab)
        return;
      if (tab.url && spStrings.SearchText('autofill.xpi.uninstall.html', tab.url))
      {
        var Url = 'moz-extension://' + chrome.i18n.getMessage('@@extension_id') + '/spUninstall.html';
        chrome.tabs.update(tab.id, { url: Url });
      }
    };
    chrome.tabs.onUpdated.addListener(function(tabId, tab) {
      if (chrome.runtime.lastError)
        return;
      processUninstallPage(tab);
    });
    chrome.tabs.onCreated.addListener(function(tab) {
      if (chrome.runtime.lastError)
        return;
      processUninstallPage(tab);
    });
    // sometimes tab is already opened
    chrome.tabs.query({ active: true }, function (tabs) {
      if (!tabs || !tabs.length)
        return;
      var tab = tabs[0];
      processUninstallPage(tab);
    });
  }
}

TspBackground.prototype.LoadPasswordManagerConfiguration = function ()
{
  this.PasswordManagerConfiguration = {};
  this.ExtensionStorage.get('PasswordManagerConfiguration', function (APasswordManagerConfiguration) {
    if (typeof APasswordManagerConfiguration != 'undefined')
    try
    {
      this.PasswordManagerConfiguration = JSON.parse(APasswordManagerConfiguration);
    }
    catch (ErrorMessage)
    {
      spLog.logError(this.constructor.name + '() Error parsing PasswordManagerConfiguration: ' + ErrorMessage);
    }
  }.bind(this));
};

TspBackground.prototype.SavePasswordManagerConfiguration = function (APasswordManagerConfiguration)
{
  if (!APasswordManagerConfiguration)
    return;
  this.PasswordManagerConfiguration = APasswordManagerConfiguration;
  this.ExtensionStorage.set('PasswordManagerConfiguration', JSON.stringify(APasswordManagerConfiguration));
};

TspBackground.prototype.mgOnGetPopupWindow = function ()
{
  return this.GetPopupWindow();
};

TspBackground.prototype.hstOnProtocolOutdated = function ()
{
  chrome.browserAction.setPopup({popup: 'spProtocolIncompatible.html'});
  chrome.browserAction.setBadgeText({text: 'x'}); // show 'error' sub icon over main one
};
  
TspBackground.prototype.hstOnNotInitialized = function (wasInitialized)
{
  if (wasInitialized)
  {
    // SP is installed - reset the default popup and use Caption Button
    //   assume the host has been terminated during update, allow to relaunch it again
    chrome.browserAction.setPopup({popup: ''});
    chrome.browserAction.setBadgeText({text: ''}); // reset sub icon over main one (if any error occured before)
  }
  else
  {
    // SP is not installed - initialize the default popup
    chrome.browserAction.setPopup({popup: 'spPopup.html'});
    if (this.Host.Log.Connect)
      chrome.browserAction.setBadgeText({text: 'x'}); // used for debug purposes
  }
};

TspBackground.prototype.hstOnInitialized = function ()
{
  // SP is installed - reset the default popup and use Caption Button
  this.UpdatePopupIfHostInitialized();
  chrome.browserAction.setBadgeText({text: ''}); // reset sub icon over main one (if any error occured before)
};

TspBackground.prototype.UpdatePopupIfHostInitialized = function ()
{
  if (this.Host.IsInitialized())
  {
    // if transport is authenticated - use minigui,
    // otherwise allow to launch the product using the host
    if (this.UseMinigui &&
        !this.IsPasswordManagerLocked &&
        this.TransportProtocol.IsAvailable() &&
        this.TransportProtocol.IsAuthenticated()
       )
      chrome.browserAction.setPopup({popup: 'minigui/index.html'});
    else
      chrome.browserAction.setPopup({popup: ''});
  }
};

TspBackground.prototype.AttachToPopupEvents = function (APopupWindow)
{
  if (APopupWindow)
  {
    if (this.DebugMinigui)
      return true;

    if (typeof APopupWindow.addEventListener == 'function')
    {
      var useCapture = false; // WARNING: Force use false to prevent closing the Minigui during tab changed!
      APopupWindow.addEventListener('blur', function _onBlur(event) {
        APopupWindow.removeEventListener('blur', _onBlur, useCapture);
        this.ProcessPopupBlur(APopupWindow);
      }.bind(this), useCapture);
      if (this.Log.Popup)
        spLog.logMessage(this.constructor.name + '.AttachToPopupEvents() Popup events attached');
      return true;
    }
  }
  return false;
};

TspBackground.prototype.ProcessPopupBlur = function (APopupWindow)
{
  try
  {
    if (this.Log.Popup)
      spLog.logMessage(this.constructor.name + '.ProcessPopupBlur() Popup onblur fired');
    if (APopupWindow)
      APopupWindow.close();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ProcessPopupBlur() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.GetPopupWindow = function ()
{
  try
  {
    var views = chrome.extension.getViews({ type: 'popup' });
    if (views && views.length)
      return views[0];
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.GetPopupWindow() Error: ' + ErrorMessage);
  }
  return null;
};

TspBackground.prototype.ClosePopupWindow = function ()
{
  try
  {
    if (this.Log.Popup)
      spLog.logMessage(this.constructor.name + '.ClosePopupWindow() Popup closing...');
    var popupWindow = this.GetPopupWindow();
    if (popupWindow)
      popupWindow.close();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ClosePopupWindow() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.PostMessageToTransport = function (message)
{
  var allowReconnectTransport = message.allowReconnectTransport;
  delete message.allowReconnectTransport;
  if (message)
    this.TransportProtocol.PostMessage(message, allowReconnectTransport);
};

TspBackground.prototype.PostTabMessageToTransport = function (message, senderTab)
{
  if (!message || !senderTab)
    return;

  chrome.windows.get(senderTab.windowId,
    function(window)
    {
      if (!window)
        return;
      // add additional info about senderTab
      message.tabId = senderTab.id; // append tab.id to message to allow process async message answer later

      if (senderTab.active)
      {
        var selectedTab = senderTab;
        this.AppendActiveWindowInfoToMessage(message, selectedTab, window); // append selected tab & window info to allow find the web browser window
        this.PostMessageToTransport(message);
      }
      else
      {
        chrome.tabs.query({active: true, windowId: window.id},
          function (tabs)
          {
            if (tabs && tabs.length > 0)
            {
              var selectedTab = tabs[0];
              this.AppendActiveWindowInfoToMessage(message, selectedTab, window); // append selected tab & window info to allow find the web browser window
              this.PostMessageToTransport(message);
            }
          }.bind(this)
        );
      }
    }.bind(this)
  );
};

TspBackground.prototype.tsOnChangeProtocolState = function ()
{
  this.UpdatePopupIfHostInitialized();
};

TspBackground.prototype.tsOnDisconnect = function ()
{
  // notify the GUI that product is locked
  this.SetPasswordManagerLocked(true);
};

TspBackground.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    var GuestAuthenticatingMessages = ['DOMXmlLockedUsageChanged', 'AutofillDocument'];
    if (!message.Action in GuestAuthenticatingMessages &&
        this.TransportProtocol.IsGuestAuthenticating())
    {
      if (this.Log.TransportMessages)
        spLog.logError(this.constructor.name + '.tsOnMessage() Received unexpected message: <' + message.Action + '>');
      return;
    }

    if (message.Action == 'SetPasswordManagerConfiguration')
      this.tsSetPasswordManagerConfiguration(message);
    else if (message.Action == 'SetUseMinigui')
      this.tsSetUseMinigui(message);
    else if (message.Action == 'PasswordManagerLockedChanged')
      this.tsPasswordManagerLockedChanged(message);
    else if (message.Action == 'DOMXmlLockedUsageChanged')
      this.tsDOMXmlLockedUsageChanged(message);
    else if (message.Action == 'AutofillDocument')
      this.tsAutofillDocument(message);
    else if (message.Action == 'GetUrl')
      this.tsGetUrl(message);
    else if (message.Action == 'ExecuteUrl')
      this.tsExecuteUrl(message);
    else if (message.Action == 'SetFocusedElementSelectedText')
      this.tsSetFocusedElementSelectedText(message);
    else
      this.SendMessageToTab(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.tsOnGetActiveWindowInfo = function (AWindowInfo, AResultCallback)
{
  if (!AWindowInfo)
    return;
  if (!AResultCallback)
    return;

  // append selected tab & window info to allow find the web browser window
  chrome.tabs.query({active: true, currentWindow: true},
    function (tabs)
    {
      if (chrome.runtime.lastError || !tabs || !tabs.length)
      {
        AResultCallback();
        return;
      }
      var activeTab = tabs[0];
      AWindowInfo.WindowTabUrl = activeTab.url;
      chrome.windows.get(activeTab.windowId,
        function(window)
        {
          if (chrome.runtime.lastError || !window)
          {
            AResultCallback();
            return;
          }
          this.AppendActiveWindowInfoToMessage(AWindowInfo, activeTab, window);
          AResultCallback();
        }.bind(this)
      );
    }.bind(this)
  );
};

TspBackground.prototype.tsOnMiniguiLoad = function ()
{
  // force close any balloon while Minigui appears
  var message = {};
  message.Action = 'HideShowedCaptionButtonBalloon';
  this.PostMessageToTransport(message);

  // automatically close the Minigui onblur
  var popupWindow = this.GetPopupWindow();
  this.AttachToPopupEvents(popupWindow);
};

TspBackground.prototype.tsSetPasswordManagerConfiguration = function (message)
{
  if (message)
  try
  {
    if (this.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsSetPasswordManagerConfiguration() Set Password Manager configuration: ' + JSON.stringify(message.Configuration));
    this.SavePasswordManagerConfiguration(message.Configuration);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsSetPasswordManagerConfiguration() Error: ' + ErrorMessage);
  }
};
  
TspBackground.prototype.tsSetUseMinigui = function (message)
{
  if (message)
  try
  {
    if (this.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsSetUseMinigui() Set Minigui usage: ' + message.UseMinigui);
    this.UseMinigui = message.UseMinigui;
    this.UpdatePopupIfHostInitialized();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsSetUseMinigui() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.SetPasswordManagerLocked = function (AIsLocked)
{
  var message = {};
  message.Action = 'PasswordManagerLockedChanged';
  message.IsLocked = AIsLocked;
  this.tsPasswordManagerLockedChanged(message);
};

TspBackground.prototype.tsPasswordManagerLockedChanged = function (message)
{
  try
  {
    if (this.IsPasswordManagerLocked != message.IsLocked)
    {
      if (this.Log.Info)
        spLog.logMessage(this.constructor.name + '.tsPasswordManagerLockedChanged() IsLocked: ' + message.IsLocked);
      this.IsPasswordManagerLocked = message.IsLocked;
      this.UpdatePopupIfHostInitialized();
      if (!this.IsPasswordManagerLocked)
        chrome.browserAction.setIcon({
          path: {
            '16': 'skin/logo16.png',
            '20': 'skin/logo20.png',
            '32': 'skin/logo32.png'
          }
        });
      else
        chrome.browserAction.setIcon({
          path: {
            '16': 'skin/logo16-disabled.png',
            '20': 'skin/logo20-disabled.png',
            '32': 'skin/logo32-disabled.png',
          }
        });
      if (this.IsPasswordManagerLocked)
        this.ClosePopupWindow();
      this.BroadcastMessageToTabs(message);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsPasswordManagerLockedChanged() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.tsDOMXmlLockedUsageChanged = function (message)
{
  try
  {
    if (message.Events && this.DOMXmlLockedUsageEvents != message.Events)
    {
      if (this.Log.Info)
        spLog.logMessage(this.constructor.name + '.tsDOMXmlLockedUsageChanged() Events: ' + JSON.stringify(message.Events));
      this.DOMXmlLockedUsageEvents = message.Events;
      this.BroadcastMessageToTabs(message);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsDOMXmlLockedUsageChanged() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.tsAutofillDocument = function (message)
{
  if (message)
  try
  {
    message.tabId = parseInt(message.tabId);
    var autofillXmlParser = spAutofillCore.CreateCrossOriginAutofillXmlParser();
    autofillXmlParser.LoadFromXml(message.AutofillXml);
    this.DecryptSensitiveDataInAutofillXml(autofillXmlParser);
    var autofillInfo = new Object();
    while (autofillXmlParser.ExtractNextAutofillPart(autofillInfo))
    {
      message.AutofillXml = autofillInfo.AutofillXml;
      this.SendMessageToTab(message, message.tabId, autofillInfo.frameId);
      autofillInfo = new Object();
    };
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsAutofillDocument() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.tsGetUrl = function (message)
{
  if (message)
  try
  {
    if (this.Log.Info)
      spLog.logMessage(this.constructor.name + '.bsGetUrl()');
    chrome.tabs.query({active: true, currentWindow: true},
      function (tabs)
      {
        if (chrome.runtime.lastError || !tabs || !tabs.length)
        {
          this.PostMessageToTransport(message);
          return;
        }
        var activeTab = tabs[0];
        message.Url = activeTab.url;
        if (this.Log.Info)
          spLog.logMessage('   Url: <' + message.Url + '>');
        this.PostMessageToTransport(message);
      }.bind(this)
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsGetUrl() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.tsExecuteUrl = function(message)
{
  if (!message)
    return;
  if (this.Log.Info)
    spLog.logMessage(this.constructor.name + '.ExecuteUrl(), Url: <' + message.Url + '>');
  var Result = spBackgroundTools.ExecuteUrl(message.Url, false, // InActiveTab
    function (AReusedTab)
    {
      if (!AReusedTab)
        return;
      if (this.Log.Info)
        spLog.logMessage(this.constructor.name + '.ExecuteUrl() tab reused, simulate PageLoaded event');
      // call autofill if tab with executing Url has been used
      var msgSimulatePageLoaded = { Action: 'SimulatePageLoaded' };
      this.SendMessageToTab(msgSimulatePageLoaded, AReusedTab.id);
    }.bind(this)
  );
  // return the result of message processing
  message.Result = Result;
  message.Url = ''; // clear Url to prevent additional resources usage
  this.PostMessageToTransport(message);
};

TspBackground.prototype.tsSetFocusedElementSelectedText = function(message)
{
  message.RTID = spAutofillCore.Tools.GenerateRTID();
  this.IncompleteMessageCacheManager.Put(message.RTID, message);
  this.SendMessageToTab(message, -1 /* active tab */, 0 /* top window */, function (AResponseMessage) {
    if (AResponseMessage)
    {
      if (AResponseMessage.MessageProcessed)
        this.IncompleteMessageCacheManager.Remove(message.RTID);
    }
    else
    {
      // any sending error occured
      this.IncompleteMessageCacheManager.Remove(message.RTID);
    }
  }.bind(this));
};

TspBackground.prototype.PasswordManagerNotStarted = function ()
{
  this.TransportProtocol.ResetConnectionAttempts(); // reset the attempts to speedup the connection

  this.Host.LaunchPasswordManager();
};

TspBackground.prototype.ExtensionNotAuthenticated = function ()
{
  chrome.notifications.create({
    type: 'basic',
    title: 'Sticky Password',
    message: chrome.i18n.getMessage('ExtensionNotAuthenticatedNotify'),
    iconUrl: 'skin/logo48.png'
  });
};

TspBackground.prototype.csOnMessage = function(message, sender, sendResponse)
{
  var _sendResponse = function ()
  {
    try
    {
      if (sendResponse)
        sendResponse({});
    }
    catch (ErrorMessage)
    {
      spLog.logError(this.constructor.name + '.csOnMessage() sendResponse Error: ' + ErrorMessage);
    }
  };

  // 1. process message from Content Script only if transport connection initialized
  if (message && sender)
  try
  {
    if (this.Log.TransportMessages)
      this.csLogTransportMessage(message, sender);

    if (sender.tab)
    {
      // always process this messages despite the transport state
      if (message.Action == 'GetBackgroundWindowWidth')
        return this.csGetBackgroundWindowWidth(message, sender, sender.tab, sendResponse);
      else if (message.Action == 'GetDOMXmlLockedUsage')
        return this.csGetDOMXmlLockedUsage(message, sender, sender.tab, sendResponse);
      else if (message.Action == 'GetPasswordManagerConfiguration')
        return this.csGetPasswordManagerConfiguration(message, sender, sender.tab, sendResponse);
      else if (message.Action == 'CrossOriginPageLoaded')
        return this.csCrossOriginPageLoaded(message, sender, sender.tab, sendResponse);

      if (!this.TransportProtocol.IsConnected())
      {
        if (message.Action == 'ContextButtonClicked')
        {
          this.PasswordManagerNotStarted();
          
          message.allowReconnectTransport = true;
          this.PostTabMessageToTransport(message, sender.tab);
        }
      }
      else if (!this.TransportProtocol.IsAuthenticated() && 
               !this.TransportProtocol.IsGuestAuthenticating())
      {
        if (message.Action == 'ContextButtonClicked')
          this.ExtensionNotAuthenticated();
      }
      else
      {
        if (message.Action == 'ReturnForbiddenDOMXml')
        {
          var messageToProcess = { message: null };
          this.csReturnForbiddenDOMXml(message, sender, messageToProcess);
          if (messageToProcess.message)
          {
            message = messageToProcess.message;
            // log cached message and process it
            if (this.Log.TransportMessages)
              this.csLogTransportMessage(message, sender);
          }
        }
        else if (this.TryCacheIncompleteDOMXmlMessage(message, sender))
        {
          // skip message processing
          //   always return the response, otherwise we'll got the leaks!
          _sendResponse();
          return;
        }

        this.ProcessContentMessage(message, sender);
      };
    }
    else
    {
      // this messages are sent not from a tab but from a popup!
      if (message.Action == 'GetProtocolOutdateInfo')
        return this.csGetProtocolOutdateInfo(message, sendResponse);

      else if (message.Action == 'UpdateHost')
        this.csUpdateHost(message);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.csOnMessage() message.Action: "' + message.Action + '" Error: ' + ErrorMessage);
  }
  
  // 2. always return the response, otherwise we'll got the leaks!
  _sendResponse();
};

TspBackground.prototype.ProcessContentMessage = function(message, sender)
{
  if (message && sender && sender.tab)
  try
  {
    var GuestAuthenticatingMessages = ['PageLoaded', 'ElementFocused', 'ContextButtonClicked'];
    if (!message.Action in GuestAuthenticatingMessages &&
        this.TransportProtocol.IsGuestAuthenticating())
    {
      if (this.Log.TransportMessages)
        spLog.logError(this.constructor.name + '.ProcessContentMessage() Received unexpected message: <' + message.Action + '>');
      return;
    }

    // PageLoaded()
    if (message.Action == 'PageLoaded')
      this.csPageLoaded(message, sender.tab);

    // PageSubmitted()
    else if (message.Action == 'PageSubmitted')
      this.csPageSubmitted(message, sender, sender.tab);

    // GetDOMXml()
    else if (message.Action == 'GetDOMXml')
      this.csGetDOMXml(message, sender.tab);

    // GetFocusedElementScreenRect()
    else if (message.Action == 'GetFocusedElementScreenRect')
      this.csGetFocusedElementScreenRect(message, sender.tab);

    // ElementFocused()
    else if (message.Action == 'ElementFocused')
      this.csElementFocused(message, sender, sender.tab);

    // HideShowedCaptionButtonBalloon()
    else if (message.Action == 'HideShowedCaptionButtonBalloon')
      this.csHideShowedCaptionButtonBalloon(message, sender.tab);

    // ContextButtonClicked()
    else if (message.Action == 'ContextButtonClicked')
      this.csContextButtonClicked(message, sender, sender.tab);

    // GetCachedMessage()
    else if (message.Action == 'GetCachedMessage')
      this.csGetCachedMessage(message, sender, sender.tab);     
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ProcessContentMessage() message.Action: "' + message.Action + '" Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.csLogTransportMessage = function(message, sender)
{
  if (message)
  try
  {
    var s = this.constructor.name + '.csOnMessage() Received message from CS: ' + JSON.stringify(message);
    if (sender)
    {
      if (sender.tab)
        s = s + ' sender.windowId=' + sender.tab.windowId + ' sender.tabId=' + sender.tab.id;
      s = s + ' sender.frameId=' + sender.frameId;
      s = s + ' sender.url=<' + sender.url + '>';
    }
    spLog.logMessage(s);
  }
  catch (ErrorMessage)
  {
    // keep silence
  }
};

TspBackground.prototype.TryCacheIncompleteDOMXmlMessage = function (message, sender)
{
  if (message && typeof message.DOMXml != 'undefined' && message.DOMXml != '')
  try
  {
    // append frameId to the DOMXml elements
    if (sender && sender.frameId)
    {
      var DOMXmlParser = spAutofillCore.CreateCrossOriginDOMXmlParser();
      if (DOMXmlParser.LoadFromXml(message.DOMXml))
      {
        DOMXmlParser.AppendFrameIDToElementRTIDs(sender.frameId);
        message.DOMXml = DOMXmlParser.SaveToXml();
      }
    }
    var incompleteDOMXmlParser = spAutofillCore.CreateIncompleteDOMXmlParser();
    incompleteDOMXmlParser.LoadFromXml(message.DOMXml);
    if (this.EncryptSensitiveDataInDOMXml(incompleteDOMXmlParser))
      message.DOMXml = incompleteDOMXmlParser.SaveToXml();
    if (!incompleteDOMXmlParser.IsCompleteDOMXml())
    {
      var messageRTID = incompleteDOMXmlParser.RTID;
      if (this.Log.IncompleteDOMXml)
      {
        if (!messageRTID)
          spLog.logError(this.constructor.name + '.TryCacheIncompleteDOMXmlMessage() messageRTID is undefined, ' + 
            'message.Action: "' + message.Action + '"'
          );
        else
          spLog.logMessage(this.constructor.name + '.TryCacheIncompleteDOMXmlMessage() message.DOMXml is incomplete - cache it, ' + 
            'message.Action: "' + message.Action + '", messageRTID=' + messageRTID
          );
      }
      // DOMXml is incomplete (has forbidden documents, etc.), cache the message to process it later
      var cachedItem = this.IncompleteMessageCacheManager.Put(messageRTID, message);
      if (cachedItem)
      {
        cachedItem.sender = sender; // store sender to allow send message from sender in case message life ended
        // skip message processing
        return true;
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.TryCacheIncompleteDOMXmlMessage() Error: ' + ErrorMessage);
  }
  return false;
};

TspBackground.prototype.csReturnForbiddenDOMXml = function (message, sender, AMessageToProcess)
{
  if (message && sender && AMessageToProcess)
  try
  {
    var cachedMessage = this.IncompleteMessageCacheManager.Find(message.RTID);
    if (cachedMessage)
    {
      var cachedDOMXmlParser = spAutofillCore.CreateIncompleteDOMXmlParser();
      cachedDOMXmlParser.LoadFromXml(cachedMessage.DOMXml);
      var newDOMXmlParser = spAutofillCore.CreateCrossOriginDOMXmlParser();
      if (newDOMXmlParser.LoadFromXml(message.DOMXml))
        newDOMXmlParser.AppendFrameIDToElementRTIDs(sender.frameId);
      else
        newDOMXmlParser = null;
      this.EncryptSensitiveDataInDOMXml(newDOMXmlParser);
      cachedDOMXmlParser.ReplaceForbiddenDOMXml(message.ForbiddenXmlDocumentRTID, newDOMXmlParser);
      if (message.IsFocusedWindow)
        cachedDOMXmlParser.ReplaceFocusedElementDOMXml(newDOMXmlParser);
      cachedMessage.DOMXml = cachedDOMXmlParser.SaveToXml();
      if (cachedDOMXmlParser.IsCompleteDOMXml())
      {
        if (this.Log.IncompleteDOMXml)
          spLog.logMessage(this.constructor.name + '.csReturnForbiddenDOMXml() message.DOMXml is complete - process it, ' + 
            'message.Action: "' + cachedMessage.Action + '", messageRTID=' + message.RTID
          );
        this.IncompleteMessageCacheManager.Remove(message.RTID);
        AMessageToProcess.message = cachedMessage;
      }
    }
    else
    {
      if (this.Log.IncompleteDOMXml)
        spLog.logError(this.constructor.name + '.csReturnForbiddenDOMXml() Error searching cached message with RTID: <' + message.RTID + '>');
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.csReturnForbiddenDOMXml() Error: ' + ErrorMessage);
  } 
};

TspBackground.prototype.csGetProtocolOutdateInfo = function (message, sendResponse)
{
  var resultMessage = {};
  resultMessage.IsExtensionProtocolOutdate = this.Host.IsExtensionProtocolOutdate;
  resultMessage.IsHostProtocolOutdate = this.Host.IsHostProtocolOutdate;
  if (sendResponse)
    sendResponse(resultMessage);
};

TspBackground.prototype.csUpdateHost = function (message)
{
  this.Host.UpdateHost();
};

TspBackground.prototype.csPageLoaded = function(message, senderTab)
{
  message.Url = senderTab.url;
  message.IsActiveTab = senderTab.active; // update flag that sender tab is active
  this.PostTabMessageToTransport(message, senderTab);
};

TspBackground.prototype.csPageSubmitted = function(message, sender, senderTab)
{
  this.UpdateTabInfoInMessage(message, sender, senderTab);
  this.PostTabMessageToTransport(message, senderTab);
};

TspBackground.prototype.csCrossOriginPageLoaded = function(message, sender, senderTab, sendResponse)
{
  // resend the message to the top window of sender tab
  this.SendMessageToTab(message, senderTab.id, 0 /* top window */);
  if (sendResponse)
    sendResponse({});
};

TspBackground.prototype.csGetDOMXml = function(message, senderTab)
{
  this.PostTabMessageToTransport(message, senderTab);
};

TspBackground.prototype.csGetFocusedElementScreenRect = function(message, senderTab)
{
  this.PostTabMessageToTransport(message, senderTab);
};

TspBackground.prototype.csElementFocused = function(message, sender, senderTab)
{
  this.FixMessageCrossOriginIssues(message, sender, senderTab,
    function (message, sender, senderTab)
    {
      // offset focused element coords by top window position
      if (message.FocusedElementScreenRect)
      {
        if (message.offsetFrameLeft || message.offsetFrameTop)
        {
          message.FocusedElementScreenRect.left += message.offsetFrameLeft;
          message.FocusedElementScreenRect.top += message.offsetFrameTop;
          message.FocusedElementScreenRect.right += message.offsetFrameLeft;
          message.FocusedElementScreenRect.bottom += message.offsetFrameTop;
        }
      }
      this.UpdateTabInfoInMessage(message, sender, senderTab);
      this.PostTabMessageToTransport(message, senderTab);
    }.bind(this)
  );
};

TspBackground.prototype.csHideShowedCaptionButtonBalloon = function(message, senderTab)
{
  this.PostTabMessageToTransport(message, senderTab);
};

TspBackground.prototype.csContextButtonClicked = function(message, sender, senderTab)
{
  this.FixMessageCrossOriginIssues(message, sender, senderTab,
    function (message, sender, senderTab)
    {
      this.UpdateTabInfoInMessage(message, sender, senderTab);
      this.PostTabMessageToTransport(message, senderTab);
    }.bind(this)
  );
};

TspBackground.prototype.csGetCachedMessage = function(message, sender, senderTab)
{
  if (!message || !sender || !senderTab)
    return;
  var cachedMessage = this.IncompleteMessageCacheManager.Find(message.RTID);
  if (cachedMessage)
  {
    this.SendMessageToTab(cachedMessage, senderTab.id, sender.frameId, function (AResponseMessage) {
      if (AResponseMessage)
      {
        if (AResponseMessage.MessageProcessed)
          this.IncompleteMessageCacheManager.Remove(message.RTID);
      }
      else
      {
        // any sending error occured
        this.IncompleteMessageCacheManager.Remove(message.RTID);
      }
    }.bind(this));
  }
};

TspBackground.prototype.csGetBackgroundWindowWidth = function(message, sender, senderTab, sendResponse)
{
  if (!message || !sender || !senderTab || !sendResponse)
    return;
  chrome.windows.get(senderTab.windowId,
    function(window)
    {
      if (!window)
        return;
      var resultMessage = {};
      resultMessage.BackgroundWindowWidth = window.width;
      sendResponse(resultMessage);
    }
  );
  // keep the sendResponse opened async!
  return true;
};

TspBackground.prototype.csGetDOMXmlLockedUsage = function(message, sender, senderTab, sendResponse)
{
  if (!message || !sender || !senderTab || !sendResponse)
    return;
  var resultMessage = {};
  resultMessage.Action = 'DOMXmlLockedUsageChanged';
  resultMessage.Events = this.DOMXmlLockedUsageEvents;
  sendResponse(resultMessage);
};

TspBackground.prototype.csGetPasswordManagerConfiguration = function(message, sender, senderTab, sendResponse)
{
  if (!message || !sender || !senderTab || !sendResponse)
    return;
  message.Configuration = this.PasswordManagerConfiguration;
  sendResponse(message);
};

TspBackground.prototype.EncryptSensitiveDataInDOMXml = function (ADOMXmlParser)
{
  var Result = false;
  if (ADOMXmlParser)
  try
  {
    if (this.TransportProtocol.AllowProtectSensitiveData())
    {
      var SensitiveDataDOMXmlParser = spAutofillCore.CreateSensitiveDataDOMXmlParser(ADOMXmlParser);
      Result = SensitiveDataDOMXmlParser.EncryptSensitiveData(
        function (APlainData, AEncryptedData)
        {
          return this.TransportProtocol.EncryptSensitiveData(APlainData, AEncryptedData);
        }.bind(this)
      );
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.EncryptSensitiveDataInDOMXml() Error: ' + ErrorMessage);
  }
  return Result;
};

TspBackground.prototype.DecryptSensitiveDataInAutofillXml = function (AAutofillXmlParser)
{
  var Result = false;
  if (AAutofillXmlParser)
  try
  {
    if (this.TransportProtocol.AllowProtectSensitiveData())
    {
      var SensitiveDataAutofillXmlParser = spAutofillCore.CreateSensitiveDataAutofillXmlParser(AAutofillXmlParser);
      Result = SensitiveDataAutofillXmlParser.DecryptSensitiveData(
        function (AEncryptedData, APlainData)
        {
          return this.TransportProtocol.DecryptSensitiveData(AEncryptedData, APlainData);
        }.bind(this)
      );
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.DecryptSensitiveDataInAutofillXml() Error: ' + ErrorMessage);
  }
  return Result;
};

TspBackground.prototype.FixMessageCrossOriginIssues = function(message, sender, senderTab, fixedCallback)
{
  if (senderTab && senderTab.active)
  {
    if (!message.fixedCrossOriginIssues)
      message.fixedCrossOriginIssues = {};
    if (message.fixCrossOriginTopDocumentPos && !message.fixedCrossOriginIssues.TopDocumentPos)
    {
      message.fixedCrossOriginIssues.TopDocumentPos = true;
      // message received from Cross-Origin frame, query focused frame coords from the top window
      var msgGetWindowDocumentScreenPos = {};
      msgGetWindowDocumentScreenPos.Action = 'GetWindowDocumentScreenPos';
      this.SendMessageToTab(msgGetWindowDocumentScreenPos, senderTab.id, 0 /* top window */, function (AResponseMessage) {
        if (AResponseMessage)
        {
          message.topDocumentPos = AResponseMessage.DocumentPos;
          this.FixMessageCrossOriginIssues(message, sender, senderTab, fixedCallback);
        }
      }.bind(this));
      return;
    }
    if (message.fixCrossOriginElementsPosition && !message.fixedCrossOriginIssues.ElementsPosition)
    {
      message.fixedCrossOriginIssues.ElementsPosition = true;
      // message received from Cross-Origin frame, query focused frame coords from the top window
      var msgGetFocusedElementScreenRect = {};
      msgGetFocusedElementScreenRect.Action = 'GetFocusedElementScreenRect';
      msgGetFocusedElementScreenRect.IngoreFocusedFrame = true;
      this.SendMessageToTab(msgGetFocusedElementScreenRect, senderTab.id, 0 /* top window */, function (AResponseMessage) {
        if (AResponseMessage)
        {
          // offset all elements coords by top window position
          message.offsetFrameLeft = AResponseMessage.FocusedElementScreenRect.left;
          message.offsetFrameTop = AResponseMessage.FocusedElementScreenRect.top;
        }
        this.FixMessageCrossOriginIssues(message, sender, senderTab, fixedCallback);
      }.bind(this));
      return;
    }
    if (fixedCallback)
      fixedCallback(message, sender, senderTab);
  }
};

TspBackground.prototype.UpdateTopDocumentInfoInDOMXml = function (message, senderTab)
{
  if (senderTab && message && typeof message.DOMXml != 'undefined' && message.DOMXml != '')
  try
  {
    // update Url & Title of top document for the case of cross-origin frame message
    var DOMXmlParser = spAutofillCore.CreateCrossOriginDOMXmlParser();
    if (DOMXmlParser.LoadFromXml(message.DOMXml))
    {
      var saveXml = false;
      if (DOMXmlParser.UpdateTopDocumentInfo(senderTab.url, senderTab.title))
        saveXml = true;
      if (typeof message.topDocumentPos != 'undefined')
        if (DOMXmlParser.UpdateTopDocumentPos(message.topDocumentPos))
          saveXml = true;
      if (typeof message.offsetFrameLeft != 'undefined' && typeof message.offsetFrameTop != 'undefined')
        if (DOMXmlParser.AppendFrameOffsetToElementsRect(message.offsetFrameLeft, message.offsetFrameTop))
          saveXml = true;
      if (saveXml)
        message.DOMXml = DOMXmlParser.SaveToXml();
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.UpdateTopDocumentInfoInDOMXml() Error: ' + ErrorMessage);
  } 
};

// this function updates necessary info of specified tab
//   if the message sent by frame and not by top window of tab
TspBackground.prototype.UpdateTabInfoInMessage = function(message, sender, senderTab)
{
  if (!message || !sender || !senderTab)
    return;
  // update message info from the tab (top window)
  if (sender.frameId)
  {
    if (message.fixCrossOriginTopDocumentInfo || message.fixCrossOriginTopDocumentPos || message.fixCrossOriginElementsPosition)
      this.UpdateTopDocumentInfoInDOMXml(message, senderTab);
  }
  // delete unnecessary message properties
  delete message.fixedCrossOriginIssues;
  delete message.fixCrossOriginTopDocumentInfo;
  delete message.fixCrossOriginTopDocumentPos;
  delete message.fixCrossOriginElementsPosition;
  delete message.topDocumentPos;
  delete message.offsetFrameLeft;
  delete message.offsetFrameTop;
};

// this function appends necessary info of currently active window to the message
//   to allow find the web browser window
TspBackground.prototype.AppendActiveWindowInfoToMessage = function(message, selectedTab, senderWindow)
{
  if (!message || !selectedTab || !senderWindow)
    return;
  message.WindowTabTitle = selectedTab.title;
  message.WindowLeft = senderWindow.left;
  message.WindowTop = senderWindow.top;
  message.WindowWidth = senderWindow.width;
  message.WindowHeight = senderWindow.height;
};

TspBackground.prototype.BroadcastMessageToTabs = function(message)
{
  if (!message)
    return;
  try
  {
    chrome.tabs.query({},
      function (tabs)
      {
        if (!tabs)
          return;
        for (var i = tabs.length-1; i >= 0; i--)
        {
          var tab = tabs[i];
          chrome.tabs.sendMessage(tab.id, message);
        }
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.BroadcastMessageToTabs() Error: ' + ErrorMessage);
  }
};

// post the message to the Content Script of tab and frame,
//   if no tabId specified - use active tab,
//   if no AFrameId specified - use root window of tab
TspBackground.prototype.SendMessageToTab = function(message, tabId, AFrameId, AResponseCallback)
{
  if (!message)
    return;

  if (typeof AFrameId == 'undefined')
    AFrameId = 0; // root window as default
  var _sendMessageToTab = function(ATabId)
  {
    if (typeof AResponseCallback != 'undefined')
      message.NeedResponse = true; // automatically request response from the Content Script
    chrome.tabs.sendMessage(ATabId, message, { frameId: AFrameId }, AResponseCallback);
  };

  if (typeof tabId != 'undefined' && tabId > 0)
    _sendMessageToTab(tabId);
  else
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (tabs && tabs.length > 0)
        _sendMessageToTab(tabs[0].id);
    });
};

TspBackground.prototype.ProcessCaptionButtonClick = function(senderTab)
{
  if (senderTab)
  try
  {
    if (!this.TransportProtocol.IsConnected())
    {
      this.PasswordManagerNotStarted();

      if (this.UseMinigui != null && !this.UseMinigui)
      {
        var message = {};
        message.Action = 'ShowCaptionButtonMenu';
        message.allowReconnectTransport = true;
        this.PostTabMessageToTransport(message, senderTab);
      }
    }
    else if (!this.TransportProtocol.IsAuthenticated() && 
             !this.TransportProtocol.IsGuestAuthenticating())
    {
      this.ExtensionNotAuthenticated();
    }
    else
    {
      if (!this.UseMinigui)
      {
        var message = {};
        message.Action = 'ShowCaptionButtonMenu';
        this.PostTabMessageToTransport(message, senderTab);
      }
      else if (this.IsPasswordManagerLocked)
      {
        var message = {};
        message.Action = 'Unlock';
        this.PostTabMessageToTransport(message, senderTab);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ProcessCaptionButtonClick() Error: ' + ErrorMessage);
  }
};

TspBackground.prototype.TabSelected = function (tab)
{
  if (tab)
  try
  {
    if (this.Log.OnTabSelect)
      spLog.logMessage(this.constructor.name + '.TabSelected() URL: ' + tab.url);
    var message = {};
    message.Action = 'TabSelected';
    message.Url = tab.url;
    this.PostTabMessageToTransport(message, tab);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.TabSelected() Error: ' + ErrorMessage);
  }
};



var spBackground = new TspBackground();

})();