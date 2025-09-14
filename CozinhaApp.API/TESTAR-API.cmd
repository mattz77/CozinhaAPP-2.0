@echo off
title CozinhaApp API - Debug e Testes
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

REM Calcula o tamanho da chave
set "KEY_LENGTH=0"
set "temp_key=%JWT_KEY%"
:count_loop
if defined temp_key (
    set "temp_key=%temp_key:~1%"
    set /a "KEY_LENGTH+=1"
    goto count_loop
)
set /a "KEY_BITS=%KEY_LENGTH% * 8"

echo.
echo 📊 Informações da Chave JWT:
echo    Tamanho: %KEY_LENGTH% caracteres
echo    Bits: %KEY_BITS% bits
if %KEY_BITS% LSS 256 (
    echo ❌ ERRO: Chave muito curta! Mínimo: 256 bits
    exit /b 1
)

echo.
echo 🔧 Configurações:
echo    📍 Ambiente: Development
echo    🌐 URL: http://localhost:5057
echo    🔒 JWT: Configurado (%KEY_BITS% bits)
echo.

echo 🚀 Iniciando API...
echo.

start "CozinhaApp API" cmd /c "dotnet run"

echo ⏳ Aguardando API iniciar...
timeout /t 10 /nobreak >nul

echo.
echo 🧪 Iniciando testes de endpoints...
echo ========================================

echo.
echo 📡 Testando endpoint de categorias...
curl -X GET "http://localhost:5057/api/categorias" -H "accept: application/json" -s > nul
if %errorlevel% equ 0 (
    echo ✅ GET /api/categorias: OK
) else (
    echo ❌ GET /api/categorias: FALHOU
)

echo.
echo 📡 Testando endpoint de pratos...
curl -X GET "http://localhost:5057/api/pratos/with-categories" -H "accept: application/json" -s > nul
if %errorlevel% equ 0 (
    echo ✅ GET /api/pratos/with-categories: OK
) else (
    echo ❌ GET /api/pratos/with-categories: FALHOU
)

echo.
echo 📡 Testando login de admin...
curl -X POST "http://localhost:5057/api/auth/login" ^
     -H "Content-Type: application/json" ^
     -H "accept: application/json" ^
     -d "{\"email\":\"admin@cozinhaapp.com\",\"password\":\"Admin123!@#\"}" ^
     -s > login_response.txt

type login_response.txt | findstr /i "token" > nul
if %errorlevel% equ 0 (
    echo ✅ POST /api/auth/login: OK
    for /f "tokens=2 delims=:" %%a in ('type login_response.txt ^| findstr "token"') do set "TOKEN=%%a"
    set "TOKEN=%TOKEN:"=%"
    set "TOKEN=%TOKEN:,=%"
    set "TOKEN=%TOKEN: =%"
    echo    🔑 Token recebido!
) else (
    echo ❌ POST /api/auth/login: FALHOU
    echo    📄 Resposta:
    type login_response.txt
)

if exist login_response.txt del login_response.txt

echo.
echo ========================================
echo 📊 Resumo dos Testes
echo ========================================
echo.
echo 🔍 Próximos passos:
echo    1. Verifique os resultados acima
echo    2. Se algum teste falhou, verifique os logs
echo    3. Use o token JWT para testes autenticados
echo.
echo ⚠️  Pressione Ctrl+C para parar a API
echo ========================================

pause
