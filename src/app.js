const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');
const { PORT, NODE_ENV } = require('./environment/config');
const { url } = require('./databases/mongodb');
const { errorHandler } = require('./middlewares/errorHandler');

class App{
    constructor(routes){
        this.app = express();
        this.databaseConnection();
        this.initializeMiddleWares();
        this.initializeRoutes(routes);
        this.initializeErrorHandler();
    };

    databaseConnection(){
        mongoose.connect(url)
        .then(() => {
            console.log(`====== DB - Connected! =======`);
            console.log(`==============================`);
        })
        .catch(err => console.log(`DataBase Error - ${err}`))
    };

    initializeRoutes(routes){
        routes.forEach(route => {
            this.app.use('/', route.router)
        });
    };

    initializeMiddleWares(){
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());   
    };

    initializeErrorHandler(){
        this.app.use(errorHandler);
    };

    listen(){
        this.app.listen(PORT, () => {
            console.log(`==============================`);
            console.log(`=== NODE_ENV - ${NODE_ENV} ===`);
            console.log(`==============================`);
            console.log(`Server Up and running at ${PORT}!`);
            console.log(`==============================`);
        });
    };
}

module.exports = App;