const { MONGO_URL } = require('../environment/config');

const dbConnection = {
    url : MONGO_URL
};

module.exports = dbConnection;