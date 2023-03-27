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

const findStudents = async (queryObj, next) => {
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
            {
              $match : queryObj
            },
          ]);
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};
const findTotalStudents = async (next) => {
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
            {
              $group: {
                _id: "$batch",
                students: {
                  $push: {
                    branch: "$branch",
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id",
                totalStudents: {
                  $size: "$students",
                },
                branches: {
                  CE: {
                    $size: {
                      $filter: {
                        input: "$students",
                        as: "students",
                        cond: {
                          $eq: ["$$students.branch", "CE"],
                        },
                      },
                    },
                  },
                  ME: {
                    $size: {
                      $filter: {
                        input: "$students",
                        as: "students",
                        cond: {
                          $eq: ["$$students.branch", "ME"],
                        },
                      },
                    },
                  },
                  EC: {
                    $size: {
                      $filter: {
                        input: "$students",
                        as: "students",
                        cond: {
                          $eq: ["$$students.branch", "EC"],
                        },
                      },
                    },
                  },
                },
              },
            }
          ]);
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

module.exports = { createStudent, findStudents, findStudentById, findTotalStudents };