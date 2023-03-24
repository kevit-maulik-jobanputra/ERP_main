const express = require('express');
const { signUpUser, getUsers, loginUser, deleteUser, updateUser, logOut } = require('./users.controller');
const validator = require('../../middlewares/validator');
const { userSignupValidationSchema, userLoginValidationSchema, userUpdateValidationSchema } = require('./users.model');
const authenticate = require('../../middlewares/auth')

class UserRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // SignUp New User
        this.router.post('/users/signup', validator(userSignupValidationSchema), authenticate, signUpUser);

        // Get all Users
        this.router.get('/users', authenticate, getUsers)

        // Login User
        this.router.post('/users/login', validator(userLoginValidationSchema), loginUser);

        // Update User
        this.router.put('/users/update/:id', validator(userUpdateValidationSchema), authenticate, updateUser)

        // Remove User
        this.router.delete('/users/remove/:id', authenticate, deleteUser);

        // LogOut User
        this.router.post('/users/logout', authenticate, logOut);
    };

}

module.exports = UserRouter;