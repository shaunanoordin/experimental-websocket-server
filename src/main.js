/*  
Experimental Websocket Server
=============================

(Shaun A. Noordin || shaunanoordin.com || 20170117)
********************************************************************************
 */

//==============================================================================
var Express = require("express");
var HTTP_SERVER = {
  PORT: (process.env.PORT || 3000)
};
var httpServer = Express();

httpServer.use(Express.static("web"));

httpServer.listen(HTTP_SERVER.PORT, function onStart(err) {
  if (err) {
    console.log(err);
  } else {
    console.info("HTTP Server ready on port " + HTTP_SERVER.PORT);
  }
});

//==============================================================================

//==============================================================================
var WebSocketServer = require("ws").Server;
var WS_SERVER = {
  PORT: (process.env.PORT || 4000)
};
var wsServer = new WebSocketServer({ port: WS_SERVER.PORT });

wsServer.on("connection", (ws) => {
  ws.send("Welcome to the WebSocket Server.");
  
  ws.on("message", (msg) => {
    ws.send(msg + " " + msg);
  });
});

console.info("WS Server ready on port " + WS_SERVER.PORT);
//==============================================================================
