# Experimental WebSocket Server

An experimental server that utilises HTML5 WebSockets to communicate with multiple clients. Includes a free simple WebSocket Client to communicate with the server!

This server is meant to be hosted on Heroku.

## Development

* This project has two components:
  * The main WebSocket **server**
  * The supporting WebSocket **client**
* The WS server is developed in ES6, is transpiled into JavaScript using Babel, and runs on Node.
* The client is a simple standalone JS+HTML5+CSS app.

Project anatomy:

* The WebSocket server's source code is stored in `/src` and compiled into `/app`
* The WebSocket client's code is in `/web`. That's raw code; no compilation is necessary.
* This project is meant to be run as a server.

Starting the project:

1. Run `npm install` to install project dependencies.
2. Run `npm start` to start the server.
3. The WebSocket server is running quietly on `ws://localhost:4000`
4. The WebSocket client can be viewed at `http://localhost:3000` or by opening `/web/index.html`.
  * Note: this meants there are two servers running; the main WS server at port 4000 and a simple web server to serve the client app at port 3000.

Alternatively, there's a developer mode:

1. `npm install`
2. `npm run dev`
3. `http://localhost:3000`
4. Changes to the WS server's JS code will compiled automatically. Note that this will cause the WS server to restart every time a file is changed.

Deploying on Heroku:

1. TODO
