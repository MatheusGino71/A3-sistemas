package com.zenit.frontend;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "OcorrenciasApiServlet", urlPatterns = {"/ocorrencias"})
public class OcorrenciasApiServlet extends HttpServlet {
    private static final String API_URL = "http://localhost:8080/ocorrencias";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, java.io.IOException {
        List<Ocorrencia> ocorrencias = new ArrayList<>();
        try {
            URL url = new URL(API_URL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Accept", "application/json");
            
            if (con.getResponseCode() == 200) {
                try (JsonReader reader = Json.createReader(con.getInputStream())) {
                    JsonArray array = reader.readArray();
                    for (JsonValue v : array) {
                        JsonObject obj = v.asJsonObject();
                        Ocorrencia o = new Ocorrencia(
                            obj.getInt("id"),
                            obj.getString("descricao"),
                            obj.getString("dataOcorrencia", "N/A"),
                            obj.getString("status", "PENDENTE")
                        );
                        ocorrencias.add(o);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        req.setAttribute("ocorrencias", ocorrencias);
        req.getRequestDispatcher("/ocorrencias.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, java.io.IOException {
        String descricao = req.getParameter("descricao");
        String data = req.getParameter("data");
        JsonObject json = Json.createObjectBuilder()
            .add("descricao", descricao)
            .add("dataOcorrencia", data)
            .build();
        URL url = new URL(API_URL);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);
        try (OutputStream os = con.getOutputStream()) {
            os.write(json.toString().getBytes());
        }
        con.getResponseCode();
        resp.sendRedirect("ocorrencias");
    }

    public static class Ocorrencia {
        public int id;
        public String descricao;
        public String data;
        public String status;
        
        public Ocorrencia(int id, String descricao, String data, String status) {
            this.id = id;
            this.descricao = descricao;
            this.data = data;
            this.status = status;
        }
        
        public int getId() { return id; }
        public String getDescricao() { return descricao; }
        public String getData() { return data; }
        public String getStatus() { return status; }
    }
}
