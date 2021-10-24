
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Strings Script                                                        }
//                                                                             }
//       Copyright (C) 2015 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;

var spStrings = (function() {

  var spLineBreak = '\r\n';

  function _logFailure(AFunctionName, AError)
  {
    if (spLog)
      spLog.logError('spStrings.' + AFunctionName + '() Error: ' + AError);
  }

  function _logMessage(AFunctionName, AError)
  {
    if (spLog)
      spLog.logMessage('spStrings.' + AFunctionName + '() Error: ' + AError);
  }

  // spRefString: string object, allows to pass string by reference to functions

  function spRefString(AStr)
  {
    if (typeof AStr == 'string')
      this.value = AStr;
    else
      this.value = '';
  }

  spRefString.prototype =
  {
    toString: function()
    {
      return this.value;
    }
  }

  // spStrings internal functions
  
  function _prepareStr(AStr)
  {
    var Result = null;
    try
    {
      if (!AStr)
        Result = '';                     // null
      else if (AStr.value != undefined && typeof AStr.value == 'string')
        Result = AStr.value;             // string object (like spRefString, etc.)
      else if (typeof AStr == 'string')
        Result = AStr;                   // string
      else
        Result = new String(AStr);       // primitive string
    }
    catch (ErrorMessage)
    {
      _logFailure('_prepareStr', ErrorMessage);
      Result = new String(AStr);         // primitive string
    }
    return Result;
  }

  // spStrings public factory
  
  return {
    LineBreak: spLineBreak,
    
    Log: {
      // log modes
      IsStrEmpty: false,
      SameText: false,
      SearchText: false
    },

    // CreateRefString()
    CreateRefString: function(AStr)
    {
      var s = new spRefString(AStr);
      return s;
    },

    // PrepareLowerCaseStr()
    PrepareLowerCaseStr: function(AStr)
    {
      var Result = _prepareStr(AStr);
      Result = Result.toLowerCase();
      return Result;  
    },

    // PrepareUpperCaseStr()
    PrepareUpperCaseStr: function(AStr)
    {
      var Result = _prepareStr(AStr);
      Result = Result.toUpperCase();
      return Result;  
    },

    // IsStrEmpty()
    IsStrEmpty: function(AStr)
    {
      function __isStringEmpty(s)
      {
        if (s === null || s === undefined || s == '')
          return true;
        return false;
      }
      
      try
      {
        if (typeof AStr == 'object')
        {
          // string object
          if (AStr == null)
          {
            if (this.Log.IsStrEmpty)
              _logMessage('IsStrEmpty', 'AStr[object]: <' + AStr + '> == null');
            return true;
          }
          if (AStr.value === undefined)
          {
            if (this.Log.IsStrEmpty)
              _logMessage('IsStrEmpty', 'AStr[object]: <' + AStr + '> value is absent');
            return true;
          }
          if (typeof AStr.value != 'string')
          {
            if (this.Log.IsStrEmpty)
              _logMessage('IsStrEmpty', 'AStr[object]: <' + AStr + '/' + AStr.value + '> value is not string');
            return true;
          }
          if (__isStringEmpty(AStr.value))
          {
            if (this.Log.IsStrEmpty)
              _logMessage('IsStrEmpty', 'AStr[object]: <' + AStr + '/' + AStr.value + '> value is empty');
            return true;
          }
        }
        else if (typeof AStr == 'string')
        {      
          // string
          if (__isStringEmpty(AStr))
          {
            if (this.Log.IsStrEmpty)
              _logMessage('IsStrEmpty', 'AStr[string]: <' + AStr + '> string is empty');
            return true;
          }
        }
        else
        { 
          // unknown type
          if (this.Log.IsStrEmpty)
            _logMessage('IsStrEmpty', 'AStr[' + typeof AStr + ']: <' + AStr + '>: unknown type');
          return true;
        }
      }
      catch (ErrorMessage)
      {
        _logFailure('IsStrEmpty', ErrorMessage);
      }

      return false;
    },
    
    // SameText()
    SameText: function(AStr1, AStr2)
    {
      try
      {
        var Str1 = this.PrepareLowerCaseStr(AStr1);
        var Str2 = this.PrepareLowerCaseStr(AStr2);
        if (this.Log.SameText)
          _logMessage('SameText',
            'AStr1: <' + AStr1 + '>, AStr2: <' + AStr2 + '>, ' +
            'Str1: <' + Str1 + '>, Str2: <' + Str2 + '>, Str1 == Str2: ' + (Str1 == Str2)
          );
        return Str1 === Str2;
      }
      catch (ErrorMessage)
      {
        _logFailure('SameText', ErrorMessage);
        return false;
      }
    },
    
    // SearchText()
    SearchText: function(ASearchingText, AText)
    {
      try
      {
        var SearchingText = this.PrepareLowerCaseStr(ASearchingText);
        var Text = this.PrepareLowerCaseStr(AText);
        if (this.Log.SearchText)
          _logMessage('SearchText',
            'ASearchingText: <' + ASearchingText + '>, AText: <' + AText + '>, ' +
            'SearchingText: <' + SearchingText + '>, Text: <' + Text + '>, Text.indexOf(SearchingText): ' + Text.indexOf(SearchingText));
        if (SearchingText.length && Text.indexOf(SearchingText) >= 0)
          return true;
        else
          return false;
      }
      catch (ErrorMessage)
      {
        _logFailure('SearchText', ErrorMessage);
        return false;
      }
    },

    StrTrim: function(AStr)
    {
      var s = _prepareStr(AStr);
      s = s.trim();
      return s;
    },

    StrRemoveLineBreaks: function(AStr)
    {
      var s = _prepareStr(AStr);
      // remove #0A chars
      var s10 = String.fromCharCode(10);
      while (s.indexOf(s10) >= 0)
        s = s.replace(s10, '');
      return s;
    },

    StrRemoveTwoSpaces: function(AStr)
    {
      var s = _prepareStr(AStr);
      while (s.indexOf('  ') >= 0)
        s = s.replace('  ', ' ');
      return s;
    },

    IsStrConsistsOfChar: function(AStr, AChar)
    {
      var s = _prepareStr(AStr);
      if (!s.length)
        return false;
      for (var i = 0, len = s.length; i < len; i++)
      {
        var ch = s.charAt(i);
        if (ch != AChar)
          return false;
      }
      return true;
    },

    // Url engine
    //   IsUrl
    IsUrl: function(AUrl)
    {
      if (typeof AUrl == 'string')
      {
        var i = AUrl.indexOf('://');
        return i >= 0;
      }
      return false;
    }
  };
})();

var __exports = {};
__exports.spStrings = spStrings;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spStrings', __exports);

})();