@echo off
title CozinhaApp - Full Stack (Backend + Frontend)
color 0E

echo.
echo ========================================
echo    🚀 COZINHA APP - FULL STACK 🚀
echo    Backend + Frontend
echo ========================================
echo.

echo 🔧 Iniciando Backend (API)...
echo 🌐 Backend será executado em: http://localhost:5057
echo.

REM Inicia o backend em uma nova janela
start "CozinhaApp Backend" cmd /k "cd /d %~dp0..\CozinhaApp.API && INICIAR-API.cmd"

echo ⏳ Aguardando 5 segundos para o backend inicializar...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Iniciando Frontend (React)...
echo 🌐 Frontend será executado em: http://localhost:3000
echo.

REM Executa o frontend na janela atual
npm run dev

echo.
echo ========================================
echo 🛑 Aplicação finalizada
echo ========================================
pause
