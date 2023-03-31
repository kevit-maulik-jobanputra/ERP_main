const express = require('express');
const { addBatch, getBatches, removeBatch, updateBatch, addBranch, removeBranch, updateBranch, vacantSeatsAnalytics } = require('./batches.controller');
const authenticate = require('../../middlewares/auth');
const validator = require('../../middlewares/validator');
const checkAdmin = require('../../middlewares/checkAdmin.js')
const { batchAddValidationSchema, branchValidationSchema, updateBranchValidationSchema } = require('./batches.model');

class BatchRouter{
    constructor(){
        this.path = "batches";
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // Adding a Batch
        this.router.post(`/${this.path}/addbatch`, validator(batchAddValidationSchema), authenticate, checkAdmin, addBatch);

        // Viewing all Batches
        this.router.get(`/${this.path}`, authenticate, checkAdmin, getBatches);

        // Getting Vacant Seats Analytics
        this.router.get(`/${this.path}/vacant`, authenticate, checkAdmin, vacantSeatsAnalytics)

        // Updating a Batch
        this.router.put(`/${this.path}/updatebatch/:id`, validator(batchAddValidationSchema), authenticate, checkAdmin, updateBatch);

        // Delete a Batch
        this.router.delete(`/${this.path}/remove/:id`, authenticate, checkAdmin, removeBatch);

        // Adding a Branch
        this.router.post(`/${this.path}/addbranch/:id`, validator(branchValidationSchema), authenticate, checkAdmin, addBranch);

        // Updating a Branch
        this.router.put(`/${this.path}/updatebranch/:batchId/:branchName`, validator(updateBranchValidationSchema), authenticate, checkAdmin, updateBranch);

        // Deleting a Branch
        this.router.delete(`/${this.path}/removebranch/:batchId/:branchName`, authenticate, checkAdmin, removeBranch);
    }
};

module.exports = BatchRouter;