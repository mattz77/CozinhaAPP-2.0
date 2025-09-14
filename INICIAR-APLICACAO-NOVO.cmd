@echo off
title CozinhaApp - Inicialização Completa
color 0A

:menu
cls
echo.
echo ========================================
echo    🚀 COZINHA APP - INICIALIZAÇÃO 🚀
echo ========================================
echo.
echo Escolha uma opção:
echo.
echo [1] ▶️  Iniciar Backend e Frontend
echo [2] 🔄 Reiniciar Tudo
echo [3] ⚙️  Iniciar Apenas Backend
echo [4] 🎨 Iniciar Apenas Frontend
echo [5] ❌ Sair
echo.
echo ========================================

choice /c 12345 /n /m "Digite sua escolha (1-5): "

if errorlevel 5 goto :exit
if errorlevel 4 goto :frontend
if errorlevel 3 goto :backend
if errorlevel 2 goto :restart
if errorlevel 1 goto :both

:both
cls
echo.
echo ========================================
echo    🚀 Iniciando Backend e Frontend
echo ========================================
echo.

echo 🔍 Verificando processos existentes...

REM Finaliza processos Node
echo 🔄 Finalizando processos Node...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos Node finalizados
) else (
    echo ℹ️  Nenhum processo Node encontrado
)

REM Finaliza processos .NET
echo 🔄 Finalizando processos .NET...
taskkill /F /IM dotnet.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos .NET finalizados
) else (
    echo ℹ️  Nenhum processo .NET encontrado
)

REM Verifica portas em uso
echo 🔍 Verificando portas...
netstat -ano | findstr :5057 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 5057 em uso, finalizando...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5057') do taskkill /F /PID %%a >nul 2>&1
)

netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000 em uso, finalizando...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 🔑 Configurando JWT_SECRET_KEY...
set "JWT_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
set "JWT_SECRET_KEY=%JWT_KEY%"
echo ✅ JWT_SECRET_KEY configurada

echo.
echo 🚀 Iniciando Backend...
start "CozinhaApp Backend" cmd /c "cd CozinhaApp.API && dotnet run"

echo ⏳ Aguardando backend iniciar...
timeout /t 10 /nobreak >nul

echo 🔍 Verificando se o backend está rodando...
curl -s http://localhost:5057/health >nul
if %errorlevel% equ 0 (
    echo ✅ Backend iniciado com sucesso!
) else (
    echo ⚠️  Aguardando mais 5 segundos...
    timeout /t 5 /nobreak >nul
)

echo.
echo 🎨 Iniciando Frontend...
cd CozinhaApp

REM Limpa cache do Vite
echo 🧹 Limpando cache...
if exist "node_modules/.vite" (
    rmdir /s /q "node_modules\.vite"
)

echo 📦 Verificando dependências...
call npm install

echo 🚀 Iniciando servidor de desenvolvimento...
start "CozinhaApp Frontend" cmd /c "npm run dev"

cd ..

echo.
echo ✅ Aplicação iniciada!
echo.
echo 🌐 Backend: http://localhost:5057
echo 🌐 Frontend: http://localhost:3000
echo.
echo ⚠️  Pressione qualquer tecla para voltar ao menu...
pause >nul
goto :menu

:restart
cls
echo.
echo 🔄 Reiniciando todos os serviços...
echo.

taskkill /F /IM node.exe >nul 2>&1
echo ✅ Frontend finalizado

taskkill /F /IM dotnet.exe >nul 2>&1
echo ✅ Backend finalizado

timeout /t 2 /nobreak >nul
goto :both

:backend
cls
echo.
echo ========================================
echo    🚀 Iniciando Backend
echo ========================================
echo.

echo 🔍 Verificando processos existentes...
taskkill /F /IM dotnet.exe >nul 2>&1

echo 🔑 Configurando JWT_SECRET_KEY...
set "JWT_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
set "JWT_SECRET_KEY=%JWT_KEY%"

echo ✅ JWT_SECRET_KEY configurada
echo.
cd CozinhaApp.API
echo 🚀 Iniciando...
dotnet run
cd ..
goto :menu

:frontend
cls
echo.
echo ========================================
echo    🎨 Iniciando Frontend
echo ========================================
echo.

echo 🔍 Verificando processos existentes...
taskkill /F /IM node.exe >nul 2>&1

cd CozinhaApp

REM Limpa cache do Vite
echo 🧹 Limpando cache...
if exist "node_modules/.vite" (
    rmdir /s /q "node_modules\.vite"
)

echo 📦 Verificando dependências...
call npm install

echo 🚀 Iniciando...
npm run dev
cd ..
goto :menu

:exit
cls
echo.
echo ========================================
echo    👋 Encerrando CozinhaApp
echo ========================================
echo.
echo 🛑 Finalizando processos...

taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend finalizado
) else (
    echo ℹ️  Frontend já estava parado
)

taskkill /F /IM dotnet.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend finalizado
) else (
    echo ℹ️  Backend já estava parado
)

echo.
echo ✅ Aplicação encerrada!
echo.
timeout /t 2 /nobreak >nul
exit /b 0
