const { Err } = require('../../middlewares/errorHandler');
const { Attendance } = require('./attendances.model');

const addStudentToAttendance = async (body, next) => {
    try {
        return await Attendance.create(body)
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    };
};

const removeStudentFromAttendance = async (id, next) => {
    try {
        return await Attendance.findOneAndDelete({student:id});
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const findStudentById = async (id, next) => {
    try {
        return await Attendance.findOne({student: id})
    } catch (error) {
        next(new Err(400, 'No such student found!', 'BAD_REQUEST'));
    }
}

module.exports = { addStudentToAttendance, removeStudentFromAttendance, findStudentById };