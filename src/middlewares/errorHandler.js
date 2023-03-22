class Err extends Error{
    constructor(statusCode, message, errCode, err, meta){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.errCode = errCode;
        this.originalError = err;
        this.meta = meta;
    }
};

const errorHandler = (err, req, res, next) => {
    let meta;
    if(err.meta){
        meta = {...err.meta, ...{traceId : req.id}}
    }else{
        meta = {traceId: req.id}
    };

    if(err && err.originalError && err.statusCode){
        console.log(`${err.errCode} >> ${err.message} >> ${err.originalError}`);
    }else if(err && err.originalError){
        console.log(`${err.originalError} >> ${err.message}`);
    }else if(err && err.errCode){
        console.log(`${err.errCode} >> ${err.message}`);
    }else{
        console.log(err);
    };

    if(err && err.statusCode){
        res.status(err.statusCode).json({
            error: err.errCode,
            message: err.message,
            meta
        })
    }else{
        res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR!',
            message: 'An unexpected error occurred!'
        })
    };
}

module.exports = { Err, errorHandler };