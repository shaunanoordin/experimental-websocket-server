/*
Odyssey Engine
==============
An experimental engine for handling multiple websocket connections.
********************************************************************************
 */

export class OdysseyEngine {
  constructor(wsServerConfig) {
    this.clients = [];
    this.processCommand = this.processCommand.bind(this);
    this.cleanupClients = this.cleanupClients.bind(this);
    //this.handleClientMessage.bind(this);  //This needs to be bound to individual websockets
    this.handleClientClose = this.handleClientClose.bind(this);
    this.handleClientError = this.handleClientError.bind(this);
    
    const WebSocketServer = require("ws").Server;
    this.wsServer = new WebSocketServer(wsServerConfig);
    this.wsServer.on("connection", this.receiveConnection.bind(this));
    this.wsServer.on("error", this.handleError.bind(this));
    
    console.info("WS Server attached to HTTP Server");
  }
  
  cleanupClients() {
    console.log("CLEANUP");
    this.clients = this.clients.filter((client) => {
      if (!client.ws) return false;
      return client.ws.readyState !== 3;
    });
  }
  
  receiveConnection(ws) {
    console.log("RECEIVED CONNECTION");
    ws.send("Welcome to the Experimental WebSocket Server.");
    ws.on("message", this.handleClientMessage.bind(this, ws));
    ws.on("close", this.handleClientClose);
    ws.on("error", this.handleClientError);
    this.clients.push({ ws });
  }
  
  handleClientMessage(ws, msg) {
    console.log("CLIENT MESSAGE: ", msg);
    let client = this.clients.find((c) => {
      return c.ws === ws;
    });
    if (client) {
      this.processCommand(msg.trim(), client);
    } else {
      console.error("ERROR: Could not determine client.");
    }
  }
  
  handleClientError(err) {
    console.error("CLIENT ERROR: ", err);
    this.cleanupClients();
  }
  
  handleClientClose() {
    console.log("CLIENT CLOSE");
    this.cleanupClients();
  }
  
  processCommand(cmd = "", client) {
    const arrCmd = cmd.replace(/\ +/ig, " ").split(" ");
    
    if (cmd === "" || arrCmd.length === 0 || arrCmd[0] === "") {  //No command
      client.ws.send("No command received.");
      return;
    } else if (arrCmd[0].match(/^status$/ig)) {  //Status command
      let response = "Clients: " + this.clients.length + "\n";
      this.clients.map((c) => {
        let readyState = "???";
        switch (c.ws.readyState) {
          case 0: readyState = "Connecting..."; break;
          case 1: readyState = "Connected"; break;
          case 2: readyState = "Disconnecting..."; break;
          case 3: readyState = "Disconnected"; break;
        }
        response += "#: "+readyState+"\n";
      });
      client.ws.send(response);
      return;
    } else if (arrCmd[0].match(/^say|shout$/ig)) {  //Say/shout command
      
      this.clients.map((c) => {
        if (!(!arrCmd[1] || arrCmd[1] === "")) {
          c.ws.send("# said " + arrCmd[1]);
        }
      });
      return;
    }
    client.ws.send("Command not understood: " + cmd);
    return;
  }
  
  handleError(err) {
    console.error("ERROR!");
    console.error(err);
  }
}
