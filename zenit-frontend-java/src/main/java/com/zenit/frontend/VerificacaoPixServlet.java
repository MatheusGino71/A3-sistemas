package com.zenit.frontend;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@WebServlet("/api/verificar-pix")
public class VerificacaoPixServlet extends HttpServlet {
    
    private static final Random random = new Random();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String tipo = request.getParameter("tipo");
        String chave = request.getParameter("chave");
        
        // Calcula score baseado em análise da chave
        int score = calculateScore(tipo, chave);
        String risco = getRiskLevel(score);
        String status = score >= 70 ? "Seguro" : "Atencao";
        
        // Armazena na sessão para exibir no dashboard
        HttpSession session = request.getSession();
        List<JsonObject> verificacoes = (List<JsonObject>) session.getAttribute("verificacoes");
        if (verificacoes == null) {
            verificacoes = new ArrayList<>();
        }
        
        JsonObject verificacao = Json.createObjectBuilder()
            .add("horario", LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
            .add("tipo", tipo)
            .add("chave", maskChave(chave, tipo))
            .add("score", score)
            .add("status", status)
            .add("risco", risco)
            .build();
        
        verificacoes.add(0, verificacao); // Adiciona no início
        if (verificacoes.size() > 10) {
            verificacoes = verificacoes.subList(0, 10); // Mantém apenas as 10 últimas
        }
        session.setAttribute("verificacoes", verificacoes);
        
        String jsonResponse = Json.createObjectBuilder()
            .add("success", true)
            .add("score", score)
            .add("risco", risco)
            .add("status", status)
            .add("tipo", tipo)
            .add("data", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
            .add("tentativasFraude", random.nextInt(5))
            .build()
            .toString();
        
        response.getWriter().write(jsonResponse);
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession();
        List<JsonObject> verificacoes = (List<JsonObject>) session.getAttribute("verificacoes");
        
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        if (verificacoes != null) {
            for (JsonObject v : verificacoes) {
                arrayBuilder.add(v);
            }
        }
        
        response.getWriter().write(arrayBuilder.build().toString());
    }
    
    private int calculateScore(String tipo, String chave) {
        int score = 85; // Score base
        
        // Analisa padrões suspeitos
        if (chave.length() < 5) {
            score -= 20;
        }
        
        // CPF/CNPJ com padrões repetitivos
        if (("cpf".equals(tipo) || "cnpj".equals(tipo)) && isRepeatingPattern(chave)) {
            score -= 15;
        }
        
        // Email suspeito
        if ("email".equals(tipo)) {
            if (!chave.contains("@") || chave.contains("fake") || chave.contains("test")) {
                score -= 25;
            }
        }
        
        // Telefone com padrão suspeito
        if ("telefone".equals(tipo)) {
            String nums = chave.replaceAll("[^0-9]", "");
            if (nums.length() < 10 || isRepeatingPattern(nums)) {
                score -= 20;
            }
        }
        
        // Adiciona variação aleatória
        score += random.nextInt(10) - 5;
        
        return Math.max(0, Math.min(100, score));
    }
    
    private boolean isRepeatingPattern(String str) {
        String nums = str.replaceAll("[^0-9]", "");
        if (nums.length() < 3) return false;
        
        char first = nums.charAt(0);
        int count = 0;
        for (char c : nums.toCharArray()) {
            if (c == first) count++;
        }
        return count >= nums.length() * 0.7; // 70% ou mais de repetição
    }
    
    private String getRiskLevel(int score) {
        if (score >= 85) return "Baixo";
        if (score >= 70) return "Medio";
        return "Alto";
    }
    
    private String maskChave(String chave, String tipo) {
        if (chave.length() <= 4) return chave;
        
        if ("cpf".equals(tipo)) {
            return "***." + chave.substring(Math.max(0, chave.length() - 6)) + "-**";
        } else if ("email".equals(tipo)) {
            int atIndex = chave.indexOf("@");
            if (atIndex > 2) {
                return chave.substring(0, 2) + "***" + chave.substring(atIndex);
            }
        } else if ("telefone".equals(tipo)) {
            String nums = chave.replaceAll("[^0-9]", "");
            if (nums.length() >= 8) {
                return "(***) ***-" + nums.substring(nums.length() - 4);
            }
        }
        
        return chave.substring(0, Math.min(3, chave.length())) + "***" + 
               chave.substring(Math.max(3, chave.length() - 3));
    }
}
