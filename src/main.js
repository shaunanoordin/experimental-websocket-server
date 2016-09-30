/*  
Experimental Websocket Server
=============================

Starter tempalte for JS projects

(Shaun A. Noordin || shaunanoordin.com || 20160509)
********************************************************************************
 */

var express = require("express");
var server = express();
 
var SERVER = {
  PORT: 3000
}

server.set("port", (process.env.PORT || SERVER.PORT));
server.use(express.static("/web"));

console.log(__dirname + "/web");

server.listen(server.get("port"), function onStart(err) {
  if (err) {
    console.log(err);
  } else {
    console.info("Server ready on port " + server.get("port"));
  }
});
