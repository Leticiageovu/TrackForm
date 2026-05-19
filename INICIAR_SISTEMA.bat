@echo off
setlocal
echo ======================================================
echo   INICIANDO TRACKFORM - SISTEMA DE TREINOS
echo ======================================================
echo.

REM Tenta usar o JAVA_HOME do sistema, se não existir, assume que 'java' está no PATH
if "%JAVA_HOME%" == "" (
    echo [AVISO] JAVA_HOME nao definido. Tentando usar 'java' do PATH...
) else (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

REM Pega o diretório atual para o Maven
set "PROJ_DIR=%~dp0"
set "MAVEN_OPTS=-Dmaven.multiModuleProjectDirectory="%PROJ_DIR%""

echo [1/2] Iniciando o SERVIDOR (Backend)...
start "BACKEND - Spring Boot" cmd /c "cd /d "%PROJ_DIR%" && .\mvnw.cmd spring-boot:run"

echo Aguardando o servidor carregar (12 segundos)...
timeout /t 12 /nobreak > nul

echo.
echo [2/2] Iniciando a INTERFACE (Frontend)...
start "FRONTEND - React" cmd /c "cd /d "%PROJ_DIR%\frontend" && npm run dev"

echo.
echo ======================================================
echo   SISTEMA EM EXECUCAO!
echo.
echo   Interface: http://localhost:5173
echo   API:       http://localhost:8080
echo.
echo   (Nao feche as janelas pretas que abriram)
echo ======================================================
echo.
pause
