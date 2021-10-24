
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Transport Protocol for WebBrowsers                                    }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;
var spAutofillCore = spRequire('spAutofillCore').spAutofillCore;
var spTransport = spRequire('spTransport').spTransport;



// TspTransportProtocol --------------------------------------------------------

const tpsDisconnected = 0;
const tpsIdentifying = 1;
const tpsKeyExchanging = 2;
const tpsKeyExchanged = 3;
const tpsAccessingBrowserStorage = 4;
const tpsAuthenticating = 5;
const tpsAuthenticated = 6;

const tsClientProtocolId = '{A8709F29-A861-413C-A944-0D962FCE403C}';
const tsServerProtocolId = '{BC526504-C053-4B05-A11B-B4C4FDE77E99}';

function TspTransportProtocol()
{
  this.Log = {
    // log modes
    Info: false,
    Connect: false,
    Messages: false
  };

  this.MiniguiPopupTransport = null;
  this.MiniguiProtocol = null;
  this.Host = null;
  this.ExtensionStorage = null;
  this.Transport = null;
  this.ProtocolHandler = null;
  this.ProtocolState = tpsDisconnected;
  this.ProtocolValidationTimerID = 0;
  this.ConnectionAttempt = 0;
  this.UnsentMessage = null;

  this.onChangeProtocolState = null;
  this.onDisconnect = null;
  this.onMessage = null;
  this.onGetActiveWindowInfo = null;
  this.onMiniguiLoad = null;
}

TspTransportProtocol.prototype.Start = function ()
{
  if (!this.MiniguiPopupTransport)
    throw this.constructor.name + '.Start() MiniguiPopupTransport is undefined!';
  if (!this.Host)
    throw this.constructor.name + '.Start() Host is undefined!';
  if (!this.ExtensionStorage)
    throw this.constructor.name + '.Start() ExtensionStorage is undefined!';
  if (!this.onMessage)
    throw this.constructor.name + '.Start() Event onMessage is undefined!';
  if (!this.onGetActiveWindowInfo)
    throw this.constructor.name + '.Start() Event onGetActiveWindowInfo is undefined!';
  if (!this.onMiniguiLoad)
    throw this.constructor.name + '.Start() Event onMiniguiLoad is undefined!';

  this.MiniguiPopupTransport.onMessage = this.mgOnMessage.bind(this);  
  this.MiniguiPopupTransport.Connect();

  this.oldHostOnNotInitialized = this.Host.onNotInitialized;
  this.oldHostOnInitialized = this.Host.onInitialized;

  this.Host.onNotInitialized = this.hstOnNotInitialized.bind(this);
  this.Host.onInitialized = this.hstOnInitialized.bind(this);
  this.Host.onGetTransportInfoParams = this.hstOnGetTransportInfoParams.bind(this);
  this.Host.onConnectToTransportInfo = this.hstOnConnectToTransportInfo.bind(this);
  this.Host.Connect();
};

TspTransportProtocol.prototype.IsAvailable = function ()
{
  return this.Transport && this.Transport.IsAvailable();
};

TspTransportProtocol.prototype.IsConnected = function ()
{
  return this.ProtocolState != tpsDisconnected &&
         this.IsAvailable();
};

TspTransportProtocol.prototype.IsGuestAuthenticating = function ()
{
  return this.IsAvailable() &&
         this.ProtocolHandler &&
         this.ProtocolHandler.IsGuestAuthenticating();
};

TspTransportProtocol.prototype.IsAuthenticated = function ()
{
  return this.ProtocolState == tpsAuthenticated &&
         this.IsAvailable();
};

TspTransportProtocol.prototype.AttachToTransportEvents = function ()
{
  if (!this.Transport)
    return;

  this.Transport.onConnect = this.tsOnConnect.bind(this);
  this.Transport.onDisconnect = this.tsOnDisconnect.bind(this);
  this.Transport.onMessage = this.tsOnMessage.bind(this);
};

TspTransportProtocol.prototype.DetachFromTransportEvents = function ()
{
  if (!this.Transport)
    return;

  this.Transport.onConnect = null;
  this.Transport.onDisconnect = null;
  this.Transport.onMessage = null;
};

TspTransportProtocol.prototype.GenerateClientId = function ()
{
  function _GeneratePart(MaxValue)
  {
    var Result = Math.floor((Math.random() * (MaxValue-1)) + 1);
    Result = Result.toString(16);
    return Result;
  }
  
  var Result = 
    '{' +
    _GeneratePart(4294967295) + '-' +
    _GeneratePart(65535) + '-' +
    _GeneratePart(65535) + '-' +
    _GeneratePart(65535) + '-' +
    _GeneratePart(4294967295) + _GeneratePart(65535) +
    '}'
  ;  
  return Result
};

TspTransportProtocol.prototype.GetClientId = function (AResultCallback)
{
  if (!AResultCallback)
    return;

  this.ExtensionStorage.get('ClientId', function (AClientId) {
    if (typeof AClientId == 'undefined')
    {
      AClientId = this.GenerateClientId();
      this.ExtensionStorage.set('ClientId', AClientId);
    }
    AResultCallback(AClientId);
  }.bind(this));
};

TspTransportProtocol.prototype.GetAccessKey = function (AResultCallback)
{
  if (!AResultCallback)
    return;

  this.ExtensionStorage.get('AccessKey', function (AAccessKey) {
    AResultCallback(AAccessKey);
  });
};

TspTransportProtocol.prototype.SetAccessKey = function (AAccessKey)
{
  this.ExtensionStorage.set('AccessKey', AAccessKey);
};

TspTransportProtocol.prototype.RemoveAccessKey = function ()
{
  this.ExtensionStorage.remove('AccessKey');
};

TspTransportProtocol.prototype.GetEncryptedAccessKey = function (AResultCallback)
{
  if (!AResultCallback)
    return;

  this.ExtensionStorage.get('eAccessKey', function (AAccessKey) {
    AResultCallback(AAccessKey);
  });
};
  
TspTransportProtocol.prototype.SetEncryptedAccessKey = function (AAccessKey)
{
  this.ExtensionStorage.set('eAccessKey', AAccessKey);
};

TspTransportProtocol.prototype.ConnectMinigui = function ()
{
  if (!this.IsAuthenticated())
    throw this.constructor.name + '.ConnectMinigui() Protocol is not authenticated!';
  if (!this.ProtocolHandler)
    throw this.constructor.name + '.ConnectMinigui() ProtocolHandler is undefined!';

  this.MiniguiProtocol = this.ProtocolHandler.CreateMiniguiProtocol();
  this.MiniguiProtocol.Connect();
};

TspTransportProtocol.prototype.DisconnectMinigui = function ()
{
  if (this.MiniguiProtocol)
  {
    this.MiniguiProtocol.Disconnect();
    delete this.MiniguiProtocol;
  }
};

TspTransportProtocol.prototype.PostMiniguiMessage = function (message)
{
  if (message)
    this.MiniguiPopupTransport.PostMessage(message);
};

TspTransportProtocol.prototype.mgOnMessage = function (message)
{
  if (!message)
    return;
  if (this.Log.Messages)
    spLog.logMessage(this.constructor.name + '.mgOnMessage() Received Minigui message: ' + JSON.stringify(message));

  switch (message.Action)
  {
    case 'onMiniguiLoad':
      this.ConnectMinigui();
      if (this.onMiniguiLoad)
        this.onMiniguiLoad();
      break;
      
    case 'onMiniguiUnload':
      this.DisconnectMinigui();
      break;
      
    default:
      if (this.MiniguiProtocol)
        this.MiniguiProtocol.mgOnMessage(message);
  }
};

TspTransportProtocol.prototype.hstOnNotInitialized = function (wasInitialized)
{
  if (this.oldHostOnNotInitialized)
    this.oldHostOnNotInitialized(wasInitialized);

  this.DisconnectFromTransport(); // if we lost the connection to host - than disconnect from transport also
};

TspTransportProtocol.prototype.hstOnInitialized = function ()
{
  if (this.oldHostOnInitialized)
    this.oldHostOnInitialized();

  this.CreateProtocolHandler(function () {
    this.ConnectToTransport();
  }.bind(this));
};

TspTransportProtocol.prototype.hstOnGetTransportInfoParams = function (message, AResultCallback)
{
  this.ProtocolHandler.GetTransportInfoParams(message, AResultCallback);
};

TspTransportProtocol.prototype.hstOnConnectToTransportInfo = function (message)
{
  if (!message)
    throw this.constructor.name + '.hstOnConnectToTransportInfo() message is undefined!';

  // !! >> Safari Companion support. TODO: Remove this code and implement messages index for Safari Companion.
  // WARNING: First process the postpone param, then check for other params specified!
  if (message.PostponeConnection)
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.hstOnConnectToTransportInfo() Host postponed the connection...');    
    // error connecting, schedule next connection
    this.ScheduleConnectToTransport();
    return;
  }
  // ?? <<

  this.Transport = this.ProtocolHandler.CreateTransport(message);
  if (!this.Transport)
  {
    this.ScheduleConnectToTransport();
    return;
  }

  this.AttachToTransportEvents();
  this.ProtocolHandler.ConnectToTransportInfo(message);
};

