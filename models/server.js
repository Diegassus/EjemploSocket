const express = require('express');
const cors = require('cors');
const { dbconnection } = require('../db/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');


class Server{


    constructor(){
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths={
            categorias:'/api/categorias',
            auth:'/api/auth',
            user:'/api/users',
            buscar:'/api/buscar',
            productos:'/api/productos',
            uploads:'/api/uploads'
        }

        //conexion a la base de datos
        this.conectarDB()

        //middlewares
        this.middlewares();

        //rutas
        this.routes();
        
        //sockets
        this.sockets();
    }

    sockets(){
        this.io.on('connection' , socket => socketController(socket,this.io))
    }

    async conectarDB(){
        await dbconnection()
    }

    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(cors());
        //lectura y parseo del body
        this.app.use(express.json());

        this.app.use(fileUpload({
            useTempFiles:true,
            tempFileDir:`/tmp/`
        }))


    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.server.listen(this.port);
    }

}

module.exports = Server