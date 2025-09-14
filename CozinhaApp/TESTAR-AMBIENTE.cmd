@echo off
title CozinhaApp Frontend - Teste de Ambiente
color 0B

echo.
echo ========================================
echo    🔍 TESTE DE AMBIENTE REACT/VITE
echo ========================================
echo.

echo 🔍 Verificando processos Node...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 📝 Criando arquivo .env...
echo VITE_DEBUG=true > .env
echo VITE_API_URL=http://localhost:5057/api >> .env

echo.
echo 🧹 Limpando cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
)

echo.
echo 📦 Verificando node_modules...
if not exist "node_modules\" (
    echo ⚠️ node_modules não encontrado, instalando dependências...
    call npm install
) else (
    echo ✅ node_modules encontrado
)

echo.
echo 🚀 Iniciando servidor de desenvolvimento...
echo.
echo 🔍 Logs detalhados serão salvos em: debug_frontend.log
echo.
echo ⚠️ Aguarde a mensagem "ready in XXX ms"
echo.

set DEBUG=vite:*
call npm run dev -- --debug > debug_frontend.log 2>&1

echo.
echo ✅ Servidor iniciado!
echo.
echo 🌐 Acesse: http://localhost:3000
echo 📝 Verifique os logs em: debug_frontend.log
echo.
echo Para parar, pressione Ctrl+C
echo ========================================

type debug_frontend.log