TspTransportProtocol.prototype.ResetConnectionAttempts = function ()
{
  // reset the attempts to speedup the connection
  this.ConnectionAttempt = 0;
};

TspTransportProtocol.prototype.ConnectToTransportInfo = function (AConnectionInfo)
{
  this.ConnectionAttempt += 1;
  if (this.Transport.IsConnectionInfoValid(AConnectionInfo))
  try
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.ConnectToTransportInfo() Trying to connect to ' + 
        this.Transport.ConnectionInfoToLogMessage(AConnectionInfo) + ', attempt #' + this.ConnectionAttempt + '...');
    if (this.Transport.Connect(AConnectionInfo))
      return; // successfully started the connection
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ConnectToTransportInfo() Error: ' + ErrorMessage);
  }
  else
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.ConnectToTransportInfo() Transport info is not valid');
  }

  // error starting the connection, schedule next connection
  this.ScheduleConnectToTransport();
};

TspTransportProtocol.prototype.SetProtocolState = function(AState)
{
  this.ProtocolState = AState;
  if (this.onChangeProtocolState)
    this.onChangeProtocolState();

  if (this.IsAuthenticated())
  {
    // send the queued message to transport after successful authenticattion
    if (this.UnsentMessage)
    {
      if (this.Log.Connect)
        spLog.logMessage(this.constructor.name + '.SetProtocolState() Host is initialized, sending unsent message');
      var unsentMessage = this.UnsentMessage;
      this.UnsentMessage = null;
      this.PostMessage(unsentMessage);
    }
  }
};

TspTransportProtocol.prototype.ConnectToTransport = function()
{
  // !! >> OSX: is it necessary?
  if (this.IsConnected())
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.ConnectToTransport() Transport is already connected!');
    return;
  }
  // ?? <<

  this.Host.GetTransportInfo();
};

TspTransportProtocol.prototype.CreateProtocolHandler = function (AResultCallback)
{
  if (!AResultCallback)
    throw this.constructor.name + '.CreateProtocolHandler() ResultCallback is undefined!';

  this.DestroyProtocolHandler();

  if (this.Host.CurrentProtocolVersion == this.Host.ProtocolVersionType.ELSv3)
    this.ProtocolHandler = new TspELSv3TransportProtocolHandler();
  else if (this.Host.CurrentProtocolVersion == this.Host.ProtocolVersionType.EAv2)
    this.ProtocolHandler = new TspEAv2TransportProtocolHandler();
  else
    throw this.constructor.name + '.CreateProtocolHandler() unsupported protocol version: ' + this.Host.CurrentProtocolVersion + '!';

  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.CreateProtocolHandler() Initialize protocol handler ' + this.ProtocolHandler.constructor.name);
  this.ProtocolHandler.Initialize(this, AResultCallback);
};

TspTransportProtocol.prototype.DestroyProtocolHandler = function ()
{
  if (this.ProtocolHandler)
  {
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.DestroyProtocolHandler() Finalize protocol handler ' + this.ProtocolHandler.constructor.name);
    this.ProtocolHandler.Finalize();
    delete this.ProtocolHandler;
  }
};

TspTransportProtocol.prototype.ScheduleConnectToTransport = function ()
{
  var timeout = this.ConnectionAttempt < 30 ? 1000 : 5000;
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.ScheduleConnectToTransport() Scheduling the transport connection in ' + timeout + ' msecs...');
  setTimeout(this.ConnectToTransport.bind(this), timeout);
};

TspTransportProtocol.prototype.DisconnectFromTransport = function ()
{
  if (this.Transport)
    this.Transport.Disconnect();
};

TspTransportProtocol.prototype.PostMessage = function (message, allowReconnectTransport)
{
  if (message)
  {
    if (this.IsConnected())
    {
      if (this.Log.Messages)
        spLog.logMessage(this.constructor.name + '.PostMessage() Sending transport message: ' + JSON.stringify(message));

      if (this.ProtocolHandler)
        this.ProtocolHandler.BeforePostMessage(message);
      this.Transport.PostMessage(message);
    }
    else if (allowReconnectTransport)
      this.UnsentMessage = message; // keep the message until we connected
  }
};

TspTransportProtocol.prototype.AllowProtectSensitiveData = function ()
{
  if (this.ProtocolHandler)
    return this.ProtocolHandler.AllowProtectSensitiveData();
  else
    return false;
};

TspTransportProtocol.prototype.EncryptSensitiveData = function (APlainData, AEncryptedData)
{
  if (APlainData)
  try
  {
    if (!AEncryptedData)
      throw this.constructor.name + '.EncryptSensitiveData() AEncryptedData is undefined!';
    if (this.AllowProtectSensitiveData())
      return this.ProtocolHandler.EncryptSensitiveData(APlainData, AEncryptedData);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.EncryptSensitiveData() Error: ' + ErrorMessage);
  }
  return false;
};

TspTransportProtocol.prototype.DecryptSensitiveData = function (AEncryptedData, APlainData)
{
  if (AEncryptedData)
  try
  {
    if (!APlainData)
      throw this.constructor.name + '.DecryptSensitiveData() APlainData is undefined!';
    if (this.AllowProtectSensitiveData())
      return this.ProtocolHandler.DecryptSensitiveData(AEncryptedData, APlainData);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.DecryptSensitiveData() Error: ' + ErrorMessage);
  }
  return false;
};

TspTransportProtocol.prototype.ProtocolValidationFailed = function ()
{
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.ProtocolValidationFailed() Timeout occured');
  this.ProtocolValidationTimerID = 0;
  this.DisconnectFromTransport();
};

TspTransportProtocol.prototype.StartProtocolValidationTimer = function ()
{
  if (!this.ProtocolValidationTimerID)
  {
    this.ProtocolValidationTimerID = setTimeout(this.ProtocolValidationFailed.bind(this), 10000);
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.StartProtocolValidationTimer() Timer started');
  }
};

TspTransportProtocol.prototype.StopProtocolValidationTimer = function ()
{
  if (this.ProtocolValidationTimerID)
  {
    clearTimeout(this.ProtocolValidationTimerID);
    this.ProtocolValidationTimerID = 0;
    if (this.Log.Connect)
      spLog.logMessage(this.constructor.name + '.StopProtocolValidationTimer() Timer stopped');
  }
};

TspTransportProtocol.prototype.tsOnConnect = function ()
{
  if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.tsOnConnect() Connected to transport');
  this.ResetConnectionAttempts(); // reset the attempts to speedup the connection next time
  this.StartProtocolValidationTimer();
  this.ProtocolHandler.tsOnConnect();
};

TspTransportProtocol.prototype.tsOnDisconnect = function (IsError, Message)
{
  if (IsError)
    spLog.logError(this.constructor.name + '.tsOnDisconnect() Disconnected from transport. ' + Message);
  else if (this.Log.Connect)
    spLog.logMessage(this.constructor.name + '.tsOnDisconnect() Disconnected from transport. ' + Message);

  this.ProtocolHandler.tsOnDisconnect();
  this.UnsentMessage = null;
  this.SetProtocolState(tpsDisconnected);
  this.DetachFromTransportEvents();
  delete this.Transport;
  this.DisconnectMinigui();
  this.StopProtocolValidationTimer();
  this.ScheduleConnectToTransport(); // connection has been closed, schedule next connection
  if (this.onDisconnect)
    this.onDisconnect();
};

TspTransportProtocol.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    if (!this.ProtocolHandler.BeforeProcessMessage(message))
      return;

    if (this.Log.Messages)
      spLog.logMessage(this.constructor.name + '.tsOnMessage() Received transport message: ' + JSON.stringify(message));

    this.ProtocolHandler.tsOnMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};



// TspMiniguiTransportProtocol -------------------------------------------------

function TspMiniguiTransportProtocol(AProtocol, ATransport, AConnectionInfo, AClientInfo)
{
  if (!AProtocol)
    throw this.constructor.name + '() AProtocol is undefined!';
  if (!ATransport)
    throw this.constructor.name + '() ATransport is undefined!';
  if (!AConnectionInfo)
    throw this.constructor.name + '() AConnectionInfo is undefined!';
  if (!AClientInfo)
    throw this.constructor.name + '() AClientInfo is undefined!';

  this.Protocol = AProtocol;
  this.Transport = ATransport;
  this.ConnectionInfo = AConnectionInfo;
  this.ClientInfo = AClientInfo;
}

TspMiniguiTransportProtocol.prototype.Connect = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.Connect() Trying to connect to ' +
      this.Transport.ConnectionInfoToLogMessage(this.ConnectionInfo) + ' transport');

  this.AttachToTransportEvents();

  // append selected tab & window info to allow find the web browser window
  this.ClientInfo.WindowInfo = {};
  this.Protocol.onGetActiveWindowInfo(this.ClientInfo.WindowInfo, function () {
    this.Transport.Connect(this.ConnectionInfo);
  }.bind(this));
};

