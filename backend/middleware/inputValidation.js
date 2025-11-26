/**
 * ZENIT - Middleware de Validação
 * Valida e sanitiza inputs da API
 */

const validator = require('validator');

/**
 * Valida CPF brasileiro
 */
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

/**
 * Valida CNPJ brasileiro
 */
function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
}

/**
 * Valida chave PIX
 */
function validatePixKey(pixKey, type) {
    pixKey = String(pixKey || '').trim();
    
    switch(type) {
        case 'CPF':
            return validateCPF(pixKey);
        case 'CNPJ':
            return validateCNPJ(pixKey);
        case 'EMAIL':
            return validator.isEmail(pixKey);
        case 'PHONE':
            const phone = pixKey.replace(/[^\d]/g, '');
            return phone.length >= 10 && phone.length <= 11;
        case 'RANDOM':
            return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey);
        default:
            return false;
    }
}

/**
 * Detecta tipo de chave PIX
 */
function detectPixKeyType(pixKey) {
    pixKey = String(pixKey || '').trim();
    
    if (validator.isEmail(pixKey)) return 'EMAIL';
    
    const numbersOnly = pixKey.replace(/[^\d]/g, '');
    if (numbersOnly.length === 11 && validateCPF(numbersOnly)) return 'CPF';
    if (numbersOnly.length === 14 && validateCNPJ(numbersOnly)) return 'CNPJ';
    if (numbersOnly.length >= 10 && numbersOnly.length <= 11) return 'PHONE';
    
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey)) {
        return 'RANDOM';
    }
    
    return 'UNKNOWN';
}

/**
 * Sanitiza string removendo caracteres perigosos
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    
    return str
        .trim()
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/[<>]/g, '')
        .slice(0, 1000); // Limita tamanho
}

/**
 * Sanitiza objeto recursivamente
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return sanitizeString(String(obj));
    }
    
    const sanitized = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitized[key] = sanitizeObject(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }
    return sanitized;
}

/**
 * Middleware de validação de fraud report
 */
function validateFraudReport(req, res, next) {
    const { pixKey, reporterBank, description, amount, priority } = req.body;
    
    const errors = [];
    
    if (!pixKey || typeof pixKey !== 'string') {
        errors.push('pixKey é obrigatório e deve ser uma string');
    } else {
        const type = detectPixKeyType(pixKey);
        if (type === 'UNKNOWN') {
            errors.push('Chave PIX inválida');
        }
    }
    
    if (!reporterBank || typeof reporterBank !== 'string') {
        errors.push('reporterBank é obrigatório');
    }
    
    if (!description || typeof description !== 'string' || description.length < 10) {
        errors.push('description é obrigatório e deve ter no mínimo 10 caracteres');
    }
    
    if (amount !== undefined && amount !== null) {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount < 0 || numAmount > 1000000) {
            errors.push('amount deve ser um número entre 0 e 1.000.000');
        }
    }
    
    if (priority && !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priority)) {
        errors.push('priority deve ser LOW, MEDIUM, HIGH ou CRITICAL');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }
    
    // Sanitiza inputs
    req.body = sanitizeObject(req.body);
    
    next();
}

/**
 * Middleware de validação de registro de usuário
 */
function validateUserRegistration(req, res, next) {
    const { nome, sobrenome, email, cpf, senha, telefone } = req.body;
    
    const errors = [];
    
    if (!nome || typeof nome !== 'string' || nome.length < 2) {
        errors.push('Nome é obrigatório e deve ter no mínimo 2 caracteres');
    }
    
    if (!sobrenome || typeof sobrenome !== 'string' || sobrenome.length < 2) {
        errors.push('Sobrenome é obrigatório e deve ter no mínimo 2 caracteres');
    }
    
    if (!email || !validator.isEmail(email)) {
        errors.push('Email inválido');
    }
    
    if (!cpf || !validateCPF(cpf)) {
        errors.push('CPF inválido');
    }
    
    if (!senha || senha.length < 8) {
        errors.push('Senha deve ter no mínimo 8 caracteres');
    }
    
    if (telefone && typeof telefone === 'string') {
        const phoneNumbers = telefone.replace(/[^\d]/g, '');
        if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
            errors.push('Telefone inválido');
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }
    
    // Sanitiza inputs (exceto senha)
    const sanitized = sanitizeObject(req.body);
    sanitized.senha = req.body.senha; // Mantém senha original
    req.body = sanitized;
    
    next();
}

/**
 * Middleware de validação de login
 */
function validateLogin(req, res, next) {
    const { email, senha } = req.body;
    
    const errors = [];
    
    if (!email || !validator.isEmail(email)) {
        errors.push('Email inválido');
    }
    
    if (!senha || typeof senha !== 'string') {
        errors.push('Senha é obrigatória');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }
    
    next();
}

/**
 * Middleware de validação de PIX key verification
 */
function validatePixKeyVerification(req, res, next) {
    const { pixKey } = req.body;
    
    if (!pixKey || typeof pixKey !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'pixKey é obrigatório'
        });
    }
    
    const type = detectPixKeyType(pixKey);
    if (type === 'UNKNOWN') {
        return res.status(400).json({
            success: false,
            message: 'Chave PIX inválida'
        });
    }
    
    req.body.pixKey = sanitizeString(pixKey);
    req.pixKeyType = type;
    
    next();
}

module.exports = {
    validateCPF,
    validateCNPJ,
    validatePixKey,
    detectPixKeyType,
    sanitizeString,
    sanitizeObject,
    validateFraudReport,
    validateUserRegistration,
    validateLogin,
    validatePixKeyVerification
};
