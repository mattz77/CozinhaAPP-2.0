@echo off
title CozinhaApp Frontend - Limpeza e Reinstalação
color 0B

echo.
echo ========================================
echo    🧹 LIMPEZA E REINSTALAÇÃO 🧹
echo ========================================
echo.

echo 🔍 Verificando processos Node...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Processos Node finalizados
) else (
    echo ℹ️  Nenhum processo Node encontrado
)

echo.
echo 🗑️  Removendo diretórios de cache...

if exist "node_modules\" (
    echo 📦 Removendo node_modules...
    rmdir /s /q "node_modules"
)

if exist ".vite\" (
    echo 🧹 Removendo cache do Vite...
    rmdir /s /q ".vite"
)

if exist "dist\" (
    echo 🧹 Removendo pasta dist...
    rmdir /s /q "dist"
)

echo.
echo 🧹 Limpando cache do npm...
call npm cache clean --force

echo.
echo 📦 Instalando dependências...
call npm install

echo.
echo ✅ Limpeza e reinstalação concluídas!
echo.
echo Para iniciar o frontend, execute:
echo npm run dev
echo.
echo Pressione qualquer tecla para sair...
pause >nul
