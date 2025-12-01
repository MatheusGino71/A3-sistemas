@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-25
set PATH=%JAVA_HOME%\bin;%PATH%
cd /d %~dp0
mvn clean package -DskipTests
pause
