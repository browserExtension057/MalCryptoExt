
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Chromium Content Module                                               }
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
spLog.setProductName('spContent');
var spStrings = spRequire('spStrings').spStrings;
var spFormElementPrototype = spRequire('spFormElementPrototype').spFormElementPrototype;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;
var spBrowserSpecificTools = spRequire('spBrowserSpecificTools').spBrowserSpecificTools;
var spPageEventsMonitor = spRequire('spPageEventsMonitor').spPageEventsMonitor;
spLog.setProductName('spContent#' + spAutofillCore.Tools.GenerateRTID()); // append ID of each content script


// TspPageFocusChangedMonitor --------------------------------------------------

function TspPageFocusChangedMonitor()
{
  this.Log = {
    // log modes
    Info: false
  };
  var Self = this;
  this._onBlurHandler = function (AEvent)
  {
    Self.PageOnBlur(AEvent);
  };
  this._onFocusHandler = function (AEvent)
  {
    Self.PageOnFocus(AEvent);
  };
  this._onScrollHandler = function (AEvent)
  {
    Self.PageOnScroll(AEvent);
  };
  this._onKeydownHandler = function (AEvent)
  {
    Self.PageOnKeydown(AEvent);
  };
  this._onMousedownHandler = function (AEvent)
  {
    Self.PageOnMousedown(AEvent);
  };

  this.FocusEventType = {
    None: 0,
    Focus: 1,
    Blur: 2,
    Scroll: 3
  };
  this.Enabled = true;
  this.LastFocusedElement = null;
  // this flag allows not to send OnBlur message to the BG script for each event,
  //   but do it only once if properly element was focused before.
  this.WasLastFocusedElement = false;
  // this flag tells what type of event occured in the page
  this.LastFocusEvent = this.FocusEventType.None;
  // this timer allows to correctly process the OnBlur event,
  //   because we got this event also when switching focus
  //   from one element to another using the TAB key for example.
  this.BlurTimerID = 0;
  this.IsProcessingFocusedElement = false;
  this.LastUserFocusEventTickCount = 0;
  this.LastUserClickedElement = null;
  this.LastUserClickedPoint = null;

  // public properties
  //   onPageFocusChangedCallback(AWindow, AFocusedElement, AFocusedElementScreenRect)
  this.onPageFocusChangedCallback = null;
  //   onGetActiveWindowCallback()
  this.onGetActiveWindowCallback = null;
  //   onGetElementScreenPositionCallback(AElement)
  this.onGetElementScreenPositionCallback = null;
}

