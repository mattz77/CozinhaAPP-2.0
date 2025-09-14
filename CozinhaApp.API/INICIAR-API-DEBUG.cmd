@echo off
title CozinhaApp API - Backend (Debug Mode)
color 0A

echo.
echo ========================================
echo    🔍 COZINHA APP API - DEBUG MODE
echo ========================================
echo.

echo 🔍 Verificando processos existentes...
taskkill /F /IM dotnet.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos dotnet finalizados
) else (
    echo ℹ️  Nenhum processo dotnet encontrado
)

echo.
echo 🔍 Verificando porta 5057...
netstat -an | findstr :5057 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 5057 está em uso!
    echo 🛑 Finalizando processos...
    taskkill /F /IM dotnet.exe >nul 2>&1
    echo ⏳ Aguardando liberação da porta...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Porta 5057 está livre
)

echo.
echo 🔑 Configurando JWT_SECRET_KEY...
set "JWT_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
set "JWT_SECRET_KEY=%JWT_KEY%"

echo.
echo 🔍 Verificando variável JWT_SECRET_KEY:
echo    Tamanho: %JWT_KEY:~0,20%... (%JWT_KEY:~-20%) [Total: %JWT_KEY:~0,3% caracteres]
echo.

echo 🔧 Configurações:
echo    📍 Ambiente: Development
echo    🌐 URL: http://localhost:5057
echo    🔒 JWT: Configurado
echo.

echo 🚀 Iniciando API em modo debug...
echo.
echo 📝 Log detalhado ativado:
echo    - Requisições HTTP
echo    - Operações de autenticação
echo    - Erros e exceções
echo.

echo ⚠️  Pressione Ctrl+C para parar a API
echo ========================================
echo.

set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_URLS=http://localhost:5057
set Logging__LogLevel__Default=Debug
set Logging__LogLevel__Microsoft=Debug
set Logging__LogLevel__Microsoft.AspNetCore=Debug
set Logging__Console__FormatterName=Simple

dotnet run --launch-profile Development

echo.
echo ========================================
echo 🛑 API finalizada
echo ========================================
pause
