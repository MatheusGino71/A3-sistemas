/**
 * Email Service - ZENIT Sistema Anti-Fraude PIX
 * Serviço para envio de notificações por email
 */

const nodemailer = require('nodemailer');
const { recordNotification, recordError } = require('../utils/metrics');
const logger = require('../utils/logger');

// Configuração do transporter
let transporter = null;

/**
 * Inicializa o transporter do Nodemailer
 */
function initializeTransporter() {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outros
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  // Se não tiver credenciais, usar ethereal para testes
  if (!config.auth.user || !config.auth.pass) {
    logger.warn('SMTP credentials not configured, emails will be logged only');
    return null;
  }

  transporter = nodemailer.createTransport(config);

  // Verificar conexão
  transporter.verify((error, success) => {
    if (error) {
      logger.error('SMTP connection error:', error);
      recordError('smtp_connection', 'error');
    } else {
      logger.info('SMTP server ready to send emails');
    }
  });

  return transporter;
}

// Inicializar transporter
initializeTransporter();

/**
 * Template base HTML para emails
 */
function getBaseTemplate(content) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZENIT - Sistema Anti-Fraude PIX</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #CC092F 0%, #E30613 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header .subtitle {
      margin-top: 5px;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .alert-box {
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .alert-danger {
      background-color: #fee;
      border-left: 4px solid #dc3545;
      color: #721c24;
    }
    .alert-warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      color: #856404;
    }
    .alert-info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
      color: #0c5460;
    }
    .alert-success {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
      color: #155724;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .info-table td:first-child {
      font-weight: 600;
      width: 40%;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #CC092F 0%, #E30613 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      padding: 20px;
      text-align: center;
      background-color: #f8f9fa;
      color: #6c757d;
      font-size: 12px;
      border-top: 1px solid #dee2e6;
    }
    .footer a {
      color: #CC092F;
      text-decoration: none;
    }
    .risk-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .risk-high {
      background-color: #dc3545;
      color: white;
    }
    .risk-medium {
      background-color: #ffc107;
      color: #333;
    }
    .risk-low {
      background-color: #28a745;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⭐ ZENIT</h1>
      <div class="subtitle">Sistema Anti-Fraude PIX</div>
    </div>
    ${content}
    <div class="footer">
      <p>Este é um email automático do sistema ZENIT.</p>
      <p>Para mais informações, acesse <a href="${process.env.APP_URL || 'http://localhost:8080'}">nosso portal</a></p>
      <p>&copy; 2025 ZENIT - Sistema Anti-Fraude PIX. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template para nova denúncia de fraude
 */
function getNewReportTemplate(report) {
  const riskClass = report.priority === 'HIGH' ? 'risk-high' : 
                    report.priority === 'MEDIUM' ? 'risk-medium' : 'risk-low';
  
  const content = `
    <div class="content">
      <h2>🚨 Nova Denúncia de Fraude Registrada</h2>
      
      <div class="alert-box alert-danger">
        <strong>Atenção!</strong> Uma nova denúncia de fraude PIX foi registrada no sistema e requer análise.
      </div>

      <table class="info-table">
        <tr>
          <td>ID da Denúncia:</td>
          <td><strong>${report.id}</strong></td>
        </tr>
        <tr>
          <td>Chave PIX:</td>
          <td><strong>${report.pix_key}</strong></td>
        </tr>
        <tr>
          <td>Banco Denunciante:</td>
          <td>${report.reporter_bank}</td>
        </tr>
        <tr>
          <td>Prioridade:</td>
          <td><span class="risk-badge ${riskClass}">${report.priority}</span></td>
        </tr>
        <tr>
          <td>Valor:</td>
          <td>${report.amount ? `R$ ${parseFloat(report.amount).toFixed(2)}` : 'Não informado'}</td>
        </tr>
        <tr>
          <td>ID da Transação:</td>
          <td>${report.transaction_id || 'Não informado'}</td>
        </tr>
        <tr>
          <td>Data/Hora:</td>
          <td>${new Date(report.created_at).toLocaleString('pt-BR')}</td>
        </tr>
      </table>

      <h3>Descrição da Fraude:</h3>
      <div class="alert-box alert-info">
        ${report.description}
      </div>

      ${report.victim_info ? `
        <h3>Informações da Vítima:</h3>
        <div class="alert-box alert-warning">
          ${report.victim_info}
        </div>
      ` : ''}

      <center>
        <a href="${process.env.APP_URL || 'http://localhost:8080'}/dashboard.html?report=${report.id}" class="button">
          Ver Detalhes da Denúncia
        </a>
      </center>
    </div>
  `;

  return getBaseTemplate(content);
}

/**
 * Template para análise de risco
 */
function getRiskAnalysisTemplate(analysis) {
  const riskClass = analysis.risk_level === 'HIGH' ? 'risk-high' : 
                    analysis.risk_level === 'MEDIUM' ? 'risk-medium' : 'risk-low';
  
  const alertClass = analysis.risk_level === 'HIGH' ? 'alert-danger' : 
                     analysis.risk_level === 'MEDIUM' ? 'alert-warning' : 'alert-success';

  const content = `
    <div class="content">
      <h2>📊 Análise de Risco Concluída</h2>
      
      <div class="alert-box ${alertClass}">
        <strong>Nível de Risco:</strong> 
        <span class="risk-badge ${riskClass}">${analysis.risk_level}</span>
      </div>

      <table class="info-table">
        <tr>
          <td>Chave PIX Analisada:</td>
          <td><strong>${analysis.pix_key}</strong></td>
        </tr>
        <tr>
          <td>Score de Risco:</td>
          <td><strong>${analysis.risk_score}/100</strong></td>
        </tr>
        <tr>
          <td>Total de Denúncias:</td>
          <td>${analysis.report_count}</td>
        </tr>
        <tr>
          <td>Primeira Denúncia:</td>
          <td>${analysis.first_report_date ? new Date(analysis.first_report_date).toLocaleString('pt-BR') : 'N/A'}</td>
        </tr>
        <tr>
          <td>Última Denúncia:</td>
          <td>${analysis.last_report_date ? new Date(analysis.last_report_date).toLocaleString('pt-BR') : 'N/A'}</td>
        </tr>
      </table>

      ${analysis.risk_level === 'HIGH' ? `
        <div class="alert-box alert-danger">
          <strong>⚠️ Ação Recomendada:</strong> Esta chave PIX apresenta alto risco de fraude. 
          Recomenda-se bloqueio imediato e investigação detalhada.
        </div>
      ` : analysis.risk_level === 'MEDIUM' ? `
        <div class="alert-box alert-warning">
          <strong>⚠️ Ação Recomendada:</strong> Esta chave PIX apresenta risco moderado. 
          Recomenda-se monitoramento contínuo.
        </div>
      ` : `
        <div class="alert-box alert-success">
          <strong>✓ Status:</strong> Esta chave PIX apresenta baixo risco de fraude.
        </div>
      `}

      <center>
        <a href="${process.env.APP_URL || 'http://localhost:8080'}/dashboard.html?pixkey=${analysis.pix_key}" class="button">
          Ver Histórico Completo
        </a>
      </center>
    </div>
  `;

  return getBaseTemplate(content);
}

/**
 * Template para notificação de status
 */
function getStatusUpdateTemplate(report, oldStatus, newStatus) {
  const content = `
    <div class="content">
      <h2>🔄 Atualização de Status - Denúncia</h2>
      
      <div class="alert-box alert-info">
        <strong>Status atualizado!</strong> A denúncia <strong>#${report.id}</strong> teve seu status alterado.
      </div>

      <table class="info-table">
        <tr>
          <td>ID da Denúncia:</td>
          <td><strong>${report.id}</strong></td>
        </tr>
        <tr>
          <td>Chave PIX:</td>
          <td><strong>${report.pix_key}</strong></td>
        </tr>
        <tr>
          <td>Status Anterior:</td>
          <td>${oldStatus}</td>
        </tr>
        <tr>
          <td>Novo Status:</td>
          <td><strong>${newStatus}</strong></td>
        </tr>
        <tr>
          <td>Data da Alteração:</td>
          <td>${new Date().toLocaleString('pt-BR')}</td>
        </tr>
      </table>

      <center>
        <a href="${process.env.APP_URL || 'http://localhost:8080'}/dashboard.html?report=${report.id}" class="button">
          Ver Detalhes da Denúncia
        </a>
      </center>
    </div>
  `;

  return getBaseTemplate(content);
}

/**
 * Template para resumo diário
 */
function getDailySummaryTemplate(summary) {
  const content = `
    <div class="content">
      <h2>📈 Resumo Diário - ZENIT</h2>
      
      <p>Resumo das atividades do sistema nas últimas 24 horas:</p>

      <table class="info-table">
        <tr>
          <td>📝 Novas Denúncias:</td>
          <td><strong>${summary.newReports}</strong></td>
        </tr>
        <tr>
          <td>🔍 Análises de Risco:</td>
          <td><strong>${summary.riskAnalyses}</strong></td>
        </tr>
        <tr>
          <td>🚨 Denúncias de Alta Prioridade:</td>
          <td><strong style="color: #dc3545;">${summary.highPriorityReports}</strong></td>
        </tr>
        <tr>
          <td>✅ Denúncias Resolvidas:</td>
          <td><strong style="color: #28a745;">${summary.resolvedReports}</strong></td>
        </tr>
        <tr>
          <td>⏳ Denúncias Pendentes:</td>
          <td><strong>${summary.pendingReports}</strong></td>
        </tr>
      </table>

      ${summary.topFraudKeys && summary.topFraudKeys.length > 0 ? `
        <h3>🎯 Top 5 Chaves PIX Mais Denunciadas:</h3>
        <div class="alert-box alert-warning">
          <ol style="margin: 10px 0; padding-left: 20px;">
            ${summary.topFraudKeys.map(key => `<li><strong>${key.pix_key}</strong> - ${key.count} denúncias</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <center>
        <a href="${process.env.APP_URL || 'http://localhost:8080'}/dashboard.html" class="button">
          Acessar Dashboard
        </a>
      </center>
    </div>
  `;

  return getBaseTemplate(content);
}

/**
 * Envia email
 */
async function sendEmail(to, subject, html) {
  if (!transporter) {
    logger.warn('Email not sent (no transporter configured):', { to, subject });
    console.log('\n========== EMAIL PREVIEW ==========');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Content: [HTML email]');
    console.log('===================================\n');
    return { success: false, message: 'No transporter configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ZENIT - Anti-Fraude PIX" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html
    });

    logger.info('Email sent successfully:', { to, subject, messageId: info.messageId });
    recordNotification('email', 'success');
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Error sending email:', error);
    recordError('email_send', 'error');
    recordNotification('email', 'failed');
    
    return { success: false, error: error.message };
  }
}

/**
 * Envia notificação de nova denúncia
 */
async function sendNewReportNotification(report, recipients) {
  const subject = `🚨 Nova Denúncia de Fraude PIX - ${report.pix_key}`;
  const html = getNewReportTemplate(report);
  
  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, subject, html);
    results.push({ recipient, ...result });
  }
  
  return results;
}

