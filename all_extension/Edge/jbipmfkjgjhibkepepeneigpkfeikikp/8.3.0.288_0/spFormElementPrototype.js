(function() {

var spFormElementPrototype =
{
  GetHTMLFormElementPrototype: function()
  {
    try
    {
      var sp_old_HTMLFormElementPrototype_submit = HTMLFormElement.prototype.submit;
      HTMLFormElement.prototype.submit = function(AEvent)
      {
        try
        {
          var spEvent = document.createEvent('Event');
          spEvent.initEvent('sp_submit', true, true);
          this.dispatchEvent(spEvent);
        }
        catch(ErrorMessage)
        {
          console.error('spFormElementPrototype() Error sending "sp_submit" event from HTMLFormElement.prototype.submit: ' + ErrorMessage);
        }
        sp_old_HTMLFormElementPrototype_submit.apply(this);
      };
    }
    catch(ErrorMessage)
    {
      console.error('spFormElementPrototype() Error attaching to HTMLFormElement.prototype.submit: ' + ErrorMessage);
    }

    try
    {
      if (typeof __doPostBack == 'function')
      {
        var sp_old__doPostBack = __doPostBack;
        __doPostBack = function(eventTarget, eventArgument)
        {
          try
          {
            var spEvent = document.createEvent('Event');
            spEvent.initEvent('sp_submit', true, true);
            window.dispatchEvent(spEvent);
          }
          catch(ErrorMessage)
          {
            console.error('spFormElementPrototype() Error sending "sp_submit" event from __doPostBack(): ' + ErrorMessage);
          }
          sp_old__doPostBack(eventTarget, eventArgument);
        };      
      }
    }
    catch(ErrorMessage)
    {
      console.error('spFormElementPrototype() Error attaching to __doPostBack(): ' + ErrorMessage);
    }
  }
};

if (typeof exports !== 'undefined')
  exports.spFormElementPrototype = spFormElementPrototype;
else
{
  var __exports = {};
  __exports.spFormElementPrototype = spFormElementPrototype;
  spDefine('spFormElementPrototype', __exports);
}

})();