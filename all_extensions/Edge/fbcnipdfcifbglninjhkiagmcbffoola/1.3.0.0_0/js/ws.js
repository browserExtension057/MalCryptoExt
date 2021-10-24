define(['sockjs'], function(SockJS) {
    return (function (default_messages) {
        var wsock,
            first_message_signal = false;
        var handlers = {
            'default': function(data){
                console.log(data);
            }
        };

        function init() {
            var options = {
                debug: true
            }
            wsock = new SockJS(
                'http://' + WS_HOST + WS_PATH,
                null,
                options);
            wsock.onopen = function(){
                showMessage('Connection to server started');
                self.sendMessages(default_messages)
            }
            wsock.onmessage = function(event) {
                var data = JSON.parse(event.data);
                if (handlers.hasOwnProperty(data.key)) {
                    handlers[data.key](data);
                } else {
                    handlers['default'](data)
                }
                if (!first_message_signal &&
                    handlers.hasOwnProperty('first_message'))
                {
                    handlers['first_message']()
                    first_message_signal = true;
                }
            };
            wsock.onclose = function(event){
                if(event.wasClean){
                    showMessage('Clean connection end')
                }else{
                    showMessage('Connection broken')
                }
                wsock = null;
                setTimeout(function() {
                    init();
                }, 1000);
            };
            wsock.onerror = function(error){
                showMessage(error);
            };
            wsock.onheartbeat = function() {
                if (this.readyState === 1) {
                    wsock.send('h');
                }
            };
        }

        function showMessage(message) {
            var messageElem = $('#ws_messages'),
                height = 0,
                date = new Date(),
                options = {hour12: false};
            console.log('[' + date.toLocaleTimeString('en-US', options) + '] ' + message + '\n')
        }

        var self = {
            sendMessages: function(messages) {
                if (wsock.readyState == 0) {
                    setTimeout(function(){self.sendMessages(messages)},500)
                    return;
                }
                $(messages).each(function(i, item){
                    wsock.send(JSON.stringify(item));
                });
            },
            addHandler: function(key, func) {
                handlers[key] = func;
                return self;
            },
            recreate: function(messages) {
                default_messages = messages;
                first_message_signal = false;
                wsock.close();
            }
        }
        init();
        return self;
    })
})
