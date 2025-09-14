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
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Configurações de senha
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Configurações de usuário
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;

    // Configurações de lockout
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<CozinhaAppContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
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
        ClockSkew = TimeSpan.Zero
    };
});

// Register services
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS configuration for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
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
    
    // Criar usuário admin padrão
    await SeedAdminUserAsync(userManager);
    
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
        
        var result = await userManager.CreateAsync(adminUser, "Admin123!");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
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