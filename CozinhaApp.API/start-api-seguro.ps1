# Script para iniciar a API CozinhaApp com verificação de chave JWT
# Garante que a chave JWT tenha pelo menos 256 bits

$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "🚀 Iniciando CozinhaApp API..."
Write-Host ""

# Mata todos os processos dotnet existentes
Write-ColorOutput Yellow "🔍 Verificando processos existentes..."
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue

if ($dotnetProcesses) {
    Write-ColorOutput Red "🛑 Finalizando $($dotnetProcesses.Count) processo(s) dotnet existente(s)..."
    Stop-Process -Name "dotnet" -Force -ErrorAction SilentlyContinue
    Write-ColorOutput Green "✅ Processos dotnet finalizados"
} else {
    Write-ColorOutput Cyan "ℹ️  Nenhum processo dotnet encontrado"
}

Write-ColorOutput Yellow "⏳ Aguardando liberação da porta 5057..."
Start-Sleep -Seconds 3

# Define a chave JWT com garantia de tamanho mínimo
$jwtKey = "MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

# Verifica o tamanho da chave em bits
$keyBytes = [System.Text.Encoding]::UTF8.GetBytes($jwtKey)
$keyBits = $keyBytes.Length * 8

Write-ColorOutput Yellow "🔑 Verificando tamanho da chave JWT..."
Write-Host "   Tamanho atual: $($jwtKey.Length) caracteres ($keyBits bits)"

if ($keyBits -lt 256) {
    Write-ColorOutput Red "❌ ERRO: Chave JWT muito curta! Precisa ter pelo menos 256 bits."
    Write-Host "   Tamanho atual: $keyBits bits"
    Write-Host "   Mínimo necessário: 256 bits"
    exit 1
}

Write-ColorOutput Green "✅ Chave JWT tem tamanho suficiente para HS256 ($keyBits bits)"

# Define a variável de ambiente
$env:JWT_SECRET_KEY = $jwtKey

Write-ColorOutput Green "✅ JWT_SECRET_KEY configurada"
Write-Host ""

# Executa dotnet run
Write-ColorOutput Cyan "🔄 Executando dotnet run..."
Write-ColorOutput Yellow "🌐 API será executada em: http://localhost:5057"
Write-ColorOutput Red "⚠️  Pressione Ctrl+C para parar a API"
Write-Host ""

try {
    dotnet run
}
catch {
    Write-ColorOutput Red "❌ Erro ao executar a API:"
    Write-Host $_.Exception.Message
    exit 1
}
finally {
    Write-Host ""
    Write-ColorOutput Red "🛑 API finalizada"
}
