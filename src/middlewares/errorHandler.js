class Err extends Error{
    constructor(statusCode, message, errCode, err){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.errCode = errCode;
        this.originalError = err;
    }
};

const errorHandler = (err, req, res, next) => {
    
    if(err && err.originalError && err.statusCode){
        req.log.trace(`${err.errCode} >> ${err.message} >> ${JSON.stringify(err.originalError,null,2)}`);
    }else if(err && err.errCode){
        req.log.error(`${err.errCode} >> ${err.message}`);
    }else{
        req.log.error(err);
    };

    if(err && err.statusCode){
        res.status(err.statusCode).json({
            errorCode: err.errCode,
            message: err.message,
            error: err.originalError
        })
    }else{
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR!',
            message: 'An unexpected error occurred!'
        })
    };
}

module.exports = { Err, errorHandler };