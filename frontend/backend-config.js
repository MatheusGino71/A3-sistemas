// Backend Configuration
// Configuração automática para desenvolvimento e produção

const BACKEND_CONFIG = {
    // Para desenvolvimento local:
    LOCAL: 'http://localhost:3001',
    
    // Para produção na AWS (backend separado):
    // IMPORTANTE: Substitua pela URL do seu backend AWS após deploy
    AWS_BACKEND: 'https://seu-backend-aws.elasticbeanstalk.com', // ALTERAR após deploy AWS
    
    // Detectar automaticamente o ambiente
    get API_URL() {
        const hostname = window.location.hostname;
        
        // Desenvolvimento local
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return this.LOCAL;
        }
        
        // Produção - Frontend na Vercel, Backend na AWS
        // Verificar se AWS_BACKEND foi configurado
        if (this.AWS_BACKEND && !this.AWS_BACKEND.includes('seu-backend-aws')) {
            return this.AWS_BACKEND;
        }
        
        // Fallback: avisar que precisa configurar
        console.warn('⚠️ Configure BACKEND_CONFIG.AWS_BACKEND com a URL do seu backend AWS!');
        return this.LOCAL; // Usar local como fallback
    },
    
    // WebSocket URL (apenas para desenvolvimento local)
    get WS_URL() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'ws://localhost:3001/ws';
        }
        
        // WebSocket na AWS (se configurado)
        if (this.AWS_BACKEND && !this.AWS_BACKEND.includes('seu-backend-aws')) {
            const wsProtocol = this.AWS_BACKEND.startsWith('https') ? 'wss' : 'ws';
            const wsHost = this.AWS_BACKEND.replace('https://', '').replace('http://', '');
            return `${wsProtocol}://${wsHost}/ws`;
        }
        
        return null; // Sem WebSocket em produção
    }
};

// Exportar configuração
const API_BASE_URL = BACKEND_CONFIG.API_URL;
const API_V1 = `${API_BASE_URL}/api/v1`;

console.log('🔧 Backend configurado para:', API_BASE_URL);
