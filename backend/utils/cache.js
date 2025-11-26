/**
 * ZENIT - Sistema de Cache
 * Cache em memória para melhorar performance da API
 */

class SimpleCache {
    constructor() {
        this.cache = new Map();
        this.ttl = parseInt(process.env.CACHE_TTL_SECONDS || '30') * 1000;
        
        // Limpa cache expirado a cada minuto
        setInterval(() => this.cleanup(), 60000);
    }
    
    /**
     * Gera chave de cache
     */
    generateKey(prefix, params) {
        return `${prefix}:${JSON.stringify(params)}`;
    }
    
    /**
     * Armazena valor no cache
     */
    set(key, value, customTTL = null) {
        const expireAt = Date.now() + (customTTL || this.ttl);
        this.cache.set(key, { value, expireAt });
    }
    
    /**
     * Recupera valor do cache
     */
    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        if (Date.now() > cached.expireAt) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.value;
    }
    
    /**
     * Remove item do cache
     */
    delete(key) {
        return this.cache.delete(key);
    }
    
    /**
     * Remove todos os itens com determinado prefixo
     */
    deletePattern(pattern) {
        let deleted = 0;
        for (const key of this.cache.keys()) {
            if (key.startsWith(pattern)) {
                this.cache.delete(key);
                deleted++;
            }
        }
        return deleted;
    }
    
    /**
     * Limpa itens expirados
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expireAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache cleanup: ${cleaned} itens removidos`);
        }
    }
    
    /**
     * Limpa todo o cache
     */
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        return size;
    }
    
    /**
     * Retorna estatísticas do cache
     */
    getStats() {
        return {
            size: this.cache.size,
            ttl: this.ttl / 1000,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Instância global do cache
const cache = new SimpleCache();

/**
 * Middleware de cache para rotas GET
 */
function cacheMiddleware(ttl = null) {
    return (req, res, next) => {
        // Só cacheia GET requests
        if (req.method !== 'GET') {
            return next();
        }
        
        const key = cache.generateKey(req.path, req.query);
        const cached = cache.get(key);
        
        if (cached) {
            console.log(`📦 Cache HIT: ${req.path}`);
            return res.json(cached);
        }
        
        console.log(`💨 Cache MISS: ${req.path}`);
        
        // Intercepta o res.json original
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Só cacheia respostas bem-sucedidas
            if (res.statusCode === 200 && body.success !== false) {
                cache.set(key, body, ttl);
            }
            return originalJson(body);
        };
        
        next();
    };
}

/**
 * Invalida cache relacionado a fraud reports
 */
function invalidateFraudReportsCache() {
    cache.deletePattern('fraud-reports');
    cache.deletePattern('dashboard');
    cache.deletePattern('risk-analysis');
}

/**
 * Invalida cache relacionado a risk analysis
 */
function invalidateRiskAnalysisCache() {
    cache.deletePattern('risk-analysis');
    cache.deletePattern('dashboard');
}

module.exports = {
    cache,
    cacheMiddleware,
    invalidateFraudReportsCache,
    invalidateRiskAnalysisCache
};
