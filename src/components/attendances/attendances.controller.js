const { Err } = require('../../middlewares/errorHandler');
const { findStudentById } = require('./attendances.DAL');

const addAttendance = async (req, res, next) => {
    try {
        if(!req.adminId && !req.staffId){
            next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
          }else{
            const { studentId } = req.params;
            const student = await findStudentById(studentId, next);
            if(student){
                student.attendance.push(req.body);
                await student.save();
                res.status(200).json(student);
            }else{
                next(new Err(400, 'No such student found!', 'BAD_REQUEST'));
            }
          }
    } catch (error) {
        next(error)
    }
};

const updateAttendance = async (req, res, next) => {
    try {
        if(req.adminId || req.staffId){
            const { studentId, date } = req.params;
            const student = await findStudentById(studentId, next);
            if(!student){
                next(new Err(400, "No such student found!", "BAD_REQUEST"))
            }else{
                const attendance = student.attendance.find(day => day.date.toDateString() === new Date(date).toDateString());
                if(!attendance){
                    next(new Err(400, "No such Date Found!", "BAD_REQUEST"))
                }else{
                    attendance.isPresent = req.body.isPresent;
                    await student.save();
                    res.status(200).json(student);
                }
            }
        }else{
            next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};
const removeAttendance = async (req, res, next) => {
    try {
        if(req.adminId || req.staffId){
            const { studentId, date } = req.params;
            const student = await findStudentById(studentId, next);
            if(!student){
                next(new Err(400, "No such student found!", "BAD_REQUEST"))
            }else{
                const attendanceINdex = student.attendance.findIndex(day => day.date.toDateString() === new Date(date).toDateString());
                if(attendanceINdex === -1){
                    next(new Err(400, "No such Date Found!", "BAD_REQUEST"))
                }else{
                    student.attendance.splice(attendanceINdex,1) ;
                    await student.save();
                    res.status(200).json(student);
                }
            }
        }else{
            next(new Err(401, 'Login first!', "AUTHENTICATION_FAILED"));
        }
    } catch (error) {
        next(error)
    }
};

module.exports = { addAttendance, removeAttendance, updateAttendance };