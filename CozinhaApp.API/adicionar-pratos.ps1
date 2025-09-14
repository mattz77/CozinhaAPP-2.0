# Script para adicionar novos pratos ao banco de dados
# Execute este script após fazer login para obter o token de autenticação

Write-Host "🍽️ Adicionando novos pratos ao CozinhaApp..." -ForegroundColor Green

# Primeiro, vamos fazer login para obter o token
Write-Host "🔐 Fazendo login..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@cozinhaapp.com"
    password = "Admin123!@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5057/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao fazer login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers com autenticação
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Dados dos novos pratos
$novosPratos = @(
    @{
        Nome = "Carpaccio de Salmão"
        Descricao = "Fatias finas de salmão fresco com rúcula e parmesão"
        Preco = 32.90
        ImagemUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500``&h=400``&fit=crop"
        Disponivel = $true
        TempoPreparo = 10
        Tipo = "Entrada"
        CategoriaId = 1
    },
    @{
        Nome = "Ceviche de Peixe Branco"
        Descricao = "Peixe branco marinado em limão com cebola roxa e coentro"
        Preco = 28.90
        ImagemUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 20
        Tipo = "Entrada"
        CategoriaId = 1
    },
    @{
        Nome = "Salmão Grelhado"
        Descricao = "Salmão grelhado com legumes assados e molho de ervas"
        Preco = 52.90
        ImagemUrl = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 25
        Tipo = "Prato Principal"
        CategoriaId = 2
    },
    @{
        Nome = "Penne ao Pesto"
        Descricao = "Massa penne com molho pesto de manjericão e pinoli"
        Preco = 38.90
        ImagemUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 20
        Tipo = "Prato Principal"
        CategoriaId = 2
    },
    @{
        Nome = "Costela de Cordeiro"
        Descricao = "Costela de cordeiro grelhada com batatas rústicas"
        Preco = 68.90
        ImagemUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 35
        Tipo = "Prato Principal"
        CategoriaId = 2
    },
    @{
        Nome = "Lasanha à Bolonhesa"
        Descricao = "Lasanha tradicional com molho bolonhesa e queijo"
        Preco = 42.90
        ImagemUrl = "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 40
        Tipo = "Prato Principal"
        CategoriaId = 2
    },
    @{
        Nome = "Panna Cotta de Frutas Vermelhas"
        Descricao = "Creme italiano com calda de frutas vermelhas"
        Preco = 19.90
        ImagemUrl = "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 15
        Tipo = "Sobremesa"
        CategoriaId = 3
    },
    @{
        Nome = "Cheesecake de Limão"
        Descricao = "Cheesecake cremoso com calda de limão siciliano"
        Preco = 24.90
        ImagemUrl = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 25
        Tipo = "Sobremesa"
        CategoriaId = 3
    },
    @{
        Nome = "Profiteroles de Chocolate"
        Descricao = "Bolinhas de massa folhada com creme e calda de chocolate"
        Preco = 26.90
        ImagemUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 30
        Tipo = "Sobremesa"
        CategoriaId = 3
    },
    @{
        Nome = "Suco de Laranja Natural"
        Descricao = "Suco de laranja fresco espremido na hora"
        Preco = 12.90
        ImagemUrl = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 5
        Tipo = "Bebida"
        CategoriaId = 4
    },
    @{
        Nome = "Café Expresso"
        Descricao = "Café expresso italiano tradicional"
        Preco = 8.90
        ImagemUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 3
        Tipo = "Bebida"
        CategoriaId = 4
    },
    @{
        Nome = "Vinho Tinto da Casa"
        Descricao = "Vinho tinto selecionado para harmonizar com nossos pratos"
        Preco = 35.90
        ImagemUrl = "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 2
        Tipo = "Bebida"
        CategoriaId = 4
    },
    @{
        Nome = "Água com Gás"
        Descricao = "Água mineral com gás natural"
        Preco = 6.90
        ImagemUrl = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500`&h=400`&fit=crop"
        Disponivel = $true
        TempoPreparo = 1
        Tipo = "Bebida"
        CategoriaId = 4
    }
)

Write-Host "📝 Enviando $($novosPratos.Count) novos pratos..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5057/api/pratos/bulk" -Method POST -Body ($novosPratos | ConvertTo-Json -Depth 10) -Headers $headers
    
    Write-Host "✅ Processamento concluído!" -ForegroundColor Green
    Write-Host "📊 Pratos criados: $($response.pratosCriados)" -ForegroundColor Cyan
    Write-Host "📤 Total enviados: $($response.totalEnviados)" -ForegroundColor Cyan
    
    if ($response.erros.Count -gt 0) {
        Write-Host "⚠️ Erros encontrados:" -ForegroundColor Yellow
        foreach ($erro in $response.erros) {
            Write-Host "   - $erro" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Erro ao adicionar pratos: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorContent = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorContent)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Detalhes do erro: $errorBody" -ForegroundColor Red
    }
}

# Verificar o resultado
Write-Host "`n🔍 Verificando pratos no banco..." -ForegroundColor Yellow
try {
    $pratosResponse = Invoke-RestMethod -Uri "http://localhost:5057/api/pratos" -Method GET
    Write-Host "✅ Total de pratos disponíveis: $($pratosResponse.Count)" -ForegroundColor Green
    
    # Mostrar alguns pratos
    Write-Host "`n📋 Alguns pratos disponíveis:" -ForegroundColor Cyan
    $pratosResponse | Select-Object -First 5 | ForEach-Object {
        Write-Host "   - $($_.nome) (R$ $($_.preco))" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Erro ao verificar pratos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Script concluído!" -ForegroundColor Green
