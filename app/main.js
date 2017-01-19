/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _OdysseyEngine = __webpack_require__(1);

	//HTTP Server for Web Client
	//==============================================================================
	var Express = __webpack_require__(3); /*  
	                                  Experimental Websocket Server
	                                  =============================
	                                  
	                                  (Shaun A. Noordin || shaunanoordin.com || 20170117)
	                                  ********************************************************************************
	                                   */

	var SERVER = {
	  PORT: process.env.PORT || 3000
	};
	var server = Express().use(Express.static("web")).listen(SERVER.PORT, function onStart(err) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.info("HTTP Server ready on port " + SERVER.PORT);
	  }
	});
	//==============================================================================

	//WebSocket Server + Odyssey Engine
	//==============================================================================
	var odyssey = new _OdysseyEngine.OdysseyEngine({ server: server });
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	Odyssey Engine
	==============
	An experimental engine for handling multiple websocket connections.
	********************************************************************************
	 */

	var WS_READYSTATE_CONNECTING = 0;
	var WS_READYSTATE_OPEN = 1;
	var WS_READYSTATE_CLOSING = 2;
	var WS_READYSTATE_CLOSED = 3;

	var OdysseyEngine = exports.OdysseyEngine = function () {
	  function OdysseyEngine(wsServerConfig) {
	    _classCallCheck(this, OdysseyEngine);

	    this.clients = [];
	    this.processCommand = this.processCommand.bind(this);
	    this.cleanupClients = this.cleanupClients.bind(this);
	    this.handleConnection = this.handleConnection.bind(this);
	    this.handleError = this.handleError.bind(this);
	    //this.handleClientMessage.bind(this);  //This needs to be bound to individual websockets
	    //this.handleClientClose = this.handleClientClose.bind(this);
	    //this.handleClientError = this.handleClientError.bind(this);
	    this.send = this.send.bind(this);
	    this.broadcast = this.broadcast.bind(this);

	    var WebSocketServer = __webpack_require__(2).Server;
	    this.wsServer = new WebSocketServer(wsServerConfig);
	    this.wsServer.on("connection", this.handleConnection);
	    this.wsServer.on("error", this.handleError);

	    console.info("WS Server attached to HTTP Server");
	  }

	  _createClass(OdysseyEngine, [{
	    key: "handleError",
	    value: function handleError(err) {
	      console.error("ERROR!");
	      console.error(err);
	    }
	  }, {
	    key: "handleConnection",
	    value: function handleConnection(ws) {
	      console.log("RECEIVED CONNECTION");
	      var nickname = this.generateRandomNickname();
	      var client = { nickname: nickname, ws: ws };
	      ws.on("message", this.handleClientMessage.bind(this, client));
	      ws.on("close", this.handleClientClose.bind(this, client));
	      ws.on("error", this.handleClientError.bind(this, client));
	      this.broadcast(nickname + " has joined the server.");
	      this.clients.push(client);
	      this.send(client, "Welcome to the Experimental WebSocket Server.\n" + "Your nickname is: " + nickname + "\n" + "Any text you send will be broadcast to everyone on the server.\n" + "Special commands include '!status' and '!rename' ");
	    }
	  }, {
	    key: "handleClientMessage",
	    value: function handleClientMessage(client, msg) {
	      if (client) {
	        console.log("CLIENT MESSAGE: ", msg);
	        this.processCommand(msg.trim(), client);
	      } else {
	        console.error("ERROR: Could not determine client.");
	      }
	    }
	  }, {
	    key: "handleClientClose",
	    value: function handleClientClose(client) {
	      console.log("CLIENT CLOSE");
	      if (client) {
	        this.broadcast(client.nickname + " has left the server.");
	      } else {
	        this.broadcast("A user has left the server.");
	      }
	      this.cleanupClients();
	    }
	  }, {
	    key: "handleClientError",
	    value: function handleClientError(client, err) {
	      console.error("CLIENT ERROR: ", err);
	      this.cleanupClients();
	    }
	  }, {
	    key: "processCommand",
	    value: function processCommand() {
	      var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	      var client = arguments[1];

	      var arrCmd = cmd.replace(/\ +/ig, " ").split(" ");

	      //Basic commands
	      //----------------------------------------------------------------
	      if (cmd === "" || arrCmd.length === 0 || arrCmd[0] === "") {
	        //No command
	        this.send(client, "No command received.");
	        return;
	      } else if (!arrCmd[0].match(/^!/ig)) {
	        //Normal text that doesn't start with an exclamation? Shout it out to everyone!

	        this.broadcast("@" + client.nickname + " said: \"" + cmd + "\"");
	        return;
	      }
	      //----------------------------------------------------------------

	      //Accept special commands
	      //----------------------------------------------------------------
	      if (arrCmd[0].match(/^!status$/ig)) {
	        //Status command
	        var response = "Clients: " + this.clients.length + "\n";
	        this.clients.map(function (c) {
	          var readyState = "???";
	          switch (c.ws.readyState) {
	            case WS_READYSTATE_CONNECTING:
	              readyState = "Connecting...";break;
	            case WS_READYSTATE_OPEN:
	              readyState = "Connected";break;
	            case WS_READYSTATE_CLOSING:
	              readyState = "Disconnecting...";break;
	            case WS_READYSTATE_CLOSED:
	              readyState = "Disconnected";break;
	          }
	          response += c.nickname + ": " + readyState + "\n";
	        });
	        this.send(client, response);
	        return;
	      }

	      if (arrCmd[0].match(/^!rename$/ig)) {
	        //Rename command
	        var oldNickname = client.nickname;
	        var newNickname = this.generateRandomNickname();
	        client.nickname = newNickname;
	        this.broadcast(oldNickname + " has been renamed to " + newNickname);
	        return;
	      }

	      this.send(client, "Unknown command.");
	      //----------------------------------------------------------------
	    }
	  }, {
	    key: "send",
	    value: function send(client, msg) {
	      if (client && client.ws && client.ws.readyState === WS_READYSTATE_OPEN) {
	        client.ws.send(msg);
	      }
	    }
	  }, {
	    key: "broadcast",
	    value: function broadcast(msg) {
	      var _this = this;

	      this.clients.map(function (client) {
	        _this.send(client, msg);
	      });
	      return;
	    }
	  }, {
	    key: "cleanupClients",
	    value: function cleanupClients() {
	      console.log("CLEANUP");
	      this.clients = this.clients.filter(function (client) {
	        if (!client.ws) return false;
	        return client.ws.readyState !== WS_READYSTATE_CLOSED;
	      });
	    }
	  }, {
	    key: "generateRandomNickname",
	    value: function generateRandomNickname() {
	      var adjectives = ["red", "blue", "gold", "green", "silver", "white", "orange", "purple", "pink", "cold", "hot", "dry", "wet", "rough", "smooth", "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy", "solid", "liquid", "gaseous", "awesome", "mysterious", "confounding"];
	      var nouns = ["cat", "mouse", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "sheep", "monkey", "rooster", "dog", "boar", "beaver", "oyster", "pearl", "octopus", "spider", "dev", "astronomer", "designer", "analyst", "fighter", "mage", "guardian", "ranger", "witch", "wizard", "rogue"];
	      return adjectives[Math.floor(Math.random() * adjectives.length)] + "-" + nouns[Math.floor(Math.random() * nouns.length)];
	    }
	  }]);

	  return OdysseyEngine;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("ws");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ }
/******/ ]);