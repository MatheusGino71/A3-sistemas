/**
 * ZENIT - Middleware de Rate Limiting
 * Previne abuso de API e ataques de força bruta
 */

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

// Desabilitar validação IPv6 para compatibilidade
const RATE_LIMIT_DEFAULTS = {
    validate: {
        trustProxy: false,
        xForwardedForHeader: false,
        limit: false,
        onLimitReached: false,
        validationsConfig: false,
        default: true,
        draftPolli: false
    }
};

/**
 * Rate limiter para autenticação (mais restritivo)
 */
const authLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas
    message: {
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Muitas tentativas de login',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

/**
 * Rate limiter para API geral
 */
const apiLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições
    message: {
        error: 'Muitas requisições. Tente novamente mais tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Limite de requisições excedido',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

/**
 * Rate limiter para criação de denúncias
 */
const reportLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // 10 denúncias por hora
    message: {
        error: 'Limite de denúncias atingido. Tente novamente em 1 hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Limite de denúncias por hora excedido',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

/**
 * Rate limiter para consultas de risco
 */
const riskCheckLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 60 * 1000, // 1 minuto
    max: 30, // 30 consultas por minuto
    message: {
        error: 'Muitas consultas de risco. Aguarde um momento.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

/**
 * Rate limiter para registro de novos usuários
 */
const registerLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // 3 registros por hora por IP
    message: {
        error: 'Muitos registros do mesmo IP. Tente novamente em 1 hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Limite de registros por hora excedido',
            retryAfter: req.rateLimit.resetTime
        });
    }
});

/**
 * Rate limiter para upload de arquivos
 */
const uploadLimiter = rateLimit({
    ...RATE_LIMIT_DEFAULTS,
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // 20 uploads
    message: {
        error: 'Muitos uploads. Aguarde alguns minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Cria rate limiter com Redis (para produção)
 * Permite rate limiting distribuído entre múltiplas instâncias
 */
function createRedisLimiter(options) {
    if (!process.env.REDIS_URL) {
        console.warn('REDIS_URL não configurado. Usando rate limiting em memória.');
        return rateLimit(options);
    }
    
    return rateLimit({
        ...options,
        store: new RedisStore({
            // @ts-expect-error - Redis client configuration
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
    });
}

/**
 * Middleware de proteção contra força bruta customizado
 */
class BruteForceProtection {
    constructor() {
        this.attempts = new Map();
        this.blocked = new Map();
        this.maxAttempts = 10;
        this.blockDuration = 30 * 60 * 1000; // 30 minutos
        this.decayTime = 60 * 60 * 1000; // 1 hora
        
        // Limpa registros antigos a cada 10 minutos
        setInterval(() => this.cleanup(), 10 * 60 * 1000);
    }
    
    recordAttempt(key) {
        const now = Date.now();
        const record = this.attempts.get(key) || { count: 0, firstAttempt: now };
        
        // Reset se passou o tempo de decay
        if (now - record.firstAttempt > this.decayTime) {
            record.count = 0;
            record.firstAttempt = now;
        }
        
        record.count++;
        record.lastAttempt = now;
        this.attempts.set(key, record);
        
        // Bloqueia se exceder tentativas
        if (record.count >= this.maxAttempts) {
            this.blocked.set(key, now + this.blockDuration);
            return false;
        }
        
        return true;
    }
    
    isBlocked(key) {
        const blockUntil = this.blocked.get(key);
        if (!blockUntil) return false;
        
        if (Date.now() < blockUntil) {
            return true;
        }
        
        // Desbloqueia se o tempo passou
        this.blocked.delete(key);
        this.attempts.delete(key);
        return false;
    }
    
    cleanup() {
        const now = Date.now();
        
        // Remove bloqueios expirados
        for (const [key, blockUntil] of this.blocked.entries()) {
            if (now >= blockUntil) {
                this.blocked.delete(key);
                this.attempts.delete(key);
            }
        }
        
        // Remove tentativas antigas
        for (const [key, record] of this.attempts.entries()) {
            if (now - record.lastAttempt > this.decayTime) {
                this.attempts.delete(key);
            }
        }
    }
    
    middleware() {
        return (req, res, next) => {
            const key = req.ip + ':' + (req.body.email || req.user?.id || 'unknown');
            
            if (this.isBlocked(key)) {
                const blockUntil = this.blocked.get(key);
                const remainingTime = Math.ceil((blockUntil - Date.now()) / 1000 / 60);
                
                return res.status(429).json({
                    error: 'Conta temporariamente bloqueada por excesso de tentativas',
                    retryAfter: remainingTime,
                    message: `Tente novamente em ${remainingTime} minutos`
                });
            }
            
            next();
        };
    }
    
    recordFailedLogin(key) {
        return this.recordAttempt(key);
    }
    
    reset(key) {
        this.attempts.delete(key);
        this.blocked.delete(key);
    }
}

const bruteForceProtection = new BruteForceProtection();

module.exports = {
    authLimiter,
    apiLimiter,
    reportLimiter,
    riskCheckLimiter,
    registerLimiter,
    uploadLimiter,
    createRedisLimiter,
    bruteForceProtection
};
