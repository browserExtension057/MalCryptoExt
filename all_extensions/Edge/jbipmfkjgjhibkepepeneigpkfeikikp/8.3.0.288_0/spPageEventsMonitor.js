
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Chromium Page Events Monitor                                          }
//                                                                             }
//       Copyright (C) 2016 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {
  
'use strict';

var spLog = spRequire('spLog').spLog;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;
var spStrings = spRequire('spStrings').spStrings;
var spBrowserSpecificTools = spRequire('spBrowserSpecificTools').spBrowserSpecificTools;



// TspChromiumPageEventsMonitor ------------------------------------------------

var TspPageEventsMonitor = spAutofillCore.TspPageEventsMonitor;

function TspChromiumPageEventsMonitor() {
  TspPageEventsMonitor.apply(this, arguments); // inherited call

  this._onPageUnloadHandler = null;
  this._onPageLoadHandler = null;
  this._onDOMContentLoadedHandler = null;
  this.DOMChangesMonitor = null;
  
  // public properties
  //   onCrossOriginPageLoadedCallback(AWindow)
  this.onCrossOriginPageLoadedCallback = null;
}

TspChromiumPageEventsMonitor.prototype = Object.create(TspPageEventsMonitor.prototype);

TspChromiumPageEventsMonitor.prototype.constructor = TspChromiumPageEventsMonitor;

// ConnectToPageEvents()
TspChromiumPageEventsMonitor.prototype.ConnectToPageEvents = function()
{
  var Self = this;
  this._onPageUnloadHandler = function (AEvent)
  {
    Self.DisconnectFromPageEvents(AEvent);
  };
  this._onPageLoadHandler = function (AEvent)
  {
    Self.PageOnLoad(AEvent);
  };
  this._onDOMContentLoadedHandler = function (AEvent)
  {
    Self.PageOnDOMContentLoaded(window);
  };
  window.addEventListener('load', this._onPageLoadHandler, true);
  window.addEventListener('unload', this._onPageUnloadHandler, false);
  window.addEventListener('DOMContentLoaded', this._onDOMContentLoadedHandler, false);
  this.ConnectToSubmitEvents(window);
};

// DisconnectFromPageEvents(AEvent)
TspChromiumPageEventsMonitor.prototype.DisconnectFromPageEvents = function(AEvent)
{
  this.StopDOMChangesMonitoring(window);
  this.DisconnectFromSubmitEvents(window);
  window.removeEventListener('DOMContentLoaded', this._onDOMContentLoadedHandler, false);
  window.removeEventListener('unload', this._onPageUnloadHandler, false);
  window.removeEventListener('load', this._onPageLoadHandler, true);
  if (this.onPageUnloadingCallback)
    this.onPageUnloadingCallback(AEvent, window);
};

// PageOnDOMContentLoaded(AWindow)
TspChromiumPageEventsMonitor.prototype.PageOnDOMContentLoaded = function(AWindow)
{
  if (AWindow)
  try
  {
    this.StartDOMChangesMonitoring(AWindow);
    this.FixChromiumFramesetOnSubmit(AWindow);
    // ?? this.PageOnLoadIfDocumentAlreadyComplete(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.PageOnDOMContentLoaded() Error: ' + ErrorMessage);
  }
};

// InstallHTMLFormElementPrototypeForDocument(ADocument)
TspChromiumPageEventsMonitor.prototype.InstallHTMLFormElementPrototypeForDocument = function (ADocument)
{
  TspPageEventsMonitor.prototype.InstallHTMLFormElementPrototypeForDocument.apply(this, arguments); // inherited call
  this.FixChromiumIFrameFormsOnSubmit(ADocument);
};

