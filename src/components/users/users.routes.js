const express = require('express');
const { signUpUser, getUsers, loginUser, deleteUser, updateUser, logOut } = require('./users.controller');
const validator = require('../../middlewares/validator');
const { userSignupValidationSchema, userLoginValidationSchema, userUpdateValidationSchema } = require('./users.model');
const authenticate = require('../../middlewares/auth')
const checkAdmin = require('../../middlewares/checkAdmin')

class UserRouter{
    constructor(){
        this.path = "users";
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // SignUp New User
        this.router.post(`/${this.path}/signup`, validator(userSignupValidationSchema), authenticate, checkAdmin, signUpUser);

        // Get all Users
        this.router.get(`/${this.path}`, authenticate, checkAdmin, getUsers)

        // Login User
        this.router.post(`/${this.path}/auth/login`, validator(userLoginValidationSchema), loginUser);

        // Update User
        this.router.put(`/${this.path}/update/:id`, validator(userUpdateValidationSchema), authenticate, checkAdmin, updateUser)

        // Remove User
        this.router.delete(`/${this.path}/remove/:id`, authenticate, checkAdmin, deleteUser);

        // LogOut User
        this.router.post(`/${this.path}/auth/logout`, authenticate, logOut);
    };

}

module.exports = UserRouter;