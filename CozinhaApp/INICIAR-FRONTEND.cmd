@echo off
title CozinhaApp Frontend - React
color 0B

echo.
echo ========================================
echo    🌐 COZINHA APP FRONTEND - REACT 🌐
echo ========================================
echo.

echo ✅ Verificando dependências...
echo 🔄 Executando npm run dev...
echo 🌐 Frontend será executado em: http://localhost:3000
echo.
echo ⚠️  Pressione Ctrl+C para parar o frontend
echo ========================================
echo.

REM Executa npm run dev
npm run dev

echo.
echo ========================================
echo 🛑 Frontend finalizado
echo ========================================
pause
