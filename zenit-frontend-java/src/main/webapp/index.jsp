<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            min-height: 100vh;
            position: relative;
        }
        
        .stats-bar {
            display: flex;
            justify-content: space-around;
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .stat-item {
            background: rgba(26, 26, 46, 0.8);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 10px;
            padding: 20px 30px;
            text-align: center;
            flex: 1;
            min-width: 200px;
            transition: all 0.3s ease;
        }
        
        .stat-item:hover {
            border-color: #DC143C;
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(220, 20, 60, 0.3);
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: 900;
            color: #DC143C;
            text-shadow: 0 0 15px rgba(220, 20, 60, 0.6);
        }
        
        .stat-label {
            font-size: 14px;
            color: #cccccc;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            max-width: 1200px;
            width: 100%;
            margin: 40px auto;
            padding: 0 20px;
        }
        
        .card {
            background: rgba(26, 26, 46, 0.9);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 15px;
            padding: 35px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            text-decoration: none;
            display: block;
            color: inherit;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(220, 20, 60, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .card:hover::before {
            left: 100%;
        }
        
        .card:hover {
            transform: translateY(-15px) scale(1.02);
            border-color: #DC143C;
            box-shadow: 0 20px 50px rgba(220, 20, 60, 0.6);
            background: rgba(220, 20, 60, 0.1);
        }
        
        .card-icon {
            font-size: 22px;
            font-weight: 700;
            color: #DC143C;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }
        
        .card:hover .card-icon {
            transform: scale(1.1);
            text-shadow: 0 0 20px rgba(220, 20, 60, 0.8);
        }
        
        .card-description {
            font-size: 16px;
            color: #cccccc;
            line-height: 1.6;
            transition: color 0.3s ease;
        }
        
        .card:hover .card-description {
            color: #ffffff;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        
        .stat-number {
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card {
            animation: slideInUp 0.6s ease-out forwards;
        }
        
        .card:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
        .card:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
        .card:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
        .card:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
    </style>
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
            <li><a href="home.jsp">Sair</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span> ZENIT</h1>
        </div>
        <div class="subtitle">
            Sistema Inteligente de Deteccao e Prevencao de Fraudes em Transacoes PIX
        </div>
        
        <div class="stats-bar">
            <div class="stat-item">
                <div class="stat-number" id="transacoesHoje">0</div>
                <div class="stat-label">Transacoes Hoje</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="fraudesDetectadas">0</div>
                <div class="stat-label">Fraudes Detectadas</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="taxaPrecisao">0%</div>
                <div class="stat-label">Taxa de Precisao</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="valorProtegido">R$ 0</div>
                <div class="stat-label">Valor Protegido</div>
            </div>
        </div>
        
        <div style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
            <div style="background: rgba(26, 26, 46, 0.9); border: 1px solid rgba(220, 20, 60, 0.3); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
                <h2 style="color: #DC143C; margin-bottom: 20px; font-size: 24px;">Ultimas Verificacoes PIX</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid rgba(220, 20, 60, 0.3);">
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Horario</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Tipo de Chave</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Chave</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Score</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="verificacoesTable">
                        <tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">
                            <td colspan="5" style="padding: 30px; text-align: center; color: #888;">
                                Nenhuma verificacao realizada ainda. Use o menu "Verificar PIX" para comecar.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="background: rgba(26, 26, 46, 0.9); border: 1px solid rgba(220, 20, 60, 0.3); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
                <h2 style="color: #DC143C; margin-bottom: 20px; font-size: 24px;">Denuncias Recentes</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid rgba(220, 20, 60, 0.3);">
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Data</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Tipo de Fraude</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Chave Suspeita</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Protocolo</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="denunciasTable">
                        <tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">
                            <td colspan="5" style="padding: 30px; text-align: center; color: #888;">
                                Nenhuma denuncia registrada ainda. Use o menu "Denuncias" para reportar fraudes.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="background: rgba(26, 26, 46, 0.9); border: 1px solid rgba(220, 20, 60, 0.3); border-radius: 15px; padding: 30px;">
                <h2 style="color: #DC143C; margin-bottom: 20px; font-size: 24px;">Alertas de Seguranca</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid rgba(220, 20, 60, 0.3);">
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Horario</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Tipo de Alerta</th>
                            <th style="padding: 15px; text-align: left; color: #DC143C; font-weight: 600;">Descricao</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Nivel de Risco</th>
                            <th style="padding: 15px; text-align: center; color: #DC143C; font-weight: 600;">Acao</th>
                        </tr>
                    </thead>
                    <tbody id="alertasTable">
                        <tr>
                            <td style="padding: 15px; color: #cccccc;">14:35:22</td>
                            <td style="padding: 15px; color: #cccccc;">Tentativa de Phishing</td>
                            <td style="padding: 15px; color: #cccccc;">Chave PIX suspeita detectada - CPF: ***123.456-**</td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #dc3545; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">ALTO</span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #dc3545; padding: 5px 15px; border-radius: 20px; font-size: 12px;">BLOQUEADO</span>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">
                            <td style="padding: 15px; color: #cccccc;">14:28:10</td>
                            <td style="padding: 15px; color: #cccccc;">Chave Duplicada</td>
                            <td style="padding: 15px; color: #cccccc;">Mesma chave usada em multiplas transacoes</td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #ffc107; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">MEDIO</span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #17a2b8; padding: 5px 15px; border-radius: 20px; font-size: 12px;">EM ANALISE</span>
                            </td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">
                            <td style="padding: 15px; color: #cccccc;">14:15:03</td>
                            <td style="padding: 15px; color: #cccccc;">Valor Suspeito</td>
                            <td style="padding: 15px; color: #cccccc;">Transacao acima do padrao do usuario</td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #ffc107; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">MEDIO</span>
                            </td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="background: #28a745; padding: 5px 15px; border-radius: 20px; font-size: 12px;">APROVADO</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <script>
        function loadStats() {
            fetch('/api/dashboard/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('transacoesHoje').textContent = data.transacoesHoje;
                    document.getElementById('fraudesDetectadas').textContent = data.fraudesDetectadas;
                    document.getElementById('taxaPrecisao').textContent = data.taxaPrecisao + '%';
                    document.getElementById('valorProtegido').textContent = 'R$ ' + data.valorProtegido.toFixed(2);
                })
                .catch(error => console.error('Erro ao carregar estatisticas:', error));
        }
        
        function loadVerificacoes() {
            fetch('/api/verificar-pix')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('verificacoesTable');
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="padding: 30px; text-align: center; color: #888;">Nenhuma verificacao realizada ainda.</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = '';
                    data.forEach(v => {
                        const statusClass = v.status === 'Seguro' ? '#28a745' : '#ffc107';
                        const row = '<tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">' +
                            '<td style="padding: 15px; color: #cccccc;">' + v.horario + '</td>' +
                            '<td style="padding: 15px; color: #cccccc;">' + v.tipo.toUpperCase() + '</td>' +
                            '<td style="padding: 15px; color: #cccccc;">' + v.chave + '</td>' +
                            '<td style="padding: 15px; text-align: center; color: #DC143C; font-weight: 700;">' + v.score + '</td>' +
                            '<td style="padding: 15px; text-align: center;"><span style="background: ' + statusClass + '; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">' + v.status.toUpperCase() + '</span></td>' +
                            '</tr>';
                        tbody.innerHTML += row;
                    });
                })
                .catch(error => console.error('Erro ao carregar verificacoes:', error));
        }
        
        function loadDenuncias() {
            fetch('/api/denuncias')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('denunciasTable');
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="padding: 30px; text-align: center; color: #888;">Nenhuma denuncia registrada ainda.</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = '';
                    data.forEach(d => {
                        const row = '<tr style="border-bottom: 1px solid rgba(220, 20, 60, 0.1);">' +
                            '<td style="padding: 15px; color: #cccccc;">' + d.data + '</td>' +
                            '<td style="padding: 15px; color: #cccccc;">' + d.tipoFraude + '</td>' +
                            '<td style="padding: 15px; color: #cccccc;">' + d.chaveSuspeita + '</td>' +
                            '<td style="padding: 15px; text-align: center; color: #cccccc;">' + d.protocolo + '</td>' +
                            '<td style="padding: 15px; text-align: center;"><span style="background: #17a2b8; padding: 5px 15px; border-radius: 20px; font-size: 12px;">' + d.status + '</span></td>' +
                            '</tr>';
                        tbody.innerHTML += row;
                    });
                })
                .catch(error => console.error('Erro ao carregar denuncias:', error));
        }
        
        window.addEventListener('load', () => {
            loadStats();
            loadVerificacoes();
            loadDenuncias();
            
            // Atualiza a cada 30 segundos
            setInterval(() => {
                loadStats();
                loadVerificacoes();
                loadDenuncias();
            }, 30000);
        });
    </script>
</body>
</html>
