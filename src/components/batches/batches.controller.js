const { createBatch, findBatches, getBatchById } = require('./batches.DAL');
const { Err } = require('../../middlewares/errorHandler');

const addBatch = async (req, res, next) => {
    try {
        if (req.adminId) {
            const batch = await createBatch(req.body, next);
            if(batch){
                res.status(200).json(batch);
            };
        } else {
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const getBatches = async (req, res, next) => {
    try {
        if(req.adminId){
            const batches = await findBatches(next);
            if(batches.length === 0){
                next(new Err(404, "No users Found!", "USER_NOT_FOUND"))
            }else{
                res.status(200).json(batches);
            }
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const updateBatch = async (req, res, next) => {
    try {
        if(req.adminId){
            const { id } = req.params;
            const batch = await getBatchById(id, next);
            batch.year = req.body.year;
            await batch.save();
            res.status(200).json(batch);
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const removeBatch = async (req, res, next) => {
    try {
        if(req.adminId){
            const { id } = req.params;
            const batch = await getBatchById(id, next);
            await batch.deleteOne();
            res.status(200).json(batch);
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const addBranch = async (req, res, next) => {
    try {
        if(req.adminId){
            const { id } = req.params;
            const batch = await getBatchById(id, next);
            batch.branches.push(req.body);
            await batch.save();
            res.status(200).json(batch);
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const updateBranch = async (req, res, next) => {
    try {
        if(req.adminId){
            const { batchId, branchName } = req.params;
            const batch = await getBatchById(batchId, next);
            if(!batch){
                next(new Err(400, "No such batch found!", "BAD_REQUEST"))
            }else{
                const branchIndex = batch.branches.findIndex(branch => branch.name === branchName);
                if(branchIndex === -1){
                    next(new Err(400, "No such Branch Found!", "BAD_REQUEST"))
                }else{
                    for(const field in req.body){
                        batch.branches[branchIndex][field] = req.body[field]
                    };
                    await batch.save();
                    res.status(200).json(batch);
                }
            }
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

const removeBranch = async (req, res, next) => {
    try {
        if(req.adminId){
            const { batchId, branchName } = req.params;
            const batch = await getBatchById(batchId, next);
            if(!batch){
                next(new Err(400, "No such batch found!", "BAD_REQUEST"))
            }else{
                const branchIndex = batch.branches.findIndex(branch => branch.name === branchName);
                if(branchIndex === -1){
                    next(new Err(400, "No such Branch Found!", "BAD_REQUEST"))
                }else{
                    batch.branches.splice(branchIndex,1) ;
                    await batch.save();
                    res.status(200).json(batch);
                }
            }
        }else{
            next(new Err(403, 'You are not authorized!', "AUTHORIZATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};


module.exports = { addBatch, getBatches, removeBatch, updateBatch, addBranch, updateBranch, removeBranch }