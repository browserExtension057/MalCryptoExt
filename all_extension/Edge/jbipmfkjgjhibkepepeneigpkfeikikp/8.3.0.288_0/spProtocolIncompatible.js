// TspProtocolIncompatibleView -------------------------------------------------

function TspProtocolIncompatibleView()
{
  // empty
}

TspProtocolIncompatibleView.prototype =
{
  Initialize: function(AProtocolOutdateInfo)
  {
    if (!AProtocolOutdateInfo)
      return;

    if (AProtocolOutdateInfo.IsExtensionProtocolOutdate)
    {
      // Extension is outdate
      
      //   localize controls
      try
      {
        document.getElementById('ProtocolIncompatibleNotify').innerHTML = chrome.i18n.getMessage('ExtensionOutdateNotify');
        this.btnUpdate().value = chrome.i18n.getMessage('UpdateExtension');
      }
      catch (e)
      {
        // keep silence
      }

      //   attach to controls events
      var btn = this.btnUpdate();
      btn.addEventListener('click', function (AEvent) {
        spProtocolIncompatibleView.btnUpdateExtensionClick();
      });
      btn.focus(); // set focus to 'Update' button
    }
    
    else if (AProtocolOutdateInfo.IsHostProtocolOutdate)
    {
      // SP is outdate
      
      //   localize controls
      try
      {
        document.getElementById('ProtocolIncompatibleNotify').innerHTML = chrome.i18n.getMessage('HostOutdateNotify');
        this.btnUpdate().value = chrome.i18n.getMessage('UpdateHost');
      }
      catch (e)
      {
        // keep silence
      }
      
      //   attach to controls events
      var btn = this.btnUpdate();
      btn.addEventListener('click', function (AEvent) {
        spProtocolIncompatibleView.btnUpdateHostClick();
      });
      btn.focus(); // set focus to 'Update' button
    }
  },
  
  btnUpdate: function()
  {
    return document.getElementById('btnUpdate');
  },
  
  SetUpdateStatus: function(ARStrStatus)
  {
    document.getElementById('lblUpdateStatus').innerHTML = chrome.i18n.getMessage(ARStrStatus);
  },
  
  btnUpdateExtensionClick: function()
  {
    this.btnUpdate().style.display = 'none'; // hide 'Update' button
    this.SetUpdateStatus('SearchingForUpdate');
    chrome.runtime.requestUpdateCheck(
      function(status, details)
      {
        if (status == 'update_found')
          spProtocolIncompatibleView.SetUpdateStatus('UpdatePending');
        else
          spProtocolIncompatibleView.SetUpdateStatus('NoUpdatesFound');
      }
    );
  },
  
  btnUpdateHostClick: function()
  {
    this.btnUpdate().style.display = 'none'; // hide 'Update' button
    this.SetUpdateStatus('UpdatingHost');
    // send message to BG to update the host
    var message = {};
    message.Action = 'UpdateHost';
    chrome.runtime.sendMessage(message);
  }
}

var spProtocolIncompatibleView = new TspProtocolIncompatibleView();

chrome.runtime.onUpdateAvailable.addListener(
  function(details)
  {
    // reload the updated extension completely!
    chrome.runtime.reload();
  }
);
    
document.addEventListener('DOMContentLoaded', function () {
  var message = {};
  message.Action = 'GetProtocolOutdateInfo';
  chrome.runtime.sendMessage(message,
    function (AProtocolOutdateInfo)
    {
      spProtocolIncompatibleView.Initialize(AProtocolOutdateInfo);
    }
  );
});