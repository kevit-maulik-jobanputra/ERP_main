const { Batch } = require('./batches.model');
const { Err } = require('../../middlewares/errorHandler');

const createBatch = async (body, next) => {
    try {
        return await Batch.create(body)
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const findBatches = async (next) => {
    try {
        return await Batch.find();
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
};

const getBatchById = async (id, next) => {
    try {
        return await Batch.findById(id);
    } catch (error) {
        next(new Err(400, "No batch found!", "BAD_REQUEST"))
    }
};

const getVacantSeats = async (next) => {
    try {
        return await Batch.aggregate([[
            {
              $lookup: {
                from: "students",
                localField: "branches._id",
                foreignField: "branch",
                as: "students",
              },
            },
            {
              $project: {
                _id: 0,
                batch: "$year",
                totalStudents: {
                  $size: "$students",
                },
                totalStudentsIntake: {
                  $sum: "$branches.totalStudentsIntake",
                },
                CE: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$branches",
                        as: "branches",
                        cond: {
                          $eq: ["$$branches.name", "CE"],
                        },
                      },
                    },
                    0,
                  ],
                },
                ME: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$branches",
                        as: "branches",
                        cond: {
                          $eq: ["$$branches.name", "ME"],
                        },
                      },
                    },
                    0,
                  ],
                },
                EC: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$branches",
                        as: "branches",
                        cond: {
                          $eq: ["$$branches.name", "EC"],
                        },
                      },
                    },
                    0,
                  ],
                },
                students: 1,
              },
            },
            {
              $project: {
                batch: 1,
                totalStudents: 1,
                totalStudentsIntake: 1,
                availableIntake: {
                  $subtract: [
                    "$totalStudentsIntake",
                    "$totalStudents",
                  ],
                },
                branches: {
                  CE: {
                    totalStudents: {
                      $size: {
                        $filter: {
                          input: "$students",
                          as: "students",
                          cond: {
                            $eq: [
                              "$$students.branch",
                              "$CE._id",
                            ],
                          },
                        },
                      },
                    },
                    totalStudentsIntake:
                      "$CE.totalStudentsIntake",
                  },
                  ME: {
                    totalStudents: {
                      $size: {
                        $filter: {
                          input: "$students",
                          as: "students",
                          cond: {
                            $eq: [
                              "$$students.branch",
                              "$ME._id",
                            ],
                          },
                        },
                      },
                    },
                    totalStudentsIntake:
                      "$ME.totalStudentsIntake",
                  },
                  EC: {
                    totalStudents: {
                      $size: {
                        $filter: {
                          input: "$students",
                          as: "students",
                          cond: {
                            $eq: [
                              "$$students.branch",
                              "$EC._id",
                            ],
                          },
                        },
                      },
                    },
                    totalStudentsIntake:
                      "$EC.totalStudentsIntake",
                  },
                },
              },
            },
            {
              $addFields: {
                "branches.CE.availableIntake": {
                  $subtract: [
                    "$branches.CE.totalStudentsIntake",
                    "$branches.CE.totalStudents",
                  ],
                },
                "branches.ME.availableIntake": {
                  $subtract: [
                    "$branches.ME.totalStudentsIntake",
                    "$branches.ME.totalStudents",
                  ],
                },
                "branches.EC.availableIntake": {
                  $subtract: [
                    "$branches.EC.totalStudentsIntake",
                    "$branches.EC.totalStudents",
                  ],
                },
              },
            },
          ]])
    } catch (error) {
        next(new Err(500, 'An unexpected error occurred!', 'INTERNAL_SERVER_ERROR!', error));
    }
}

module.exports = { createBatch, findBatches, getBatchById, getVacantSeats };