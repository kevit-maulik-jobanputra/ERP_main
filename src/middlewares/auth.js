const { Err } = require('./errorHandler');
const jwt = require('jsonwebtoken');
const { JWT_PRIVATE, JWT_PUBLIC } = require('../environment/config');
const { User } = require('../components/users/users.modal');

const authenticate = async (req, res, next) => {
    const token = req.headers.auth_token;
    if(!token){
        next(new Err(401, 'Login First!', "AUTHENTICATION_FAILED"));
    }else{
        try {
            const { _id } = jwt.verify(token, JWT_PUBLIC);
            const user = await User.findById(_id);
            if(user.token === token){
                req.staffId = _id;
            }else{
                next(new Err(401, 'Login First!', "AUTHENTICATION_FAILED"));
            }
        } catch (error) {
            try {
                const { _id } = jwt.verify(token, JWT_PRIVATE);
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