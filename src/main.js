/*  
Experimental Websocket Server
=============================

(Shaun A. Noordin || shaunanoordin.com || 20170117)
********************************************************************************
 */

import { OdysseyEngine } from "./OdysseyEngine.js";

//HTTP Server for Web Client
//==============================================================================
const Express = require("express");
const SERVER = {
  PORT: (process.env.PORT || 3000)
};
const server = Express()
.use(Express.static("web"))
.listen(SERVER.PORT, function onStart(err) {
  if (err) {
    console.log(err);
  } else {
    console.info("HTTP Server ready on port " + SERVER.PORT);
  }
});
//==============================================================================

//WebSocket Server + Odyssey Engine
//==============================================================================
const odyssey = new OdysseyEngine({ server });
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
