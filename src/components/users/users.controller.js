const { createSingleUser, findUsers } = require('./user.DAL');
const { Err } = require('../../middlewares/errorHandler')

const signUpUser =  async (req, res, next) => {
    try {
        const user = await createSingleUser(req.body, next);
        if(user){
            res.status(200).json(user);
        };
    } catch (error) {
        next(error)
    };
};

const getUsers = async (req, res, next) => { 
    try {
        const users = await findUsers(next);
        if(users){
            if(users.length === 0){
                next(new Err(404, "No users Found!", "USER_NOT_FOUND"))
            }else{
                res.status(200).json(users);
            };
        };
    }catch (err) {
        next(err)
    };
}

module.exports = { signUpUser, getUsers }