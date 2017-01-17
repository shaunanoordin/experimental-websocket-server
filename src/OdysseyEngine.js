/*
Odyssey Engine
==============
An experimental engine for handling multiple websocket connections.
********************************************************************************
 */

const WS_SERVER = {
  PORT: (process.env.PORT || 4000)
};

export class OdysseyEngine {
  constructor(wsServerConfig) {
    this.sockets = [];
    this.processCommand = this.processCommand.bind(this);
    
    const WebSocketServer = require("ws").Server;
    this.wsServer = new WebSocketServer(wsServerConfig);
    this.wsServer.on("connection", this.receiveConnection.bind(this));
    
    console.info("WS Server ready on port " + WS_SERVER.PORT);
  }
  
  receiveConnection(ws) {
    console.log("RECEIVED CONNECTION");
    ws.send("Welcome to the WebSocket Server.");
    ws.on("message", this.receiveMessage.bind(this, ws));
    this.sockets.push(ws);
  }
  
  receiveMessage(ws, msg) {
    console.log("RECEIVED MESSAGE: ", msg);
    const response = this.processCommand(msg.trim());
    ws.send(response);
  }
  
  processCommand(cmd = "") {
    if (cmd === "") {  //No command
      return "No command received.";
    } else if (cmd.match(/status/ig)) {  //Status command
      return "Sockets: " + this.sockets.length;
    } else if (!cmd.match(/[^\d\ \+\-\*\/\.]/ig)) {  //Maths command
      try {
        return "??? Maths functions are out of whack ???";
      } catch (err) {
        return "Could not parse math command: " + cmd + "\nERROR:" + err;
      }
    }
    
    return "Command not understood: " + cmd;
  }
}
