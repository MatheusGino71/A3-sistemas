<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Lista de Ocorrências</title>
</head>
<body>
    <h1>Ocorrências</h1>
    <a href="/nova-ocorrencia.jsp">Nova Ocorrência</a>
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            <%-- Aqui será exibida a lista de ocorrências vinda do Servlet --%>
            <c:forEach var="ocorrencia" items="${ocorrencias}">
                <tr>
                    <td>${ocorrencia.id}</td>
                    <td>${ocorrencia.descricao}</td>
                    <td>${ocorrencia.data}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</body>
</html>
