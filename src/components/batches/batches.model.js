const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    year: {
        type: Number,
        require: true,
        unique: true
    },
    branches: [{
        name:{
            type: String,
            required: true
        },
        totalStudentsIntake: {
            type: Number,
            required: true
        }
    }]
});

const batchAddValidationSchema = {
    year: {
        trim: true,
        isInt: true,
        errorMessage: "Year should be number!",
        isLength: {
            options: {min: 4, max: 4},
            errorMessage: "Year should contain exact 4 characters!"
        },
        custom : {
            options: ((value, {req}) => {
                return Batch.findOne({year:value})
                .then(batch => {
                    if(batch._id.toHexString() !== req.params.id){
                        throw new Error('Batch already exists!')
                    };
                    return true;
                })
            })
        }
    }
};

const branchValidationSchema = {
    name: {
        trim: true,
        isString: true,
        errorMessage: "Name should not be a number!",
        isLength: {
            options: {min: 2},
            errorMessage: "Name should contain atleast 2 characters!"
        },
        custom: {
            options: ((value, {req}) => {
                return Batch.findById(req.params.id)
                .then(batch => {
                    if(batch.branches.find(branch => branch.name === value)){
                        throw new Error('Branch already exists!')
                    };
                    return true;
                })
            })
        }
    },
    totalStudentsIntake: {
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: "TotalStudentsIntake cannot be empty!"
        },
        isInt: true,
        errorMessage: "TotalStudentsIntake should be an integer!"
    }
};

const updateBranchValidationSchema = {
    name: {
        trim: true,
        isString: true,
        errorMessage: "Name should not be a number!",
        isLength: {
            options: {min: 2},
            errorMessage: "Name should contain atleast 2 characters!"
        },
        custom: {
            options: ((value, {req}) => {
                return Batch.findById(req.params.batchId)
                .then(batch => {
                    const branch = batch.branches.find(branch => branch.name === value);
                    if(branch && value !== req.params.branchName){
                        throw new Error('Branch already exists!')
                    };
                    return true;
                })
            })
        }
    },
    totalStudentsIntake: {
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: "TotalStudentsIntake cannot be empty!"
        },
        isInt: true,
        errorMessage: "TotalStudentsIntake should be an integer!"
    }
}

const Batch = mongoose.model('Batch', batchSchema);

module.exports = { Batch, batchAddValidationSchema, branchValidationSchema, updateBranchValidationSchema };