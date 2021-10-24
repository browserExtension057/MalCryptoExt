
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Custom Host for WebBrowsers                                           }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;



// TspCustomHost ---------------------------------------------------------------

function TspCustomHost()
{
  this.Log = {
    // log modes
    Connect: false,
    Messages: false,
    ProtocolVersions: false
  };

  this.onProtocolOutdated = null;
  this.onNotInitialized = null;
  this.onInitialized = null;
  this.onGetTransportInfoParams = null;
  this.onConnectToTransportInfo = null;
  this.onMessage = null;

  this.ProtocolVersionType = {
    EAv2: 2,
    ELSv3: 3
  };
  this.ExtensionProtocolVersions = [
    this.ProtocolVersionType.EAv2,
    this.ProtocolVersionType.ELSv3
  ];
  this.CurrentProtocolVersion = 0;
  this.IsExtensionProtocolOutdate = false;
  this.IsHostProtocolOutdate = false;

  this.UnsentMessage = null;
  this.ConnectionStateType = {
    csDisconnected: 0,
    csInitializing: 1,
    csInitialized: 2
  };
  this.ConnectionState = this.ConnectionStateType.csDisconnected;
}

TspCustomHost.prototype.Connect = function()
{
  if (!this.firstTimeConnect)
  {
    this.firstTimeConnect = true;
    this.SetConnectionState(this.ConnectionStateType.csDisconnected);
  }
};

TspCustomHost.prototype.SetConnectionState = function (AState)
{
  var wasInitialized = this.ConnectionState == this.ConnectionStateType.csInitialized;
  this.ConnectionState = AState;
  // SP is installed - but current protocol could be incompatible!
  if (this.IsProtocolOutdated())
  {
    if (this.onProtocolOutdated)
      this.onProtocolOutdated();
  }
  else if (!this.IsInitialized())
  {
    this.destroyHost();
    this.UnsentMessage = null; // clear the unsent message variable
    if (this.onNotInitialized)
      this.onNotInitialized(wasInitialized);
  }
  else
  {
    // send the queued message to host after successful connection
    if (this.UnsentMessage)
    {
      if (this.Log.Connect)
        spLog.logMessage(this.constructor.name + '.SetConnectionState() Host is initialized, sending unsent message');
      var unsentMessage = this.UnsentMessage;
      this.UnsentMessage = null;
      this.PostMessageToInitializedHost(unsentMessage);
    }

    if (this.onInitialized)
      this.onInitialized();
  }
};

TspCustomHost.prototype.IsProtocolOutdated = function ()
{
  if (this.IsExtensionProtocolOutdate ||
      this.IsHostProtocolOutdate
     )
    return true;
  else
    return false;
};
  
TspCustomHost.prototype.CheckSupportedProtocolVersion = function (AHostProtocolVersions)
{
  var MaxExtensionVersion = 0;
  var MaxHostVersion = 0;
  try
  {
    this.CurrentProtocolVersion = 0;
    this.IsExtensionProtocolOutdate = false;
    this.IsHostProtocolOutdate = false;
    
    // obtain MaxExtensionVersion & CurrentProtocolVersion
    for (var i = 0; i < this.ExtensionProtocolVersions.length; i++)
    {
      var eVersion = this.ExtensionProtocolVersions[i];
      if (MaxExtensionVersion < eVersion)
        MaxExtensionVersion = eVersion;
      var j = AHostProtocolVersions.indexOf(eVersion);
      if (j != -1)
      {
        var hVersion = AHostProtocolVersions[j];
        if (hVersion)
        {
          if (this.CurrentProtocolVersion < hVersion)
            this.CurrentProtocolVersion = hVersion;
        }
      }
    }

    // obtain MaxHostVersion
    for (var i = 0; i < AHostProtocolVersions.length; i++)
    {
      var hVersion = AHostProtocolVersions[i];
      if (MaxHostVersion < hVersion)
        MaxHostVersion = hVersion;
    }

    if (MaxExtensionVersion < MaxHostVersion)
      this.IsExtensionProtocolOutdate = true;
    // extension is newer than host and no supported protocol obtained
    else if (MaxExtensionVersion > MaxHostVersion && !this.CurrentProtocolVersion)
      this.IsHostProtocolOutdate = true;
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.CheckSupportedProtocolVersion() Error: ' + ErrorMessage);
  }
  if (this.Log.ProtocolVersions)
  {
    spLog.logMessage(this.constructor.name + '.CheckSupportedProtocolVersion() ' +
      'ExtensionProtocolVersions: [' + this.ExtensionProtocolVersions + '] ' +
      'HostProtocolVersions: [' + AHostProtocolVersions + '] ' +
      'CurrentProtocolVersion: ' + this.CurrentProtocolVersion + ' ' +
      'MaxExtensionVersion: ' + MaxExtensionVersion + ' ' +
      'MaxHostVersion: ' + MaxHostVersion + ' ' +
      'IsExtensionProtocolOutdate: ' + this.IsExtensionProtocolOutdate + ' ' +
      'IsHostProtocolOutdate: ' + this.IsHostProtocolOutdate
    );
  }
};

