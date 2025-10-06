# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.9-openjdk-17-slim AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos de configuração do Maven primeiro (cache layers)
COPY pom.xml .

# Baixar dependências (esta camada será cached se o pom.xml não mudar)
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar a aplicação
RUN mvn clean package -DskipTests

# Segunda stage - runtime
FROM openjdk:17-jre-slim

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN addgroup --system appgroup && adduser --system --group appuser

# Definir diretório de trabalho
WORKDIR /app

# Copiar o JAR da aplicação do estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Alterar proprietário dos arquivos para o usuário não-root
RUN chown appuser:appgroup /app/app.jar

# Usar usuário não-root
USER appuser

# Expor porta da aplicação
EXPOSE 8082

# Definir variáveis de ambiente padrão
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=docker

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8082/actuator/health || exit 1

# Comando para executar a aplicação
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]