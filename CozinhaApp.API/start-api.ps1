# Script para iniciar a API CozinhaApp
# Define a variável de ambiente JWT_SECRET_KEY e executa dotnet run

Write-Host "🚀 Iniciando CozinhaApp API..." -ForegroundColor Green

# Define a variável de ambiente JWT_SECRET_KEY com a chave correta (mais de 256 bits)
$env:JWT_SECRET_KEY = "MinhaChaveSuperSecretaParaDesenvolvimento123456789!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"

Write-Host "✅ JWT_SECRET_KEY configurada (256+ bits)" -ForegroundColor Yellow

# Executa dotnet run
Write-Host "🔄 Executando dotnet run..." -ForegroundColor Cyan
dotnet run

Write-Host "🛑 API finalizada" -ForegroundColor Red
