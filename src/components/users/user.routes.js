const express = require('express');
const { signUpUser, getUsers, loginUser, deleteUser } = require('./users.controller');
const validator = require('../../middlewares/validator');
const { userSignupValidationSchema, userLoginValidationSchema } = require('./users.modal');
const authenticate = require('../../middlewares/auth')

class UserRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // SignUp New User
        this.router.post('/users/adduser', validator(userSignupValidationSchema), authenticate, signUpUser);

        // Get all Users
        this.router.get('/users', authenticate, getUsers)

        // Login User
        this.router.post('/users/login', validator(userLoginValidationSchema), loginUser);

        // Remove User
        this.router.delete('/users/remove/:id', authenticate, deleteUser);
    };

}

module.exports = UserRouter;