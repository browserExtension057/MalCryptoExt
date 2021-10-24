
//*****************************************************************************}
//                                                                             }
//       Sticky Password Autofill Engine                                       }
//       Autofill Engine Core                                                  }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;
var spStrings = spRequire('spStrings').spStrings;
var spFormElementPrototype = spRequire('spFormElementPrototype').spFormElementPrototype;



// HTMLElement -----------------------------------------------------------------

var spHTMLElementVisibleManager =
{
  ElementVisibility: {
    Visible: 0,
    Hidden_DisplayNone: 1,
    Hidden_VisibilityHidden: 2,
    Hidden_Opacity0: 3,
    Hidden_PositionOutOfOffset: 4,
    Hidden_Overflow: 5,
    Hidden_ZeroSize: 6,
    Hidden_OverflowChildren: 7
  },

  Log: {
    // log modes
    Errors: false,
    Info: false
  },

  // isVisible(AElementVisibility)
  isVisible: function(AElementVisibility)
  {
    return AElementVisibility == this.ElementVisibility.Visible;
  },

  // getElementVisibility(AElement)
  getElementVisibility: function(AElement)
  {
    // document node always visible
    if (AElement.nodeType === 9)
      return this.ElementVisibility.Visible;

    // check if element style hidden
    var style = spHTMLTools.GetElementStyle(AElement);
    if (style)
    {
      // 'display' style should be checked before 'visibility' one!
      // In this case Element would be visible, because 'visible' value override the 'hidden' one of ParentElement:
      //   ParentElement.style = { visibility: hidden }
      //   Element.style       = { visibility: visible }
      // In this case Element would be hidden, because 'display' style has more priority over 'visibility' one:
      //   ParentElement.style = { visibility: hidden; display: none }
      //   Element.style       = { visibility: visible }
      if (style.display === 'none')
      {
        if (this.Log.Info)
          spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
            'Element.style.display: ' + style.display);
        return this.ElementVisibility.Hidden_DisplayNone;
      }
      if (style.visibility === 'hidden')
      {
        if (this.Log.Info)
          spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
            'Element.style.visibility: ' + style.visibility);
        return this.ElementVisibility.Hidden_VisibilityHidden;
      }
      if (style.opacity === '0')
      {
        if (this.Log.Info)
          spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
            'Element.style.opacity: ' + style.opacity);
        return this.ElementVisibility.Hidden_Opacity0;
      }
      if (style.position === 'fixed')
      {
        // abolute position should be calculated more correctly, rework in the feature!
        if ((AElement.offsetHeight > 0 && AElement.offsetTop < -AElement.offsetHeight) ||
            (AElement.offsetWidth > 0 && AElement.offsetLeft < -AElement.offsetWidth)
           )
        {
          if (this.Log.Info)
            spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
              'Element position is out of offset parent');
          return this.ElementVisibility.Hidden_PositionOutOfOffset;
        }
      }

      var offsetWidth = AElement.offsetWidth;
      if (!offsetWidth)
      {
        if (AElement.parentElement && AElement.parentElement.tagName.toUpperCase() === 'HTML')
          offsetWidth = AElement.parentElement.clientWidth;
      }
      if (style.overflowX === 'hidden' && offsetWidth <= 0)
      {
        if (this.Log.Info)
          spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
            'Element.style.overflowX: ' + style.overflowX + ' ' +
            'Element.offsetWidth: ' + AElement.offsetWidth + ' ' +
            'offsetWidth: ' + offsetWidth
          );
        return this.ElementVisibility.Hidden_Overflow;
      }

      var offsetHeight = AElement.offsetHeight;
      if (!offsetHeight)
      {
        if (AElement.parentElement && AElement.parentElement.tagName.toUpperCase() === 'HTML')
          offsetHeight = AElement.parentElement.clientHeight;
      }
      if (style.overflowY === 'hidden' && offsetHeight <= 0)
      {
        if (this.Log.Info)
          spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
            'Element.style.overflowY: ' + style.overflowY + ' ' +
            'Element.offsetHeight: ' + AElement.offsetHeight + ' ' +
            'offsetHeight: ' + offsetHeight
          );
        return this.ElementVisibility.Hidden_Overflow;
      }

      if (offsetWidth == 0 || offsetHeight == 0)
      {
        if (!AElement.children || !AElement.children.length) // no child elements
        {
          if (this.Log.Info)
            spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
              'Element.offsetWidth: ' + AElement.offsetWidth + ' ' +
              'Element.offsetHeight: ' + AElement.offsetHeight + ' ' +
              'Element.clientWidth: ' + AElement.clientWidth + ' ' +
              'Element.clientHeight: ' + AElement.clientHeight
            );
          return this.ElementVisibility.Hidden_ZeroSize;
        }
      }
      
      var minOffset = 10;
      var possibleOverflowX = style.overflowX === 'hidden' && offsetWidth < minOffset;
      var possibleOverflowY = style.overflowY === 'hidden' && offsetHeight < minOffset;
      if (possibleOverflowX || possibleOverflowY)
      {
        if (AElement.children && AElement.children.length)
        {
          var children = AElement.querySelectorAll('input,textarea,select:only-child');
          if (children && children.length)
          {
            for (var i = 0, lenChildren = children.length; i < lenChildren; i++)
            {
              var childElement = children[i];
              if (possibleOverflowX && childElement.offsetWidth > offsetWidth)
              {
                if (this.Log.Info)
                  spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
                    'Element.style.overflowX: ' + style.overflowX + ' ' +
                    'Element.offsetWidth: ' + AElement.offsetWidth + ' ' +
                    'offsetWidth: ' + offsetWidth + ' ' +
                    'childElement.offsetWidth: ' + childElement.offsetWidth
                  );
                return this.ElementVisibility.Hidden_OverflowChildren;
              }
              else if (possibleOverflowY && childElement.offsetHeight > offsetHeight)
              {
                if (this.Log.Info)
                  spLog.logMessage('spHTMLElementVisibleManager.getElementVisibility() ' + spHTMLTools.GetElementDebugInfo(AElement) + ' ' +
                    'Element.style.overflowY: ' + style.overflowY + ' ' +
                    'Element.offsetHeight: ' + AElement.offsetHeight + ' ' +
                    'offsetHeight: ' + offsetHeight + ' ' +
                    'childElement.offsetHeight: ' + childElement.offsetHeight
                  );
                return this.ElementVisibility.Hidden_OverflowChildren;
              }
            }
          }
        }
      }
    }

    return this.ElementVisibility.Visible;
  },
  
  // getElementVisibilityBasedOnParent(AElement, AParentVisibility)
  getElementVisibilityBasedOnParent: function(AElement, AParentVisibility)
  {
    var elementVisibility = null;
    if (AParentVisibility != this.ElementVisibility.Visible)
    {
      // parent hidden

      // skip parent visibility if element has 'visibility: visible' CSS-style,
      // see more information in this.getElementVisibility() style checking
      if (AParentVisibility != this.ElementVisibility.Hidden_VisibilityHidden &&
          AParentVisibility != this.ElementVisibility.Hidden_Overflow)
        return AParentVisibility;

      elementVisibility = this.getElementVisibility(AElement);
      if (elementVisibility != this.ElementVisibility.Visible)
        return AParentVisibility;
    }
    else
    {
      // parent visible - get element's visibility
      elementVisibility = this.getElementVisibility(AElement);
    }
    return elementVisibility;
  },

  // isElementVisible(AElement)
  isElementVisible: function(AElement)
  {
    if (AElement)
    try
    {
      var visibility = this.getElementVisibility(AElement);
      return this.isVisible(visibility);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLElementVisibleManager.isElementVisible() Error: ' + ErrorMessage);
    }
    return false;
  },
  
  // isElementCompletelyVisible(AElement)
  isElementCompletelyVisible: function(AElement)
  {
    if (AElement)
    try
    {
      var element = AElement;
      while (element)
      {
        var visibility = this.getElementVisibility(element);
        if (element != AElement)
        {
          // skip parent visibility if element has 'visibility: visible' CSS-style,
          // see more information in this.getElementVisibility() style checking
          if (visibility == this.ElementVisibility.Hidden_VisibilityHidden ||
              visibility == this.ElementVisibility.Hidden_Overflow
             )
          {
            visibility = this.ElementVisibility.Visible;
          }
        }
        // check element visibility
        if (!this.isVisible(visibility))
          return false;
        // is it top element?
        if (!element.parentNode)
          break;
        if (element.parentNode == element)
          break;
        // jump to parent
        element = element.parentNode;
      }
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLElementVisibleManager.isElementCompletelyVisible() Error: ' + ErrorMessage);
    }
    return false;
  }
}



// spHighlightManager ----------------------------------------------------------

function TspHighlightManager()
{
  this.borderStyle = 'solid';
  this.borderWidth = '1px';
  this.borderTopColor = 'rgb(238, 50, 50)';
  this.borderBottomColor = 'rgb(240, 80, 80)';
  this.borderLeftColor = 'rgb(240, 80, 80)';
  this.borderRightColor = 'rgb(240, 80, 80)';
  this.boxShadow = '1px 1px rgb(250, 230, 230) inset';
}

TspHighlightManager.prototype.HighlightElement = function (AElement)
{
  if (AElement)
  try
  {
    AElement.style.borderStyle = this.borderStyle;
    AElement.style.borderWidth = this.borderWidth;
    AElement.style.borderTopColor = this.borderTopColor;
    AElement.style.borderBottomColor = this.borderBottomColor;
    AElement.style.borderLeftColor = this.borderLeftColor;
    AElement.style.borderRightColor = this.borderRightColor;
    AElement.style.boxShadow = this.boxShadow;
    AElement.style.MozBoxShadow = this.boxShadow;
    AElement.style.WebkitBoxShadow = this.boxShadow;

    AElement.spHighlighted = true;

    return true;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspHighlightManager.HighlightElement() Error: ' + ErrorMessage);
  }
  return false;
};