TspMiniguiTransportProtocol.prototype.Disconnect = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.Disconnect() Disconnecting from transport');

  this.DetachFromTransportEvents();
  this.Transport.Disconnect();
  delete this.Transport;
  delete this.ConnectionInfo;
  delete this.ClientInfo;
  this.Protocol = null;
};

TspMiniguiTransportProtocol.prototype.mgOnMessage = function (message)
{
  if (message)
  try
  {
    this.Transport.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.mgOnMessage() Error: ' + ErrorMessage);
  }
};

TspMiniguiTransportProtocol.prototype.AttachToTransportEvents = function ()
{
  if (!this.Transport)
    return;

  this.Transport.onConnect = this.tsOnConnect.bind(this);
  this.Transport.onDisconnect = this.tsOnDisconnect.bind(this);
  this.Transport.onMessage = this.tsOnMessage.bind(this);
};

TspMiniguiTransportProtocol.prototype.DetachFromTransportEvents = function ()
{
  if (!this.Transport)
    return;

  this.Transport.onConnect = null;
  this.Transport.onDisconnect = null;
  this.Transport.onMessage = null;
};

TspMiniguiTransportProtocol.prototype.tsOnConnect = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.tsOnConnect() Connected to transport');

  var message = {};
  message.type = 'AuthenticateMinigui';
  message.params = {};
  message.params.ClientInfo = this.ClientInfo;
  this.Transport.PostMessage(message);
};

TspMiniguiTransportProtocol.prototype.tsOnDisconnect = function (IsError, Message)
{
  if (IsError)
    spLog.logError(this.constructor.name + '.tsOnDisconnect() Disconnected from transport. ' + Message);
  else if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.tsOnDisconnect() Disconnected from transport. ' + Message);
};

TspMiniguiTransportProtocol.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    if (this.Protocol.Log.Messages)
      spLog.logMessage(this.constructor.name + '.tsOnMessage() Received transport message: ' + JSON.stringify(message));

    // append ClientInfo
    if (message.type == 'MiniguiAuthenticated')
    {
      message.params.ClientInfo = {
        ClientName: this.ClientInfo.ClientName,
        WindowInfo: {
          WindowTabTitle: this.ClientInfo.WindowInfo.WindowTabTitle || '',
          WindowTabUrl: this.ClientInfo.WindowInfo.WindowTabUrl || ''
        }
      };
    }

    this.Protocol.PostMiniguiMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};



// TspEAv2TransportProtocolHandler ---------------------------------------------

function TspEAv2TransportProtocolHandler()
{
  this.Protocol = null;
  this.ProtocolInfo = null;
}

TspEAv2TransportProtocolHandler.prototype.Initialize = function (Protocol, AResultCallback)
{
  if (!Protocol)
    throw this.constructor.name + '.Initialize() Protocol is undefined!';
  if (!AResultCallback)
    throw this.constructor.name + '.Initialize() ResultCallback is undefined!';

  this.Protocol = Protocol;
  this.ProtocolInfo = {};
  this.Protocol.GetClientId(function (AClientId) {
    this.ProtocolInfo.ClientId = AClientId;

    AResultCallback();
  }.bind(this));
};

TspEAv2TransportProtocolHandler.prototype.Finalize = function ()
{
  delete this.ProtocolInfo;
  delete this.Protocol;
};

TspEAv2TransportProtocolHandler.prototype.CreateMiniguiProtocol = function ()
{
  var Transport = spTransport.CreateWebSocketTransport();

  var ConnectionInfo = {};
  ConnectionInfo.Port = this.ProtocolInfo.Port;
  ConnectionInfo.Protocol = 'StickyWsAPI';

  return new TspMiniguiTransportProtocol(this.Protocol, Transport, ConnectionInfo, this.ProtocolInfo.ClientInfo);
};

TspEAv2TransportProtocolHandler.prototype.GetTransportInfoParams = function (message, AResultCallback)
{
  if (!message)
    throw this.constructor.name + '.GetTransportInfoParams() message is undefined!';
  if (!AResultCallback)
    throw this.constructor.name + '.GetTransportInfoParams() AResultCallback is undefined!';

  message.ClientName = spAutofillCore.Tools.GetBrowserClientName();

  AResultCallback();
};
  
TspEAv2TransportProtocolHandler.prototype.CreateTransport = function (ConnectionInfo)
{
  if (!ConnectionInfo)
    throw this.constructor.name + '.CreateTransport() ConnectionInfo is undefined!';

  return spTransport.CreateWebSocketTransport();
};

TspEAv2TransportProtocolHandler.prototype.ConnectToTransportInfo = function (ConnectionInfo)
{
  if (!ConnectionInfo)
    throw this.constructor.name + '.ConnectToTransportInfo() ConnectionInfo is undefined!';
  if (!ConnectionInfo.ClientInfo)
    throw this.constructor.name + '.ConnectToTransportInfo() ConnectionInfo.ClientInfo is undefined!';

  this.ProtocolInfo.ClientInfo = ConnectionInfo.ClientInfo;
  this.ProtocolInfo.ClientInfo.ClientId = this.ProtocolInfo.ClientId;
  this.ProtocolInfo.Port = ConnectionInfo.Port; // store the port to return it later to minigui
  this.ProtocolInfo.UserName = ConnectionInfo.UserName;

  this.Protocol.ConnectToTransportInfo(ConnectionInfo);
};

TspEAv2TransportProtocolHandler.prototype.AllowProtectSensitiveData = function ()
{
  return false;
};

TspEAv2TransportProtocolHandler.prototype.EncryptSensitiveData = function (APlainData, AEncryptedData)
{
  return false;
};

TspEAv2TransportProtocolHandler.prototype.DecryptSensitiveData = function (AEncryptedData, APlainData)
{
  return false;
};

TspEAv2TransportProtocolHandler.prototype.BeforeProcessMessage = function (message)
{
  return true;
};

TspEAv2TransportProtocolHandler.prototype.BeforePostMessage = function (message)
{
  // empty
};

TspEAv2TransportProtocolHandler.prototype.IsGuestAuthenticating = function ()
{
  return false;
};

TspEAv2TransportProtocolHandler.prototype.tsOnConnect = function ()
{
  this.IdentifyClient();
};

TspEAv2TransportProtocolHandler.prototype.tsOnDisconnect = function ()
{
  var Protocol = this.Protocol;
  this.Finalize();
  this.Initialize(Protocol, function() {});
};

TspEAv2TransportProtocolHandler.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    switch (this.Protocol.ProtocolState)
    {
      case tpsIdentifying:
        if (message.Action == 'IdentifyServer')
          this.tsIdentifyServer(message);
        break;

      case tpsAuthenticating:
        if (message.Action == 'ClientAuthenticated')
          this.tsClientAuthenticated(message);
        break;

      case tpsAuthenticated:
        this.Protocol.onMessage(message);
        break;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};

TspEAv2TransportProtocolHandler.prototype.IdentifyClient = function ()
{
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.IdentifyClient() ' +
        'Identifying client. ' +
        'ClientProtocolId: <' + tsClientProtocolId + '>, ' +
        'ClientName: <' + this.ProtocolInfo.ClientInfo.ClientName + '>, ' +
        'UserName: <' + this.ProtocolInfo.UserName + '>'
      );
    this.Protocol.SetProtocolState(tpsIdentifying);

    var message = {};
    message.Action = 'IdentifyClient';
    message.ClientProtocolId = tsClientProtocolId;
    message.ClientName = this.ProtocolInfo.ClientInfo.ClientName;
    message.UserName = this.ProtocolInfo.UserName;
    this.Protocol.PostMessage(message);  
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.IdentifyClient() Error: ' + ErrorMessage);
  }
};

TspEAv2TransportProtocolHandler.prototype.AuthenticateClient = function ()
{
  try
  {
    this.Protocol.GetAccessKey(function (AAccessKey) {
      if (typeof AAccessKey != 'undefined')
        this.ProtocolInfo.ClientInfo.AccessKey = AAccessKey;

      if (this.Protocol.Log.Info)
        spLog.logMessage(
          this.constructor.name + '.AuthenticateClient() ' +
          'Authenticating client. ' +
          'ClientId: <' + this.ProtocolInfo.ClientInfo.ClientId + '>, ' +
          'ClientName: <' + this.ProtocolInfo.ClientInfo.ClientName + '>, ' +
          'AccessKey: <' + this.ProtocolInfo.ClientInfo.AccessKey + '>, ' +
          'TemporaryAccessKey: <' + this.ProtocolInfo.ClientInfo.TemporaryAccessKey + '>'
        );
      this.Protocol.SetProtocolState(tpsAuthenticating);

      var message = {};
      message.Action = 'AuthenticateClient';
      message.ClientInfo = this.ProtocolInfo.ClientInfo;
      this.Protocol.PostMessage(message);
    }.bind(this));
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.AuthenticateClient() Error: ' + ErrorMessage);
  }
};

