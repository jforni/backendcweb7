const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Conectar con Base de datos
        this.conectarDB();

       //Middlewares
       this.middlewares();

       //Función para las rutas
       this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Leer lo que el usuario envía por el cuerpo de la petición
        this.app.use(express.json());

        //Definir la carpea pública
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.authPath, require('../routes/auth'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server online port: ', this.port);
        })
    }
}

module.exports = Server;