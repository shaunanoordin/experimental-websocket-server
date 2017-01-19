/*
Odyssey Engine
==============
An experimental engine for handling multiple websocket connections.
********************************************************************************
 */

const WS_READYSTATE_CONNECTING = 0;
const WS_READYSTATE_OPEN = 1;
const WS_READYSTATE_CLOSING = 2;
const WS_READYSTATE_CLOSED = 3;

export class OdysseyEngine {
  constructor(wsServerConfig) {
    this.clients = [];
    this.processCommand = this.processCommand.bind(this);
    this.cleanupClients = this.cleanupClients.bind(this);
    this.handleConnection = this.handleConnection.bind(this)
    this.handleError = this.handleError.bind(this);
    //this.handleClientMessage.bind(this);  //This needs to be bound to individual websockets
    //this.handleClientClose = this.handleClientClose.bind(this);
    //this.handleClientError = this.handleClientError.bind(this);
    this.send = this.send.bind(this);
    this.broadcast = this.broadcast.bind(this);
    
    const WebSocketServer = require("ws").Server;
    this.wsServer = new WebSocketServer(wsServerConfig);
    this.wsServer.on("connection", this.handleConnection);
    this.wsServer.on("error", this.handleError);
    
    console.info("WS Server attached to HTTP Server");
  }
  
  handleError(err) {
    console.error("ERROR!");
    console.error(err);
  }
  
  handleConnection(ws) {
    console.log("RECEIVED CONNECTION");
    const nickname = this.generateRandomNickname();
    let client = { nickname, ws };
    ws.on("message", this.handleClientMessage.bind(this, client));
    ws.on("close", this.handleClientClose.bind(this, client));
    ws.on("error", this.handleClientError.bind(this, client));
    this.broadcast(nickname + " has joined the server.");
    this.clients.push(client);
    this.send(client,
      "Welcome to the Experimental WebSocket Server.\n" +
      "Your nickname is: " + nickname + "\n" +
      "Any text you send will be broadcast to everyone on the server.\n" +
      "Special commands include '!status' and '!rename' "
    );
  }
  
  handleClientMessage(client, msg) {
    if (client) {
      console.log("CLIENT MESSAGE: ", msg);
      this.processCommand(msg.trim(), client);
    } else {
      console.error("ERROR: Could not determine client.");
    }
  }
  
  handleClientClose(client) {
    console.log("CLIENT CLOSE");
    if (client) {
      this.broadcast(client.nickname + " has left the server.");
    } else {
      this.broadcast("A user has left the server.");
    }
    this.cleanupClients();
  }
  
  handleClientError(client, err) {
    console.error("CLIENT ERROR: ", err);
    this.cleanupClients();
  }
  
  processCommand(cmd = "", client) {
    const arrCmd = cmd.replace(/\ +/ig, " ").split(" ");

    //Basic commands
    //----------------------------------------------------------------
    if (cmd === "" || arrCmd.length === 0 || arrCmd[0] === "") {  //No command
      this.send(client, "No command received.");
      return;
    } else if (!arrCmd[0].match(/^!/ig)) {  //Normal text that doesn't start with an exclamation? Shout it out to everyone!
      
      this.broadcast("@"+client.nickname+" said: \"" + cmd + "\"");
      return;
    }
    //----------------------------------------------------------------
    
    //Accept special commands
    //----------------------------------------------------------------
    if (arrCmd[0].match(/^!status$/ig)) {  //Status command
      let response = "Clients: " + this.clients.length + "\n";
      this.clients.map((c) => {
        let readyState = "???";
        switch (c.ws.readyState) {
          case WS_READYSTATE_CONNECTING: readyState = "Connecting..."; break;
          case WS_READYSTATE_OPEN: readyState = "Connected"; break;
          case WS_READYSTATE_CLOSING: readyState = "Disconnecting..."; break;
          case WS_READYSTATE_CLOSED: readyState = "Disconnected"; break;
        }
        response += c.nickname+": "+readyState+"\n";
      });
      this.send(client, response);
      return;
    }
    
    if (arrCmd[0].match(/^!rename$/ig)) {  //Rename command
      const oldNickname = client.nickname;
      const newNickname = this.generateRandomNickname();
      client.nickname = newNickname;
      this.broadcast(oldNickname + " has been renamed to " + newNickname);
      return;
    }
    
    this.send(client, "Unknown command.");
    //----------------------------------------------------------------
  }
  
  send(client, msg) {
    if (client && client.ws && client.ws.readyState === WS_READYSTATE_OPEN) {
      client.ws.send(msg);
    }
  }
  
  broadcast(msg) {
    this.clients.map((client) => {
      this.send(client, msg);
    });
    return;
  }
  
  cleanupClients() {
    console.log("CLEANUP");
    this.clients = this.clients.filter((client) => {
      if (!client.ws) return false;
      return client.ws.readyState !== WS_READYSTATE_CLOSED;
    });
  }
  
  generateRandomNickname() {
    const adjectives = [
      "red", "blue", "gold", "green", "silver", "white", "orange", "purple", "pink",
      "cold", "hot", "dry", "wet", "rough", "smooth",
      "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
      "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy",
      "solid", "liquid", "gaseous",
      "awesome", "mysterious", "confounding",
    ];
    const nouns = [
      "cat", "mouse", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "sheep", "monkey", "rooster", "dog", "boar",
      "beaver", "oyster", "pearl", "octopus", "spider",
      "dev", "astronomer", "designer", "analyst",
      "fighter", "mage", "guardian", "ranger", "witch", "wizard", "rogue",
    ];    
    return adjectives[Math.floor(Math.random() * adjectives.length)] + "-" + nouns[Math.floor(Math.random() * nouns.length)];
  }
}
