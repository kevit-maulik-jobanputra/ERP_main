const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const { PORT } = require('./environment/config')

class App{
    constructor(){
        this.app = express();
        this.router = express.Router();
        this.router.get('/', (req,res) => {
            res.send("Hello")
        });
        this.initializeRoutes();
        this.initializeMiddleWares();
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
            console.log(`Server Up and running at ${PORT}!`)
        });
    };
}

module.exports = App;