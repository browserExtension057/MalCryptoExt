
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Common Background Tools                                               }
//                                                                             }
//       Copyright (C) 2018 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {
  
'use strict';

var spLog = spRequire('spLog').spLog;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;



// TspIncompleteMessageCache ---------------------------------------------------

function TspIncompleteMessageCache(AMessageRTID, AMessage)
{
  this.MessageRTID = AMessageRTID;
  this.Message = AMessage;
  this.CachedTickCount = spAutofillCore.Tools.GetTickCount();
}

TspIncompleteMessageCache.prototype.IsLifeEnded = function ()
{
  var tc = spAutofillCore.Tools.GetTickCount();
  if ((tc - this.CachedTickCount) < 1500)
    return false;
  return true;
};



// TspIncompleteMessageCacheManager --------------------------------------------

function TspIncompleteMessageCacheManager()
{
  this.Log = {
    // log modes
    Info: false
  };

  this.Cache = new Array();
  this.LifeEndedTimerID = 0;
}

TspIncompleteMessageCacheManager.prototype.UpdateLifeEndedTimer = function ()
{
  if (this.Cache.length)
  {
    if (!this.LifeEndedTimerID)
    {
      this.LifeEndedTimerID = setInterval(this.KillLifeEndedItems.bind(this), 500);
      if (this.Log.Info)
        spLog.logMessage(this.constructor.name + '.UpdateLifeEndedTimer() Timer started');
    }
  }
  else
  {
    if (this.LifeEndedTimerID)
    {
      clearInterval(this.LifeEndedTimerID);
      this.LifeEndedTimerID = 0;
      if (this.Log.Info)
        spLog.logMessage(this.constructor.name + '.UpdateLifeEndedTimer() Timer stopped');
    }
  }
};

TspIncompleteMessageCacheManager.prototype._InfexOf = function (AMessageRTID)
{
  if (AMessageRTID)
  try
  {
    for (var i = 0, len = this.Cache.length; i < len; i++)
    {
      var item = this.Cache[i];
      if (item.MessageRTID == AMessageRTID)
        return i;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '._InfexOf() Error: ' + ErrorMessage);
  }
  return -1;
};

TspIncompleteMessageCacheManager.prototype.Find = function (AMessageRTID)
{
  try
  {
    var i = this._InfexOf(AMessageRTID);
    if (i != -1)
    {
      var item = this.Cache[i];
      return item.Message;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Find() Error: ' + ErrorMessage);
  }
  return null;
};

TspIncompleteMessageCacheManager.prototype.Remove = function(AMessageRTID)
{
  try
  {
    var i = this._InfexOf(AMessageRTID);
    if (i != -1)
    {
      this.Cache.splice(i, 1);
      this.UpdateLifeEndedTimer();
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Remove() Error: ' + ErrorMessage);
  }
};

TspIncompleteMessageCacheManager.prototype.Put = function(AMessageRTID, AMessage)
{
  if (AMessageRTID && AMessage)
  try
  {
    var item = new TspIncompleteMessageCache(AMessageRTID, AMessage);
    this.Cache.push(item);
    this.UpdateLifeEndedTimer();
    return item;
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Put() Error: ' + ErrorMessage);
  }
  return null;
};

TspIncompleteMessageCacheManager.prototype.KillLifeEndedItems = function ()
{
  try
  {
    var mustUpdateTimer = false;
    for (var i = this.Cache.length-1; i >= 0; i--)
    {
      var item = this.Cache[i];
      if (item.IsLifeEnded())
      {
        this.Cache.splice(i, 1);
        mustUpdateTimer = true;
        if (this.Log.Info)
          spLog.logMessage(this.constructor.name + '.KillLifeEndedItems() Found life ended item, ' +
            'message.Action: "' + item.Message.Action + '", messageRTID=' + item.MessageRTID
          );
        if (this.OnProcessLifeEndedItemCallback)
          this.OnProcessLifeEndedItemCallback(item);
      }
    }
    if (mustUpdateTimer)
      this.UpdateLifeEndedTimer();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.KillLifeEndedItems() Error: ' + ErrorMessage);
  }
};



// TspMiniguiPopupTransport ----------------------------------------------------

function TspMiniguiPopupTransport()
{
  this.onGetPopupWindow = null;
  this.onMessage = null;
}

TspMiniguiPopupTransport.prototype.Connect = function ()
{
  if (!this.onGetPopupWindow)
    throw this.constructor.name + '.Connect() Event onGetPopupWindow is undefined!';
  if (!this.onMessage)
    throw this.constructor.name + '.Connect() Event onMessage is undefined!';

  window.postMiniguiMessage = this.mgOnMessage.bind(this);
};

TspMiniguiPopupTransport.prototype.getMiniguiPopupWindow = function ()
{
  try
  {
    var popupWindow = this.onGetPopupWindow();
    if (popupWindow && typeof popupWindow.postMiniguiMessage == 'function')
      return popupWindow;
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.getMiniguiPopupWindow() Error: ' + ErrorMessage);
  }
  return null;
};

TspMiniguiPopupTransport.prototype.PostMessage = function (message)
{
  if (message)
  try
  {
    var popupWindow = this.getMiniguiPopupWindow();
    if (popupWindow)
      popupWindow.postMiniguiMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.PostMessage() Error: ' + ErrorMessage);
  }
};

TspMiniguiPopupTransport.prototype.mgOnMessage = function (message)
{
  if (message)
  try
  {
    if (this.onMessage)
      this.onMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.mgOnMessage() Error: ' + ErrorMessage);
  }
};



const spCommonBackgroundTools = {
  CreateIncompleteMessageCacheManager: function ()
  {
    return new TspIncompleteMessageCacheManager();
  },
  
  CreateMiniguiPopupTransport: function ()
  {
    return new TspMiniguiPopupTransport();
  }
};

var __exports = {};
__exports.spCommonBackgroundTools = spCommonBackgroundTools;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spCommonBackgroundTools', __exports);

})();