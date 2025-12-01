<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Nova Ocorrência</title>
</head>
<body>
    <h1>Cadastrar Nova Ocorrência</h1>
    <form action="/nova-ocorrencia" method="post">
        <label for="descricao">Descrição:</label>
        <input type="text" id="descricao" name="descricao" required><br><br>
        <label for="data">Data:</label>
        <input type="date" id="data" name="data" required><br><br>
        <button type="submit">Salvar</button>
    </form>
    <a href="/ocorrencias">Voltar para lista</a>
</body>
</html>
