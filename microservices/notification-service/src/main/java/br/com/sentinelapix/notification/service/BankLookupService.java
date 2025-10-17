package br.com.sentinelapix.notification.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Serviço para identificar bancos e obter URLs de webhook
 * 
 * Responsável por:
 * - Identificar instituição financeira pela chave PIX
 * - Mapear bancos para URLs de webhook
 * - Validar formatos de chaves PIX
 */
@Service
public class BankLookupService {

    // Mapa de códigos ISPB para URLs de webhook dos bancos
    private final Map<String, String> bankWebhooks = new HashMap<>();
    
    // Mapa de domínios de email para códigos ISPB
    private final Map<String, String> emailDomainToBankMap = new HashMap<>();
    
    // Mapa de códigos de banco para códigos ISPB
    private final Map<String, String> bankCodeToIspbMap = new HashMap<>();

    public BankLookupService() {
        initializeBankMappings();
        initializeWebhookUrls();
    }

    /**
     * Identificar banco pela chave PIX
     */
    public String identifyBankByPixKey(String pixKey) {
        if (pixKey == null || pixKey.trim().isEmpty()) {
            return null;
        }

        pixKey = pixKey.trim();

        // Chave PIX tipo CPF (11 dígitos)
        if (Pattern.matches("\\d{11}", pixKey)) {
            return identifyBankByCpf(pixKey);
        }

        // Chave PIX tipo CNPJ (14 dígitos) 
        if (Pattern.matches("\\d{14}", pixKey)) {
            return identifyBankByCnpj(pixKey);
        }

        // Chave PIX tipo email
        if (Pattern.matches("^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$", pixKey)) {
            return identifyBankByEmail(pixKey);
        }

        // Chave PIX tipo telefone
        if (Pattern.matches("^\\+55\\d{10,11}$", pixKey)) {
            return identifyBankByPhone(pixKey);
        }

        // Chave PIX tipo aleatória (UUID)
        if (Pattern.matches("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$", pixKey)) {
            return identifyBankByRandomKey(pixKey);
        }

        return null;
    }

    /**
     * Obter URL do webhook do banco
     */
    public String getBankWebhookUrl(String bankCode) {
        return bankWebhooks.get(bankCode);
    }

    /**
     * Identificar banco por chave CPF
     * Nota: Na implementação real, isso seria uma consulta ao DICT do Banco Central
     */
    private String identifyBankByCpf(String cpf) {
        // Simulação: distribuição baseada no último dígito do CPF
        int lastDigit = Integer.parseInt(cpf.substring(cpf.length() - 1));
        
        return switch (lastDigit % 5) {
            case 0 -> "00000000"; // Banco do Brasil
            case 1 -> "60701190"; // Itaú Unibanco
            case 2 -> "90400888"; // Santander
            case 3 -> "00360305"; // Nu Pagamentos (Nubank)
            case 4 -> "32062580"; // Inter
            default -> "00000000";
        };
    }

    /**
     * Identificar banco por chave CNPJ
     */
    private String identifyBankByCnpj(String cnpj) {
        // Simulação: distribuição baseada nos primeiros dígitos
        String firstTwo = cnpj.substring(0, 2);
        
        return switch (firstTwo) {
            case "00", "01", "02" -> "00000000"; // Banco do Brasil
            case "03", "04", "05" -> "60701190"; // Itaú
            case "06", "07", "08" -> "90400888"; // Santander
            case "09", "10", "11" -> "00360305"; // Nubank
            default -> "32062580"; // Inter
        };
    }

    /**
     * Identificar banco por chave email
     */
    private String identifyBankByEmail(String email) {
        String domain = email.substring(email.indexOf('@') + 1).toLowerCase();
        
        return emailDomainToBankMap.getOrDefault(domain, getDefaultBankByEmailDomain(domain));
    }

    /**
     * Identificar banco por chave telefone
     */
    private String identifyBankByPhone(String phone) {
        // Remover +55 e analisar DDD
        String number = phone.substring(3);
        String ddd = number.substring(0, 2);
        
        return switch (ddd) {
            case "11", "12", "13", "14", "15", "16", "17", "18", "19" -> "60701190"; // SP - Itaú
            case "21", "22", "24" -> "00000000"; // RJ - Banco do Brasil  
            case "31", "32", "33", "34", "35", "37", "38" -> "90400888"; // MG - Santander
            case "41", "42", "43", "44", "45", "46" -> "00360305"; // PR - Nubank
            default -> "32062580"; // Outros - Inter
        };
    }

