using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;
using CozinhaApp.API.Interfaces;
using CozinhaApp.API.Services;
using CozinhaApp.API.Middleware;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
builder.Services.AddDbContext<CozinhaAppContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity configuration
var securityConfig = builder.Configuration.GetSection("Security");
var passwordPolicy = securityConfig.GetSection("PasswordPolicy");

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configurações de senha seguras
    options.Password.RequireDigit = passwordPolicy.GetValue<bool>("RequireDigit");
    options.Password.RequireLowercase = passwordPolicy.GetValue<bool>("RequireLowercase");
    options.Password.RequireNonAlphanumeric = passwordPolicy.GetValue<bool>("RequireNonAlphanumeric");
    options.Password.RequireUppercase = passwordPolicy.GetValue<bool>("RequireUppercase");
    options.Password.RequiredLength = passwordPolicy.GetValue<int>("MinLength");
    options.Password.RequiredUniqueChars = passwordPolicy.GetValue<int>("RequiredUniqueChars");

    // Configurações de usuário
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;

    // Configurações de lockout mais rigorosas
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(securityConfig.GetValue<int>("LockoutDurationMinutes"));
    options.Lockout.MaxFailedAccessAttempts = securityConfig.GetValue<int>("MaxFailedLoginAttempts");
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<CozinhaAppContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? 
             Environment.GetEnvironmentVariable("JWT_SECRET_KEY_DEV") ?? 
             jwtSettings["Key"] ??
             "MinhaChaveSuperSecretaParaDesenvolvimento123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Validar se a chave JWT está configurada
if (string.IsNullOrEmpty(jwtKey) || jwtKey.StartsWith("${"))
{
    throw new InvalidOperationException("JWT Key não configurada. Configure a variável de ambiente JWT_SECRET_KEY.");
}

// Log do tamanho da chave para debug
Console.WriteLine($"🔑 JWT Key configurada - Tamanho: {jwtKey.Length} caracteres ({jwtKey.Length * 8} bits)");

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var requireHttps = securityConfig.GetValue<bool>("RequireHttps");
    options.RequireHttpsMetadata = requireHttps;
    options.SaveToken = true;
    
    // Adicionar eventos para debug
    options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"❌ JWT Authentication Failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine($"✅ JWT Token Validated for user: {context.Principal?.Identity?.Name}");
            return Task.CompletedTask;
        },
        OnMessageReceived = context =>
        {
            Console.WriteLine($"🔍 JWT Message Received: {context.Request.Path}");
            return Task.CompletedTask;
        }
    };
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RequireExpirationTime = true
    };
});

// Register services
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<CozinhaApp.API.Services.IPedidoService, CozinhaApp.API.Services.PedidoService>();
builder.Services.AddScoped<ILoggingService, LoggingService>();

// Configurar a chave JWT para injeção de dependência
builder.Configuration["Jwt:Key"] = jwtKey;
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// CORS configuration for React frontend
var allowedOrigins = securityConfig.GetSection("AllowedOrigins").Get<string[]>() ?? 
    new[] { 
        "http://localhost:3000",
        "https://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3001",
        "http://localhost:5057",
        "https://localhost:5057"
    };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetIsOriginAllowed(origin => true); // Em desenvolvimento, permite qualquer origem
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Log de configurações em desenvolvimento
    Console.WriteLine("\n🔧 Configurações da API em Desenvolvimento:");
    Console.WriteLine($"📍 Ambiente: {app.Environment.EnvironmentName}");
    Console.WriteLine($"🌐 URLs: {string.Join(", ", app.Urls)}");
    Console.WriteLine($"🔑 JWT Key Length: {jwtKey.Length} chars ({jwtKey.Length * 8} bits)");
    Console.WriteLine($"🔒 JWT Issuer: {jwtSettings["Issuer"]}");
    Console.WriteLine($"🔒 JWT Audience: {jwtSettings["Audience"]}");
    Console.WriteLine($"🌍 CORS Origins: {string.Join(", ", allowedOrigins)}");
    Console.WriteLine("✅ Swagger habilitado em /swagger\n");
}

// Enable CORS first
app.UseCors("ReactApp");

// Then security middlewares
app.UseMiddleware<SecurityMiddleware>();
// app.UseMiddleware<AuditLoggingMiddleware>(); // Temporariamente desabilitado para debug