TspCustomHost.prototype.Initialize = function ()
{
  // initialize the host
  try
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.Initialize() Try to initialize the host');

    var message = {};
    message.Action = 'Initialize';
    message.CurrentProtocolVersion = this.CurrentProtocolVersion;
    if (this.PostMessage(message))
      this.SetConnectionState(this.ConnectionStateType.csInitialized);
    else
      spLog.logError(this.constructor.name + '.Initialize() Error sending Initialize message to the host');
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Initialize() Error: ' + ErrorMessage);
  }
};

TspCustomHost.prototype.IsInitialized = function ()
{
  return this.ConnectionState == this.ConnectionStateType.csInitialized && 
         this.IsAvailable();
};

TspCustomHost.prototype.hstOnDisconnected = function (ErrorMessage)
{
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.hstOnDisconnected() Disconnected from host: ' + ErrorMessage);
  this.SetConnectionState(this.ConnectionStateType.csDisconnected);
};

TspCustomHost.prototype.hstOnMessage = function (message)
{
  if (message)
  try
  {
    if (this.Log.Messages)
      spLog.logMessage(this.constructor.name + '.hstOnMessage() Received message from host: ' + JSON.stringify(message));

    if (message.Action == 'Initialize')
      this.hstInitialize(message);

    else if (message.Action == 'ConnectToTransportSocketInfo')
      this.hstConnectToTransportInfo(message);
      
    else if (this.onMessage)
      this.onMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.hstOnMessage() Action: "' + message.Action + '" Error: ' + ErrorMessage);
  }
};

TspCustomHost.prototype.hstInitialize = function (message)
{
  if (!message)
    return;
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.hstInitialize() Initializing host');

  this.CheckSupportedProtocolVersion(message.HostProtocolVersions);

  if (this.IsProtocolOutdated())
  {
    // protocol could not be used
    this.SetConnectionState(this.ConnectionStateType.csDisconnected);
  }
  else
  {
    // protocol supported, proceed the connection to host
    this.ConnectionState = this.ConnectionStateType.csInitializing;
    this.Initialize();
  }
};

TspCustomHost.prototype.hstConnectToTransportInfo = function (message)
{
  if (!message)
    return;
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.hstConnectToTransportInfo() Got Transport Info message');
  if (this.onConnectToTransportInfo)
    this.onConnectToTransportInfo(message);
};

TspCustomHost.prototype.GetTransportInfo = function ()
{
  if (!this.onGetTransportInfoParams)
    throw this.constructor.name + '.GetTransportInfo() Event onGetTransportInfoParams is undefined!';
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.GetTransportInfo() Try to get transport info');

  // query transport info from host
  var message = {};
  message.Action = 'GetTransportSocketInfo';
  this.onGetTransportInfoParams(message, function () {
    this.PostMessageToInitializedHost(message);
  }.bind(this));
};

TspCustomHost.prototype.UpdateHost = function ()
{
  var message = {};
  message.Action = 'UpdateHost';
  this.PostMessage(message);
};

TspCustomHost.prototype.LaunchPasswordManager = function ()
{
  var message = {};
  message.Action = 'LaunchPasswordManager';
  this.PostMessageToInitializedHost(message, 
    true // allowReconnectHost
  );
};

TspCustomHost.prototype.PostMessage = function (message)
{
  var hostAvailable = this.IsAvailable();
  if (message)
  try
  {
    if (hostAvailable)
    {
      if (this.Log.Messages)
        spLog.logMessage(this.constructor.name + '.PostMessage() Sending message to Host: ' + JSON.stringify(message));

      this.postMessage(message);
      return true;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.PostMessage() Error: ' + ErrorMessage);
  }

  if (this.Log.Messages)
    spLog.logMessage(this.constructor.name + '.PostMessage() Message has not been sent to Host: ' + JSON.stringify(message) + '. Host available: ' + hostAvailable);
  return false;
};

TspCustomHost.prototype.PostMessageToInitializedHost = function (message, allowReconnectHost)
{
  if (message)
  try
  {
    if (this.IsInitialized())
      this.PostMessage(message);
    else if (allowReconnectHost)
    {
      // reconnect the host and send the message after connection
      this.UnsentMessage = message;
      this.Connect();
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.PostMessageToInitializedHost() Error: ' + ErrorMessage);
  }
};



const spCustomHost = {
  TspCustomHost: TspCustomHost
};

var __exports = {};
__exports.spCustomHost = spCustomHost;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spCustomHost', __exports);

})();