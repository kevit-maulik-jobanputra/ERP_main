const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Student",
        unique: true,
        require: "true"
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        isPresent: {
            type: Boolean,
            required: true
        }
    }]
});

const attendanceValidationSchema = {
    date: {
        trim:true,
        isDate: true,
        errorMessage: 'Enter a valid date!',
        custom: {
            options: ((value, {req}) => {
                return Attendance.findOne({student: req.params.studentId}).
                then(student => {
                    const duplicate = student.attendance.find(day => day.date.toDateString() === new Date(value).toDateString());
                    if(duplicate){
                        throw new Error('Date already exists!')
                    };
                    return true;
                })
            })
        }
    },
    isPresent: {
        trim: true,
        isBoolean : true,
        errorMessage: 'IsPresent should be either true or false!'
    },
};

const attendanceUpdateValidationSchema = {
    isPresent: {
        trim: true,
        isBoolean : true,
        errorMessage: 'IsPresent should be either true or false!'
    },
}

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { Attendance, attendanceValidationSchema, attendanceUpdateValidationSchema };