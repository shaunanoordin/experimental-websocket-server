/*  
Experimental Websocket Server
=============================

(Shaun A. Noordin || shaunanoordin.com || 20170117)
********************************************************************************
 */

import { OdysseyEngine } from "./OdysseyEngine.js";

//HTTP Server for Web Client
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

//WebSocket Server + Odyssey Engine
//==============================================================================
var WS_SERVER = {
  PORT: (process.env.PORT || 4000)
};
var odyssey = new OdysseyEngine({ port: WS_SERVER.PORT });
//==============================================================================

/*  Simple WebSocket code
//==============================================================================
var WebSocketServer = require("ws").Server;
var WS_SERVER = {
  PORT: (process.env.PORT || 4000)
};
var wsServer = new WebSocketServer({ port: WS_SERVER.PORT });
var odyssey = new OdysseyEngine();

wsServer.on("connection", (ws) => {
  ws.send("Welcome to the WebSocket Server.");
  
  ws.on("message", (msg) => {
    ws.send(msg + " " + msg);
  });
});
//==============================================================================
*/