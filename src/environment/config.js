require('dotenv').config();
const { cleanEnv, port, str, url } = require('envalid');

const env = cleanEnv(process.env, {
    PORT: port({
        default:3000
    }),
    NODE_ENV: str({
        default: 'production',
        devDefault: 'development'
    }),
    MONGO_URL: url({
        default: 'mongodb://127.0.0.1:27017/erp-main',
        devDefault: 'mongodb://127.0.0.1:27017/erp-dev'
    })
});

const environment = {
    PORT : env.PORT,
    NODE_ENV: env.NODE_ENV,
    MONGO_URL: env.MONGO_URL
};

module.exports = environment;