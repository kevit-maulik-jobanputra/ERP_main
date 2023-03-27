const express = require('express');
const authenticate = require('../../middlewares/auth');
const validator = require('../../middlewares/validator');
const { addAttendance, removeAttendance, updateAttendance } = require('./attendances.controller');
const { Attendance, attendanceValidationSchema, attendanceUpdateValidationSchema } = require('./attendances.model');

class AttendanceRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // Adding Attendance
        this.router.post('/attendances/add/:studentId', validator(attendanceValidationSchema), authenticate, addAttendance);

        // Removing Attendance
        this.router.delete('/attendances/remove/:studentId/:date', authenticate, removeAttendance);

        // Updating Attendance
        this.router.put('/attendances/update/:studentId/:date', validator(attendanceUpdateValidationSchema), authenticate, updateAttendance)
    }
}

module.exports = AttendanceRouter;