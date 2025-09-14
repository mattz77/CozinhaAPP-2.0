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
taskkill /F /IM dotnet.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos dotnet finalizados
) else (
    echo ℹ️  Nenhum processo dotnet encontrado
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
timeout /t 5 /nobreak >nul

echo 🎨 Iniciando Frontend...
start "CozinhaApp Frontend" cmd /c "cd CozinhaApp && npm run dev"

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

taskkill /F /IM dotnet.exe >nul 2>&1
echo ✅ Backend finalizado

timeout /t 2 /nobreak >nul
goto :both

:backend
cls
cd CozinhaApp.API
echo.
echo ========================================
echo    🚀 Iniciando Backend
echo ========================================
echo.

echo 🔑 Configurando JWT_SECRET_KEY...
set "JWT_KEY=MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
set "JWT_SECRET_KEY=%JWT_KEY%"

echo ✅ JWT_SECRET_KEY configurada
echo.
echo 🚀 Iniciando...
dotnet run
cd ..
goto :menu

:frontend
cls
cd CozinhaApp
echo.
echo ========================================
echo    🎨 Iniciando Frontend
echo ========================================
echo.
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
