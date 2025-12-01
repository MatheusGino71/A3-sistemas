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

@WebServlet("/api/denuncias")
public class DenunciaServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String tipoFraude = request.getParameter("tipoFraude");
        String chaveSuspeita = request.getParameter("chaveSuspeita");
        String descricao = request.getParameter("descricao");
        String valor = request.getParameter("valor");
        
        // Gera protocolo único
        String protocolo = "ZENIT-" + System.currentTimeMillis();
        
        // Armazena na sessão
        HttpSession session = request.getSession();
        List<JsonObject> denuncias = (List<JsonObject>) session.getAttribute("denuncias");
        if (denuncias == null) {
            denuncias = new ArrayList<>();
        }
        
        JsonObject denuncia = Json.createObjectBuilder()
            .add("data", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
            .add("tipoFraude", tipoFraude)
            .add("chaveSuspeita", maskChave(chaveSuspeita))
            .add("descricao", descricao)
            .add("valor", valor != null ? valor : "N/A")
            .add("protocolo", protocolo)
            .add("status", "EM ANALISE")
            .build();
        
        denuncias.add(0, denuncia);
        if (denuncias.size() > 20) {
            denuncias = denuncias.subList(0, 20);
        }
        session.setAttribute("denuncias", denuncias);
        
        String jsonResponse = Json.createObjectBuilder()
            .add("success", true)
            .add("protocolo", protocolo)
            .add("message", "Denuncia registrada com sucesso")
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
        List<JsonObject> denuncias = (List<JsonObject>) session.getAttribute("denuncias");
        
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        if (denuncias != null) {
            for (JsonObject d : denuncias) {
                arrayBuilder.add(d);
            }
        }
        
        response.getWriter().write(arrayBuilder.build().toString());
    }
    
    private String maskChave(String chave) {
        if (chave == null || chave.length() <= 4) return chave;
        
        if (chave.contains("@")) {
            int atIndex = chave.indexOf("@");
            if (atIndex > 2) {
                return chave.substring(0, 2) + "***" + chave.substring(atIndex);
            }
        }
        
        return chave.substring(0, Math.min(3, chave.length())) + "***" + 
               chave.substring(Math.max(3, chave.length() - 3));
    }
}
