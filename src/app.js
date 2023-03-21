const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');
const { PORT, NODE_ENV } = require('./environment/config');
const { url } = require('./databases/mongodb')

class App{
    constructor(){
        this.app = express();
        this.router = express.Router();
        this.router.get('/', (req,res) => {
            res.send("Hello!")
        });
        this.databaseConnection();
        this.initializeRoutes();
        this.initializeMiddleWares();
    };

    databaseConnection(){
        mongoose.connect(url)
        .then(() => {
            console.log(`====== DB - Connected! =======`);
            console.log(`==============================`);
        })
        .catch(err => console.log(`DataBase Error - ${err}`))
    };

    initializeRoutes(){
        this.app.use('/', this.router);
    };

    initializeMiddleWares(){
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
    };

    listen(){
        this.app.listen(PORT, () => {
            console.log(`==============================`);
            console.log(`===  NODE_ENV - ${NODE_ENV} ===`);
            console.log(`==============================`);
            console.log(`Server Up and running at ${PORT}!`);
            console.log(`==============================`);
        });
    };
}

module.exports = App;