const { User } = require("../users/users.modal");
const { Err } = require('../../middlewares/errorHandler');

const createSingleUser = async (body, next) => {
    try {
        return await User.create(body);
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error))
    }
};

const findUsers = async (next) => {
    try {
        return await User.find({isAdmin: false})
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error))
    }
};


module.exports = { createSingleUser, findUsers };