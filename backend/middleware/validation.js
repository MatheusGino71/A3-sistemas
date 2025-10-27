/**
 * ZENIT - Middleware de Validação de Entrada
 * Previne XSS, Injeção SQL e outras vulnerabilidades
 */

const validator = require('validator');

/**
 * Sanitiza strings para prevenir XSS
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return validator.escape(str.trim());
}

/**
 * Valida e sanitiza email
 */
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error('Email inválido');
    }
    
    const sanitized = email.trim().toLowerCase();
    
    if (!validator.isEmail(sanitized)) {
        throw new Error('Formato de email inválido');
    }
    
    if (sanitized.length > 255) {
        throw new Error('Email muito longo');
    }
    
    return sanitized;
}

/**
 * Valida CPF
 */
function validateCPF(cpf) {
    if (!cpf) return null;
    
    // Remove caracteres não numéricos
    const cleaned = cpf.replace(/\D/g, '');
    
    if (cleaned.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
    }
    
    // Validação básica de CPF
    if (/^(\d)\1{10}$/.test(cleaned)) {
        throw new Error('CPF inválido');
    }
    
    return cleaned;
}

/**
 * Valida telefone brasileiro
 */
function validatePhone(phone) {
    if (!phone) return null;
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 11) {
        throw new Error('Telefone inválido');
    }
    
    return cleaned;
}

/**
 * Valida chave PIX
 */
function validatePixKey(key, type) {
    if (!key || !type) {
        throw new Error('Chave PIX e tipo são obrigatórios');
    }
    
    const sanitizedKey = key.trim();
    
    switch(type.toLowerCase()) {
        case 'cpf':
            return validateCPF(sanitizedKey);
            
        case 'cnpj':
            const cnpj = sanitizedKey.replace(/\D/g, '');
            if (cnpj.length !== 14) {
                throw new Error('CNPJ deve ter 14 dígitos');
            }
            return cnpj;
            
        case 'email':
            return validateEmail(sanitizedKey);
            
        case 'phone':
            return validatePhone(sanitizedKey);
            
        case 'random':
            if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(sanitizedKey)) {
                throw new Error('Chave aleatória inválida');
            }
            return sanitizedKey.toLowerCase();
            
        default:
            throw new Error('Tipo de chave PIX inválido');
    }
}

/**
 * Valida valor monetário
 */
function validateAmount(amount) {
    const num = parseFloat(amount);
    
    if (isNaN(num) || num <= 0) {
        throw new Error('Valor deve ser positivo');
    }
    
    if (num > 1000000000) { // 1 bilhão
        throw new Error('Valor muito alto');
    }
    
    return Math.round(num * 100) / 100; // 2 casas decimais
}

/**
 * Valida nome de banco
 */
function validateBankName(bank) {
    const allowedBanks = [
        'Banco do Brasil',
        'Bradesco',
        'Caixa Econômica Federal',
        'Itaú',
        'Santander',
        'Nubank',
        'Inter',
        'C6 Bank',
        'Outro'
    ];
    
    if (!allowedBanks.includes(bank)) {
        throw new Error('Banco não suportado');
    }
    
    return bank;
}

/**
 * Middleware de validação para criação de usuário
 */
function validateUserRegistration(req, res, next) {
    try {
        const { email, password, full_name, cpf, phone, bank } = req.body;
        
        // Validações obrigatórias
        req.body.email = validateEmail(email);
        
        if (!password || password.length < 8) {
            return res.status(400).json({ 
                error: 'Senha deve ter no mínimo 8 caracteres' 
            });
        }
        
        if (password.length > 128) {
            return res.status(400).json({ 
                error: 'Senha muito longa' 
            });
        }
        
        // Validações opcionais
        if (full_name) {
            req.body.full_name = sanitizeString(full_name);
            if (req.body.full_name.length > 255) {
                return res.status(400).json({ 
                    error: 'Nome muito longo' 
                });
            }
        }
        
        if (cpf) {
            req.body.cpf = validateCPF(cpf);
        }
        
        if (phone) {
            req.body.phone = validatePhone(phone);
        }
        
        if (bank) {
            req.body.bank = validateBankName(bank);
        }
        
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Middleware de validação para relatório de fraude
 */
function validateFraudReport(req, res, next) {
    try {
        const { pixKey, pixKeyType, amount, victimBank, description, transactionId } = req.body;
        
        // Validações obrigatórias
        req.body.pixKey = validatePixKey(pixKey, pixKeyType);
        req.body.amount = validateAmount(amount);
        req.body.victimBank = validateBankName(victimBank);
        
        // Validações opcionais
        if (description) {
            req.body.description = sanitizeString(description);
            if (req.body.description.length > 2000) {
                return res.status(400).json({ 
                    error: 'Descrição muito longa (máximo 2000 caracteres)' 
                });
            }
        }
        
        if (transactionId) {
            req.body.transactionId = sanitizeString(transactionId);
            if (req.body.transactionId.length > 100) {
                return res.status(400).json({ 
                    error: 'ID de transação inválido' 
                });
            }
        }
        
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Middleware genérico de sanitização
 */
function sanitizeInputs(req, res, next) {
    // Sanitiza query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitizeString(req.query[key]);
            }
        });
    }
    
    // Sanitiza params
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            if (typeof req.params[key] === 'string') {
                req.params[key] = sanitizeString(req.params[key]);
            }
        });
    }
    
    next();
}

module.exports = {
    sanitizeString,
    validateEmail,
    validateCPF,
    validatePhone,
    validatePixKey,
    validateAmount,
    validateBankName,
    validateUserRegistration,
    validateFraudReport,
    sanitizeInputs
};
