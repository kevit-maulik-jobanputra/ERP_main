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
};

const getAttendances = async (date, queryObj, next) => {
    try {
        return await Attendance.aggregate([[
            {
              $match:
                {
                  attendance: {
                    $elemMatch: {
                      date: new Date(date),
                      isPresent: false,
                    },
                  },
                },
            },
            {
                $lookup: 
                    {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student",
                },
            },
            {
                $project: {
                    student: {
                    $arrayElemAt: ["$student", 0],
                    },
                    _id: 0,
                },
            },
            {
                $lookup: {
                    from: "batches",
                    localField: "student.batch",
                    foreignField: "_id",
                    as: "student.batch",
                },
            },
            {
                $project: {
                    firstName: "$student.firstName",
                    lastName: "$student.lastName",
                    contact: "$student.contact",
                    currentSem: "$student.currentSem",
                    branch: "$student.branch",
                    batch: {
                    $arrayElemAt: ["$student.batch", 0],
                    },
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    contact: 1,
                    currentSem: 1,
                    batch: "$batch.year",
                    branch: {
                        $arrayElemAt: [
                            {
                            $filter: {
                                input: "$batch.branches",
                                as: "branches",
                                cond: {
                                $eq: [
                                    "$branch",
                                    "$$branches._id",
                                ],
                                },
                            },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    contact: 1,
                    currentSem: 1,
                    batch: 1,
                    branch: "$branch.name",
                },
            },
            {
                $match: queryObj
            }
        ]])
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
}

module.exports = { addStudentToAttendance, removeStudentFromAttendance, findStudentById, getAttendances };