// HTTPS redirection after CORS
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoint de teste simples para debug
app.MapGet("/debug/test", () => "Debug funcionando!");

app.MapGet("/debug/json", () => new { message = "JSON funcionando!", timestamp = DateTime.UtcNow });

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CozinhaAppContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    // Criar banco de dados
    context.Database.EnsureCreated();
    
    // Criar roles padrão
    await SeedRolesAsync(roleManager);
    
    // Criar usuários de teste para desenvolvimento
    await SeedTestUsersAsync(userManager, context);
    
    // Popular dados de exemplo
    await SeedDataAsync(context);
}

app.Run();

// Métodos de seed
async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
{
    string[] roles = { "Admin", "User", "Manager" };
    
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
{
    var adminEmail = "admin@cozinhaapp.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    
    if (adminUser == null)
    {
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            NomeCompleto = "Administrador",
            EmailConfirmed = true,
            Ativo = true,
            DataCriacao = DateTime.UtcNow
        };
        
        // Gerar senha segura para admin
        var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? 
                           Guid.NewGuid().ToString("N")[..12] + "!@#";
        
        var result = await userManager.CreateAsync(adminUser, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            Console.WriteLine($"🔐 Usuário admin criado com senha: {adminPassword}");
            Console.WriteLine("⚠️  IMPORTANTE: Altere esta senha imediatamente!");
        }
    }
}

