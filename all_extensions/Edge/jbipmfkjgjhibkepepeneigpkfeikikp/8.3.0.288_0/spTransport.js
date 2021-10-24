
//*****************************************************************************}
//                                                                             }
//       Sticky Password manager & safe                                        }
//       Transport for WebBrowsers                                             }
//                                                                             }
//       Copyright (C) 2019 Lamantine Software a.s.                            }
//                                                                             }
//*****************************************************************************}

(function() {

'use strict';

var spLog = spRequire('spLog').spLog;



// TspCustomTransport ----------------------------------------------------------

function TspCustomTransport()
{
  this.onConnect = null;
  this.onDisconnect = null;
  this.onMessage = null;
}

TspCustomTransport.prototype.tsOnConnect = function ()
{
  if (this.onConnect)
    this.onConnect();
};

TspCustomTransport.prototype.tsOnDisconnect = function (IsError, Message)
{
  if (this.onDisconnect)
    this.onDisconnect(IsError, Message);
};

TspCustomTransport.prototype.tsOnMessage = function (message)
{
  if (this.onMessage)
    this.onMessage(message);
};



// TspHostTransport ------------------------------------------------------------

function TspHostTransport(AHost)
{
  this.Host = AHost;
  this.Host.onMessage = this.hstOnMessage.bind(this);
  this.TransportAvailable = false;

  TspCustomTransport.apply(this, arguments); // inherited call
}

TspHostTransport.prototype = Object.create(TspCustomTransport.prototype);

TspHostTransport.prototype.constructor = TspHostTransport;

TspHostTransport.prototype.IsAvailable = function()
{
  return (this.Host != null) && this.Host.IsInitialized() && this.TransportAvailable;
};

TspHostTransport.prototype.Connect = function (AConnectionInfo)
{
  if (this.IsConnectionInfoValid(AConnectionInfo))
  try
  {
    this.TransportAvailable = true;
    var message = {};
    message.Action = 'TransportConnect';
    message.ConnectionInfo = AConnectionInfo;
    this.Host.PostMessageToInitializedHost(message);
    return true; // Host connection successfully started
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Connect() Error: ' + ErrorMessage);
  }

  return false;
};

TspHostTransport.prototype.Disconnect = function ()
{
  if (this.TransportAvailable)
  {
    var message = {};
    message.Action = 'TransportDisconnect';
    this.Host.PostMessageToInitializedHost(message);
    this.TransportAvailable = false;
  }
};

TspHostTransport.prototype.PostMessage = function (AMessage)
{
  var message = {};
  message.Action = 'TransportMessage';
  message.data = AMessage;
  this.Host.PostMessageToInitializedHost(message);
};

TspHostTransport.prototype.IsConnectionInfoValid = function (AConnectionInfo)
{
  return (AConnectionInfo != null) && AConnectionInfo.Valid;
};

TspHostTransport.prototype.ConnectionInfoToLogMessage = function (AConnectionInfo)
{
  return 'Host ' + JSON.stringify(AConnectionInfo);
};

TspHostTransport.prototype.hstOnMessage = function (AMessage)
{
  if (AMessage)
  try
  {
    switch (AMessage.Action)
    {
      case 'TransportMessage':
        this.tsOnMessage(AMessage.data);
        break;

      case 'TransportOnConnect':
        this.tsOnConnect();
        break;

      case 'TransportOnDisconnect':
        this.TransportAvailable = false;
        this.tsOnDisconnect(AMessage.IsError, AMessage.ErrorMessage);
        break;
    }
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.hstOnMessage() Error: ' + ErrorMessage);
  }
};



// TspWebSocketTransport -------------------------------------------------------

function TspWebSocketTransport()
{
  this.TransportSocket = null;

  TspCustomTransport.apply(this, arguments); // inherited call
}

TspWebSocketTransport.prototype = Object.create(TspCustomTransport.prototype);

TspWebSocketTransport.prototype.constructor = TspWebSocketTransport;

TspWebSocketTransport.prototype.IsAvailable = function()
{
  return this.TransportSocket != null;
};

TspWebSocketTransport.prototype.Connect = function (AConnectionInfo)
{
  if (this.IsConnectionInfoValid(AConnectionInfo))
  try
  {
    var Port = this.ConnectionInfoToPort(AConnectionInfo);
    var Protocol = this.ConnectionInfoToProtocol(AConnectionInfo);
    var Url = 'ws://127.0.0.1:' + Port;
    // WARNING: WebSocket doesn't work in Firefox in case the Protocol specified as empty string
    if (Protocol)
      this.TransportSocket = new WebSocket(Url, Protocol);
    else
      this.TransportSocket = new WebSocket(Url);
    this.TransportSocket.onopen = this.tsOnConnect.bind(this);
    this.TransportSocket.onclose = this.wsOnClose.bind(this);
    this.TransportSocket.onmessage = this.wsOnMessage.bind(this);
    return true; // WebSocket connection successfully started
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.Connect() Error: ' + ErrorMessage);
  }

  return false;
};

TspWebSocketTransport.prototype.Disconnect = function ()
{
  if (this.TransportSocket)
  {
    this.TransportSocket.close();
    this.TransportSocket = null;
  }
};

TspWebSocketTransport.prototype.PostMessage = function (message)
{
  var json = JSON.stringify(message);
  this.TransportSocket.send(json);
};

TspWebSocketTransport.prototype.ConnectionInfoToPort = function (AConnectionInfo)
{
  if (AConnectionInfo)
    return AConnectionInfo.Port;
  else
    return 0;
};

TspWebSocketTransport.prototype.ConnectionInfoToProtocol = function (AConnectionInfo)
{
  if (AConnectionInfo)
    return AConnectionInfo.Protocol;
  else
    return '';
};

TspWebSocketTransport.prototype.IsConnectionInfoValid = function (AConnectionInfo)
{
  var Port = this.ConnectionInfoToPort(AConnectionInfo);
  return Port > 0;
};

TspWebSocketTransport.prototype.ConnectionInfoToLogMessage = function (AConnectionInfo)
{
  var Port = this.ConnectionInfoToPort(AConnectionInfo);
  var Protocol = this.ConnectionInfoToProtocol(AConnectionInfo);
  return 'WebSocket Port=' + Port + (Protocol ? ' Protocol=' + Protocol : '');
};
  
TspWebSocketTransport.prototype.wsOnClose = function (AEvent)
{
  var IsError = false;
  var Message = '';
  if (AEvent)
  {
    IsError = AEvent.code != 1000; // CLOSE_NORMAL
    Message = 'Code: ' + AEvent.code + ', reason="' + AEvent.reason + '", wasClean=' + AEvent.wasClean;
  }
  this.TransportSocket = null;
  this.tsOnDisconnect(IsError, Message);
};

TspWebSocketTransport.prototype.wsOnMessage = function (AEvent)
{
  if (AEvent)
  try
  {
    var json = AEvent.data;
    var message = JSON.parse(json);
    this.tsOnMessage(message);
  }
  catch (ErrorMessage)
  {
    spLog.logError(this.constructor.name + '.wsOnMessage() Error: ' + ErrorMessage);
  }
};



const spTransport = {
  CreateHostTransport: function (AHost)
  {
    return new TspHostTransport(AHost);
  },

  CreateWebSocketTransport: function ()
  {
    return new TspWebSocketTransport();
  }
};

var __exports = {};
__exports.spTransport = spTransport;

if (typeof exports !== 'undefined')
  exports = __exports;
else
  spDefine('spTransport', __exports);

})();