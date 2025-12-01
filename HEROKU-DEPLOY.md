# Deploy ZENIT no Heroku

## Método 1: Via Dashboard (Recomendado - sua conta tem MFA)

### 1. Acesse o Heroku Dashboard
https://dashboard.heroku.com/apps

### 2. Crie uma Nova App
- Clique em **"New"** → **"Create new app"**
- **App name**: `zenit-api` (ou outro nome disponível)
- **Region**: United States
- Clique em **"Create app"**

### 3. Configure as Variáveis de Ambiente
Na aba **"Settings"** → **"Config Vars"** → **"Reveal Config Vars"**, adicione:

```
SPRING_DATASOURCE_URL = jdbc:postgresql://zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com:5432/postgres
SPRING_DATASOURCE_USERNAME = zenituser
SPRING_DATASOURCE_PASSWORD = Nice3322_
SPRING_PROFILES_ACTIVE = prod
```

### 4. Conecte ao GitHub
Na aba **"Deploy"**:
- **Deployment method**: GitHub
- **Connect to GitHub**: Autorize e busque `MatheusGino71/A3-sistemas`
- Clique em **"Connect"**

### 5. Deploy
- **Choose a branch to deploy**: `main`
- Clique em **"Deploy Branch"**
- ✅ Marque **"Enable Automatic Deploys"** para deploys automáticos

### 6. Aguarde o Build
O Heroku vai:
1. Detectar que é um projeto Maven
2. Executar `mvn clean install`
3. Iniciar a aplicação com o Procfile

### 7. Teste a API
Após o deploy, sua API estará em:
```
https://zenit-api.herokuapp.com/api/ocorrencias
```

## Método 2: Via API Token (Alternativa)

### 1. Gere um Token de API
1. Acesse: https://dashboard.heroku.com/account/applications
2. Clique em **"Create authorization"**
3. **Description**: "Deploy CLI"
4. Copie o token gerado

### 2. Configure o Token
```bash
$env:HEROKU_API_KEY="seu-token-aqui"
heroku login
```

### 3. Crie e Faça Deploy
```bash
cd "c:\Users\adm\OneDrive\Área de Trabalho\PROJETOS\SISTEMAS\zenit"

# Criar app
heroku create zenit-api

# Configurar buildpack
heroku buildpacks:set heroku/java -a zenit-api

# Adicionar variáveis de ambiente
heroku config:set SPRING_DATASOURCE_URL="jdbc:postgresql://zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com:5432/postgres" -a zenit-api
heroku config:set SPRING_DATASOURCE_USERNAME="zenituser" -a zenit-api
heroku config:set SPRING_DATASOURCE_PASSWORD="Nice3322_" -a zenit-api
heroku config:set SPRING_PROFILES_ACTIVE="prod" -a zenit-api

# Deploy
git push heroku main
```

## Configuração AWS RDS para Heroku

O Heroku usa IPs dinâmicos. Configure o Security Group do RDS:

### Opção 1: Abrir para Todos (Menos Seguro)
```
Type: PostgreSQL
Port: 5432
Source: 0.0.0.0/0
```

### Opção 2: IPs Fixos da Heroku (Mais Seguro)
1. Instale addon: `heroku addons:create fixie:tricycle`
2. Configure os IPs do Fixie no Security Group

## Verificação

### Health Check
```bash
curl https://zenit-api.herokuapp.com/actuator/health
```

### API de Ocorrências
```bash
curl https://zenit-api.herokuapp.com/api/ocorrencias
```

### Ver Logs
```bash
heroku logs --tail -a zenit-api
```

## Deploy do Frontend no Heroku

Para o frontend JSP/Servlets:

```bash
# Criar app separada
heroku create zenit-frontend

# Buildpack para Java Web
heroku buildpacks:set heroku/java -a zenit-frontend

# Deploy usando subtree
git subtree push --prefix zenit-frontend-java heroku main
```

## Custos Heroku (2025)

- **Eco Dyno**: $5/mês (compartilhado)
- **Basic Dyno**: $7/mês (sempre ativo)
- **Standard-1X**: $25/mês (recomendado para produção)

**Nota**: Heroku removeu o plano gratuito em 2022.

## Alternativas Gratuitas

Se quiser testar sem custo:

### Railway.app
```bash
# Instalar CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

### Render.com
1. Acesse https://render.com
2. New → Web Service
3. Conecte GitHub
4. Configure:
   - **Build**: `cd zenit-core-api && mvn clean package -DskipTests`
   - **Start**: `java -jar zenit-core-api/target/zenit-core-api-0.0.1-SNAPSHOT.jar`

## Troubleshooting

### Erro de Build Maven
- Verifique se `system.properties` tem Java 21
- Confirme que `Procfile` está correto
- Check logs: `heroku logs --tail`

### Erro de Conexão ao Banco
- Verifique Config Vars no Heroku
- Confirme Security Group do AWS RDS
- Teste conexão local primeiro

### App Crasha ao Iniciar
- Verifique se a porta é `$PORT`
- Confirme que o JAR está sendo gerado
- Check `heroku ps` para status

## Monitoramento

```bash
# Status da app
heroku ps -a zenit-api

# Logs em tempo real
heroku logs --tail -a zenit-api

# Métricas
heroku metrics -a zenit-api
```

---

**Criado em**: 01/12/2025
**Próximo passo**: Deploy via Dashboard do Heroku
