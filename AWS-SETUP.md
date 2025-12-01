# Configuração AWS RDS para ZENIT

## Problema Atual

O banco de dados AWS RDS está configurado mas a aplicação não consegue conectar devido a timeout de conexão:

```
Caused by: java.net.SocketTimeoutException: Connect timed out
```

## Passos para Resolver

### 1. Verificar Security Group do RDS

1. Acesse o Console AWS (https://console.aws.amazon.com)
2. Navegue para **RDS** > **Databases**
3. Clique no banco **zenit-db**
4. Na aba **Connectivity & security**, encontre o **Security Group**
5. Clique no Security Group para editá-lo

### 2. Adicionar Regra de Inbound

Você precisa adicionar uma regra permitindo conexões na porta **5432** (PostgreSQL):

**Opção 1 - Seu IP Específico (Mais Seguro):**
- Type: `PostgreSQL`
- Protocol: `TCP`
- Port Range: `5432`
- Source: `177.92.68.10/32` (seu IP atual)
- Description: `Conexao local desenvolvimento`

**Opção 2 - Qualquer IP (Menos Seguro - apenas para testes):**
- Type: `PostgreSQL`
- Protocol: `TCP`
- Port Range: `5432`
- Source: `0.0.0.0/0`
- Description: `Acesso temporario desenvolvimento`

### 3. Verificar VPC e Subnet

1. Ainda na página do RDS, verifique se:
   - **Publicly accessible**: deve estar **Yes**
   - **VPC**: anote qual VPC está usando
   - **Subnet group**: deve ter subnets públicas

### 4. Verificar Endpoint

Confirme que o endpoint está correto:
```
zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com:5432
```

### 5. Testar Conexão Manual

Após configurar o Security Group, teste a conexão:

```bash
# Windows PowerShell
Test-NetConnection -ComputerName zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com -Port 5432

# Ou usar psql
psql -h zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com -U zenituser -d postgres -p 5432
```

## Configurações Atuais

### application.properties
```properties
spring.datasource.url=jdbc:postgresql://zenit-db.cr2yyq06k7qa.us-east-2.rds.amazonaws.com:5432/postgres
spring.datasource.username=zenituser
spring.datasource.password=Nice3322_
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### Modelo Ocorrencia
O modelo foi atualizado para remover o problema de `scale` no campo `valor`:

```java
@Column(name = "valor")
private Double valor;
```

## Após Configurar

Execute novamente:

```bash
cd zenit-core-api
mvn spring-boot:run
```

## Verificações de Sucesso

Se a conexão funcionar, você verá no console:

```
Hibernate: 
    create table if not exists ocorrencias (
        id bigserial not null,
        chave_pix_golpista varchar(255),
        tipo_chave varchar(50),
        valor float8,
        status varchar(50) not null,
        ...
    )
```

E o servidor iniciará na porta 8080:

```
Tomcat started on port(s): 8080 (http)
Started ZenitCoreApiApplication
```

## Alternativa: Usar H2 Local Temporariamente

Se não conseguir resolver o AWS RDS imediatamente, pode usar H2 local:

1. Comente as configurações PostgreSQL
2. Adicione H2:

```properties
# H2 Database (Temporário)
spring.datasource.url=jdbc:h2:mem:zenitdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

## Checklist

- [ ] Security Group configurado com porta 5432 aberta
- [ ] RDS configurado como "Publicly accessible" ⚠️ **CRÍTICO - Provavelmente NÃO está configurado**
- [ ] Endpoint correto no application.properties
- [ ] Senha correta (Nice3322_)
- [ ] Modelo Ocorrencia corrigido (sem scale no valor)
- [ ] Teste de conexão bem-sucedido
- [ ] Aplicação iniciando sem erros

## ⚠️ PROBLEMA DETECTADO

O teste de conexão retornou:

- **RemoteAddress**: 172.31.43.202 (IP privado)
- **TcpTestSucceeded**: False

Isso indica que o RDS está em uma **subnet privada** ou **"Publicly accessible" está como "No"**.

### SOLUÇÃO URGENTE - Tornar o RDS Publicamente Acessível:

1. **Acesse o Console AWS**: https://console.aws.amazon.com/rds
2. **Selecione seu banco**: `zenit-db`
3. **Clique em "Modify"** (botão laranja no topo direito)
4. **Na seção "Connectivity"**:
   - **Publicly accessible**: Mude para **"Yes"**
5. **Role até o final** e clique em **"Continue"**
6. **Escolha**: "Apply immediately"
7. **Clique em**: "Modify DB instance"
8. **Aguarde**: 5-10 minutos para a modificação ser aplicada

⚠️ **IMPORTANTE**: Após isso, você também precisa:
- Configurar o Security Group com seu IP (177.92.68.10/32) na porta 5432
- Testar a conexão novamente

## Suporte

Se continuar com problemas:

1. Verifique os logs do CloudWatch do RDS
2. Confirme que sua conta AWS tem créditos suficientes
3. Verifique se o banco não está em estado "stopped"
4. Teste conexão de uma EC2 na mesma VPC

---

**Última atualização**: 01/12/2025
**Status**: Aguardando configuração Security Group AWS
