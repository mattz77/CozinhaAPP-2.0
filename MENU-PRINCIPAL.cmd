@echo off
title CozinhaApp - Menu Principal
color 0F

:menu
cls
echo.
echo ========================================
echo    🍽️  COZINHA APP - MENU PRINCIPAL 🍽️
echo ========================================
echo.
echo Escolha uma opção:
echo.
echo 1. 🚀 Iniciar Backend (API) - Porta 5057
echo 2. 🌐 Iniciar Frontend (React) - Porta 3000
echo 3. 🚀 Iniciar Aplicação Completa (Backend + Frontend)
echo 4. 📁 Abrir Pasta do Backend
echo 5. 📁 Abrir Pasta do Frontend
echo 6. ❌ Sair
echo.
set /p choice="Digite sua escolha (1-6): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Iniciando Backend...
    start "CozinhaApp Backend" cmd /k "cd /d %~dp0CozinhaApp.API && INICIAR-API.cmd"
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo 🌐 Iniciando Frontend...
    start "CozinhaApp Frontend" cmd /k "cd /d %~dp0CozinhaApp && INICIAR-FRONTEND.cmd"
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo 🚀 Iniciando Aplicação Completa...
    start "CozinhaApp Complete" cmd /k "cd /d %~dp0CozinhaApp && INICIAR-APLICACAO-COMPLETA.cmd"
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo 📁 Abrindo pasta do Backend...
    explorer "%~dp0CozinhaApp.API"
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo 📁 Abrindo pasta do Frontend...
    explorer "%~dp0CozinhaApp"
    goto menu
)

if "%choice%"=="6" (
    echo.
    echo 👋 Até logo!
    exit
)

echo.
echo ❌ Opção inválida! Tente novamente.
pause
goto menu
