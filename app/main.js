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

	/*  
	Experimental Websocket Server
	=============================

	(Shaun A. Noordin || shaunanoordin.com || 20170117)
	********************************************************************************
	 */

	//==============================================================================
	var Express = __webpack_require__(1);
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

	//==============================================================================
	var WebSocketServer = __webpack_require__(2).Server;
	var WS_SERVER = {
	  PORT: process.env.PORT || 4000
	};
	var wsServer = new WebSocketServer({ port: WS_SERVER.PORT });

	wsServer.on("connection", function (ws) {
	  ws.send("Welcome to the WebSocket Server.");

	  ws.on("message", function (msg) {
	    ws.send(msg + " " + msg);
	  });
	});

	console.info("WS Server ready on port " + WS_SERVER.PORT);
	//==============================================================================

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("ws");

/***/ }
/******/ ]);