<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZENIT - Sistema de Detecção de Fraudes PIX</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Poppins', sans-serif;
        }

        .video-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            overflow: hidden;
        }

        .video-background video {
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%);
            z-index: -1;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .logo {
            margin-bottom: 30px;
            animation: fadeInDown 1s ease-out;
        }

        .logo h1 {
            font-size: 120px;
            font-weight: 900;
            color: #DC143C;
            text-shadow: 0 0 30px rgba(220, 20, 60, 0.8),
                         0 0 60px rgba(220, 20, 60, 0.6),
                         0 5px 15px rgba(0, 0, 0, 0.9);
            letter-spacing: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }

        .star {
            font-size: 80px;
            color: #DC143C;
            filter: drop-shadow(0 0 20px rgba(220, 20, 60, 0.9));
        }

        .tagline {
            font-size: 28px;
            color: #ffffff;
            margin-bottom: 20px;
            font-weight: 300;
            letter-spacing: 2px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
            animation: fadeIn 1.5s ease-out 0.3s both;
        }

        .subtitle {
            font-size: 20px;
            color: #cccccc;
            margin-bottom: 60px;
            max-width: 800px;
            line-height: 1.6;
            text-align: center;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
            animation: fadeIn 1.5s ease-out 0.6s both;
        }

        .cta-buttons {
            display: flex;
            gap: 30px;
            margin-bottom: 80px;
            animation: fadeInUp 1s ease-out 0.9s both;
        }

        .btn {
            padding: 20px 50px;
            font-size: 18px;
            font-weight: 600;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-primary {
            background: #DC143C;
            color: #ffffff;
            box-shadow: 0 8px 25px rgba(220, 20, 60, 0.4);
        }

        .btn-primary:hover {
            background: #b01030;
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(220, 20, 60, 0.6);
        }

        .btn-secondary {
            background: transparent;
            color: #ffffff;
            border: 2px solid #DC143C;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .btn-secondary:hover {
            background: #DC143C;
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(220, 20, 60, 0.4);
        }

        .features {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            max-width: 1200px;
            width: 100%;
            animation: fadeInUp 1s ease-out 1.2s both;
        }

        .feature-card {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(220, 20, 60, 0.3);
            border-radius: 15px;
            padding: 25px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            border-color: #DC143C;
            box-shadow: 0 10px 30px rgba(220, 20, 60, 0.4);
            background: rgba(0, 0, 0, 0.8);
        }

        .feature-title {
            font-size: 16px;
            font-weight: 700;
            color: #DC143C;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .feature-description {
            font-size: 14px;
            color: #cccccc;
            line-height: 1.5;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 1024px) {
            .features {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .logo h1 {
                font-size: 80px;
            }
        }

        @media (max-width: 768px) {
            .features {
                grid-template-columns: 1fr;
            }
            
            .logo h1 {
                font-size: 60px;
                letter-spacing: 8px;
            }
            
            .cta-buttons {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="video-background">
        <video autoplay muted loop playsinline>
            <source src="video/video.mp4" type="video/mp4">
        </video>
    </div>
    
    <div class="overlay"></div>
    
    <div class="container">
        <div class="logo">
            <h1><span class="star">✦</span>ZENIT</h1>
        </div>
        
        <div class="tagline">
            Sistema Inteligente de Detecção de Fraudes
        </div>
        
        <div class="subtitle">
            Proteja suas transações PIX com tecnologia avançada de análise de riscos e prevenção de fraudes em tempo real
        </div>
        
        <div class="cta-buttons">
            <a href="index.jsp" class="btn btn-primary">Acessar Sistema</a>
            <a href="#features" class="btn btn-secondary">Saiba Mais</a>
        </div>
        
        <div class="features" id="features">
            <div class="feature-card">
                <div class="feature-title">Verificação PIX</div>
                <div class="feature-description">
                    Análise de segurança em tempo real com score de 0 a 100 pontos
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-title">Denúncias</div>
                <div class="feature-description">
                    Sistema colaborativo para reportar chaves suspeitas
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-title">Análise de Riscos</div>
                <div class="feature-description">
                    Algoritmos avançados para identificar padrões fraudulentos
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-title">Alertas em Tempo Real</div>
                <div class="feature-description">
                    Notificações instantâneas sobre atividades suspeitas
                </div>
            </div>
        </div>
    </div>
</body>
</html>
