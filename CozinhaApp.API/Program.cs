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
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.WriteIndented = true;
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
var jwtKey = jwtSettings["Key"];

// Validar se a chave JWT está configurada
if (string.IsNullOrEmpty(jwtKey) || jwtKey.StartsWith("${"))
{
    throw new InvalidOperationException("JWT Key não configurada. Configure a variável de ambiente JWT_SECRET_KEY.");
}

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

// CORS configuration for React frontend
var allowedOrigins = securityConfig.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .WithHeaders("Content-Type", "Authorization", "X-Requested-With")
              .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
              .AllowCredentials(); // Necessário para cookies/auth
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Middlewares de segurança
app.UseMiddleware<SecurityMiddleware>();
app.UseMiddleware<AuditLoggingMiddleware>();

// Enable CORS
app.UseCors("ReactApp");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

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
    await SeedTestUsersAsync(userManager);
    
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

async Task SeedTestUsersAsync(UserManager<ApplicationUser> userManager)
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
            Cep = "01234-567"
        },
        new { 
            Email = "joao@teste.com", 
            Nome = "João Silva", 
            Password = "Joao123!@#", 
            Role = "User",
            Endereco = "Av. Paulista, 1000",
            Cidade = "São Paulo",
            Cep = "01310-100"
        },
        new { 
            Email = "maria@teste.com", 
            Nome = "Maria Santos", 
            Password = "Maria123!@#", 
            Role = "User",
            Endereco = "Rua Augusta, 456",
            Cidade = "São Paulo",
            Cep = "01305-000"
        },
        new { 
            Email = "pedro@teste.com", 
            Nome = "Pedro Costa", 
            Password = "Pedro123!@#", 
            Role = "Manager",
            Endereco = "Rua Oscar Freire, 789",
            Cidade = "São Paulo",
            Cep = "01426-001"
        }
    };

    foreach (var userData in testUsers)
    {
        var existingUser = await userManager.FindByEmailAsync(userData.Email);
        
        if (existingUser == null)
        {
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
                Console.WriteLine($"👤 Usuário de teste criado: {userData.Nome} ({userData.Email}) - Senha: {userData.Password}");
            }
            else
            {
                Console.WriteLine($"❌ Erro ao criar usuário {userData.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            Console.WriteLine($"✅ Usuário {userData.Email} já existe");
        }
    }
}

async Task SeedDataAsync(CozinhaAppContext context)
{
    Console.WriteLine("🌱 Iniciando seed de dados...");
    
    // Verificar se já existem dados
    var categoriaCount = context.Categorias.Count();
    var pratoCount = context.Pratos.Count();
    
    Console.WriteLine($"📊 Categorias existentes: {categoriaCount}");
    Console.WriteLine($"📊 Pratos existentes: {pratoCount}");
    
    if (categoriaCount > 0 || pratoCount > 0)
    {
        Console.WriteLine("✅ Dados já existem, pulando seed.");
        return;
    }
    
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
    var entradaId = categoriasDb.First(c => c.Nome == "Entrada").Id;
    var principalId = categoriasDb.First(c => c.Nome == "Prato Principal").Id;
    var sobremesaId = categoriasDb.First(c => c.Nome == "Sobremesa").Id;
    
    Console.WriteLine($"📋 IDs das categorias: Entrada={entradaId}, Principal={principalId}, Sobremesa={sobremesaId}");
    
    Console.WriteLine("🍽️ Criando pratos...");
    
    // Criar pratos
    var pratos = new[]
    {
        new Prato 
        { 
            Nome = "Bruschetta Italiana", 
            Descricao = "Pão italiano grelhado com tomate, manjericão e azeite", 
            Preco = 18.90m, 
            ImagemUrl = null, 
            Disponivel = true, 
            TempoPreparo = 15, 
            Tipo = "Entrada", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = entradaId
        },
        new Prato 
        { 
            Nome = "Risotto de Cogumelos", 
            Descricao = "Arroz cremoso com cogumelos porcini e parmesão", 
            Preco = 45.90m, 
            ImagemUrl = null, 
            Disponivel = true, 
            TempoPreparo = 30, 
            Tipo = "Prato Principal", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = principalId
        },
        new Prato 
        { 
            Nome = "Tiramisu", 
            Descricao = "Sobremesa italiana com café, mascarpone e cacau", 
            Preco = 22.90m, 
            ImagemUrl = null, 
            Disponivel = true, 
            TempoPreparo = 20, 
            Tipo = "Sobremesa", 
            DataCriacao = DateTime.UtcNow,
            CategoriaId = sobremesaId
        }
    };
    
    context.Pratos.AddRange(pratos);
    await context.SaveChangesAsync();
    
    Console.WriteLine($"✅ {pratos.Length} pratos criados!");
    Console.WriteLine("🎉 Seed concluído com sucesso!");
}