@echo off
title CozinhaApp API - Debug Detalhado
color 0A

echo.
echo ========================================
echo    🔍 COZINHA APP API - DEBUG DETALHADO
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

echo 🚀 Iniciando API em modo debug...
echo.

REM Inicia a API em uma nova janela e salva o PID
start "CozinhaApp API" cmd /c "dotnet run --launch-profile Development > api_output.log 2>&1"

echo ⏳ Aguardando API iniciar (15 segundos)...
timeout /t 15 /nobreak >nul

echo.
echo 📋 Log da Inicialização da API:
echo ========================================
type api_output.log
echo ========================================
echo.

echo 🧪 Iniciando testes detalhados...
echo ========================================

echo.
echo 📡 Teste 1: GET /api/categorias
curl -v "http://localhost:5057/api/categorias" -H "accept: application/json" > categorias_response.txt 2>&1
echo.
echo 📄 Resposta detalhada:
type categorias_response.txt
echo.
del categorias_response.txt

echo.
echo 📡 Teste 2: GET /api/pratos/with-categories
curl -v "http://localhost:5057/api/pratos/with-categories" -H "accept: application/json" > pratos_response.txt 2>&1
echo.
echo 📄 Resposta detalhada:
type pratos_response.txt
echo.
del pratos_response.txt

echo.
echo 📡 Teste 3: POST /api/auth/login
curl -v -X POST "http://localhost:5057/api/auth/login" ^
     -H "Content-Type: application/json" ^
     -H "accept: application/json" ^
     -d "{\"email\":\"admin@cozinhaapp.com\",\"password\":\"Admin123!@#\"}" ^
     > login_response.txt 2>&1
echo.
echo 📄 Resposta detalhada:
type login_response.txt
echo.
del login_response.txt

echo.
echo ========================================
echo 📊 Resumo dos Testes
echo ========================================
echo.
echo 🔍 Verificações a fazer:
echo    1. A API iniciou corretamente? (verifique o log acima)
echo    2. As respostas mostram algum erro específico?
echo    3. O CORS está permitindo as requisições?
echo    4. A autenticação está configurada corretamente?
echo.

echo 🔍 Verificando status da API...
netstat -an | findstr :5057
echo.

echo 🔍 Processos dotnet em execução:
tasklist /FI "IMAGENAME eq dotnet.exe"
echo.

echo ⚠️  Pressione qualquer tecla para finalizar a API...
pause > nul

echo.
echo 🛑 Finalizando processos...
taskkill /F /IM dotnet.exe >nul 2>&1
del api_output.log >nul 2>&1

echo ✅ Debug finalizado!