    /**
     * Identificar banco por chave aleatória
     * Nota: Necessária consulta ao DICT na implementação real
     */
    private String identifyBankByRandomKey(String randomKey) {
        // Simulação: usar hash do UUID para distribuir entre bancos
        int hash = Math.abs(randomKey.hashCode()) % 5;
        
        return switch (hash) {
            case 0 -> "00000000"; // Banco do Brasil
            case 1 -> "60701190"; // Itaú
            case 2 -> "90400888"; // Santander  
            case 3 -> "00360305"; // Nubank
            case 4 -> "32062580"; // Inter
            default -> "00000000";
        };
    }

    /**
     * Mapear banco padrão por domínio de email
     */
    private String getDefaultBankByEmailDomain(String domain) {
        // Domínios populares mapeados para bancos principais
        if (domain.contains("gmail") || domain.contains("hotmail") || domain.contains("yahoo")) {
            return "60701190"; // Itaú (maior banco digital)
        } else if (domain.contains("outlook") || domain.contains("live")) {
            return "00000000"; // Banco do Brasil
        } else if (domain.contains("uol") || domain.contains("terra")) {
            return "90400888"; // Santander
        } else {
            return "00360305"; // Nubank (banco digital)
        }
    }

    /**
     * Inicializar mapeamentos de bancos
     */
    private void initializeBankMappings() {
        // Mapeamento de domínios corporativos para bancos
        emailDomainToBankMap.put("bb.com.br", "00000000");           // Banco do Brasil
        emailDomainToBankMap.put("itau.com.br", "60701190");         // Itaú
        emailDomainToBankMap.put("santander.com.br", "90400888");    // Santander
        emailDomainToBankMap.put("nubank.com.br", "00360305");       // Nubank
        emailDomainToBankMap.put("inter.com.br", "32062580");        // Inter
        emailDomainToBankMap.put("caixa.gov.br", "00360305");        // Caixa
        emailDomainToBankMap.put("bradesco.com.br", "60746948");     // Bradesco
        
        // Mapeamento de códigos de banco para ISPB
        bankCodeToIspbMap.put("001", "00000000"); // Banco do Brasil
        bankCodeToIspbMap.put("341", "60701190"); // Itaú
        bankCodeToIspbMap.put("033", "90400888"); // Santander
        bankCodeToIspbMap.put("260", "00360305"); // Nubank
        bankCodeToIspbMap.put("077", "32062580"); // Inter
        bankCodeToIspbMap.put("104", "00360305"); // Caixa
        bankCodeToIspbMap.put("237", "60746948"); // Bradesco
    }

    /**
     * Inicializar URLs de webhook dos bancos
     */
    private void initializeWebhookUrls() {
        // URLs simuladas para demonstração
        // Na implementação real, estas seriam URLs fornecidas pelos bancos
        
        bankWebhooks.put("00000000", "https://api.bb.com.br/pix/fraud-alerts");
        bankWebhooks.put("60701190", "https://api.itau.com.br/pix/fraud-notifications");
        bankWebhooks.put("90400888", "https://api.santander.com.br/pix/security-alerts");
        bankWebhooks.put("00360305", "https://api.nubank.com.br/pix/fraud-reports");
        bankWebhooks.put("32062580", "https://api.bancointer.com.br/pix/fraud-alerts");
        bankWebhooks.put("60746948", "https://api.bradesco.com.br/pix/security-notifications");
        
        // URLs de desenvolvimento/teste
        bankWebhooks.put("DEV_BANK", "http://localhost:9090/webhook/fraud-alert");
        bankWebhooks.put("TEST_BANK", "https://webhook.site/test-sentinela-pix");
    }

    /**
     * Obter nome do banco pelo código ISPB
     */
    public String getBankName(String bankCode) {
        return switch (bankCode) {
            case "00000000" -> "Banco do Brasil";
            case "60701190" -> "Itaú Unibanco";
            case "90400888" -> "Santander Brasil";
            case "00360305" -> "Nu Pagamentos (Nubank)";
            case "32062580" -> "Banco Inter";
            case "60746948" -> "Bradesco";
            default -> "Banco Desconhecido (" + bankCode + ")";
        };
    }
}