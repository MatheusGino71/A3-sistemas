// Backend Configuration
// Configuração automática para desenvolvimento e produção

const BACKEND_CONFIG = {
    // Para desenvolvimento local:
    LOCAL: 'http://localhost:3001',
    
    // Para produção na Vercel (mesma URL do frontend):
    VERCEL: '', // Deixe vazio - será a mesma URL do frontend
    
    // Para produção em servidor separado (Railway/Render):
    SEPARATE_SERVER: 'https://seu-backend.railway.app', // ALTERAR se usar servidor separado
    
    // Detectar automaticamente o ambiente
    get API_URL() {
        const hostname = window.location.hostname;
        
        // Desenvolvimento local
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return this.LOCAL;
        }
        
        // Produção na Vercel (backend e frontend juntos)
        if (hostname.includes('vercel.app')) {
            return window.location.origin; // Mesma URL do frontend
        }
        
        // Produção em servidor separado
        if (this.SEPARATE_SERVER && this.SEPARATE_SERVER !== 'https://seu-backend.railway.app') {
            return this.SEPARATE_SERVER;
        }
        
        // Fallback: assume mesma origem
        return window.location.origin;
    }
};

// Exportar configuração
const API_BASE_URL = BACKEND_CONFIG.API_URL;
const API_V1 = `${API_BASE_URL}/api/v1`;

console.log('🔧 Backend configurado para:', API_BASE_URL);
