<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Nova Ocorrência</title>
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
            Cadastrar Nova Ocorrência de Fraude
        </div>
        
        <div style="max-width: 600px; margin: 40px auto;">
            <form action="nova-ocorrencia" method="post">
                <div class="form-group">
                    <label for="descricao">Descrição da Ocorrência:</label>
                    <textarea id="descricao" name="descricao" rows="4" required placeholder="Descreva os detalhes da ocorrência..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="data">Data da Ocorrência:</label>
                    <input type="date" id="data" name="data" required>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Salvar Ocorrência</button>
            </form>
            
            <a href="ocorrencias" class="link-secondary" style="text-align: center; margin-top: 20px;">← Voltar para lista</a>
        </div>
    </div>
</body>
</html>
