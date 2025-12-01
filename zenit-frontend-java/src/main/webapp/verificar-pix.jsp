<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificacao PIX - Zenit</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #fff;
            min-height: 100vh;
        }

        .navbar {
            background: rgba(0, 0, 0, 0.9);
            padding: 1rem 2rem;
            border-bottom: 2px solid #DC143C;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar h1 {
            margin: 0;
            color: #DC143C;
            font-size: 1.8rem;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: #fff;
            text-decoration: none;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: #DC143C;
        }

        .container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .verification-form {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #DC143C;
            font-weight: 600;
        }

        .form-group select,
        .form-group input {
            width: 100%;
            padding: 0.8rem;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            font-family: 'Poppins', sans-serif;
        }

        .form-group select option {
            background: #1a1a2e;
            color: #fff;
        }

        .btn-verify {
            background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
            color: #fff;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .btn-verify:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(220, 20, 60, 0.4);
        }

        .result-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 15px;
            padding: 2rem;
            display: none;
        }

        .score-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            margin: 0 auto 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            font-weight: 700;
            position: relative;
        }

        .score-label {
            font-size: 1rem;
            margin-top: 0.5rem;
            font-weight: 400;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .detail-item {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 8px;
            border-left: 3px solid #DC143C;
        }

        .detail-label {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
        }

        .detail-value {
            color: #fff;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .risk-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            text-align: center;
        }

        .risk-baixo {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid #22c55e;
        }

        .risk-medio {
            background: rgba(251, 191, 36, 0.2);
            color: #fbbf24;
            border: 1px solid #fbbf24;
        }

        .risk-alto {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid #ef4444;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <h1>Zenit - Verificacao PIX</h1>
        <div class="nav-links">
            <a href="index.jsp">Dashboard</a>
            <a href="denuncias.jsp">Denuncias</a>
            <a href="analise-riscos.jsp">Analise de Riscos</a>
            <a href="ocorrencias.jsp">Ocorrencias</a>
        </div>
    </nav>

    <div class="container">
        <div class="verification-form">
            <h2 style="margin-top: 0; color: #DC143C;">Verificar Chave PIX</h2>
            <p style="color: #999;">Insira a chave PIX para verificar sua seguranca</p>

            <form id="pixForm">
                <div class="form-group">
                    <label for="tipo">Tipo de Chave</label>
                    <select id="tipo" name="tipo" required>
                        <option value="">Selecione o tipo</option>
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                        <option value="email">E-mail</option>
                        <option value="telefone">Telefone</option>
                        <option value="aleatoria">Chave Aleatoria</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="chave">Chave PIX</label>
                    <input type="text" id="chave" name="chave" placeholder="Digite a chave PIX" required>
                </div>

                <button type="submit" class="btn-verify">Verificar Seguranca</button>
            </form>
        </div>

        <div class="result-card" id="resultCard">
            <h2 style="margin-top: 0; text-align: center;">Resultado da Verificacao</h2>
            
            <div class="score-circle" id="scoreCircle">
                <div id="scoreValue">--</div>
                <div class="score-label">Score</div>
            </div>

            <div style="text-align: center; margin-bottom: 2rem;">
                <div id="riskBadge" class="risk-badge">--</div>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Tipo de Chave</div>
                    <div class="detail-value" id="detailTipo">--</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value" id="detailStatus">--</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Data de Verificacao</div>
                    <div class="detail-value" id="detailData">--</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Tentativas de Fraude</div>
                    <div class="detail-value" id="detailTentativas">--</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('pixForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            var tipo = document.getElementById('tipo').value;
            var chave = document.getElementById('chave').value;
            
            // Chama API de verificação
            fetch('/api/verificar-pix', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'tipo=' + encodeURIComponent(tipo) + '&chave=' + encodeURIComponent(chave)
            })
            .then(response => response.json())
            .then(data => {
                var score = data.score;
                var risco = data.risco;
                var riskClass = score >= 85 ? 'risk-baixo' : (score >= 70 ? 'risk-medio' : 'risk-alto');
                
                // Preencher resultado
                document.getElementById('scoreValue').textContent = score;
                document.getElementById('riskBadge').textContent = 'Risco ' + risco;
                document.getElementById('riskBadge').className = 'risk-badge ' + riskClass;
                document.getElementById('detailTipo').textContent = tipo.toUpperCase();
                document.getElementById('detailStatus').textContent = data.status;
                document.getElementById('detailData').textContent = data.data;
                document.getElementById('detailTentativas').textContent = data.tentativasFraude;
                
                // Colorir círculo baseado no score
                var circle = document.getElementById('scoreCircle');
                if (score >= 85) {
                    circle.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)';
                    circle.style.border = '3px solid #22c55e';
                    circle.style.color = '#22c55e';
                } else if (score >= 70) {
                    circle.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)';
                    circle.style.border = '3px solid #fbbf24';
                    circle.style.color = '#fbbf24';
                } else {
                    circle.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)';
                    circle.style.border = '3px solid #ef4444';
                    circle.style.color = '#ef4444';
                }
                
                // Mostrar resultado
                document.getElementById('resultCard').style.display = 'block';
                document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
            })
            .catch(error => {
                alert('Erro ao verificar chave PIX: ' + error);
            });
        });
    </script>
</body>
</html>
