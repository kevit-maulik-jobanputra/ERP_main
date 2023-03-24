const { Batch } = require('./batches.model');
const { Err } = require('../../middlewares/errorHandler');

const createBatch = async (body, next) => {
    try {
        return await Batch.create(body)
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const findBatches = async (next) => {
    try {
        return await Batch.find();
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const getBatchById = async (id, next) => {
    try {
        return await Batch.findById(id);
    } catch (error) {
        next(new Err(400, "No batch found!", "BAD_REQUEST"))
    }
}

module.exports = { createBatch, findBatches, getBatchById };