const { Err } = require('./errorHandler');
const jwt = require('jsonwebtoken');
const { JWT_ADMIN, JWT_STAFF } = require('../environment/config');
const { User } = require('../components/users/users.model');

const authenticate = async (req, res, next) => {
    const token = req.headers.auth_token;
    if(!token){
        next(new Err(401, 'Login First!', "AUTHENTICATION_FAILED"));
    }else{
        try {
            const { _id } = jwt.verify(token, JWT_STAFF);
            const user = await User.findById(_id);
            if(user.token === token){
                req.staffId = _id;
            }else{
                next(new Err(401, 'Login First!', "AUTHENTICATION_FAILED"));
            }
        } catch (error) {
            try {
                const { _id } = jwt.verify(token, JWT_ADMIN);
                const user = await User.findById(_id);
                if(user.token === token){
                    req.adminId = _id;
                }else{
                    next(new Err(401, 'Login First!', "AUTHENTICATION_FAILED"));
                }
            } catch (error) {
                next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
            }
        }
    };
    next();
};


module.exports = authenticate;