TspEAv2TransportProtocolHandler.prototype.tsIdentifyServer = function (message)
{
  if (message)
  try
  {
    if (message.ServerProtocolId != tsServerProtocolId)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsIdentifyServer() ' + 
          'Server identification failed. Invalid ServerProtocolId received: <' + message.ServerProtocolId + '>');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsIdentifyServer() Server identified');
    this.Protocol.StopProtocolValidationTimer();
    this.AuthenticateClient();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsIdentifyServer() Error: ' + ErrorMessage);
  }
};

TspEAv2TransportProtocolHandler.prototype.tsClientAuthenticated = function (message)
{
  if (message)
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsIdentifyServer() Client authenticated');

    if (message.AccessKey &&
        message.AccessKey != this.ProtocolInfo.ClientInfo.AccessKey)
    {
      if (this.Protocol.Log.Info)
        spLog.logMessage(
          'Store new AccessKey: <' + message.AccessKey + '>, ' +
          'old AccessKey: <' + this.ProtocolInfo.ClientInfo.AccessKey + '>'
        );
      this.Protocol.SetAccessKey(message.AccessKey);
      this.ProtocolInfo.ClientInfo.AccessKey = message.AccessKey;
      delete this.ProtocolInfo.ClientInfo.TemporaryAccessKey;
    }

    this.Protocol.SetProtocolState(tpsAuthenticated);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsClientAuthenticated() Error: ' + ErrorMessage);
  }
};



// TspRandom -------------------------------------------------------------------

function TspRandom()
{
  // empty
}

TspRandom.prototype.GenRandom = function (DataSize)
{
  return forge.random.getBytes(DataSize);
};

// TspELSv3Hash ----------------------------------------------------------------

function TspELSv3Hash(AHashType)
{
  // should be in the lower case!
  this.HashType = AHashType.toLowerCase();
}

TspELSv3Hash.prototype.CalcHash = function (ABuffer)
{
  var md = forge.md.algorithms[this.HashType].create();
  md.update(ABuffer);
  return md.digest();
};

TspELSv3Hash.prototype.CalcHMAC = function (secret, seed)
{
  var hmac = forge.hmac.create();
  hmac.start(this.HashType, secret);
  hmac.update(seed);
  return hmac.digest();
};

// TspELSv3PRFAlgorithm --------------------------------------------------------

function TspELSv3PRFAlgorithm(AHash)
{
  this.Hash = AHash;
}

TspELSv3PRFAlgorithm.prototype.PHash = function (secret, seed, length)
{
   var ai = forge.util.createBuffer();
   var hashBytes = forge.util.createBuffer();

   ai.clear();
   ai.putBytes(seed);
   while (hashBytes.length() < length)
   {
     // HMAC_hash(secret, A(i-1))
     ai.putBuffer(
       this.Hash.CalcHMAC(secret, ai.getBytes())
     );

     // HMAC_hash(secret, A(i) + seed)
     hashBytes.putBuffer( 
       this.Hash.CalcHMAC(secret, ai.bytes() + seed)
     );
   }

   var Result = forge.util.createBuffer();
   Result.putBytes(hashBytes.getBytes(length));
   return Result;
};

TspELSv3PRFAlgorithm.prototype.PRF = function (ASecret, ALabel, ASeed, ALength)
{
  return this.PHash(ASecret, ALabel + ASeed, ALength);
};

// TspSymmetricCipher ----------------------------------------------------------

function TspSymmetricCipher(ACipherType)
{
  this.CipherType = ACipherType;
  this.Cipher = null;
  this.IV = null;
}

TspSymmetricCipher.prototype.InitializeKey = function (AKey)
{
  delete this.Cipher;
  this.Cipher = forge.cipher.createCipher(this.CipherType, AKey);
};

TspSymmetricCipher.prototype.InitializeIV = function (AIV)
{
  this.IV = AIV;
};

TspSymmetricCipher.prototype.Encrypt = function (Value)
{
  var buffer = forge.util.createBuffer(Value, 'utf8');
  this.Cipher.start({iv: this.IV});
  this.Cipher.update(buffer);
  this.Cipher.finish();
  var output = this.Cipher.output.getBytes();
  return output;
};

TspSymmetricCipher.prototype.Decrypt = function (Value)
{
  var buffer = forge.util.createBuffer(Value);
  this.Cipher.start({iv: this.IV});
  this.Cipher.update(buffer);
  this.Cipher.finish();
  var output = this.Cipher.output.toString('utf8');
  return output;
};

// TspSymmetricDecipher --------------------------------------------------------

function TspSymmetricDecipher()
{
  TspSymmetricCipher.apply(this, arguments); // inherited call
}

TspSymmetricDecipher.prototype = Object.create(TspSymmetricCipher.prototype);

TspSymmetricDecipher.prototype.constructor = TspSymmetricDecipher;

TspSymmetricDecipher.prototype.InitializeKey = function (AKey)
{
  delete this.Cipher;
  this.Cipher = forge.cipher.createDecipher(this.CipherType, AKey);
};

// TspRSACipher ----------------------------------------------------------------

function TspRSACipher()
{
  this.PublicKey = null;
  this.PaddingScheme = 'RSA-OAEP';
}

TspRSACipher.prototype.ReverseBytes = function(value)
{
  var bytes = '';
  // add value bytes in reverse (needs to be in big endian)
  for(var i = value.length - 1; i >= 0; --i)
    bytes += value[i];
  return bytes;
};

TspRSACipher.prototype._importPublicKey = function (APublicKey, APublicKeyMod)
{
  if (!APublicKey)
    throw this.constructor.name + '._importPublicKey() PublicKey is undefined!';

  APublicKey = this.ReverseBytes(APublicKey); // convert little endian to big endian bytes
  var n = new forge.jsbn.BigInteger(forge.util.bytesToHex(APublicKey), 16);
  var e = new forge.jsbn.BigInteger(null);
  e.fromInt(APublicKeyMod);
  return forge.pki.rsa.setPublicKey(n, e);
};

TspRSACipher.prototype.ImportPublicKey = function (APublicKey, APublicKeyMod)
{
  this.PublicKey = this._importPublicKey(APublicKey, APublicKeyMod);
};

TspRSACipher.prototype.Encrypt = function (Value)
{
  if (!Value)
    throw this.constructor.name + '.Encrypt() Value is undefined!';

  var e = this.PublicKey.encrypt(Value, this.PaddingScheme);
  e = this.ReverseBytes(e); // convert big endian to little endian bytes
  return e;
};

TspRSACipher.prototype.VerifySignature = function (AHash, APublicKey, ABuffer, ASignature)
{
  if (!AHash)
    throw this.constructor.name + '.VerifySignature() AHash is undefined!';
  if (!APublicKey)
    throw this.constructor.name + '.VerifySignature() APublicKey is undefined!';
  if (!ABuffer)
    throw this.constructor.name + '.VerifySignature() ABuffer is undefined!';
  if (!ASignature)
    throw this.constructor.name + '.VerifySignature() ASignature is undefined!';

  ASignature = this.ReverseBytes(ASignature); // convert little endian to big endian bytes

  var PublicKey = this._importPublicKey(APublicKey, 0x10001);
  var digest = AHash.CalcHash(ABuffer);
  var Verified = PublicKey.verify(digest.bytes(), ASignature);
  return Verified;
};

// TspCipherSuite --------------------------------------------------------------

function TspCipherSuite()
{
  this.Parameters = {};
  this.PRFAlgorithm = null;
  this.Random = null;
  this.SymmetricCipher = null;
  this.SymmetricDecipher = null;
  this.SensitiveDataCipher = null;
  this.SensitiveDataDecipher = null;
  this.AsymmetricCipher = null;
}

TspCipherSuite.prototype.Finalize = function ()
{
  delete this.PRFAlgorithm;
  delete this.Random;
  delete this.SymmetricCipher;
  delete this.SymmetricDecipher;
  delete this.SensitiveDataCipher;
  delete this.SensitiveDataDecipher;
  delete this.AsymmetricCipher;
};

// TspCipherSuite_RSA_AES256_CBC_SHA256 ----------------------------------------

function TspCipherSuite_RSA_AES256_CBC_SHA256()
{
  TspCipherSuite.apply(this, arguments); // inherited call

  this.Parameters.enc_key_length = 32;
  this.Parameters.iv_length = 16;
  this.Parameters.hmac_length = 32;
  this.Random = new TspRandom();
  this.Hash = new TspELSv3Hash('sha256');
  this.PRFAlgorithm = new TspELSv3PRFAlgorithm(this.Hash);
  this.SymmetricCipher = new TspSymmetricCipher('AES-CBC');
  this.SymmetricDecipher = new TspSymmetricDecipher('AES-CBC');
  this.SensitiveDataCipher = new TspSymmetricCipher('AES-CBC');
  this.SensitiveDataDecipher = new TspSymmetricDecipher('AES-CBC');
  this.AsymmetricCipher = new TspRSACipher();
}

TspCipherSuite_RSA_AES256_CBC_SHA256.prototype = Object.create(TspCipherSuite.prototype);

TspCipherSuite_RSA_AES256_CBC_SHA256.prototype.constructor = TspCipherSuite_RSA_AES256_CBC_SHA256;



// TspELSv3MiniguiTransportProtocol --------------------------------------------

