@echo off
title CozinhaApp API - Backend
color 0A

echo.
echo ========================================
echo    🚀 COZINHA APP API - BACKEND 🚀
echo ========================================
echo.

echo 🔍 Verificando porta 5057...
netstat -an | findstr :5057 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 5057 está em uso!
    echo 🛑 Finalizando processos dotnet...
    taskkill /F /IM dotnet.exe >nul 2>&1
    echo ✅ Processos finalizados
    echo ⏳ Aguardando liberação da porta...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Porta 5057 está livre
)

echo.
echo ✅ Configurando JWT_SECRET_KEY...
set JWT_SECRET_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789

echo ✅ JWT_SECRET_KEY configurada (256+ bits)
echo ✅ Chave JWT tem tamanho suficiente para HS256
echo.

echo 🔄 Executando dotnet run...
echo 🌐 API será executada em: http://localhost:5057
echo.
echo ⚠️  Pressione Ctrl+C para parar a API
echo ========================================
echo.

dotnet run

echo.
echo ========================================
echo 🛑 API finalizada
echo ========================================
pause
