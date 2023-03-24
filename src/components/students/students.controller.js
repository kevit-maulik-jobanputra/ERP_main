const { Err } = require('../../middlewares/errorHandler');
const { createStudent, findStudents, findStudentById } = require('./students.DAL');
const { getBatchById } = require('../batches/batches.DAL');

const addStudent = async (req, res, next) => {
    try {
      if(!req.adminId && !req.staffId){
        next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
      }else{
        const student = await createStudent(req.body, next);
        if(student){
            res.status(200).json(student);
        }
      }
    } catch (error) {
        next(error)
    };
};

const getStudents = async (req, res, next) => {
    try {
        if(!req.adminId && !req.staffId){
            next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
          }else{
            const students = await findStudents(next);
            if(students){
                res.status(200).json(students);
            }
          }
    } catch (error) {
        next(error);
    }
};

const updateStudent = async (req, res, next) => {
    try {
      if(!req.adminId && !req.staffId){
        next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
      }else{
        const { id } = req.params;
        const student = await findStudentById(id, next);
        if(student){
            for(const field in req.body){
                student[field] = req.body[field]
            };
            await student.save();
            res.status(200).json(student);
        }else{
            next(new Err(400, "No student found!", "BAD_REQUEST"))
        }
      }
    } catch (error) {
        next(error)
    };
};

const removeStudent = async (req, res, next) => {
    try {
      if(!req.adminId && !req.staffId){
        next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
      }else{
        const { id } = req.params;
        const student = await findStudentById(id, next);
        if(student){
            await student.deleteOne();
            res.status(200).json(student);
        }else{
            next(new Err(400, "No student found!", "BAD_REQUEST"))
        }
      }
    } catch (error) {
        next(error)
    };
};

module.exports = { addStudent, getStudents, removeStudent, updateStudent };