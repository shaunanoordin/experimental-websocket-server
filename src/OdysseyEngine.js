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
    this.clients = [];
    this.processCommand = this.processCommand.bind(this);
    
    const WebSocketServer = require("ws").Server;
    this.wsServer = new WebSocketServer(wsServerConfig);
    this.wsServer.on("connection", this.receiveConnection.bind(this));
    this.wsServer.on("error", this.handleError.bind(this));
    
    console.info("WS Server ready on port " + WS_SERVER.PORT);
  }
  
  receiveConnection(ws) {
    console.log("RECEIVED CONNECTION");
    ws.send("Welcome to the Experimental WebSocket Server.");
    ws.on("message", this.receiveMessage.bind(this, ws));
    this.clients.push({ ws });
  }
  
  receiveMessage(ws, msg) {
    console.log("RECEIVED MESSAGE: ", msg);
    const response = this.processCommand(msg.trim());
    ws.send(response);
  }
  
  processCommand(cmd = "") {
    const arrCmd = cmd.replace(/\ +/ig, " ").split(" ");
    
    if (cmd === "" || arrCmd.length === 0 || arrCmd[0] === "") {  //No command
      return "No command received.";
    } else if (arrCmd[0].match(/^status$/ig)) {  //Status command
      let response = "Clients: " + this.clients.length + "\n";
      for (let i = 0; i < this.clients.length; i++) {
        const client = this.clients[i];
        let readyState = "???";
        switch (client.ws.readyState) {
          case 0: readyState = "Connecting..."; break;
          case 1: readyState = "Connected"; break;
          case 2: readyState = "Disconnecting..."; break;
          case 3: readyState = "Disconnected"; break;
        }
        response += "#"+(i+1)+": "+readyState+"\n";
      }
      return response;
    }
    
    return "Command not understood: " + cmd;
  }
  
  handleError(err) {
    console.log("ERROR!");
    console.log(err);
  }
}
