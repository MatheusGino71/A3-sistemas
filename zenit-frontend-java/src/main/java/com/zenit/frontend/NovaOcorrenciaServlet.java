package com.zenit.frontend;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "NovaOcorrenciaServlet", urlPatterns = {"/nova-ocorrencia"})
public class NovaOcorrenciaServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String descricao = req.getParameter("descricao");
        String data = req.getParameter("data");
        // Aqui será feita a chamada à API para salvar a ocorrência
        // Exemplo: salvar localmente ou simular sucesso
        // Após salvar, redireciona para a lista
        resp.sendRedirect("/ocorrencias");
    }
}