function TspELSv3MiniguiTransportProtocol(AProtocol, AClientInfo)
{
  if (!AProtocol)
    throw this.constructor.name + '() AProtocol is undefined!';
  if (!AClientInfo)
    throw this.constructor.name + '() AClientInfo is undefined!';

  this.Protocol = AProtocol;
  this.ClientInfo = AClientInfo;
}

TspELSv3MiniguiTransportProtocol.prototype.Connect = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.Connect() Trying to connect to transport');

  // append selected tab & window info to allow find the web browser window
  this.ClientInfo.WindowInfo = {};
  this.Protocol.onGetActiveWindowInfo(this.ClientInfo.WindowInfo, function () {
    this.AuthenticateMinigui();
  }.bind(this));
};

TspELSv3MiniguiTransportProtocol.prototype.AuthenticateMinigui = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.AuthenticateMinigui() Authenticating');

  var message = {};
  message.type = 'AuthenticateMinigui';
  message.params = {};
  message.params.ClientInfo = {};
  message.params.ClientInfo.WindowInfo = this.ClientInfo.WindowInfo;
  this.PostMessage(message);
};

TspELSv3MiniguiTransportProtocol.prototype.PostMessage = function (message)
{
  var messageMinigui = {};
  messageMinigui.Action = 'MiniguiMessage';
  messageMinigui.data = message;
  this.Protocol.PostMessage(messageMinigui);
};
  
TspELSv3MiniguiTransportProtocol.prototype.Disconnect = function ()
{
  if (this.Protocol.Log.Connect)
    spLog.logMessage(this.constructor.name + '.Disconnect() Disconnecting from transport');

  delete this.ClientInfo;
  this.Protocol = null;
};

TspELSv3MiniguiTransportProtocol.prototype.mgOnMessage = function (message)
{
  if (message)
  try
  {
    this.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.mgOnMessage() Error: ' + ErrorMessage);
  }
};

TspELSv3MiniguiTransportProtocol.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    // append ClientInfo
    if (message.type == 'MiniguiAuthenticated')
    {
      message.params.ClientInfo = {
        ClientName: this.ClientInfo.ClientName,
        WindowInfo: {
          WindowTabTitle: this.ClientInfo.WindowInfo.WindowTabTitle || '',
          WindowTabUrl: this.ClientInfo.WindowInfo.WindowTabUrl || ''
        }
      };
    }

    this.Protocol.PostMiniguiMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};



// TspELSv3TransportProtocolHandler --------------------------------------------

function TspELSv3TransportProtocolHandler()
{
  this.Protocol = null;
  this.ProtocolInfo = null;
  this.CipherSuite = null;
  this.SupportedTransportType = {
    Host: 'Host',
    WS: 'WS'
  };
  this.SupportedCipherSuiteType = {
    ELS_RSA_WITH_AES_256_CBC_SHA256: 'ELS_RSA_WITH_AES_256_CBC_SHA256'
  };
  this.SecureProtocolVersion = 1;
  this.ProtectSensitiveData = false;
  this.SensitiveDataPrefix = '%spSensitiveData<';
  this.SensitiveDataSuffix = '>%';
}

TspELSv3TransportProtocolHandler.prototype.Initialize = function (Protocol, AResultCallback)
{
  if (!Protocol)
    throw this.constructor.name + '.Initialize() Protocol is undefined!';
  if (!AResultCallback)
    throw this.constructor.name + '.Initialize() ResultCallback is undefined!';

  this.Protocol = Protocol;
  this.ProtocolInfo = {};
  this.ProtocolInfo.ClientRandom_length = 32;
  this.ProtocolInfo.PreMasterSecret_length = 48;
  this.ProtocolInfo.MasterSecret_length = 48;
  this.ProtocolInfo.AccessTicket_length = 48;
  this.ProtocolInfo.VerifyData_length = 48;
  this.ProtocolInfo.ClientWriteMessages = forge.util.createBuffer();
  this.ProtocolInfo.ServerWriteMessages = forge.util.createBuffer();

  this.Protocol.GetClientId(function (AClientId) {
    this.ProtocolInfo.ClientId = AClientId;

    this.Protocol.GetEncryptedAccessKey(function (AEncryptedAccessKey) {
      if (typeof AEncryptedAccessKey != 'undefined')
        this.ProtocolInfo.HasEncryptedAccessKey = true;

      AResultCallback();
    }.bind(this));
  }.bind(this));
};

TspELSv3TransportProtocolHandler.prototype.Finalize = function ()
{
  this.DestroyCipherSuite();
  delete this.ProtocolInfo;
  delete this.Protocol;
};

TspELSv3TransportProtocolHandler.prototype.ProtocolStringToBytes = function (s)
{
  var b = atob(s); // base64 decode
  return b;
};

TspELSv3TransportProtocolHandler.prototype.BytesToProtocolString = function (b)
{
  var s = btoa(b); // base64 encode
  return s;
};

TspELSv3TransportProtocolHandler.prototype.InitializeCipherSuite = function (ACipherSuiteType)
{
  if (ACipherSuiteType in this.SupportedCipherSuiteType)
  {
    var CipherSuiteClass = null;
    if (ACipherSuiteType == this.SupportedCipherSuiteType.ELS_RSA_WITH_AES_256_CBC_SHA256)
      CipherSuiteClass = TspCipherSuite_RSA_AES256_CBC_SHA256;

    if (CipherSuiteClass)
    {
      if (this.CipherSuite)
      {
        if (this.CipherSuite instanceof CipherSuiteClass)
        {
          if (this.Protocol.Log.Info)
            spLog.logMessage(this.constructor.name + '.InitializeCipherSuite() CipherSuite already exists ' + 
              this.CipherSuite.constructor.name
            );
          return true;
        }
        this.DestroyCipherSuite();
      }
      this.CipherSuite = new CipherSuiteClass();
      if (this.Protocol.Log.Info)
        spLog.logMessage(this.constructor.name + '.InitializeCipherSuite() Created new CipherSuite ' + 
          this.CipherSuite.constructor.name
        );
      return true;
    }

    throw this.constructor.name + '.InitializeCipherSuite() Unhandled CipherSuite: ' + ACipherSuiteType;
 }

  return false;
};

TspELSv3TransportProtocolHandler.prototype.DestroyCipherSuite = function ()
{
  if (this.CipherSuite)
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.DestroyCipherSuite() Finalize CipherSuite ' + 
        this.CipherSuite.constructor.name
      );
    this.CipherSuite.Finalize();
    delete this.CipherSuite;
  }
};

TspELSv3TransportProtocolHandler.prototype.CreateMiniguiProtocol = function ()
{
  return new TspELSv3MiniguiTransportProtocol(this.Protocol, this.ProtocolInfo.ClientInfo);
};

TspELSv3TransportProtocolHandler.prototype.GetTransportInfoParams = function (message, AResultCallback)
{
  if (!message)
    throw this.constructor.name + '.GetTransportInfoParams() message is undefined!';
  if (!AResultCallback)
    throw this.constructor.name + '.GetTransportInfoParams() AResultCallback is undefined!';

  message.ClientName = spAutofillCore.Tools.GetBrowserClientName();
  message.ClientId = this.ProtocolInfo.ClientId;
  message.SupportedTransport = [
    this.SupportedTransportType.Host,
    this.SupportedTransportType.WS
  ];

  AResultCallback();
};
  
TspELSv3TransportProtocolHandler.prototype.CreateTransport = function (ConnectionInfo)
{
  if (!ConnectionInfo)
    throw this.constructor.name + '.CreateTransport() ConnectionInfo is undefined!';

  if (ConnectionInfo.Transport)
  {
    this.ProtocolInfo.Transport = ConnectionInfo.Transport;
    switch (this.ProtocolInfo.Transport)
    {
      case this.SupportedTransportType.Host:
        return spTransport.CreateHostTransport(this.Protocol.Host);

      case this.SupportedTransportType.WS:
        return spTransport.CreateWebSocketTransport();
    }
  }

  return null;
};

TspELSv3TransportProtocolHandler.prototype.ConnectToTransportInfo = function (ConnectionInfo)
{
  if (!ConnectionInfo)
    throw this.constructor.name + '.ConnectToTransportInfo() ConnectionInfo is undefined!';
  if (!ConnectionInfo.SessionAccessKey)
    throw this.constructor.name + '.ConnectToTransportInfo() ConnectionInfo.SessionAccessKey is undefined!';
  if (!ConnectionInfo.ClientInfo)
    throw this.constructor.name + '.ConnectToTransportInfo() ConnectionInfo.ClientInfo is undefined!';

  this.ProtocolInfo.SessionAccessKey = this.ProtocolStringToBytes(ConnectionInfo.SessionAccessKey);
  this.ProtocolInfo.ClientInfo = ConnectionInfo.ClientInfo;
  this.ProtocolInfo.ClientInfo.ClientId = this.ProtocolInfo.ClientId;

  if (this.Protocol.Log.Info)
    spLog.logMessage(
      this.constructor.name + '.ConnectToTransportInfo() ' +
      'ClientId: <' + this.ProtocolInfo.ClientInfo.ClientId + '>, ' +
      'ClientName: <' + this.ProtocolInfo.ClientInfo.ClientName + '>, ' +
      'SessionAccessKey: <' + this.BytesToProtocolString(this.ProtocolInfo.SessionAccessKey) + '>'
    );

  switch (this.ProtocolInfo.Transport)
  {
    case this.SupportedTransportType.Host:
      break;

    case this.SupportedTransportType.WS:
      this.ProtocolInfo.UserName = ConnectionInfo.UserName;
      break;

    default:
      throw this.constructor.name + '.ConnectToTransportInfo() Unknown transport!';
  }

  this.Protocol.ConnectToTransportInfo(ConnectionInfo);
};

