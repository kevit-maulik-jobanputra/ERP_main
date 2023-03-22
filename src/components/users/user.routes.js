const express = require('express');
const { signUpUser, getUsers } = require('./users.controller');

class UserRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // Create New User
        this.router.post('/users/adduser', signUpUser);

        // Get all users
        this.router.get('/users', getUsers)
    };

}

module.exports = UserRouter;