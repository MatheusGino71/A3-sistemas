// Backend Configuration
// Atualizar esta URL depois de fazer deploy no Railway/Render/Fly.io

const BACKEND_CONFIG = {
    // Para desenvolvimento local:
    LOCAL: 'http://localhost:3001',
    
    // Para produção (substitua pela URL do Railway depois do deploy):
    PRODUCTION: 'https://seu-backend.railway.app', // ALTERAR AQUI DEPOIS DO DEPLOY
    
    // Detectar automaticamente o ambiente
    get API_URL() {
        // Se estiver rodando localmente, usa localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.LOCAL;
        }
        // Se estiver no Firebase Hosting, usa produção
        return this.PRODUCTION;
    }
};

// Exportar configuração
const API_BASE_URL = BACKEND_CONFIG.API_URL;
const API_V1 = `${API_BASE_URL}/api/v1`;

console.log('🔧 Backend configurado para:', API_BASE_URL);
