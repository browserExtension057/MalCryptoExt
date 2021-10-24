
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Chromium Log                                                          }
//                                                                             }
//       Copyright (C) 2015 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {
  
'use strict';

// spLog -----------------------------------------------------------------------

const spLog =
{
  Log: {
    // log modes
    Errors: true
  },
  
  _productName: '',
  
  setProductName: function(AProductName)
  {
    this._productName = AProductName;
  },

  logMessage: function(AText)
  {
    try
    {
      console.debug(this._productName + ': ' + AText);
    }
    catch (ErrorMessage)
    {
      // keep silence
    }
  },

  logError: function(AText)
  {
    if (this.Log.Errors)
    try 
    {
      console.error(this._productName + ': ' + AText);
    }
    catch (ErrorMessage)
    {
      // keep silence
    }
  }
}

var __exports = {};
__exports.spLog = spLog;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spLog', __exports);

})();