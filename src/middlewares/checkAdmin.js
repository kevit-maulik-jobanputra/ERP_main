const { Err } = require('./errorHandler');

const checkAdmin = async (req, res, next) => {
    try {
        if(!req.adminId){
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"))
        }else{
            next();
        }
    } catch (error) {
        next(error)
    }
}
module.exports = checkAdmin;