TspELSv3TransportProtocolHandler.prototype.JSONStringify = function (message)
{
  var Result = '';
  
  function __stringifyNode(parent)
  {
    var properties = new Array();
    for (var propertyName in parent)
      properties.push(propertyName);
    properties.sort();

    var propertyAdded = false;
    for (var i = 0, len = properties.length; i < len; i++)
    {
      var propertyName = properties[i];
      var propertyValue = parent[propertyName];

      Result += (propertyAdded ? ',' : '') + '"' + propertyName + '":';
      if (Array.isArray(propertyValue))
      {
        Result += '[';
        for (var j = 0, lenArray = propertyValue.length; j < lenArray; j++)
          Result += (j > 0 ? ',' : '') + '"' + propertyValue[j] + '"';
        Result += ']';
      }
      else if (typeof propertyValue == 'object')
      {
        Result += '{';
        __stringifyNode(propertyValue);
        Result += '}';
      }
      else
        Result += '"' + propertyValue + '"';

      propertyAdded = true;
    }
  }
  
  Result += '{';
  __stringifyNode(message);
  Result += '}';
  
  return Result;
};

TspELSv3TransportProtocolHandler.prototype.AppendHandshakeMessageBuffer = function (message, buffer)
{
  if (!message)
    throw this.constructor.name + '.AppendHandshakeMessageBuffer() message is undefined!';
  if (!buffer)
    throw this.constructor.name + '.AppendHandshakeMessageBuffer() message is buffer!';

  var json = this.JSONStringify(message);
  var msgBuffer = forge.util.createBuffer(json, 'utf8');
  buffer.putBuffer(msgBuffer);
};

TspELSv3TransportProtocolHandler.prototype.BeforePostMessage = function (message)
{
  if (!message)
    throw this.constructor.name + '.BeforePostMessage() message is undefined!';

  if (this.Protocol.ProtocolState < tpsKeyExchanged)
  {
    this.AppendHandshakeMessageBuffer(message, this.ProtocolInfo.ClientWriteMessages);
  }
  else
  {
    var originalAction = message.Action;
    var IV = this.CipherSuite.Random.GenRandom(this.CipherSuite.Parameters.iv_length);
    this.CipherSuite.SymmetricCipher.InitializeIV(IV);
    var plainMessage = JSON.stringify(message);
    var encryptedMessage = this.CipherSuite.SymmetricCipher.Encrypt(plainMessage);

    for (var property in message)
      delete message[property];
    message.Action = 'EncryptedMessage';
    message.iv = this.BytesToProtocolString(IV);
    message.data = this.BytesToProtocolString(encryptedMessage);

    if (this.Protocol.Log.Messages)
      spLog.logMessage(this.constructor.name + '.BeforePostMessage() Sending encrypted "' + 
        originalAction + '" message: ' + JSON.stringify(message)
      );
  }
};

TspELSv3TransportProtocolHandler.prototype.AllowProtectSensitiveData = function ()
{
  return (this.Protocol.ProtocolState >= tpsKeyExchanged) && this.ProtectSensitiveData;
};

TspELSv3TransportProtocolHandler.prototype.EncryptSensitiveData = function (APlainData, AEncryptedData)
{
  var IV = this.CipherSuite.Random.GenRandom(this.CipherSuite.Parameters.iv_length);
  this.CipherSuite.SensitiveDataCipher.InitializeIV(IV);
  IV = this.BytesToProtocolString(IV);
  var encryptedData = this.CipherSuite.SensitiveDataCipher.Encrypt(APlainData);
  var digest = this.CipherSuite.Hash.CalcHash(APlainData + IV).bytes();
  var sensitiveData = {};
  sensitiveData.i = IV;
  sensitiveData.v = this.BytesToProtocolString(encryptedData);
  sensitiveData.h = this.BytesToProtocolString(digest);
  AEncryptedData.Value = this.SensitiveDataPrefix + JSON.stringify(sensitiveData) + this.SensitiveDataSuffix;
  return true;
};

TspELSv3TransportProtocolHandler.prototype.DecryptSensitiveData = function (AEncryptedData, APlainData)
{
  if (!AEncryptedData.startsWith(this.SensitiveDataPrefix))
    return false;
  if (!AEncryptedData.endsWith(this.SensitiveDataSuffix))
    return false;
  var encryptedData = AEncryptedData.slice(this.SensitiveDataPrefix.length, AEncryptedData.length - this.SensitiveDataSuffix.length);
  var sensitiveData = JSON.parse(encryptedData);
  var IV = this.ProtocolStringToBytes(sensitiveData.i);
  if (IV.length != this.CipherSuite.Parameters.iv_length)
    throw this.constructor.name + '.DecryptSensitiveData() ' +
      'Invalid IV length: ' + IV.length + ', expected: ' + this.CipherSuite.Parameters.iv_length;
  this.CipherSuite.SensitiveDataDecipher.InitializeIV(IV);
  encryptedData = this.ProtocolStringToBytes(sensitiveData.v);
  APlainData.Value = this.CipherSuite.SensitiveDataDecipher.Decrypt(encryptedData);
  return true;
};

TspELSv3TransportProtocolHandler.prototype.BeforeProcessMessage = function (message)
{
  if (!message)
    throw this.constructor.name + '.BeforeProcessMessage() message is undefined!';

  if (this.Protocol.ProtocolState < tpsKeyExchanged)
  {
    this.AppendHandshakeMessageBuffer(message, this.ProtocolInfo.ServerWriteMessages);
  }
  else
  {
    if (message.Action == 'EncryptedMessage')
    {
      if (this.Protocol.Log.Messages)
        spLog.logMessage(this.constructor.name + '.BeforeProcessMessage() ' + 
          'Received encrypted message: ' + JSON.stringify(message)
        );

      var IV = this.ProtocolStringToBytes(message.iv);
      if (IV.length != this.CipherSuite.Parameters.iv_length)
      {
        if (this.Protocol.Log.Info)
          spLog.logError(this.constructor.name + '.BeforeProcessMessage() ' + 
            'Wrong IV length: ' + IV.length + ', expected: ' + this.CipherSuite.Parameters.iv_length);
        this.Protocol.DisconnectFromTransport();
        return false;
      }
      this.CipherSuite.SymmetricDecipher.InitializeIV(IV);
      var encryptedMessage = this.ProtocolStringToBytes(message.data);
      var plainMessage = this.CipherSuite.SymmetricDecipher.Decrypt(encryptedMessage);

      for (var property in message)
        delete message[property];
      plainMessage = JSON.parse(plainMessage);
      for (var property in plainMessage)
        message[property] = plainMessage[property];
    }
    else
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.BeforeProcessMessage() ' + 
          'Ignoring plain message: ' + JSON.stringify(message));
      this.Protocol.DisconnectFromTransport();
      return false;
    }
  }

  return true;
};

TspELSv3TransportProtocolHandler.prototype.IsGuestAuthenticating = function ()
{
  return this.Protocol.ProtocolState == tpsAccessingBrowserStorage &&
         this.ProtocolInfo.HasEncryptedAccessKey;
};

TspELSv3TransportProtocolHandler.prototype.tsOnConnect = function ()
{
  this.IdentifyClient();
};

TspELSv3TransportProtocolHandler.prototype.tsOnDisconnect = function ()
{
  var Protocol = this.Protocol;
  this.Finalize();
  this.Initialize(Protocol, function() {});
};