/**
 * Envia notificação de análise de risco
 */
async function sendRiskAnalysisNotification(analysis, recipients) {
  const subject = `📊 Análise de Risco - ${analysis.pix_key} (${analysis.risk_level})`;
  const html = getRiskAnalysisTemplate(analysis);
  
  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, subject, html);
    results.push({ recipient, ...result });
  }
  
  return results;
}

/**
 * Envia notificação de atualização de status
 */
async function sendStatusUpdateNotification(report, oldStatus, newStatus, recipients) {
  const subject = `🔄 Atualização de Status - Denúncia #${report.id}`;
  const html = getStatusUpdateTemplate(report, oldStatus, newStatus);
  
  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, subject, html);
    results.push({ recipient, ...result });
  }
  
  return results;
}

/**
 * Envia resumo diário
 */
async function sendDailySummary(summary, recipients) {
  const subject = `📈 Resumo Diário ZENIT - ${new Date().toLocaleDateString('pt-BR')}`;
  const html = getDailySummaryTemplate(summary);
  
  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, subject, html);
    results.push({ recipient, ...result });
  }
  
  return results;
}

module.exports = {
  sendEmail,
  sendNewReportNotification,
  sendRiskAnalysisNotification,
  sendStatusUpdateNotification,
  sendDailySummary,
  initializeTransporter
};
