# Script para testar a API do CozinhaApp
$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Url,
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Description
    )

    try {
        $params = @{
            Method = $Method
            Uri = $Url
            Headers = $Headers
            ContentType = 'application/json'
        }

        if ($Body) {
            $params.Body = $Body
        }

        Write-ColorOutput Yellow "🔍 Testando: $Description"
        Write-Host "   URL: $Url"
        Write-Host "   Método: $Method"
        if ($Body) {
            Write-Host "   Body: $Body"
        }

        $response = Invoke-WebRequest @params
        Write-ColorOutput Green "✅ Sucesso! Status: $($response.StatusCode)"
        Write-Host "   Resposta:"
        $responseContent = $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
        Write-Host $responseContent
        return $response
    }
    catch {
        Write-ColorOutput Red "❌ Erro! Status: $($_.Exception.Response.StatusCode)"
        Write-Host "   Mensagem: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Resposta de erro:"
            Write-Host $responseBody
        }
        return $null
    }
    Write-Host ""
}

Write-ColorOutput Green "🚀 Iniciando testes da API CozinhaApp..."
Write-Host ""

# Configurar a chave JWT
$jwtKey = "MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
$env:JWT_SECRET_KEY = $jwtKey

Write-ColorOutput Yellow "🔑 Verificando tamanho da chave JWT..."
$keyBits = $jwtKey.Length * 8
Write-Host "   Tamanho: $($jwtKey.Length) caracteres ($keyBits bits)"
if ($keyBits -lt 256) {
    Write-ColorOutput Red "❌ ERRO: Chave muito curta! Mínimo: 256 bits"
    exit 1
}

# Matar processos existentes
Write-ColorOutput Yellow "🔍 Verificando processos existentes..."
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "   Finalizando processo $($_.Id)..."
    Stop-Process -Id $_.Id -Force
}

# Iniciar a API
Write-ColorOutput Yellow "🚀 Iniciando a API..."
$apiProcess = Start-Process "dotnet" -ArgumentList "run" -NoNewWindow -PassThru

Write-Host "⏳ Aguardando API iniciar..."
Start-Sleep -Seconds 10

$baseUrl = "http://localhost:5057"

# Teste 1: GET /api/categorias
Write-ColorOutput Cyan "📡 Teste 1: Buscar Categorias"
$categorias = Test-Endpoint -Method "GET" -Url "$baseUrl/api/categorias" -Description "GET /api/categorias"

# Teste 2: GET /api/pratos/with-categories
Write-ColorOutput Cyan "📡 Teste 2: Buscar Pratos com Categorias"
$pratos = Test-Endpoint -Method "GET" -Url "$baseUrl/api/pratos/with-categories" -Description "GET /api/pratos/with-categories"

# Teste 3: Login como Admin
Write-ColorOutput Cyan "📡 Teste 3: Login como Admin"
$loginBody = @{
    email = "admin@cozinhaapp.com"
    password = "Admin123!@#"
} | ConvertTo-Json

$loginResponse = Test-Endpoint -Method "POST" -Url "$baseUrl/api/auth/login" -Body $loginBody -Description "POST /api/auth/login"

if ($loginResponse) {
    $token = ($loginResponse.Content | ConvertFrom-Json).token
    Write-ColorOutput Green "🔑 Token JWT recebido!"
    
    # Teste 4: Buscar usuário atual (endpoint autenticado)
    Write-ColorOutput Cyan "📡 Teste 4: Buscar Usuário Atual (Autenticado)"
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    Test-Endpoint -Method "GET" -Url "$baseUrl/api/auth/me" -Headers $headers -Description "GET /api/auth/me (Autenticado)"
}

Write-ColorOutput Green "✅ Testes concluídos!"
Write-Host ""
Write-ColorOutput Yellow "⚠️  Pressione qualquer tecla para finalizar a API..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-ColorOutput Yellow "🛑 Finalizando API..."
Stop-Process -Id $apiProcess.Id -Force
Write-ColorOutput Green "✅ API finalizada!"
