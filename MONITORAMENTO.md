# Monitoramento e Observabilidade

## Sugestão de Ferramentas
- **Prometheus + Grafana**: Para métricas customizadas e dashboards.
- **Spring Boot Actuator**: Já integrado ao Spring Boot, expõe endpoints de saúde e métricas.
- **Azure Monitor**: Para deploy cloud, integração nativa com App Service.

## Como habilitar métricas no Spring Boot
1. Adicione ao `pom.xml`:
   ```xml
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   <dependency>
     <groupId>io.micrometer</groupId>
     <artifactId>micrometer-registry-prometheus</artifactId>
   </dependency>
   ```
2. No `application.properties`:
   ```properties
   management.endpoints.web.exposure.include=*
   management.endpoint.health.show-details=always
   management.metrics.export.prometheus.enabled=true
   ```
3. Acesse `/actuator/health` e `/actuator/prometheus` para monitoramento.

## Exemplo de dashboard
- Use Grafana apontando para o endpoint Prometheus exposto pelo serviço.

## Azure Monitor
- No Azure App Service, habilite Application Insights para logs e métricas automáticas.
