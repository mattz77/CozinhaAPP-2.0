@echo off
title CozinhaApp Frontend - Debug e Testes
color 0B

echo.
echo ========================================
echo    🔍 COZINHA APP FRONTEND - DEBUG MODE
echo ========================================
echo.

echo 🔍 Verificando processos existentes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos Node finalizados
) else (
    echo ℹ️  Nenhum processo Node encontrado
)

echo.
echo 🔍 Verificando porta 3000...
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Porta 3000 está em uso!
    echo 🛑 Finalizando processos...
    taskkill /F /IM node.exe >nul 2>&1
    echo ⏳ Aguardando liberação da porta...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Porta 3000 está livre
)

echo.
echo 🔧 Configurações:
echo    📍 Ambiente: Development
echo    🌐 Frontend URL: http://localhost:3000
echo    🌐 Backend URL: http://localhost:5057
echo.

echo 📦 Verificando dependências...
call npm list vite typescript @types/react react-router-dom @tanstack/react-query axios > frontend_deps.log 2>&1
type frontend_deps.log
del frontend_deps.log

echo.
echo 🧪 Iniciando testes de conexão...
echo ========================================

echo.
echo 📡 Testando conexão com o backend...
curl -v "http://localhost:5057/api/categorias" -H "accept: application/json" > backend_test.log 2>&1
type backend_test.log
del backend_test.log

echo.
echo 🚀 Iniciando frontend com logs detalhados...
echo ========================================

set VITE_DEBUG=true
set VITE_API_URL=http://localhost:5057/api
set DEBUG=vite:*
set NODE_OPTIONS=--trace-warnings

echo 📝 Logs serão salvos em: frontend_debug.log

call npm run dev > frontend_debug.log 2>&1

echo.
echo ⚠️  Frontend iniciado em modo debug
echo ✅ Acesse: http://localhost:3000
echo 📝 Verifique os logs em: frontend_debug.log
echo.
echo Para parar, pressione Ctrl+C
echo ========================================

type frontend_debug.log
