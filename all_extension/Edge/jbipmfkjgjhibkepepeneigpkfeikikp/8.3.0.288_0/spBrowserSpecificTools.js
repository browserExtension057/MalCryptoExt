
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Browser Specific Tools                                                }
//                                                                             }
//       Copyright (C) 2017 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {
  
'use strict';

var spLog = spRequire('spLog').spLog;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;



function HasWindowMozillaInnerScreenPosition(AWindow)
{
  if (AWindow &&
      typeof AWindow.mozInnerScreenX != 'undefined' &&
      typeof AWindow.mozInnerScreenY != 'undefined')  
    return true;
  else
    return false;
}
  
function MozillaConvertElementPositionToScreen(AWindow, AHtmlElement, ARect, AScreenCoordsConvertor)
{
  // try to use Mozilla properties - we'll got the real screen coords here
  if (AWindow && AHtmlElement && ARect && AScreenCoordsConvertor)
  try
  {
    ARect.Offset(AWindow.mozInnerScreenX, AWindow.mozInnerScreenY);
    AScreenCoordsConvertor.ApplyDevicePixelRatioToRect(ARect);
  }
  catch (ErrorMessage)
  {
    spLog.logError('spBrowserSpecificTools.MozillaConvertElementPositionToScreen() Error applying Mozilla screen coords: ' + ErrorMessage);
  }
}

function ChromiumConvertElementPositionToScreen(AWindow, AHtmlElement, ARect, AScreenCoordsConvertor)
{
  if (AWindow && AHtmlElement && ARect && AScreenCoordsConvertor)
  try
  {
    // Opera and Chrome returns wrong coordinates of element located in iframe
    try
    {
      if (spBrowserSpecificTools.isWindowFrame(AWindow))
      {
        var frame = AWindow;
        while (frame)
        {
          var frameRC = spAutofillCore.HTMLTools.GetElementPosition(frame.frameElement);
          ARect.Offset(frameRC.left, frameRC.top);

          var frameParent = frame.parent;
          if (!frameParent || frameParent == frame || frameParent == AWindow.top)
            break;
          frame = frameParent;
        }
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spBrowserSpecificTools.ChromiumConvertElementPositionToScreen() Error applying <iframe> coords: ' + ErrorMessage);
    }

    // apply Chromium Device Pixel Ratio to the rect
    try
    {
      AScreenCoordsConvertor.ApplyDevicePixelRatioToRect(ARect);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spBrowserSpecificTools.ChromiumConvertElementPositionToScreen() Error applying Chromium.DPR: ' + ErrorMessage);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('spBrowserSpecificTools.ChromiumConvertElementPositionToScreen() Error applying Chromium screen coords: ' + ErrorMessage);
  }
}

if (HasWindowMozillaInnerScreenPosition(window))
  spAutofillCore.HTMLTools.SetConvertElementPositionToScreenCallback(MozillaConvertElementPositionToScreen);
else
  spAutofillCore.HTMLTools.SetConvertElementPositionToScreenCallback(ChromiumConvertElementPositionToScreen);



const spBrowserSpecificTools = {
  Log: {
    Errors: false
  },

  isWindowFrame: function (AWindow)
  {
    var Result = false;
    try
    {
      // in Chromium AWindow is null, in Opera we can check AWindow.frameElement
      Result = !AWindow || AWindow.frameElement;
    }
    catch (ErrorMessage)
    {
      Result = true;
      if (this.Log.Errors)
        spLog.logError('spBrowserSpecificTools.isWindowFrame() Error: ' + ErrorMessage);
    }
    return Result;
  },
  
  HasWindowInnerScreenPosition: function (AWindow)
  {
    return HasWindowMozillaInnerScreenPosition(AWindow);
  }
}



var __exports = {};
__exports.spBrowserSpecificTools = spBrowserSpecificTools;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spBrowserSpecificTools', __exports);

})();