/**
 * Created by nuintun on 2015/12/2.
 */

'use strict';

importScripts('../../terminal/index.js');

var xterm;

/**
 * encode
 * @param str
 * @returns {string}
 */
function encode(str){
  if (str) {
    return str.replace(/[<>]/mg, function (match){
      return match === '<' ? '&lt;' : '&gt;';
    });
  } else {
    return '';
  }
}

onconnect = function (event){
  var port = event.ports[0];

  port.onmessage = function (event){
    var message = event.data;

    function send(name, xterm){
      var data = {
        name: name,
        screen: xterm.toString('html')
      };

      port.postMessage(data);
    }

    switch (message.action) {
      case 'open':
        if (!xterm) {
          xterm = new AnsiTerminal(120, 80, 0);
          xterm.newline_mode = true;
          xterm.beep = function (){
            port.postMessage({
              exec: 'beep',
              name: message.name
            });
          };
        }

        send(message.name, xterm);
        break;
      case 'close':
        delete xterm.reset();
        break;
      case 'write':
        xterm.write(encode(message.data));
        send(message.name, xterm);
        break;
    }
  };
};
