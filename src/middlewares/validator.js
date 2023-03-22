const { checkSchema, validationResult } = require('express-validator');
const { Err } = require('./errorHandler');

const validator = (schema) => {
    return async(req, res, next) => {
        await checkSchema(schema).run(req);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            next(new Err(400, "MiddleWare validation failed!", "VALIDATION_ERROR", {...errors.mapped()}))
        }else{
            next();
        }
    }
}

module.exports = validator;