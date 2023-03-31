const pino = require('pino');
const PinoHttp = require('pino-http');
const Config = require('../environment/config')

// formate logs for env
const pinoFormateConfig = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            colorize: true,
        },
    },
});

const debugConfig = {
    res(reply) {
        if (!Config.DEBUG_MODE) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return reply;
    },
    req(request) {
        if (!Config.DEBUG_MODE) {
            return;
        }
        // eslint-disable-next-line consistent-return
        return request;
    },
};

const customLogger = {
    development: PinoHttp({
        redact: ['HTTP_Request.headers'],
        logger: pinoFormateConfig,
        level: 'trace',
        customLogLevel(res, err) {
            if (err) {
                return 'error';
            }
            if (res && res.statusCode === 500) {
                return 'fatal';
            }
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'error';
            }
            return 'info';
        },
        customSuccessMessage(res) {
            return `Request completed with statusCode ${res.statusCode}`;
        },
        customErrorMessage(error) {
            return error.message;
        },
        customAttributeKeys: {
            req: 'HTTP_Request',
            res: 'HTTP_Response',
            err: 'HTTP_Error',
            responseTime: 'Execute_Time',
        },
        serializers: debugConfig,
    }),
    production: PinoHttp({
        redact: ['req.headers'],
        logger: pino(),
        levelFirst: true,
        serializers: {
            res(reply) {
                if (!Config.DEBUG_MODE) {
                    return;
                }
                // eslint-disable-next-line consistent-return
                return {
                    statusCode: reply.statusCode,
                };
            },
            req(request) {
                if (!Config.DEBUG_MODE) {
                    return;
                }
                // eslint-disable-next-line consistent-return
                return {
                    method: request.method,
                    url: request.url,
                    path: request.path,
                    parameters: request.parameters,
                    // Including the headers in the log could be in violation
                    // of privacy laws, e.g. GDPR. You should use the "redact" option to
                    // remove sensitive fields. It could also leak authentication data in
                    // the logs.
                    headers: request.headers,
                    hostname: request.hostname,
                    remoteAddress: request.ip,
                };
            },
        },
    }),
};

module.exports = { pinoFormateConfig, customLogger };