const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    year: {
        type: Number,
        require: true
    },
    branches: [
        {
            name: {
                type: String,
                require: true,
                unique: true
            },
            totalStudentsIntake: {
                type: Number,
                require: true,
            }
        }
    ]
})

const Batch = mongoose.model('Batch', batchSchema);

module.exports = { Batch };