// ConnectToWindowEvents(AWindow)
TspPageFocusChangedMonitor.prototype.ConnectToWindowEvents = function(AWindow, AOnWindowUnloadCallback)
{
  if (AWindow)
  try
  {
    var ADocument = spAutofillCore.HTMLTools.GetWindowDocument(AWindow);
    if (ADocument)
    {
      ADocument.addEventListener('blur', this._onBlurHandler, true);
      ADocument.addEventListener('focus', this._onFocusHandler, true);
      AWindow.addEventListener('scroll', this._onScrollHandler, true);
      ADocument.addEventListener('keydown', this._onKeydownHandler, true);
      ADocument.addEventListener('mousedown', this._onMousedownHandler, true);

      var Self = this;
      AWindow.addEventListener('unload', function _unload(AEvent) {
        AWindow.removeEventListener('unload', _unload, false); // remove listener, no longer needed
        Self.DisconnectFromWindowEvents(AWindow);
        if (typeof AOnWindowUnloadCallback != 'undefined')
          AOnWindowUnloadCallback(AWindow);
      }, false);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.ConnectToWindowEvents() Error: ' + ErrorMessage);
  }
};

// DisconnectFromWindowEvents(AWindow)
TspPageFocusChangedMonitor.prototype.DisconnectFromWindowEvents = function(AWindow)
{
  if (AWindow)
  try
  {
    var ADocument = spAutofillCore.HTMLTools.GetWindowDocument(AWindow);
    if (ADocument)
    {
      ADocument.removeEventListener('blur', this._onBlurHandler, true);
      ADocument.removeEventListener('focus', this._onFocusHandler, true);
      AWindow.removeEventListener('scroll', this._onScrollHandler, true);
      ADocument.removeEventListener('keydown', this._onKeydownHandler, true);
      ADocument.removeEventListener('mousedown', this._onMousedownHandler, true);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.DisconnectFromWindowEvents() Error: ' + ErrorMessage);
  }
};

// ConnectToEvents()
TspPageFocusChangedMonitor.prototype.ConnectToEvents = function()
{
  try
  {
    var Self = this;
    this.ConnectToWindowEvents(window, 
      // AOnWindowUnloadCallback
      function (AWindow) {
        Self.StopBlurTimer();
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.ConnectToEvents() Error: ' + ErrorMessage);
  }
};

// PageOnBlur(AEvent)
TspPageFocusChangedMonitor.prototype.PageOnBlur = function (AEvent)
{
  // deny to process if disabled
  if (!this.Enabled)
    return;
  this.LastFocusEvent = this.FocusEventType.Blur;
  this.StartBlurTimer();
};

// PageOnFocus(AEvent)
TspPageFocusChangedMonitor.prototype.PageOnFocus = function (AEvent)
{
  // deny to process if disabled
  if (!this.Enabled)
    return;
  this.StopBlurTimer();
  if (!this.WasUserFocusEvent(AEvent))
  {
    // forget any previous event
    this.LastFocusEvent = this.FocusEventType.None;
    return;
  }
  this.LastFocusEvent = this.FocusEventType.Focus;
  this.TryToProcessFocusedElement();
};

// PageOnScroll(AEvent)
TspPageFocusChangedMonitor.prototype.PageOnScroll = function (AEvent)
{
  // deny to process if disabled
  if (!this.Enabled)
    return;
  // skip scrolling of elements, only document scroll allowed.
  // in Firefox we got scroll event from combobox which is senseless for us
  if (AEvent.target)
  {
    if (typeof AEvent.target.nodeType != 'undefined' && AEvent.target.nodeType == 1)
      return;
  }
  this.LastFocusEvent = this.FocusEventType.Scroll;
  this.StartBlurTimer();
};

// PageOnKeydown(AEvent)
TspPageFocusChangedMonitor.prototype.PageOnKeydown = function (AEvent)
{
  if (!AEvent)
    return;
  if (AEvent.keyCode == 9)
  {
    // user pressed tab key
    this.LastUserFocusEventTickCount = spAutofillCore.Tools.GetTickCount();
    this.LastUserClickedElement = null;
    this.LastUserClickedPoint = null;
  }
};

// PageOnMousedown(AEvent)
TspPageFocusChangedMonitor.prototype.PageOnMousedown = function (AEvent)
{
  if (!AEvent)
    return;
  // user clicked some node
  this.LastUserFocusEventTickCount = spAutofillCore.Tools.GetTickCount();
  this.LastUserClickedElement = AEvent.target;
  this.LastUserClickedPoint = spAutofillCore.Tools.GetClientPointFromEvent(AEvent);

  if (AEvent.target)
  {
    if (typeof AEvent.target.nodeType != 'undefined' && AEvent.target.nodeType == 1)
    {
      // process click only on editable input elements, this prevents showing the balloons while Context Button click
      if (spAutofillCore.HTMLTools.IsInputEditableElement(AEvent.target))
      {
        // allow to process only the same element as current focused one.
        // when page has initially focus on the login field and you click the password one
        // then we got 2 focus events: 1st from here for login field and second one from PageOnFocus() for password one.
        var AWindow = this.GetActiveWindow();
        if (AWindow)
        {
          var ADocument = AWindow.document;
          var focusedElement = spAutofillCore.HTMLTools.GetDocumentFocusedElement(ADocument);
          if (focusedElement != AEvent.target)
            return;
        }
        this.LastFocusEvent = this.FocusEventType.Focus;
        this.TryToProcessFocusedElement();
      }
    }
  }
};

// ResetLastUserFocusInfo()
TspPageFocusChangedMonitor.prototype.ResetLastUserFocusInfo = function ()
{
  this.LastUserFocusEventTickCount = 0;
  this.LastUserClickedElement = null;
  this.LastUserClickedPoint = null;
};

// WasUserFocusEvent(AEvent)
TspPageFocusChangedMonitor.prototype.WasUserFocusEvent = function (AEvent)
{
  if (!this.LastUserFocusEventTickCount)
    return false;
  var dtc = spAutofillCore.Tools.GetTickCount() - this.LastUserFocusEventTickCount;
  if (dtc > 333)
    return false;
  
  if (AEvent && this.LastUserClickedElement && this.LastUserClickedElement != AEvent.target)
  {
    if (this.LastUserClickedPoint)
    {
      var rcElement = spAutofillCore.HTMLTools.GetElementPosition(AEvent.target);
      if (!spAutofillCore.Tools.IsPointInRect(this.LastUserClickedPoint, rcElement))
        return false;
    }
    else
    {
      return false;
    }
  }

  return true;
};

// StartBlurTimer()
TspPageFocusChangedMonitor.prototype.StartBlurTimer = function()
{
  try
  {
    var Self = this;
    this.StopBlurTimer();
    this.BlurTimerID = setTimeout(function (AEvent) {
      Self.BlurOnTimer(AEvent);
    }, 100);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.StartBlurTimer() Error: ' + ErrorMessage);
  }
};

// StopBlurTimer()
TspPageFocusChangedMonitor.prototype.StopBlurTimer = function()
{
  try
  {
    if (this.BlurTimerID)
    {
  		clearTimeout(this.BlurTimerID);
	  	this.BlurTimerID = 0;
	  }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.StopBlurTimer() Error: ' + ErrorMessage);
  }
};

// BlurOnTimer(AEvent)
TspPageFocusChangedMonitor.prototype.BlurOnTimer = function(AEvent)
{
  try
  {
    // stop the timer and process the OnBlur event
    this.StopBlurTimer();
    this.TryToProcessFocusedElement();
  }
  catch (ErrorMessage)
  {
    spLog.logError('spOnBlurOnTimer() Error: ' + ErrorMessage);
  }
};

// TryToProcessFocusedElement()
TspPageFocusChangedMonitor.prototype.TryToProcessFocusedElement = function()
{
  if (this.IsProcessingFocusedElement)
    return;
  this.IsProcessingFocusedElement = true;
  try
  {
    this.ProcessFocusedElement();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.TryToProcessFocusedElement() Error: ' + ErrorMessage);
  }
  this.LastFocusEvent = this.FocusEventType.None;
  this.IsProcessingFocusedElement = false;
};

// GetActiveWindow()
TspPageFocusChangedMonitor.prototype.GetActiveWindow = function()
{
  if (!this.onGetActiveWindowCallback)
    throw 'TspPageFocusChangedMonitor.onGetActiveWindowCallback is undefined';
  var Result = this.onGetActiveWindowCallback();
  return Result;
};

// GetElementScreenPosition(AElement)
TspPageFocusChangedMonitor.prototype.GetElementScreenPosition = function(AElement)
{
  if (!this.onGetElementScreenPositionCallback)
    throw 'TspPageFocusChangedMonitor.onGetElementScreenPositionCallback is undefined';
  var Result = this.onGetElementScreenPositionCallback(AElement);
  return Result;
};

// ProcessFocusedElement()
TspPageFocusChangedMonitor.prototype.ProcessFocusedElement = function()
{
  try
  {
    // deny to process if disabled
    if (!this.Enabled)
      return;

    var AWindow = this.GetActiveWindow();
    if (!AWindow)
      return;
    var ADocument = AWindow.document;
    var focusedElement = spAutofillCore.HTMLTools.GetDocumentFocusedElement(ADocument);
    var isTextElement = spAutofillCore.HTMLTools.IsTextElement(focusedElement);

    // prevent processing focus event if focused element is overlapped by some other one over it
    if (this.LastFocusEvent == this.FocusEventType.Focus &&
        focusedElement &&
        isTextElement)
    {
      var rcFocusedElement = spAutofillCore.HTMLTools.GetElementPosition(focusedElement);
      var x = rcFocusedElement.left + focusedElement.offsetWidth / 2;
      var y = rcFocusedElement.top + focusedElement.offsetHeight / 2;
      var topElement = ADocument.elementFromPoint(x, y);
      if (topElement &&
          focusedElement != topElement &&
          // top element should be significantly larger than focused one (i.e. it should overlap all the element area)
          topElement.offsetWidth > 1.5 * focusedElement.offsetWidth &&
          topElement.offsetHeight > 1.5 * focusedElement.offsetHeight
         )
      {
        if (this.Log.Info)
          spLog.logMessage('TspPageFocusChangedMonitor.ProcessFocusedElement() supported element got focus ' +
            spAutofillCore.HTMLTools.GetElementDebugInfo(focusedElement) +
            ' rc: ' + spAutofillCore.Tools.GetRectDebugInfo(rcFocusedElement) +
            ' with other element over it ' +
            spAutofillCore.HTMLTools.GetElementDebugInfo(topElement) +
            ', skip!'
        );
        focusedElement = null;
        isTextElement = false;
      }
    }

    if (this.LastFocusEvent == this.FocusEventType.Scroll &&
        isTextElement)
    {
      // notify event only if last focused element is the same!
      if (this.LastFocusedElement != focusedElement)
        return;
      var rcFocusedElement = this.GetElementScreenPosition(focusedElement);
      if (this.onPageFocusChangedCallback)
        this.onPageFocusChangedCallback(AWindow, null, rcFocusedElement);
      if (this.Log.Info)
      {
        spLog.logMessage('TspPageFocusChangedMonitor.ProcessFocusedElement() page scrolled while supported element has focus ' +
          spAutofillCore.HTMLTools.GetElementDebugInfo(focusedElement) +
          ' rc: ' + spAutofillCore.Tools.GetRectDebugInfo(rcFocusedElement)
        );
      }
    }
    else if (this.LastFocusEvent == this.FocusEventType.Focus &&
             isTextElement)
    {
      // notify event only if last focused element changed!
      if (this.LastFocusedElement == focusedElement)
      {
        // forget about last user focus information
        this.ResetLastUserFocusInfo();
        return;
      }
      var rcFocusedElement = this.GetElementScreenPosition(focusedElement);
      this.WasLastFocusedElement = true;
      if (this.onPageFocusChangedCallback)
        this.onPageFocusChangedCallback(AWindow, focusedElement, rcFocusedElement);
      if (this.Log.Info)
        spLog.logMessage('TspPageFocusChangedMonitor.ProcessFocusedElement() supported element got focus ' +
          spAutofillCore.HTMLTools.GetElementDebugInfo(focusedElement) +
          ' rc: ' + spAutofillCore.Tools.GetRectDebugInfo(rcFocusedElement)
        );
    }
    else
    {
      // notify event only if last focused element's changed!
      if (this.LastFocusedElement == focusedElement)
        return;
      if (this.WasLastFocusedElement)
      {
        this.WasLastFocusedElement = false;
        if (this.onPageFocusChangedCallback)
          this.onPageFocusChangedCallback(AWindow, null, null);
        if (this.Log.Info)
          spLog.logMessage('TspPageFocusChangedMonitor.ProcessFocusedElement() supported element lost focus.');
      }
    }
    this.LastFocusedElement = focusedElement;
    // forget about last user focus information
    this.ResetLastUserFocusInfo();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageFocusChangedMonitor.ProcessFocusedElement() Error: ' + ErrorMessage);
  }
};

// TspAutofillAdapter ----------------------------------------------------------

function TspAutofillAdapter()
{
  this.Log = {
    // log modes
    Info: false,
    OnLoad: false,
    OnSubmit: false,
    Autofill: false
  };
  this.IsPasswordManagerLocked = false;
  this.DOMXmlLockedUsageEvents = {};
  var Self = this;
  this._onContextButtonClickHandler = function (AElement)
  {
    try
    {
      Self.ProcessContextButtonClicked(AElement);
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspAutofillAdapter._onContextButtonClickHandler() Error: ' + ErrorMessage);
    }
  };
  this._onUpdatePasswordManagerLockedHandler = function (AIsPasswordManagerLocked)
  {
    Self.IsPasswordManagerLocked = AIsPasswordManagerLocked;
  };
  this._onContextButtonInitializeHandler = function (AButtonInfo)
  {
    if (AButtonInfo)
    try
    {
      AButtonInfo.Title = 'Sticky Password';
      AButtonInfo.onClicked = Self._onContextButtonClickHandler;
      AButtonInfo.GetImageSrc = function () 
      { 
        if (spAutofillCore.HTMLTools.IsSVGSupported())
        {
          // SVG
          if (Self.IsPasswordManagerLocked)
            return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz4KICAgICAgPGZpbHRlciBpZD0iRGVzYXR1cmF0ZSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgaW49IlNvdXJjZUdyYXBoaWMiIHZhbHVlcz0iMCIvPgogICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJJY29ucy0rLWxvZ28iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJvcGFjaXR5OjAuNTQiIGZpbHRlcj0idXJsKCNEZXNhdHVyYXRlKSI+CiAgICAgICAgPGcgaWQ9IlNQLUxvZ28iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MS4wMDAwMDAsIC02MS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9InN5bWJvbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjEuMDAwMDAwLCA2MS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNC4wODEwMjc3LDIzLjI2Mjg5OTIgTDI1LjA2MjA1ODUsMTQuMjc4Njg2NCBDMjQuNjA0Mjg2MSwxMy44MjQzMjAzIDIzLjg2Mzg4OSwxMy44MjQzMjAzIDIzLjQwNDQxMDcsMTQuMjc4Njg2NCBMMTQuMzg3NzE2MSwyMy4yNjI4OTkyIEMxMy45Mjc2NjksMjMuNzE3ODMxOSAxMy45Mjc2NjksMjQuNDU2MDM1MyAxNC4zODc3MTYxLDI0LjkxMjY2NzYgTDIzLjQwNDQxMDcsMzMuODk2MzEzOSBDMjMuNjMxODc1MiwzNC4xMjQwNjM1IDIzLjkzMTU1OTcsMzQuMjM3OTM4MyAyNC4yMzI5NTAzLDM0LjIzNzkzODMgQzI0LjUzMjA2NjEsMzQuMjM3OTM4MyAyNC44MzUxNjI2LDM0LjEyNDA2MzUgMjUuMDYyMDU4NSwzMy44OTYzMTM5IEwzNC4wODEwMjc3LDI0LjkxMjY2NzYgQzM0LjI5OTM5MzcsMjQuNjkwNTgzNCAzNC40MjI3OTMyLDI0LjM5ODI0ODEgMzQuNDIyNzkzMiwyNC4wODgzNSBDMzQuNDIyNzkzMiwyMy43NzYxODU3IDM0LjI5OTM5MzcsMjMuNDgwNDUxMSAzNC4wODEwMjc3LDIzLjI2Mjg5OTIgWiIgaWQ9IkZpbGwtMSIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjUzODc3OTUsMjcuNzQ3ODY3MiBDMTEuMDgxMDA3MSwyNy4yOTQ2MzQxIDEwLjM0MDYxLDI3LjI5NDYzNDEgOS44ODI4Mzc2MywyNy43NDc4NjcyIEwwLjg2Nzg0OTA0OSwzNi43MzI2NDY1IEMwLjQwODM3MDY2OCwzNy4xODgxNDU4IDAuNDA4MzcwNjY4LDM3LjkyNTIxNjEgMC44Njc4NDkwNDksMzguMzgzNTQ4IEw5Ljg4MjgzNzYzLDQ3LjM2ODMyNzMgQzEwLjExMDg3MDgsNDcuNTkzODEwOCAxMC40MTExMjQsNDcuNzA5OTUxOCAxMC43MTI1MTQ2LDQ3LjcwOTk1MTggQzExLjAwNzA4MTEsNDcuNzA5OTUxOCAxMS4zMTE4ODM2LDQ3LjU5MzgxMDggMTEuNTM4Nzc5NSw0Ny4zNjgzMjczIEwyMC41NjE3Mjk0LDM4LjM4MzU0OCBDMjAuNzc3ODIwNywzOC4xNjA4OTczIDIwLjkwNTIwMDgsMzcuODcwODI4MSAyMC45MDUyMDA4LDM3LjU1NjM5NzYgQzIwLjkwNTIwMDgsMzcuMjQ1OTMzIDIwLjc3NzgyMDcsMzYuOTUxODk4IDIwLjU2MTcyOTQsMzYuNzMyNjQ2NSBMMTEuNTM4Nzc5NSwyNy43NDc4NjcyIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiMwMEE5RTAiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOC41NjYxNzM2LDAuODIzMzg1OTQgQzM4LjEwODk2OTksMC4zNjc4ODY2OTIgMzcuMzY0NTkyMiwwLjM2NTA1Mzk4NSAzNi45MDk2NjMxLDAuODIzMzg1OTQgTDI3Ljg5Mjk2ODUsOS44MDkyOTgzNSBDMjcuNDM1MTk2MSwxMC4yNjE5NjQ5IDI3LjQzNTE5NjEsMTEuMDAxODY3OSAyNy44OTI5Njg1LDExLjQ1ODUwMDIgTDM2LjkwOTY2MzEsMjAuNDQzMjc5NSBDMzcuMTM1OTkwMywyMC42Njk4OTYxIDM3LjQzNTEwNjIsMjAuNzgyNjM3OCAzNy43MzY0OTY3LDIwLjc4MjYzNzggQzM4LjAzNTYxMjYsMjAuNzgyNjM3OCAzOC4zMzUyOTcxLDIwLjY2OTg5NjEgMzguNTY2MTczNiwyMC40NDMyNzk1IEw0Ny41ODI4NjgyLDExLjQ1ODUwMDIgQzQ3LjgwMTgwMjgsMTEuMjM0NzE2NCA0Ny45MjUyMDI0LDEwLjk0NDY0NzIgNDcuOTI1MjAyNCwxMC42MzE5MTY0IEM0Ny45MjUyMDI0LDEwLjMxOTc1MjEgNDcuODAxODAyOCwxMC4wMjkxMTY0IDQ3LjU4Mjg2ODIsOS44MDUzMzI1NiBMMzguNTY2MTczNiwwLjgyMzM4NTk0IFoiIGlkPSJGaWxsLTUiIGZpbGw9IiNENjE4MTgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS41MzAwNzksMC43OTY4MTUxNSBDMTEuMDc0NTgxMywwLjM0MzAxNTUyNiAxMC4zMjY3OTE2LDAuMzQzMDE1NTI2IDkuODc1ODQzMSwwLjc5NjgxNTE1IEwwLjg1NzQ0MjU0Niw5Ljc4MTAyNzkzIEMwLjM5NzM5NTUwMywxMC4yMzY1MjcyIDAuMzk3Mzk1NTAzLDEwLjk3NjQzMDIgMC44NTc0NDI1NDYsMTEuNDMzMDYyNSBMOS44NzU4NDMxLDIwLjQxNjE0MjIgQzEwLjEwMjE3MDMsMjAuNjQ3MjkxMSAxMC40MDEyODYyLDIwLjc1NzIwMDEgMTAuNzAyNjc2NywyMC43NTcyMDAxIEMxMS4wMDQwNjcyLDIwLjc1NzIwMDEgMTEuMzAzMTgzMSwyMC42NDcyOTExIDExLjUzMDA3OSwyMC40MTYxNDIyIEwyMC41NDYyMDQ5LDExLjQzMzA2MjUgQzIwLjc2NzQxNDIsMTEuMjEyNjc3OSAyMC44OTQyMjU3LDEwLjkyMTQ3NTcgMjAuODk0MjI1NywxMC42MDQ3NzkxIEMyMC44OTQyMjU3LDEwLjI5NDMxNDQgMjAuNzY3NDE0MiwxMC4wMDI1NDU2IDIwLjU0NjIwNDksOS43ODEwMjc5MyBMMTEuNTMwMDc5LDAuNzk2ODE1MTUgWiIgaWQ9IkZpbGwtNyIgZmlsbD0iIzdBQjgwMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM4LjYzMTY4MzQsMjcuNzk4ODU1OSBDMzguMTc0NDc5NywyNy4zNDIyMjM2IDM3LjQyOTUzMzMsMjcuMzQyMjIzNiAzNi45NzM0NjY5LDI3Ljc5ODg1NTkgTDI3Ljk1OTYxNTYsMzYuNzgwMjM2IEMyNy41MDE4NDMyLDM3LjIzODAwMTQgMjcuNTAxODQzMiwzNy45NzUwNzE3IDI3Ljk1OTYxNTYsMzguNDMxMTM3NSBMMzYuOTczNDY2OSw0Ny40MTgxODMgQzM3LjIwMDM2MjgsNDcuNjQ0Nzk5NSAzNy40OTg5MSw0Ny43NTk4MDc0IDM3LjgwMDg2OTIsNDcuNzU5ODA3NCBDMzguMTAyMjU5Nyw0Ny43NTk4MDc0IDM4LjM5ODUzMjMsNDcuNjQ0Nzk5NSAzOC42MzE2ODM0LDQ3LjQxODE4MyBMNDcuNjQ4Mzc4LDM4LjQzMTEzNzUgQzQ3Ljg2Njc0NCwzOC4yMTE4ODYgNDcuOTkxODQ5NSwzNy45MTg5ODQxIDQ3Ljk5MTg0OTUsMzcuNjA5MDg2IEM0Ny45OTE4NDk1LDM3LjI5NTc4ODYgNDcuODY2NzQ0LDM3LjAwNDU4NjQgNDcuNjQ4Mzc4LDM2Ljc4MDIzNiBMMzguNjMxNjgzNCwyNy43OTg4NTU5IFoiIGlkPSJGaWxsLTkiIGZpbGw9IiMwMDQ2QUQiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
          else
            return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iSWNvbnMtKy1sb2dvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHlsZT0ib3BhY2l0eTowLjU0Ij4KICAgICAgICA8ZyBpZD0iU1AtTG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYxLjAwMDAwMCwgLTYxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0ic3ltYm9sIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MS4wMDAwMDAsIDYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM0LjA4MTAyNzcsMjMuMjYyODk5MiBMMjUuMDYyMDU4NSwxNC4yNzg2ODY0IEMyNC42MDQyODYxLDEzLjgyNDMyMDMgMjMuODYzODg5LDEzLjgyNDMyMDMgMjMuNDA0NDEwNywxNC4yNzg2ODY0IEwxNC4zODc3MTYxLDIzLjI2Mjg5OTIgQzEzLjkyNzY2OSwyMy43MTc4MzE5IDEzLjkyNzY2OSwyNC40NTYwMzUzIDE0LjM4NzcxNjEsMjQuOTEyNjY3NiBMMjMuNDA0NDEwNywzMy44OTYzMTM5IEMyMy42MzE4NzUyLDM0LjEyNDA2MzUgMjMuOTMxNTU5NywzNC4yMzc5MzgzIDI0LjIzMjk1MDMsMzQuMjM3OTM4MyBDMjQuNTMyMDY2MSwzNC4yMzc5MzgzIDI0LjgzNTE2MjYsMzQuMTI0MDYzNSAyNS4wNjIwNTg1LDMzLjg5NjMxMzkgTDM0LjA4MTAyNzcsMjQuOTEyNjY3NiBDMzQuMjk5MzkzNywyNC42OTA1ODM0IDM0LjQyMjc5MzIsMjQuMzk4MjQ4MSAzNC40MjI3OTMyLDI0LjA4ODM1IEMzNC40MjI3OTMyLDIzLjc3NjE4NTcgMzQuMjk5MzkzNywyMy40ODA0NTExIDM0LjA4MTAyNzcsMjMuMjYyODk5MiBaIiBpZD0iRmlsbC0xIiBmaWxsPSIjMDAwMDAwIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuNTM4Nzc5NSwyNy43NDc4NjcyIEMxMS4wODEwMDcxLDI3LjI5NDYzNDEgMTAuMzQwNjEsMjcuMjk0NjM0MSA5Ljg4MjgzNzYzLDI3Ljc0Nzg2NzIgTDAuODY3ODQ5MDQ5LDM2LjczMjY0NjUgQzAuNDA4MzcwNjY4LDM3LjE4ODE0NTggMC40MDgzNzA2NjgsMzcuOTI1MjE2MSAwLjg2Nzg0OTA0OSwzOC4zODM1NDggTDkuODgyODM3NjMsNDcuMzY4MzI3MyBDMTAuMTEwODcwOCw0Ny41OTM4MTA4IDEwLjQxMTEyNCw0Ny43MDk5NTE4IDEwLjcxMjUxNDYsNDcuNzA5OTUxOCBDMTEuMDA3MDgxMSw0Ny43MDk5NTE4IDExLjMxMTg4MzYsNDcuNTkzODEwOCAxMS41Mzg3Nzk1LDQ3LjM2ODMyNzMgTDIwLjU2MTcyOTQsMzguMzgzNTQ4IEMyMC43Nzc4MjA3LDM4LjE2MDg5NzMgMjAuOTA1MjAwOCwzNy44NzA4MjgxIDIwLjkwNTIwMDgsMzcuNTU2Mzk3NiBDMjAuOTA1MjAwOCwzNy4yNDU5MzMgMjAuNzc3ODIwNywzNi45NTE4OTggMjAuNTYxNzI5NCwzNi43MzI2NDY1IEwxMS41Mzg3Nzk1LDI3Ljc0Nzg2NzIgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzAwQTlFMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM4LjU2NjE3MzYsMC44MjMzODU5NCBDMzguMTA4OTY5OSwwLjM2Nzg4NjY5MiAzNy4zNjQ1OTIyLDAuMzY1MDUzOTg1IDM2LjkwOTY2MzEsMC44MjMzODU5NCBMMjcuODkyOTY4NSw5LjgwOTI5ODM1IEMyNy40MzUxOTYxLDEwLjI2MTk2NDkgMjcuNDM1MTk2MSwxMS4wMDE4Njc5IDI3Ljg5Mjk2ODUsMTEuNDU4NTAwMiBMMzYuOTA5NjYzMSwyMC40NDMyNzk1IEMzNy4xMzU5OTAzLDIwLjY2OTg5NjEgMzcuNDM1MTA2MiwyMC43ODI2Mzc4IDM3LjczNjQ5NjcsMjAuNzgyNjM3OCBDMzguMDM1NjEyNiwyMC43ODI2Mzc4IDM4LjMzNTI5NzEsMjAuNjY5ODk2MSAzOC41NjYxNzM2LDIwLjQ0MzI3OTUgTDQ3LjU4Mjg2ODIsMTEuNDU4NTAwMiBDNDcuODAxODAyOCwxMS4yMzQ3MTY0IDQ3LjkyNTIwMjQsMTAuOTQ0NjQ3MiA0Ny45MjUyMDI0LDEwLjYzMTkxNjQgQzQ3LjkyNTIwMjQsMTAuMzE5NzUyMSA0Ny44MDE4MDI4LDEwLjAyOTExNjQgNDcuNTgyODY4Miw5LjgwNTMzMjU2IEwzOC41NjYxNzM2LDAuODIzMzg1OTQgWiIgaWQ9IkZpbGwtNSIgZmlsbD0iI0Q2MTgxOCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjUzMDA3OSwwLjc5NjgxNTE1IEMxMS4wNzQ1ODEzLDAuMzQzMDE1NTI2IDEwLjMyNjc5MTYsMC4zNDMwMTU1MjYgOS44NzU4NDMxLDAuNzk2ODE1MTUgTDAuODU3NDQyNTQ2LDkuNzgxMDI3OTMgQzAuMzk3Mzk1NTAzLDEwLjIzNjUyNzIgMC4zOTczOTU1MDMsMTAuOTc2NDMwMiAwLjg1NzQ0MjU0NiwxMS40MzMwNjI1IEw5Ljg3NTg0MzEsMjAuNDE2MTQyMiBDMTAuMTAyMTcwMywyMC42NDcyOTExIDEwLjQwMTI4NjIsMjAuNzU3MjAwMSAxMC43MDI2NzY3LDIwLjc1NzIwMDEgQzExLjAwNDA2NzIsMjAuNzU3MjAwMSAxMS4zMDMxODMxLDIwLjY0NzI5MTEgMTEuNTMwMDc5LDIwLjQxNjE0MjIgTDIwLjU0NjIwNDksMTEuNDMzMDYyNSBDMjAuNzY3NDE0MiwxMS4yMTI2Nzc5IDIwLjg5NDIyNTcsMTAuOTIxNDc1NyAyMC44OTQyMjU3LDEwLjYwNDc3OTEgQzIwLjg5NDIyNTcsMTAuMjk0MzE0NCAyMC43Njc0MTQyLDEwLjAwMjU0NTYgMjAuNTQ2MjA0OSw5Ljc4MTAyNzkzIEwxMS41MzAwNzksMC43OTY4MTUxNSBaIiBpZD0iRmlsbC03IiBmaWxsPSIjN0FCODAwIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzguNjMxNjgzNCwyNy43OTg4NTU5IEMzOC4xNzQ0Nzk3LDI3LjM0MjIyMzYgMzcuNDI5NTMzMywyNy4zNDIyMjM2IDM2Ljk3MzQ2NjksMjcuNzk4ODU1OSBMMjcuOTU5NjE1NiwzNi43ODAyMzYgQzI3LjUwMTg0MzIsMzcuMjM4MDAxNCAyNy41MDE4NDMyLDM3Ljk3NTA3MTcgMjcuOTU5NjE1NiwzOC40MzExMzc1IEwzNi45NzM0NjY5LDQ3LjQxODE4MyBDMzcuMjAwMzYyOCw0Ny42NDQ3OTk1IDM3LjQ5ODkxLDQ3Ljc1OTgwNzQgMzcuODAwODY5Miw0Ny43NTk4MDc0IEMzOC4xMDIyNTk3LDQ3Ljc1OTgwNzQgMzguMzk4NTMyMyw0Ny42NDQ3OTk1IDM4LjYzMTY4MzQsNDcuNDE4MTgzIEw0Ny42NDgzNzgsMzguNDMxMTM3NSBDNDcuODY2NzQ0LDM4LjIxMTg4NiA0Ny45OTE4NDk1LDM3LjkxODk4NDEgNDcuOTkxODQ5NSwzNy42MDkwODYgQzQ3Ljk5MTg0OTUsMzcuMjk1Nzg4NiA0Ny44NjY3NDQsMzcuMDA0NTg2NCA0Ny42NDgzNzgsMzYuNzgwMjM2IEwzOC42MzE2ODM0LDI3Ljc5ODg1NTkgWiIgaWQ9IkZpbGwtOSIgZmlsbD0iIzAwNDZBRCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4';
        }
        else
        {
          // PNG
          if (Self.IsPasswordManagerLocked)
            return 'data:image/png;base64,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';
          else
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGtklEQVRo3r3ZX2xTVRwH8O/vnNP1zzoXHIXVCZsgiogOdLBo4zQanyQqRIeIhmA0/okx+ubbssQHY2I0JD7og8aRYBhbRdQH48NYTGFhaNDBjCjiwHXrhhvQ7h/33vPzoVbH1nt7b1s8j723Pef3O597zu/cEgq0Dw5vqIfGdgIiWvOh8QnjSHvroIVr0P5EXaUR9j1CAps1+Lil575akxnNOH2HnC6++83qJYGK8FaCaAYAZp7RzPELfxmJcgdxEpCB0IqYUnIrEYXArE3N3zFmv7w5k0p7DuC9noZgBap3gEUTEWTucwZPsakPLpv8KdHairIEwYA8kx3840RU+e/nmk0mTkxdnu5ej/E51wF8+O2qoCHD2wXJe/J2yJhhS+/tnfzxxIESg+gEZFNw5QbpE8+AKLS4L2YwfxtID31ZC1wpGMBCNrZZKwOnRWzsO7PlRG7Y2E998Zzs2Njer9nU4D4rnT6wBhOziwIoxMY+Od45FWLj1DTrXvNyOp4LgrywKQcn12ycZz4Bg79omB66RB8c3lAP5ofcsimFk1c2Dp2ZDD5mXL68X0FjO5FY7bwjFG4EqoSU21I1d6aAn37Jd89v/hvXVii5FUVmfl5nikD3+qqqphSASLk2IyIESVMDgLwBqAp1S8mDv7rDOxRrPgSJbYTSf5iZT5ts9NtdV1emEtofug0k6svQV8Zi3aXGJ4wjS2t8JAQ/ThCVJfzgOQbve/3hwQm7e1bMjY+dFXWfkfLtIkHREvpKgzm+Kn3uFAFAWydkpObOGAmxtZiZYObTDN736oM/jsz7WEajkbUA8cjI2C/Afw/22WDdTcLn2wGi+mIyD+buC+mh/ibA+PfRfbITMrakcaNP0U4vQTDzaYvNjtceOjk+f/C1tctiSsktAIFZfzU8PJqYH8RQuDYK4d/thRMzZ4RpdayYPj9AgF60E3d2QqZqGmNCwBWnf9h8vDDztbWRDUr5nsmt88yYYbb2Dg+Pnlg4E245ZdlY8fr0+b7c4PPWQm452bHJZl4t2qSY9QwzxxfOhBtOWTZW94X0+f4mwChYjRbi5MxG2W5SzDzFrA964ZSPjavzgB0nt2wcayeXnOzYuD6RLeTklY1DdVyQkxMb1wHkOD2w7PbVbMgGE+bxBet8QTYOrvNyOu+PRLQMbtZanG6Y/eOMXeZdB+DQXLPxyslbWVT04L2xceJkmhwfHb16Jq5pANFo9HYpaRcRVZflUM/6ktbWJ8nk2M9ev6uK69JiQJYo8Ko8aiLi/5lQ7T+nKpRIiDNaozuZTPbDYbW5Jg/x8uWRjT6fb2fxDzFntLY6ksnUAAqsNsUH0Naj/DfWrJVarJ5m4yhe2jhWpmU0rbUVTyZTffMHH4i9fb3fJ+4mg4cuJo6fAQ5YxQfQ1qOCdctbCPyYEBTQWp8zTGuf8Urj2VI42bEJx96O+irUDkF0K7OesZjil8bSCQy2W94DaOtR/rqlLYrko0QIzlu7RzTw6cwL684Ww8mOTXbw8jlBYuVVm53WByd7GxJAq+U+gLYeFYgubRJC7BCCAnmWvXOGaX1y5eXGpMdiLi+b6nvfiQi/eFYQ3ZrvlQ3Aeyd6jp3Ix4kKsbF9weSRkxs2TpudHSdyw8ahFHDFyQsbx9opDydyy8YhOw6c5BaAtNbWIS9snN4AZjnVn8gFQV7YeOV0ww3L1lgWcSqV+t0rG8dSXHN8cnwqgcF2i/D+QJU/hE1u2XjktKh5YePQ1zRrfD7ZuyJBoY9OPQ2guZjM5+NkEj6ae379eL7rwZa3lgRkYHcxmc/LSesORYRNRKUPPvumT6wkrTcD+DrfdT/77yrH4LN9UZCFeEox6++J5H3lKYs5Y87xr7adCh7SzBlBFEZ5OhxQ0wYdCvkgSKCZii6vs5uUpRE3L6z/ze6eyd6p36vuD3crgW2CqKqEZ8Bk5h8Yqiu7Cn04WB0CPyYkxYp+0arRPYuZfrzYVKAkblPVLeFmKcUTxZbiWvMxGObnk4k3J/7bB/b0BUL+8DYhxf1eB29Y6Lgy0jmA9naXJXGbqG6pvEtKudNrEBbzUbDcf/HwGzOLd+I9fYFQ4LpWt5xybGaT6/rQTh7r+Sdl9X3NMang7k8+sMUa3zPkvtzg89dCLjl5Y2PT1rXJJZHKGInCpbjWuh+GFZ9MvDlRuBotwKk4Ng4z0bJpoxMni/noRZb7MS/zhc8DNpxKY+ONkx0b9yeyBZzKwsYDJzs23s7Ee/oCwWDVFgG+w2TumhvuOlU6G4eZeKCpUZDYzkwnL0J2wSbzufY3by3FsWPvjOUAAAAASUVORK5CYII';
        }
      }
      AButtonInfo.GetImageHoverSrc = function () 
      { 
        if (spAutofillCore.HTMLTools.IsSVGSupported())
        {
          // SVG
          if (Self.IsPasswordManagerLocked)
            return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz4KICAgICAgPGZpbHRlciBpZD0iRGVzYXR1cmF0ZSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgaW49IlNvdXJjZUdyYXBoaWMiIHZhbHVlcz0iMCIvPgogICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJJY29ucy0rLWxvZ28iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJvcGFjaXR5OjAuNjYiIGZpbHRlcj0idXJsKCNEZXNhdHVyYXRlKSI+CiAgICAgICAgPGcgaWQ9IlNQLUxvZ28iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MS4wMDAwMDAsIC02MS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9InN5bWJvbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjEuMDAwMDAwLCA2MS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNC4wODEwMjc3LDIzLjI2Mjg5OTIgTDI1LjA2MjA1ODUsMTQuMjc4Njg2NCBDMjQuNjA0Mjg2MSwxMy44MjQzMjAzIDIzLjg2Mzg4OSwxMy44MjQzMjAzIDIzLjQwNDQxMDcsMTQuMjc4Njg2NCBMMTQuMzg3NzE2MSwyMy4yNjI4OTkyIEMxMy45Mjc2NjksMjMuNzE3ODMxOSAxMy45Mjc2NjksMjQuNDU2MDM1MyAxNC4zODc3MTYxLDI0LjkxMjY2NzYgTDIzLjQwNDQxMDcsMzMuODk2MzEzOSBDMjMuNjMxODc1MiwzNC4xMjQwNjM1IDIzLjkzMTU1OTcsMzQuMjM3OTM4MyAyNC4yMzI5NTAzLDM0LjIzNzkzODMgQzI0LjUzMjA2NjEsMzQuMjM3OTM4MyAyNC44MzUxNjI2LDM0LjEyNDA2MzUgMjUuMDYyMDU4NSwzMy44OTYzMTM5IEwzNC4wODEwMjc3LDI0LjkxMjY2NzYgQzM0LjI5OTM5MzcsMjQuNjkwNTgzNCAzNC40MjI3OTMyLDI0LjM5ODI0ODEgMzQuNDIyNzkzMiwyNC4wODgzNSBDMzQuNDIyNzkzMiwyMy43NzYxODU3IDM0LjI5OTM5MzcsMjMuNDgwNDUxMSAzNC4wODEwMjc3LDIzLjI2Mjg5OTIgWiIgaWQ9IkZpbGwtMSIgZmlsbD0iIzAwMDAwMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjUzODc3OTUsMjcuNzQ3ODY3MiBDMTEuMDgxMDA3MSwyNy4yOTQ2MzQxIDEwLjM0MDYxLDI3LjI5NDYzNDEgOS44ODI4Mzc2MywyNy43NDc4NjcyIEwwLjg2Nzg0OTA0OSwzNi43MzI2NDY1IEMwLjQwODM3MDY2OCwzNy4xODgxNDU4IDAuNDA4MzcwNjY4LDM3LjkyNTIxNjEgMC44Njc4NDkwNDksMzguMzgzNTQ4IEw5Ljg4MjgzNzYzLDQ3LjM2ODMyNzMgQzEwLjExMDg3MDgsNDcuNTkzODEwOCAxMC40MTExMjQsNDcuNzA5OTUxOCAxMC43MTI1MTQ2LDQ3LjcwOTk1MTggQzExLjAwNzA4MTEsNDcuNzA5OTUxOCAxMS4zMTE4ODM2LDQ3LjU5MzgxMDggMTEuNTM4Nzc5NSw0Ny4zNjgzMjczIEwyMC41NjE3Mjk0LDM4LjM4MzU0OCBDMjAuNzc3ODIwNywzOC4xNjA4OTczIDIwLjkwNTIwMDgsMzcuODcwODI4MSAyMC45MDUyMDA4LDM3LjU1NjM5NzYgQzIwLjkwNTIwMDgsMzcuMjQ1OTMzIDIwLjc3NzgyMDcsMzYuOTUxODk4IDIwLjU2MTcyOTQsMzYuNzMyNjQ2NSBMMTEuNTM4Nzc5NSwyNy43NDc4NjcyIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiMwMEE5RTAiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOC41NjYxNzM2LDAuODIzMzg1OTQgQzM4LjEwODk2OTksMC4zNjc4ODY2OTIgMzcuMzY0NTkyMiwwLjM2NTA1Mzk4NSAzNi45MDk2NjMxLDAuODIzMzg1OTQgTDI3Ljg5Mjk2ODUsOS44MDkyOTgzNSBDMjcuNDM1MTk2MSwxMC4yNjE5NjQ5IDI3LjQzNTE5NjEsMTEuMDAxODY3OSAyNy44OTI5Njg1LDExLjQ1ODUwMDIgTDM2LjkwOTY2MzEsMjAuNDQzMjc5NSBDMzcuMTM1OTkwMywyMC42Njk4OTYxIDM3LjQzNTEwNjIsMjAuNzgyNjM3OCAzNy43MzY0OTY3LDIwLjc4MjYzNzggQzM4LjAzNTYxMjYsMjAuNzgyNjM3OCAzOC4zMzUyOTcxLDIwLjY2OTg5NjEgMzguNTY2MTczNiwyMC40NDMyNzk1IEw0Ny41ODI4NjgyLDExLjQ1ODUwMDIgQzQ3LjgwMTgwMjgsMTEuMjM0NzE2NCA0Ny45MjUyMDI0LDEwLjk0NDY0NzIgNDcuOTI1MjAyNCwxMC42MzE5MTY0IEM0Ny45MjUyMDI0LDEwLjMxOTc1MjEgNDcuODAxODAyOCwxMC4wMjkxMTY0IDQ3LjU4Mjg2ODIsOS44MDUzMzI1NiBMMzguNTY2MTczNiwwLjgyMzM4NTk0IFoiIGlkPSJGaWxsLTUiIGZpbGw9IiNENjE4MTgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS41MzAwNzksMC43OTY4MTUxNSBDMTEuMDc0NTgxMywwLjM0MzAxNTUyNiAxMC4zMjY3OTE2LDAuMzQzMDE1NTI2IDkuODc1ODQzMSwwLjc5NjgxNTE1IEwwLjg1NzQ0MjU0Niw5Ljc4MTAyNzkzIEMwLjM5NzM5NTUwMywxMC4yMzY1MjcyIDAuMzk3Mzk1NTAzLDEwLjk3NjQzMDIgMC44NTc0NDI1NDYsMTEuNDMzMDYyNSBMOS44NzU4NDMxLDIwLjQxNjE0MjIgQzEwLjEwMjE3MDMsMjAuNjQ3MjkxMSAxMC40MDEyODYyLDIwLjc1NzIwMDEgMTAuNzAyNjc2NywyMC43NTcyMDAxIEMxMS4wMDQwNjcyLDIwLjc1NzIwMDEgMTEuMzAzMTgzMSwyMC42NDcyOTExIDExLjUzMDA3OSwyMC40MTYxNDIyIEwyMC41NDYyMDQ5LDExLjQzMzA2MjUgQzIwLjc2NzQxNDIsMTEuMjEyNjc3OSAyMC44OTQyMjU3LDEwLjkyMTQ3NTcgMjAuODk0MjI1NywxMC42MDQ3NzkxIEMyMC44OTQyMjU3LDEwLjI5NDMxNDQgMjAuNzY3NDE0MiwxMC4wMDI1NDU2IDIwLjU0NjIwNDksOS43ODEwMjc5MyBMMTEuNTMwMDc5LDAuNzk2ODE1MTUgWiIgaWQ9IkZpbGwtNyIgZmlsbD0iIzdBQjgwMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM4LjYzMTY4MzQsMjcuNzk4ODU1OSBDMzguMTc0NDc5NywyNy4zNDIyMjM2IDM3LjQyOTUzMzMsMjcuMzQyMjIzNiAzNi45NzM0NjY5LDI3Ljc5ODg1NTkgTDI3Ljk1OTYxNTYsMzYuNzgwMjM2IEMyNy41MDE4NDMyLDM3LjIzODAwMTQgMjcuNTAxODQzMiwzNy45NzUwNzE3IDI3Ljk1OTYxNTYsMzguNDMxMTM3NSBMMzYuOTczNDY2OSw0Ny40MTgxODMgQzM3LjIwMDM2MjgsNDcuNjQ0Nzk5NSAzNy40OTg5MSw0Ny43NTk4MDc0IDM3LjgwMDg2OTIsNDcuNzU5ODA3NCBDMzguMTAyMjU5Nyw0Ny43NTk4MDc0IDM4LjM5ODUzMjMsNDcuNjQ0Nzk5NSAzOC42MzE2ODM0LDQ3LjQxODE4MyBMNDcuNjQ4Mzc4LDM4LjQzMTEzNzUgQzQ3Ljg2Njc0NCwzOC4yMTE4ODYgNDcuOTkxODQ5NSwzNy45MTg5ODQxIDQ3Ljk5MTg0OTUsMzcuNjA5MDg2IEM0Ny45OTE4NDk1LDM3LjI5NTc4ODYgNDcuODY2NzQ0LDM3LjAwNDU4NjQgNDcuNjQ4Mzc4LDM2Ljc4MDIzNiBMMzguNjMxNjgzNCwyNy43OTg4NTU5IFoiIGlkPSJGaWxsLTkiIGZpbGw9IiMwMDQ2QUQiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
          else
            return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iSWNvbnMtKy1sb2dvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHlsZT0ib3BhY2l0eTowLjY2Ij4KICAgICAgICA8ZyBpZD0iU1AtTG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYxLjAwMDAwMCwgLTYxLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0ic3ltYm9sIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MS4wMDAwMDAsIDYxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM0LjA4MTAyNzcsMjMuMjYyODk5MiBMMjUuMDYyMDU4NSwxNC4yNzg2ODY0IEMyNC42MDQyODYxLDEzLjgyNDMyMDMgMjMuODYzODg5LDEzLjgyNDMyMDMgMjMuNDA0NDEwNywxNC4yNzg2ODY0IEwxNC4zODc3MTYxLDIzLjI2Mjg5OTIgQzEzLjkyNzY2OSwyMy43MTc4MzE5IDEzLjkyNzY2OSwyNC40NTYwMzUzIDE0LjM4NzcxNjEsMjQuOTEyNjY3NiBMMjMuNDA0NDEwNywzMy44OTYzMTM5IEMyMy42MzE4NzUyLDM0LjEyNDA2MzUgMjMuOTMxNTU5NywzNC4yMzc5MzgzIDI0LjIzMjk1MDMsMzQuMjM3OTM4MyBDMjQuNTMyMDY2MSwzNC4yMzc5MzgzIDI0LjgzNTE2MjYsMzQuMTI0MDYzNSAyNS4wNjIwNTg1LDMzLjg5NjMxMzkgTDM0LjA4MTAyNzcsMjQuOTEyNjY3NiBDMzQuMjk5MzkzNywyNC42OTA1ODM0IDM0LjQyMjc5MzIsMjQuMzk4MjQ4MSAzNC40MjI3OTMyLDI0LjA4ODM1IEMzNC40MjI3OTMyLDIzLjc3NjE4NTcgMzQuMjk5MzkzNywyMy40ODA0NTExIDM0LjA4MTAyNzcsMjMuMjYyODk5MiBaIiBpZD0iRmlsbC0xIiBmaWxsPSIjMDAwMDAwIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuNTM4Nzc5NSwyNy43NDc4NjcyIEMxMS4wODEwMDcxLDI3LjI5NDYzNDEgMTAuMzQwNjEsMjcuMjk0NjM0MSA5Ljg4MjgzNzYzLDI3Ljc0Nzg2NzIgTDAuODY3ODQ5MDQ5LDM2LjczMjY0NjUgQzAuNDA4MzcwNjY4LDM3LjE4ODE0NTggMC40MDgzNzA2NjgsMzcuOTI1MjE2MSAwLjg2Nzg0OTA0OSwzOC4zODM1NDggTDkuODgyODM3NjMsNDcuMzY4MzI3MyBDMTAuMTEwODcwOCw0Ny41OTM4MTA4IDEwLjQxMTEyNCw0Ny43MDk5NTE4IDEwLjcxMjUxNDYsNDcuNzA5OTUxOCBDMTEuMDA3MDgxMSw0Ny43MDk5NTE4IDExLjMxMTg4MzYsNDcuNTkzODEwOCAxMS41Mzg3Nzk1LDQ3LjM2ODMyNzMgTDIwLjU2MTcyOTQsMzguMzgzNTQ4IEMyMC43Nzc4MjA3LDM4LjE2MDg5NzMgMjAuOTA1MjAwOCwzNy44NzA4MjgxIDIwLjkwNTIwMDgsMzcuNTU2Mzk3NiBDMjAuOTA1MjAwOCwzNy4yNDU5MzMgMjAuNzc3ODIwNywzNi45NTE4OTggMjAuNTYxNzI5NCwzNi43MzI2NDY1IEwxMS41Mzg3Nzk1LDI3Ljc0Nzg2NzIgWiIgaWQ9IkZpbGwtMyIgZmlsbD0iIzAwQTlFMCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM4LjU2NjE3MzYsMC44MjMzODU5NCBDMzguMTA4OTY5OSwwLjM2Nzg4NjY5MiAzNy4zNjQ1OTIyLDAuMzY1MDUzOTg1IDM2LjkwOTY2MzEsMC44MjMzODU5NCBMMjcuODkyOTY4NSw5LjgwOTI5ODM1IEMyNy40MzUxOTYxLDEwLjI2MTk2NDkgMjcuNDM1MTk2MSwxMS4wMDE4Njc5IDI3Ljg5Mjk2ODUsMTEuNDU4NTAwMiBMMzYuOTA5NjYzMSwyMC40NDMyNzk1IEMzNy4xMzU5OTAzLDIwLjY2OTg5NjEgMzcuNDM1MTA2MiwyMC43ODI2Mzc4IDM3LjczNjQ5NjcsMjAuNzgyNjM3OCBDMzguMDM1NjEyNiwyMC43ODI2Mzc4IDM4LjMzNTI5NzEsMjAuNjY5ODk2MSAzOC41NjYxNzM2LDIwLjQ0MzI3OTUgTDQ3LjU4Mjg2ODIsMTEuNDU4NTAwMiBDNDcuODAxODAyOCwxMS4yMzQ3MTY0IDQ3LjkyNTIwMjQsMTAuOTQ0NjQ3MiA0Ny45MjUyMDI0LDEwLjYzMTkxNjQgQzQ3LjkyNTIwMjQsMTAuMzE5NzUyMSA0Ny44MDE4MDI4LDEwLjAyOTExNjQgNDcuNTgyODY4Miw5LjgwNTMzMjU2IEwzOC41NjYxNzM2LDAuODIzMzg1OTQgWiIgaWQ9IkZpbGwtNSIgZmlsbD0iI0Q2MTgxOCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjUzMDA3OSwwLjc5NjgxNTE1IEMxMS4wNzQ1ODEzLDAuMzQzMDE1NTI2IDEwLjMyNjc5MTYsMC4zNDMwMTU1MjYgOS44NzU4NDMxLDAuNzk2ODE1MTUgTDAuODU3NDQyNTQ2LDkuNzgxMDI3OTMgQzAuMzk3Mzk1NTAzLDEwLjIzNjUyNzIgMC4zOTczOTU1MDMsMTAuOTc2NDMwMiAwLjg1NzQ0MjU0NiwxMS40MzMwNjI1IEw5Ljg3NTg0MzEsMjAuNDE2MTQyMiBDMTAuMTAyMTcwMywyMC42NDcyOTExIDEwLjQwMTI4NjIsMjAuNzU3MjAwMSAxMC43MDI2NzY3LDIwLjc1NzIwMDEgQzExLjAwNDA2NzIsMjAuNzU3MjAwMSAxMS4zMDMxODMxLDIwLjY0NzI5MTEgMTEuNTMwMDc5LDIwLjQxNjE0MjIgTDIwLjU0NjIwNDksMTEuNDMzMDYyNSBDMjAuNzY3NDE0MiwxMS4yMTI2Nzc5IDIwLjg5NDIyNTcsMTAuOTIxNDc1NyAyMC44OTQyMjU3LDEwLjYwNDc3OTEgQzIwLjg5NDIyNTcsMTAuMjk0MzE0NCAyMC43Njc0MTQyLDEwLjAwMjU0NTYgMjAuNTQ2MjA0OSw5Ljc4MTAyNzkzIEwxMS41MzAwNzksMC43OTY4MTUxNSBaIiBpZD0iRmlsbC03IiBmaWxsPSIjN0FCODAwIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzguNjMxNjgzNCwyNy43OTg4NTU5IEMzOC4xNzQ0Nzk3LDI3LjM0MjIyMzYgMzcuNDI5NTMzMywyNy4zNDIyMjM2IDM2Ljk3MzQ2NjksMjcuNzk4ODU1OSBMMjcuOTU5NjE1NiwzNi43ODAyMzYgQzI3LjUwMTg0MzIsMzcuMjM4MDAxNCAyNy41MDE4NDMyLDM3Ljk3NTA3MTcgMjcuOTU5NjE1NiwzOC40MzExMzc1IEwzNi45NzM0NjY5LDQ3LjQxODE4MyBDMzcuMjAwMzYyOCw0Ny42NDQ3OTk1IDM3LjQ5ODkxLDQ3Ljc1OTgwNzQgMzcuODAwODY5Miw0Ny43NTk4MDc0IEMzOC4xMDIyNTk3LDQ3Ljc1OTgwNzQgMzguMzk4NTMyMyw0Ny42NDQ3OTk1IDM4LjYzMTY4MzQsNDcuNDE4MTgzIEw0Ny42NDgzNzgsMzguNDMxMTM3NSBDNDcuODY2NzQ0LDM4LjIxMTg4NiA0Ny45OTE4NDk1LDM3LjkxODk4NDEgNDcuOTkxODQ5NSwzNy42MDkwODYgQzQ3Ljk5MTg0OTUsMzcuMjk1Nzg4NiA0Ny44NjY3NDQsMzcuMDA0NTg2NCA0Ny42NDgzNzgsMzYuNzgwMjM2IEwzOC42MzE2ODM0LDI3Ljc5ODg1NTkgWiIgaWQ9IkZpbGwtOSIgZmlsbD0iIzAwNDZBRCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4';
        }
        else
        {
          // PNG
          if (Self.IsPasswordManagerLocked)
            return 'data:image/png;base64,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';
          else
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGxklEQVRo3r3ZXWwUVRQH8P+59263u2xpsLRsWSuNCphaLWr9RIqCn6DxRXlUEyl+oSjGz5emxqhpJCKKtJSI+lh9MYZiY7FtCAGJxhSwiV+BWnfpB7Zlt5SWmbnHh7pY2p3Zmd3F+7iz3XPPmd/ce+6UkGZs71y2FBobCYhozbuHho299et6TFyE8Rcic42Q71ESuEuDv7P05GeLx/pPO/0NOV3c0nZFcX5eaANB3AUAzDymmZtP/W205jqJY4DKD5atUUrWElEIzNrU/DVj4tMrxwZGPSfwfkd5KA+Fm8DiTiLI5OcMTrCpd5WMHNmzbh2sXEyeAflHsGytUnI9ERWc/1yzwcStZ+LjTZUYOus6gaZvL59jyNBzguS9KQMyxtjSW7pGuvd/kWUSLYCsDly2QvrESyAKzY7FDOaW/ETvp2FgIm0CM9nYVi0HnGaxsQ9my4ncsLG/9ZlzsmNj+33NhgZ/ayUS2xdjeHxWAunY2BfHO6d0bJyGZv2VGU/sTCZBXtjkgpNrNs53fi8M3lU+3jtM2zuXLQXzw27ZZMPJKxuHYCaD2414/EMFjY1EotJ5R0g/CFQAKWsHiq7tA478lOo7v/svvSFPyVpkWPlpwRSB7vMVFMQVgEiuNiMihEjTVQBSJqDyVFXWk78w4C2KNe+GxAZC9j/MzN0mG/vsrqtzZ1q1P1gNEktyECtusd6hhoaNvfOLfCQEryeIgix+8DcGb33h7p5Bu++UTQ5Fj4vIB6R8r5CgRVnEOg3mpssTfx4mAKhrgSouunYNCVGbyZ1g5m4Gb924qvvE9IKXlhZfDxCfPDn4E4Dzq9PxQKRC+HybQLQkk8qDufFUore9GjDOP7qPtEAun1dV41O02UsSzNxtsdnw/OpjsWkfy3C4ZK1S8jGAwKw/i0b79wD/rU69oXA5hP91L5yYOS5Mq6FsvO8gAXrWTtzSAjlQVLVWCLji9C+bt2dUXobDxSuU8r2UXOeZMcZsbYlG+/dPT+J4IFLhltMUG6tpUaKvLTn5lL2QW052bMLhkjVKqVmbFLMeY+bmaLS/1SunKTZW46lEX3s1YKTtRtNxcmajbDcpZk4w611eOKVi4+o8YMfJLRvH3sklJzs2rk9kMzl5ZePQHafl5MTGdQJJTneUXH0NG3KpCbNjxjqflo2D65Sc+vzFES0Dq7UW3eUTJ47aVd51Ag7DNRuvnLy1RZkNz2ycOJkmN/f3X8jpoiZQWlp6k5T0KhFdkpNDPeu/tbbeicUGf/RcycxCWhqQWQq8oI5MRPw/Ewr/e6pCloQ4rjUaY7FYOxxWm4vyEC9YUFzj8/k2Z/4Qc1xrqyEWGziINKtN5gnUdSj/pUU3SC0qx9n4Bk9dF83RMnpaa6spFhtomz75/OXvlvh94k4y+JfRAz8cBb6wMk+griMvEFnwIIGfEIICWutfDdP6wHimqicbTnZsQsvfLfflqU2CaBmzHrOYmk8PJlrRU296T6CuQ/kj8x9SJB+fPjFm9Gqg4WxtRU8mnOzYTE1evi6m9UPMnGCtd410le8B1lnuE6jrUPml81cJIV4QggIplr1fDdN659zTVSc8NnMp2RTe1rBQ+MXLgmhZqlc2AG8Z7ji8PxUnSsfG9gWTR05u2DhtdnacyA0bh1bAFScvbBx7pxScyC0bh+o4cJKPAsRaW594YeP0BnCK06L9ySTICxuvnBYuLKmyLNIDAwPHvLJxbMU1N48MnWlFT71J2Hp0nj+IVW7ZeOQ0a3hh49jFajSPdJXtoeDOn18EcHcmlU/FySS8Obm+MprqeqDmreJ8mf9GJpVPyUnr9xQRVhFlP/mpN31iCWm9GsDnqa772b8yF5OfikUhFuJ5xaw7ieQDuWmLOW5O8hHboIJ/0cxxQTQXuQl4SI0btDvogyCBeyjj9npqk7I0msxTlbYJjHSd+blgZWiHEnhKEBVm8QyYzNzFUDumVqGmnkuC4PVC0v0Zv2jVaJzA2XY8WZ2mJa5ThTWhe6QUT2e6aGjN+2CYO0cOvDb43z6w7VAw6A9tEFI85HXyhoWGcydbDqK+3mVLXCcKa+aslFJu9pqExdwGlh+Ndr44Nnsn3nYoGMyf+6xbTkk2E7GKNtSTx37+EVm44ua1UsHdP/nAFmt0MuTW5ORT90IuOXljYzMq6tS84jlrSKRvxbXW38GwmkYOvDaYvhtNwykzNg53oubGGidOFnPbKMuPMK3y6c8DNpyyY+ONkx0b9yeyGZxywsYDJzs23s7E2w4FA4GCxwT4VpP548nol4ezZ+NwJ+6ovl2Q2MhM349CNsKm8snxDz5HxZ839gnIAAAAAElFTkSuQmCC';
        }
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspAutofillAdapter._onContextButtonInitializeHandler() Error: ' + ErrorMessage);
    }
  };
  this._onSubscribeToClickElementHandler = function (AElement)
  {
    if (AElement)
    try
    {
      Self.PageEventsMonitor.ConnectToSubmitElementClick(AElement);
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspAutofillAdapter._onSubscribeToClickElementHandler() Error: ' + ErrorMessage);
    }
  };
  this._onSubscribeToEnterKeyPressHandler = function (AElement)
  {
    if (AElement)
    try
    {
      Self.PageEventsMonitor.ConnectToElementEnterKeyPress(AElement);
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspAutofillAdapter._onSubscribeToEnterKeyPressHandler() Error: ' + ErrorMessage);
    }
  };

  this.PageEventsMonitor = null;
  this.PageFocusChangedMonitor = null;
  this.IsAutofillingDocument = false;

  this.ConnectToPageEvents();
  this.ConnectToPageFocusChanged();
}

// ConnectToPageEvents()
TspAutofillAdapter.prototype.ConnectToPageEvents = function()
{
  this.PageEventsMonitor = spPageEventsMonitor.CreatePageEventsMonitor();
  this.InitPageEventsMonitor();
  this.PageEventsMonitor.ConnectToPageEvents();
  var ScreenCoordsConvertor = spAutofillCore.HTMLTools.CreateScreenCoordsConvertor(window);
  this.InitScreenCoordsConvertor(ScreenCoordsConvertor);
  spAutofillCore.HTMLTools.CreateDocumentClientAreaCalculator(window);
};

// ConnectToPageFocusChanged()
TspAutofillAdapter.prototype.ConnectToPageFocusChanged = function()
{
  var Self = this;
  this.PageFocusChangedMonitor = new TspPageFocusChangedMonitor();
  this.PageFocusChangedMonitor.onPageFocusChangedCallback = function (AWindow, AFocusedElement, AFocusedElementScreenRect) {
    Self.ProcessPageFocusChanged(AWindow, AFocusedElement, AFocusedElementScreenRect);
  };
  this.PageFocusChangedMonitor.onGetActiveWindowCallback = function() {
     return Self.GetActiveWindow();
  };
  this.PageFocusChangedMonitor.onGetElementScreenPositionCallback = function(AElement) {
     return Self.GetElementScreenPosition(AElement);
  };
  this.PageFocusChangedMonitor.ConnectToEvents();
};

// InitPageEventsMonitor()
TspAutofillAdapter.prototype.InitPageEventsMonitor = function()
{
  var Self = this;
  this.PageEventsMonitor.onFrameLoadedCallback = function (AWindow, AFrame) {
    Self.ProcessFrameLoaded(AWindow, AFrame);
  };
  this.PageEventsMonitor.onPageLoadedCallback = function (AWindow) {
    Self.ProcessPageLoaded(AWindow);
  };
  this.PageEventsMonitor.onPageSubmittingCallback = function (AEvent, AWindow, AForm) {
    Self.ProcessPageSubmitting(AEvent, AWindow, AForm);
  };
  this.PageEventsMonitor.onPageUnloadingCallback = function (AEvent, AWindow) {
    Self.ProcessPageUnloading(AEvent, AWindow);
  };
};

TspAutofillAdapter.prototype.InitScreenCoordsConvertor = function (AScreenCoordsConvertor)
{
  // empty
};

// ProcessContextButtonClicked()
TspAutofillAdapter.prototype.ProcessContextButtonClicked = function(AElement)
{
  if (AElement)
  try
  {
    var Self = this;
    var AWindow = this.GetActiveWindow();
    if (this.Log.Info)
      this._logPageEvent('ProcessContextButtonClicked', AWindow);
    
    this.GetDOMXml(AWindow,
      // AGetDOMXmlCallback
      function (ADOMXml)
      {
        Self.ContextButtonClicked(AElement, ADOMXml);
      }, 
      // AInitExportDOMManagerCallback
      function (AExportDOMManager) {
        AExportDOMManager.FocusedElement = AElement;
        AExportDOMManager.AllowExportForbiddenWindow = false; // deny to export cross-origin frames!
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessContextButtonClicked() Error: ' + ErrorMessage);
  }
};

// ProcessFrameLoaded(AWindow, AFrame)
TspAutofillAdapter.prototype.ProcessFrameLoaded = function(AWindow, AFrame)
{
  if (AWindow && AFrame)
  try
  {
    if (this.PageFocusChangedMonitor)
    {
      // connect the frame
      this.PageFocusChangedMonitor.ConnectToWindowEvents(AFrame);

      // connect to child frames which could be already loaded
      var frameDocument = spAutofillCore.HTMLTools.GetWindowDocument(AFrame);
      if (frameDocument)
      {
        var frameElements = frameDocument.querySelectorAll('iframe,frame');
        if (frameElements)
        {
          for(var i = 0, lenFrames = frameElements.length; i < lenFrames; i++)
          {
            var frame = frameElements[i];
            this.PageFocusChangedMonitor.ConnectToWindowEvents(frame);
          }
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessFrameLoaded() Error: ' + ErrorMessage);
  }
};

// ProcessPageLoaded(AWindow)
TspAutofillAdapter.prototype.ProcessPageLoaded = function(AWindow)
{
  if (AWindow)
  try
  {
    var Self = this;
    if (this.Log.OnLoad)
      this._logPageEvent('ProcessPageLoaded', AWindow);

    this.GetDOMXml(AWindow,
      // AGetDOMXmlCallback
      function (ADOMXml)
      {
        if (spStrings.IsStrEmpty(ADOMXml))
        {
          if (Self.Log.Autofill)
            spLog.logMessage('TspAutofillAdapter.ProcessPageLoaded() DOMXml is empty!');
          Self.PageEventsMonitor.TryStartLoadDelayTimer();
          return;
        }
        Self.PageLoaded(AWindow, ADOMXml);
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessPageLoaded() Error: ' + ErrorMessage);
  }
};

// ProcessPageSubmitting(AEvent, AWindow, AForm)
TspAutofillAdapter.prototype.ProcessPageSubmitting = function(AEvent, AWindow, AForm)
{
  if (AEvent && AWindow)
  try
  {
    if (this.Log.OnSubmit)
    {
      this._logPageEvent('ProcessPageSubmitting', AWindow);
      if (!AForm)
        spLog.logError('TspAutofillAdapter.ProcessPageSubmitting() Undefined submitting form!');
    }
    if (this.IsPasswordManagerLocked)
    {
      if (this.Log.OnSubmit)
        spLog.logError('TspAutofillAdapter.ProcessPageSubmitting() Ignored because Password Manager is locked now!');
      return;
    }
    if (this.IsAutofillingDocument)
    {
      if (this.Log.OnSubmit)
        spLog.logError('TspAutofillAdapter.ProcessPageSubmitting() Ignored because autofilling document now!');
      return;
    }
    this.HideShowedCaptionButtonBalloon();
      
    var Self = this;
    this.GetDOMXml(AWindow,
      // AGetDOMXmlCallback
      function (ADOMXml)
      {
        Self.PageSubmitted(AWindow, ADOMXml);
      },
      // AInitExportDOMManagerCallback
      function (AExportDOMManager) {
        AExportDOMManager.AllowExportForbiddenWindow = false; // deny to export cross-origin frames!
        if (AForm)
          AExportDOMManager.SubmittedElement = AForm;
        else
          AExportDOMManager.SubmittedElement = AEvent.target;
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessPageSubmitting() Error: ' + ErrorMessage);
  }
};

// ProcessPageUnloading(AEvent, AWindow)
TspAutofillAdapter.prototype.ProcessPageUnloading = function(AEvent, AWindow)
{
  if (AWindow)
  try
  {
    if (this.Log.OnLoad)
      this._logPageEvent('ProcessPageUnloading', AWindow);

    if (spAutofillCore.HTMLTools.IsTopWindow(AWindow))
      this.HideShowedCaptionButtonBalloon();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessPageUnloading() Error: ' + ErrorMessage);
  }
};

// ProcessPageFocusChanged(AWindow, AFocusedElement, AFocusedElementScreenRect)
TspAutofillAdapter.prototype.ProcessPageFocusChanged = function(AWindow, AFocusedElement, AFocusedElementScreenRect)
{
  try
  {
    if (AWindow && AFocusedElement && AFocusedElementScreenRect)
    {
      // keep value of editable input in cache
      spAutofillCore.InputValueCacheManager.attachToInput(AFocusedElement);

      // Feature TODO: We need to send DOMXml only if it's really necessary! At least if product running!
      if (!this.IsPasswordManagerLocked || this.DOMXmlLockedUsageEvents.ElementFocused)
      {
        // we have to receive focus event from every field on page
        var Self = this;
        this.GetDOMXml(AWindow,
          // AGetDOMXmlCallback
          function (ADOMXml)
          {
            Self.ElementFocused(AFocusedElementScreenRect, ADOMXml);
          }, 
          // AInitExportDOMManagerCallback
          function (AExportDOMManager) {
            AExportDOMManager.AllowExportForbiddenWindow = false; // deny to export cross-origin frames!
          }
        );
        return;
      }
    }

    // nothing focused or page scrolled
    this.ElementFocused(AFocusedElementScreenRect, '');
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.ProcessPageFocusChanged() Error: ' + ErrorMessage);
  }
};

TspAutofillAdapter.prototype.PasswordManagerLockedChanged = function (AIsLocked)
{
  this.IsPasswordManagerLocked = AIsLocked;
  spAutofillCore.ContextButtonManager.updateContextButtonsImage();
};

TspAutofillAdapter.prototype.DOMXmlLockedUsageChanged = function (AEvents)
{
  if (typeof AEvents != 'undefined')
    this.DOMXmlLockedUsageEvents = AEvents;
};

// _logPageEvent(AFunctionName, AWindow, AAdditionalInfo)
TspAutofillAdapter.prototype._logPageEvent = function(AFunctionName, AWindow, AAdditionalInfo)
{
  if (AFunctionName && AWindow)
  try
  {
    var ADocument = AWindow.document;
    if (AAdditionalInfo)
      AAdditionalInfo = ', ' + AAdditionalInfo;
    else
      AAdditionalInfo = '';
    spLog.logMessage('TspAutofillAdapter.' + AFunctionName + '() ADocument.URL: <' + ADocument.URL + '>' +
      ', frames.length: ' + AWindow.frames.length + AAdditionalInfo
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.' + AFunctionName + '() Error: ' + ErrorMessage);
  }
};

// SetIsAutofillingDocument(AValue)
TspAutofillAdapter.prototype.SetIsAutofillingDocument = function(AValue)
{
  this.IsAutofillingDocument = AValue;
  this.PageFocusChangedMonitor.Enabled = !AValue;
};

// GetElementScreenPosition(AElement)
TspAutofillAdapter.prototype.GetElementScreenPosition = function(AElement)
{
  var Result = spAutofillCore.HTMLTools.GetElementScreenPosition(AElement);
  return Result;
};

// GetDOMXml(AWindow)
TspAutofillAdapter.prototype.GetDOMXml = function(AWindow, AGetDOMXmlCallback, AInitExportDOMManagerCallback)
{
  if (!AGetDOMXmlCallback)
    throw 'AGetDOMXmlCallbackis undefined in TspAutofillAdapter.GetDOMXml()';

  var ExportDOMManager = spAutofillCore.CreateExportDOMManager();
  this.InitExportDOMManager(ExportDOMManager);
  if (AInitExportDOMManagerCallback)
    AInitExportDOMManagerCallback(ExportDOMManager);
  ExportDOMManager.ExportDOMToXml(AWindow, AGetDOMXmlCallback);
};
  
// InitExportDOMManager()
TspAutofillAdapter.prototype.InitExportDOMManager = function(AExportDOMManager)
{
  // empty
};

// AutofillDocument()
TspAutofillAdapter.prototype.AutofillDocument = function (
  AWindow, AAutofillXml)
{
  if (AWindow)
  try
  {
    // deny to process empty AutofillXML
    if (spStrings.IsStrEmpty(AAutofillXml))
      return;

    this.SetIsAutofillingDocument(true);
    if (this.Log.Autofill)
      spLog.logMessage('TspAutofillAdapter.AutofillDocument() Before autofilling document. ' + 
        'URL: <' + AWindow.document.URL + '>, ' +
        'AutofillXml: "' + AAutofillXml + '"'
      );														   
    // autofill the window
    var Self = this;
    var AutofillManager = spAutofillCore.CreateAutofillManager();
    AutofillManager.onUpdatePasswordManagerLockedCallback = this._onUpdatePasswordManagerLockedHandler;
    AutofillManager.onContextButtonInitializeCallback = this._onContextButtonInitializeHandler;
    AutofillManager.onSubscribeToClickElementCallback = this._onSubscribeToClickElementHandler;
    AutofillManager.onSubscribeToEnterKeyPressCallback = this._onSubscribeToEnterKeyPressHandler;
    AutofillManager.onAutofillCompleteCallback = function()
    {
      Self.AutofillDocumentComplete(AWindow, AutofillManager);
    };
    AutofillManager.AutofillWindowFromXml(AWindow, AAutofillXml);
  }
  catch (ErrorMessage)
  {										 
    this.SetIsAutofillingDocument(false);
    spLog.logError('TspAutofillAdapter.AutofillDocument() Error: ' + ErrorMessage);
  }
};

// AutofillDocumentComplete()
TspAutofillAdapter.prototype.AutofillDocumentComplete = function (
  AWindow, AAutofillManager)
{
  try
  {
    this.SetIsAutofillingDocument(false);

    var hasElementsToAutofill = AAutofillManager.NeedToFillElementsCount > 0;
    var hasElementsToClick = AAutofillManager.NeedToClickElementsCount > 0;
    if (hasElementsToAutofill)
    {
      // deny to handle OnSubmit right after autofill (occures in FF when JS initialized OnSubmit)
      if (hasElementsToClick)
        this.PageEventsMonitor.StoreLastPageSubmitTickCount();
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.AutofillDocumentComplete() Error: ' + ErrorMessage);
  }
};

TspAutofillAdapter.prototype.TryNotifyPageExtensionInstalled = function(AWindow)
{
  if (!AWindow)
    AWindow = window;
  var ADocument = AWindow.document;
  try
  {
    // notify only top level windows
    if (!spAutofillCore.HTMLTools.IsTopWindow(AWindow))
      return;
    // notify only our domain page
    if (!spStrings.SearchText('stickypassword.com', ADocument.location.hostname))
      return;

    var Self = this;
    var NotifyPageExtensionInstalled = function ()
    {
      // prevent having duplicate class name!
      var cnExtensionInstalled = 'spExtensionInstalled';
      if (!spStrings.SearchText(cnExtensionInstalled, ADocument.body.className))
      {
        ADocument.body.className += ' ' + cnExtensionInstalled;
        if (Self.Log.Info)
          spLog.logMessage('TspAutofillAdapter.TryNotifyPageExtensionInstalled() Set the body class.');
      }
    };
    if (ADocument.readyState == 'loaded' || ADocument.readyState == 'interactive' || ADocument.readyState == 'complete')
      NotifyPageExtensionInstalled();
    else
      AWindow.addEventListener('DOMContentLoaded', function _DOMContentLoaded(AEvent) {
        AWindow.removeEventListener('DOMContentLoaded', _DOMContentLoaded, false); // remove listener, no longer needed
        NotifyPageExtensionInstalled();
      }, false);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillAdapter.TryNotifyPageExtensionInstalled() Error: ' + ErrorMessage);
  }
};



// TspCrossOriginWindowMessage -------------------------------------------------

var spWindowMessageAccessID = '{C68CA11838F0}';

function TspCrossOriginWindowMessage()
{
  this.AccessID = spWindowMessageAccessID;
}



// TspCrossOriginMessage -------------------------------------------------------

function TspCrossOriginMessage()
{
  var cot = spAutofillCore.HTMLTools.GetWindowCrossOriginType(window);
  // update information in message for any Cross-Origin access
  this.fixCrossOriginTopDocumentInfo = cot != spAutofillCore.HTMLTools.CrossOriginType.coNone;
  this.fixCrossOriginTopDocumentPos = this.fixCrossOriginTopDocumentInfo && spAutofillCore.HTMLTools.AllowCreateDocumentClientAreaCalculator(window);
  // update elements position only for Cross-Origin access
  if (spBrowserSpecificTools.HasWindowInnerScreenPosition(window))
    this.fixCrossOriginElementsPosition = false;
  else
    this.fixCrossOriginElementsPosition = cot == spAutofillCore.HTMLTools.CrossOriginType.coCrossOrigin;
}



// TspChromiumAutofillAdapter --------------------------------------------------

function TspChromiumAutofillAdapter()
{
  TspAutofillAdapter.apply(this, arguments); // inherited call

  this.Log.TransportMessages = false;
  this.Log.WindowMessages = false;
  this.Log.IncompleteDOMXml = false;

  this.ConnectToBG();
  this.ConnectToWindowTransport();
  this.GetDOMXmlLockedUsage();
  this.TryNotifyPageExtensionInstalled();

  if (this.Log.Info)
    spLog.logMessage('TspChromiumAutofillAdapter() loaded for URL: <' + window.document.URL + '>, ' +
      'isTopWindow: ' + spAutofillCore.HTMLTools.IsTopWindow(window)
    );
}

TspChromiumAutofillAdapter.prototype = Object.create(TspAutofillAdapter.prototype);

TspChromiumAutofillAdapter.prototype.constructor = TspChromiumAutofillAdapter;

TspChromiumAutofillAdapter.prototype.ConnectToBG = function()
{
  var Self = this;
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    Self.bgOnMessage(window, message, sender, sendResponse); 
  });
};

TspChromiumAutofillAdapter.prototype.SendMessageToBG = function (message)
{
  if (message)
  {
    if (this.Log.TransportMessages)
      spLog.logMessage('Sending message to BGS: ' + JSON.stringify(message));
    chrome.runtime.sendMessage(message);
  }
};

// message handler from Background script
TspChromiumAutofillAdapter.prototype.bgOnMessage = function(AWindow, message, sender, sendResponse)
{
  // 1. process message
  if (AWindow && message)
  try
  {
    if (this.Log.TransportMessages)
      spLog.logMessage('Received message from BGS: ' + JSON.stringify(message) + ', sendResponse: "' + (typeof sendResponse) + '"');

    // this messages are sent directly to this Content script
    if (message.Action == 'AutofillDocument')
      this.bgAutofillDocument(AWindow, message);

    else if (message.Action == 'SimulatePageLoaded')
      this.bgSimulatePageLoaded(AWindow, message);

    else if (message.Action == 'PasswordManagerLockedChanged')
      this.bgPasswordManagerLockedChanged(AWindow, message);

    else if (message.Action == 'DOMXmlLockedUsageChanged')
      this.bgDOMXmlLockedUsageChanged(AWindow, message);

    else if (message.Action == 'CrossOriginPageLoaded')
      this.bgCrossOriginPageLoaded(AWindow, message);

    // other messages should be verified before calling by Content script
    else
    {
      var ADocument = AWindow.document;

      var AllowedDocument = spAutofillCore.HTMLTools.AllowProcessDocument(ADocument);
      if (!AllowedDocument)
      {
        // send message process failed to BG script
        this.SendMessageToBG(message);
        if (this.Log.Info)
          spLog.logError(message.Action + '() Document process denied for <' + ADocument.URL + '>');
      }
      else
      {
        if (message.Action == 'GetDOMXml')
          this.bgGetDOMXml(AWindow, message);

        else if (message.Action == 'GetWindowDocumentScreenPos')
          return this.bgGetWindowDocumentScreenPos(AWindow, message, sendResponse);

        else if (message.Action == 'GetFocusedElementScreenRect')
          return this.bgGetFocusedElementScreenRect(AWindow, message, sendResponse);

        else if (message.Action == 'SetFocusedElementSelectedText')
          return this.bgSetFocusedElementSelectedText(AWindow, message, sendResponse);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.bgOnMessage() Action: "' + message.Action + '" Error: ' + ErrorMessage);
  }

  // 2. always return the response, otherwise we'll got the leaks!
  try
  {
    if (sendResponse)
      sendResponse({});
  }
  catch (ErrorMessage)
  {
    // keep silence
  }
};

// bgAutofillDocument()
//   message received from BG script
TspChromiumAutofillAdapter.prototype.bgAutofillDocument = function(AWindow, message)
{
  this.AutofillDocument(
    AWindow,
    message.AutofillXml
  );
};

// bgSimulatePageLoaded()
TspChromiumAutofillAdapter.prototype.bgSimulatePageLoaded = function(AWindow, message)
{
  if (this.Log.Info)
    spLog.logMessage('SimulatePageLoaded()');
  this.ProcessPageLoaded(AWindow);
};

// bgPasswordManagerLockedChanged()
TspChromiumAutofillAdapter.prototype.bgPasswordManagerLockedChanged = function(AWindow, message)
{
  if (this.Log.Info)
    spLog.logMessage('PasswordManagerLockedChanged() IsLocked: ' + message.IsLocked);
  this.PasswordManagerLockedChanged(message.IsLocked);
};

// bgDOMXmlLockedUsageChanged()
TspChromiumAutofillAdapter.prototype.bgDOMXmlLockedUsageChanged = function(AWindow, message)
{
  if (this.Log.Info)
    spLog.logMessage('DOMXmlLockedUsageChanged() Events: ' + JSON.stringify(message.Events));
  this.DOMXmlLockedUsageChanged(message.Events);
};

// bgCrossOriginPageLoaded()
TspChromiumAutofillAdapter.prototype.bgCrossOriginPageLoaded = function(AWindow, message)
{
  if (this.Log.Info)
    spLog.logMessage('CrossOriginPageLoaded()');
  this.wndCrossOriginPageLoaded(AWindow, message, null);
};

// bgGetDOMXml()
//   message received from BG script
TspChromiumAutofillAdapter.prototype.bgGetDOMXml = function(AWindow, message)
{
  if (this.Log.Info)
    spLog.logMessage('GetDOMXml()');
  var Self = this;
  this.GetDOMXml(AWindow,
    // AGetDOMXmlCallback
    function (ADOMXml) {
      // send result message to BG script
      message.DOMXml = ADOMXml;
      Self.SendMessageToBG(message);
    },
    // AInitExportDOMManagerCallback
    function (AExportDOMManager) {
      AExportDOMManager.AllowExportEmptyRootWindow = true;
    }
  );
};

// bgGetWindowDocumentScreenPos()
//   message received from BG script
TspChromiumAutofillAdapter.prototype.bgGetWindowDocumentScreenPos = function(AWindow, message, ASendResponse)
{
  if (this.Log.Info)
    spLog.logMessage('bgGetWindowDocumentScreenPos()');
  message.DocumentPos = spAutofillCore.HTMLTools.DocumentClientAreaCalculator.GetWindowDocumentScreenPos(AWindow);
  ASendResponse(message);
};

// bgGetFocusedElementScreenRect()
//   message received from BG script
TspChromiumAutofillAdapter.prototype.bgGetFocusedElementScreenRect = function(AWindow, message, ASendResponse)
{
  if (this.Log.Info)
    spLog.logMessage('bgGetFocusedElementScreenRect()');
  var Self = this;
  this.GetFocusedElementScreenRect(message, AWindow, ASendResponse,
    function (AFocusedElement, AElementScreenRect)
    {
      if (AFocusedElement && AElementScreenRect)
      {
        if (!message.IngoreFocusedFrame && spAutofillCore.HTMLTools.IsFrameElement(AFocusedElement))
        {
          if (spAutofillCore.HTMLTools.HasFrameCrossOriginParent(AFocusedElement))
          {
            var frameWindow = AFocusedElement.contentWindow;
            var frameMessage = new TspCrossOriginWindowMessage();
            frameMessage.Action = 'spGetFocusedElementScreenRect';
            frameMessage.OriginalMessage = message;
            frameMessage.WindowScreenPosition = AElementScreenRect.GetLeftTop();
            frameWindow.postMessage(frameMessage, '*');
            if (Self.Log.Info)
              spLog.logMessage('bgGetFocusedElementScreenRect() move message processing to the cross-origin frame');
            return true; // skip returning the message back to sender
          }
        }
      }
    }
  );
};

// bgSetFocusedElementSelectedText()
//   message received from BG script
TspChromiumAutofillAdapter.prototype.bgSetFocusedElementSelectedText = function(AWindow, message, ASendResponse)
{
  if (this.Log.Info)
    spLog.logMessage('SetFocusedElementSelectedText()');
  var ADocument = AWindow.document;
  var focusedElement = spAutofillCore.HTMLTools.GetDocumentFocusedElement(ADocument);
  if (focusedElement)
  {
    if (spAutofillCore.HTMLTools.IsFrameElement(focusedElement))
    {
      if (spAutofillCore.HTMLTools.HasFrameCrossOriginParent(focusedElement))
      {
        var frameWindow = focusedElement.contentWindow;
        var frameMessage = new TspCrossOriginWindowMessage();
        frameMessage.Action = 'spRequestCachedBgMessage';
        frameMessage.RTID = message.RTID;
        frameWindow.postMessage(frameMessage, '*');
        if (this.Log.Info)
          spLog.logMessage('SetFocusedElementSelectedText() move message processing to the cross-origin frame');
        if (ASendResponse)
          ASendResponse({ MessageProcessed: false });
        return;
      }
    }

    if (spAutofillCore.HTMLTools.ReplaceElementSelectedText(focusedElement, message.SelectedText))
    {
      if (this.Log.Info)
        spLog.logMessage('   SelectedText replaced to <' + message.SelectedText + '>');
    }
  }
  if (ASendResponse)
    ASendResponse({ MessageProcessed: true });
};

// ConnectToWindowTransport()
//   create the connection to window
TspChromiumAutofillAdapter.prototype.ConnectToWindowTransport = function()
{
  var Self = this;
  window.addEventListener('message', function (AEvent) {
    Self.wndOnMessage(window, AEvent); 
  });  
};

TspChromiumAutofillAdapter.prototype.GetDOMXmlLockedUsage = function()
{
  var Self = this;
  var message = {};
  message.Action = 'GetDOMXmlLockedUsage';
  chrome.runtime.sendMessage(message, function (response) {
    Self.bgDOMXmlLockedUsageChanged(window, response)
  });
};

// message handler from Window
TspChromiumAutofillAdapter.prototype.wndOnMessage = function(AWindow, AEvent)
{
  if (AWindow && AEvent && AEvent.data && AEvent.source)
  try
  {
    var message = AEvent.data;
    var source = AEvent.source;

    // ignore foreign messages
    if (message.AccessID != spWindowMessageAccessID)
      return;

    if (this.Log.WindowMessages)
      spLog.logMessage('Received message from Parent Window: ' + JSON.stringify(message));

    if (message.Action == 'spGetPasswordManagerConfiguration')
      this.wndGetPasswordManagerConfiguration(AWindow, message);
    else if (message.Action == 'spGetForbiddenDOMXml')
      this.wndGetForbiddenDOMXml(AWindow, message);
    else if (message.Action == 'spCrossOriginPageLoaded')
      this.wndCrossOriginPageLoaded(AWindow, message, source);
    else if (message.Action == 'spGetFocusedElementScreenRect')
      this.wndGetFocusedElementScreenRect(AWindow, message);
    else if (message.Action == 'spRequestCachedBgMessage')
      this.wndRequestCachedBgMessage(AWindow, message);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndOnMessage() Error: ' + ErrorMessage);
  }
};

// wndGetPasswordManagerConfiguration()
TspChromiumAutofillAdapter.prototype.wndGetPasswordManagerConfiguration = function(AWindow, message)
{
  if (AWindow && message)
  try
  {
    // process only our domain page messages
    if (!spStrings.SearchText('stickypassword.com', document.location.hostname))
      return;

    var Self = this;
    var bgMessage = {};
    bgMessage.Action = 'GetPasswordManagerConfiguration';
    chrome.runtime.sendMessage(bgMessage, function (response) {
      var resultMessage = new TspCrossOriginWindowMessage();
      resultMessage.Action = 'spSetPasswordManagerConfiguration';
      resultMessage.Configuration = response.Configuration;
      AWindow.postMessage(resultMessage, '*');
    });
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndGetPasswordManagerConfiguration() Error: ' + ErrorMessage);
  }
};

// wndGetForbiddenDOMXml()
//   message received from parent Window
TspChromiumAutofillAdapter.prototype.wndGetForbiddenDOMXml = function(AWindow, AMessage)
{
  try
  {
    if (AMessage.RTID && AMessage.ForbiddenXmlDocumentRTID)
    {
      var Self = this;
      var returnForbiddenDOMXmlHandler = function (ADOMXml)
      {
        if (Self.Log.IncompleteDOMXml)
          spLog.logMessage('TspChromiumAutofillAdapter.returnForbiddenDOMXmlHandler() Returning ForbiddenDOMXml message, ' + 
            'forbiddenXmlDocumentRTID=' + AMessage.ForbiddenXmlDocumentRTID + ' ' +
            'messageRTID=' + AMessage.RTID + ' ' +
            'URL=<' + AWindow.document.URL + '> window.name="' + AWindow.name + '"'
          );
        Self.SendMessageToBG(
          { Action: 'ReturnForbiddenDOMXml',
            RTID: AMessage.RTID,
            ForbiddenXmlDocumentRTID: AMessage.ForbiddenXmlDocumentRTID,
            IsFocusedWindow: AMessage.IsFocusedWindow,
            DOMXml: ADOMXml
          }
        );
      };
      var initExportDOMManagerHandler = function (AExportDOMManager)
      {
        if (!AExportDOMManager)
          return;
        AExportDOMManager.RTID = AMessage.RTID; // init manager with original/source RTID, i.e. do not generate new RTID for sub-frames!
        AExportDOMManager.TopWindowVisibility = AMessage.ParentVisibility;
        AExportDOMManager.TopWindowScreenPosition = AMessage.WindowScreenPosition;
      };

      this.GetDOMXml(AWindow, returnForbiddenDOMXmlHandler, initExportDOMManagerHandler);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndGetForbiddenDOMXml() Error: ' + ErrorMessage);
  }
};

// wndCrossOriginPageLoaded()
TspChromiumAutofillAdapter.prototype.wndCrossOriginPageLoaded = function(AWindow, message, source)
{
  try
  {
    // send result message only if this top page has been completely loaded 
    if (this.PageEventsMonitor.DOMChangesMonitor.PageLoadFired &&
        // prevent fire event twice (once for top window and again by child frame)
        this.PageEventsMonitor.DOMChangesMonitor.PageLoadFiredTickCount &&
        spAutofillCore.Tools.GetTickCount() - this.PageEventsMonitor.DOMChangesMonitor.PageLoadFiredTickCount > 1500
       )
    {
      if (this.Log.OnLoad)
      {
        var dtc = spAutofillCore.Tools.GetTickCount() - this.PageEventsMonitor.DOMChangesMonitor.PageLoadFiredTickCount;
        this._logPageEvent('wndCrossOriginPageLoaded', AWindow, 
          'allowed cross-origin page loaded, dtc=' + dtc + ' tc=' + spAutofillCore.Tools.GetTickCount()
        );
      }
      this.PageEventsMonitor.DOMChangesMonitor.PageLoadFiredTickCount = spAutofillCore.Tools.GetTickCount();
      this.ProcessPageLoaded(AWindow);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndCrossOriginPageLoaded() Error: ' + ErrorMessage);
  }
};

// wndGetFocusedElementScreenRect()
TspChromiumAutofillAdapter.prototype.wndGetFocusedElementScreenRect = function(AWindow, message)
{
  if (AWindow && message)
  try
  {
    if (!message.OriginalMessage)
      throw 'message.OriginalMessage is undefined!';
    var Self = this;
    this.GetFocusedElementScreenRect(message.OriginalMessage, AWindow, null /* ASendResponse */,
      function (AFocusedElement, AElementScreenRect)
      {
        if (AElementScreenRect && message.WindowScreenPosition)
          spAutofillCore.Tools.OffsetRect(AElementScreenRect, message.WindowScreenPosition.x, message.WindowScreenPosition.y);

        if (AFocusedElement && AElementScreenRect)
        {
          if (!message.IngoreFocusedFrame && spAutofillCore.HTMLTools.IsFrameElement(AFocusedElement))
          {
            if (spAutofillCore.HTMLTools.HasFrameCrossOriginParent(AFocusedElement))
            {
              var frameWindow = AFocusedElement.contentWindow;
              var frameMessage = message;
              frameMessage.WindowScreenPosition = AElementScreenRect.GetLeftTop();
              frameWindow.postMessage(frameMessage, '*');
              if (Self.Log.Info)
                spLog.logMessage('wndGetFocusedElementScreenRect() move message processing to the cross-origin frame');
              return true; // skip returning the message back to sender
            }
          }
        }
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndGetFocusedElementScreenRect() Error: ' + ErrorMessage);
  }
};

// wndRequestCachedBgMessage()
TspChromiumAutofillAdapter.prototype.wndRequestCachedBgMessage = function(AWindow, message)
{
  if (AWindow && message)
  try
  {
    if (!message.RTID)
      throw 'message.RTID is undefined!';

    var bgMessage = {};
    bgMessage.Action = 'GetCachedMessage';
    bgMessage.RTID = message.RTID;
    this.SendMessageToBG(bgMessage);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.wndRequestCachedBgMessage() Error: ' + ErrorMessage);
  }
};

// GetFocusedElementScreenRect()
TspChromiumAutofillAdapter.prototype.GetFocusedElementScreenRect = function (
  message, AWindow, ASendResponse, AProcessFocusedElementScreenRectCallback)
{
  if (message && AWindow)
  try
  {
    if (this.Log.Info)
      spLog.logMessage('TspChromiumAutofillAdapter.GetFocusedElementScreenRect()');
    var ADocument = AWindow.document;
    var focusedElementScreenRect = null;
    var focusedElement = spAutofillCore.HTMLTools.GetDocumentFocusedElement(ADocument);
    if (message.IngoreFocusedFrame)
    {
      if (spAutofillCore.HTMLTools.IsFrameElement(focusedElement))
      {
        // parent document has no access to cross-origin frame
      }
      else
      {
        // parent document has access to cross-origin frame, jump to focused document
        focusedElement = focusedElement.ownerDocument.documentElement || focusedElement.ownerDocument.body;
      }
    }
    if (focusedElement)
    {
      focusedElementScreenRect = this.GetElementScreenPosition(focusedElement);
      if (AProcessFocusedElementScreenRectCallback)
      {
        if (AProcessFocusedElementScreenRectCallback(focusedElement, focusedElementScreenRect))
        {
          // always return the response, otherwise we'll got the leaks!
          if (ASendResponse)
            ASendResponse({});
          return; // no result message required
        }
      }
    }

    if (focusedElementScreenRect)
    {
      message.FocusedElementScreenRect = focusedElementScreenRect;
      if (this.Log.Info)
        spLog.logMessage('   FocusedElementScreenRect: [' + spAutofillCore.Tools.GetRectDebugInfo(focusedElementScreenRect) + ']');
    }
    else
    {
      message.FocusedElementScreenRect = {};
      message.FocusedElementScreenRect.left = 0;
      message.FocusedElementScreenRect.top = 0;
      message.FocusedElementScreenRect.right = 0;
      message.FocusedElementScreenRect.bottom = 0;
    }

    if (message.NeedResponse)
    {
      // send result message through the response callback
      if (ASendResponse)
        ASendResponse(message);
    }
    else
    {
      // send result message to BG script
      this.SendMessageToBG(message);
      // always return the response, otherwise we'll got the leaks!
      if (ASendResponse)
        ASendResponse({});
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspChromiumAutofillAdapter.GetFocusedElementScreenRect() Error: ' + ErrorMessage);
  }
};

// GetActiveWindow()
TspChromiumAutofillAdapter.prototype.GetActiveWindow = function()
{
  return window;
};

// InitPageEventsMonitor()
TspChromiumAutofillAdapter.prototype.InitPageEventsMonitor = function()
{
  TspAutofillAdapter.prototype.InitPageEventsMonitor.apply(this, arguments); // inherited call 
  
  var Self = this;
  this.PageEventsMonitor.onCrossOriginPageLoadedCallback = function (AWindow) {
    Self.ProcessCrossOriginPageLoaded(AWindow);
  };
};

// InitScreenCoordsConvertor()
TspChromiumAutofillAdapter.prototype.InitScreenCoordsConvertor = function(AScreenCoordsConvertor)
{
  TspAutofillAdapter.prototype.InitScreenCoordsConvertor.apply(this, arguments); // inherited call 
  
  var Self = this;
  // WARNING: only Firefox callback implementation!
  if (typeof AScreenCoordsConvertor.SetBackgroundWindowWidthCallback == 'function')
    AScreenCoordsConvertor.SetBackgroundWindowWidthCallback(function (AWindow, AResponseCallback) {
      Self.GetBackgroundWindowWidth(AWindow, AResponseCallback);
    });
};

// GetBackgroundWindowWidth()
TspChromiumAutofillAdapter.prototype.GetBackgroundWindowWidth = function (AWindow, AResponseCallback)
{
  if (AWindow && AResponseCallback)
  {
    var message = {};
    message.Action = 'GetBackgroundWindowWidth';
    chrome.runtime.sendMessage(message, function (response) {
      AResponseCallback(response.BackgroundWindowWidth);
    });
  }  
};

// ProcessCrossOriginPageLoaded()
TspChromiumAutofillAdapter.prototype.ProcessCrossOriginPageLoaded = function (AWindow)
{
  if (AWindow && AWindow.top)
  {
    var checkingInfo = {};
    checkingInfo.CheckAllChildDocuments = true;
    if (spAutofillCore.HTMLTools.HasWindowEditableElement(AWindow, checkingInfo))
    {
      if (this.Log.OnLoad)
        this._logPageEvent('ProcessCrossOriginPageLoaded', AWindow, 'has editable element, tc=' + spAutofillCore.Tools.GetTickCount());

      // WARNING: Some sites has handlers for window.addEventListener('message')
      //   but they do not check what type of message received and as a result
      //   the page could be damaged.
      // >> Previous version of code:
      // var message = new TspCrossOriginWindowMessage();
      // message.Action = 'spCrossOriginPageLoaded';
      // AWindow.top.postMessage(message, '*');
      // <<

      var message = {};
      message.Action = 'CrossOriginPageLoaded';
      this.SendMessageToBG(message);
    }
  }
};

// InitExportDOMManager()
TspChromiumAutofillAdapter.prototype.InitExportDOMManager = function(AExportDOMManager)
{
  TspAutofillAdapter.prototype.InitExportDOMManager.apply(this, arguments); // inherited call
  if (!AExportDOMManager)
    return;

  var Self = this;
  var queryForbiddenWindowDOMXmlHandler = function (AExportDOMManager, ATopWindow, 
    AWindow, AParentVisibility, AXmlParentNode)
  {
    if (AExportDOMManager && ATopWindow && AWindow && AXmlParentNode)
    try
    {
      var forbiddenXmlDocumentRTID = spAutofillCore.Tools.GenerateRTID();
      var incompleteDOMXmlParser = spAutofillCore.CreateIncompleteDOMXmlParser();
      if (incompleteDOMXmlParser.AppendForbiddenDocumentNode(AXmlParentNode, forbiddenXmlDocumentRTID))
      {
        var messageRTID = AExportDOMManager.RTID;
        var frameWindow = AWindow.contentWindow;
        var isFocusedWindow = AExportDOMManager.FocusedElement == AWindow;
        var rcWindow = spAutofillCore.HTMLTools.GetElementScreenPosition(AWindow);
        if (messageRTID && frameWindow)
        {
          if (Self.Log.IncompleteDOMXml)
            spLog.logMessage('TspChromiumAutofillAdapter.queryForbiddenWindowDOMXmlHandler() Sending spGetForbiddenDOMXml message, ' + 
              'forbiddenXmlDocumentRTID=' + forbiddenXmlDocumentRTID + ' ' +
              'messageRTID=' + messageRTID + ' ' +
              'AParentVisibility=' + AParentVisibility + ' ' +
              'URL=<' + AWindow.src + '> window.id="' + AWindow.id + '" window.name="' + AWindow.name + '"'
            );
          var message = new TspCrossOriginWindowMessage();
          message.Action = 'spGetForbiddenDOMXml';
          message.RTID = messageRTID;
          message.ForbiddenXmlDocumentRTID = forbiddenXmlDocumentRTID;
          message.IsFocusedWindow = isFocusedWindow;
          message.ParentVisibility = AParentVisibility;
          message.WindowScreenPosition = rcWindow.GetLeftTop();
          frameWindow.postMessage(message, '*');
          return true;
        }
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspChromiumAutofillAdapter.InitExportDOMManager()#queryForbiddenWindowDOMXmlHandler() Error: ' + ErrorMessage);
    }
    return false;
  };

  AExportDOMManager.onQueryForbiddenWindowDOMXmlCallback = queryForbiddenWindowDOMXmlHandler;
};

// PageLoaded()
TspChromiumAutofillAdapter.prototype.PageLoaded = function(AWindow, ADOMXml)
{
  if (!AWindow || !ADOMXml)
    return;

  var message = {};
  message.Action = 'PageLoaded';
  message.DOMXml = ADOMXml;
  // send message to BG script
  this.SendMessageToBG(message);
};

// PageSubmitted()
TspChromiumAutofillAdapter.prototype.PageSubmitted = function(AWindow, ADOMXml)
{
  if (!AWindow || !ADOMXml)
    return;

  var message = new TspCrossOriginMessage();
  message.Action = 'PageSubmitted';
  message.DOMXml = ADOMXml;
  // send message to BG script
  this.SendMessageToBG(message);
};

// ElementFocused()
TspChromiumAutofillAdapter.prototype.ElementFocused = function(
  AFocusedElementScreenRect, ADOMXml)
{
  var message = new TspCrossOriginMessage();
  message.Action = 'ElementFocused';
  message.FocusedElementScreenRect = AFocusedElementScreenRect;
  message.DOMXml = ADOMXml;
  // send message to BG script
  this.SendMessageToBG(message);
};

// HideShowedCaptionButtonBalloon()
TspChromiumAutofillAdapter.prototype.HideShowedCaptionButtonBalloon = function()
{
  var message = {};
  message.Action = 'HideShowedCaptionButtonBalloon';
  // send message to BG script
  this.SendMessageToBG(message);
};

// ContextButtonClicked()
TspChromiumAutofillAdapter.prototype.ContextButtonClicked = function(AElement, ADOMXml)
{
  if (!AElement || !ADOMXml)
    return;

  var message = new TspCrossOriginMessage();
  message.Action = 'ContextButtonClicked';
  message.DOMXml = ADOMXml;
  // send message to BG script
  this.SendMessageToBG(message);
};



function allowCreateAutofillAdapter()
{
  if (spAutofillCore.HTMLTools.IsTopWindow(window))
    return true; // top window
  else if (spAutofillCore.HTMLTools.HasWindowCrossOriginParent(window))
    return true; // child frame with Cross-Origin parent  

  return false;
}

var spAutofillAdapter = null;
if (allowCreateAutofillAdapter())
  spAutofillAdapter = new TspChromiumAutofillAdapter();

})();