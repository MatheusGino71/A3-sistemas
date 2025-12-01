<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Denúncias de Fraudes</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .denuncia-form {
            max-width: 800px;
            margin: 40px auto;
            background: rgba(26, 26, 46, 0.9);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(220, 20, 60, 0.3);
        }
        
        .success-message {
            display: none;
            background: rgba(40, 167, 69, 0.2);
            border: 1px solid #28a745;
            color: #28a745;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="index.jsp">Dashboard</a></li>
            <li><a href="verificar-pix.jsp">Verificar PIX</a></li>
            <li><a href="denuncias.jsp">Denúncias</a></li>
            <li><a href="ocorrencias">Ocorrências</a></li>
            <li><a href="login.jsp">Sair</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span> DENÚNCIAS</h1>
        </div>
        <div class="subtitle">
            Sistema Colaborativo de Denúncias de Fraudes PIX
        </div>
        
        <div class="denuncia-form">
            <h2 style="color: #DC143C; margin-bottom: 30px;">Registrar Nova Denúncia</h2>
            
            <form id="denunciaForm" onsubmit="enviarDenuncia(event)">
                <div class="form-group">
                    <label for="tipoFraude">Tipo de Fraude:</label>
                    <select id="tipoFraude" name="tipoFraude" required>
                        <option value="">Selecione...</option>
                        <option value="PHISHING">Phishing / Golpe</option>
                        <option value="CHAVE_FALSA">Chave PIX Falsa</option>
                        <option value="DUPLICACAO">Duplicação de Transação</option>
                        <option value="ROUBO">Roubo de Conta</option>
                        <option value="OUTRO">Outro</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="chaveSuspeita">Chave PIX Suspeita:</label>
                    <input type="text" id="chaveSuspeita" name="chaveSuspeita" required placeholder="Digite a chave suspeita">
                </div>
                
                <div class="form-group">
                    <label for="valorTransacao">Valor da Transação (R$):</label>
                    <input type="number" id="valorTransacao" name="valorTransacao" step="0.01" placeholder="0.00">
                </div>
                
                <div class="form-group">
                    <label for="descricaoDenuncia">Descrição Detalhada:</label>
                    <textarea id="descricaoDenuncia" name="descricaoDenuncia" rows="5" required placeholder="Descreva em detalhes o que aconteceu..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="dataDenuncia">Data do Incidente:</label>
                    <input type="date" id="dataDenuncia" name="dataDenuncia" required>
                </div>
                
                <div class="form-group">
                    <label for="emailContato">E-mail para Contato:</label>
                    <input type="email" id="emailContato" name="emailContato" placeholder="seu@email.com">
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%;">Enviar Denúncia</button>
            </form>
            
            <div id="successMessage" class="success-message">
                <strong>Denúncia registrada com sucesso!</strong><br>
                Protocolo: <span id="protocoloNumero"></span><br>
                Nossa equipe irá analisar sua denúncia em até 48 horas.
            </div>
        </div>
    </div>
    
    <script>
        function enviarDenuncia(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const params = new URLSearchParams();
            params.append('tipoFraude', formData.get('tipoFraude'));
            params.append('chaveSuspeita', formData.get('chaveSuspeita'));
            params.append('valor', formData.get('valorTransacao'));
            params.append('descricao', formData.get('descricaoDenuncia'));
            
            fetch('/api/denuncias', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: params.toString()
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('protocoloNumero').textContent = data.protocolo;
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('denunciaForm').reset();
                
                setTimeout(() => {
                    document.getElementById('successMessage').style.display = 'none';
                }, 8000);
            })
            .catch(error => {
                alert('Erro ao enviar denuncia: ' + error);
            });
        }
    </script>
</body>
</html>
