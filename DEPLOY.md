# Deploy ZENIT na Vercel

## Pré-requisitos

1. Conta na Vercel: https://vercel.com
2. Vercel CLI instalado:
   ```bash
   npm install -g vercel
   ```

## Configuração de Variáveis de Ambiente

Antes de fazer o deploy, configure as seguintes variáveis de ambiente no painel da Vercel:

### 1. Acesse o Dashboard da Vercel
- Vá para: https://vercel.com/dashboard
- Selecione seu projeto (ou crie um novo)
- Vá em: **Settings** > **Environment Variables**

### 2. Adicione as Variáveis

```
SPRING_DATASOURCE_URL = jdbc:postgresql://zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com:5432/postgres
SPRING_DATASOURCE_USERNAME = zenituser
SPRING_DATASOURCE_PASSWORD = Nice3322_
FRAUD_ANALYZER_URL = https://seu-fraud-analyzer.vercel.app
```

⚠️ **IMPORTANTE**: Marque todas como **Production**, **Preview** e **Development**

## Deploy via CLI

### 1. Login na Vercel

```bash
vercel login
```

### 2. Link ao Projeto

```bash
cd "c:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\SISTEMAS\zenit"
vercel link
```

Selecione:
- **Scope**: Sua conta/organização
- **Link to existing project?**: No (primeira vez) ou Yes (já existe)
- **Project name**: zenit

### 3. Deploy para Production

```bash
vercel --prod
```

## Deploy via GitHub (Recomendado)

### 1. Conecte o Repositório

1. Acesse: https://vercel.com/new
2. Clique em **Import Git Repository**
3. Selecione: `MatheusGino71/A3-sistemas`
4. Configure:
   - **Root Directory**: `zenit`
   - **Framework Preset**: Other
   - **Build Command**: `cd zenit-core-api && mvn clean package -DskipTests`
   - **Output Directory**: `zenit-core-api/target`

### 2. Adicione Environment Variables

No mesmo wizard de configuração, adicione:
```
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
FRAUD_ANALYZER_URL
```

### 3. Deploy

Clique em **Deploy** e aguarde o build.

## Verificação

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://seu-projeto.vercel.app/actuator/health

# API de ocorrências
curl https://seu-projeto.vercel.app/api/ocorrencias
```

## Troubleshooting

### Erro de Build

Se houver erro no build Maven:
1. Verifique se o `pom.xml` está correto
2. Confirme que Java 21 está configurado
3. Tente build local: `mvn clean package`

### Erro de Conexão com Banco

1. Verifique as variáveis de ambiente
2. Confirme que o AWS RDS Security Group permite conexões da Vercel
3. Adicione IPs da Vercel ao Security Group:
   - Veja: https://vercel.com/docs/concepts/solutions/databases#ip-allowlisting

### Timeout no Deploy

Se o deploy demorar muito:
1. Reduza dependências desnecessárias
2. Use cache do Maven
3. Considere usar Container Registry

## Deploy do Frontend

Para o frontend JSP/Servlets, considere alternativas:

### Opção 1: Heroku (Recomendado para Java Web)

```bash
# Instale Heroku CLI
heroku login
heroku create zenit-frontend

# Configure buildpack
heroku buildpacks:set heroku/java

# Deploy
git subtree push --prefix zenit-frontend-java heroku main
```

### Opção 2: AWS Elastic Beanstalk

1. Crie WAR file: `mvn clean package`
2. Acesse: AWS Elastic Beanstalk Console
3. Upload do WAR: `target/zenit-frontend-java.war`

### Opção 3: Render

1. Acesse: https://render.com
2. New Web Service
3. Conecte repositório GitHub
4. Configure:
   - **Build Command**: `cd zenit-frontend-java && mvn clean package`
   - **Start Command**: `java -jar target/zenit-frontend-java.war`

## Monitoramento

Após deploy, monitore:

1. **Logs da Vercel**:
   ```bash
   vercel logs
   ```

2. **AWS RDS Metrics**:
   - CloudWatch Logs
   - Connection Count
   - Query Performance

3. **Application Health**:
   - `/actuator/health`
   - `/actuator/metrics`

## Atualizações

Para atualizar após mudanças:

```bash
# Commit mudanças
git add .
git commit -m "Sua mensagem"
git push origin main

# Vercel faz deploy automático se conectado ao GitHub
# Ou force um novo deploy:
vercel --prod
```

## Custos

- **Vercel**: Free tier cobre desenvolvimento (100GB bandwidth)
- **AWS RDS**: ~$15-30/mês (db.t3.micro)
- **Total estimado**: $15-30/mês

## Recomendações de Segurança

1. ✅ Use HTTPS (Vercel fornece automaticamente)
2. ✅ Rotacione credenciais do banco regularmente
3. ✅ Configure CORS adequadamente
4. ✅ Use AWS Secrets Manager para senhas
5. ✅ Habilite logs de auditoria

## Suporte

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- AWS RDS Docs: https://docs.aws.amazon.com/rds/

---

**Última atualização**: 01/12/2025
**Status**: Pronto para deploy
