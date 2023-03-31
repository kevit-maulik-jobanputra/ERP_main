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
const { customLogger, pinoFormateConfig } = require('./services/logger')

class App{
    constructor(routes){
        this.app = express();
        this.logger = pinoFormateConfig;
        this.databaseConnection();
        this.initializeMiddleWares();
        this.initializeRoutes(routes);
        this.initializeErrorHandler();
    };

    listen(){
        this.app.listen(PORT, () => {
            this.logger.info(`==============================`);
            this.logger.info(`=== NODE_ENV - ${NODE_ENV} ===`);
            this.logger.info(`==============================`);
            this.logger.info(`Server Up and running at ${PORT}!`);
            this.logger.info(`==============================`);
        });
    };

    databaseConnection(){
        mongoose.connect(url)
        .then(() => {
            this.logger.info(`====== DB - Connected! =======`);
            this.logger.info(`==============================`);
        })
        .catch(err => this.logger.error(`DataBase Error - ${err}`))
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

}

module.exports = App;