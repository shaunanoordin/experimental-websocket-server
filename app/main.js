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

	var HTTP_SERVER = {
	  PORT: process.env.PORT || 3000
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
	  PORT: process.env.PORT || 4000
	};
	var odyssey = new _OdysseyEngine.OdysseyEngine({ port: WS_SERVER.PORT });
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

	var WS_SERVER = {
	  PORT: process.env.PORT || 4000
	};

	var OdysseyEngine = exports.OdysseyEngine = function () {
	  function OdysseyEngine(wsServerConfig) {
	    _classCallCheck(this, OdysseyEngine);

	    this.sockets = [];
	    this.processCommand = this.processCommand.bind(this);

	    var WebSocketServer = __webpack_require__(2).Server;
	    this.wsServer = new WebSocketServer(wsServerConfig);
	    this.wsServer.on("connection", this.receiveConnection.bind(this));

	    console.info("WS Server ready on port " + WS_SERVER.PORT);
	  }

	  _createClass(OdysseyEngine, [{
	    key: "receiveConnection",
	    value: function receiveConnection(ws) {
	      console.log("RECEIVED CONNECTION");
	      ws.send("Welcome to the WebSocket Server.");
	      ws.on("message", this.receiveMessage.bind(this, ws));
	      this.sockets.push(ws);
	    }
	  }, {
	    key: "receiveMessage",
	    value: function receiveMessage(ws, msg) {
	      console.log("RECEIVED MESSAGE: ", msg);
	      var response = this.processCommand(msg.trim());
	      ws.send(response);
	    }
	  }, {
	    key: "processCommand",
	    value: function processCommand() {
	      var cmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

	      if (cmd === "") {
	        //No command
	        return "No command received.";
	      } else if (cmd.match(/status/ig)) {
	        //Status command
	        return "Sockets: " + this.sockets.length;
	      } else if (!cmd.match(/[^\d\ \+\-\*\/\.]/ig)) {
	        //Maths command
	        try {
	          return "??? Maths functions are out of whack ???";
	        } catch (err) {
	          return "Could not parse math command: " + cmd + "\nERROR:" + err;
	        }
	      }

	      return "Command not understood: " + cmd;
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