TspELSv3TransportProtocolHandler.prototype.tsOnMessage = function (message)
{
  if (message)
  try
  {
    switch (this.Protocol.ProtocolState)
    {
      case tpsIdentifying:
        if (message.Action == 'IdentifyServer')
          this.tsIdentifyServer(message);
        break;

      case tpsKeyExchanging:
        if (message.Action == 'ServerHello')
          this.tsServerHello(message);
        break;

      case tpsKeyExchanged:
        if (message.Action == 'Finished')
          this.tsFinished(message);
        break;

      case tpsAccessingBrowserStorage:
        if (message.Action == 'StorageAccessGranted')
          this.tsStorageAccessGranted(message);
        else if (this.IsGuestAuthenticating())
          this.Protocol.onMessage(message);
        break;

      case tpsAuthenticating:
        if (message.Action == 'AuthenticateServer')
          this.tsAuthenticateServer(message);
        else if (message.Action == 'ClientAuthenticated')
          this.tsClientAuthenticated(message);
        break;

      case tpsAuthenticated:
        if (message.Action == 'MiniguiMessage')
          this.Protocol.MiniguiProtocol.tsOnMessage(message.data);
        else
          this.Protocol.onMessage(message);
        break;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsOnMessage() Error: ' + ErrorMessage);
  }
};
 
TspELSv3TransportProtocolHandler.prototype.GenerateClientRandom = function ()
{
  return this.CipherSuite.Random.GenRandom(this.ProtocolInfo.ClientRandom_length);
};

TspELSv3TransportProtocolHandler.prototype.IdentifyClient = function ()
{
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.IdentifyClient() ' +
        'Identifying client. ' +
        'ClientProtocolId: <' + tsClientProtocolId + '>, ' +
        'ClientName: <' + this.ProtocolInfo.ClientInfo.ClientName + '>, ' +
        'ClientId: <' + this.ProtocolInfo.ClientId + '>' +
        (this.ProtocolInfo.Transport == this.SupportedTransportType.WS ?
          ', UserName: <' + this.ProtocolInfo.UserName + '>'
          :
          ''
        )
      );
    this.Protocol.SetProtocolState(tpsIdentifying);

    var message = {};
    message.Action = 'IdentifyClient';
    message.ClientProtocolId = tsClientProtocolId;
    message.SecureProtocolVersion = this.SecureProtocolVersion;
    message.ClientName = this.ProtocolInfo.ClientInfo.ClientName;
    message.ClientId = this.ProtocolInfo.ClientId;
    if (this.ProtocolInfo.Transport == this.SupportedTransportType.WS)
      message.UserName = this.ProtocolInfo.UserName;
    this.Protocol.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.IdentifyClient() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.ClientHello = function ()
{
  try
  {
    this.Protocol.SetProtocolState(tpsKeyExchanging);
    this.InitializeCipherSuite(this.SupportedCipherSuiteType.ELS_RSA_WITH_AES_256_CBC_SHA256); // init default CS
    this.ProtocolInfo.ClientRandom = this.GenerateClientRandom();
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.ClientHello() ' +
        'Client hello. ' +
        'ClientRandom: <' + this.BytesToProtocolString(this.ProtocolInfo.ClientRandom) + '>'
      );

    var message = {};
    message.Action = 'ClientHello';
    message.SupportedCipherSuites = [
      this.SupportedCipherSuiteType.ELS_RSA_WITH_AES_256_CBC_SHA256
    ];
    message.ClientRandom = this.BytesToProtocolString(this.ProtocolInfo.ClientRandom);
    this.Protocol.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ClientHello() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.ClientKeyExchange = function (EncryptedPreMasterSecret)
{
  if (!EncryptedPreMasterSecret)
    throw this.constructor.name + '.ClientKeyExchange() EncryptedPreMasterSecret is undefined!';
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.ClientKeyExchange() ' +
        'Exchanging client key. ' +
        'EncryptedPreMasterSecret: <' + this.BytesToProtocolString(EncryptedPreMasterSecret) + '>'
      );
    
    var message = {};
    message.Action = 'ClientKeyExchange';
    message.EncryptedPreMasterSecret = this.BytesToProtocolString(EncryptedPreMasterSecret);
    this.Protocol.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.ClientKeyExchange() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.Finished = function ()
{
  try
  {
    this.ProtocolInfo.ClientWriteMessages = this.ProtocolInfo.ClientWriteMessages.getBytes();
    this.ProtocolInfo.ServerWriteMessages = this.ProtocolInfo.ServerWriteMessages.getBytes();

    var HandshakeMessagesHash = this.CipherSuite.Hash.CalcHMAC(
      this.ProtocolInfo.ClientWriteMessages, this.ProtocolInfo.ServerWriteMessages).bytes();
    var VerifyData = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'client finished',
      HandshakeMessagesHash, this.ProtocolInfo.VerifyData_length).bytes();

    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.Finished() ' +
        'Client finished. ' +
        'HandshakeMessagesHash: <' + this.BytesToProtocolString(HandshakeMessagesHash) + '> ' +
        'VerifyData: <' + this.BytesToProtocolString(VerifyData) + '>'
      );

    var message = {};
    message.Action = 'Finished';
    message.VerifyData = this.BytesToProtocolString(VerifyData);
    message.ProtectSensitiveData = true;
    this.Protocol.PostMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Finished() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.QueryStorageAccess = function ()
{
  this.Protocol.SetProtocolState(tpsAccessingBrowserStorage);

  var StorageAccessTicket = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'storage access',
    this.ProtocolInfo.ClientId +
    this.ProtocolInfo.ClientRandom +
    this.ProtocolInfo.ServerRandom +
    this.ProtocolInfo.SessionAccessKey, this.ProtocolInfo.AccessTicket_length).bytes();
  
  if (this.Protocol.Log.Info)
    spLog.logMessage(
      this.constructor.name + '.QueryStorageAccess() ' +
      'Quering storage access. ' +
      'StorageAccessTicket: <' + this.BytesToProtocolString(StorageAccessTicket) + '>'
    );

  var message = {};
  message.Action = 'QueryStorageAccess';
  message.StorageAccessTicket = this.BytesToProtocolString(StorageAccessTicket);
  this.Protocol.PostMessage(message);
};

TspELSv3TransportProtocolHandler.prototype.AuthenticateClient = function ()
{
  try
  {
    this.Protocol.GetAccessKey(function (AAccessKey) {
      var message = {};
      message.Action = 'AuthenticateClient';

      if (typeof AAccessKey != 'undefined')
        message.AccessKeyV2 = AAccessKey;

      if (this.ProtocolInfo.ClientInfo.TemporaryAccessKey)
        message.TemporaryAccessKey = this.ProtocolInfo.ClientInfo.TemporaryAccessKey;

      if (this.ProtocolInfo.AccessKey)
      {
        message.ClientAccessTicket = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'client access',
          this.ProtocolInfo.ClientId +
          this.ProtocolInfo.ServerRandom +
          this.ProtocolInfo.AccessKey +
          this.ProtocolInfo.SessionAccessKey, this.ProtocolInfo.AccessTicket_length).bytes();
        message.ClientAccessTicket = this.BytesToProtocolString(message.ClientAccessTicket);
      }

      if (this.Protocol.Log.Info)
        spLog.logMessage(
          this.constructor.name + '.AuthenticateClient() ' +
          'Authenticating client. ' +
          'AccessKey: <' + (this.ProtocolInfo.AccessKey ? this.BytesToProtocolString(this.ProtocolInfo.AccessKey) : this.ProtocolInfo.AccessKey) + '>, ' +
          'AccessKey EAv2: <' + message.AccessKeyV2 + '>, ' +
          'TemporaryAccessKey: <' + message.TemporaryAccessKey + '>'
        );
      this.Protocol.SetProtocolState(tpsAuthenticating);

      this.Protocol.PostMessage(message);
    }.bind(this));
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.AuthenticateClient() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.tsIdentifyServer = function (message)
{
  if (message)
  try
  {
    if (message.ServerProtocolId != tsServerProtocolId)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsIdentifyServer() ' + 
          'Server identification failed. Invalid ServerProtocolId received: <' + message.ServerProtocolId + '>');
      this.Protocol.DisconnectFromTransport();
      return;
    }
    if (message.SecureProtocolVersion < 1 || message.SecureProtocolVersion > this.SecureProtocolVersion)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsIdentifyServer() ' + 
          'Server identification failed. Unsupported SecureProtocolVersion received: <' + message.SecureProtocolVersion + '>, ' + 
          'supported one: <' + this.SecureProtocolVersion + '>'
        );
      this.Protocol.DisconnectFromTransport();
      return;
    }

    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsIdentifyServer() Server identified');
    this.Protocol.StopProtocolValidationTimer();
    this.ClientHello();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsIdentifyServer() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.tsServerHello = function (message)
{
  if (message)
  try
  {
    if (!this.InitializeCipherSuite(message.CipherSuite))
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsServerHello() ' + 
          'Invalid CipherSuite received: <' + message.CipherSuite + '>');
      this.Protocol.DisconnectFromTransport();
      return;
    }
    if (!message.ServerRandom)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsServerHello() ' + 
          'ServerRandom is not specified.');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.tsServerHello() ' +
        'Server hello. ' +
        'CipherSuite: <' + message.CipherSuite + '>, ' +
        'ServerRandom: <' + message.ServerRandom + '>, ' +
        'ExchangePublicKey: <' + message.ExchangePublicKey.n + ', ' + message.ExchangePublicKey.e + '>'
      );
    this.ProtocolInfo.ServerRandom = this.ProtocolStringToBytes(message.ServerRandom);

    var PreMasterSecret = this.CipherSuite.Random.GenRandom(this.ProtocolInfo.PreMasterSecret_length);
    this.CipherSuite.AsymmetricCipher.ImportPublicKey(
      this.ProtocolStringToBytes(message.ExchangePublicKey.n), message.ExchangePublicKey.e);
    var EncryptedPreMasterSecret = this.CipherSuite.AsymmetricCipher.Encrypt(PreMasterSecret);

    this.MasterSecret = this.CipherSuite.PRFAlgorithm.PRF(PreMasterSecret, 'master secret',
      this.ProtocolInfo.ClientRandom +
      this.ProtocolInfo.ServerRandom +
      this.ProtocolInfo.SessionAccessKey, this.ProtocolInfo.MasterSecret_length).bytes();

    var KeyBlockLength = 2 * this.CipherSuite.Parameters.enc_key_length;
    var KeyBlock = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'key expansion',
      this.ProtocolInfo.ServerRandom +
      this.ProtocolInfo.ClientRandom +
      this.ProtocolInfo.SessionAccessKey, KeyBlockLength);
    var ClientWriteKey = KeyBlock.getBytes(this.CipherSuite.Parameters.enc_key_length);
    var ServerWriteKey = KeyBlock.getBytes(this.CipherSuite.Parameters.enc_key_length);
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.tsServerHello() ' +
        'PreMasterSecret: <' + this.BytesToProtocolString(PreMasterSecret) + '>, ' +
        'MasterSecret: <' + this.BytesToProtocolString(this.MasterSecret) + '>, ' +
        'ClientWriteKey: <' + this.BytesToProtocolString(ClientWriteKey) + '>, ' +
        'ServerWriteKey: <' + this.BytesToProtocolString(ServerWriteKey) + '>'
      );

    this.ClientKeyExchange(EncryptedPreMasterSecret);
    this.CipherSuite.SymmetricCipher.InitializeKey(ClientWriteKey);
    this.CipherSuite.SymmetricDecipher.InitializeKey(ServerWriteKey);
    this.CipherSuite.SensitiveDataCipher.InitializeKey(ServerWriteKey);
    this.CipherSuite.SensitiveDataDecipher.InitializeKey(ServerWriteKey);
    this.Protocol.SetProtocolState(tpsKeyExchanged);

    this.Finished();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsServerHello() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.tsFinished = function (message)
{
  if (message)
  try
  {
    var HandshakeMessagesHash = this.CipherSuite.Hash.CalcHMAC(
      this.ProtocolInfo.ServerWriteMessages, this.ProtocolInfo.ClientWriteMessages).bytes();
    var VerifyData = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'server finished',
      HandshakeMessagesHash, this.ProtocolInfo.VerifyData_length).bytes();

    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.tsFinished() ' +
        'Server finished. ' +
        'HandshakeMessagesHash: <' + this.BytesToProtocolString(HandshakeMessagesHash) + '> ' +
        'VerifyData: <' + this.BytesToProtocolString(VerifyData) + '> ' +
        'message.VerifyData: <' + message.VerifyData + '> ' +
        'message.ProtectSensitiveData: <' + message.ProtectSensitiveData + '>'
      );

    if (message.VerifyData != this.BytesToProtocolString(VerifyData))
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsFinished() ' + 
          'Invalid VerifyData.');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    var SignaturePublicKey = this.ProtocolStringToBytes(
      'aaH4o2JrjfJK6jPmmoey0ey0Lrowv/80jVmqKqRwjni4V+6iGZ7ray3jSBG13ItfxQkX1KYWyZC0iJr9nicXee' + 
      'TheFyphhg7F/pbMhr+b4w7ZE8GtmzVfasYcpf80yKZLwrdm4jAdKyKF/T+X+Y0rd94I0jwIcjOPjSkFXUCy+8='
    );
    var Signature = this.ProtocolStringToBytes(message.Signature);
    var Verified = this.CipherSuite.AsymmetricCipher.VerifySignature(
      this.CipherSuite.Hash,
      SignaturePublicKey,
      VerifyData,
      Signature
    );
    if (!Verified)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsFinished() ' + 
          'Invalid signature.');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    delete this.ProtocolInfo.ClientWriteMessages;
    delete this.ProtocolInfo.ServerWriteMessages;

    if (typeof message.ProtectSensitiveData == 'boolean')
      this.ProtectSensitiveData = message.ProtectSensitiveData;
    else
      this.ProtectSensitiveData = false;

    this.QueryStorageAccess();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsFinished() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.tsStorageAccessGranted = function (message)
{
  if (message)
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(
        this.constructor.name + '.tsStorageAccessGranted() ' +
        'Storage access granted. ' +
        'StorageIV: ' + message.StorageIV + ', ' +
        'StoragePassword: ' + message.StoragePassword
      );
    this.ProtocolInfo.AccessKey = '';
    if (message.StorageIV && message.StoragePassword)
    {
      this.Protocol.GetEncryptedAccessKey(function (AEncryptedAccessKey) {
        if (AEncryptedAccessKey)
        try
        {
          var StoragePassword = this.ProtocolStringToBytes(message.StoragePassword);
          var CipherSuite = new TspCipherSuite_RSA_AES256_CBC_SHA256();
          var StorageKey = CipherSuite.PRFAlgorithm.PRF(StoragePassword, 'storage key',
            this.ProtocolInfo.ClientId, CipherSuite.Parameters.enc_key_length).bytes();

          var IV = this.ProtocolStringToBytes(message.StorageIV);
          var encryptedAccessKey = this.ProtocolStringToBytes(AEncryptedAccessKey);
          CipherSuite.SymmetricDecipher.InitializeIV(IV);
          CipherSuite.SymmetricDecipher.InitializeKey(StorageKey);
          this.ProtocolInfo.AccessKey = CipherSuite.SymmetricDecipher.Decrypt(encryptedAccessKey);
        }
        catch (ErrorMessage)
        {
          this.ProtocolInfo.AccessKey = '';
          spLog.logError(this.constructor.name + '.tsStorageAccessGranted() Error decrypting AccessKey: ' + ErrorMessage);
        }
      }.bind(this));
    }

    this.AuthenticateClient();
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsStorageAccessGranted() Error: ' + ErrorMessage);
  }
};