TspHighlightManager.prototype.IsHighlightStyleProperty = function (AElement, AStyle, APropertyName, APropertyValue)
{
  if (AElement && AStyle && APropertyName)
  try
  {
    if (AElement.spHighlighted)
    {
      switch (APropertyName)
      {
        case 'border-style':
        case 'border-top-style':
        case 'border-bottom-style':
        case 'border-left-style':
        case 'border-right-style':
          if (APropertyValue == this.borderStyle)
            return true;
          break;

        case 'border-width':
        case 'border-top-width':
        case 'border-bottom-width':
        case 'border-left-width':
        case 'border-right-width':
          if (APropertyValue == this.borderWidth)
            return true;
          break;

        case 'border-top-color':
          if (APropertyValue == this.borderTopColor)
            return true;
          break;

        case 'border-bottom-color':
          if (APropertyValue == this.borderBottomColor)
            return true;
          break;

        case 'border-left-color':
          if (APropertyValue == this.borderLeftColor)
            return true;
          break;

        case 'border-right-color':
          if (APropertyValue == this.borderRightColor)
            return true;
          break;

        case 'box-shadow':
        case '-moz-box-shadow':
        case '-webkit-box-shadow':
          // it's difficult to compare the shaddow value
          // ?? if (APropertyValue == this.boxShadow)
            return true;
          break;
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspHighlightManager.IsHighlightStyleProperty() Error: ' + ErrorMessage);
  }

  return false;
};

var spHighlightManager = new TspHighlightManager();



// TspContextButton ------------------------------------------------------------

function TspContextButton()
{
  this.Log = {
    // log modes
    Info: false
  };
}

TspContextButton.prototype._getButtonRect = function (AElement, ACheckForOvelapCallback)
{
  var Result = new TspRect();
  if (!AElement)
    return Result;

  var buttonSize = 16;
  if (buttonSize >= AElement.clientHeight - 2)
    buttonSize = AElement.clientHeight - 2;
  var yOffset = Math.round((AElement.offsetHeight - buttonSize) / 2);

  // as default result coords are relative to the element's rect
  Result.left = AElement.offsetWidth - yOffset - buttonSize;
  Result.top = yOffset;
  Result.right = Result.left + buttonSize;
  Result.bottom = Result.top + buttonSize;

  // prevent overlapping some other elements inside of AElement by our button
  this._fixButtonRectOverlap(AElement, Result, ACheckForOvelapCallback);

  return Result;
};

TspContextButton.prototype._fixButtonRectOverlap = function (AElement, ArcButton, ACheckForOvelapCallback)
{
  if (AElement && ArcButton)
  try
  {
    var buttonSize = ArcButton.right - ArcButton.left;
    var ADocument = AElement.ownerDocument;
    if (ADocument && typeof ADocument.elementFromPoint == 'function')
    {
      var rcElement = spHTMLTools.GetElementPosition(AElement);
      // there could be couple buttons inside of the element, so try to fix at least 2 times!
      for (var a = 0; a < 2; a++)
      {
        // try to find the element in the center of initial context button rect
        var x = rcElement.left + ArcButton.left + buttonSize / 2;
        var y = rcElement.top + AElement.offsetHeight / 2;
        var topElement = ADocument.elementFromPoint(x, y);
        if (topElement)
        {
          var isOverlapping = topElement != AElement;
          if (isOverlapping && typeof ACheckForOvelapCallback == 'function')
            isOverlapping = isOverlapping && ACheckForOvelapCallback(topElement);
          // there could be the span with placeholder text over the input element
          var rcTopElement = null;
          if (isOverlapping)
          {
            rcTopElement = spHTMLTools.GetElementPosition(topElement);
            // keep the context button on initial position in case some top element
            // is not displayed  inside the element but just shown above it
            if (rcTopElement.left <= rcElement.left + 10)
            {
              if (this.Log.Info)
                spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                  ' is not overlapped by the top element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                  ' which is is located to the left from element');
              isOverlapping = false;
            }
            else if (rcTopElement.top <= rcElement.top - 10)
            {
              if (this.Log.Info)
                spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                  ' is not overlapped by the top element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                  ' which is is located to the top from element');
              isOverlapping = false;
            }
            else if (rcTopElement.right > rcElement.right + 20)
            {
              if (this.Log.Info)
                spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                  ' is not overlapped by the top element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                  ' which is is located to the right from element');
              isOverlapping = false;
            }
            else if ((rcElement.right - rcTopElement.left) > (rcElement.right - rcElement.left) / 2)
            {
              if (this.Log.Info)
                spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                  ' is not overlapped by the top element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                  ' which is wider than half of the element width');
              isOverlapping = false;
            }
            else if ((rcElement.bottom - rcTopElement.top) > (rcElement.bottom - rcElement.top))
            {
              if (this.Log.Info)
                spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                  ' is not overlapped by the top element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                  ' which is higher than the element height');
              isOverlapping = false;
            }
          }
          if (isOverlapping)
          {
            if (this.Log.Info)
              spLog.logMessage('TspContextButton._fixButtonRectOverlap() button for ' + spHTMLTools.GetElementDebugInfo(AElement) +
                ' is overlapping the element ' + spHTMLTools.GetElementDebugInfo(topElement) +
                ', shifting Context Button to the left');
            var yOffset = Math.round((AElement.offsetHeight - buttonSize) / 2);
            yOffset = Math.min(yOffset, 6); // prevent too much space between buttons
            var dx = (rcElement.left + ArcButton.left + buttonSize) - rcTopElement.left;
            ArcButton.left -= dx + yOffset;
            ArcButton.right = ArcButton.left + buttonSize;
          }
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButton._fixButtonRectOverlap() Error fixing overlap of other button: ' + ErrorMessage);
  }
};



// TspContextButtonInvisible ---------------------------------------------------

function TspContextButtonInvisible()
{
  this.Log = {
    // log modes
    Info: false
  };
}

TspContextButtonInvisible.prototype.addButtonToElement = function (AWindow, AElement, AButtonInfo)
{
  if (AWindow && AElement && AButtonInfo)
  try
  {
    if (this.Log.Info)
      spLog.logMessage('TspContextButtonInvisible.addButtonToElement() Add invisible button for ' + spHTMLTools.GetElementDebugInfo(AElement));

    AElement.addEventListener('spShowContextButton', function (AEvent) {
      AButtonInfo.onClicked(AElement);
    }, true);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonInvisible.addButtonToElement() Error: ' + ErrorMessage);
  }
};



// TspContextButtonImg ---------------------------------------------------------

function TspContextButtonImg()
{
  TspContextButton.apply(this, arguments); // inherited call
  
  this.ContextButtonIDPrefix = 'spContextButton.';  
}

TspContextButtonImg.prototype = Object.create(TspContextButton.prototype);

TspContextButtonImg.prototype.constructor = TspContextButtonImg;

TspContextButtonImg.prototype._getBackgroundImageSize = function (AElement, AElementStyle, ACallback)
{
  function getBackgroundImageSize(AElement, AElementStyle, ACallback)
  {
    var width, height;
    var backgroundSize = AElementStyle.backgroundSize.split(' ');
    if (backgroundSize.length == 1)
      backgroundSize[1] = backgroundSize[0];

    width = spHTMLTools.ParseStyleBackgroundSize(backgroundSize[0], AElement.offsetWidth);
    height = spHTMLTools.ParseStyleBackgroundSize(backgroundSize[1], AElement.offsetHeight);
    if (typeof width != 'undefined' &&
        typeof height != 'undefined')
    {
      ACallback({ width: width, height: height });
      return;
    }

    var img = new Image();
    img.onload = function ()
    {
      width = this.width;
      height = this.height;
      ACallback({ width: width, height: height });
    }
    img.src = AElementStyle.backgroundImage.replace(/url\(['"]*(.*?)['"]*\)/g, '$1');
  }
      
  if (AElementStyle.backgroundImage &&
      AElementStyle.backgroundImage != 'none'
     )
  {
    if (this.backgroundImage == AElementStyle.backgroundImage &&
        this.backgroundSize == AElementStyle.backgroundSize &&
        this.backgroundImageSize
       )
    {
      ACallback(this.backgroundImageSize);
      return;
    }
    
    var Self = this;
    getBackgroundImageSize(AElement, AElementStyle, function (backgroundImageSize) {
      Self.backgroundImage = AElementStyle.backgroundImage;
      Self.backgroundSize = AElementStyle.backgroundSize;
      Self.backgroundImageSize = backgroundImageSize;
      ACallback(Self.backgroundImageSize);
    });
  }
};

TspContextButtonImg.prototype._resizeButtonToElement = function (AElement, AdivButton, AimgButton)
{
  if (AElement && AdivButton && AimgButton)
  try
  {
    var rcElement = spHTMLTools.GetElementPosition(AElement);
    var rcDiv = spHTMLTools.GetElementPosition(AdivButton);
    var dx = rcElement.left - rcDiv.left;
    var dy = rcElement.top - rcDiv.top;

    AdivButton.style.visibility = 'hidden'; // temporary hide to check if button overlaps the original element button
    var rcButton = this._getButtonRect(AElement, function (AtopElement) {
      return AtopElement != AimgButton;
    });
    var buttonSize = rcButton.right - rcButton.left;
    // prevent processing elements with zero button size (the case of invisible element, etc.)
    if (buttonSize <= 0)
    {
      AdivButton.style.visibility = 'visible'; // show again
      return;
    }

    var elementStyle = spHTMLTools.GetElementStyle(AElement);
    if (elementStyle.backgroundImage && 
        elementStyle.backgroundImage != 'none' &&
        elementStyle.backgroundRepeat == 'no-repeat')
    {
      var Self = this;
      spHTMLTools.GetElementBackgroundPositionX(AElement, elementStyle,
        // AGetBackgroundImageSizeCallback
        function (ACallback) {
          Self._getBackgroundImageSize(AElement, elementStyle, ACallback);
        },
        // ACallback
        function (backgroundPositionX) {
          if (backgroundPositionX.x > 0)
          {
            var buttonsPadding = 2;
            if (backgroundPositionX.offset != 'right')
            {
              // side-relative position: left
              if (rcButton.right + buttonsPadding >= backgroundPositionX.x &&
                  backgroundPositionX.x > AElement.offsetWidth * 0.5)
              {
                // shift button to the left
                var xOffset = rcButton.right - backgroundPositionX.x;
                if (xOffset < buttonSize)
                  xOffset = buttonSize;
                xOffset += buttonsPadding;
                spTools.OffsetRect(rcButton, -xOffset, 0);
              }
            }
            else
            {
              // side-relative position: right
              Self._getBackgroundImageSize(AElement, elementStyle, function (backgroundImageSize) {
                // shift button to the left
                var xOffset = backgroundPositionX.x - backgroundImageSize.width;
                xOffset -= buttonsPadding;
                rcButton.right = xOffset;
                rcButton.left = rcButton.right - buttonSize;
                Self._adjustButtonPos(AElement, AdivButton, AimgButton, rcButton, rcDiv, buttonSize, dx, dy);
              });
              return;
            }
          }
          
          Self._adjustButtonPos(AElement, AdivButton, AimgButton, rcButton, rcDiv, buttonSize, dx, dy);
        }
      );
      return;
    }

    this._adjustButtonPos(AElement, AdivButton, AimgButton, rcButton, rcDiv, buttonSize, dx, dy);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonImg._resizeButtonToElement() Error: ' + ErrorMessage);
  }
};

TspContextButtonImg.prototype._adjustButtonPos = function (
  AElement, AdivButton, AimgButton, rcButton, rcDiv, buttonSize, dx, dy)
{
  try
  {
    var xImage = rcButton.left + dx;
    var yImage = rcButton.top + dy;
    // WARNING: The "align-items: center;" bug occured only in Chrome when elements
    //   in fact centered vertically, but their coords are started from the middle point of parent
    if (spTools.IsChrome())
    {
      if (rcDiv.bottom - rcDiv.top == 0)
      {
        var parentElementStyle = spHTMLTools.GetElementStyle(AElement.parentElement);
        if (parentElementStyle && parentElementStyle.alignItems == 'center')
        {
          yImage = '0';
        }
      }
    }

    // animate button appearance in case it's position changed significantly
    if (typeof this.xImage != 'undefined' &&
        typeof this.yImage != 'undefined')
    {
      if (Math.abs(this.xImage - xImage) > 16 ||
          Math.abs(this.yImage - yImage) > 16)
      {
        this._fadeButtonIn(AdivButton, 10);
      }
    }
    this.xImage = xImage;
    this.yImage = yImage;


    AimgButton.style.left = xImage + 'px';
    AimgButton.style.top = yImage + 'px';
    AimgButton.style.width = buttonSize + 'px';
    AimgButton.style.height = buttonSize + 'px';
    AimgButton.style.minWidth = AimgButton.style.width;
    AimgButton.style.maxWidth = AimgButton.style.width;
    AimgButton.style.minHeight = AimgButton.style.width;
    AimgButton.style.maxHeight = AimgButton.style.width;

    AdivButton.style.visibility = 'visible'; // show again
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonImg._adjustButtonPos() Error: ' + ErrorMessage);
  }
};

TspContextButtonImg.prototype.isContextButton = function (AElement)
{
  var Result = false;
  if (AElement)
  try
  {
    if (AElement.spIsContextButton)
      Result = true;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonImg.isContextButton() Error: ' + ErrorMessage);
  }
  return Result;
};

TspContextButtonImg.prototype._applyButtonZIndex = function (AElement, AdivButton)
{
  if (AElement && AdivButton)
  {
    var style = spHTMLTools.GetElementStyle(AElement);
    if (style && style.zIndex)
    {
      var zIndex = parseInt(style.zIndex);
      if (!isNaN(zIndex) &&
          zIndex >= 0)
        zIndex += 33;
      else
      {
        if (style.position == 'relative')
        {
          // if element position is relative without z-index (i.e. auto), then 
          // context button became under the element because its position is absolute.
          zIndex = 2;
        }
        else
          zIndex = 'auto';
      }
      AdivButton.style.zIndex = zIndex;
      if (this.Log.Info)
        spLog.logMessage('TspContextButtonImg._applyButtonZIndex() Updated z-Index to ' + zIndex + ' for ' + spHTMLTools.GetElementDebugInfo(AElement));
    }
  }
};

TspContextButtonImg.prototype._fadeButtonIn = function (AdivButton, ATimeout)
{
  if (!AdivButton)
    throw 'TspContextButtonImg._fadeButtonIn() Error: AdivButton is undefined';
  if (typeof ATimeout == 'undefined')
    ATimeout = 20;

  AdivButton.style.opacity = 0;
  var opacityPercent = 0;
  var tmrAnimate = setInterval(function () {
    opacityPercent += 10;
    var opacity = opacityPercent / 100;
    AdivButton.style.opacity = opacity;
    if (opacityPercent >= 100)
      clearInterval(tmrAnimate);
  }, ATimeout);
};

TspContextButtonImg.prototype.addButtonToElement = function (AWindow, AElement, AButtonInfo)
{
  if (AWindow && AElement && AButtonInfo)
  try
  {
    if (this.Log.Info)
      spLog.logMessage('TspContextButtonImg.addButtonToElement() Add image for ' + spHTMLTools.GetElementDebugInfo(AElement));

    this.Window = AWindow;
    this.Element = AElement;
    
    var Self = this;
    var ADocument = AElement.ownerDocument;

    var divButton = ADocument.createElement('div');
    this.divButton = divButton; 
    divButton.style.position = 'absolute';
    divButton.style.display = 'flex';
    divButton.style.width = '0px'; // need if any parent has style "justify-content: center"
    divButton.style.height = '0px'; // need if any parent has style "align-items: center"
    divButton.style.border = 'none';
    divButton.style.padding = '0px';
    divButton.style.margin = '0px';
    divButton.style.background = 'no-repeat'; // make div transparent if parent elements has some background color
    divButton.style.visibility = 'visible';
    divButton.style.UserSelect = 'none'; // deny button selection
    divButton.style.MozUserSelect = 'none';
    divButton.style.WebkitUserSelect = 'none';
    divButton.style.pointerEvents = 'none'; // deny to handle any mouse events!
    divButton.spIsContextButton = true; // set runtime flag it's Context Button element to skip it's export to DOMXml
    this._applyButtonZIndex(AElement, divButton);

    var imgButton = ADocument.createElement('img');
    this.imgButton = imgButton;
    imgButton.style.position = 'relative';
    imgButton.style.border = 'none';
    imgButton.style.display = 'inline';
    imgButton.style.cursor = 'default';
    imgButton.title = AButtonInfo.Title;
    imgButton.style.padding = '0px';
    imgButton.style.margin = '0px';
    imgButton.style.pointerEvents = 'auto'; // allow to handle any mouse events!
    this.updateButtonImage(AButtonInfo);
    imgButton.addEventListener('click', function (AEvent) {
      AButtonInfo.onClicked(AElement);
    });
    imgButton.addEventListener('mouseover', function (AEvent) {
      Self.updateButtonImage(AButtonInfo, true);
    });
    imgButton.addEventListener('mouseout', function (AEvent) {
      Self.updateButtonImage(AButtonInfo);
    });

    // animate button appearance
    this._fadeButtonIn(divButton);

    divButton.appendChild(imgButton);
    AElement.parentNode.insertBefore(divButton, AElement);
    this._resizeButtonToElement(AElement, divButton, imgButton);

    var timerId = 0;
    var _postponeResize =  function ()
    {
      if (timerId)
      {
        clearTimeout(timerId);
        timerId = 0;
      }
      timerId = setTimeout(function (AEvent) {
        timerId = 0;
        Self._resizeButtonToElement(AElement, divButton, imgButton);
      }, 100);
    };

    AElement.addEventListener('input', function (AEvent) {
      _postponeResize();
    }, true);
    AElement.addEventListener('focus', function (AEvent) {
      _postponeResize();
    }, true);
    AElement.addEventListener('blur', function (AEvent) {
      _postponeResize();
    }, true);
    AWindow.addEventListener('resize', function (AEvent) {
      Self._resizeButtonToElement(AElement, divButton, imgButton);
    });

    if (typeof MutationObserver != 'undefined')
    {
      var mutationObserver = new MutationObserver(function (AMutations) {
        _postponeResize();
      });
      mutationObserver.observe(AElement, { childList: true, attributes: true });
      AWindow.addEventListener('unload', function _unload(AEvent) {
        AWindow.removeEventListener('unload', _unload, false); // remove listener, no longer needed
        mutationObserver.disconnect();
        mutationObserver = null;
      }, false);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonImg.addButtonToElement() Error: ' + ErrorMessage);
  }
};

TspContextButtonImg.prototype.updateButtonImage = function (AButtonInfo, AIsHover)
{
  if (AButtonInfo)
  try
  {
    if (typeof AIsHover != 'undefined' && AIsHover)
      this.imgButton.src = AButtonInfo.GetImageHoverSrc();
    else
      this.imgButton.src = AButtonInfo.GetImageSrc();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonImg.updateButtonImage() Error: ' + ErrorMessage);
  }
};



// TspContextButtonBackgroundImg ------------------------------------------------

function TspContextButtonBackgroundImg()
{
  TspContextButton.apply(this, arguments); // inherited call
}

TspContextButtonBackgroundImg.prototype = Object.create(TspContextButton.prototype);

TspContextButtonBackgroundImg.prototype.constructor = TspContextButtonBackgroundImg;

TspContextButtonBackgroundImg.prototype._isOffsetPointInButton = function (AptOffset, AElement)
{
  if (AptOffset && AElement)
  {
    var rcButton = this._getButtonRect(AElement);
    // add small padding
    var padding = 1;
    spTools.InflateRect(rcButton, padding, padding);
    if (spTools.IsPointInRect(AptOffset, rcButton))
      return true;
    return false;
  }
  return false;
};

TspContextButtonBackgroundImg.prototype._setButtonHoverStyle = function (AElement, ABackgroundImage)
{
  if (!AElement)
    return;
  AElement.style.cursor = 'default';
  AElement.style.backgroundImage = ABackgroundImage;
};

TspContextButtonBackgroundImg.prototype._setButtonNormalStyle = function (AElement, ABackgroundImage)
{
  if (!AElement)
    return;
  AElement.style.cursor = 'inherit';
  AElement.style.backgroundImage = ABackgroundImage;
};

TspContextButtonBackgroundImg.prototype._resizeButtonToElement = function (AElement)
{
  if (AElement)
  try
  {
    var rcButton = this._getButtonRect(AElement);
    var xPercentPosition = rcButton.right * 100 / AElement.offsetWidth;
    var buttonSize = rcButton.right - rcButton.left;
    // prevent processing elements with zero button size (the case of invisible element, etc.)
    if (buttonSize <= 0)
      return;

    AElement.style.backgroundPosition = parseInt(xPercentPosition) + '% 50%';
    AElement.style.backgroundSize = buttonSize + 'px ' + buttonSize + 'px';
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonBackgroundImg._resizeButtonToElement() Error: ' + ErrorMessage);
  }
};

TspContextButtonBackgroundImg.prototype.IsContextButtonStyleProperty = function (AElement, AStyle, APropertyName, APropertyValue)
{
  if (AElement && AStyle && APropertyName)
  try
  {
    if (AElement.spAddedContextButton)
    {
      switch (APropertyName)
      {
        case 'cursor':
        case 'background-image':
        case 'background-repeat':
        case 'background-repeat-x':
        case 'background-repeat-y':
        case 'background-attachment':
        case 'background-position':
        case 'background-position-x':
        case 'background-position-y':
        case 'background-size':
          return true;
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonBackgroundImg.IsContextButtonAttribute() Error: ' + ErrorMessage);
  }

  return false;
};

TspContextButtonBackgroundImg.prototype.addButtonToElement = function (AWindow, AElement, AButtonInfo)
{
  if (AElement && AButtonInfo)
  try
  {
    if (this.Log.Info)
      spLog.logMessage('TspContextButtonBackgroundImg.addButtonToElement() Add background-image for ' + spHTMLTools.GetElementDebugInfo(AElement));

    this.Window = AWindow;
    this.Element = AElement;

    var Self = this;

    AElement.style.backgroundRepeat = 'no-repeat';
    AElement.style.backgroundAttachment = 'scroll';
    this._resizeButtonToElement(AElement);
    this.updateButtonImage(AButtonInfo);

    var lastOffsetWidth = AElement.offsetWidth;
    AElement.addEventListener('input', function (AEvent) {
      if (lastOffsetWidth != AElement.offsetWidth)
      {
        lastOffsetWidth = AElement.offsetWidth;
        Self._resizeButtonToElement(AElement);        
      }
    }, true);
    AElement.addEventListener('focus', function (AEvent) {
      Self._resizeButtonToElement(AElement);
    }, true);
    
    AElement.addEventListener('click', function (AEvent) {
      var ptOffset = spTools.GetOffsetPointFromEvent(AEvent);
      if (Self._isOffsetPointInButton(ptOffset, AElement))
        AButtonInfo.onClicked(AElement);
    });

    AElement.addEventListener('mousemove', function (AEvent) {
      var ptOffset = spTools.GetOffsetPointFromEvent(AEvent);
      var isHover = Self._isOffsetPointInButton(ptOffset, AElement);
      Self.updateButtonImage(AButtonInfo, isHover);
    });

    AElement.addEventListener('mouseout', function (AEvent) {
      Self.updateButtonImage(AButtonInfo);
    });

    AElement.spAddedContextButton = true;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonBackgroundImg.addButtonToElement() Error: ' + ErrorMessage);
  }
};

TspContextButtonBackgroundImg.prototype.updateButtonImage = function (AButtonInfo, AIsHover)
{
  if (AButtonInfo)
  try
  {
    if (typeof AIsHover != 'undefined' && AIsHover)
    {
      var backgroundImage = 'url(' + AButtonInfo.GetImageHoverSrc() + ')';
      this._setButtonHoverStyle(this.Element, backgroundImage);
    }
    else
    {
      var backgroundImage = 'url(' + AButtonInfo.GetImageSrc() + ')';
      this._setButtonNormalStyle(this.Element, backgroundImage);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonBackgroundImg.updateButtonImage() Error: ' + ErrorMessage);
  }
};



// TspContextButtonManager -----------------------------------------------------

function TspContextButtonManager()
{
  this.Log = {
    // log modes
    Info: false
  };
  this.ContextButtonType = {
    IgnoreAdding: 0,
    ContextButtonImg: 1, // default
    ContextButtonBackgroundImg: 2,
    Invisible: 3
  };
  this.ContextButtons = new Array();
  this.ButtonInfo = null;
}

TspContextButtonManager.prototype.indexOfButton = function (AElement)
{
  for (var i = this.ContextButtons.length-1; i >= 0; i--)
  {
    var contextButton = this.ContextButtons[i];
    if (contextButton.Element == AElement)
      return i;
  }
  return -1;
};

TspContextButtonManager.prototype.initializeButtonInfo = function (AonContextButtonInitializeCallback)
{
  if (!AonContextButtonInitializeCallback)
    return false;
  // get the actual button info from callback
  if (!this.ButtonInfo)
  {
    this.ButtonInfo = new Object();
    this.ButtonInfo.Title = '';
    this.ButtonInfo.onClicked = null;
    AonContextButtonInitializeCallback(this.ButtonInfo);
  }
  if (this.ButtonInfo.Title == '' ||
      this.ButtonInfo.GetImageSrc() == '' ||
      this.ButtonInfo.GetImageHoverSrc() == '' ||
      !this.ButtonInfo.onClicked)
  {
    return false;
  }
  return true;
};

TspContextButtonManager.prototype.addContextButtonToElement = function (AWindow, AElement, AContextButtonType, AonContextButtonInitializeCallback)
{
  if (AWindow && AElement && AonContextButtonInitializeCallback)
  try
  {
    // check for supported element type
    if (!spHTMLTools.IsInputEditableElement(AElement))
      return;

    if (!this.initializeButtonInfo(AonContextButtonInitializeCallback))
      return;

    // check if button already added
    var i = this.indexOfButton(AElement);
    if (i != -1)
    {
      if (this.Log.Info)
        spLog.logMessage('TspContextButtonManager.addContextButtonToElement() Button already added (list) for ' + spHTMLTools.GetElementDebugInfo(AElement));
      return;
    }

    // add button
    /*
    var needImg = false;
    var elementStyle = spHTMLTools.GetElementStyle(AElement);
    if (!elementStyle)
      needImg = true; // some error
    else
    {
      var bgColor = elementStyle.backgroundColor;
      if (spTools.IsTransparentColor(bgColor))
        needImg = true;
    }
    */
    var contextButton = null;
    if (AContextButtonType == this.ContextButtonType.IgnoreAdding)
      return;
    else if (AContextButtonType == this.ContextButtonType.Invisible)
      contextButton = new TspContextButtonInvisible();
    else if (AContextButtonType == this.ContextButtonType.ContextButtonBackgroundImg)
      contextButton = new TspContextButtonBackgroundImg();
    else
      contextButton = new TspContextButtonImg();
    contextButton.addButtonToElement(AWindow, AElement, this.ButtonInfo);
    this.ContextButtons.push(contextButton);
    if (this.Log.Info)
      spLog.logMessage('TspContextButtonManager.addContextButtonToElement() Button added for ' + spHTMLTools.GetElementDebugInfo(AElement));
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonManager.addContextButtonToElement() Error: ' + ErrorMessage);
  }
};

TspContextButtonManager.prototype.updateContextButtonsImage = function ()
{
  try
  {
    for (var i = this.ContextButtons.length-1; i >= 0; i--)
    {
      var contextButton = this.ContextButtons[i];
      contextButton.updateButtonImage(this.ButtonInfo);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspContextButtonManager.updateContextButtonsImage() Error: ' + ErrorMessage);
  }
};

var spContextButtonManager = new TspContextButtonManager();
// keep 2 existing instances of ContextButton to prevent exporting unnecessary tags to DOMXml
var spContextButtonImg = new TspContextButtonImg();
var spContextButtonBackgroundImg = new TspContextButtonBackgroundImg();



// TspInputValueCache ----------------------------------------------------------

function TspInputValueCache(AWindow, AInput)
{
  this.Window = AWindow;
  this.Input = AInput;
  this.lastValue = '';
  this.lastValueValid = true;
}

TspInputValueCache.prototype.setLastValue = function(AValue)
{
  this.lastValue = AValue;
  this.lastValueValid = true;
};

TspInputValueCache.prototype.setLastValueValid = function(AValueValid)
{
  this.lastValueValid = AValueValid;
};

TspInputValueCache.prototype.replaceInputSelectionValue = function (AReplaceTo, ASelectionStart, ASelectionEnd)
{
  var sLeft = this.lastValue.slice(0, ASelectionStart);
  var sRight = this.lastValue.slice(ASelectionEnd, this.lastValue.length);
  // check for max length
  if (AReplaceTo && AReplaceTo.length > 0 && this.Input.maxLength > 0)
  {
    var availableLength = this.Input.maxLength - sLeft.length - sRight.length;
    if (availableLength <= 0)
      return; // no more input allowed
    AReplaceTo = AReplaceTo.slice(0, availableLength);
  }
  this.setLastValue(sLeft + AReplaceTo + sRight);
};



// TspInputValueCacheMethod ----------------------------------------------------

function TspInputValueCacheMethod(AManager)
{
  this.Manager = AManager;

  var Self = this;
  this._onInputChangeHandler = function (AEvent)
  {
    Self._InputOnChange(AEvent);
  };
  this._onInputKeyPressHandler = function (AEvent)
  {
    Self._InputOnKeyPress(AEvent);
  };
  this._onInputCutHandler = function (AEvent)
  {
    Self._InputOnCut(AEvent);
  };
  this._onInputPasteHandler = function (AEvent)
  {
    Self._InputOnPaste(AEvent);
  };
}

TspInputValueCacheMethod.prototype._InputOnChange = function (AEvent)
{
  if (AEvent)
  try
  {
    var Input = AEvent.target;
    // cache last changed value
    this.Manager.setInputLastValue(Input, Input.value);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod._InputOnChange() Error: ' + ErrorMessage);
  }
};

TspInputValueCacheMethod.prototype._InputOnKeyPress = function (AEvent)
{
  if (AEvent)
  try
  {
    if (typeof AEvent.key == 'undefined' || !AEvent.key)
      return;
    var Input = AEvent.target;
    this.Manager.setInputLastValueValid(Input, false);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod._InputOnKeyPress() Error: ' + ErrorMessage);
  }
};

// protected input clipboard events
TspInputValueCacheMethod.prototype._InputOnCut = function (AEvent)
{
  if (AEvent)
  try
  {
    var Input = AEvent.target;
    this.Manager.setInputLastValueValid(Input, false);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod._InputOnCut() Error: ' + ErrorMessage);
  }
};

TspInputValueCacheMethod.prototype._InputOnPaste = function (AEvent)
{
  if (AEvent)
  try
  {
    var Input = AEvent.target;
    this.Manager.setInputLastValueValid(Input, false);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod._InputOnPaste() Error: ' + ErrorMessage);
  }
};

TspInputValueCacheMethod.prototype.isSupported = function(AInput)
{
  return spHTMLTools.IsInputEditableElement(AInput);
};

// attachToInput(AInput)
TspInputValueCacheMethod.prototype.attachToInput = function(AInput)
{
  if (AInput)
  try
  {
    if (!this.isSupported(AInput))
      return;

    AInput.addEventListener('change', this._onInputChangeHandler, true);
    AInput.addEventListener('keypress', this._onInputKeyPressHandler, true);
    AInput.addEventListener('cut', this._onInputCutHandler, true);
    AInput.addEventListener('paste', this._onInputPasteHandler, true);
    if (this.Manager.Log.Info)
      spLog.logMessage('TspInputValueCacheMethod.attachToInput() attached to ' + spHTMLTools.GetElementDebugInfo(AInput));
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod.attachToInput() Error: ' + ErrorMessage);
  }
};

// detachFromInput(AInput)
TspInputValueCacheMethod.prototype.detachFromInput = function(AInput)
{
  if (AInput)
  try
  {
    if (!this.isSupported(AInput))
      return;

    AInput.removeEventListener('change', this._onInputChangeHandler, true);
    AInput.removeEventListener('keypress', this._onInputKeyPressHandler, true);
    AInput.removeEventListener('cut', this._onInputCutHandler, true);
    AInput.removeEventListener('paste', this._onInputPasteHandler, true);
    if (this.Manager.Log.Info)
      spLog.logMessage('TspInputValueCacheMethod.detachFromInput() dettached from ' + spHTMLTools.GetElementDebugInfo(AInput));
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheMethod.detachFromInput() Error: ' + ErrorMessage);
  }
};



// TspProtectedInputValueCacheMethod -------------------------------------------

function TspProtectedInputValueCacheMethod(AManager)
{
  this.Manager = AManager;

  var Self = this;
  this._onInputKeyPressHandler = function (AEvent)
  {
    Self._InputOnKeyPress(AEvent);
  };
  this._onInputKeyDownHandler = function (AEvent)
  {
    Self._InputOnKeyDown(AEvent);
  };
  this._onInputKeyUpHandler = function (AEvent)
  {
    Self._InputOnKeyUp(AEvent);
  };
  this._onInputClickHandler = function (AEvent)
  {
    Self._InputOnClick(AEvent);
  };
  this._onInputCutHandler = function (AEvent)
  {
    Self._InputOnCut(AEvent);
  };
  this._onInputPasteHandler = function (AEvent)
  {
    Self._InputOnPaste(AEvent);
  };
}

TspProtectedInputValueCacheMethod.prototype.isSupported = function(AInput)
{
  var Result = spHTMLTools.IsInputEditableElement(AInput);
  if (Result)
  try
  {
    if (typeof AInput.selectionStart == 'undefined' || typeof AInput.selectionEnd == 'undefined')
      Result = false;
  }
  catch (ErrorMessage)
  {
    Result = false; // email element doesn't support selectionStart & selectionEnd properties
  }
  return Result;
};

// protected input events
TspProtectedInputValueCacheMethod.prototype._InputOnKeyPress = function (AEvent)
{
  if (AEvent)
  try
  {
    if (typeof AEvent.key == 'undefined' || !AEvent.key)
      return;

    var Input = AEvent.target;
    if (AEvent.keyCode == 13) // skip Enter from Virtual Keyboard
    {
      // force store the input value to cache
      this.Manager.setInputLastValue(Input, Input.value);
      return;
    }

    this.Manager.replaceInputSelectionValue(Input, AEvent.key, Input.selectionStart, Input.selectionEnd);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnKeyPress() Error: ' + ErrorMessage);
  }
};

TspProtectedInputValueCacheMethod.prototype._InputOnKeyDown = function (AEvent)
{
  if (AEvent)
  try
  {
    if (typeof AEvent.key == 'undefined' || !AEvent.key)
      return;

    var Input = AEvent.target;
    var selectionStart = Input.selectionStart;
    var selectionEnd = Input.selectionEnd;
    if (AEvent.key == 'Delete')
    {
      if (selectionStart == selectionEnd)
        selectionEnd += 1;
      this.Manager.replaceInputSelectionValue(Input, '', selectionStart, selectionEnd);
    }
    else if (AEvent.key == 'Backspace')
    {
      if (selectionStart == selectionEnd && selectionStart > 0)
        selectionStart -= 1;
      this.Manager.replaceInputSelectionValue(Input, '', selectionStart, selectionEnd);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnKeyDown() Error: ' + ErrorMessage);
  }
};

// clear the protected input value on some events for http://idp.mfrmls.safemls.net/idp/Authn/UserPassword
TspProtectedInputValueCacheMethod.prototype._InputOnClearValue = function (AEvent)
{
  if (AEvent)
  try
  {
    var Input = AEvent.target;
    // if we cached the value but in fact the input is empty - than clear the cache also!
    if (!Input.value.length)
      this.Manager.setInputLastValue(Input, '');
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._ClearInputValue() Error: ' + ErrorMessage);
  }
};

TspProtectedInputValueCacheMethod.prototype._InputOnKeyUp = function (AEvent)
{
  if (AEvent)
  try
  {
    if (typeof AEvent.key == 'undefined' || !AEvent.key)
      return;
    this._InputOnClearValue(AEvent);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnKeyUp() Error: ' + ErrorMessage);
  }
};

TspProtectedInputValueCacheMethod.prototype._InputOnClick = function (AEvent)
{
  if (AEvent)
  try
  {
    this._InputOnClearValue(AEvent);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnClick() Error: ' + ErrorMessage);
  }
};

// protected input clipboard events
TspProtectedInputValueCacheMethod.prototype._InputOnCut = function (AEvent)
{
  if (AEvent)
  try
  {
    var Input = AEvent.target;
    this.Manager.replaceInputSelectionValue(Input, '', Input.selectionStart, Input.selectionEnd);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnCut() Error: ' + ErrorMessage);
  }
};

TspProtectedInputValueCacheMethod.prototype._InputOnPaste = function (AEvent)
{
  if (AEvent)
  try
  {
    var clipboardData = AEvent.clipboardData.getData('text');
    if (!clipboardData)
      return;

    var Input = AEvent.target;
    this.Manager.replaceInputSelectionValue(Input, clipboardData, Input.selectionStart, Input.selectionEnd);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod._InputOnPaste() Error: ' + ErrorMessage);
  }
};

// attachToInput(AInput)
TspProtectedInputValueCacheMethod.prototype.attachToInput = function(AInput)
{
  if (AInput)
  try
  {
    if (!this.isSupported(AInput))
      return;

    AInput.addEventListener('keypress', this._onInputKeyPressHandler, true);
    AInput.addEventListener('keydown', this._onInputKeyDownHandler, true);
    AInput.addEventListener('keyup', this._onInputKeyUpHandler, true);
    AInput.addEventListener('click', this._onInputClickHandler, true);
    AInput.addEventListener('cut', this._onInputCutHandler, true);
    AInput.addEventListener('paste', this._onInputPasteHandler, true);
    if (this.Manager.Log.Info)
      spLog.logMessage('TspProtectedInputValueCacheMethod.attachToInput() attached to ' + spHTMLTools.GetElementDebugInfo(AInput));
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspProtectedInputValueCacheMethod.attachToInput() Error: ' + ErrorMessage);
  }
};



// TspInputValueCacheManager ---------------------------------------------------

function TspInputValueCacheManager()
{
  this.Log = {
    // log modes
    Info: false
  };

  this.InputCache = new Array();
  this.DefaultInputMethod = new TspInputValueCacheMethod(this);
  this.ProtectedInputMethod = new TspProtectedInputValueCacheMethod(this);

  var Self = this;
  this._onWindowUnloadHandler = function (AEvent)
  {
    Self._WindowOnUnload(AEvent);
  };
}

TspInputValueCacheManager.prototype._find = function(AInput)
{
  for (var i = 0, len = this.InputCache.length; i < len; i++)
  {
    var valueCache = this.InputCache[i];
    if (valueCache.Input == AInput)
      return valueCache;
  }
  return null;
};

TspInputValueCacheManager.prototype._WindowOnUnload = function (AEvent)
{
  if (AEvent)
  try
  {
    var Window = AEvent.currentTarget;
    if (Window)
    {
      Window.removeEventListener('unload', this._onWindowUnloadHandler, false); // remove listener, no longer needed
      // clear all elements of Window
      for (var i = this.InputCache.length-1; i >= 0; i--)
      {
        var valueCache = this.InputCache[i];
        if (valueCache.Window == Window)
          this.InputCache.splice(i, 1);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager._WindowOnUnload() Error: ' + ErrorMessage);
  }
};

// getInputValue(AInput)
TspInputValueCacheManager.prototype.getInputValue = function(AInput)
{
  if (AInput)
  try
  {
    var valueCache = this._find(AInput);
    if (valueCache && valueCache.lastValueValid)
    {
      if (this.Log.Info)
        spLog.logMessage('TspInputValueCacheManager.getInputValue() return cached value of ' + spHTMLTools.GetElementDebugInfo(AInput) + ' lastValue: <' + valueCache.lastValue + '> AInput.value: <' + AInput.value + '>');
      return valueCache.lastValue; // cached value
    }
    else
    {
      if (this.Log.Info)
        spLog.logMessage('TspInputValueCacheManager.getInputValue() return real value of ' + spHTMLTools.GetElementDebugInfo(AInput) + ' AInput.value: <' + AInput.value + '>');
      return AInput.value;         // current value
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.getInputValue() Error: ' + ErrorMessage);
  }
  return '';
};

// setInputLastValue(AInput, AValue)
TspInputValueCacheManager.prototype.setInputLastValue = function (AInput, AValue)
{
  if (AInput)
  try
  {
    // cache last changed value
    var valueCache = this._find(AInput);
    if (!valueCache)
      return;
    valueCache.setLastValue(AValue);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.setInputLastValue() Error: ' + ErrorMessage);
  }
};

// setInputLastValueValid(AInput, AValueValid)
TspInputValueCacheManager.prototype.setInputLastValueValid = function (AInput, AValueValid)
{
  if (AInput)
  try
  {
    // cache last changed value
    var valueCache = this._find(AInput);
    if (!valueCache)
      return;
    valueCache.setLastValueValid(AValueValid);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.setInputLastValueValid() Error: ' + ErrorMessage);
  }
};

// replaceInputSelectionValue(AInput, AReplaceTo, ASelectionStart, ASelectionEnd, AOnlyForProtectedMethod)
TspInputValueCacheManager.prototype.replaceInputSelectionValue = function (AInput, AReplaceTo, ASelectionStart, ASelectionEnd, AOnlyForProtectedMethod)
{
  if (AInput)
  try
  {
    var valueCache = this._find(AInput);
    if (!valueCache)
      return;
    if (AOnlyForProtectedMethod && !valueCache.useProtectedMethod)
      return;
    valueCache.replaceInputSelectionValue(AReplaceTo, ASelectionStart, ASelectionEnd);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.replaceInputSelectionValue() Error: ' + ErrorMessage);
  }
};

// _attachToInputMethod(AInput, AInputMethod)
TspInputValueCacheManager.prototype._attachToInputMethod = function(AInput, AInputMethod, AAlreadySubscribedCallback)
{
  if (AInput && AInputMethod)
  try
  {
    if (!AInputMethod.isSupported(AInput))
    {
      if (this.Log.Info)
        spLog.logMessage('TspInputValueCacheManager._attachToInputMethod() element is not supported ' + spHTMLTools.GetElementDebugInfo(AInput));
      return;
    }

    var valueCache = this._find(AInput);
    if (valueCache)
    {
      if (typeof AAlreadySubscribedCallback == 'function')
        AAlreadySubscribedCallback(valueCache);
      return; // already subscribed
    }

    var Window = spHTMLTools.GetElementAccessibleTopWindow(AInput);
    if (Window)
      Window.addEventListener('unload', this._onWindowUnloadHandler, false);

    valueCache = new TspInputValueCache(Window, AInput);
    valueCache.setLastValue(AInput.value);
    this.InputCache.push(valueCache);

    AInputMethod.attachToInput(AInput);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager._attachToInputMethod() Error: ' + ErrorMessage);
  }
};

// attachToInput(AInput)
TspInputValueCacheManager.prototype.attachToInput = function(AInput)
{
  if (AInput)
  try
  {
    this._attachToInputMethod(AInput, this.DefaultInputMethod);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.attachToInput() Error: ' + ErrorMessage);
  }
};

// attachToProtectedInput(AInput)
TspInputValueCacheManager.prototype.attachToProtectedInput = function(AInput)
{
  if (AInput)
  try
  {
    var Self = this;
    this._attachToInputMethod(AInput, this.ProtectedInputMethod,
      function (valueCache)
      {
        // detach from Default method and attach to Protected one
        if (!valueCache.useProtectedMethod)
        {
          valueCache.useProtectedMethod = true;
          Self.DefaultInputMethod.detachFromInput(AInput);
          Self.ProtectedInputMethod.attachToInput(AInput);
        }
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspInputValueCacheManager.attachToProtectedInput() Error: ' + ErrorMessage);
  }
};

var spInputValueCacheManager = new TspInputValueCacheManager();



// TspDOMChangesMonitor --------------------------------------------------------

function TspDOMChangesMonitor()
{
  this.Log = {
    // log modes
    Info: false,
    ProcessNodes: false,
    Mutation: false,
    LoadDelay: false
  };

  var Self = this;
  this._onFrameLoadHandler = function (AEvent)
  {
    Self._FrameOnLoad(AEvent);
  };
  this._onLoadDelayTimerHandler = function (AEvent)
  {
    Self._LoadDelayOnTimer(AEvent);
  };
  this._onDynamicallyMonitorTimerHandler = function (AEvent)
  {
    Self._DynamicallyMonitorOnTimer(AEvent);
  };

  this.Window = null;
  this.MutationObserver = null;
  this.LoadDelayMonitorStarted = false;
  this.AllowLoadDelayMonitor = true;
  this.AllowPasswordElementMonitor = false;
  this.VisibleAuthElementRTIDs = '';
  this.VisibleInputElementRTIDs = '';
  this.DynamicallyMonitorTimerID = 0;
  this.InDynamicallyMonitorTimer = false;

  this.PageLoadFired = false;
  this.PageLoadFiredTickCount = 0;
  this.LastDOMChangedTickCount = spTools.GetTickCount();
  this.LoadDelayStartedTickCount = 0;
  this.LoadDelayTimerID = 0;
  this.LoadDelayTimeout = 10000; // initial timeout
  this.MaxLoadDelayTimeout = 30000;
  this.MaxDOMChangesWaitTimeout = 5000;

  // public properties
  //   onPageLoadedCallback(AWindow)
  this.onPageLoadedCallback = null;
  //   onFrameLoadedCallback(AWindow, AFrame)
  this.onFrameLoadedCallback = null;
  //   onPageMutationChangesCallback(AWindow)
  this.onPageMutationChangesCallback = null;
}

TspDOMChangesMonitor.prototype =
{
  // StartMonitoring(AWindow)
  StartMonitoring: function(AWindow)
  {
    if (AWindow)
    try
    {
      if (typeof MutationObserver == 'undefined')
      {
        this.Window = AWindow; // just store the window to allow process normal 'onload' event
        if (this.Log.Info)
          spLog.logError('TspDOMChangesMonitor.StartMonitoring() Error: MutationObserver is not supported by browser!');
        return;
      }
      if (!this.MutationObserver)
      {
        var Self = this;
        this.Window = AWindow;
        this.AllowPasswordElementMonitor = false;
        this.VisibleAuthElementRTIDs = spHTMLTools.GetWindowVisibleAuthElementRTIDs(AWindow);
        this.VisibleInputElementRTIDs = spHTMLTools.GetWindowVisibleInputElementRTIDs(AWindow);
        this.MutationObserver = new MutationObserver(function (AMutations) {
          Self._MutationObserverCallback(AMutations)
        });
        this._StartDocumentMonitoring(AWindow.document);
        if (this.Log.Info)
          spLog.logMessage('TspDOMChangesMonitor.StartMonitoring() ' + 
            'New MutationObserver subscribed for <' + AWindow.document.URL + '> ' +
            'VisibleAuthElementRTIDs=<' + this.VisibleAuthElementRTIDs + '> ' + 
            'VisibleInputElementRTIDs=<' + this.VisibleInputElementRTIDs + '>'
          );
        this._StartFramesMonitoring(AWindow);
        this._attachToChildFramesOnLoad(AWindow);
        this._StartLoadDelayTimer();
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor.StartMonitoring() Error: ' + ErrorMessage);
    }
  },
 
  // StopMonitoring()
  StopMonitoring: function()
  {
    try
    {
      this._StopLoadDelayTimer();
      this._StopDynamicallyMonitorTimer();
      if (this.MutationObserver)
      {
        if (this.Log.Info)
          spLog.logMessage('TspDOMChangesMonitor.StopMonitoring() Disconnect and destroy MutationObserver for <' + this.Window.document.URL + '>');
        this.MutationObserver.disconnect();
        this.MutationObserver = null;
        this.AllowPasswordElementMonitor = false;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor.StopMonitoring() Error: ' + ErrorMessage);
    }
  },
  
  // _TryStartPasswordElementMonitoring()
  _TryStartPasswordElementMonitoring: function()
  {
    try
    {
      // try to find visible password element
      //   INFO: Temporary allowed monitoring in spite of existance of visible password element,
      //     because http://www.4shared.com/ has visible password element in SignUp form!
      var hasVisiblePasswordElement = false; // ?? spHTMLTools.HasWindowVisiblePasswordElement(this.Window);
      if (!hasVisiblePasswordElement)
      {
        this.AllowPasswordElementMonitor = true;
        if (this.Log.Info)
          spLog.logMessage('TspDOMChangesMonitor._TryStartPasswordElementMonitoring() ' + 
            'Started Password Element Monitoring for <' + this.Window.document.URL + '>'
          );
      }
      else
      {
        if (this.Log.Info)
          spLog.logError('TspDOMChangesMonitor._TryStartPasswordElementMonitoring() ' + 
            'Window has already visible password element for <' + this.Window.document.URL + '>'
          );
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._TryStartPasswordElementMonitoring() Error: ' + ErrorMessage);
    }
  },
  
  _StartDocumentMonitoring: function(ADocument)
  {
    if (ADocument)
    try
    {
      if (!this.MutationObserver)
        throw 'TspDOMChangesMonitor._StartDocumentMonitoring() MutationObserver is undefined yet!';

      var mutationTarget = ADocument;
      if (mutationTarget.body)
        mutationTarget = mutationTarget.body;
      this.MutationObserver.observe(mutationTarget, { childList: true, subtree: true,
        attributes: true, attributeOldValue: true, attributeFilter: ['src', 'style', 'class', 'placeholder']
      });
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StartDocumentMonitoring() Error: ' + ErrorMessage);
    }
    return false;
  },
  
  _StartFramesMonitoring: function(AWindow)
  {
    if (AWindow)
    try
    {
      var Self = this;
      var frameElements = AWindow.document.querySelectorAll('iframe,frame');
      if (!frameElements)
        return;
      for(var i = 0, lenFrames = frameElements.length; i < lenFrames; i++)
      {
        var frame = frameElements[i];
        frame.addEventListener('load', function _load(AEvent) {
          frame.removeEventListener('load', _load, true);

          var frameDocument = spHTMLTools.GetWindowDocument(frame); // get the loaded document!
          if (Self._StartDocumentMonitoring(frameDocument))
          {
            if (Self.Log.Info)
              spLog.logMessage('TspDOMChangesMonitor._StartFramesMonitoring() ' + 
                'New MutationObserver subscribed for loaded ' +
                spHTMLTools.GetElementDebugInfo(frame) + ' URL: <' + frame.src + '>'
              );
          }
        }, true);
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StartFramesMonitoring() Error: ' + ErrorMessage);
    }
  },

  // _MutationObserverCallback(AMutations)
  _MutationObserverCallback: function(AMutations)
  {
    if (AMutations)
    try
    {
      if (this.onPageMutationChangesCallback)
        this.onPageMutationChangesCallback(this.Window);
      // store the time of last DOM changes
      this.LastDOMChangedTickCount = spTools.GetTickCount();

      if (this.Log.Mutation)
        spLog.logMessage('>> TspDOMChangesMonitor._MutationObserverCallback() AMutations.length=' + AMutations.length);
      var Self = this;
      var mutationProcessResult = { };
      mutationProcessResult.needDynamicallyMonitor = false;
      mutationProcessResult.frames = new Array();
      
      for(var i = 0, lenMutations = AMutations.length; i < lenMutations; i++)
      {
        var mutation = AMutations[i];
        if (mutation.type === 'childList')
        {
          if (this.Log.Mutation)
            spLog.logMessage('   TspDOMChangesMonitor._MutationObserverCallback() mutation[' + (i+1) + '].type="' + mutation.type + '" ' +
              'addedNodes.length=' + mutation.addedNodes.length + ' ' +
              'removedNodes.length=' + mutation.removedNodes.length
            );
          if (mutation.addedNodes)
          {
            for(var j = 0, lenAddedNodes = mutation.addedNodes.length; j < lenAddedNodes; j++)
            {
              var addedNode = mutation.addedNodes[j];
              if (this.Log.Mutation)
                spLog.logMessage('   TspDOMChangesMonitor._MutationObserverCallback() addedNode[' + (j+1) + ']: ' +
                  spHTMLTools.GetElementDebugInfo(addedNode)
                );
              this._ProcessMutationNode(mutationProcessResult, addedNode);
              this._ProcessAddedNode(addedNode);
            }
          }
        }
        else if (mutation.type === 'attributes')
        {
          if (this.Log.Mutation)
            spLog.logMessage('   TspDOMChangesMonitor._ProcessMutationAttribute() mutation[' + (i+1) + '].type="' + mutation.type + '" ' +
              'attributeName="' + mutation.attributeName + '" oldValue=<' + mutation.oldValue + '> ' +
              'target=' + spHTMLTools.GetElementDebugInfo(mutation.target)
            );
          if (mutation.target)
            this._ProcessMutationAttribute(mutationProcessResult, mutation);
        }
      }
      
      delete mutationProcessResult.frames;
      if (mutationProcessResult.needDynamicallyMonitor)
        this._TryDynamicallyMonitor();

      if (this.Log.Mutation)
        spLog.logMessage('<< TspDOMChangesMonitor._MutationObserverCallback() AMutations.length=' + AMutations.length);
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._MutationObserverCallback() Error: ' + ErrorMessage);
    }
  },
  
  _ProcessAddedNode: function (ANode) {
    // empty in base class
  },

  _ProcessMutationNode: function (AMutationProcessResult, ANode)
  {
    if (AMutationProcessResult && ANode && ANode.tagName)
    try
    {
      var tagName = ANode.tagName.toUpperCase();
      if (spHTMLTools.IsInputAuthElement(ANode))
      {
        AMutationProcessResult.needDynamicallyMonitor = true;
        if (this.Log.ProcessNodes)
          spLog.logMessage('TspDOMChangesMonitor._ProcessMutationNode() Found auth element: ' + 
            spHTMLTools.GetElementDebugInfo(ANode)
          );
      }
      else if (tagName === 'FORM')
      {
        AMutationProcessResult.needDynamicallyMonitor = true;
        if (this.Log.ProcessNodes)
          spLog.logMessage('TspDOMChangesMonitor._ProcessMutationNode() Found form: ' + 
            spHTMLTools.GetElementDebugInfo(ANode)
          );
      }
      else if (tagName === 'IFRAME' || tagName === 'FRAME')
      {
        AMutationProcessResult.needDynamicallyMonitor = true;
        // wait unit each frame completely load
        if (AMutationProcessResult.frames.indexOf(ANode) == -1)
        {
          AMutationProcessResult.frames.push(ANode);
          ANode.addEventListener('load', this._onFrameLoadHandler, true);
          if (this.Log.ProcessNodes)
            spLog.logMessage('TspDOMChangesMonitor._ProcessMutationNode() Found frame: ' + 
              spHTMLTools.GetElementDebugInfo(ANode) + ' URL: <' + ANode.src + '>'
            );
        }
      }
      else if (ANode.children && ANode.children.length)
      {
        // node can have child [input#password/email/form/frame/iframe]
        var firstElement;

        firstElement = ANode.querySelector('input[type="password"]');
        if (firstElement)
          this._ProcessMutationNode(AMutationProcessResult, firstElement);

        firstElement = ANode.querySelector('input[type="email"]');
        if (firstElement)
          this._ProcessMutationNode(AMutationProcessResult, firstElement);

        firstElement = ANode.querySelector('form');
        if (firstElement)
          this._ProcessMutationNode(AMutationProcessResult, firstElement);

        var frameElements = ANode.querySelectorAll('iframe,frame');
        if (frameElements)
          for(var i = 0, len = frameElements.length; i < len; i++)
            this._ProcessMutationNode(AMutationProcessResult, frameElements[i]);
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._ProcessMutationNode() Error: ' + ErrorMessage);
    }
  },

  _ProcessMutationAttribute: function (AMutationProcessResult, AMutation)
  {
    if (AMutation && AMutation.target)
    try
    {
      // https://www.mediafire.com/
      if (AMutation.attributeName === 'src')
      {
        var tagName = AMutation.target.tagName.toUpperCase();
        if (tagName === 'IFRAME' || tagName === 'FRAME')
        {
          // frame navigated to the new URL
          this._ProcessMutationNode(AMutationProcessResult, AMutation.target);
        }
      }
      else if (AMutation.attributeName === 'style')
      {
        // http://mixtape.me/
        if (AMutation.oldValue)
        {
          var oldValue = AMutation.oldValue.replace(/ /g, '');
          oldValue = oldValue.replace(/'/g, '');
          oldValue = oldValue.replace(/"/g, '');
          oldValue = oldValue.toLowerCase();
          if (oldValue.indexOf('display:none') != -1 ||
              oldValue.indexOf('visibility:hidden') != -1 ||
              oldValue.indexOf('opacity:0') != -1 ||
              oldValue.indexOf('left:-') != -1 ||
              oldValue.indexOf('top:-') != -1
             )
          {
            // element shown
            this._ProcessMutationNode(AMutationProcessResult, AMutation.target);
          }
        }
        else
        {
          // element can have class-specified style and later changed to other one
          this._ProcessMutationNode(AMutationProcessResult, AMutation.target);
        }
      }
      else if (AMutation.attributeName === 'class')
      {
        // element can be shown
        this._ProcessMutationNode(AMutationProcessResult, AMutation.target);
      }
      // https://gravityzone.bitdefender.com/ attributeName="placeholder"
      else if (spHTMLTools.IsInputAuthElement(AMutation.target))
      {
        this._ProcessMutationNode(AMutationProcessResult, AMutation.target);
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._ProcessMutationAttribute() Error: ' + ErrorMessage);
    }
  },

  _attachToChildFramesOnLoad: function (AWindow)
  {
    if (AWindow)
    try
    {
      var windowDocument = spHTMLTools.GetWindowDocument(AWindow);
      if (!windowDocument)
        return;
      var frameElements = windowDocument.querySelectorAll('iframe,frame');
      if (!frameElements)
        return;
      for(var i = 0, lenFrames = frameElements.length; i < lenFrames; i++)
      {
        var frame = frameElements[i];
        frame.addEventListener('load', this._onFrameLoadHandler, true);
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._attachToChildFramesOnLoad() Error: ' + ErrorMessage);
    }
  },

  _FrameOnLoad: function (AEvent)
  {
    if (AEvent)
    try
    {
      var AFrame = AEvent.target;
      if (AFrame)
      {
        this._attachToChildFramesOnLoad(AFrame);

        if (this.onFrameLoadedCallback)
          this.onFrameLoadedCallback(this.Window, AFrame);

        if (this.Log.ProcessNodes)
          spLog.logMessage('TspDOMChangesMonitor._FrameOnLoad() Frame loaded: ' + 
            spHTMLTools.GetElementDebugInfo(AFrame) + ' URL: <' + AFrame.src + '>'
          );
        this._TryDynamicallyMonitor();
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._FrameOnLoad() Error: ' + ErrorMessage);
    }
  },

  _ProcessPageLoadedByDynamicallyMonitor: function ()
  {
    // >> INFO: allowed to monitor even after 1st showing of input password!
    // ?? prevent any additional attempts of dynamically monitoring!
    // ?? this.StopMonitoring();
    // << INFO
    // add some timeout before calling event handler to allow form elements correctly positioned on the screen
    var Self = this;
    if (Self.onPageLoadedCallback)
      setTimeout(function (AEvent) {
        Self.onPageLoadedCallback(Self.Window);
      }, 500);
  },

  _ProcessPageLoaded: function ()
  {
    this.PageLoadFired = true;
    this.PageLoadFiredTickCount = spTools.GetTickCount();
    this.VisibleAuthElementRTIDs = spHTMLTools.GetWindowVisibleAuthElementRTIDs(this.Window);
    if (!this.VisibleInputElementRTIDs) // allow fire event only for the first time
      this.VisibleInputElementRTIDs = spHTMLTools.GetWindowVisibleInputElementRTIDs(this.Window);
    if (this.Log.Info)
      spLog.logMessage('TspDOMChangesMonitor._ProcessPageLoaded() for <' + this.Window.document.URL + '> ' +
        'VisibleAuthElementRTIDs=<' + this.VisibleAuthElementRTIDs + '> ' + 
        'VisibleInputElementRTIDs=<' + this.VisibleInputElementRTIDs + '>'
      );
    this._StopLoadDelayTimer();
    this._TryStartPasswordElementMonitoring();
    if (this.onPageLoadedCallback)
      this.onPageLoadedCallback(this.Window);
  },

  // TryProcessPageLoaded()
  //   this method called from real 'onload' event of document
  TryProcessPageLoaded: function()
  {
    if (this.PageLoadFired)
    {
      if (this.Log.Info)
        spLog.logMessage('TspDOMChangesMonitor.TryProcessPageLoaded() WARNING: onPageLoadedCallback already fired for <' + this.Window.document.URL + '>');
      return;
    }
    this._ProcessPageLoaded();
  },

  _TryDynamicallyMonitor: function ()
  {
    try
    {
      if (!this.MutationObserver)
      {
        if (this.Log.Info)
          spLog.logError('TspDOMChangesMonitor._TryDynamicallyMonitor() Monitoring is not started!');
        return;
      }
      if (this.InDynamicallyMonitorTimer)
      {
        if (this.Log.Info)
          spLog.logError('TspDOMChangesMonitor._TryDynamicallyMonitor() InDynamicallyMonitorTimer!');
        return;
      }
      if (!this.AllowPasswordElementMonitor)
      {
        if (this.Log.ProcessNodes)
          spLog.logError('TspDOMChangesMonitor._TryDynamicallyMonitor() Password Element Monitoring is not started!');
        return;
      }

      this._StartDynamicallyMonitorTimer();
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._TryDynamicallyMonitor() Error: ' + ErrorMessage);
    }
  },

  _StartDynamicallyMonitorTimer: function ()
  {
    try
    {
      this._StopDynamicallyMonitorTimer();

      this.DynamicallyMonitorTimerID = setTimeout(this._onDynamicallyMonitorTimerHandler, 1250);
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StartDynamicallyMonitorTimer() Error: ' + ErrorMessage);
    }
  },

  _StopDynamicallyMonitorTimer: function ()
  {
    try
    {
      if (this.DynamicallyMonitorTimerID)
      {
        clearTimeout(this.DynamicallyMonitorTimerID);
        this.DynamicallyMonitorTimerID = 0;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StopDynamicallyMonitorTimer() Error: ' + ErrorMessage);
    }
  },

  _DynamicallyMonitorOnTimer: function (AEvent)
  {
    if (this.InDynamicallyMonitorTimer)
    {
      if (this.Log.Info)
        spLog.logError('TspDOMChangesMonitor._DynamicallyMonitorOnTimer() InDynamicallyMonitorTimer!');
      return;
    }
    this.InDynamicallyMonitorTimer = true;
    try
    {
      // clear the timer ID and process the event
      this.DynamicallyMonitorTimerID = 0; 
      if (this.Log.ProcessNodes) spLog.logMessage('>> TspDOMChangesMonitor._DynamicallyMonitorOnTimer() for <' + this.Window.document.URL + '>');
      if (this.AllowPasswordElementMonitor)
      {
        // try to find visible auth element
        var oldVisibleAuthElementRTIDs = this.VisibleAuthElementRTIDs;
        this.VisibleAuthElementRTIDs = spHTMLTools.GetWindowVisibleAuthElementRTIDs(this.Window);
        if (this.VisibleAuthElementRTIDs != oldVisibleAuthElementRTIDs &&
            // there should be new auth elements
            this.VisibleAuthElementRTIDs &&
            // new auth elements should not be in the old elements list already
            oldVisibleAuthElementRTIDs.indexOf(this.VisibleAuthElementRTIDs) == -1
           )
        {
          if (this.Log.Info)
            spLog.logMessage('TspDOMChangesMonitor._DynamicallyMonitorOnTimer() ' +
              'Found visible auth element for <' + this.Window.document.URL + '> ' +
              'oldVisibleAuthElementRTIDs=<' + oldVisibleAuthElementRTIDs + '> ' +
              'newVisibleAuthElementRTIDs=<' + this.VisibleAuthElementRTIDs + '>'
            );
          if (!this.VisibleInputElementRTIDs) // allow fire event only for the first time
            this.VisibleInputElementRTIDs = spHTMLTools.GetWindowVisibleInputElementRTIDs(this.Window);
          this._ProcessPageLoadedByDynamicallyMonitor();
        }
        else if (!this.VisibleInputElementRTIDs) // allow fire event only for the first time
        {
          var newVisibleInputElementRTIDs = spHTMLTools.GetWindowVisibleInputElementRTIDs(this.Window);
          if (this.VisibleInputElementRTIDs != newVisibleInputElementRTIDs)
          {
            if (this.Log.Info)
              spLog.logMessage('TspDOMChangesMonitor._DynamicallyMonitorOnTimer() ' +
                'Found visible input element for <' + this.Window.document.URL + '> ' +
                'oldVisibleInputElementRTIDs=<' + this.VisibleInputElementRTIDs + '> ' +
                'newVisibleInputElementRTIDs=<' + newVisibleInputElementRTIDs + '>'
              );
            this.VisibleInputElementRTIDs = newVisibleInputElementRTIDs;
            this._ProcessPageLoadedByDynamicallyMonitor();
          }
        }
      }
      if (this.Log.ProcessNodes) spLog.logMessage('<< TspDOMChangesMonitor._DynamicallyMonitorOnTimer() for <' + this.Window.document.URL + '>');
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._DynamicallyMonitorOnTimer() Error: ' + ErrorMessage);
    }
    this.InDynamicallyMonitorTimer = false;
  },

  TryStartLoadDelayTimer: function()
  {
    try
    {
      if (!this.AllowPasswordElementMonitor)
      {
        if (this.Log.LoadDelay)
          spLog.logError('TspDOMChangesMonitor.TryStartLoadDelayTimer() Password Element Monitoring is not started!');
        return;
      }
      if (this.LoadDelayMonitorStarted)
      {
        if (this.Log.LoadDelay)
          spLog.logMessage('TspDOMChangesMonitor.TryStartLoadDelayTimer() Load delay timer was already started once before for <' + this.Window.document.URL + '>');
        return;
      }
      this.LoadDelayMonitorStarted = true; // start the timer only once!

      // start the timer untill password element found
      this.MaxDOMChangesWaitTimeout = 1500;
      this.LoadDelayTimeout = 500;
      this._StartLoadDelayTimer();
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor.TryStartLoadDelayTimer() Error: ' + ErrorMessage);
    }
  },

  _StartLoadDelayTimer: function()
  {
    try
    {
      if (!this.AllowLoadDelayMonitor)
      {
        if (this.Log.LoadDelay)
          spLog.logMessage('TspDOMChangesMonitor._StartLoadDelayTimer(' + this.LoadDelayTimeout + ') Load delay monitoring is disallowed for <' + this.Window.document.URL + '>');
        return;
      }

      this._StopLoadDelayTimer();

      if (!this.LoadDelayStartedTickCount)
        this.LoadDelayStartedTickCount = spTools.GetTickCount();
      this.LoadDelayTimerID = setTimeout(this._onLoadDelayTimerHandler, this.LoadDelayTimeout);
      if (this.Log.LoadDelay)
        spLog.logMessage('TspDOMChangesMonitor._StartLoadDelayTimer(' + this.LoadDelayTimeout + ') for <' + this.Window.document.URL + '>');
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StartLoadDelayTimer() Error: ' + ErrorMessage);
    }
  },

  _StopLoadDelayTimer: function()
  {
    try
    {
      if (!this.LoadDelayTimerID)
        return;
      if (this.Log.LoadDelay)
        spLog.logMessage('TspDOMChangesMonitor._StopLoadDelayTimer() for <' + this.Window.document.URL + '>');
      clearTimeout(this.LoadDelayTimerID);
      this.LoadDelayTimerID = 0;
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._StopLoadDelayTimer() Error: ' + ErrorMessage);
    }
  },

  _LoadDelayOnTimer: function (AEvent)
  {
    try
    {
      // clear the timer ID and process the event
      this.LoadDelayTimerID = 0; 

      var dTickCount;

      // check if document load is timeout?
      dTickCount = spTools.GetTickCount() - this.LoadDelayStartedTickCount;
      if (dTickCount > this.MaxLoadDelayTimeout)
      {
        if (this.Log.Info)
          spLog.logMessage('TspDOMChangesMonitor._LoadDelayOnTimer() document load timeout, ' + 
            dTickCount + ' msecs elapsed since the document loading start for <' + this.Window.document.URL + '>');
        this._ProcessPageLoaded();
        return;
      }
      else
      {
        if (this.Log.LoadDelay)
          spLog.logMessage('TspDOMChangesMonitor._LoadDelayOnTimer() ' + 
            dTickCount + ' msecs elapsed since the document loading start for <' + this.Window.document.URL + '>');
      }

      // check if document structure hasn't been changed for some timeout?
      dTickCount = spTools.GetTickCount() - this.LastDOMChangedTickCount;
      if (dTickCount > this.MaxDOMChangesWaitTimeout)
      {
        // check if visible auth element exists
        if (spHTMLTools.HasWindowVisibleAuthElement(this.Window))
        {
          if (this.Log.Info)
            spLog.logMessage('TspDOMChangesMonitor._LoadDelayOnTimer() document load timeout, ' + 
              dTickCount + ' msecs elapsed since the last DOM changes for <' + this.Window.document.URL + '>');
          this._ProcessPageLoaded();
          return;
        }
      }
      else 
      {
        if (this.Log.LoadDelay)
          spLog.logMessage('TspDOMChangesMonitor._LoadDelayOnTimer() ' + 
            dTickCount + ' msecs elapsed since the last DOM changes for <' + this.Window.document.URL + '>');
      }

      // restart the timer
      this._StartLoadDelayTimer();
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspDOMChangesMonitor._LoadDelayOnTimer() Error: ' + ErrorMessage);
    }
  }
}



// TspPageEventsMonitor --------------------------------------------------------

function TspPageEventsMonitor()
{
  this.Log = {
    // log modes
    Info: false,
    Warnings: false,
    CrossOriginPageLoaded: false,
    HTMLFormElementPrototype: false
  };
  var Self = this;
  this._onPageSubmitHandler = function (AEvent)
  {
    Self.PageOnSubmit(AEvent);
  };
  this._onPageSubmitJSHandler = function (AEvent)
  {
    Self.PageOnSubmitJS(AEvent);
  };
  this.SubmitElements = new Array();
  this.EnterKeyPressElements = new Array();
  this.LastPageSubmitTickCount = 0;

  // public properties
  //   onFrameLoadedCallback(AWindow, AFrame)
  this.onFrameLoadedCallback = null;
  //   onPageLoadedCallback(AWindow)
  this.onPageLoadedCallback = null;
  //   onPageSubmittingCallback(AEvent, AWindow, AForm)
  this.onPageSubmittingCallback = null;
  //   onPageUnloadingCallback(AEvent, AWindow)
  this.onPageUnloadingCallback = null;
}

// _FireSubmitEvent(AElement)
TspPageEventsMonitor.prototype._FireSubmitEvent = function(AElement, AOldForm)
{
  if (AElement)
  try
  {
    var spEvent = document.createEvent('Event');
    spEvent.initEvent('sp_submit', true, true);
    if (AElement.form)
      AElement.form.dispatchEvent(spEvent);
    // login.live.com detaches the submit button from the document tree while user clicking it,
    // therefore when we send event from the button - it doesn't delivered to window and nobody can't catch it
    else if (AOldForm && typeof AOldForm.dispatchEvent == 'function')
      AOldForm.dispatchEvent(spEvent);
    else
      AElement.dispatchEvent(spEvent);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor._FireSubmitEvent() Error: ' + ErrorMessage);
  }
};

// ConnectToSubmitElementClick(AElement)
TspPageEventsMonitor.prototype.ConnectToSubmitElementClick = function(AElement)
{
  if (AElement)
  try
  {
    // deny to connect to element more than 1 time!
    if (this.SubmitElements.indexOf(AElement) != -1)
      return;
    this.SubmitElements.push(AElement);

    var Self = this;
    var oldForm = AElement.form;
    AElement.addEventListener('click', function (AEvent) {
      Self._FireSubmitEvent(AElement, oldForm);
    }, true);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.ConnectToSubmitElementClick() Error: ' + ErrorMessage);
  }
};

// ConnectToElementEnterKeyPress(AElement)
TspPageEventsMonitor.prototype.ConnectToElementEnterKeyPress = function(AElement)
{
  if (AElement)
  try
  {
    // check for supported element type
    if (!spHTMLTools.IsInputEditableElement(AElement))
      return;

    // deny to connect to element more than 1 time!
    if (this.EnterKeyPressElements.indexOf(AElement) != -1)
      return;
    this.EnterKeyPressElements.push(AElement);

    var Self = this;
    var oldForm = AElement.form;
    // INFO: If the site script calls event.preventDefault() from its keydown handler,
    //   then keypress event will be never fired; therefore it's better to attach to keydown event.
    AElement.addEventListener('keydown', function (AEvent) {
      if (AEvent.keyCode == 13)
      {
        // force store the input value to cache
        spInputValueCacheManager.setInputLastValue(AElement, AElement.value);

        Self._FireSubmitEvent(AElement, oldForm);
      }
    }, true);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.ConnectToElementEnterKeyPress() Error: ' + ErrorMessage);
  }
};

// ConnectToSubmitEvents(AWindow)
TspPageEventsMonitor.prototype.ConnectToSubmitEvents = function(AWindow)
{
  if (AWindow)
  try
  {
    this.ConnectElementToSubmitEvent(AWindow);
    this.ConnectElementToSubmitJSEvent(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.ConnectToSubmitEvents() Error: ' + ErrorMessage);
  }
};

// DisconnectFromSubmitEvents(AWindow)
TspPageEventsMonitor.prototype.DisconnectFromSubmitEvents = function(AWindow)
{
  if (AWindow)
  try
  {
    this.DisconnectElementFromSubmitJSEvent(AWindow);
    this.DisconnectElementFromSubmitEvent(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.DisconnectFromSubmitEvents() Error: ' + ErrorMessage);
  }
};

// ConnectElementToSubmitEvent(ATargetElement)
TspPageEventsMonitor.prototype.ConnectElementToSubmitEvent = function(ATargetElement)
{
  if (ATargetElement)
    ATargetElement.addEventListener('submit', this._onPageSubmitHandler, true);
};

// ConnectElementToSubmitJSEvent(ATargetElement)
TspPageEventsMonitor.prototype.ConnectElementToSubmitJSEvent = function(ATargetElement)
{
  if (ATargetElement)
    ATargetElement.addEventListener('sp_submit', this._onPageSubmitJSHandler, false, true);
};

// DisconnectElementFromSubmitEvent(ATargetElement)
TspPageEventsMonitor.prototype.DisconnectElementFromSubmitEvent = function(ATargetElement)
{
  if (ATargetElement)
    ATargetElement.removeEventListener('submit', this._onPageSubmitHandler, true);
};

// DisconnectElementFromSubmitJSEvent(ATargetElement)
TspPageEventsMonitor.prototype.DisconnectElementFromSubmitJSEvent = function(ATargetElement)
{
  if (ATargetElement)
    ATargetElement.removeEventListener('sp_submit', this._onPageSubmitJSHandler, false);
};

// PageOnLoad(AEvent)
TspPageEventsMonitor.prototype.PageOnLoad = function(AEvent)
{
  if (AEvent)
  try
  {
    var ADocument = null;
    try
    {
      if (typeof HTMLDocument == 'undefined')
        ADocument = AEvent.target;
      if (AEvent.target instanceof HTMLDocument)
        ADocument = AEvent.target;
      else if (AEvent.target.wrappedJSObject && AEvent.target.wrappedJSObject instanceof HTMLDocument)
        ADocument = AEvent.target.wrappedJSObject; // AEvent.target can be the XPCNativeWrapper!
	  else if (spStrings.SameText(AEvent.target.contentType, 'application/xhtml+xml'))
        ADocument = AEvent.target;
    }
    catch (ErrorMessage)
    {
      // ?? spLog.logError('TspPageEventsMonitor.PageOnLoad() Error: ' + ErrorMessage);
      ADocument = AEvent.target; // temporary fix for Opera 12 error: "Undefined variable: HTMLDocument"
    }

    // skip event of denied documents!
    if (!spHTMLTools.AllowProcessDocument(ADocument))
    {
      if (this.Log.Warnings)
        spLog.logMessage('TspPageEventsMonitor.PageOnLoad() WARNING: Loaded disallowed document URL=<' + ADocument.URL + '>, ignore PageLoaded event');
      return;
    }

    var AWindow = ADocument.defaultView;

    // install HTMLFormElement prototype for window/frame
    this.InstallHTMLFormElementPrototypeForWindow(AWindow);

    if (!this.AllowProcessPageLoaded(AWindow))
    {
      if (this.Log.Warnings)
        spLog.logMessage('TspPageEventsMonitor.PageOnLoad() WARNING: Loaded frame URL=<' + ADocument.URL + '>, ignore PageLoaded event');
      return;
    }

    this.TryProcessPageLoaded(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.PageOnLoad() Error: ' + ErrorMessage);
  }
};

// AllowProcessPageLoaded(AWindow)
TspPageEventsMonitor.prototype.AllowProcessPageLoaded = function(AWindow)
{
  if (!AWindow)
    return false;

  // skip event of child frames!
  if (!spHTMLTools.IsTopWindow(AWindow))
    return false;

  return true;
};

// ProcessPageLoaded(AWindow)
TspPageEventsMonitor.prototype.ProcessPageLoaded = function(AWindow)
{
  if (AWindow)
  try
  {
    var ADocument = AWindow.document;
    if (this.Log.Info)
      spLog.logMessage('TspPageEventsMonitor.ProcessPageLoaded() ADocument.URL=<' + ADocument.URL + '>');

    if (this.onPageLoadedCallback)
      this.onPageLoadedCallback(AWindow);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.ProcessPageLoaded() Error: ' + ErrorMessage);
  }
};

// ProcessFrameLoaded(AWindow, AFrame)
TspPageEventsMonitor.prototype.ProcessFrameLoaded = function (AWindow, AFrame)
{
  if (AFrame)
  try
  {
    if (this.Log.Info)
      spLog.logMessage('TspPageEventsMonitor.ProcessFrameLoaded() AFrame.src=<' + AFrame.src + '>');

    // install HTMLFormElement prototype for found frame
    this.InstallHTMLFormElementPrototypeForWindow(AFrame);
    
    if (this.onFrameLoadedCallback)
      this.onFrameLoadedCallback(AWindow, AFrame);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.ProcessFrameLoaded() Error: ' + ErrorMessage);
  }
};

TspPageEventsMonitor.prototype.ProcessPageMutationChanges = function (AWindow)
{
  // empty
};

TspPageEventsMonitor.prototype._CreateDOMChangesMonitorInstance = function()
{
  return new TspDOMChangesMonitor();
};

// CreateDOMChangesMonitor(AWindow)
TspPageEventsMonitor.prototype.CreateDOMChangesMonitor = function(AWindow)
{
  if (AWindow)
  try
  {
    var DOMChangesMonitor = this._CreateDOMChangesMonitorInstance();
    this.InitDOMChangesMonitor(DOMChangesMonitor, AWindow);
    DOMChangesMonitor.StartMonitoring(AWindow);
    return DOMChangesMonitor;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.CreateDOMChangesMonitor() Error: ' + ErrorMessage);
  }

  spLog.logError('TspPageEventsMonitor.CreateDOMChangesMonitor() AWindow not specified!');
  return null;
};

// InitDOMChangesMonitor(ADOMChangesMonitor, AWindow)
TspPageEventsMonitor.prototype.InitDOMChangesMonitor = function (ADOMChangesMonitor, AWindow)
{
  if (ADOMChangesMonitor && AWindow)
  try
  {
    var Self = this;
    ADOMChangesMonitor.onPageLoadedCallback = function (AWindow) {
      Self.ProcessPageLoaded(AWindow);
    };
    ADOMChangesMonitor.onFrameLoadedCallback = function (AWindow, AFrame) {
      Self.ProcessFrameLoaded(AWindow, AFrame);
    };
    ADOMChangesMonitor.onPageMutationChangesCallback = function (AWindow) {
      Self.ProcessPageMutationChanges(AWindow);
    };
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.InitDOMChangesMonitor() Error: ' + ErrorMessage);
  }
};

// TryStartLoadDelayTimer()
TspPageEventsMonitor.prototype.TryStartLoadDelayTimer = function()
{
  if (this.DOMChangesMonitor)
    this.DOMChangesMonitor.TryStartLoadDelayTimer();
};
    
// PageOnSubmit(AEvent)
TspPageEventsMonitor.prototype.PageOnSubmit = function (AEvent)
{
  this.ProcessPageSubmit(AEvent, 'TspPageEventsMonitor.PageOnSubmit()');
};

// PageOnSubmitJS(AEvent)
TspPageEventsMonitor.prototype.PageOnSubmitJS = function (AEvent)
{
  this.ProcessPageSubmit(AEvent, 'TspPageEventsMonitor.PageOnSubmitJS()');
};

// ProcessPageSubmit(AEvent, SenderFunctionName)
TspPageEventsMonitor.prototype.ProcessPageSubmit = function (AEvent, SenderFunctionName)
{
  try
  {
    var AForm = this.GetFormFromSubmitEvent(AEvent);
    if (!AForm)
    {
      if (this.Log.Warnings)
        spLog.logError(SenderFunctionName + ' WARNING: Unknown form in onSubmit event!');
      if (!AEvent.target)
      {
        if (this.Log.Warnings)
          spLog.logError(SenderFunctionName + ' WARNING: Unknown target element in onSubmit event!'); 
        return;
      }
    }
    else
    {
      if (this.Log.Info)
      {
        var FormAction = spHTMLTools.GetHTMLFormAction(AForm);
        var FormOnSubmit = spHTMLTools.GetElementFunctionAttributeAsStr(AForm, 'onsubmit');
        spLog.logMessage(SenderFunctionName + ' Form: ' + spHTMLTools.GetElementDebugInfo(AForm) +
          ' action: <' + FormAction + '> method: <' + AForm.method + '> onsubmit: <' + FormOnSubmit + '>'
        );
      }
    }

    // check if onSubmit event allowed to process since last handling
    if (this.LastPageSubmitTickCount != 0)
    {
      var dTickCount = spTools.GetTickCount() - this.LastPageSubmitTickCount;
      if (dTickCount < 3000) // in milliseconds
      {
        if (this.Log.Warnings)
          spLog.logMessage(SenderFunctionName + ' WARNING: Last onSubmit event was ' + dTickCount + ' msecs ago, ignored!');
        return;
      }
    }

    var ADocument = null;
    if (AForm)
      ADocument = AForm.ownerDocument;
    else
      ADocument = AEvent.target.ownerDocument;
    if (!spHTMLTools.AllowProcessDocument(ADocument))
    {
      if (this.Log.Warnings)
        spLog.logError(SenderFunctionName + ' WARNING: Submitting disallowed document URL=<' + ADocument.URL + '>');
      return;
    }

    var AWindow = ADocument.defaultView;
    if (!AWindow)
      AWindow = window;
    // convert AWindow to top one (cause of frames using)
    AWindow = spHTMLTools.GetAccessibleTopWindow(AWindow);

    if (!this.AllowProcessPageSubmit(AWindow))
    {
      if (this.Log.Warnings)
        spLog.logMessage('TspPageEventsMonitor.ProcessPageSubmit() WARNING: URL=<' + ADocument.URL + '>, ignore PageSubmit event');
      return;
    }

    if (this.onPageSubmittingCallback)
      this.onPageSubmittingCallback(AEvent, AWindow, AForm);
    this.StoreLastPageSubmitTickCount();
  }
  catch (ErrorMessage)
  {
    spLog.logError(SenderFunctionName + ' Error: ' + ErrorMessage);
  }
};

// AllowProcessPageSubmit(AWindow)
TspPageEventsMonitor.prototype.AllowProcessPageSubmit = function(AWindow)
{
  if (!AWindow)
    return false;

  // skip event in the top window from child same-origin frame!
  if (AWindow != window)
  {
    var cot = spHTMLTools.GetWindowCrossOriginType(AWindow);
    if (cot == spHTMLTools.CrossOriginType.coSameOriginDomain)
      return false;
  }

  return true;
};

// StoreLastPageSubmitTickCount()
TspPageEventsMonitor.prototype.StoreLastPageSubmitTickCount = function()
{
  this.LastPageSubmitTickCount = spTools.GetTickCount();
};

// GetFormFromSubmitEvent(AEvent)
TspPageEventsMonitor.prototype.GetFormFromSubmitEvent = function (AEvent)
{
  var Result = null;
  if (AEvent)
  try
  {
    // as default sender is the form
    if (typeof HTMLFormElement == 'undefined')
      Result = AEvent.target;
    if (AEvent.target instanceof HTMLFormElement)
      Result = AEvent.target;
    // for the form located inside of iframe in Chrome the 'instanceof HTMLFormElement' 
    //   doesn't work, therefore additionally check tag name of target!
    else if (AEvent.target && (AEvent.target.tagName.toUpperCase() == 'FORM'))
      Result = AEvent.target;
    // on ASP .NET sites the is only 1 form and sender is window
    else if (AEvent.target.document)
    {
      var ADocument = AEvent.target.document;
      if (ADocument.forms && ADocument.forms.length)
        Result = ADocument.forms[0];
      else
        spLog.logError('TspPageEventsMonitor.GetFormFromSubmitEvent() Error finding the form from event.');
    }
  }
  catch (ErrorMessage)
  {
    // ?? spLog.logError('TspPageEventsMonitor.GetFormFromSubmitEvent() Error: ' + ErrorMessage);
    Result = AEvent.target; // temporary fix for Opera 12 error: "Undefined variable: HTMLFormElement"
  }
  return Result;
};

// InstallHTMLFormElementPrototypeForWindow(AWindow)
TspPageEventsMonitor.prototype.InstallHTMLFormElementPrototypeForWindow = function (AWindow)
{
  if (AWindow)
  try
  {
    var DocumentList = spHTMLTools.GetHTMLDocumentList(AWindow);
    for (var i = 0, lenDocuments = DocumentList.length; i < lenDocuments; i++)
    {
      var ADocument = DocumentList[i];
      if (ADocument.wrappedJSObject)
        ADocument = ADocument.wrappedJSObject; // ADocument can be the XPCNativeWrapper!
      if (!spHTMLTools.AllowProcessDocument(ADocument))
      {
        if (this.Log.HTMLFormElementPrototype)
          spLog.logMessage('TspPageEventsMonitor.InstallHTMLFormElementPrototypeForWindow(): Disallowed document for URL: <' + ADocument.URL + '>');
        continue;
      }
      this.InstallHTMLFormElementPrototypeForDocument(ADocument);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.InstallHTMLFormElementPrototypeForWindow() Error: ' + ErrorMessage);
  }
};

// InstallHTMLFormElementPrototypeForDocument(ADocument)
TspPageEventsMonitor.prototype.InstallHTMLFormElementPrototypeForDocument = function (ADocument)
{
  if (ADocument)
  try
  {
    // try to find parent element for script
    var scriptParent = (ADocument.head || ADocument.body || ADocument.documentElement);
    if (!scriptParent)
      return;
    // check if script has been already added
    var scriptId = 'spHTMLFormElementPrototypeScript';
    if (ADocument.getElementById(scriptId))
      return;
    // add script
    if (this.Log.HTMLFormElementPrototype)
      spLog.logMessage('TspPageEventsMonitor.InstallHTMLFormElementPrototypeForDocument(): Install script for URL: <' + ADocument.URL + '>');
    var scriptElement = ADocument.createElement('script');
	var script = '(' + spFormElementPrototype.GetHTMLFormElementPrototype.toString() + ')();';
    scriptElement.appendChild(ADocument.createTextNode(script));
    scriptElement.setAttribute('id', scriptId);
    scriptParent.appendChild(scriptElement);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspPageEventsMonitor.InstallHTMLFormElementPrototypeForDocument() Error: ' + ErrorMessage);
  }
};

// TspXMLSerializer ------------------------------------------------------------

function spNewXMLParser()
{
  if (typeof window.DOMParser != 'undefined') // Opera 12 support
    return new window.DOMParser();
  else if (typeof DOMParser != 'undefined')
    return new DOMParser();
  else
    return new window.DOMParser();
}

function spNewXMLSerializer()
{
  if (typeof window.XMLSerializer != 'undefined') // Opera 12 support
    return new window.XMLSerializer();
  else if (typeof XMLSerializer != 'undefined')
    return new XMLSerializer();
  else
    return new TspXMLSerializer();
}
        
function TspXMLSerializer()
{
  this.Result = '';
}

TspXMLSerializer.prototype =
{
  serializeXmlNodeToString: function(XmlNode)
  {
    if (!XmlNode)
      return;
    this.Result = this.Result + '<' + XmlNode.nodeName;
    // add attributes (if exists)
    if (XmlNode.hasAttributes)
    {
      for (var i = 0, len = XmlNode.attributes.length; i < len; i++)
      {
        var attribute = XmlNode.attributes[i];
        this.Result = this.Result + ' ' + attribute.name + '="' + attribute.value + '"';
      }
    }
    // add child nodes (if exists)
    if (XmlNode.hasChildNodes())
    {
      this.Result = this.Result + '>';
      for (var i = 0, len = XmlNode.childNodes.length; i < len; i++)
      {
        var childXmlNode = XmlNode.childNodes[i];
        this.serializeXmlNodeToString(childXmlNode);
      }
      this.Result = this.Result + '</' + XmlNode.nodeName + '>';
    }
    else
    {
      this.Result = this.Result + '/>';
    }
  },
  
  serializeToString: function(XmlDocument)
  {
    this.Result = '';
    if (XmlDocument)
      this.serializeXmlNodeToString(XmlDocument.documentElement);
    return this.Result;
  }
}



// TspRTIDContext --------------------------------------------------------------

function TspRTIDContext(AWindow)
{
  this.RTID_TagNameSeparator = '.';
  this.UseRandomRTIDPrefix = false;
  
  this.Initialize(AWindow);
}

TspRTIDContext.prototype.Initialize = function (AWindow)
{
  if (!AWindow)
    throw 'TspRTIDContext.Initialize() Error: AWindow is undefined';

  try
  {
    this.Window = AWindow;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspRTIDContext.Initialize() Error: ' + ErrorMessage);
  }
};

TspRTIDContext.prototype.GetNextRuntimeID = function()
{
  try
  {
    var nextRTID = this.Window.spLastRTID;
    if (!nextRTID)
      nextRTID = 0;
    nextRTID += 1;
    this.Window.spLastRTID = nextRTID;
    return nextRTID;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspRTIDContext.GetNextRuntimeID() Error: ' + ErrorMessage);
  }
};

TspRTIDContext.prototype.GetElementRuntimeID = function(AElement)
{
  var Result = '';
  if (AElement)
  try
  {
    // get attribute from element
    Result = AElement.spRTID;
    if (!Result)
    {
      // generate next RTID for element
      Result = this.GetNextRuntimeID() + this.RTID_TagNameSeparator + AElement.tagName;
      // append random RTID prefix
      if (this.UseRandomRTIDPrefix)
      {
        if (!this.RandomRTIDPrefix)
          this.RandomRTIDPrefix = spTools.GenerateRTID();
        Result = this.RandomRTIDPrefix + this.RTID_TagNameSeparator + Result;
      }
      // set attribute to element
      AElement.spRTID = Result;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspRTIDContext.GetElementRuntimeID() Error: ' + ErrorMessage);
    Result = '';
  }
  return Result;
};

TspRTIDContext.prototype.FindElementByRuntimeID = function(ADocumentList, ARTID)
{
  if (ADocumentList && !spStrings.IsStrEmpty(ARTID))
  try
  {
    for (var i = 0, lenDocuments = ADocumentList.length; i < lenDocuments; i++)
    {
      var Document = ADocumentList[i];
      var selector = '';
      var dotPos = ARTID.lastIndexOf(this.RTID_TagNameSeparator);
      if (dotPos)
        selector = ARTID.substr(dotPos+1, ARTID.length);
      if (!selector)
        throw 'tagName could not been extracted from RTID="' + ARTID + '"';
      var Elements = Document.querySelectorAll(selector);
      if (Elements)
      {
        var foundElements = new Array();
        for (var j = 0, lenElements = Elements.length; j < lenElements; j++)
        {
          var element = Elements[j];
          if (element.spRTID == ARTID)
            foundElements.push(element);
        }
        for (var j = 0, lenElements = foundElements.length; j < lenElements; j++)
        {
          var element = foundElements[j];
          // return only one found element or first visible if multiple one found,
          // fix for netbank.nordea.dk where JS duplicates any element attribute (spRTID for this case)
          if (foundElements.length === 1 ||
              spHTMLElementVisibleManager.isElementCompletelyVisible(element))
          {
            return element;
          }
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspRTIDContext.FindElementByRuntimeID() Error: ' + ErrorMessage);
  }
  return null;
};



// TspAttribute ---------------------------------------------------------

function TspAttribute()
{
  this.name = '';
  this.value = '';
}



// TspAttributes --------------------------------------------------------

function TspAttributes()
{
  this.attributes = new Array();
}

TspAttributes.prototype.IsEmpty = function ()
{
  return this.attributes.length === 0;
};

TspAttributes.prototype.Clear = function ()
{
  this.attributes.length = 0;
};

TspAttributes.prototype.LoadFromXmlNode = function (AXmlParentNode)
{
  if (!AXmlParentNode)
    return;

  try
  {
    this.Clear();
    
    var xmlAttributesNodes = AXmlParentNode.getElementsByTagName('spAttributes');
    if (!xmlAttributesNodes || xmlAttributesNodes.length < 1)
      return;
    var xmlAttributesNode = xmlAttributesNodes[0];
    for (var i = 0, len = xmlAttributesNode.childNodes.length; i < len; i++)
    {
      var xmlAttributeNode = xmlAttributesNode.childNodes[i];

      var attribute = new TspAttribute();
      attribute.name = xmlAttributeNode.tagName;
      attribute.value = xmlAttributeNode.textContent;
      this.attributes.push(attribute);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAttributes.LoadFromXmlNode() Error: ' + ErrorMessage);
  }
};

TspAttributes.prototype.SaveToXmlNode = function (AXmlParentNode)
{
  if (!AXmlParentNode)
    return;

  if (!this.IsEmpty())
  try
  {
    var xmlDocument = AXmlParentNode.ownerDocument;
    var xmlAttributesNode = xmlDocument.createElement('spAttributes');
    AXmlParentNode.appendChild(xmlAttributesNode);    
    for (var i = 0, len = this.attributes.length; i < len; i++)
    {
      var attribute = this.attributes[i];
      var xmlAttributeNode = xmlDocument.createElement(attribute.name);
      xmlAttributeNode.textContent = attribute.value;
      xmlAttributesNode.appendChild(xmlAttributeNode);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAttributes.SaveToXmlNode() Error: ' + ErrorMessage);
  }
};



// TspCommonXmlParser ----------------------------------------------------------

function TspCommonXmlParser()
{
  this.Log = {
    // log modes
    Info: false,
    SaveToXml: false
  };

  this.TagName_RootNode = ''; // should be overriden in children

  this.XmlDocument = null;
  this.XmlRootNode = null;
}

// CreateXml()
TspCommonXmlParser.prototype.CreateNewXml = function ()
{
  if (!this.TagName_RootNode)
    throw '"' + this.TagName_RootNode + '" is undefined!';
  try
  {
    // create XmlDocument
    this.XmlDocument = document.implementation.createDocument('', this.TagName_RootNode, null);

    // <Root> tag
    this.XmlRootNode = this.XmlDocument.documentElement;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCommonXmlParser.CreateXml() Error: ' + ErrorMessage);
  }
};

// LoadFromXml()
TspCommonXmlParser.prototype.LoadFromXml = function(AXml)
{
  if (AXml)
  try
  {
    var XmlParser = spNewXMLParser();

    // create XmlDocument
    this.XmlDocument = XmlParser.parseFromString(AXml, 'text/xml');

    // <Root> tag
    this.XmlRootNode = this.XmlDocument.documentElement;
    if (!this.XmlRootNode)
      throw 'Root node not found.';

    return this.XmlRootNode.hasChildNodes();
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCommonXmlParser.LoadFromXml() Error: ' + ErrorMessage);
  }
  return false;
};

// SaveToXml()
TspCommonXmlParser.prototype.SaveToXml = function()
{
  if (this.IsXmlAccessible())
  try
  {
    // check if any element exported
    if (this.XmlRootNode.hasChildNodes())
    {
      // serialize xml from XmlDocument
      var XmlSerializer = spNewXMLSerializer();
      var Result = XmlSerializer.serializeToString(this.XmlDocument);
      if (Result.search('<?xml') == -1)
        Result = '<?xml version="1.0"?>' + Result;
      if (this.Log.SaveToXml)
        spLog.logMessage('TspCommonXmlParser.SaveToXml() Xml:' + spStrings.LineBreak + Result);
      return Result;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCommonXmlParser.SaveToXml() Error: ' + ErrorMessage);
  }
  return '';
};

// SaveToXml()
TspCommonXmlParser.prototype.IsXmlAccessible = function()
{
  if (this.XmlDocument && this.XmlRootNode)
    return true;
  else
    return false;
};

// CloneXmlAttributes()
TspCommonXmlParser.prototype.CloneXmlAttributes = function (ASourceXmlNode, ATargetXmlNode)
{
  if (ASourceXmlNode && ATargetXmlNode)
  try
  {
    for (var i = ATargetXmlNode.attributes.length-1; i >= 0; i--)
    {
      var attribute = ATargetXmlNode.attributes[i];
      ATargetXmlNode.removeAttributeNode(attribute);
    }
    for (var i = 0, len = ASourceXmlNode.attributes.length; i < len; i++)
    {
      var attribute = ASourceXmlNode.attributes[i];
      ATargetXmlNode.setAttribute(attribute.name, attribute.value);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCommonXmlParser.CloneXmlAttributes() Error: ' + ErrorMessage);
  }
};



// TspDOMXmlParser -------------------------------------------------------------

function TspDOMXmlParser()
{
  TspCommonXmlParser.apply(this, arguments); // inherited call

  this.TagName_RootNode = 'spDOMXml';
  this.TagName_Document = 'spDocument';
  this.TagName_ForbiddenDocument = 'spForbiddenDocument';
  this.AttributeName_RTID = 'spRTID';
  this.AttributeName_FocusedRTID = 'spFocusedRTID';
  this.AttributeName_SubmittedRTID = 'spSubmittedRTID';
  this.AttributeName_Rect = 'spRect';
  this.AttributeName_Version = 'spVer';
  this.AttributeName_ScreenPos = 'spScreenPos';
  this.AttributeName_Url = 'spUrl';
  this.AttributeName_Title = 'spTitle';

  this.RTID = '';
}

TspDOMXmlParser.prototype = Object.create(TspCommonXmlParser.prototype);

TspDOMXmlParser.prototype.constructor = TspDOMXmlParser;

// CreateXml()
TspDOMXmlParser.prototype.CreateNewXml = function ()
{
  TspCommonXmlParser.prototype.CreateNewXml.apply(this, arguments); // inherited call
  try
  {
    // spRTID (just runtime), skip generation in case RTID already specified!
    if (!this.RTID)
      this.RTID = spTools.GenerateRTID();
    this.XmlRootNode.setAttribute(this.AttributeName_RTID, this.RTID);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspDOMXmlParser.CreateNewXml() Error: ' + ErrorMessage);
  }
};

// LoadFromXml()
TspDOMXmlParser.prototype.LoadFromXml = function(AXml)
{
  var Result = TspCommonXmlParser.prototype.LoadFromXml.apply(this, arguments); // inherited call
  if (Result)
  try
  {
    // spRTID (just runtime)
    this.RTID = this.XmlRootNode.getAttribute(this.AttributeName_RTID);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspDOMXmlParser.LoadFromXml() Error: ' + ErrorMessage);
  }
  return Result;
};

// ReadElementRect()
TspDOMXmlParser.prototype.ReadElementRect = function(AXmlNode)
{
  var Result = new TspRect();
  if (AXmlNode)
  {
    var sRect = AXmlNode.getAttribute(this.AttributeName_Rect);
    var aRect = sRect.split(',');
    if (aRect && aRect.length == 4)
    {
      Result.left = parseInt(aRect[0]);
      Result.top = parseInt(aRect[1]);
      Result.right = parseInt(aRect[2]);
      Result.bottom = parseInt(aRect[3]);
    }
  }
  return Result;
};

// WriteElementRect()
TspDOMXmlParser.prototype.WriteElementRect = function(AXmlNode, ARect)
{
  if (AXmlNode && ARect)
    AXmlNode.setAttribute(this.AttributeName_Rect,
      parseInt(ARect.left) + ',' +
      parseInt(ARect.top) + ',' +
      parseInt(ARect.right) + ',' +
      parseInt(ARect.bottom)
    );
};



// TspIncompleteDOMXmlParser ---------------------------------------------------

function TspIncompleteDOMXmlParser()
{
  TspDOMXmlParser.apply(this, arguments); // inherited call
}

TspIncompleteDOMXmlParser.prototype = Object.create(TspDOMXmlParser.prototype);

TspIncompleteDOMXmlParser.prototype.constructor = TspIncompleteDOMXmlParser;

// AppendForbiddenDocumentNode()
TspIncompleteDOMXmlParser.prototype.AppendForbiddenDocumentNode = function (AXmlParentNode, AForbiddenXmlDocumentRTID,
  AProcessForbiddenDocumentNodeCallback)
{
  if (AXmlParentNode && AForbiddenXmlDocumentRTID)
  try
  {
    var XmlDocument = AXmlParentNode.ownerDocument;
    // <spForbiddenDocument> tag
    //   create empty node for the forbidden document with generated RTID
    var forbiddenXmlDocumentNode = XmlDocument.createElement(this.TagName_ForbiddenDocument);
    forbiddenXmlDocumentNode.setAttribute(this.AttributeName_RTID, AForbiddenXmlDocumentRTID);
    if (AProcessForbiddenDocumentNodeCallback)
      AProcessForbiddenDocumentNodeCallback(forbiddenXmlDocumentNode);
    AXmlParentNode.appendChild(forbiddenXmlDocumentNode);
    return true;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspIncompleteDOMXmlParser.AppendForbiddenDocumentNode() Error: ' + ErrorMessage);
  }
  return false;
};

// IsCompleteDOMXml()
TspIncompleteDOMXmlParser.prototype.IsCompleteDOMXml = function()
{
  try
  {
    if (this.IsXmlAccessible())
    {
      var firstForbiddenDocument = this.XmlRootNode.querySelector(this.TagName_ForbiddenDocument);
      if (firstForbiddenDocument)
        return false;
    }
    return true;
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspIncompleteDOMXmlParser.IsCompleteDOMXml() Error: ' + ErrorMessage);
  }
};

// ReplaceForbiddenDOMXml()
TspIncompleteDOMXmlParser.prototype.ReplaceForbiddenDOMXml = function(AForbiddenXmlDocumentRTID, ANewDOMXmlParser)
{
  if (AForbiddenXmlDocumentRTID)
  try
  {
    var documentSelector = this.TagName_ForbiddenDocument + '[' + this.AttributeName_RTID + '="' + AForbiddenXmlDocumentRTID + '"]';
    var forbiddenXmlDocumentNode = this.XmlRootNode.querySelector(documentSelector);
    if (!forbiddenXmlDocumentNode)
      throw '"' + documentSelector + '" node not found.';

    if (ANewDOMXmlParser)
    try
    {
      if (!ANewDOMXmlParser.IsXmlAccessible())
        throw 'ANewDOMXmlParser is not loaded.';
      var newXmlDocumentNode = ANewDOMXmlParser.XmlRootNode.querySelector(this.TagName_Document);
      if (!newXmlDocumentNode)
        throw '"' + this.TagName_Document + '" node not found.';
      // replace forbidden node with new one
      forbiddenXmlDocumentNode.parentNode.replaceChild(newXmlDocumentNode, forbiddenXmlDocumentNode);
      return;
    }
    catch (ErrorMessage)
    {
      spLog.logError('TspIncompleteDOMXmlParser.ReplaceForbiddenDOMXml() Error replacing: ' + ErrorMessage);
    }

    // remove forbidden node
    forbiddenXmlDocumentNode.parentNode.removeChild(forbiddenXmlDocumentNode);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspIncompleteDOMXmlParser.ReplaceForbiddenDOMXml() Error: ' + ErrorMessage);
  }
};

// ReplaceFocusedElementDOMXml()
TspIncompleteDOMXmlParser.prototype.ReplaceFocusedElementDOMXml = function(ANewDOMXmlParser)
{
  if (ANewDOMXmlParser)
  try
  {
    var focusedRTID = ANewDOMXmlParser.XmlRootNode.getAttribute(this.AttributeName_FocusedRTID);
    if (focusedRTID)
      this.XmlRootNode.setAttribute(this.AttributeName_FocusedRTID, focusedRTID);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspIncompleteDOMXmlParser.ReplaceFocusedElementDOMXml() Error: ' + ErrorMessage);
  }
};



// TspSensitiveDataDOMXmlParser ------------------------------------------------

function TspSensitiveDataDOMXmlParser(ADOMXmlParser)
{
  if (!ADOMXmlParser)
    throw 'ADOMXmlParser is undefined in ' + this.constructor.name + '()';

  this.CommonXmlParser = ADOMXmlParser;
}

TspSensitiveDataDOMXmlParser.prototype.EncryptSensitiveData = function(AEncryptFn)
{
  var Result = false;
  if (AEncryptFn)
  try
  {
    if (!this.CommonXmlParser.XmlRootNode)
      throw 'Root node not found.';
    var elements = this.CommonXmlParser.XmlRootNode.querySelectorAll(
      'INPUT[type="password"],INPUT[type="hidden"],input[type="password"],input[type="hidden"]');
    if (elements)
    {
      for(var i = 0, len = elements.length; i < len; i++)
      {
        var element = elements[i];
        var value = element.getAttribute('value');
        if (value)
        {
          var encryptedData = {};
          if (AEncryptFn(value, encryptedData))
          {
            element.setAttribute('value', encryptedData.Value);
            Result = true;
          }
        }
      }
    }
    if (Result)
      this.CommonXmlParser.XmlRootNode.setAttribute('spSensitiveDataEncrypted', true);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspSensitiveDataDOMXmlParser.EncryptSensitiveData() Error: ' + ErrorMessage);
  }
  return Result;
};



// TspSensitiveDataAutofillXmlParser -------------------------------------------

function TspSensitiveDataAutofillXmlParser(AAutofillXmlParser)
{
  if (!AAutofillXmlParser)
    throw 'AAutofillXmlParser is undefined in ' + this.constructor.name + '()';

  this.CommonXmlParser = AAutofillXmlParser;
}

TspSensitiveDataAutofillXmlParser.prototype.DecryptSensitiveData = function(ADecryptFn)
{
  var Result = false;
  if (ADecryptFn)
  try
  {
    if (!this.CommonXmlParser.XmlRootNode)
      throw 'Root node not found.';
    var commands = this.CommonXmlParser.XmlRootNode.querySelectorAll(
      'FILL,fill');
    if (commands)
    {
      for(var i = 0, len = commands.length; i < len; i++)
      {
        var command = commands[i];
        var value = command.getAttribute('value');
        if (value)
        {
          var plainData = {};
          if (ADecryptFn(value, plainData))
          {
            command.setAttribute('value', plainData.Value);
            Result = true;
          }
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspSensitiveDataAutofillXmlParser.DecryptSensitiveData() Error: ' + ErrorMessage);
  }
  return Result;
};



// TspCrossOriginDOMXmlParser --------------------------------------------------

function TspCrossOriginDOMXmlParser()
{
  TspDOMXmlParser.apply(this, arguments); // inherited call 
}

TspCrossOriginDOMXmlParser.prototype = Object.create(TspDOMXmlParser.prototype);

TspCrossOriginDOMXmlParser.prototype.constructor = TspCrossOriginDOMXmlParser;

// _AppendFrameIDToNodeRTID()
TspCrossOriginDOMXmlParser.prototype._AppendFrameIDToNodeRTID = function(AFrameId, AXmlNode, AAttributeName)
{
  if (AFrameId && AXmlNode && AAttributeName)
  {
    var RTID = AXmlNode.getAttribute(AAttributeName);
    RTID = AFrameId + '#' + RTID;
    AXmlNode.setAttribute(AAttributeName, RTID);
  }
};

// AppendFrameIDToElementsRTID(AFrameId)
TspCrossOriginDOMXmlParser.prototype.AppendFrameIDToElementRTIDs = function(AFrameId)
{
  if (AFrameId)
  try
  {
    // update RTID attribute of root node to the specified frameId
    this._AppendFrameIDToNodeRTID(AFrameId, this.XmlRootNode, this.AttributeName_FocusedRTID);

    // update RTID attribute of child nodes to the specified frameId
    var xmlNodes = this.XmlRootNode.querySelectorAll('[' + this.AttributeName_RTID + ']');
    if (xmlNodes && xmlNodes.length)
    {
      for (var i = 0, len = xmlNodes.length; i < len; i++)
      {
        var xmlNode = xmlNodes[i];
        // ignore forbidden document tags and keep their RTID the same!
        if (xmlNode.tagName == this.TagName_ForbiddenDocument)
          continue;
        this._AppendFrameIDToNodeRTID(AFrameId, xmlNode, this.AttributeName_RTID);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCrossOriginDOMXmlParser.AppendFrameIDToElementRTIDs() Error: ' + ErrorMessage);
  }
};

// _AppendFrameOffsetToNodeRect()
TspCrossOriginDOMXmlParser.prototype._AppendFrameOffsetToNodeRect = function(AFrameLeft, AFrameTop, AXmlNode)
{
  var Result = false;
  if (AFrameLeft || AFrameTop)
  {
    if (AXmlNode)
    {
      var rc = this.ReadElementRect(AXmlNode);
      if (!spTools.IsRectEmpty(rc))
      {
        spTools.OffsetRect(rc, AFrameLeft, AFrameTop);
        this.WriteElementRect(AXmlNode, rc);
        Result = true;
      }
    }
  }
  return Result;
};

// AppendFrameOffsetToElementsRect(AFrameLeft, AFrameTop)
TspCrossOriginDOMXmlParser.prototype.AppendFrameOffsetToElementsRect = function(AFrameLeft, AFrameTop)
{
  var Result = false;
  if (AFrameLeft || AFrameTop)
  try
  {
    // update Rect attribute of child nodes
    var xmlNodes = this.XmlRootNode.querySelectorAll('[' + this.AttributeName_Rect + ']');
    if (xmlNodes && xmlNodes.length)
    {
      for (var i = 0, len = xmlNodes.length; i < len; i++)
      {
        var xmlNode = xmlNodes[i];
        if (this._AppendFrameOffsetToNodeRect(AFrameLeft, AFrameTop, xmlNode))
          Result = true;
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCrossOriginDOMXmlParser.AppendFrameOffsetToElementsRect() Error: ' + ErrorMessage);
  }
  return Result;
};

// UpdateTopDocumentInfo(AUrl, ATitle)
TspCrossOriginDOMXmlParser.prototype.UpdateTopDocumentInfo = function (AUrl, ATitle)
{
  var Result = false;
  try
  {
    var topXmlDocumentNode = this.XmlRootNode.querySelector('spDocument');
    if (topXmlDocumentNode)
    {
      if (typeof AUrl != 'undefined' && AUrl)
      {
        topXmlDocumentNode.setAttribute(this.AttributeName_Url, AUrl);
        Result = true;
      }
      if (typeof ATitle != 'undefined' && ATitle)
      {
        topXmlDocumentNode.setAttribute(this.AttributeName_Title, ATitle);
        Result = true;
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCrossOriginDOMXmlParser.UpdateTopDocumentInfo() Error: ' + ErrorMessage);
  }
  return Result;
};

// UpdateTopDocumentPos(ATopDocumentPos)
TspCrossOriginDOMXmlParser.prototype.UpdateTopDocumentPos = function (ATopDocumentPos)
{
  var Result = false;
  try
  {
    //   screenPos
    if (typeof ATopDocumentPos != 'undefined' && ATopDocumentPos)
    {
      this.XmlRootNode.setAttribute(this.AttributeName_ScreenPos, ATopDocumentPos.x + ',' + ATopDocumentPos.y);
      Result = true;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCrossOriginDOMXmlParser.UpdateTopDocumentInfo() Error: ' + ErrorMessage);
  }
  return Result;
};



// TspExportElementsInfo -------------------------------------------------------

function TspExportElementsInfo()
{
  this.hasSupportedElements = false;
}



// TspExportDOMManager ---------------------------------------------------------

function TspExportDOMManager()
{
  TspDOMXmlParser.apply(this, arguments); // inherited call

  this.Log.Warnings = false;
  this.Log.Elements = false;
  this.Log.Attributes = false;

  this.AttributeName_Visible = 'spVisible';

  this.ReadableXml = false;
  this.AllowExportRectOfParentElement = false;
  this.AllowExportChildWindows = true;
  this.AllowExportForbiddenWindow = true;
  this.AllowExportEmptyRootWindow = false;
  this.Window = null;
  this.FocusedElement = null;
  this.SubmittedElement = null;
  this.RTIDContext = null;
  
  // public properties
  this.TopWindowVisibility = spHTMLElementVisibleManager.ElementVisibility.Visible; // window initially is visible
  this.TopWindowScreenPosition = new TspPoint(); // zero point
  //   onQueryForbiddenWindowDOMXmlCallback(AExportDOMManager, ATopWindow, AWindow, AParentVisibility, AXmlParentNode)
  this.onQueryForbiddenWindowDOMXmlCallback = null;
}

TspExportDOMManager.prototype = Object.create(TspDOMXmlParser.prototype);

TspExportDOMManager.prototype.constructor = TspExportDOMManager;

// _ExportElementSPAttributes()
TspExportDOMManager.prototype._ExportElementSPAttributes = function(AElement, AXmlElementNode)
{
  if (AElement && AXmlElementNode)
  try
  {
    if (typeof AElement.spAttributes !== 'undefined' &&
        AElement.spAttributes instanceof TspAttributes
       )
    {
      AElement.spAttributes.SaveToXmlNode(AXmlElementNode);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElementSPAttributes() Error: ' + ErrorMessage);
  }
};

// _AllowExportStyleProperty()
TspExportDOMManager.prototype._AllowExportStyleProperty = function (AElement, AStyle, APropertyName, APropertyValue)
{
  if (AElement && AStyle && APropertyName)
  try
  {
    // ignore Context Button styles
    if (spContextButtonBackgroundImg)
      if (spContextButtonBackgroundImg.IsContextButtonStyleProperty(AElement, AStyle, APropertyName, APropertyValue))
        return false;
    // ignore Higlight styles
    if (spHighlightManager)
      if (spHighlightManager.IsHighlightStyleProperty(AElement, AStyle, APropertyName, APropertyValue))
        return false;
  }
  catch (ErrorMessage)
  {
    if (this.Log.Attributes)
      spLog.logError('TspExportDOMManager._AllowExportStyleProperty() Error: ' + ErrorMessage);
  }    
  return true;
};

// _GetExportStyleAttributeValue()
TspExportDOMManager.prototype._GetExportStyleAttributeValue = function (AElement, AAttribute)
{
  var Result = '';
  if (AElement && AAttribute)
  try
  {
    var style = AElement.style;
    if (!style)
      return Result;
    for (var i = 0, len = style.length; i < len; i++)
    {
      var pName = style[i];
      var pValue = style.getPropertyValue(pName);
      if (!this._AllowExportStyleProperty(AElement, style, pName, pValue))
      {
        if (this.Log.Attributes)
          spLog.logMessage('TspExportDOMManager._GetExportStyleAttributeValue() Style property of ' + 
            spHTMLTools.GetElementDebugInfo(AElement) + ' is ignored, ' + 
            'name: <' + pName + '>, value: <' + pValue + '>'
          );
        continue;
      }
      if (Result !== '')
        Result += ' ';
      Result += pName + ': ' + pValue + ';';
    }
  }
  catch (ErrorMessage)
  {
    if (this.Log.Attributes)
      spLog.logError('TspExportDOMManager._GetExportStyleAttributeValue() Error: ' + ErrorMessage);
  }    
  return Result;
};

// _GetExportAttributeValue()
TspExportDOMManager.prototype._GetExportAttributeValue = function (AElement, AAttribute)
{
  var Result = '';
  if (AElement && AAttribute)
  try
  {
    // WARNING: skip "value" attribute exporting, it is directly taken from the element "value" property instead of!
    if (AAttribute.name == 'value')
      return Result;

    // skip attributes with namespace: <if:>
    if (spStrings.SearchText(':',  AAttribute.name))
      return Result;

    // export style attribute as separate style properties
    if (spStrings.SameText(AAttribute.name, 'style'))
      Result = this._GetExportStyleAttributeValue(AElement, AAttribute);
    else
      Result = AAttribute.value;
    if (typeof Result == 'string')
    {
      Result = spStrings.StrTrim(Result);
      Result = spStrings.StrRemoveLineBreaks(Result);
      Result = spStrings.StrRemoveTwoSpaces(Result);
    }
  }
  catch (ErrorMessage)
  {
    if (this.Log.Attributes)
      spLog.logError('TspExportDOMManager._GetExportAttributeValue() Error: ' + ErrorMessage);
  }    
  return Result;
};

// _ExportElementAttributes()
TspExportDOMManager.prototype._ExportElementAttributes = function(AElement, AXmlElementNode)
{
  if (AElement && AXmlElementNode)
  try
  {
    for (var i = 0, len = AElement.attributes.length; i < len; i++)
    {
      var a = AElement.attributes[i];
      var value = this._GetExportAttributeValue(AElement, a);
      if (value && value != '')
      try
      {
        AXmlElementNode.setAttribute(a.name, value);
      }
      catch (ErrorMessage)
      {
        if (this.Log.Attributes)
          spLog.logError('TspExportDOMManager._ExportElementAttributes() Error setting node attribute: ' + ErrorMessage);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElementAttributes() Error: ' + ErrorMessage);
  }
};

// _ExportElementBaseProperties()
TspExportDOMManager.prototype._ExportElementBaseProperties = function(AElement, AXmlElementNode)
{
  if (AElement && AXmlElementNode)
  try
  {
    var s;
    // id
    s = spHTMLTools.GetHTMLElementID(AElement);
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('id', s);
    // name
    s = spHTMLTools.GetHTMLElementName(AElement);
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('name', s);
    // className
    s = spStrings.StrTrim(AElement.className);
    s = spStrings.StrRemoveTwoSpaces(s);
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('class', s);
    // spAttributes
    this._ExportElementSPAttributes(AElement, AXmlElementNode);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElementBaseProperties() Error: ' + ErrorMessage);
  }
};

// _ExportElementPosition()
TspExportDOMManager.prototype._ExportElementPosition = function(AElement, AXmlElementNode)
{
  if (AElement && AXmlElementNode)
  try
  {
    var rc = spHTMLTools.GetElementScreenPosition(AElement);
    if (rc.left || rc.top || rc.right || rc.bottom)
    {
      if (this.TopWindowScreenPosition)
        spTools.OffsetRect(rc, this.TopWindowScreenPosition.x, this.TopWindowScreenPosition.y);
      this.WriteElementRect(AXmlElementNode, rc);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElementPosition() Error: ' + ErrorMessage);
  }
};

// _ExportElementVisibility()
TspExportDOMManager.prototype._ExportElementVisibility = function(AElementVisibility, AXmlElementNode)
{
  if (AXmlElementNode)
  try
  {
    AXmlElementNode.setAttribute(this.AttributeName_Visible,
      spHTMLElementVisibleManager.isVisible(AElementVisibility) ? 1 : 0);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElementVisibility() Error: ' + ErrorMessage);
  }
};

// _ExportSupportedElement()
TspExportDOMManager.prototype._ExportSupportedElement = function(AElement, AXmlElementNode)
{
  if (AElement && AXmlElementNode)
  try
  {
    var s;

    // ignore <input#hidden> fields with too-long values
    if (spHTMLTools.IsInputHiddenElement(AElement))
    {
      if (AElement.value && AElement.value.length > 255)
        return;
    }

    // attributes
    this._ExportElementAttributes(AElement, AXmlElementNode);

    // base properties
    this._ExportElementBaseProperties(AElement, AXmlElementNode);

    // disabled
    if (AElement.disabled)
      AXmlElementNode.setAttribute('disabled', 1);

    // export specific properties
    switch (AElement.tagName.toUpperCase())
    {
      // <form>
      case 'FORM':
        // action
        s = spHTMLTools.GetHTMLFormAction(AElement);
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('action', s);
        break;

      // <input>
      case 'INPUT':
        // value
        s = spInputValueCacheManager.getInputValue(AElement);
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('value', s);
        
        var elementType = AElement.type.toLowerCase();
        // <input#checkbox>
        if (elementType === 'checkbox')
        {
          if (AElement.checked)
            AXmlElementNode.setAttribute('checked', 1);
          else
            AXmlElementNode.setAttribute('checked', 0);
        }
        // <input#radio>
        else if (elementType === 'radio')
        {
          if (AElement.checked)
            AXmlElementNode.setAttribute('checked', 1);
        }
        break;

      // <button>
      case 'BUTTON':
        // value
        s = spStrings.StrTrim(AElement.textContent);
        s = spStrings.StrRemoveLineBreaks(s);
        s = spStrings.StrRemoveTwoSpaces(s);
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('value', s);
        break;

      // <select>
      case 'SELECT':
        // type
        s = AElement.type;
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('type', s);
        // value
        s = AElement.value;
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('value', s);
        break;

      // <a>
      case 'A':
        // href
        s = AElement.href;
        if (!spStrings.IsStrEmpty(s))
          AXmlElementNode.setAttribute('href', s);
        break;

      // <img>
	  case 'IMG':
        // src: allow only URL, ingore "data:image/png;base64,..." which is senceless
        s = AElement.src;
        if (spStrings.IsUrl(s))
          AXmlElementNode.setAttribute('src', s);
        else
          AXmlElementNode.removeAttribute('src');
        break;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportSupportedElement() Error: ' + ErrorMessage);
  }
};

// _ExportOptionElement()
TspExportDOMManager.prototype._ExportOptionElement = function(AElement, AXmlElementNode)
{
  if (!AElement || !AXmlElementNode)
    return;
  try
  {
    var s;

    // attributes
    this._ExportElementAttributes(AElement, AXmlElementNode);

    // text
    s = AElement.text;
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('text', s);
    
    // value
    s = AElement.value;
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('value', s);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportOptionElement() Error: ' + ErrorMessage);
  }
};

// _ExportLabelElement()
TspExportDOMManager.prototype._ExportLabelElement = function(AElement, AXmlElementNode)
{
  if (!AElement || !AXmlElementNode)
    return;
  try
  {
    var s;
    // base properties
    this._ExportElementBaseProperties(AElement, AXmlElementNode);

    // for
    s = AElement.htmlFor;
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('for', s);

    // text
    s = AElement.innerText;
    if (!spStrings.IsStrEmpty(s))
      AXmlElementNode.setAttribute('text', s);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportLabelElement() Error: ' + ErrorMessage);
  }
};

// _ExportParentElement()
TspExportDOMManager.prototype._ExportParentElement = function(AElement, AXmlElementNode)
{
  if (!AElement || !AXmlElementNode)
    return;
  try
  {
    var s;
    // base properties
    this._ExportElementBaseProperties(AElement, AXmlElementNode);

    // onclick
    var funAttribute = AElement.getAttribute('onclick');
    if (funAttribute)
    {
      s = funAttribute.toString();
      if (!spStrings.IsStrEmpty(s))
        AXmlElementNode.setAttribute('onclick', s);
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportParentElement() Error: ' + ErrorMessage);
  }
};

// _isElementReallyHidden()
TspExportDOMManager.prototype._isElementReallyHidden = function (AElementVisibility)
{
  if (AElementVisibility == spHTMLElementVisibleManager.ElementVisibility.Visible ||
      // see more information in spHTMLElementVisibleManager.getElementVisibility() style checking
      AElementVisibility == spHTMLElementVisibleManager.ElementVisibility.Hidden_VisibilityHidden ||
      AElementVisibility == spHTMLElementVisibleManager.ElementVisibility.Hidden_Overflow
     )
  {
    return false;
  }

  // element is really hidden
  return true;
};

// _resetPossibleButtonElementCounter()
TspExportDOMManager.prototype._resetPossibleButtonElementCounter = function (AExportElementsInfo)
{
  AExportElementsInfo.possibleButtonElementsCount = 0;
};

// _isExportPossibleButtonElementAllowed()
TspExportDOMManager.prototype._isExportPossibleButtonElementAllowed = function (AExportElementsInfo)
{
  if (typeof AExportElementsInfo.possibleButtonElementsCount == 'undefined')
  {
    // deny to export until we found any supported element
    return false;
  }

  var maxPossibleButtonElements = 6;
  AExportElementsInfo.possibleButtonElementsCount++;
  if (AExportElementsInfo.possibleButtonElementsCount > maxPossibleButtonElements)
  {
    // deny to export too much possible button elements
    return false;
  }
  
  return true;
};

// _ExportElements()
TspExportDOMManager.prototype._ExportElements = function(
  ADocument, AElement, AParentVisibility, AXmlParentNode, AExportElementsInfo)
{
  if (!ADocument || !AElement || !AXmlParentNode)
    return;

  try
  {
    var XmlElementNode = AXmlParentNode;
    var AllowExportChildren = true;
    var AllowExportRect = false;
    var AllowExportRTID = true;
    var AllowExportVisibility = true;
    var ElementVisibility = null;
    var exportElementTypes = {
      skipExport: 0,
      asSupportedElement: 1,
      asParentElement: 2
    };
    var ExportElementAs = exportElementTypes.skipExport;
    var significantElementsSelector = 'iframe,frame,form,fieldset,input,textarea,select,button';

    var elementTagName = AElement.tagName.toUpperCase();
    switch (elementTagName)
    {
      // skip tags which can't have supported children elements        
      case 'SCRIPT':
      case 'NOSCRIPT':
      case 'MAP':
      case 'COLGROUP':
      case 'SVG':
      case 'AUDIO':
      case 'EMBED':
      case 'OBJECT':
      case 'STYLE':
      case 'META':
      case 'TEMPLATE':
      case 'VIDEO':
      case 'HR':
      case 'BR':
      case 'WBR':
        return;

      // export frames as window
      case 'IFRAME':
      case 'FRAME':
        if (this.AllowExportChildWindows)
        {
          ElementVisibility = spHTMLElementVisibleManager.getElementVisibilityBasedOnParent(AElement, AParentVisibility);
          if (!this._isElementReallyHidden(ElementVisibility))
            this._ExportWindow(AElement, ElementVisibility, AXmlParentNode, AExportElementsInfo);
        }
        return;

      // skip export of particular element
      case 'Q':
      case 'B':
      case 'I':
      case 'U':
      case 'PRE':
      case 'DEL':
      case 'INS':
      case 'SUB':
      case 'SUP':
      case 'MARK':
      case 'SMALL':
      case 'STRIKE':
      case 'EM':
      case 'STRONG':
      case 'BIG':
      case 'BDO':
      case 'RUBY':
      case 'RT':
      case 'RQ':
      case 'CENTER':
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
      case 'FONT':
      case 'BODY':
        break;

      // <select>.<option> element
      case 'OPTION':
      {
        XmlElementNode = this.XmlDocument.createElement(AElement.tagName);
        this._ExportOptionElement(AElement, XmlElementNode);
        AllowExportChildren = false;
        AllowExportRTID = false;
        AllowExportVisibility = false;
        break;
      }

      // <label> element
      case 'LABEL':
      {
        XmlElementNode = this.XmlDocument.createElement(AElement.tagName);
        this._ExportLabelElement(AElement, XmlElementNode);
        AllowExportRTID = false;
        break;
      }

      // elements
      case 'INPUT':
      case 'TEXTAREA':
      case 'SELECT':
        if (!AExportElementsInfo.hasSupportedElements)
          if (spHTMLTools.IsEditableElement(AElement))
            AExportElementsInfo.hasSupportedElements = true;
      case 'BUTTON':
        // found supported element - reset the possible button counter
        this._resetPossibleButtonElementCounter(AExportElementsInfo);
      // containers
      case 'FORM':
      case 'FIELDSET':
        ExportElementAs = exportElementTypes.asSupportedElement;
        break;

      // possible button elements
      case 'IMG':
      case 'A':
      {
        // allow export of <A> tags which contains significant child elements
        if (elementTagName == 'A')
        {
          if (AElement.querySelector(significantElementsSelector))
          {
            ExportElementAs = exportElementTypes.asSupportedElement;
            break;
          }
        }

        if (!this._isExportPossibleButtonElementAllowed(AExportElementsInfo))
          return;
        ExportElementAs = exportElementTypes.asSupportedElement;
        break;
      }

      default:
        if (spContextButtonImg.isContextButton(AElement))
        {
          // skip export of Context Button element
          AllowExportChildren = false;
        }
        else if (spStrings.SearchText(':', AElement.tagName) ||
                 spStrings.SearchText('=', AElement.tagName)
                )
        {
          // skip export of tags with namespace: <FB:LIKE>
          // skip export of tags with '=' char: <VALIGN=RIGHT>
        }
        else
        {
          // skip export of <LI> tags which doesn't contain significant child elements
          if (elementTagName == 'LI')
          {
            if (!AElement.querySelector(significantElementsSelector))
              return;
          }

          ElementVisibility = spHTMLElementVisibleManager.getElementVisibilityBasedOnParent(AElement, AParentVisibility);
          if (this._isElementReallyHidden(ElementVisibility))
          {
            var elementReallyHidden = true;
            // allow export parent element if it has child input password (used for incorrect old placeholder implementation)
            var firstPasswordElement = AElement.querySelector('input[type="password"]');
            if (firstPasswordElement)
            {
              if (firstPasswordElement.parentElement == AElement)
                elementReallyHidden = false;
            }
            if (elementReallyHidden)
              return; // parent element is really hidden
          }

          ExportElementAs = exportElementTypes.asParentElement;
        }
        break;
    }

    // export element
    if (ExportElementAs == exportElementTypes.asSupportedElement)
    {
      XmlElementNode = this.XmlDocument.createElement(AElement.tagName);
      this._ExportSupportedElement(AElement, XmlElementNode);
      AllowExportRect = true;
    }
    else if (ExportElementAs == exportElementTypes.asParentElement)
    {
      XmlElementNode = this.XmlDocument.createElement(AElement.tagName);
      this._ExportParentElement(AElement, XmlElementNode);
      AllowExportRect = this.AllowExportRectOfParentElement;
    }

    // export children of element
    if (AllowExportChildren)
    {
      if (AElement.children)
      {
        var len = AElement.children.length;
        if (len)
        {
          // obtain element visibility
          if (ElementVisibility === null)
            ElementVisibility = spHTMLElementVisibleManager.getElementVisibilityBasedOnParent(AElement, AParentVisibility);

          for (var i = 0; i < len; i++)
          {
            var ChildElement = AElement.children[i];
            this._ExportElements(ADocument, ChildElement, ElementVisibility, XmlElementNode, AExportElementsInfo);
          }
        }
        // export child elements of shadowRoot (no child elements, but some DOM is invisible incapsulated inside of parent element)
        // fix for https://www.bankid.no/privat/los-mitt-bankid-problem/test-din-bankid---autentisering/
        //   where shadowRoot used for Login form inside cross-frame
        else if (typeof AElement.shadowRoot != 'undefined' && AElement.shadowRoot)
        {
          len = AElement.shadowRoot.children.length;
          if (len)
          {
            // obtain element visibility
            if (ElementVisibility === null)
              ElementVisibility = spHTMLElementVisibleManager.getElementVisibilityBasedOnParent(AElement, AParentVisibility);

            for (var i = 0; i < len; i++)
            {
              var ChildElement = AElement.shadowRoot.children[i];
              this._ExportElements(ADocument, ChildElement, ElementVisibility, XmlElementNode, AExportElementsInfo);
            }
          }
        }
      }
      // deny to export empty table tags
      // fix for https://yobit.net/ where there are tons of <td> empty tags
      switch (elementTagName)
      {
        case 'TABLE':
        case 'TBODY':
        case 'THEAD':
        case 'TH':
        case 'TR':
        case 'TD':
          if (!XmlElementNode.hasChildNodes())
            return;
          break;
      }
    }
    
    // add xml node only if it's not empty!
    if (XmlElementNode != AXmlParentNode)
    {
      if (XmlElementNode.childNodes.length || XmlElementNode.attributes.length)
      {
        //   spRTID
        if (AllowExportRTID)
        {
          var elementRTID = this.RTIDContext.GetElementRuntimeID(AElement);
          if (elementRTID)
            XmlElementNode.setAttribute(this.AttributeName_RTID, elementRTID);
        }
        //   spRect
        if (AllowExportRect)
          this._ExportElementPosition(AElement, XmlElementNode);
        //   spVisible
        if (AllowExportVisibility)
        {
          if (ElementVisibility === null)
            ElementVisibility = spHTMLElementVisibleManager.getElementVisibilityBasedOnParent(AElement, AParentVisibility);
          var ParentVisible = spHTMLElementVisibleManager.isVisible(AParentVisibility);
          var ElementVisible = spHTMLElementVisibleManager.isVisible(ElementVisibility);
          if (this.ReadableXml)
            AllowExportVisibility = !ElementVisible;
          else
            // export only the first hidden element or element can be visible despite of parent hidden
            AllowExportVisibility = ParentVisible != ElementVisible;
          if (AllowExportVisibility)
            this._ExportElementVisibility(ElementVisibility, XmlElementNode);
        }

        AXmlParentNode.appendChild(XmlElementNode);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportElements() Error: ' + ErrorMessage);
  }
};

// _ExportWindow()
TspExportDOMManager.prototype._ExportWindow = function(AWindow, AParentVisibility, AXmlParentNode, AExportElementsInfo)
{
  if (!AWindow || !AXmlParentNode)
    return;

  try
  {
    // export children of window/frame/iframe
    var Document = spHTMLTools.GetWindowDocument(AWindow);
    // frame can have access to parent window via "domain" property but in fact it's cross-origin access, therefore deny access to the frame's document
    if (Document &&
        AWindow &&
        AWindow != this.Window &&
        spHTMLTools.HasFrameCrossOriginParent(AWindow))
    {
      Document = null;
    }
    if (Document)
    {
      // <spDocument> tag
      var XmlDocumentNode = this.XmlDocument.createElement(this.TagName_Document);
      var Url = '';
      //   spUrl
      // some cross-frames has invalid Url in document: "data:text/html,chromewebdata",
      // Window's document can contain child element with name "src"
      if (!spHTMLTools.IsTopWindow(AWindow) && AWindow.src && typeof AWindow.src == 'string')
        Url = AWindow.src;
      else
        Url = Document.URL;
      if (!spStrings.IsStrEmpty(Url))
        XmlDocumentNode.setAttribute(this.AttributeName_Url, Url);
      if (this.Log.SaveToXml && this.Log.Elements)
        spLog.logMessage('TspExportDOMManager._ExportWindow() Url="' + Url + '"');
      //   spTitle
      if (AWindow == this.Window)
      {
        var Title = AWindow.document.title;
        if (!spStrings.IsStrEmpty(Title))
          XmlDocumentNode.setAttribute(this.AttributeName_Title, Title);
        if (this.Log.SaveToXml && this.Log.Elements)
          spLog.logMessage('TspExportDOMManager._ExportWindow() Title="' + Title + '"');
      }
      //   spVisible
      if (!spHTMLElementVisibleManager.isVisible(AParentVisibility))
        this._ExportElementVisibility(AParentVisibility, XmlDocumentNode);
      //   spLanguage
      var htmlElement = Document.documentElement;
      if (htmlElement)
      {
        var lang = htmlElement.getAttribute('lang');
        if (lang)
          XmlDocumentNode.setAttribute('spLanguage', lang);
      }

      var objExportElementsInfo = new TspExportElementsInfo();
      if (Document.body)
      {
        // <body> tag
        this._ExportElements(Document, Document.body, AParentVisibility, XmlDocumentNode, objExportElementsInfo);
      }
      if (this.Log.SaveToXml && this.Log.Elements && !objExportElementsInfo.hasSupportedElements)
        spLog.logMessage('TspExportDOMManager._ExportWindow() document has no supported elements, ignored Url="' + Url + '"');
      if (AExportElementsInfo && objExportElementsInfo.hasSupportedElements)
        AExportElementsInfo.hasSupportedElements = true;

      // export <document> only if has children!
      var appendDocumentNode = XmlDocumentNode.childNodes.length && objExportElementsInfo.hasSupportedElements;
      if (!appendDocumentNode)
      {
        // allow to export <document> of root window even if it has no children
        if (this.AllowExportEmptyRootWindow &&
            AWindow.top == AWindow)
        {
          appendDocumentNode = true;
          // remove all child elements to speed up the analizer action
          for (var i = XmlDocumentNode.childNodes.length-1; i >= 0; i--)
          {
            var childNode = XmlDocumentNode.childNodes[i];
            XmlDocumentNode.removeChild(childNode);
          }
        }
      }
      if (appendDocumentNode)
        AXmlParentNode.appendChild(XmlDocumentNode);
    }
    else
    {
      // error accessing window (Cross Origin, etc.)
      if (this.AllowExportForbiddenWindow && this.onQueryForbiddenWindowDOMXmlCallback)
      {
        // query the DOMXml of forbidden document 
        if (this.onQueryForbiddenWindowDOMXmlCallback(this, this.Window, AWindow, AParentVisibility, AXmlParentNode))
        {
          // assume AWindow has supported elements
          if (AExportElementsInfo)
            AExportElementsInfo.hasSupportedElements = true;
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager._ExportWindow() Error: ' + ErrorMessage);
  }
};

// ExportDOMToXml()
TspExportDOMManager.prototype.ExportDOMToXml = function(AWindow, AExportDOMToXmlCallback)
{
  if (!AWindow)
    throw 'AWindow is undefined in TspExportDOMManager.ExportDOMToXml()';
  if (!AExportDOMToXmlCallback)
    throw 'AExportDOMToXmlCallback is undefined in TspExportDOMManager.ExportDOMToXml()';

  try
  {
    // init base info
    this.Window = AWindow;
    this.RTIDContext = new TspRTIDContext(AWindow);

    // create new Xml document
    this.CreateNewXml();
    //   focusedRTID
    if (!this.FocusedElement)
      this.FocusedElement = spHTMLTools.GetDocumentFocusedElement(AWindow.document);
    if (this.FocusedElement)
    {
      if (this.Log.SaveToXml && this.Log.Elements)
        spLog.logMessage('TspExportDOMManager.ExportDOMToXml() FocusedElement: ' + spHTMLTools.GetElementDebugInfo(this.FocusedElement));
      var elementRTID = this.RTIDContext.GetElementRuntimeID(this.FocusedElement);
      if (elementRTID)
        this.XmlRootNode.setAttribute(this.AttributeName_FocusedRTID, elementRTID);
    }
    //   submittedRTID
    if (this.SubmittedElement)
    {
      if (this.Log.SaveToXml && this.Log.Elements)
        spLog.logMessage('TspExportDOMManager.ExportDOMToXml() SubmittedElement: ' + spHTMLTools.GetElementDebugInfo(this.SubmittedElement));
      var elementRTID = this.RTIDContext.GetElementRuntimeID(this.SubmittedElement);
      if (elementRTID)
        this.XmlRootNode.setAttribute(this.AttributeName_SubmittedRTID, elementRTID);
    }
    //   version
    this.XmlRootNode.setAttribute(this.AttributeName_Version, '1');
    //   screenPos
    if (spHTMLTools.DocumentClientAreaCalculator)
    {
      var DocumentPos = spHTMLTools.DocumentClientAreaCalculator.GetWindowDocumentScreenPos(AWindow);
      if (DocumentPos)
        this.XmlRootNode.setAttribute(this.AttributeName_ScreenPos, DocumentPos.x + ',' + DocumentPos.y);
    }
    // export DOM from AWindow
    var objExportElementsInfo = new TspExportElementsInfo();
    this._ExportWindow(AWindow, this.TopWindowVisibility, this.XmlRootNode, objExportElementsInfo);
    // spAttributes
    this._ExportElementSPAttributes(AWindow.document, this.XmlRootNode);

    var xml = this.SaveToXml();
    AExportDOMToXmlCallback(xml);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspExportDOMManager.ExportDOMToXml() Error: ' + ErrorMessage);
  }
};



// TspAutofillXmlParser --------------------------------------------------------

function TspAutofillXmlParser()
{
  TspCommonXmlParser.apply(this, arguments); // inherited call

  this.TagName_RootNode = 'AutofillXml';
  this.AttributeName_RTID = 'spRTID';
}

TspAutofillXmlParser.prototype = Object.create(TspCommonXmlParser.prototype);

TspAutofillXmlParser.prototype.constructor = TspAutofillXmlParser;



// TspCrossOriginAutofillXmlParser ---------------------------------------------

function TspCrossOriginAutofillXmlParser()
{
  TspAutofillXmlParser.apply(this, arguments); // inherited call
}

TspCrossOriginAutofillXmlParser.prototype = Object.create(TspAutofillXmlParser.prototype);

TspCrossOriginAutofillXmlParser.prototype.constructor = TspCrossOriginAutofillXmlParser;

TspCrossOriginAutofillXmlParser.prototype._ParseRTID = function (ARTID)
{
  var Result = new Object();
  Result.frameId = '0'; // top window
  Result.elementRTID = ARTID;
  if (ARTID)
  {
    var i = ARTID.indexOf('#');
    if (i != -1)
    {
      Result.frameId = ARTID.substr(0, i);
      Result.elementRTID = ARTID.substr(i + 1, ARTID.length);
    }
  }
  return Result;
};

// ExtractNextAutofillPart()
TspCrossOriginAutofillXmlParser.prototype.ExtractNextAutofillPart = function (AAutofillInfo)
{
  if (AAutofillInfo && this.IsXmlAccessible())
  try
  {
    var autofillXmlParser = new TspAutofillXmlParser();
    autofillXmlParser.CreateNewXml();
    autofillXmlParser.CloneXmlAttributes(this.XmlRootNode, autofillXmlParser.XmlRootNode);
    var lastFrameId = '';
    while (this.XmlRootNode.childNodes.length)
    {
      var xmlNode = this.XmlRootNode.childNodes[0];
      if (xmlNode.nodeType == 1) // allow only ELEMENT_NODE
      {
        var RTID = xmlNode.getAttribute(this.AttributeName_RTID);
        if (RTID)
        {
          // autofill command for some element
          //   parse RTID to frameId and elementRTID
          var elementId = this._ParseRTID(RTID);
          if (!lastFrameId)
            lastFrameId = elementId.frameId;
          else if (lastFrameId != elementId.frameId)
            break;
          var xmlCloneNode = xmlNode.cloneNode(true);
          xmlCloneNode.setAttribute(this.AttributeName_RTID, elementId.elementRTID);
          autofillXmlParser.XmlRootNode.appendChild(xmlCloneNode);
        }
        else
        {
          // abstract autofill command
          var xmlCloneNode = xmlNode.cloneNode(true);
          autofillXmlParser.XmlRootNode.appendChild(xmlCloneNode);
        }
      }
      this.XmlRootNode.removeChild(xmlNode);
    }
    AAutofillInfo.AutofillXml = autofillXmlParser.SaveToXml();
    if (AAutofillInfo.AutofillXml)
    {
      if (lastFrameId)
        AAutofillInfo.frameId = parseInt(lastFrameId); // should be integer!
      else
        AAutofillInfo.frameId = 0; // top window
      return true;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspCrossOriginAutofillXmlParser.ExtractNextAutofillPart() Error: ' + ErrorMessage);
  }
  return false;
};



// TspAutofillManager ----------------------------------------------------------

function TspAutofillManager()
{
  TspAutofillXmlParser.apply(this, arguments); // inherited call

  this.AutofillCmd_highlight = 'highlight';
  this.AutofillCmd_addContextButton = 'addContextButton';
  this.AutofillCmd_cacheProtectedInputValue = 'cacheProtectedInputValue';
  this.AutofillCmd_subscribeToClick = 'subscribeToClick';
  this.AutofillCmd_subscribeToEnterKeyPress = 'subscribeToEnterKeyPress';
  this.AutofillCmd_focus = 'focus';
  this.AutofillCmd_fill = 'fill';
  this.AutofillCmd_click = 'click';
  this.AutofillCmd_sleep = 'sleep';
  this.AutofillCmd_setAttributes = 'setAttributes';
  this.AttributeName_isPasswordManagerLocked = 'isPasswordManagerLocked';
  this.AttributeName_value = 'value';
  this.AttributeName_ignoredEvents = 'ignoredEvents';
  this.AttributeName_timeout = 'timeout';
  this.AttributeName_ContextButtonType = 'contextButtonType';

  this.Window = null;
  this.DocumentList = null;
  this.RTIDContext = null;
  this.lastElementRTID = '';
  this.lastElement = null;
  
  this.AutofillError = false;
  this.NeedToClickElementsCount = 0;
  this.NeedToFillElementsCount = 0;
  this.FilledElementsCount = 0;

  // public properties
  //   onAutofillCompleteCallback()
  this.onAutofillCompleteCallback = null;
  //   onUpdatePasswordManagerLockedCallback(AIsPasswordManagerLocked)
  this.onUpdatePasswordManagerLockedCallback = null;
  //   onContextButtonInitializeCallback(AButtonInfo)
  this.onContextButtonInitializeCallback = null;
  //   onSubscribeToClickElementCallback(AElement)
  this.onSubscribeToClickElementCallback = null;
  //   onSubscribeToEnterKeyPressCallback(AElement)
  this.onSubscribeToEnterKeyPressCallback = null;
}

TspAutofillManager.prototype = Object.create(TspAutofillXmlParser.prototype);

TspAutofillManager.prototype.constructor = TspAutofillManager;

TspAutofillManager.prototype._allowFireEvent = function (AIgnoredEvents, AEventName)
{
  if (AEventName && AIgnoredEvents)
  {
    AIgnoredEvents = AIgnoredEvents.toLowerCase();
    if (AIgnoredEvents.indexOf(AEventName) != -1)
      return false;
  }
  return true;
};
  
TspAutofillManager.prototype._fireElementEvent = function (AHtmlElement, AIgnoredEvents, AEventName)
{
  if (this._allowFireEvent(AIgnoredEvents, AEventName))
    spHTMLTools.FireElementEvent(AHtmlElement, AEventName);
};

TspAutofillManager.prototype._fireElementKeyEvent = function (AHtmlElement, AIgnoredEvents, AEventName, AKeyCode)
{
  if (this._allowFireEvent(AIgnoredEvents, AEventName))
    spHTMLTools.FireElementKeyEvent(AHtmlElement, AEventName, AKeyCode);
}  
   
// _setHTMLElementValue()
TspAutofillManager.prototype._setHTMLElementValue = function(AHtmlElement, AValue, AIgnoredEvents)
{
  var Result = false;
  var ValueAsBoolean = !spStrings.IsStrEmpty(AValue) && (AValue != '0');

  switch (AHtmlElement.tagName.toUpperCase())
  {
    // <input>
    case 'INPUT':
      var elementType = AHtmlElement.type.toLowerCase();
      switch (elementType)
      {
        // <input#text>, <input#password>, etc.
        case 'password':
        case 'text':
        case 'email':
        case 'tel':
        case 'month':
        case 'number':
        case 'time':
        case 'url':
        case 'week':
        case 'date':
          // keep value of editable input in the cache
          //   this is necessary for sites where JS changes the value of input element
          //   during submit (anti password manager feature) and for cases when we autofill
          //   and submit the account  without user enters the data directly to the element
          spInputValueCacheManager.attachToInput(AHtmlElement);
          // we must fire some events to allow fix Focusing Edit problem
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'focus');
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'click');
          this._fireElementKeyEvent(AHtmlElement, AIgnoredEvents, 'keydown', 0);
          var value = AValue;
          switch (elementType)
          {
            case 'password':
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
            case 'url':
              if (AHtmlElement.maxLength > 0 && value.length > AHtmlElement.maxLength)
                value = value.slice(0, AHtmlElement.maxLength);
              break;
          }
          AHtmlElement.value = value;
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'input');
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'change');
          this._fireElementKeyEvent(AHtmlElement, AIgnoredEvents, 'keypress', 0);
          this._fireElementKeyEvent(AHtmlElement, AIgnoredEvents, 'keyup', 0);
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'blur');
          spInputValueCacheManager.setInputLastValue(AHtmlElement, value);
          Result = true;
          break;

        // <input#checkbox>
        case 'checkbox':
          AHtmlElement.checked = ValueAsBoolean;
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'click');
          Result = true;
          break;

        // <input#radio>
        case 'radio':
          AHtmlElement.checked = true;
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'click');
          Result = true;
          break;

        // <input#hidden>, etc.
        default:
          AHtmlElement.value = AValue;
          this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'change');
          Result = true;
          break;
      }
      break;

    // <textarea>
    case 'TEXTAREA':
      AHtmlElement.value = AValue;
      this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'change');
      Result = true;
      break;
      
    // <select>
    case 'SELECT':
      if (AValue)
      {
        AHtmlElement.value = AValue;
        this._fireElementEvent(AHtmlElement, AIgnoredEvents, 'change');
        Result = true;
      }
      break;
  }

  return Result;
};

TspAutofillManager.prototype._findElementFromXmlNode = function(AXmlNode)
{
  var element = null;
  if (AXmlNode)
  {
    var elementRTID = AXmlNode.getAttribute(this.AttributeName_RTID);
    if (elementRTID)
    {
      if (elementRTID === this.lastElementRTID && this.lastElement)
        element = this.lastElement;
      else
      {
        element = this.RTIDContext.FindElementByRuntimeID(this.DocumentList, elementRTID);
        if (!element) 
          spLog.logError('TspAutofillManager._findElementFromXmlNode() Cannot find element for RTID=' + elementRTID);
        this.lastElement = element;
        this.lastElementRTID = elementRTID;
      }
    }
  }
  return element;
};

TspAutofillManager.prototype._highlightElement = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
    spHighlightManager.HighlightElement(element);
};

TspAutofillManager.prototype._addContextButton = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
  {
    var contextButtonType = AXmlNode.getAttribute(this.AttributeName_ContextButtonType);
    spContextButtonManager.addContextButtonToElement(this.Window, element, contextButtonType, this.onContextButtonInitializeCallback);
  }
};

TspAutofillManager.prototype._cacheProtectedInputValue = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
    spInputValueCacheManager.attachToProtectedInput(element);
};

TspAutofillManager.prototype._subscribeToClickElement = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
  {
    if (this.onSubscribeToClickElementCallback)
      this.onSubscribeToClickElementCallback(element);
  }
};

TspAutofillManager.prototype._subscribeToEnterKeyPress = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
  {
    if (this.onSubscribeToEnterKeyPressCallback)
      this.onSubscribeToEnterKeyPressCallback(element);
  }
};

TspAutofillManager.prototype._focusElement = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
    spHTMLTools.ElementSetFocus(element);
};

TspAutofillManager.prototype._fillElement = function(AXmlNode)
{
  var Result = false;
  if (AXmlNode)
  {
    var value = AXmlNode.getAttribute(this.AttributeName_value);    
    var ignoredEvents = AXmlNode.getAttribute(this.AttributeName_ignoredEvents);
    var element = this._findElementFromXmlNode(AXmlNode);
    if (element)
      Result = this._setHTMLElementValue(element, value, ignoredEvents);
  }
  return Result;
};

TspAutofillManager.prototype._clickElement = function(AXmlNode)
{
  var element = this._findElementFromXmlNode(AXmlNode);
  if (element)
    spHTMLTools.ClickElement(element);
};

TspAutofillManager.prototype._sleep = function(AXmlNode, ASleepCallback)
{
  if (AXmlNode)
  {
    var timeout = AXmlNode.getAttribute(this.AttributeName_timeout);
    if (timeout < 0)
      timeout = 0;
    setTimeout(ASleepCallback, timeout);
  }
};

TspAutofillManager.prototype._setAttributes = function(AXmlNode)
{
  if (!AXmlNode)
    return;

  var element = null;
  var elementRTID = AXmlNode.getAttribute(this.AttributeName_RTID);
  if (elementRTID)
    element = this._findElementFromXmlNode(AXmlNode);
  else
    element = this.Window.document;
  if (!element)
    return;

  var spAttributes = new TspAttributes();
  spAttributes.LoadFromXmlNode(AXmlNode);
  element.spAttributes = spAttributes;
};

TspAutofillManager.prototype._notifyAutofillComplete = function()
{
  if (this.onAutofillCompleteCallback)
    this.onAutofillCompleteCallback();
};

TspAutofillManager.prototype._updatePasswordManagerLocked = function ()
{
  var isPasswordManagerLocked = this.XmlRootNode.getAttribute(this.AttributeName_isPasswordManagerLocked);
  if (!isPasswordManagerLocked)
    return;
  isPasswordManagerLocked = isPasswordManagerLocked.toLowerCase();
  isPasswordManagerLocked = isPasswordManagerLocked == '1' || isPasswordManagerLocked == 'true';
  if (this.onUpdatePasswordManagerLockedCallback)
    this.onUpdatePasswordManagerLockedCallback(isPasswordManagerLocked);
};

TspAutofillManager.prototype._autofillCommands = function(AXmlCommands)
{
  if (AXmlCommands)
  try
  {
    while (AXmlCommands.length)
    {
      var xmlNode = AXmlCommands.shift();
      if (!xmlNode)
        break;
      try
      {
        var tagName = xmlNode.tagName;
        if (spStrings.SameText(tagName, this.AutofillCmd_highlight))
          this._highlightElement(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_addContextButton))
          this._addContextButton(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_cacheProtectedInputValue))
          this._cacheProtectedInputValue(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_subscribeToClick))
          this._subscribeToClickElement(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_subscribeToEnterKeyPress))
          this._subscribeToEnterKeyPress(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_focus))
          this._focusElement(xmlNode);
        else if (spStrings.SameText(tagName, this.AutofillCmd_fill))
        {
          this.NeedToFillElementsCount++;
          if (this._fillElement(xmlNode))
            this.FilledElementsCount++;
        }
        else if (spStrings.SameText(tagName, this.AutofillCmd_click))
        {
          this.NeedToClickElementsCount++;
          this._clickElement(xmlNode);
        }
        else if (spStrings.SameText(tagName, this.AutofillCmd_sleep))
        {
          var Self = this;
          this._sleep(xmlNode, function() {
            Self._autofillCommands(AXmlCommands);
          });
          return; // break the autofill untill next call to this function after timeout
        }
        else if (spStrings.SameText(tagName, this.AutofillCmd_setAttributes))
          this._setAttributes(xmlNode);
        else spLog.logError('TspAutofillManager._autofillCommands() Invalid autofill command: ' + xmlNode.outerHTML)
        ;
      }
      catch (ErrorMessage)
      {
        // ignore exception and try to process next command!
        spLog.logError('TspAutofillManager._autofillCommands() Error processing command "' + xmlNode.outerHTML + '": ' + ErrorMessage);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillManager._autofillCommands() Error: ' + ErrorMessage);
  }
  this._notifyAutofillComplete();
};

TspAutofillManager.prototype.HasAllElementsAutofilled = function()
{
  if (this.AutofillError)
    return false;
  else if (!this.NeedToFillElementsCount)
    return true; // no "fill" commands found (just highlight, etc.)
  else
    return this.NeedToFillElementsCount === this.FilledElementsCount;
};

TspAutofillManager.prototype.AutofillWindowFromXml = function(AWindow, AAutofillXml)
{
  try
  {
    if (!AWindow)
      throw 'AWindow is undefined.';
      
    if (spStrings.IsStrEmpty(AAutofillXml))
      throw 'AAutofillXml is undefined.';

    this.AutofillError = false;
    this.NeedToClickElementsCount = 0;
    this.NeedToFillElementsCount = 0;
    this.FilledElementsCount = 0;

    this.Window = AWindow;
    this.RTIDContext = new TspRTIDContext(AWindow);
    this.DocumentList = spHTMLTools.GetHTMLDocumentList(AWindow);

    if (!this.LoadFromXml(AAutofillXml))
      throw 'Error loading from AAutofillXml';

    this._updatePasswordManagerLocked();

    // convert HTML element collection to array
    var xmlCommands = new Array();
    for (var i = 0, len = this.XmlRootNode.childNodes.length; i < len; i++)
    {
      var xmlNode = this.XmlRootNode.childNodes[i];
      if (xmlNode.nodeType == 1) // allow only ELEMENT_NODE
        xmlCommands.push(xmlNode);
    }
    this._autofillCommands(xmlCommands);
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspAutofillManager.AutofillWindowFromXml() Error: ' + ErrorMessage);
    this.AutofillError = true;
    this._notifyAutofillComplete();
  }
};



// TspPoint --------------------------------------------------------------------

function TspPoint()
{
  this.x = 0;
  this.y = 0;
}

TspPoint.prototype.IsEmpty = function ()
{
  return (this.x == 0) && (this.y == 0);
};

TspPoint.prototype.Offset = function (AdX, AdY)
{
  this.x += AdX;
  this.y += AdY;
};



// TspRect ---------------------------------------------------------------------

function TspRect()
{
  this.left = 0;
  this.top = 0;
  this.right = 0;
  this.bottom = 0;
}

TspRect.prototype.GetLeftTop = function ()
{
  var Result = new TspPoint();
  Result.x = this.left;
  Result.y = this.top;
  return Result;
};

TspRect.prototype.GetRightBottom = function ()
{
  var Result = new TspPoint();
  Result.x = this.right;
  Result.y = this.bottom;
  return Result;
};

TspRect.prototype.Offset = function (AdX, AdY)
{
  this.left += AdX;
  this.top += AdY;
  this.right += AdX;
  this.bottom += AdY;
};



// spTools ---------------------------------------------------------------------

var spTools =
{
  // GetTickCount()
  GetTickCount: function ()
  {
    var now = new Date();
    return now.getTime(); // milliseconds since 1970/01/01
  },

  // GenerateRTID
  GenerateRTID: function ()
  {
    var Result = Math.floor((Math.random() * 22444) + 1);
    Result = Result.toString(10); // necessary only 10-based value to allow parseInt(frameId) in IE
    return Result;
  },

  // GetPointDebugInfo(APoint)
  GetPointDebugInfo: function (APoint)
  {
    var Result = '';
    if (APoint)
      Result = APoint.x + 'x' + APoint.y;
    return Result;
  },

  // GetRectDebugInfo(ARect)
  GetRectDebugInfo: function (ARect)
  {
    var Result = '';
    if (ARect)
      Result = ARect.left + 'x' + ARect.top + '/' + ARect.right + 'x' + ARect.bottom;
    return Result;
  },

  // IsRectEmpty(ARect)
  IsRectEmpty: function (ARect)
  {
    return !ARect || (ARect.left == 0 && ARect.right == 0 || ARect.top == 0 && ARect.bottom == 0);
  },

  // InflateRect(ARect, AdX, AdY)
  InflateRect: function (ARect, AdX, AdY)
  {
    if (ARect)
    {
      ARect.left -= AdX;
      ARect.right += AdX;
      ARect.top -= AdY;
      ARect.bottom += AdY;
    }
  },

  // OffsetRect(ARect, AdX, AdY)
  OffsetRect: function (ARect, AdX, AdY)
  {
    if (ARect)
    {
      ARect.left += AdX;
      ARect.right += AdX;
      ARect.top += AdY;
      ARect.bottom += AdY;
    }
  },

  // IsPointInRect(APoint, ARect)
  IsPointInRect: function (APoint, ARect)
  {
    if (APoint && ARect)
    {
      if (APoint.x >= ARect.left &&
          APoint.x <= ARect.right &&
          APoint.y >= ARect.top &&
          APoint.y <= ARect.bottom
         )
      {
        return true;
      }
    }
    return false;
  },

  // IsEqualRect(ARect1, ARect2)
  IsEqualRect: function (ARect1, ARect2)
  {
    if (ARect1 && ARect2)
      return ARect1.left   == ARect2.left &&
             ARect1.top    == ARect2.top &&
             ARect1.right  == ARect2.right &&
             ARect1.bottom == ARect2.bottom;
    else
      return false;
  },

  // GetOffsetPointFromEvent(AEvent)
  GetOffsetPointFromEvent: function (AEvent)
  {
    var Result = new TspPoint();
    if (AEvent)
    {
      if (typeof AEvent.offsetX !== 'undefined' &&
          typeof AEvent.offsetY !== 'undefined'
         )
      {
        Result.x = AEvent.offsetX;
        Result.y = AEvent.offsetY;
        return Result;
      }
      var target = AEvent.target || AEvent.srcElement;
      var rc = target.getBoundingClientRect();
      Result.x = Math.round(AEvent.clientX - rc.left);
      Result.y = Math.round(AEvent.clientY - rc.top);
    }
    return Result;
  },

  // GetClientPointFromEvent(AEvent)
  GetClientPointFromEvent: function (AEvent)
  {
    var Result = new TspPoint();
    if (AEvent)
    {
      if (typeof AEvent.clientX !== 'undefined' &&
          typeof AEvent.clientY !== 'undefined'
         )
      {
        Result.x = AEvent.clientX;
        Result.y = AEvent.clientY;
      }
    }
    return Result;
  },

  // IsTransparentColor(AColor)
  IsTransparentColor: function (AColor)
  {
    switch ((AColor || '').replace(/\s+/g, '').toLowerCase())
    {
      case 'transparent':
      case '':
      case 'rgba(0,0,0,0)':
        return true;
      default:
        return false;
    }
  },
  
  IsChrome: function()
  {
    // Chrome 1+
    var isChrome = typeof window.chrome != 'undefined';
    return isChrome;
  },
  
  BrowserClientName: {
    // Chromium based
    ComodoDragon: 'ComodoDragon',
    YandexBrowser: 'YandexBrowser',
    OperaChromium: 'OperaChromium',
    Edge: 'Edge',
    Chrome: 'Chrome',
    // Mozilla based
    Firefox: 'Firefox',
    // Safari based
    Safari: 'Safari'
  },
  
  GetBrowserClientName: function()
  {
    var userAgent = navigator.userAgent;

    // Chromium based
    //   all Chromium based browsers check should be before the Chrome one,
    //   because the userAgent also includes the 'Chrome/*.*.*' text
    if (userAgent.indexOf('Dragon/') != -1)
      return this.BrowserClientName.ComodoDragon;
    else if (userAgent.indexOf('YaBrowser/') != -1)
      return this.BrowserClientName.YandexBrowser;
    else if (userAgent.indexOf('OPR/') != -1)
      return this.BrowserClientName.OperaChromium;
    else if (userAgent.indexOf('Edg/') != -1)
      return this.BrowserClientName.Edge;
    //   therefore the Chrome check should be the latest one
    else if (userAgent.indexOf('Chrome/') != -1)
      return this.BrowserClientName.Chrome;

    // Mozilla based
    else if (userAgent.indexOf('Firefox/') != -1)
      return this.BrowserClientName.Firefox;

    // Safari based
    else if (userAgent.indexOf('Safari/') != -1)
      return this.BrowserClientName.Safari;

    // any other usupported browser
    return '';
  }
};



// TspDocumentClientAreaCalculator ---------------------------------------------

function TspDocumentClientAreaCalculator(AWindow)
{
  this.Log = {
    Info: false
  };
  
  if (!AWindow)
    throw 'TspDocumentClientAreaCalculator() Error: AWindow is undefined';

  this.ClientAreaOffsetSize = new TspPoint(); // zero point

  var Self = this;
  this._onResizeHandler = function (AEvent)
  {
    Self._WindowOnResize(AWindow, AEvent);
  };
  this._onMouseOverHandler = function (AEvent)
  {
    Self._MouseOnOver(AWindow, AEvent);
  };

  this.AttachMouseHandler(AWindow);
  AWindow.addEventListener('resize', this._onResizeHandler, true);
  AWindow.addEventListener('unload', function _unload(AEvent) {
    // remove listeners, no longer needed
    AWindow.removeEventListener('unload', _unload, false);
    AWindow.removeEventListener('resize', this._onResizeHandler, true);
    Self.DetachMouseHandler(AWindow);
  }, false);
}

TspDocumentClientAreaCalculator.prototype.AttachMouseHandler = function (AWindow)
{
  if (this.Log.Info)
    spLog.logMessage('TspDocumentClientAreaCalculator.AttachMouseHandler() Attached to mouse over event.');
  if (AWindow)
    AWindow.addEventListener('mouseover', this._onMouseOverHandler, true);
};

TspDocumentClientAreaCalculator.prototype.DetachMouseHandler = function (AWindow)
{
  if (this.Log.Info)
    spLog.logMessage('TspDocumentClientAreaCalculator.DetachMouseHandler() Detached from mouse over event.');
  if (AWindow)
    AWindow.removeEventListener('mouseover', this._onMouseOverHandler, true);
};

TspDocumentClientAreaCalculator.prototype._WindowOnResize = function (AWindow, AEvent)
{
  if (AWindow)
  {
    if (this.Log.Info)
      spLog.logMessage('TspDocumentClientAreaCalculator._WindowOnResize() Window resized - need to attach to mouse over event...');
    // Safari and Chrome has an issue. Right after window maximize or restore
    // we got this event, but in fact window is still being resized by OSX and
    // Page Zoom is not calculated correctly yet, therefore postpone the calculation a bit.  
    if (spHTMLTools.ScreenCoordsConvertor.PostponeCalcPageZoomOnResize)
      setTimeout(function () {
        this.AttachMouseHandler(AWindow);
      }.bind(this), 1000);
    else
      this.AttachMouseHandler(AWindow);
  }
};

TspDocumentClientAreaCalculator.prototype._MouseOnOver = function (AWindow, AEvent)
{
  if (AWindow && AEvent)
  {
    var clientX = spHTMLTools.ScreenCoordsConvertor.ApplyDevicePixelRatioToValue(AEvent.clientX);
    var clientY = spHTMLTools.ScreenCoordsConvertor.ApplyDevicePixelRatioToValue(AEvent.clientY);
    var dx = AEvent.screenX - clientX;
    var dy = AEvent.screenY - clientY;
    var xOffsetSize = dx - AWindow.screenX;
    var yOffsetSize = dy - AWindow.screenY;
    if (this.Log.Info)
      spLog.logMessage('TspDocumentClientAreaCalculator._MouseOnOver() ' +
        ' window.devicePixelRatio=' + window.devicePixelRatio +
        ' ScreenCoordsConvertor.GetPageZoom()=' + spHTMLTools.ScreenCoordsConvertor.GetPageZoom() +

        ' AEvent.clientX=' + AEvent.clientX +
        ' clientX=' + clientX +
        ' AEvent.screenX=' + AEvent.screenX +
        ' window.screenX=' + window.screenX +
        ' dx=' + dx +

        ' AEvent.clientY=' + AEvent.clientY +
        ' clientY=' + clientY +
        ' AEvent.screenY=' + AEvent.screenY +
        ' window.screenY=' + window.screenY +
        ' dy=' + dy +

        ' ClientAreaOffsetSize: [' + xOffsetSize + 'x' + yOffsetSize + ']'
      );
    if (xOffsetSize > 0 || yOffsetSize > 0)
    {
      this.ClientAreaOffsetSize.x = xOffsetSize;
      this.ClientAreaOffsetSize.y = yOffsetSize;
      if (this.Log.Info)
        spLog.logMessage('TspDocumentClientAreaCalculator._MouseOnOver() Calculated ClientAreaOffsetSize - need to detach from mouse over event.');
      this.DetachMouseHandler(AWindow);
    }
  }
};

TspDocumentClientAreaCalculator.prototype.GetWindowScreenPos = function (AWindow)
{
  var windowPos = spHTMLTools.GetWindowScreenPos(AWindow);
  return windowPos;
};

TspDocumentClientAreaCalculator.prototype.GetWindowDocumentScreenPos = function (AWindow)
{
  if (!this.ClientAreaOffsetSize.IsEmpty())
  {
    var windowPos = this.GetWindowScreenPos(AWindow);
    if (windowPos)
      windowPos.Offset(this.ClientAreaOffsetSize.x, this.ClientAreaOffsetSize.y);
    return windowPos;
  }
  return null;
};



// TspChromeDocumentClientAreaCalculator ---------------------------------------

function TspChromeDocumentClientAreaCalculator()
{
  TspDocumentClientAreaCalculator.apply(this, arguments); // inherited call

  // set the default Client Area offset
  if (navigator.platform == 'MacIntel')
  {
    // OSX
    this.ClientAreaOffsetSize.y = 74; // browser without Bookmarks toolbar
  }
  else
  {
    // Windows
    this.ClientAreaOffsetSize.y = 105; // browser with Bookmarks toolbar
  }
}

TspChromeDocumentClientAreaCalculator.prototype = Object.create(TspDocumentClientAreaCalculator.prototype);

TspChromeDocumentClientAreaCalculator.prototype.constructor = TspChromeDocumentClientAreaCalculator;



// TspSafariDocumentClientAreaCalculator ---------------------------------------

function TspSafariDocumentClientAreaCalculator()
{
  TspDocumentClientAreaCalculator.apply(this, arguments); // inherited call

  // set the default Client Area offset
  this.ClientAreaOffsetSize.y = 61; // browser without Bookmarks toolbar
}

TspSafariDocumentClientAreaCalculator.prototype = Object.create(TspDocumentClientAreaCalculator.prototype);

TspSafariDocumentClientAreaCalculator.prototype.constructor = TspSafariDocumentClientAreaCalculator;

TspSafariDocumentClientAreaCalculator.prototype.GetWindowScreenPos = function (AWindow)
{
  var windowPos = TspDocumentClientAreaCalculator.prototype.GetWindowScreenPos.apply(this, arguments); // inherited call
  if (AWindow.screen.availLeft >= 0 &&
      AWindow.screen.availLeft < AWindow.screen.width &&
      AWindow.screen.availTop >= 0 &&
      AWindow.screen.availTop < AWindow.screen.height)
  {
    // main monitor has correct coords
  }
  else
  {
    // recalc correct coords for secondary monitor
    var screenMenuHeight = AWindow.screen.height - AWindow.screen.availHeight;
    //   secondary monitor could have visible taskbar also
    if (screenMenuHeight > 23)
      screenMenuHeight = 23;
    var screenTop = AWindow.screen.availTop - screenMenuHeight;
    windowPos.y += screenTop;
  }
  return windowPos;
};




// TspScreenCoordsConvertor ----------------------------------------------------

function TspScreenCoordsConvertor()
{
  // empty
}

TspScreenCoordsConvertor.prototype.GetPageZoom = function ()
{
  // default Windows implementation
  return window.devicePixelRatio || 1;
};

TspScreenCoordsConvertor.prototype.ApplyDevicePixelRatioToValue = function (AValue)
{
  var pageZoom = this.GetPageZoom();
  AValue = parseInt(AValue * pageZoom);
  return AValue;
};

TspScreenCoordsConvertor.prototype.ApplyDevicePixelRatioToRect = function (ARect)
{
  if (!ARect)
    return;
  var pageZoom = this.GetPageZoom();
  ARect.left = parseInt(ARect.left * pageZoom);
  ARect.top = parseInt(ARect.top * pageZoom);
  ARect.right = parseInt(ARect.right * pageZoom);
  ARect.bottom = parseInt(ARect.bottom * pageZoom);
};



// TspOSXScreenCoordsConvertor -------------------------------------------------

function TspOSXScreenCoordsConvertor()
{
  this.GetPageZoomMessage = 'spGetPageZoom';
  this.StorePageZoomMessage = 'spStorePageZoom';
  this.PageZoom = 1;
  this.PostponeCalcPageZoomOnResize = false;

  TspScreenCoordsConvertor.apply(this, arguments); // inherited call

  // cache the PageZoom to optimize the calculations speed during this convertor life
  this._calcPageZoom();

  var Self = this;
  this._onMessageHandler = function (AEvent)
  {
    Self._handleWindowMessage(AEvent.data, AEvent.source);
  };
  this._onResizeHandler = function (AEvent)
  {
    Self._handleWindowResize(AEvent);
  };

  window.addEventListener('message', this._onMessageHandler, true);
  window.addEventListener('resize', this._onResizeHandler, true);
  window.addEventListener('unload', function _unload(AEvent) {
    // remove listeners, no longer needed
    window.removeEventListener('unload', _unload, false);
    window.removeEventListener('message', this._onMessageHandler, true);
    window.removeEventListener('resize', this._onResizeHandler, true);
  }, false);
}

TspOSXScreenCoordsConvertor.prototype = Object.create(TspScreenCoordsConvertor.prototype);

TspOSXScreenCoordsConvertor.prototype.constructor = TspOSXScreenCoordsConvertor;

TspOSXScreenCoordsConvertor.prototype.GetPageZoom = function ()
{
  return this.PageZoom;
};

TspOSXScreenCoordsConvertor.prototype._handleWindowResize = function (AEvent)
{
  // Safari and Chrome has an issue. Right after window maximize
  // "window.outerWidth" returns previous value (before maximization) 
  // but "window.innerWidth" returns correct value (after maximization),
  // therefore the PageZoom calculated incorrectly.
  // The same thing occures during window restore.
  // Therefore postpone the Page Zoom calculation a bit.
  if (this.PostponeCalcPageZoomOnResize)
    setTimeout(function () {
      this._calcPageZoom();
    }.bind(this), 1000);
  else
    this._calcPageZoom();
};



// TspTopWindowOSXScreenCoordsConvertor ----------------------------------------

function TspTopWindowOSXScreenCoordsConvertor()
{
  this.isCalculating = false;

  TspOSXScreenCoordsConvertor.apply(this, arguments); // inherited call
}

TspTopWindowOSXScreenCoordsConvertor.prototype = Object.create(TspOSXScreenCoordsConvertor.prototype);

TspTopWindowOSXScreenCoordsConvertor.prototype.constructor = TspTopWindowOSXScreenCoordsConvertor;

TspTopWindowOSXScreenCoordsConvertor.prototype._handleWindowMessage = function (AMessage, AWindow)
{
  if (AMessage && AWindow)
  {
    if (AMessage.Action == this.GetPageZoomMessage)
    {
      // top window implementation
      if (this.isCalculating)
        this._storeCrossOriginWindow(AWindow);  // postpone the PageZoom return until calculated
      else
        this._notifyPageZoomChanged(AWindow);   // return stored PageZoom
    }
  }
};

TspTopWindowOSXScreenCoordsConvertor.prototype._notifyPageZoomChanged = function (AWindow)
{
  if (AWindow)
  {
    var message = {};
    message.Action = this.StorePageZoomMessage;
    message.PageZoom = this.PageZoom;
    AWindow.postMessage(message, '*');
  }
};

TspTopWindowOSXScreenCoordsConvertor.prototype._storeCrossOriginWindow = function (AWindow)
{
  if (AWindow)
  {
    if (!this.CrossOriginWindows)
      this.CrossOriginWindows = new Array();
    if (this.CrossOriginWindows.indexOf(AWindow) == -1)
      this.CrossOriginWindows.push(AWindow);
  }
};

TspTopWindowOSXScreenCoordsConvertor.prototype._beginAsyncCalculation = function ()
{
  this.isCalculating = true;
};

TspTopWindowOSXScreenCoordsConvertor.prototype._endAsyncCalculation = function ()
{
  this.isCalculating = false;
  if (this.CrossOriginWindows)
  {
    // top window implementation - return the calculated PageZoom to Cross-Origin windows
    for (var i = this.CrossOriginWindows.length-1; i >= 0; i--)
    {
      var coWindow = this.CrossOriginWindows.pop();
      this._notifyPageZoomChanged(coWindow);
    }
  }
};



// TspChromeOSXScreenCoordsConvertor -------------------------------------------

function TspChromeOSXScreenCoordsConvertor()
{
  TspTopWindowOSXScreenCoordsConvertor.apply(this, arguments); // inherited call
  this.PostponeCalcPageZoomOnResize = true;
  this.PostponeCalcAttempts = 0;
  this.PostponeCalcMaxAttempts = 6;
  this._tryCalcPageZoom();
}

TspChromeOSXScreenCoordsConvertor.prototype = Object.create(TspTopWindowOSXScreenCoordsConvertor.prototype);

TspChromeOSXScreenCoordsConvertor.prototype.constructor = TspChromeOSXScreenCoordsConvertor;

TspChromeOSXScreenCoordsConvertor.prototype._calcPageZoom = function ()
{
  this.PageZoom = window.outerWidth / window.innerWidth;
};

TspChromeOSXScreenCoordsConvertor.prototype._tryCalcPageZoom = function (ANeedCalc)
{
  if (ANeedCalc)
    this._calcPageZoom();
  if (this.PageZoom <= 0)
  {
    if (!this._postponeCalcPageZoom())
      this.PageZoom = 1; // assume page zoom is 100%
  }
};

TspChromeOSXScreenCoordsConvertor.prototype._postponeCalcPageZoom = function ()
{
  // Chrome has an issue that initially window.outerWidth could be zero,
  // therefore we need to calc page zoom after small timeout
  this.PostponeCalcAttempts++;
  if (this.PostponeCalcAttempts > this.PostponeCalcMaxAttempts)
    return false;

  var Self = this;
  setTimeout(function (AEvent) {
    Self._tryCalcPageZoom(true);
  }, 150);
  return true;
};



// TspFirefoxOSXScreenCoordsConvertor ------------------------------------------

function TspFirefoxOSXScreenCoordsConvertor()
{
  TspTopWindowOSXScreenCoordsConvertor.apply(this, arguments); // inherited call 

  // public properties
  //   onGetBackgroundWindowWidthCallback(AWindow, AResponseCallback)
  this.onGetBackgroundWindowWidthCallback = null;
}

TspFirefoxOSXScreenCoordsConvertor.prototype = Object.create(TspTopWindowOSXScreenCoordsConvertor.prototype);

TspFirefoxOSXScreenCoordsConvertor.prototype.constructor = TspFirefoxOSXScreenCoordsConvertor;

TspFirefoxOSXScreenCoordsConvertor.prototype._calcPageZoom = function ()
{
  if (!this.onGetBackgroundWindowWidthCallback)
    return;
  var Self = this;
  this._beginAsyncCalculation();
  this.onGetBackgroundWindowWidthCallback(window, function (ABackgroundWindowWidth) {
    Self._handleBackgroundWindowWidth(ABackgroundWindowWidth);
  });
};

TspFirefoxOSXScreenCoordsConvertor.prototype._handleBackgroundWindowWidth = function (ABackgroundWindowWidth)
{
  this.PageZoom = ABackgroundWindowWidth / window.outerWidth;
  this._endAsyncCalculation();
};

TspFirefoxOSXScreenCoordsConvertor.prototype.SetBackgroundWindowWidthCallback = function (AGetBackgroundWindowWidthCallback)
{
  this.onGetBackgroundWindowWidthCallback = AGetBackgroundWindowWidthCallback;
  this._calcPageZoom();
};



// TspSafariOSXScreenCoordsConvertor -------------------------------------------

function TspSafariOSXScreenCoordsConvertor()
{
  TspTopWindowOSXScreenCoordsConvertor.apply(this, arguments); // inherited call
  this.PostponeCalcPageZoomOnResize = true;
}

TspSafariOSXScreenCoordsConvertor.prototype = Object.create(TspTopWindowOSXScreenCoordsConvertor.prototype);

TspSafariOSXScreenCoordsConvertor.prototype.constructor = TspSafariOSXScreenCoordsConvertor;

TspSafariOSXScreenCoordsConvertor.prototype._calcPageZoom = function ()
{
  this.PageZoom = window.outerWidth / window.innerWidth;
};



// TspCrossOriginWindowOSXScreenCoordsConvertor --------------------------------

function TspCrossOriginWindowOSXScreenCoordsConvertor()
{
  TspOSXScreenCoordsConvertor.apply(this, arguments); // inherited call
}

TspCrossOriginWindowOSXScreenCoordsConvertor.prototype = Object.create(TspOSXScreenCoordsConvertor.prototype);

TspCrossOriginWindowOSXScreenCoordsConvertor.prototype.constructor = TspCrossOriginWindowOSXScreenCoordsConvertor;

TspCrossOriginWindowOSXScreenCoordsConvertor.prototype._calcPageZoom = function ()
{
  var message = {};
  message.Action = this.GetPageZoomMessage;
  window.top.postMessage(message, '*');
};

TspCrossOriginWindowOSXScreenCoordsConvertor.prototype._handleWindowMessage = function (AMessage, AWindow)
{
  if (AMessage && AWindow)
  {
    if (AMessage.Action == this.StorePageZoomMessage)
    {
      // cross-origin child window implementation - store returned PageZoom
      this.PageZoom = AMessage.PageZoom;
    }
  }
};



// spHTMLTools -----------------------------------------------------------------

var spHTMLTools =
{
  Log: {
    // log modes
    CrossOrigin: false
  },

  SupportSVG: null, // undefined initially

  SupportCrossOrigin: true,

  CrossOriginType: {
    coNone: 0,
    coCrossOrigin: 1,
    coSameOriginDomain: 2
  },

  ScreenCoordsConvertor: null,

  DocumentClientAreaCalculator: null,

  // ConvertElementPositionToScreenCallback(AWindow, AHtmlElement, ARect, AScreenCoordsConvertor)
  ConvertElementPositionToScreenCallback: null,

  // IsSVGSupported()
  //   allows to check if SVG is supported by current browser
  IsSVGSupported: function()
  {
    if (this.SupportSVG == null)
    {
      this.SupportSVG = false;
      try
      {
        if (!!(window.SVGSVGElement))
          this.SupportSVG = true;
        else if (document.implementation && document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1'))
          this.SupportSVG = true;
        else if (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect)
          this.SupportSVG = true;
      }
      catch (ErrorMessage)
      {
        spLog.logError('spHTMLTools.IsSVGSupported() Error: ' + ErrorMessage);
      }
    }
    return this.SupportSVG;
  },

  // GetElementDebugInfo(AHtmlElement)
  GetElementDebugInfo: function(AHtmlElement)
  {
    var Result = '';
    if (AHtmlElement)
    try
    {
      var s;
      // <tagName
      Result = '<' + AHtmlElement.tagName;
      // type
      if (AHtmlElement.tagName && AHtmlElement.tagName.toUpperCase() === 'INPUT')
        Result += ' type="' + AHtmlElement.type + '"';
      // id
      s = this.GetHTMLElementID(AHtmlElement);
      if (s)
        Result += ' id="' + s + '"';
      // name
      s = this.GetHTMLElementName(AHtmlElement);
      if (s)
        Result += ' nm="' + s + '"';
      // className
      s = AHtmlElement.className;
      if (s)
        Result += ' cn="' + s + '"';
      // spRTID
      s = AHtmlElement.spRTID;
      if (s)
        Result += ' spRTID="' + s + '"';
      // >
      Result += '>';
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetElementDebugInfo() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // GetHTMLElementID(AHtmlElement)
  GetHTMLElementID: function (AHtmlElement)
  {
    var Result = '';
    if (AHtmlElement)
    {
      Result = AHtmlElement.id;
      if (typeof Result == 'string')
        return Result;
      // Form can contain child element with name "id" - use attribute for this case
      if (AHtmlElement.getAttribute)
        Result = AHtmlElement.getAttribute('id');
      else
        Result = '';
    }
    return Result;
  },

  // GetHTMLElementName(AHtmlElement)
  GetHTMLElementName: function (AHtmlElement)
  {
    var Result = '';
    if (AHtmlElement)
    {
      Result = AHtmlElement.name;
      if (typeof Result == 'string')
        return Result;
      // Form can contain child element with name "name" - use attribute for this case
      if (AHtmlElement.getAttribute)
        Result = AHtmlElement.getAttribute('name');
      else
        Result = '';
    }
    return Result;
  },

  // GetElementStyle(AElement)
  GetElementStyle: function(AElement)
  {
    try
    {
      if (window.getComputedStyle)
        return document.defaultView.getComputedStyle(AElement, null);
    }
    catch (ErrorMessage)
    {
      if (this.Log.Errors)
        spLog.logError(
          'spHTMLTools.GetElementStyle() Error calling getComputedStyle() for ' +
          this.GetElementDebugInfo(AElement) + ': ' + ErrorMessage
        );
    }
    if (AElement.currentStyle)
      return AElement.currentStyle;
    return null;
  },

  // ParseStyleBackgroundSize(AValue, AElementFullSize)
  ParseStyleBackgroundSize: function(AValue, AElementFullSize)
  {
    var Result;
    if (AValue)
    {
      if (AValue.indexOf('px') != -1)
        Result = parseInt(AValue);
      else if (AValue.indexOf('%') != -1)
        Result = parseInt(AElementFullSize * (parseInt(AValue) / 100));
    }
    return Result;
  },

  // ParseStyleBackgroundPosition(AValue, AGetElementFullSizeCallback, ACallback)
  ParseStyleBackgroundPosition: function(AValue, AGetElementFullSizeCallback, ACallback)
  {
    var Result;
    if (AValue)
    {
      if (AValue.indexOf('px') != -1)
        Result = parseInt(AValue);
      else if (AValue.indexOf('%') != -1)
      {
        AGetElementFullSizeCallback(function (AElementFullSize) {
          Result = parseInt(AElementFullSize * (parseInt(AValue) / 100));
          ACallback(Result);
        });
        return;
      }
    }
    ACallback(Result);
  },

  // GetElementBackgroundPositionX(AElement, AStyle, AGetBackgroundImageSizeCallback, ACallback)
  GetElementBackgroundPositionX: function(AElement, AStyle, AGetBackgroundImageSizeCallback, ACallback)
  {
    var Result = {};
    Result.x = null;
    Result.offset = 'left';

    if (AElement && AStyle)
    try
    {
      var x = '';
      if (AStyle.backgroundPositionX)
        x = AStyle.backgroundPositionX;
      if (AStyle.backgroundPosition)
      {
        var a = AStyle.backgroundPosition.split(' ');
        if (a && a.length)
        {
          if (a.length == 3 || a.length == 4)
          {
            Result.offset = a[0].toLowerCase();
            x = a[1];
          }
          else
          {
            x = a[0];
          }
        }
      }
      this.ParseStyleBackgroundPosition(x,
        // AGetElementFullSizeCallback
        function (AFullSizeCallback) {
          AGetBackgroundImageSizeCallback(function (ABackgroundImageSize) {
            AFullSizeCallback(AElement.offsetWidth - ABackgroundImageSize.width);
          });
        },
        // ACallback
        function (x) {
          Result.x = x;
          if (Result.x)
          {
            if (Result.offset == 'right')
              Result.x = AElement.offsetWidth - Result.x;
          }
          ACallback(Result);
        }
      );
    }
    catch (ErrorMessage)
    {
      if (this.Log.Errors)
        spLog.logError(
          'spHTMLTools.GetElementBackgroundPositionX() Error: ' + ErrorMessage
        );
    }
  },

  // IsFrameElement(AHtmlElement)
  IsFrameElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      var tagName = AHtmlElement.tagName.toUpperCase();
      Result = tagName === 'IFRAME' || tagName === 'FRAME'
      ;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsFrameElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // IsInputHiddenElement(AHtmlElement)
  IsInputHiddenElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      Result = 
        AHtmlElement.tagName.toUpperCase() === 'INPUT' &&
        AHtmlElement.type.toLowerCase() === 'hidden'
      ;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsInputHiddenElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  GetAuthElementSelector: function()
  {
    return 'input[type="password"],input[type="email"]';
  },

  // IsInputAuthElement(AHtmlElement)
  IsInputAuthElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      if (AHtmlElement.tagName.toUpperCase() === 'INPUT')
      {
        var type = AHtmlElement.type.toLowerCase();
        switch (type)
        {
          case 'email':
          case 'password':
            Result = true;
            break;
        }
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsInputAuthElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  GetPasswordElementSelector: function()
  {
    return 'input[type="password"]';
  },

  // IsInputPasswordElement(AHtmlElement)
  IsInputPasswordElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      Result = 
        AHtmlElement.tagName.toUpperCase() === 'INPUT' &&
        AHtmlElement.type.toLowerCase() === 'password'
      ;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsInputPasswordElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  GetInputEditableElementSelector: function()
  {
    return 'input:not([type]),input[type="text"],input[type="password"],input[type="email"],' +
           'input[type="url"],input[type="search"],input[type="tel"],input[type="number"]';
  },

  // IsInputEditableElement(AHtmlElement)
  //   any input element where user can write any text
  IsInputEditableElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      if (AHtmlElement.tagName.toUpperCase() === 'INPUT')
      {
        var type = AHtmlElement.type.toLowerCase();
        switch (type)
        {
          case '':
          case 'text':
          case 'password':
          case 'email':
          case 'url':
          case 'search':
          case 'tel':
          case 'number':
            Result = true;
            break;
        }
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsInputEditableElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // IsTextAreaElement(AHtmlElement)
  IsTextAreaElement: function (AHtmlElement)
  {
    var Result = false;
    if (AHtmlElement)
    try
    {
      Result = 
        AHtmlElement.tagName.toUpperCase() === 'TEXTAREA'
      ;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsTextAreaElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // IsTextElement(AHtmlElement)
  //   any element where user can write any text
  IsTextElement: function (AHtmlElement)
  {
    return this.IsInputEditableElement(AHtmlElement) ||
           this.IsTextAreaElement(AHtmlElement);
  },

  GetEditableElementSelector: function()
  {
    return 'textarea,select,' + this.GetInputEditableElementSelector();
  },
  
  // IsEditableElement(AHtmlElement)
  //   any element where user can write any text or select item
  IsEditableElement: function (AHtmlElement)
  {
    if (AHtmlElement)
    try
    {
      if (this.IsInputEditableElement(AHtmlElement))
        return true;

      switch (AHtmlElement.tagName.toUpperCase())
      {
        case 'TEXTAREA':
        case 'SELECT':
          return true;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsEditableElement() Error: ' + ErrorMessage);
    }
    return false;
  },

  // ReplaceElementSelectedText(AHtmlElement, AReplaceTo)
  ReplaceElementSelectedText: function (AHtmlElement, AReplaceTo)
  {
    if (AHtmlElement && AReplaceTo)
    try
    {
      if (typeof AHtmlElement.setSelectionRange != 'function')
        return false;

      var selStart = AHtmlElement.selectionStart;
      var selEnd = AHtmlElement.selectionEnd;
      var sLeft = AHtmlElement.value.slice(0, selStart);
      var sRight = AHtmlElement.value.slice(selEnd, AHtmlElement.value.length);
      // check for max length
      if (AReplaceTo && AReplaceTo.length > 0 && AHtmlElement.maxLength > 0)
      {
        var availableLength = AHtmlElement.maxLength - sLeft.length - sRight.length;
        if (availableLength <= 0)
          return true; // no more input allowed
        AReplaceTo = AReplaceTo.slice(0, availableLength);
      }
      AHtmlElement.value = sLeft + AReplaceTo + sRight;
      this.FireElementEvent(AHtmlElement, 'input');
      this.FireElementEvent(AHtmlElement, 'change');
      var pos = selStart + AReplaceTo.length;
      AHtmlElement.setSelectionRange(pos, pos);
      spInputValueCacheManager.replaceInputSelectionValue(AHtmlElement, AReplaceTo, selStart, selEnd, true);  // call only for ProtectedInput
      this.ElementSetFocus(AHtmlElement);
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.ReplaceElementSelectedText() Error: ' + ErrorMessage);

      // selectionStart, selectionEnd is not implemented for <input type="email">,
      //   therefore try to add string to the end of the input
      AHtmlElement.value = AHtmlElement.value + AReplaceTo;
      this.ElementSetFocus(AHtmlElement);
      return true;
    }
    return false;
  },
  
  // ElementSetFocus(AHtmlElement)
  ElementSetFocus: function (AHtmlElement)
  {
    if (AHtmlElement)
    try
    {
      AHtmlElement.focus();
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.ElementSetFocus() Error: ' + ErrorMessage);
    }
    return false;
  },

  // GetElementPosition(AHtmlElement)
  GetElementPosition: function (AHtmlElement)
  {
    var Result = new TspRect();

    if (!AHtmlElement)
      return Result;
    try
    {
      if (typeof AHtmlElement.getBoundingClientRect == 'function')
      {
        var rc = AHtmlElement.getBoundingClientRect();
        Result.left = rc.left;
        Result.top = rc.top;
        Result.right = rc.right;
        Result.bottom = rc.bottom;
      }
      else
      {
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;
        var parentNode = null;
        var offsetParent = AHtmlElement.offsetParent;
        var originalElement = AHtmlElement;
        var Element = AHtmlElement; // Element will be nodes as we walk up, AHtmlElement will be saved for offsetParent references
        while (Element.parentNode != null)
        {
          Element = Element.parentNode;
          // calc scrollTop
          if (Element.scrollTop && Element.scrollTop > 0)
            top -= Element.scrollTop;
          if (Element.scrollLeft && Element.scrollLeft > 0)
            left -= Element.scrollLeft;
          // if this node is also the offsetParent, add on the offsets and reset to the new offsetParent
          if (Element == offsetParent)
          {
            left += AHtmlElement.offsetLeft;
            top += AHtmlElement.offsetTop;
            if (Element.nodeName != 'TABLE')
            {
              if (Element.clientLeft)
                left += Element.clientLeft;
              if (Element.clientTop)
                top += Element.clientTop;
            }
            AHtmlElement = Element;
            if (AHtmlElement.offsetParent == null)
            {
              if (AHtmlElement.offsetLeft)
                left += AHtmlElement.offsetLeft;
              if (AHtmlElement.offsetTop)
                top += AHtmlElement.offsetTop;
            }
            offsetParent = AHtmlElement.offsetParent;
          }
        }
        if (originalElement.offsetWidth)
          width = originalElement.offsetWidth;
        if (originalElement.offsetHeight)
          height = originalElement.offsetHeight;

        Result.left = left;
        Result.top = top;
        Result.right = left + width;
        Result.bottom = top + height;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetElementPosition() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // GetElementScreenPosition(AHtmlElement)
  GetElementScreenPosition: function (AHtmlElement)
  {
    // obtain element position relative to the document
    var rc = this.GetElementPosition(AHtmlElement);
    if (!AHtmlElement)
      return rc;

    // convert element position relative to the screen
    if (this.ConvertElementPositionToScreenCallback)
    {
      var ADocument = AHtmlElement.ownerDocument;
      if (ADocument)
      {
        var AWindow = ADocument.defaultView;
        this.ConvertElementPositionToScreenCallback(AWindow, AHtmlElement, rc, this.ScreenCoordsConvertor);
      }
    }

    return rc;
  },

  // SetConvertElementPositionToScreenCallback(ACallback)
  SetConvertElementPositionToScreenCallback: function (ACallback)
  {
    this.ConvertElementPositionToScreenCallback = ACallback;
  },

  // GetElementFunctionAttributeAsStr(AHtmlElement)
  GetElementFunctionAttributeAsStr: function(AHtmlElement, AAttributeName)
  {
    var Result = '';
    if (AHtmlElement)
    try
    {
      var funAttribute = AHtmlElement.getAttribute(AAttributeName);
      if (funAttribute)
        Result = funAttribute.toString();
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetElementFunctionAttributeAsStr() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // IsTopWindow()
  IsTopWindow: function(AWindow)
  {
    if (AWindow)
    try
    {
      // Skip frames
      if (AWindow != AWindow.top || AWindow.frameElement)
        return false;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.IsTopWindow() Error: ' + ErrorMessage);
      return false;
    }
    return true;
  },

  // GetTopWindow()
  GetTopWindow: function(AWindow)
  {
    if (AWindow)
    try
    {
      while (!this.IsTopWindow(AWindow))
      {
        var topWindow = AWindow.top;
        if (!topWindow || topWindow == AWindow)
          break;
        AWindow = topWindow;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetTopWindow() Error: ' + ErrorMessage);
    }
    return AWindow;
  },

  // GetAccessibleTopWindow()
  GetAccessibleTopWindow: function(AWindow)
  {
    if (AWindow)
    try
    {
      while (!this.IsTopWindow(AWindow))
      {
        // stop if parent window has other origin!
        if (this.HasWindowCrossOriginParent(AWindow))
          break;
        var parentWindow = AWindow.parent;
        if (!parentWindow || parentWindow == AWindow)
          break;
        AWindow = parentWindow;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetAccessibleTopWindow() Error: ' + ErrorMessage);
    }
    return AWindow;
  },

  // GetElementTopWindow()
  GetElementTopWindow: function(AElement)
  {
    if (AElement)
    try
    {
      var ADocument = AElement.ownerDocument;
      var AWindow = ADocument.defaultView;
      if (!AWindow)
        AWindow = window;
      // convert AWindow to top one (cause of frames using)
      AWindow = this.GetTopWindow(AWindow);
      return AWindow;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetElementTopWindow() Error: ' + ErrorMessage);
    }
    return null;
  },

  // GetElementAccessibleTopWindow()
  GetElementAccessibleTopWindow: function(AElement)
  {
    if (AElement)
    try
    {
      var ADocument = AElement.ownerDocument;
      var AWindow = ADocument.defaultView;
      if (!AWindow)
        AWindow = window;
      // convert AWindow to accessible top one (cause of frames using)
      AWindow = this.GetAccessibleTopWindow(AWindow);
      return AWindow;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetElementAccessibleTopWindow() Error: ' + ErrorMessage);
    }
    return null;
  },

  // GetWindowScreenPos()
  GetWindowScreenPos: function(AWindow)
  {
    var Result = new TspPoint();
    if (AWindow)
    try
    {
      // Opera has only "screenLeft" & "screenTop" properties
      if (typeof AWindow.screenLeft !== 'undefined')
        Result.x = AWindow.screenLeft;
      else
        Result.x = AWindow.screenX;
      if (typeof AWindow.screenTop !== 'undefined')
        Result.y = AWindow.screenTop;
      else
        Result.y = AWindow.screenY;
    }
    catch(ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetWindowScreenPos() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // CreateScreenCoordsConvertor()
  CreateScreenCoordsConvertor: function(AWindow)
  {
    if (AWindow)
    try
    {
      if (navigator.platform == 'MacIntel')
      {
        // OSX
        if (this.IsTopWindow(AWindow))
        {
          var browserClientName = spTools.GetBrowserClientName();
          if (browserClientName == spTools.BrowserClientName.Chrome)
            this.ScreenCoordsConvertor = new TspChromeOSXScreenCoordsConvertor(AWindow);
          else if (browserClientName == spTools.BrowserClientName.Firefox)
            this.ScreenCoordsConvertor = new TspFirefoxOSXScreenCoordsConvertor(AWindow);
          else if (browserClientName == spTools.BrowserClientName.Safari)
            this.ScreenCoordsConvertor = new TspSafariOSXScreenCoordsConvertor(AWindow);
        }
        else
        {
          this.ScreenCoordsConvertor = new TspCrossOriginWindowOSXScreenCoordsConvertor(AWindow);
        }
      }
      else
      {
        // assume Windows
        this.ScreenCoordsConvertor = new TspScreenCoordsConvertor(AWindow);
      }
    }
    catch(ErrorMessage)
    {
      spLog.logError('spHTMLTools.CreateScreenCoordsConvertor() Error: ' + ErrorMessage);
    }
    return this.ScreenCoordsConvertor;
  },

  // CreateDocumentClientAreaCalculator()
  CreateDocumentClientAreaCalculator: function(AWindow)
  {
    if (AWindow)
    try
    {
      if (this.IsTopWindow(AWindow))
      {
        if (navigator.platform == 'MacIntel')
        {
          // OSX
          var browserClientName = spTools.GetBrowserClientName();
          if (browserClientName == spTools.BrowserClientName.Chrome)
            this.DocumentClientAreaCalculator = new TspChromeDocumentClientAreaCalculator(AWindow);
          else if (browserClientName == spTools.BrowserClientName.Safari)
            this.DocumentClientAreaCalculator = new TspSafariDocumentClientAreaCalculator(AWindow);
        }
      }
    }
    catch(ErrorMessage)
    {
      spLog.logError('spHTMLTools.CreateDocumentClientAreaCalculator() Error: ' + ErrorMessage);
    }
  },

  // AllowCreateDocumentClientAreaCalculator()
  AllowCreateDocumentClientAreaCalculator: function(AWindow)
  {
    if (AWindow)
    try
    {
      if (navigator.platform == 'MacIntel')
      {
        // OSX
        var browserClientName = spTools.GetBrowserClientName();
        return browserClientName == spTools.BrowserClientName.Chrome ||
               browserClientName == spTools.BrowserClientName.Safari;
      }
      return false;
    }
    catch(ErrorMessage)
    {
      spLog.logError('spHTMLTools.AllowCreateDocumentClientAreaCalculator() Error: ' + ErrorMessage);
    }
  },

  // GetWindowDocument(AWindow)
  GetWindowDocument: function (AWindow)
  {
    var Result = null;
    var DocumentErrorMessage = '';
    if (AWindow)
    try
    {
      try
      {
        if (AWindow.contentDocument)
          Result = AWindow.contentDocument; // it is "iframe" element
        else
          Result = AWindow.document;        // it is "window" element
      }
      catch (ErrorMessage)
      {
        DocumentErrorMessage = ErrorMessage;
        // cross-frame access problem under Chromium
        if (AWindow.contentWindow)
          Result = AWindow.contentWindow.document;
      }  
    }
    catch (ErrorMessage)
    {
      if (this.Log.CrossOrigin)
      {
        if (DocumentErrorMessage != '')
          ErrorMessage = DocumentErrorMessage + ' ' + ErrorMessage;
        spLog.logError('spHTMLTools.GetWindowDocument() Error: ' + ErrorMessage);
      }
    }
    return Result;
  },

  // GetWindowCrossOriginType(AWindow)
  GetWindowCrossOriginType: function (AWindow)
  {
    if (this.SupportCrossOrigin &&
        AWindow &&
        typeof AWindow.parent != 'undefined' &&
        typeof AWindow.document != 'undefined'
       )
    try
    {
      var parentDocument = this.GetWindowDocument(AWindow.parent);
      if (!parentDocument)
        return this.CrossOriginType.coCrossOrigin;

      // if child frame has access to parent document via "domain" property - anyway assume it's cross-origin
      if (AWindow.document.domain &&
          AWindow.document.domain == parentDocument.domain &&
          AWindow.document.location.host != parentDocument.location.host)
      {
        return this.CrossOriginType.coSameOriginDomain;
      }
    }
    catch (ErrorMessage)
    {
      if (this.Log.CrossOrigin)
        spLog.logError('spHTMLTools.GetWindowCrossOriginType() Error: ' + ErrorMessage);
      return this.CrossOriginType.coCrossOrigin;
    }
    return this.CrossOriginType.coNone;
  },

  // HasWindowCrossOriginParent(AWindow)
  HasWindowCrossOriginParent: function (AWindow)
  {
    var cot = this.GetWindowCrossOriginType(AWindow);
    return cot != this.CrossOriginType.coNone;
  },

  // HasFrameCrossOriginParent(AFrame)
  HasFrameCrossOriginParent: function (AFrame)
  {
    if (this.SupportCrossOrigin &&
        AFrame &&
        typeof AFrame.contentWindow != 'undefined'
       )
    try
    {
      var AWindow = AFrame.contentWindow;
      var Result = this.HasWindowCrossOriginParent(AWindow);
      return Result;
    }
    catch (ErrorMessage)
    {
      if (this.Log.CrossOrigin)
        spLog.logError('spHTMLTools.HasFrameCrossOriginParent() Error: ' + ErrorMessage);
      return true;
    }
    return false;
  },

  // GetHTMLDocumentList(AWindow)
  GetHTMLDocumentList: function (AWindow)
  {
    var Self = this;

    function _recurseFrames(AFrames, AList)
    {
      if (AFrames && AList)
      try
      {
        for(var i = 0, len = AFrames.length; i < len; i++)
          _recurseWindow(AFrames[i], AList);
      }
      catch (ErrorMessage)
      {
        spLog.logError('spHTMLTools.GetHTMLDocumentList()->_recurseFrames() Error: ' + ErrorMessage);
      }
    }

    function _recurseWindow(AWindow, AList)
    {
      if (AWindow && AList)
      try
      {
        // 1. add Window's document
        //   1.1. obtain the document
        var ADocument = Self.GetWindowDocument(AWindow);
        if (!ADocument)
          return;
        //   1.2. check if we can access the document's properties (cross-domain access)?
        try
        {
          // check if we can access the document?
          var t = ADocument.length && ADocument.forms;
        }
        catch (ErrorMessage)
        {
          // cross-domain error - just ignore specified window/frame
          return;
        }
        //   1.3. check if the document has been already added
        if (AList.indexOf(ADocument) != -1)
          return;
        //   1.4. add the document to the list
        AList.push(ADocument);
        
        // 2. try to recurse the Window's frames
        _recurseFrames(AWindow.frames, AList);
        
        // 3. try to recurse the Document's iframes/frames
        //      INFO: This is made only for Google Chrome because "window.frames[i]" 
        //      returns "null" for "iframe" element (is it a bug or security?).
        var frames = ADocument.querySelectorAll('iframe,frame');
        _recurseFrames(frames, AList);
      }
      catch (ErrorMessage)
      {
        spLog.logError('spHTMLTools.GetHTMLDocumentList()->_recurseWindow() Error: ' + ErrorMessage);
      }
    }

    var Result = new Array();
    _recurseWindow(AWindow, Result);
    return Result;
  },

  // AllowProcessDocument(ADocument)
  AllowProcessDocument: function(ADocument)
  {
    try
    {
      // check for ADocument object initialized
      if (ADocument == null)
        return false;
      // filter:
      //  * non-document nodes
      if (ADocument.nodeName != '#document')
        return false;
      //  * URL
      var Url = ADocument.URL;
      //  *   empty URL
      if (spStrings.IsStrEmpty(Url))
        return false;
      //  *   blank URL
      if (spStrings.SearchText('about:', Url))
        return false;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.AllowProcessDocument() Error: ' + ErrorMessage);
      return false;
    }
    return true;
  },

  // GetDocumentFocusedElement(ADocument)
  GetDocumentFocusedElement: function (ADocument)
  {
    var Result = null;
    if (ADocument)
    try
    {
      if (ADocument.commandDispatcher)
        Result = ADocument.commandDispatcher.focusedElement;
      if (!Result &&
          ADocument.commandDispatcher &&
          ADocument.commandDispatcher.focusedWindow &&
          ADocument.commandDispatcher.focusedWindow.document
         )
      {
        Result = ADocument.commandDispatcher.focusedWindow.document.activeElement;
      }
      if (!Result)
        Result = ADocument.activeElement;
      // if active element located in shadowRoot - we get shadowRoot element instead real one
      if (Result &&
          typeof Result.shadowRoot != 'undefined' &&
          Result.shadowRoot
         )
      {
        if (Result.shadowRoot instanceof HTMLDocument ||
            Result.shadowRoot instanceof DocumentFragment
           )
        {
          var shadowRootDocument = Result.shadowRoot;
          Result = this.GetDocumentFocusedElement(shadowRootDocument);
        }
      }
      // if active element located in iframe/frame, we get frame element instead real one
      if (Result && 
          (Result.tagName.toUpperCase() === 'IFRAME' ||
           Result.tagName.toUpperCase() === 'FRAME'
          )
         )
      {
        var frameDocument = this.GetWindowDocument(Result);
        if (frameDocument)
          Result = this.GetDocumentFocusedElement(frameDocument);
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetDocumentFocusedElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // ExtractAllowedTopWindowFromEventDocument(ADocument, ACheckDocumentAllowed, AFailedString)
  ExtractAllowedTopWindowFromEventDocument: function (ADocument, ACheckDocumentAllowed, AFailedString)
  {
    try
    {
      // Skip event of unknown target!
      if (!ADocument)
      {
        if (AFailedString)
          AFailedString.value = 'Loaded unknown target';
        return null;
      }
      // Skip event of denied documents!
      if (ACheckDocumentAllowed && !this.AllowProcessDocument(ADocument))
      {
        if (AFailedString)
          AFailedString.value = 'Loaded disallowed document URL=<' + ADocument.URL + '>';
        return null;
      }
      // Skip event of child frames!
      var AWindow = ADocument.defaultView;
      if (!this.IsTopWindow(AWindow))
      {
        if (AFailedString)
          AFailedString.value = 'Loaded frame URL=<' + ADocument.URL + '>';
        return null;
      }

      return AWindow;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.ExtractAllowedTopWindowFromEventDocument() Error: ' + ErrorMessage);
    }
    return null;
  },

  // PrepareWindowElementRTIDs(AWindow)
  PrepareWindowElementRTIDs: function (AWindow, AElements)
  {
    var Result = '';
    if (AWindow && AElements)
    {
      // init RTIDContext
      var RTIDContext = new TspRTIDContext(AWindow);
      RTIDContext.UseRandomRTIDPrefix = true; // WARNING: Always use random prefix to prevent conflict between RTID generated by 2 cross-origin content scripts

      for (var i = 0, lenElements = AElements.length; i < lenElements; i++)
      {
        var element = AElements[i];
        var elementRTID = RTIDContext.GetElementRuntimeID(element);
        if (Result != '')
          Result += ',';
        Result += elementRTID;
      }
    }
    return Result;
  },

  // GetWindowVisibleInputElementRTIDs(AWindow)
  GetWindowVisibleInputElementRTIDs: function (AWindow)
  {
    var Result = '';
    if (AWindow)
    try
    {
      var elementsEnumerator = new TspWindowElementsEnumerator();
      var elements = elementsEnumerator.GetWindowElements(AWindow, this.GetInputEditableElementSelector());
      Result = this.PrepareWindowElementRTIDs(AWindow, elements);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetWindowVisibleInputElementRTIDs() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // GetWindowVisibleAuthElementRTIDs(AWindow)
  GetWindowVisibleAuthElementRTIDs: function (AWindow)
  {
    var Result = '';
    if (AWindow)
    try
    {
      var elementsEnumerator = new TspWindowElementsEnumerator();
      var elements = elementsEnumerator.GetWindowElements(AWindow, this.GetAuthElementSelector());
      Result = this.PrepareWindowElementRTIDs(AWindow, elements);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetWindowVisibleAuthElementRTIDs() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // GetWindowVisiblePasswordElementRTIDs(AWindow)
  GetWindowVisiblePasswordElementRTIDs: function (AWindow)
  {
    var Result = '';
    if (AWindow)
    try
    {
      var elementsEnumerator = new TspWindowElementsEnumerator();
      var elements = elementsEnumerator.GetWindowElements(AWindow, this.GetPasswordElementSelector());
      Result = this.PrepareWindowElementRTIDs(AWindow, elements);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.GetWindowVisiblePasswordElementRTIDs() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // HasWindowVisibleAuthElement(AWindow)
  HasWindowVisibleAuthElement: function (AWindow)
  {
    var Result = false;
    if (AWindow)
    try
    {
      var elementsEnumerator = new TspWindowElementsEnumerator();
      Result = elementsEnumerator.HasWindowElement(AWindow, this.GetAuthElementSelector());
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.HasWindowVisibleAuthElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // HasWindowVisiblePasswordElement(AWindow)
  HasWindowVisiblePasswordElement: function (AWindow)
  {
    var Result = false;
    if (AWindow)
    try
    {
      var elementsEnumerator = new TspWindowElementsEnumerator();
      Result = elementsEnumerator.HasWindowElement(AWindow, this.GetPasswordElementSelector());
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.HasWindowVisiblePasswordElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // HasWindowEditableElement()
  HasWindowEditableElement: function (AWindow, ACheckingInfo)
  {
    var Result = false;
    if (AWindow)
    try
    {
      if (!ACheckingInfo)
        ACheckingInfo = {};
      if (typeof ACheckingInfo.CheckAllChildDocuments == 'undefined')
        ACheckingInfo.CheckAllChildDocuments = false;

      var elementsEnumerator = new TspWindowElementsEnumerator();
      var enumInfo = {};
      enumInfo.EnumAllChildDocuments = ACheckingInfo.CheckAllChildDocuments;
      Result = elementsEnumerator.HasWindowElement(AWindow, this.GetEditableElementSelector(), enumInfo);
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.HasWindowEditableElement() Error: ' + ErrorMessage);
    }
    return Result;
  },

  // GetHTMLFormAction(AForm)
  GetHTMLFormAction: function (AForm)
  {
    var Result = '';
    if (AForm)
    {
      Result = AForm.action;
      if (typeof Result == 'string')
        return Result;
      // Form can contain child element with name "action" - use attribute for this case
      if (AForm.getAttribute)
        Result = AForm.getAttribute('action');
      else
        Result = '';
    }
    return Result;
  },

  // ClickElement()
  ClickElement: function (AHtmlElement)
  {
    if (AHtmlElement)
    try
    {
      if (typeof AHtmlElement.click == 'function')
        AHtmlElement.click(); 
      else
        return this.FireElementMouseEvent(AHtmlElement, 'click');
      return true;
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.ClickElement() Error: ' + ErrorMessage);
    }
    return false;
  },

  // FireElementEvent()
  FireElementEvent: function (AHtmlElement, AEventName)
  {
    if (AHtmlElement && AEventName)
    try
    {
      var event = AHtmlElement.ownerDocument.createEvent('HTMLEvents');
      if (event)
      {
        event.initEvent(AEventName, 
          true,  // canBubble
          true   // cancelable
        );
        AHtmlElement.dispatchEvent(event);
        return true;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.FireElementEvent() Error: ' + ErrorMessage);
    }
    return false;
  },
  
  // FireElementKeyEvent()
  FireElementKeyEvent: function (AHtmlElement, AEventName, AKeyCode)
  {
    if (AHtmlElement && AEventName)
    try
    {
      var event = AHtmlElement.ownerDocument.createEvent('KeyboardEvent');
      if (event)
      {
        if (event.initKeyEvent)
        {
          // Gecko declaration
          event.initKeyEvent(AEventName,
            true,       // canBubble
            true,       // cancelable
            AHtmlElement.ownerDocument.defaultView, // view
            false,      // ctrlKey
            false,      // altKey
            false,      // shiftKey
            false,      // metaKey
            AKeyCode,   // keyCode
            0           // charCode
          );
        }
        else if (event.initKeyboardEvent)
        {
          // DOM3 declaration
          event.initKeyboardEvent(AEventName,
            true,       // canBubble
            true,       // cancelable
            AHtmlElement.ownerDocument.defaultView, // view
            false,      // ctrlKey
            false,      // altKey
            false,      // shiftKey
            false,      // metaKey
            AKeyCode,   // keyCode
            0           // charCode
          );
        }
        else
        {
          spLog.logError('spHTMLTools.FireElementKeyEvent() can not init keyboard event!');
          return false;
        }
        AHtmlElement.dispatchEvent(event);
        return true;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.FireElementKeyEvent() Error: ' + ErrorMessage);
    }
    return false;
  },

  // FireElementMouseEvent()
  FireElementMouseEvent: function (AHtmlElement, AEventName)
  {
    if (AHtmlElement && AEventName)
    try
    {
      var event = AHtmlElement.ownerDocument.createEvent('MouseEvents');
      if (event)
      {
        event.initMouseEvent(AEventName, 
          true,  // canBubble
          true,  // cancelable
          AHtmlElement.ownerDocument.defaultView, // view
          1,     // mouse click count - i.e. once
          0,     // screenX
          0,     // screenY
          0,     // clientX
          0,     // clientY
          false, // ctrlKey
          false, // altKey
          false, // shiftKey
          false, // metaKey
          0,     // button
          null   // relatedTarget
        );
        AHtmlElement.dispatchEvent(event);
        return true;
      }
    }
    catch (ErrorMessage)
    {
      spLog.logError('spHTMLTools.FireElementMouseEvent() Error: ' + ErrorMessage);
    }
    return false;
  }
};



// TspWindowElementsEnumerator -------------------------------------------------

function TspWindowElementsEnumerator()
{
  this.Log = {
    // log modes
    Info: false
  };
  this._ResetEnum();
}

TspWindowElementsEnumerator.prototype._IsElementVisible = function(AElement, AParentVisible)
{
  // obtain element visibility
  return AParentVisible && spHTMLElementVisibleManager.isElementCompletelyVisible(AElement);
};

TspWindowElementsEnumerator.prototype._ResetEnum = function(AEnumInfo)
{
  this.ElementSelector = null;
  this.CancelEnum = false;
  this.EnumAllChildDocuments = true;

  if (AEnumInfo)
  {
    if (typeof AEnumInfo.EnumAllChildDocuments != 'undefined')
      this.EnumAllChildDocuments = AEnumInfo.EnumAllChildDocuments;
  }
};

TspWindowElementsEnumerator.prototype._EnumElements = function(ADocument, AParentElement, AParentVisible, AEnumCallback)
{
  if (!ADocument || !AParentElement || !AEnumCallback)
    return;

  try
  {
    var elements = AParentElement.querySelectorAll(this.ElementSelector);
    if (elements)
    {
      for (var i = 0, lenElements = elements.length; i < lenElements; i++)
      {
        var element = elements[i];
        var isElementVisible = this._IsElementVisible(element, AParentVisible);
        if (!isElementVisible)
          continue;
        AEnumCallback(element);
        if (this.CancelEnum)
          return;
      }
    }
    
    if (this.EnumAllChildDocuments)
    {
      var elements = AParentElement.querySelectorAll('iframe,frame');
      if (elements)
      {
        for (var i = 0, lenElements = elements.length; i < lenElements; i++)
        {
          var element = elements[i];
          var isElementVisible = this._IsElementVisible(element, AParentVisible);
          if (!isElementVisible)
            continue;
          this._EnumWindow(element, isElementVisible, AEnumCallback);
          if (this.CancelEnum)
            return;
        }
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspWindowElementsEnumerator._EnumElements() Error: ' + ErrorMessage);
  }
};

TspWindowElementsEnumerator.prototype._EnumWindow = function(AWindow, AParentVisible, AEnumCallback)
{
  if (!AWindow || !AEnumCallback)
    return;

  try
  {
    // enum children of window/frame/iframe
    var Document = spHTMLTools.GetWindowDocument(AWindow);
    if (Document)
    {
      if (Document.body)
      {
        // <body> tag
        this._EnumElements(Document, Document.body, AParentVisible, AEnumCallback);
      }
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspWindowElementsEnumerator._EnumWindow() Error: ' + ErrorMessage);
  }
};

TspWindowElementsEnumerator.prototype.GetWindowElements = function(AWindow, AElementSelector, AEnumInfo)
{
  if (!AElementSelector)
    throw 'TspWindowElementsEnumerator.GetWindowElements() AElementSelector is undefined!';

  var Result = new Array();
  if (AWindow)
  try
  {
    this._ResetEnum(AEnumInfo);
    this.ElementSelector = AElementSelector;
    this._EnumWindow(AWindow,
      true, // root window always visible
      function (AElement)
      {
        Result.push(AElement);
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspWindowElementsEnumerator.GetWindowElements() Error: ' + ErrorMessage);
  }
  return Result;
};

TspWindowElementsEnumerator.prototype.HasWindowElement = function(AWindow, AElementSelector, AEnumInfo)
{
  if (!AElementSelector)
    throw 'TspWindowElementsEnumerator.HasWindowElement() AElementSelector is undefined!';

  var Result = false;
  if (AWindow)
  try
  {
    var Self = this;
    this._ResetEnum(AEnumInfo);
    this.ElementSelector = AElementSelector;
    this._EnumWindow(AWindow,
      true, // root window always visible
      function (AElement)
      {
        Result = true;
        Self.CancelEnum = true;
      }
    );
  }
  catch (ErrorMessage)
  {
    spLog.logError('TspWindowElementsEnumerator.HasWindowElement() Error: ' + ErrorMessage);
  }
  return Result;
};



var spAutofillCore = (function() {

  // spAutofillCore public factory

  return {
    Tools: spTools,

    HTMLTools: spHTMLTools,

    HTMLElementVisibleManager: spHTMLElementVisibleManager,
    
    ContextButtonManager: spContextButtonManager,

    TspPageEventsMonitor: TspPageEventsMonitor,
	
    TspDOMChangesMonitor: TspDOMChangesMonitor,

    TspDOMXmlParser: TspDOMXmlParser,

    TspAutofillXmlParser: TspAutofillXmlParser,

    InputValueCacheManager: spInputValueCacheManager,

    CreateIncompleteDOMXmlParser: function()
    {
      return new TspIncompleteDOMXmlParser();
    },
    
    CreateCrossOriginDOMXmlParser: function()
    {
      return new TspCrossOriginDOMXmlParser();
    },
    
    CreateSensitiveDataDOMXmlParser: function(ADOMXmlParser)
    {
      return new TspSensitiveDataDOMXmlParser(ADOMXmlParser);
    },

    CreateSensitiveDataAutofillXmlParser: function(AAutofillXmlParser)
    {
      return new TspSensitiveDataAutofillXmlParser(AAutofillXmlParser);
    },

    CreateExportDOMManager: function()
    {
      return new TspExportDOMManager();
    },

    CreateCrossOriginAutofillXmlParser: function ()
    {
      return new TspCrossOriginAutofillXmlParser();
    },

    CreateAutofillManager: function()
    {
      return new TspAutofillManager();
    }
  }
})();

var __exports = {};
__exports.spAutofillCore = spAutofillCore;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spAutofillCore', __exports);

})();