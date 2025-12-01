<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenit - Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <video autoplay muted loop id="backgroundVideo">
        <source src="video/video.mp4" type="video/mp4">
    </video>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span> ZENIT</h1>
        </div>
        <div class="subtitle">
            Sistema Inteligente de Detecção e Prevenção de Fraudes em<br>Transações PIX
        </div>
        
        <div class="login-container">
            <a href="dashboard.jsp" class="btn-primary">
                Faça seu Login
            </a>
            <a href="register.jsp" class="link-secondary">Crie sua conta</a>
        </div>
        
        <div class="cards-grid">
            <div class="card">
                <div class="card-icon">Verificação de Chaves PIX</div>
                <div class="card-description">
                    Análise de segurança em tempo real com score de 0 a 100 pontos
                </div>
            </div>
            
            <div class="card">
                <div class="card-icon">Denúncias de Fraudes</div>
                <div class="card-description">
                    Sistema colaborativo para reportar e rastrear chaves suspeitas
                </div>
            </div>
            
            <div class="card">
                <div class="card-icon">Análise de Riscos</div>
                <div class="card-description">
                    Algoritmos avançados para identificar padrões fraudulentos
                </div>
            </div>
            
            <div class="card">
                <div class="card-icon">Alertas em Tempo Real</div>
                <div class="card-description">
                    Notificações instantâneas sobre atividades suspeitas
                </div>
            </div>
        </div>
    </div>
</body>
</html>
