const express = require('express')
const cors = require('cors');
const { socketCotroller } = require('../sockets/controller');

class Server {

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT || 3000;
        this.server = require('http').createServer( this.app );
        this.io     = require('socket.io')( this.server );

        this.paths = {}

        // Middleware
        this.middlewares()

        // Route middleware
        this.routes()

        // Sockets
        this.sockets();
    }

    middlewares() {

        // CORS
        this.app.use( cors() )

        // Public directory
        this.app.use( express.static('public') )
    }

    routes() {
        // this.app.use( this.paths.auth, require('../routes/auth') )

    };

    sockets() {
        this.io.on('connection', socketCotroller )
    }

    listen(){
        this.server.listen( this.port, () => {
            console.log( `Listening on port ${ this.port }` );

        })
    };

}

module.exports = Server;