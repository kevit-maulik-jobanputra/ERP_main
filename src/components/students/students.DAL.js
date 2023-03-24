const { Err } = require('../../middlewares/errorHandler');
const { Student } = require('./students.model');

const createStudent = async (body, next) => {
    try {
        return await Student.create(body);
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const findStudentById = async (id, next) => {
    try {
        return await Student.findById(id);
    } catch (error) {
        next(new Err(400, "No student found!", "BAD_REQUEST"));
    }
};

const findStudents = async (next) => {
    try {
        return await Student.aggregate([
            {
              $lookup:
                {
                  from: "batches",
                  localField: "batch",
                  foreignField: "_id",
                  as: "batch",
                },
            },
            {
              $project:
                {
                  firstName: 1,
                  lastName: 1,
                  contact: 1,
                  currentSem: 1,
                  branch: 1,
                  batch: {
                    $arrayElemAt: ["$batch", 0],
                  },
                },
            },
            {
              $project:
                {
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
              $project:
                {
                  firstName: 1,
                  lastName: 1,
                  contact: 1,
                  currentSem: 1,
                  batch: 1,
                  branch: "$branch.name",
                },
            },
          ]);
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

module.exports = { createStudent, findStudents, findStudentById };