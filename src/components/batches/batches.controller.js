const { createBatch, findBatches, getBatchById, getVacantSeats } = require('./batches.DAL');
const { Err } = require('../../middlewares/errorHandler');

const addBatch = async (req, res, next) => {
    try {
        const batch = await createBatch(req.body, next);
        if(batch){
            res.status(200).json(batch);
        };
    } catch (error) {
        next(error)
    }
};

const getBatches = async (req, res, next) => {
    try {
        const batches = await findBatches(next);
        if(batches.length === 0){
            next(new Err(404, "No batches Found!", "BATCHES_NOT_FOUND"))
        }else{
            res.status(200).json(batches);
        }
    } catch (error) {
        next(error)
    }
};

const vacantSeatsAnalytics = async (req, res, next) => {
    try {
        const { batch, dept } = req.query;
        const batches = await getVacantSeats(next);
        if(batches.length === 0){
            next(new Err(404, "No batches Found!", "BATCHES_NOT_FOUND"))
        }else{
            if(batch){
                const analytics = batches.filter(year => {
                    if(year.batch == batch){
                        if(dept){
                            for (const field in year.branches){
                                if(field !== dept){
                                    delete year.branches[field];
                                } 
                            }
                        }
                        return year
                    };
                })
                res.status(200).json(analytics);
            }else{
                res.status(200).json(batches);
            }
            
        };
    } catch (error) {
        next(error)
    }
};

const updateBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await getBatchById(id, next);
        batch.year = req.body.year;
        await batch.save();
        res.status(200).json(batch);
    } catch (error) {
        next(error)
    }
};

const removeBatch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await getBatchById(id, next);
        await batch.deleteOne();
        res.status(200).json(batch);
    } catch (error) {
        next(error)
    }
};

const addBranch = async (req, res, next) => {
    try {
        const { id } = req.params;
        const batch = await getBatchById(id, next);
        batch.branches.push(req.body);
        await batch.save();
        res.status(200).json(batch);
    } catch (error) {
        next(error)
    }
};

const updateBranch = async (req, res, next) => {
    try {
        const { batchId, branchName } = req.params;
        const batch = await getBatchById(batchId, next);
        if(!batch){
            next(new Err(400, "No such batch found!", "BAD_REQUEST"))
        }else{
            const branch = batch.branches.find(branch => branch.name === branchName);
            if(!branch){
                next(new Err(400, "No such Branch Found!", "BAD_REQUEST"))
            }else{
                for(const field in req.body){
                    branch[field] = req.body[field];
                }
                await batch.save();
                res.status(200).json(batch);
            }
        }
    } catch (error) {
        next(error)
    }
};

const removeBranch = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
};


module.exports = { addBatch, getBatches, removeBatch, updateBatch, addBranch, updateBranch, removeBranch, vacantSeatsAnalytics }