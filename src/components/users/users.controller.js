const { createSingleUser, findUsers, findByEmail, findById } = require('./users.DAL');
const { Err } = require('../../middlewares/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN, JWT_STAFF } = require('../../environment/config');

const signUpUser =  async (req, res, next) => {
    try {
        if(req.adminId){
            const user = await createSingleUser(req.body, next);
            if(user){
                res.status(200).json(user);
            };
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
        }
    } catch (error) {
        next(error)
    };
};

const getUsers = async (req, res, next) => { 
    try {
        if(!req.adminId){
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
        }else{
            const users = await findUsers(next);
            if(users){
                if(users.length === 0){
                    next(new Err(404, "No users Found!", "USER_NOT_FOUND"))
                }else{
                    res.status(200).json(users);
                };
            };
        }
    }catch (err) {
        next(err)
    };
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findByEmail(email, next);
        if(!user){
            next(new Err(401, 'Invalid Credentials!', "AUTHENTICATION_FAILED"))
        }else{
            const result = await bcrypt.compare(password, user.password);
            if(result){
                if(user.isAdmin){
                    user.token = jwt.sign({_id: user._id}, JWT_ADMIN, {algorithm: "RS256"});
                }else{
                    user.token = jwt.sign({_id: user._id}, JWT_STAFF, {algorithm:"RS256"});
                };
                await user.save();
                res.status(200).json({auth_token: user.token})
            }else{
                next(new Err(401, 'Invalid Credentials!', "AUTHENTICATION_FAILED"))
            }
        }
    } catch (error) {
        next(error)
    }
};

const updateUser = async (req, res, next) => {
    try {
        if(!req.adminId) {
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
        } else {
            const { id } = req.params;
            const user = await findById(id);
            if(!user){
                next(new Err(400, "No user found!", "BAD_REQUEST"))
            }else{
                for(const field in req.body){
                    if(!["email", "isAdmin"].includes(field)){
                        user[field] = req.body[field];
                    }
                };
                await user.save();
                res.status(200).json(user);
            }
        }
    } catch (error) {
        next(error)
    }
};

const deleteUser = async (req, res, next) => {
    try {
        if(!req.adminId){
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
        }else{
            const { id } = req.params;
            const user = await findById(id);
            if(!user){
                next(new Err(400, "No user found!", "BAD_REQUEST"))
            }else{
                await user.deleteOne();
                res.status(200).json(user);
            }
        }
    } catch (error) {
        next(error)
    }
};

module.exports = { signUpUser, getUsers, loginUser, deleteUser, updateUser }