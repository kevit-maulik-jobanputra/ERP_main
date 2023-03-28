const express = require('express');
const { addBatch, getBatches, removeBatch, updateBatch, addBranch, removeBranch, updateBranch, vacantSeatsAnalytics } = require('./batches.controller');
const authenticate = require('../../middlewares/auth');
const validator = require('../../middlewares/validator');
const { batchAddValidationSchema, branchValidationSchema, updateBranchValidationSchema } = require('./batches.model');

class BatchRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // Adding a Batch
        this.router.post('/batches/addbatch', validator(batchAddValidationSchema), authenticate, addBatch);

        // Viewing all Batches
        this.router.get('/batches', authenticate, getBatches);

        // Getting Vacant Seats Analytics
        this.router.get('/batches/vacant', authenticate, vacantSeatsAnalytics)

        // Updating a Batch
        this.router.put('/batches/updatebatch/:id', validator(batchAddValidationSchema), authenticate, updateBatch);

        // Delete a Batch
        this.router.delete('/batches/remove/:id', authenticate, removeBatch);

        // Adding a Branch
        this.router.post('/batches/addbranch/:id', validator(branchValidationSchema), authenticate, addBranch);

        // Updating a Branch
        this.router.put('/batches/updatebranch/:batchId/:branchName', validator(updateBranchValidationSchema), authenticate, updateBranch);

        // Deleting a Branch
        this.router.delete('/batches/removebranch/:batchId/:branchName', authenticate, removeBranch);
    }
};

module.exports = BatchRouter;