async Task SeedTestUsersAsync(UserManager<ApplicationUser> userManager, CozinhaAppContext context)
{
    // Usuários de teste para desenvolvimento
    var testUsers = new[]
    {
        new { 
            Email = "admin@cozinhaapp.com", 
            Nome = "Administrador", 
            Password = "Admin123!@#", 
            Role = "Admin",
            Endereco = "Rua das Flores, 123",
            Cidade = "São Paulo",
            Cep = "01234-567",
            Telefone = "(11) 99999-0001"
        },
        new { 
            Email = "joao@teste.com", 
            Nome = "João Silva", 
            Password = "Joao123!@#", 
            Role = "User",
            Endereco = "Av. Paulista, 1000",
            Cidade = "São Paulo",
            Cep = "01310-100",
            Telefone = "(11) 99999-0002"
        },
        new { 
            Email = "maria@teste.com", 
            Nome = "Maria Santos", 
            Password = "Maria123!@#", 
            Role = "User",
            Endereco = "Rua Augusta, 456",
            Cidade = "São Paulo",
            Cep = "01305-000",
            Telefone = "(11) 99999-0003"
        },
        new { 
            Email = "pedro@teste.com", 
            Nome = "Pedro Costa", 
            Password = "Pedro123!@#", 
            Role = "Manager",
            Endereco = "Rua Oscar Freire, 789",
            Cidade = "São Paulo",
            Cep = "01426-001",
            Telefone = "(11) 99999-0004"
        }
    };

    foreach (var userData in testUsers)
    {
        var existingUser = await userManager.FindByEmailAsync(userData.Email);
        
        if (existingUser == null)
        {
            // Criar usuário na tabela AspNetUsers
            var user = new ApplicationUser
            {
                UserName = userData.Email,
                Email = userData.Email,
                NomeCompleto = userData.Nome,
                Endereco = userData.Endereco,
                Cidade = userData.Cidade,
                Cep = userData.Cep,
                DataNascimento = DateTime.UtcNow.AddYears(-25),
                DataCriacao = DateTime.UtcNow,
                Ativo = true,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, userData.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, userData.Role);
                
                // Criar cliente na tabela Clientes
                var cliente = new Cliente
                {
                    Nome = userData.Nome,
                    Email = userData.Email,
                    Telefone = userData.Telefone,
                    Endereco = userData.Endereco,
                    Cidade = userData.Cidade,
                    Cep = userData.Cep,
                    DataCriacao = DateTime.UtcNow,
                    UserId = user.Id // Relacionar com o usuário criado
                };

                context.Clientes.Add(cliente);
                await context.SaveChangesAsync();
                
                Console.WriteLine($"👤 Usuário de teste criado:");
                Console.WriteLine($"   📧 Email: {userData.Email}");
                Console.WriteLine($"   🔑 Senha: {userData.Password}");
                Console.WriteLine($"   👤 Nome: {userData.Nome}");
                Console.WriteLine($"   🏷️ Função: {userData.Role}");
                Console.WriteLine($"   📱 Telefone: {userData.Telefone}");
                Console.WriteLine($"   🏠 Endereço: {userData.Endereco}, {userData.Cidade}");
                Console.WriteLine($"   📦 Cliente ID: {cliente.Id}");
                Console.WriteLine($"   🔗 User ID: {user.Id}");
                Console.WriteLine();
            }
            else
            {
                Console.WriteLine($"❌ Erro ao criar usuário {userData.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            // Resetar senha para usuários existentes (especialmente admin)
            var token = await userManager.GeneratePasswordResetTokenAsync(existingUser);
            var resetResult = await userManager.ResetPasswordAsync(existingUser, token, userData.Password);
            
            if (resetResult.Succeeded)
            {
                Console.WriteLine($"🔄 Senha resetada para {userData.Email}: {userData.Password}");
            }
            
            // Verificar se existe cliente correspondente
            var existingCliente = context.Clientes.FirstOrDefault(c => c.UserId == existingUser.Id);
            if (existingCliente == null)
            {
                // Criar cliente se não existir
                var cliente = new Cliente
                {
                    Nome = userData.Nome,
                    Email = userData.Email,
                    Telefone = userData.Telefone,
                    Endereco = userData.Endereco,
                    Cidade = userData.Cidade,
                    Cep = userData.Cep,
                    DataCriacao = DateTime.UtcNow,
                    UserId = existingUser.Id
                };

                context.Clientes.Add(cliente);
                await context.SaveChangesAsync();
                Console.WriteLine($"✅ Cliente criado para usuário existente: {userData.Email} (Cliente ID: {cliente.Id})");
            }
            else
            {
                Console.WriteLine($"✅ Usuário e cliente {userData.Email} já existem");
            }
        }
    }
}

static async Task UpdateExistingPratos(CozinhaAppContext context)
{
    Console.WriteLine("🔄 Atualizando pratos existentes com imagens...");
    
    // Atualizar pratos existentes com imagens
    var pratosExistentes = await context.Pratos.ToListAsync();
    
    var imagensPratos = new Dictionary<string, string>
    {
        { "Bruschetta Italiana", "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=400&fit=crop" },
        { "Risotto de Cogumelos", "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=400&fit=crop" },
        { "Tiramisu", "https://images.unsplash.com/photo-1571877227200-a4d0eaefd519?w=500&h=400&fit=crop" }
    };
    
    foreach (var prato in pratosExistentes)
    {
        if (imagensPratos.ContainsKey(prato.Nome) && string.IsNullOrEmpty(prato.ImagemUrl))
        {
            prato.ImagemUrl = imagensPratos[prato.Nome];
            Console.WriteLine($"🖼️ Atualizada imagem para: {prato.Nome}");
        }
    }
    
    // Adicionar novos pratos se não existirem
    var categoriasDb = context.Categorias.ToList();
    var entradaId = categoriasDb.FirstOrDefault(c => c.Nome == "Entrada" || c.Nome == "Entradas")?.Id;
    var principalId = categoriasDb.FirstOrDefault(c => c.Nome == "Prato Principal" || c.Nome == "Pratos Principais")?.Id;
    var sobremesaId = categoriasDb.FirstOrDefault(c => c.Nome == "Sobremesa" || c.Nome == "Sobremesas")?.Id;
    var bebidaId = categoriasDb.FirstOrDefault(c => c.Nome == "Bebida" || c.Nome == "Bebidas")?.Id;
    
    if (!entradaId.HasValue || !principalId.HasValue || !sobremesaId.HasValue)
    {
        Console.WriteLine("❌ Categorias necessárias não encontradas!");
        Console.WriteLine($"Categorias disponíveis: {string.Join(", ", categoriasDb.Select(c => c.Nome))}");
        return;
    }
    
    
    var novosPratos = new[]
    {
        // NOVOS PRATOS
        new Prato 
        { 
            Nome = "Carpaccio de Salmão", 
            Descricao = "Fatias finas de salmão fresco com rúcula e parmesão", 
            Preco = 32.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 10, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId.Value
        },
        new Prato 
        { 
            Nome = "Ceviche de Peixe Branco", 
            Descricao = "Peixe branco marinado em limão com cebola roxa e coentro", 
            Preco = 28.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId.Value
        },
        new Prato 
        { 
            Nome = "Salmão Grelhado", 
            Descricao = "Salmão grelhado com legumes assados e molho de ervas", 
            Preco = 52.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 25, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Penne ao Pesto", 
            Descricao = "Massa penne com molho pesto de manjericão e pinoli", 
            Preco = 38.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Costela de Cordeiro", 
            Descricao = "Costela de cordeiro grelhada com batatas rústicas", 
            Preco = 68.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 35, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Lasanha à Bolonhesa", 
            Descricao = "Lasanha tradicional com molho bolonhesa e queijo", 
            Preco = 42.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 40, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Panna Cotta de Frutas Vermelhas", 
            Descricao = "Creme italiano com calda de frutas vermelhas", 
            Preco = 19.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 15, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Cheesecake de Limão", 
            Descricao = "Cheesecake cremoso com calda de limão siciliano", 
            Preco = 24.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 25, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Profiteroles de Chocolate", 
            Descricao = "Bolinhas de massa folhada com creme e calda de chocolate", 
            Preco = 26.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 30, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Suco de Laranja Natural", 
            Descricao = "Suco de laranja fresco espremido na hora", 
            Preco = 12.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 5, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        },
        new Prato 
        { 
            Nome = "Café Expresso", 
            Descricao = "Café expresso italiano tradicional", 
            Preco = 8.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 3, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        },
        new Prato 
        { 
            Nome = "Vinho Tinto da Casa", 
            Descricao = "Vinho tinto selecionado para harmonizar com nossos pratos", 
            Preco = 35.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 2, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        },
        new Prato 
        { 
            Nome = "Água com Gás", 
            Descricao = "Água mineral com gás natural", 
            Preco = 6.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 1, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        }
    };
    
    // Verificar quais pratos já existem
    var nomesExistentes = pratosExistentes.Select(p => p.Nome).ToHashSet();
    var pratosParaAdicionar = novosPratos.Where(p => !nomesExistentes.Contains(p.Nome)).ToList();
    
    if (pratosParaAdicionar.Any())
    {
        context.Pratos.AddRange(pratosParaAdicionar);
        Console.WriteLine($"✅ {pratosParaAdicionar.Count} novos pratos adicionados!");
    }
    else
    {
        Console.WriteLine("ℹ️ Todos os pratos já existem.");
    }
    
    await context.SaveChangesAsync();
    Console.WriteLine("✅ Atualização concluída!");
}

async Task SeedDataAsync(CozinhaAppContext context)
{
    Console.WriteLine("🌱 Iniciando seed de dados...");
    
    // Verificar se já existem dados
    var categoriaCount = context.Categorias.Count();
    var pratoCount = context.Pratos.Count();
    
    Console.WriteLine($"📊 Categorias existentes: {categoriaCount}");
    Console.WriteLine($"📊 Pratos existentes: {pratoCount}");
    
    if (categoriaCount > 0 && pratoCount > 0)
    {
        Console.WriteLine("✅ Dados já existem, atualizando pratos com imagens...");
        await UpdateExistingPratos(context);
        return;
    }
    
    Console.WriteLine("🔄 Forçando criação de dados...");
    
    Console.WriteLine("🏗️ Criando categorias...");
    
    // Criar categorias
    var categorias = new[]
    {
        new Categoria { Nome = "Entrada", Descricao = "Pratos para começar a refeição", Ativa = true, DataCriacao = DateTime.UtcNow },
        new Categoria { Nome = "Prato Principal", Descricao = "Pratos principais", Ativa = true, DataCriacao = DateTime.UtcNow },
        new Categoria { Nome = "Sobremesa", Descricao = "Doces e sobremesas", Ativa = true, DataCriacao = DateTime.UtcNow }
    };
    
    context.Categorias.AddRange(categorias);
    await context.SaveChangesAsync();
    
    Console.WriteLine($"✅ {categorias.Length} categorias criadas!");
    
    // Recarregar categorias para obter IDs
    var categoriasDb = context.Categorias.ToList();
    var entradaId = categoriasDb.FirstOrDefault(c => c.Nome == "Entrada" || c.Nome == "Entradas")?.Id;
    var principalId = categoriasDb.FirstOrDefault(c => c.Nome == "Prato Principal" || c.Nome == "Pratos Principais")?.Id;
    var sobremesaId = categoriasDb.FirstOrDefault(c => c.Nome == "Sobremesa" || c.Nome == "Sobremesas")?.Id;
    var bebidaId = categoriasDb.FirstOrDefault(c => c.Nome == "Bebida" || c.Nome == "Bebidas")?.Id;
    
    if (!entradaId.HasValue || !principalId.HasValue || !sobremesaId.HasValue)
    {
        Console.WriteLine("❌ Categorias necessárias não encontradas!");
        Console.WriteLine($"Categorias disponíveis: {string.Join(", ", categoriasDb.Select(c => c.Nome))}");
        return;
    }
    
    Console.WriteLine($"📋 IDs das categorias: Entrada={entradaId.Value}, Principal={principalId.Value}, Sobremesa={sobremesaId.Value}, Bebida={bebidaId}");
    
    Console.WriteLine("🍽️ Criando pratos...");
    
    // Criar pratos
    var pratos = new[]
    {
        // ENTRADAS
        new Prato 
        { 
            Nome = "Bruschetta Italiana", 
            Descricao = "Pão italiano grelhado com tomate, manjericão e azeite", 
            Preco = 18.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 15, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId.Value
        },
        new Prato 
        { 
            Nome = "Carpaccio de Salmão", 
            Descricao = "Fatias finas de salmão fresco com rúcula e parmesão", 
            Preco = 32.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 10, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId.Value
        },
        new Prato 
        { 
            Nome = "Ceviche de Peixe Branco", 
            Descricao = "Peixe branco marinado em limão com cebola roxa e coentro", 
            Preco = 28.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId.Value
        },
        
        // PRATOS PRINCIPAIS
        new Prato 
        { 
            Nome = "Risotto de Cogumelos", 
            Descricao = "Arroz cremoso com cogumelos porcini e parmesão", 
            Preco = 45.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 30, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Salmão Grelhado", 
            Descricao = "Salmão grelhado com legumes assados e molho de ervas", 
            Preco = 52.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 25, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Penne ao Pesto", 
            Descricao = "Massa penne com molho pesto de manjericão e pinoli", 
            Preco = 38.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Costela de Cordeiro", 
            Descricao = "Costela de cordeiro grelhada com batatas rústicas", 
            Preco = 68.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 35, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        new Prato 
        { 
            Nome = "Lasanha à Bolonhesa", 
            Descricao = "Lasanha tradicional com molho bolonhesa e queijo", 
            Preco = 42.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 40, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId.Value
        },
        
        // SOBREMESAS
        new Prato 
        { 
            Nome = "Tiramisu", 
            Descricao = "Sobremesa italiana com café, mascarpone e cacau", 
            Preco = 22.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1571877227200-a4d0eaefd519?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Panna Cotta de Frutas Vermelhas", 
            Descricao = "Creme italiano com calda de frutas vermelhas", 
            Preco = 19.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 15, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Cheesecake de Limão", 
            Descricao = "Cheesecake cremoso com calda de limão siciliano", 
            Preco = 24.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 25, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        new Prato 
        { 
            Nome = "Profiteroles de Chocolate", 
            Descricao = "Bolinhas de massa folhada com creme e calda de chocolate", 
            Preco = 26.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 30, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId.Value
        },
        
        // BEBIDAS
        new Prato 
        { 
            Nome = "Suco de Laranja Natural", 
            Descricao = "Suco de laranja fresco espremido na hora", 
            Preco = 12.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 5, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value // Fallback para entrada se bebida não existir
        },
        new Prato 
        { 
            Nome = "Café Expresso", 
            Descricao = "Café expresso italiano tradicional", 
            Preco = 8.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 3, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        },
        new Prato 
        { 
            Nome = "Vinho Tinto da Casa", 
            Descricao = "Vinho tinto selecionado para harmonizar com nossos pratos", 
            Preco = 35.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 2, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        },
        new Prato 
        { 
            Nome = "Água com Gás", 
            Descricao = "Água mineral com gás natural", 
            Preco = 6.90m, 
            ImagemUrl = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=400&fit=crop", 
            Disponivel = true, 
            TempoPreparo = 1, 
            Tipo = "Bebida", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = bebidaId ?? entradaId.Value
        }
    };
    
    context.Pratos.AddRange(pratos);
    await context.SaveChangesAsync();
    
    Console.WriteLine($"✅ {pratos.Length} pratos criados!");
    Console.WriteLine("🎉 Seed concluído com sucesso!");
}