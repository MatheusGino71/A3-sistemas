/**
 * ZENIT - Sistema de Logging Avançado
 * Logs estruturados com níveis e rotação automática
 */

const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

// Níveis de log customizados
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Cores para cada nível
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

// Formato do log
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;
        
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
    })
);

// Formato para console (mais legível)
const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;
        let log = `${timestamp} ${level}: ${message}`;
        
        if (meta.userId) log += ` | User: ${meta.userId}`;
        if (meta.ip) log += ` | IP: ${meta.ip}`;
        if (meta.duration) log += ` | Duration: ${meta.duration}ms`;
        
        return log;
    })
);

// Configuração de transports
const transports = [
    // Console
    new winston.transports.Console({
        format: consoleFormat,
        level: process.env.LOG_LEVEL || 'info',
    }),
    
    // Arquivo de erros com rotação diária
    new DailyRotateFile({
        filename: path.join('logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: format,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
    }),
    
    // Arquivo de todos os logs com rotação diária
    new DailyRotateFile({
        filename: path.join('logs', 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        format: format,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true,
    }),
    
    // Arquivo de logs HTTP
    new DailyRotateFile({
        filename: path.join('logs', 'http-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'http',
        format: format,
        maxSize: '20m',
        maxFiles: '7d',
        zippedArchive: true,
    }),
];

// Criar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format,
    transports,
    exitOnError: false,
});

/**
 * Logger especializado para auditoria
 */
const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join('logs', 'audit-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true,
        }),
    ],
});

/**
 * Logger para eventos de segurança
 */
const securityLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join('logs', 'security-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '90d',
            zippedArchive: true,
        }),
    ],
});

/**
 * Middleware de logging HTTP
 */
function httpLogger(req, res, next) {
    const start = Date.now();
    
    // Log após a resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?.id,
        };
        
        if (res.statusCode >= 500) {
            logger.error('HTTP Request Error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('HTTP Request Warning', logData);
        } else {
            logger.http('HTTP Request', logData);
        }
    });
    
    next();
}

/**
 * Log de auditoria para ações importantes
 */
function logAudit(action, userId, details = {}) {
    auditLogger.info({
        action,
        userId,
        timestamp: new Date().toISOString(),
        ...details,
    });
}

/**
 * Log de eventos de segurança
 */
function logSecurity(event, severity, details = {}) {
    securityLogger.warn({
        event,
        severity,
        timestamp: new Date().toISOString(),
        ...details,
    });
}

/**
 * Middleware de tratamento de erros com logging
 */
function errorHandler(err, req, res, next) {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id,
        body: req.body,
    };
    
    logger.error('Application Error', errorDetails);
    
    // Log de segurança para erros críticos
    if (err.name === 'UnauthorizedError' || err.status === 403) {
        logSecurity('Unauthorized Access Attempt', 'HIGH', {
            ip: req.ip,
            url: req.originalUrl,
            userId: req.user?.id,
        });
    }
    
    // Não expor detalhes internos em produção
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({
            error: 'Internal Server Error',
            message: err.status < 500 ? err.message : 'Algo deu errado',
        });
    } else {
        res.status(err.status || 500).json({
            error: err.name,
            message: err.message,
            stack: err.stack,
        });
    }
}

/**
 * Helper para criar logs contextualizados
 */
function createContextLogger(context) {
    return {
        error: (message, meta = {}) => logger.error(message, { ...context, ...meta }),
        warn: (message, meta = {}) => logger.warn(message, { ...context, ...meta }),
        info: (message, meta = {}) => logger.info(message, { ...context, ...meta }),
        http: (message, meta = {}) => logger.http(message, { ...context, ...meta }),
        debug: (message, meta = {}) => logger.debug(message, { ...context, ...meta }),
    };
}

/**
 * Stream para integração com morgan (HTTP logger)
 */
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

module.exports = {
    logger,
    auditLogger,
    securityLogger,
    httpLogger,
    logAudit,
    logSecurity,
    errorHandler,
    createContextLogger,
    stream,
};
