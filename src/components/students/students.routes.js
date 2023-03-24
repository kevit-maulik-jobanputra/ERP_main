const express = require('express');
const { addStudent, getStudents, removeStudent, updateStudent } = require('./students.controller');
const validator = require('../../middlewares/validator');
const { studentValidationSchema } = require('./students.model');
const authenticate = require('../../middlewares/auth');

class StudentRouter{
    constructor(){
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes(){

        // Adding a Student
        this.router.post('/students/addstudent', validator(studentValidationSchema), authenticate, addStudent);

        // Listing Students
        this.router.get('/students', authenticate, getStudents);

        // Updating a Student
        this.router.put('/students/update/:id', validator(studentValidationSchema), authenticate, updateStudent)

        // Deleting a Student
        this.router.delete('/students/remove/:id', authenticate, removeStudent)
    }
};

module.exports = StudentRouter;