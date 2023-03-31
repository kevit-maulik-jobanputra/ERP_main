const express = require('express');
const authenticate = require('../../middlewares/auth');
const validator = require('../../middlewares/validator');
const { addAttendance, removeAttendance, updateAttendance, getAbsentees, filterAbsentees } = require('./attendances.controller');
const { getFractionalAttendance } = require('./attendances.DAL');
const { Attendance, attendanceValidationSchema, attendanceUpdateValidationSchema } = require('./attendances.model');

class AttendanceRouter{
    constructor(){
        this.path = "attendances"
        this.router = express.Router();
        this.initializeRoutes();
    };

    initializeRoutes(){

        // Adding Attendance
        this.router.post(`/${this.path}/add/:studentId`, validator(attendanceValidationSchema), authenticate, addAttendance);

        // Getting Attendance
        this.router.get(`/${this.path}/absentees/:date`, authenticate, getAbsentees);

        // Filtering Absentees
        this.router.get(`/${this.path}/filter/:percent`, authenticate, filterAbsentees);

        // Removing Attendance
        this.router.delete(`/${this.path}/remove/:studentId/:date`, authenticate, removeAttendance);

        // Updating Attendance
        this.router.put(`/${this.path}/update/:studentId/:date`, validator(attendanceUpdateValidationSchema), authenticate, updateAttendance)
    }
}

module.exports = AttendanceRouter;