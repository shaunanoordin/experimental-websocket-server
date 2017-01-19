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

	var OdysseyEngine = exports.OdysseyEngine = function () {
	  function OdysseyEngine(wsServerConfig) {
	    _classCallCheck(this, OdysseyEngine);

	    this.clients = [];
	    this.processCommand = this.processCommand.bind(this);
	    this.cleanupClients = this.cleanupClients.bind(this);
	    //this.handleClientMessage.bind(this);  //This needs to be bound to individual websockets
	    this.handleClientClose = this.handleClientClose.bind(this);
	    this.handleClientError = this.handleClientError.bind(this);

	    var WebSocketServer = __webpack_require__(2).Server;
	    this.wsServer = new WebSocketServer(wsServerConfig);
	    this.wsServer.on("connection", this.receiveConnection.bind(this));
	    this.wsServer.on("error", this.handleError.bind(this));

	    console.info("WS Server attached to HTTP Server");
	  }

	  _createClass(OdysseyEngine, [{
	    key: "cleanupClients",
	    value: function cleanupClients() {
	      console.log("CLEANUP");
	      this.clients = this.clients.filter(function (client) {
	        if (!client.ws) return false;
	        return client.ws.readyState !== 3;
	      });
	    }
	  }, {
	    key: "receiveConnection",
	    value: function receiveConnection(ws) {
	      console.log("RECEIVED CONNECTION");
	      ws.send("Welcome to the Experimental WebSocket Server.");
	      ws.on("message", this.handleClientMessage.bind(this, ws));
	      ws.on("close", this.handleClientClose);
	      ws.on("error", this.handleClientError);
	      this.clients.push({ ws: ws });
	    }
	  }, {
	    key: "handleClientMessage",
	    value: function handleClientMessage(ws, msg) {
	      console.log("CLIENT MESSAGE: ", msg);
	      var client = this.clients.find(function (c) {
	        return c.ws === ws;
	      });
	      if (client) {
	        this.processCommand(msg.trim(), client);
	      } else {
	        console.error("ERROR: Could not determine client.");
	      }
	    }
	  }, {
	    key: "handleClientError",
	    value: function handleClientError(err) {
	      console.error("CLIENT ERROR: ", err);
	      this.cleanupClients();
	    }
	  }, {
	    key: "handleClientClose",
	    value: function handleClientClose() {
	      console.log("CLIENT CLOSE");
	      this.cleanupClients();
	    }
	  }, {
	    key: "processCommand",
	    value: function processCommand() {
	      var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	      var client = arguments[1];

	      var arrCmd = cmd.replace(/\ +/ig, " ").split(" ");

	      if (cmd === "" || arrCmd.length === 0 || arrCmd[0] === "") {
	        //No command
	        client.ws.send("No command received.");
	        return;
	      } else if (arrCmd[0].match(/^status$/ig)) {
	        //Status command
	        var response = "Clients: " + this.clients.length + "\n";
	        this.clients.map(function (c) {
	          var readyState = "???";
	          switch (c.ws.readyState) {
	            case 0:
	              readyState = "Connecting...";break;
	            case 1:
	              readyState = "Connected";break;
	            case 2:
	              readyState = "Disconnecting...";break;
	            case 3:
	              readyState = "Disconnected";break;
	          }
	          response += "#: " + readyState + "\n";
	        });
	        client.ws.send(response);
	        return;
	      } else if (arrCmd[0].match(/^say|shout$/ig)) {
	        //Say/shout command

	        this.clients.map(function (c) {
	          if (!(!arrCmd[1] || arrCmd[1] === "")) {
	            c.ws.send("# said " + arrCmd[1]);
	          }
	        });
	        return;
	      }
	      client.ws.send("Command not understood: " + cmd);
	      return;
	    }
	  }, {
	    key: "handleError",
	    value: function handleError(err) {
	      console.error("ERROR!");
	      console.error(err);
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