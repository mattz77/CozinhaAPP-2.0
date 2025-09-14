# Script para iniciar o Frontend CozinhaApp
# Executa npm run dev

Write-Host "🌐 Iniciando CozinhaApp Frontend..." -ForegroundColor Green

# Executa npm run dev
Write-Host "🔄 Executando npm run dev..." -ForegroundColor Cyan
Write-Host "🌐 Frontend será executado em: http://localhost:3000" -ForegroundColor Yellow
Write-Host "⚠️  Pressione Ctrl+C para parar o frontend" -ForegroundColor Red
Write-Host ""

npm run dev

Write-Host ""
Write-Host "🛑 Frontend finalizado" -ForegroundColor Red
