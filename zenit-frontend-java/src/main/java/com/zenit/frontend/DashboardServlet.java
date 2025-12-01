package com.zenit.frontend;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/dashboard/stats")
public class DashboardServlet extends HttpServlet {
    
    private static final String API_BASE_URL = "http://localhost:8080/api/ocorrencias";
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            JsonArray ocorrencias = fetchOcorrencias();
            Map<String, Object> stats = calculateStats(ocorrencias);
            
            String jsonResponse = Json.createObjectBuilder()
                .add("transacoesHoje", (Integer) stats.get("transacoesHoje"))
                .add("fraudesDetectadas", (Integer) stats.get("fraudesDetectadas"))
                .add("taxaPrecisao", (Double) stats.get("taxaPrecisao"))
                .add("valorProtegido", (Double) stats.get("valorProtegido"))
                .add("totalOcorrencias", (Integer) stats.get("totalOcorrencias"))
                .build()
                .toString();
            
            response.getWriter().write(jsonResponse);
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    private JsonArray fetchOcorrencias() throws IOException {
        URL url = new URL(API_BASE_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        
        if (conn.getResponseCode() == 200) {
            try (InputStream is = conn.getInputStream();
                 JsonReader reader = Json.createReader(is)) {
                return reader.readArray();
            }
        }
        return Json.createArrayBuilder().build();
    }
    
    private Map<String, Object> calculateStats(JsonArray ocorrencias) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate hoje = LocalDate.now();
        int transacoesHoje = 0;
        int fraudesDetectadas = 0;
        double valorProtegido = 0.0;
        
        for (int i = 0; i < ocorrencias.size(); i++) {
            JsonObject ocorrencia = ocorrencias.getJsonObject(i);
            
            // Parse data
            String dataStr = ocorrencia.getString("dataOcorrencia", "");
            if (dataStr.contains("T")) {
                String dataOnly = dataStr.split("T")[0];
                LocalDate dataOcorrencia = LocalDate.parse(dataOnly);
                
                if (dataOcorrencia.equals(hoje)) {
                    transacoesHoje++;
                }
            }
            
            // Conta fraudes (status SUSPEITO ou com valor alto)
            String status = ocorrencia.getString("status", "");
            double valor = ocorrencia.getJsonNumber("valor").doubleValue();
            
            if ("SUSPEITO".equals(status) || valor > 1000) {
                fraudesDetectadas++;
            }
            
            valorProtegido += valor;
        }
        
        // Calcula taxa de precisão baseado em fraudes detectadas vs total
        double taxaPrecisao = ocorrencias.size() > 0 
            ? ((double) (ocorrencias.size() - fraudesDetectadas) / ocorrencias.size()) * 100 
            : 100.0;
        
        stats.put("transacoesHoje", transacoesHoje);
        stats.put("fraudesDetectadas", fraudesDetectadas);
        stats.put("taxaPrecisao", Math.round(taxaPrecisao * 10.0) / 10.0);
        stats.put("valorProtegido", Math.round(valorProtegido * 100.0) / 100.0);
        stats.put("totalOcorrencias", ocorrencias.size());
        
        return stats;
    }
}
