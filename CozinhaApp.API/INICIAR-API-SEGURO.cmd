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
echo 🔑 Configurando JWT_SECRET_KEY...

REM Define uma chave JWT longa o suficiente (mais de 256 bits)
set "JWT_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

REM Verifica o tamanho da chave (cada caractere = 1 byte = 8 bits)
set "KEY_LENGTH=0"
set "temp_key=%JWT_KEY%"
:count_loop
if defined temp_key (
    set "temp_key=%temp_key:~1%"
    set /a "KEY_LENGTH+=1"
    goto count_loop
)

set /a "KEY_BITS=%KEY_LENGTH% * 8"
echo Tamanho da chave: %KEY_LENGTH% caracteres (%KEY_BITS% bits^)

if %KEY_BITS% LSS 256 (
    echo ❌ ERRO: Chave JWT muito curta! Precisa ter pelo menos 256 bits.
    echo    Tamanho atual: %KEY_BITS% bits
    echo    Mínimo necessário: 256 bits
    pause
    exit /b 1
)

echo ✅ Chave JWT tem tamanho suficiente para HS256 (%KEY_BITS% bits^)
set "JWT_SECRET_KEY=%JWT_KEY%"

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
