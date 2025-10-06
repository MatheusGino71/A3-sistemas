@echo off
echo Configurando ambiente Java e Maven...

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot
set MAVEN_HOME=C:\Users\adm\Downloads\apache-maven-3.9.11-bin
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo JAVA_HOME: %JAVA_HOME%
echo MAVEN_HOME: %MAVEN_HOME%

echo Testando Java...
java -version

echo Testando Maven...
mvn --version

echo Iniciando Report Service na porta 8081...
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"