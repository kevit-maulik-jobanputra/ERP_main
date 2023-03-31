const { Err } = require('../../middlewares/errorHandler');
const { findStudentById, getAttendances, getFractionalAttendance } = require('./attendances.DAL');
const { Attendance } = require('./attendances.model');

const addAttendance = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await findStudentById(studentId, next);
        if(student){
            student.attendance.push(req.body);
            await student.save();
            res.status(200).json(student);
        }else{
            next(new Err(400, 'No such student found!', 'BAD_REQUEST'));
        }
    } catch (error) {
        next(error)
    }
};

const updateAttendance = async (req, res, next) => {
    try {
        const { studentId, date } = req.params;
        const student = await findStudentById(studentId, next);
        if(!student){
            next(new Err(400, "No such student found!", "BAD_REQUEST"))
        }else{
            const attendance = student.attendance.find(day => day.date.toDateString() === new Date(date).toDateString());
            if(!attendance){
                next(new Err(400, "No such Date Found!", "BAD_REQUEST"))
            }else{
                for(const field in req.body){
                    attendance[field] = req.body[field];
                };
                await student.save();
                res.status(200).json(student);
            }
        }
    } catch (error) {
        next(error)
    }
};
const removeAttendance = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
};

const getAbsentees = async (req, res, next) => {
    try {
        const { date } = req.params;
        const isValidDate = (dateString => {
            const regEx = /^\d{4}-\d{2}-\d{2}$/;
            if(!dateString.match(regEx)) return false;
            const d = new Date(dateString);
            const dNum = d.getTime();
            if(!dNum && dNum !== 0) return false;
            return d.toISOString().slice(0,10) === dateString;
        });
        if(!isValidDate(date)){
            next(new Err(400, "Enter a valid date!", "BAD_REQUEST"))
        }else{
            for (const field in req.query){
                if(["contact", "batch", "currentSem"].includes(field)){
                  req.query[field] = Number(req.query[field])
                }
            }
            const students = await getAttendances(date, req.query, next);
            if(students){
                res.status(200).json(students);
            }
        }
    } catch (error) {
        next(error)
    }
};

const filterAbsentees = async (req, res, next) => {
    try {
        const { percent } = req.params;
        if(percent.match(/^[1-9][0-9]?$|^100$/) === null){
            next(new Err(400, "Enter a valid percentage!", "BAD_REQUEST"))
        }else{
            for (const field in req.query){
                if(["contact", "batch", "currentSem"].includes(field)){
                  req.query[field] = Number(req.query[field])
                }
            }
            const students = await getFractionalAttendance(Number(percent), req.query, next);
            if(students){
                res.status(200).json(students);
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { addAttendance, removeAttendance, updateAttendance, getAbsentees, filterAbsentees };