TspELSv3TransportProtocolHandler.prototype.tsAuthenticateServer = function (message)
{
  if (message)
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsAuthenticateServer() Server authenticated');

    var ServerAccessTicket = this.CipherSuite.PRFAlgorithm.PRF(this.MasterSecret, 'server access',
      this.ProtocolInfo.ClientId +
      this.ProtocolInfo.ClientRandom +
      this.ProtocolInfo.AccessKey +
      this.ProtocolInfo.SessionAccessKey, this.ProtocolInfo.AccessTicket_length).bytes();
    ServerAccessTicket = this.BytesToProtocolString(ServerAccessTicket);

    if (message.ServerAccessTicket != ServerAccessTicket)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsAuthenticateServer() ServerAccessTicket invalid.');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    this.Protocol.SetProtocolState(tpsAuthenticated);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsAuthenticateServer() Error: ' + ErrorMessage);
  }
};    

TspELSv3TransportProtocolHandler.prototype.tsClientAuthenticated = function (message)
{
  if (message)
  try
  {
    if (this.Protocol.Log.Info)
      spLog.logMessage(this.constructor.name + '.tsClientAuthenticated() Client authenticated');

    if (!message.AccessKey || !message.StorageIV || !message.StoragePassword)
    {
      if (this.Protocol.Log.Info)
        spLog.logError(this.constructor.name + '.tsClientAuthenticated() AccessKey | StorageIV | StoragePassword is not specified.');
      this.Protocol.DisconnectFromTransport();
      return;
    }

    if (this.Protocol.Log.Info)
      spLog.logMessage('Store new AccessKey: <' + message.AccessKey + '>, StorageIV: ' + message.StorageIV + ', StoragePassword: ' + message.StoragePassword);

    var StoragePassword = this.ProtocolStringToBytes(message.StoragePassword);
    var CipherSuite = new TspCipherSuite_RSA_AES256_CBC_SHA256();
    var StorageKey = CipherSuite.PRFAlgorithm.PRF(StoragePassword, 'storage key',
      this.ProtocolInfo.ClientId, CipherSuite.Parameters.enc_key_length).bytes();

    var IV = this.ProtocolStringToBytes(message.StorageIV);
    var AccessKey = this.ProtocolStringToBytes(message.AccessKey);
    CipherSuite.SymmetricCipher.InitializeIV(IV);
    CipherSuite.SymmetricCipher.InitializeKey(StorageKey);
    var encryptedAccessKey = CipherSuite.SymmetricCipher.Encrypt(AccessKey);
    encryptedAccessKey = this.BytesToProtocolString(encryptedAccessKey);
    this.Protocol.SetEncryptedAccessKey(encryptedAccessKey);
    this.Protocol.RemoveAccessKey();
    this.ProtocolInfo.HasEncryptedAccessKey = true;
    delete this.ProtocolInfo.ClientInfo.TemporaryAccessKey;

    this.Protocol.SetProtocolState(tpsAuthenticated);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.tsClientAuthenticated() Error: ' + ErrorMessage);
  }
};



const spTransportProtocol = {
  CreateTransportProtocol: function ()
  {
    return new TspTransportProtocol();
  }
};

var __exports = {};
__exports.spTransportProtocol = spTransportProtocol;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spTransportProtocol', __exports);

})();