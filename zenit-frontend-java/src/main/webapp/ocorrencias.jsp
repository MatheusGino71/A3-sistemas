<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Ocorrências</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav>
        <ul>
            <li><a href="index.jsp">Dashboard</a></li>
            <li><a href="verificar-pix.jsp">Verificar PIX</a></li>
            <li><a href="denuncias.jsp">Denúncias</a></li>
            <li><a href="analise-riscos.jsp">Análise de Riscos</a></li>
            <li><a href="ocorrencias">Ocorrências</a></li>
            <li><a href="nova-ocorrencia.jsp">Nova Ocorrência</a></li>
            <li><a href="login.jsp">Sair</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span> ZENIT</h1>
        </div>
        <div class="subtitle">
            Lista de Ocorrências Registradas
        </div>
        
        <a href="nova-ocorrencia.jsp" class="btn-primary" style="margin: 20px 0; display: inline-block;">+ Nova Ocorrência</a>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="ocorrencia" items="${ocorrencias}">
                    <tr>
                        <td>${ocorrencia.id}</td>
                        <td>${ocorrencia.descricao}</td>
                        <td>${ocorrencia.data}</td>
                        <td>
                            <c:choose>
                                <c:when test="${ocorrencia.status == 'PENDENTE'}">
                                    <span style="background: #ffc107; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px;">PENDENTE</span>
                                </c:when>
                                <c:when test="${ocorrencia.status == 'EM_ANALISE'}">
                                    <span style="background: #17a2b8; padding: 5px 15px; border-radius: 20px; font-size: 12px;">EM ANÁLISE</span>
                                </c:when>
                                <c:when test="${ocorrencia.status == 'RESOLVIDO'}">
                                    <span style="background: #28a745; padding: 5px 15px; border-radius: 20px; font-size: 12px;">RESOLVIDO</span>
                                </c:when>
                                <c:otherwise>
                                    <span style="background: #6c757d; padding: 5px 15px; border-radius: 20px; font-size: 12px;">${ocorrencia.status}</span>
                                </c:otherwise>
                            </c:choose>
                        </td>
                    </tr>
                </c:forEach>
                <c:if test="${empty ocorrencias}">
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 40px; color: #888;">
                            Nenhuma ocorrência registrada ainda.
                        </td>
                    </tr>
                </c:if>
            </tbody>
        </table>
    </div>
</body>
</html>
