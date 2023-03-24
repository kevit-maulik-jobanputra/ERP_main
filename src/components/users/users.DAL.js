const { User } = require("./users.model");
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
        return await User.find();
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error))
    }
};

const findByEmail = async (email, next) => {
    try {
        return await User.findOne({email});
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error))
    }
}

const findById = async (id, next) => {
    try {
        return await User.findById(id)
    } catch (error) {
        next(new Err(400, "No user found!", "BAD_REQUEST"))
    }
};

module.exports = { createSingleUser, findUsers, findByEmail, findById };