// FixChromiumIFrameFormsOnSubmit(ADocument)
TspChromiumPageEventsMonitor.prototype.FixChromiumIFrameFormsOnSubmit = function (ADocument)
{
  if (ADocument)
  try
  {
    var AWindow = ADocument.defaultView;
    if (spBrowserSpecificTools.isWindowFrame(AWindow))
    {
      // add "submit" event listener for document located in the <iframe> | <frame> tags
      this.ConnectElementToSubmitJSEvent(ADocument);
      // add "submit" event listener to all forms of the document
      for(var i = 0, lenForms = ADocument.forms.length; i < lenForms; i++)
      {
        var form = ADocument.forms[i];
        this.ConnectElementToSubmitEvent(form);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.FixChromiumIFrameFormsOnSubmit() Error: ' + ErrorMessage);
  }
};
  
// FixChromiumFramesetOnSubmit(AWindow)
TspChromiumPageEventsMonitor.prototype.FixChromiumFramesetOnSubmit = function (AWindow)
{
  if (AWindow)
  try
  {
    var ADocument = AWindow.document;
    // Chromium has the bug: 'onSubmit' event not fired for "frame" located inside "frameset" tag.
    // Therefore we should manually attach to each form's onSubmit event.
    var frames = ADocument.getElementsByTagName('frame');
    if (!frames)
      return;
    // it seems the document has <frameset> tag
    for(var i = 0, lenFrames = frames.length; i < lenFrames; i++)
    {
      try
      {
        var w = frames[i];
        var d = w.contentDocument;
        for(var j = 0, lenForms = d.forms.length; j < lenForms; j++)
        {
          var form = d.forms[j];
          this.ConnectElementToSubmitEvent(form);
        }
      }
      catch (ErrorMessage)
      {
        // error accessing the frame!
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.FixChromiumFramesetOnSubmit() Error: ' + ErrorMessage);
  }
}

// PageOnLoadIfDocumentAlreadyComplete(AWindow)
TspChromiumPageEventsMonitor.prototype.PageOnLoadIfDocumentAlreadyComplete = function(AWindow)
{
  if (AWindow)
  try
  {
    // some JSP pages opened with 'complete' state of document and no 'onload' event fired
    if (!AWindow.document)
      return;
    var ADocument = AWindow.document;
    if (ADocument.readyState != 'complete')
      return;
    // visible password element must present
    var hasVisiblePasswordElement = spAutofillCore.HTMLTools.HasWindowVisiblePasswordElement(AWindow);
    if (!hasVisiblePasswordElement)
      return;

    if (this.Log.Info)
      spLog.logMessage('TspPageEventsMonitor.PageOnLoadIfDocumentAlreadyComplete() Document state complete with ' + 
        'visible password element, ADocument.URL=<' + ADocument.URL + '>'
      );
    // simulate OnLoad event after small timeout
    var Self = this;
    setTimeout(function (AEvent) {
      var Event = new Object();
      Event.target = ADocument;
      Self.PageOnLoad(Event);
    }, 150);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.PageOnLoadIfDocumentAlreadyComplete() Error: ' + ErrorMessage);
  }
};

// StartDOMChangesMonitoring(AWindow)
TspChromiumPageEventsMonitor.prototype.StartDOMChangesMonitoring = function(AWindow)
{
  if (AWindow)
  try
  {
    if (!this.DOMChangesMonitor)
      this.DOMChangesMonitor = this.CreateDOMChangesMonitor(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.StartDOMChangesMonitoring() Error: ' + ErrorMessage);
  }
};

// StopDOMChangesMonitoring(AWindow)
TspChromiumPageEventsMonitor.prototype.StopDOMChangesMonitoring = function(AWindow)
{
  if (AWindow)
  try
  {
    if (this.DOMChangesMonitor)
    {
      this.DOMChangesMonitor.StopMonitoring();
      this.DOMChangesMonitor = null;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.StopDOMChangesMonitoring() Error: ' + ErrorMessage);
  }
};

// TryProcessPageLoaded(AWindow)
TspChromiumPageEventsMonitor.prototype.TryProcessPageLoaded = function(AWindow)
{
  if (AWindow)
  try
  {
    if (this.DOMChangesMonitor)
      this.DOMChangesMonitor.TryProcessPageLoaded();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.TryProcessPageLoaded() Error: ' + ErrorMessage);
  }
};

// InitDOMChangesMonitor(ADOMChangesMonitor, AWindow)
TspChromiumPageEventsMonitor.prototype.InitDOMChangesMonitor = function (ADOMChangesMonitor, AWindow)
{
  TspPageEventsMonitor.prototype.InitDOMChangesMonitor.apply(this, arguments); // inherited call

  if (ADOMChangesMonitor)
  {
    // ingore Load Delay monitoring for child frames
    ADOMChangesMonitor.AllowLoadDelayMonitor = spAutofillCore.HTMLTools.IsTopWindow(AWindow);
  }
};

// ProcessPageMutationChanges()
TspChromiumPageEventsMonitor.prototype.ProcessPageMutationChanges = function (AWindow)
{
  TspPageEventsMonitor.prototype.ProcessPageMutationChanges.apply(this, arguments); // inherited call

  if (AWindow)
  {
    // restart PageLoaded waiting if cross-origin page changed
    if (this.timerIdCrossOriginPageLoaded)
    {
      if (this.Log.CrossOriginPageLoaded)
        spLog.logMessage('TspChromiumPageEventsMonitor.ProcessPageMutationChanges() Postpone new cross-origin timer ' +
          'for <' + AWindow.document.URL + '>'
        );
      this.postponeCrossOriginPageLoaded();
    }
  }
};

// fireCrossOriginPageLoadedCallback()
TspChromiumPageEventsMonitor.prototype.fireCrossOriginPageLoadedCallback = function (AWindow)
{
  if (AWindow)
  try
  {
    var checkingInfo = {};
    checkingInfo.CheckAllChildDocuments = true;
    if (spAutofillCore.HTMLTools.HasWindowEditableElement(AWindow, checkingInfo))
    {
      if (this.Log.Info)
        spLog.logMessage('TspChromiumPageEventsMonitor.fireCrossOriginPageLoadedCallback() Cross-origin page loaded ' +
          'for <' + AWindow.document.URL + '>'
        );
      if (this.onCrossOriginPageLoadedCallback)
        this.onCrossOriginPageLoadedCallback(AWindow);
    }
    else
    {
      if (this.Log.Warnings)
        spLog.logMessage('TspChromiumPageEventsMonitor.fireCrossOriginPageLoadedCallback() WARNING: Cross-origin empty page loaded ' +
          'for <' + AWindow.document.URL + '>, ignore PageLoaded event'
        );
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumPageEventsMonitor.fireCrossOriginPageLoadedCallback() Error: ' + ErrorMessage);
  }
};

// postponeCrossOriginPageLoaded()
TspChromiumPageEventsMonitor.prototype.postponeCrossOriginPageLoaded = function ()
{
  var AWindow = window;
  var dtcCrossOriginPageLoaded = 0;
  if (!this.timerIdCrossOriginPageLoaded)
  {
    // first call
    this.tcCrossOriginPageLoaded = spAutofillCore.Tools.GetTickCount();
    if (this.Log.CrossOriginPageLoaded)
      spLog.logMessage('TspChromiumPageEventsMonitor.postponeCrossOriginPageLoaded() Start timer ' +
        'for <' + AWindow.document.URL + '>'
      );
  }
  else
  {
    // reset timer
    clearTimeout(this.timerIdCrossOriginPageLoaded);
    this.timerIdCrossOriginPageLoaded = 0;

    dtcCrossOriginPageLoaded = spAutofillCore.Tools.GetTickCount() - this.tcCrossOriginPageLoaded;
    if (dtcCrossOriginPageLoaded > 2000)
    {
      // waiting timeout
      if (this.Log.CrossOriginPageLoaded)
        spLog.logMessage('TspChromiumPageEventsMonitor.postponeCrossOriginPageLoaded() page changes waiting timeout ' +
          'for <' + AWindow.document.URL + '>'
        );
      this.fireCrossOriginPageLoadedCallback(AWindow);
      return;
    }
    if (this.Log.CrossOriginPageLoaded)
      spLog.logMessage('TspChromiumPageEventsMonitor.postponeCrossOriginPageLoaded() Restart timer, dtc=' + dtcCrossOriginPageLoaded + ' ' +
        'for <' + AWindow.document.URL + '>'
      );
  }

  var Self = this;
  this.timerIdCrossOriginPageLoaded = setTimeout(function (AEvent) {
    Self.timerIdCrossOriginPageLoaded = 0;
    Self.tcCrossOriginPageLoaded = 0;
    Self.fireCrossOriginPageLoadedCallback(AWindow);
  }, 350);
};

// AllowProcessPageLoaded(AWindow)
TspChromiumPageEventsMonitor.prototype.AllowProcessPageLoaded = function (AWindow)
{
  if (AWindow)
  try
  {
    if (spAutofillCore.HTMLTools.HasWindowCrossOriginParent(AWindow))
    {
      if (this.Log.Info)
        spLog.logMessage('TspChromiumPageEventsMonitor.AllowProcessPageLoaded() Cross-origin page loaded ' +
          'for <' + AWindow.document.URL + '>'
        );
      this.postponeCrossOriginPageLoaded();
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.AllowProcessPageLoaded() Error: ' + ErrorMessage);
  }

  return TspPageEventsMonitor.prototype.AllowProcessPageLoaded.apply(this, arguments); // inherited call 
};



var spPageEventsMonitor = (function() {
  
  // spPageEventsMonitor public factory
  
  return {
    CreatePageEventsMonitor: function()
    {
      return new TspChromiumPageEventsMonitor();
    }
  }
})();

var __exports = {};
__exports.spPageEventsMonitor = spPageEventsMonitor;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spPageEventsMonitor', __exports);

})();