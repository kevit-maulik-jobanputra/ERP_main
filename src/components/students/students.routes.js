const express = require('express');
const { addStudent, getStudents, removeStudent, updateStudent, getTotalStudents } = require('./students.controller');
const validator = require('../../middlewares/validator');
const { studentValidationSchema } = require('./students.model');
const authenticate = require('../../middlewares/auth');

class StudentRouter{
    constructor(){
        this.path = "students";
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes(){

        // Adding a Student
        this.router.post(`/${this.path}/addstudent`, validator(studentValidationSchema), authenticate, addStudent);

        // Listing Students
        this.router.get(`/${this.path}`, authenticate, getStudents);

        // Listing Total Students YearWise & BranchWise
        this.router.get(`/${this.path}/yearlyanalytics`, authenticate, getTotalStudents)

        // Updating a Student
        this.router.put(`/${this.path}/update/:id`, validator(studentValidationSchema), authenticate, updateStudent)

        // Deleting a Student
        this.router.delete(`/${this.path}/remove/:id`, authenticate, removeStudent)
    }
};

module.exports = StudentRouter;