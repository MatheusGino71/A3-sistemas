<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Análise de Riscos</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .stat-card {
            background: rgba(26, 26, 46, 0.9);
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(220, 20, 60, 0.3);
            text-align: center;
        }
        
        .stat-number {
            font-size: 48px;
            font-weight: 900;
            color: #DC143C;
            text-shadow: 0 0 20px rgba(220, 20, 60, 0.6);
        }
        
        .stat-label {
            font-size: 16px;
            color: #cccccc;
            margin-top: 10px;
        }
        
        .chart-container {
            max-width: 1000px;
            margin: 40px auto;
            background: rgba(26, 26, 46, 0.9);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(220, 20, 60, 0.3);
        }
        
        .bar {
            height: 30px;
            background: linear-gradient(90deg, #DC143C 0%, #b01030 100%);
            border-radius: 5px;
            margin: 15px 0;
            position: relative;
        }
        
        .bar-label {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-weight: 600;
        }
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
            <li><a href="login.jsp">Sair</a></li>
        </ul>
    </nav>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span> ANÁLISE DE RISCOS</h1>
        </div>
        <div class="subtitle">
            Monitoramento de Padrões Fraudulentos e Estatísticas
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="transacoesAnalisadas">0</div>
                <div class="stat-label">Transações Analisadas Hoje</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-number" id="fraudesDetectadas">0</div>
                <div class="stat-label">Fraudes Detectadas</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-number" id="taxaPrecisao">0%</div>
                <div class="stat-label">Taxa de Precisão</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-number" id="valorProtegido">R$ 0</div>
                <div class="stat-label">Valor Protegido</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2 style="color: #DC143C; margin-bottom: 30px;">Tipos de Fraudes Mais Comuns</h2>
            
            <div>
                <p style="color: #cccccc; margin-bottom: 5px;">Phishing / Golpe (45%)</p>
                <div class="bar" style="width: 45%;">
                    <span class="bar-label">45%</span>
                </div>
            </div>
            
            <div>
                <p style="color: #cccccc; margin-bottom: 5px;">Chave PIX Falsa (28%)</p>
                <div class="bar" style="width: 28%;">
                    <span class="bar-label">28%</span>
                </div>
            </div>
            
            <div>
                <p style="color: #cccccc; margin-bottom: 5px;">Roubo de Conta (15%)</p>
                <div class="bar" style="width: 15%;">
                    <span class="bar-label">15%</span>
                </div>
            </div>
            
            <div>
                <p style="color: #cccccc; margin-bottom: 5px;">Duplicação de Transação (8%)</p>
                <div class="bar" style="width: 8%;">
                    <span class="bar-label">8%</span>
                </div>
            </div>
            
            <div>
                <p style="color: #cccccc; margin-bottom: 5px;">Outros (4%)</p>
                <div class="bar" style="width: 4%;">
                    <span class="bar-label">4%</span>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2 style="color: #DC143C; margin-bottom: 20px;">Análise de Ocorrências</h2>
            
            <table style="width: 100%;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Chave PIX</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody id="ocorrenciasTable">
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 30px; color: #888;">Carregando dados...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        function loadStats() {
            fetch('/api/dashboard/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('transacoesAnalisadas').textContent = data.transacoesHoje;
                    document.getElementById('fraudesDetectadas').textContent = data.fraudesDetectadas;
                    document.getElementById('taxaPrecisao').textContent = data.taxaPrecisao + '%';
                    document.getElementById('valorProtegido').textContent = 'R$ ' + data.valorProtegido.toFixed(2);
                })
                .catch(error => console.error('Erro ao carregar estatisticas:', error));
        }
        
        function loadOcorrencias() {
            fetch('http://localhost:8080/api/ocorrencias')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('ocorrenciasTable');
                    
                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #888;">Nenhuma ocorrencia registrada ainda.</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = '';
                    data.forEach(occ => {
                        const statusColor = occ.status === 'SUSPEITO' ? '#dc3545' : 
                                          occ.status === 'PENDENTE' ? '#ffc107' : '#28a745';
                        const row = '<tr>' +
                            '<td>' + occ.id + '</td>' +
                            '<td>' + (occ.chavePixGolpista || 'N/A') + '</td>' +
                            '<td style="color: #DC143C;">R$ ' + (occ.valor || 0).toFixed(2) + '</td>' +
                            '<td><span style="background: ' + statusColor + '; padding: 5px 15px; border-radius: 20px; font-size: 12px;">' + occ.status + '</span></td>' +
                            '<td>' + (occ.dataOcorrencia ? occ.dataOcorrencia.split('T')[0] : 'N/A') + '</td>' +
                            '</tr>';
                        tbody.innerHTML += row;
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar ocorrencias:', error);
                    document.getElementById('ocorrenciasTable').innerHTML = 
                        '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #dc3545;">Erro ao carregar dados. Verifique se a API esta rodando.</td></tr>';
                });
        }
        
        window.addEventListener('load', () => {
            loadStats();
            loadOcorrencias();
            
            // Atualiza a cada 30 segundos
            setInterval(() => {
                loadStats();
                loadOcorrencias();
            }, 30000);
        });
    </script>
    </div>
</body>
</html>
