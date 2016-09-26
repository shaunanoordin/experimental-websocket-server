var express = require("express");
var server = express();
 
var SERVER = {
  IP: "0.0.0.0",
  PORT: 3000
}

server.set("port", (process.env.PORT || SERVER.PORT));
server.use(express.static(__dirname));

server.listen(server.get("port"), function onStart(err) {
  if (err) {
    console.log(err);
  } else {
    console.info("Server ready on port " + server.get("port"));
  }
});
