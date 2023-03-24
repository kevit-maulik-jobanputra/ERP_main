const mongoose = require('mongoose');

const studentsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    contact: {
        type: Number,
        require: true
    },
    batch: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Batch',
        require: true
    },
    branch: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Batch",
        require: true
    },
    currentSem: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
});


const studentValidationSchema = {
    firstName : {
        trim: true,
        isLength: {
            options: {min:3},
            errorMessage: "First name must contain atleast 3 alphabets!"
        }
    },
    lastName : {
        trim: true,
        isLength: {
            options: {min:3},
            errorMessage: "Last name must contain atleast 3 alphabets!"
        }
    },
    contact: {
        trim: true,
        isMobilePhone: {
            options: ['en-IN']
        },
        errorMessage: 'Enter a valid mobile number!',
    },
    batch: {
        isEmpty: {
            negated: true,
            errorMessage: 'Batch cannot be empty!'
        }
    },
    branch: {
        isEmpty: {
            negated: true,
            errorMessage: 'Batch cannot be empty!'
        }
    },
    currentSem: {
        isInt: {
            options: {min:1, max:8}
        },
        errorMessage: 'CurrentSem must be an integer from 1 to 8!'
    }
};

const Student = mongoose.model("Student", studentsSchema);

module.exports = { Student, studentValidationSchema };