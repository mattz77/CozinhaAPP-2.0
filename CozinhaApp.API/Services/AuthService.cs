using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Interfaces;

namespace CozinhaApp.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto);
    Task<UserDto?> GetUserByIdAsync(string userId);
    Task<bool> LogoutAsync(string refreshToken);
}

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly IClienteService _clienteService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        ILogger<AuthService> logger,
        IClienteService clienteService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
        _clienteService = clienteService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        try
        {
            _logger.LogInformation("🔄 Iniciando processo de login para email: {Email}", loginDto.Email);
            
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            _logger.LogInformation("👤 Busca de usuário: {Found}", user != null ? "Encontrado" : "Não encontrado");
            
            if (user == null || !user.Ativo)
            {
                _logger.LogWarning("❌ Login falhou: Usuário não encontrado ou inativo. Email: {Email}", loginDto.Email);
                throw new UnauthorizedAccessException("Credenciais inválidas");
            }

            _logger.LogInformation("🔐 Verificando senha para usuário: {Email}", user.Email);
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            
            if (!result.Succeeded)
            {
                _logger.LogWarning("❌ Login falhou: Senha incorreta para usuário {Email}", loginDto.Email);
                throw new UnauthorizedAccessException("Credenciais inválidas");
            }

            _logger.LogInformation("✅ Senha verificada com sucesso para {Email}", loginDto.Email);

            // Atualizar último login
            user.UltimoLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            _logger.LogInformation("🔑 Gerando token JWT para usuário: {Email}", user.Email);
            var token = await GenerateJwtTokenAsync(user);
            _logger.LogInformation("✅ Token JWT gerado com sucesso");

            _logger.LogInformation("🔄 Gerando refresh token");
            var refreshToken = GenerateRefreshToken();
            _logger.LogInformation("✅ Refresh token gerado");

            _logger.LogInformation("💾 Salvando refresh token para usuário: {Email}", user.Email);
            await _userManager.SetAuthenticationTokenAsync(user, "CozinhaApp", "RefreshToken", refreshToken);
            _logger.LogInformation("✅ Refresh token salvo");

            _logger.LogInformation("🔍 Buscando dados do cliente para userId: {UserId}", user.Id);
            var cliente = await _clienteService.GetClienteByUserIdAsync(user.Id);
            _logger.LogInformation("👤 Dados do cliente: {Found}", cliente != null ? "Encontrado" : "Não encontrado");

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user, cliente)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante login para email: {Email}", loginDto.Email);
            throw;
        }
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Usuário já existe com este email");
            }

            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                NomeCompleto = registerDto.NomeCompleto,
                Endereco = registerDto.Endereco,
                Cidade = registerDto.Cidade,
                Cep = registerDto.Cep,
                DataNascimento = registerDto.DataNascimento ?? DateTime.UtcNow.AddYears(-18),
                DataCriacao = DateTime.UtcNow,
                Ativo = true,
                EmailConfirmed = true // Em produção, implementar confirmação por email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Erro ao criar usuário: {errors}");
            }

            // Gerar token após registro bem-sucedido
            var token = await GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();

            await _userManager.SetAuthenticationTokenAsync(user, "CozinhaApp", "RefreshToken", refreshToken);

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante registro para email: {Email}", registerDto.Email);
            throw;
        }
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var users = _userManager.Users.ToList();
            var user = users.FirstOrDefault(u => 
                _userManager.GetAuthenticationTokenAsync(u, "CozinhaApp", "RefreshToken").Result == refreshToken);

            if (user == null || !user.Ativo)
            {
                throw new UnauthorizedAccessException("Refresh token inválido");
            }

            var newToken = await GenerateJwtTokenAsync(user);
            var newRefreshToken = GenerateRefreshToken();

            await _userManager.SetAuthenticationTokenAsync(user, "CozinhaApp", "RefreshToken", newRefreshToken);

            return new AuthResponseDto
            {
                Token = newToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante refresh token");
            throw;
        }
    }

    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto changePasswordDto)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            return result.Succeeded;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao alterar senha para usuário: {UserId}", userId);
            return false;
        }
    }

    public async Task<UserDto?> GetUserByIdAsync(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user != null ? MapToUserDto(user) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar usuário: {UserId}", userId);
            return null;
        }
    }

    public async Task<bool> LogoutAsync(string refreshToken)
    {
        try
        {
            var users = _userManager.Users.ToList();
            var user = users.FirstOrDefault(u => 
                _userManager.GetAuthenticationTokenAsync(u, "CozinhaApp", "RefreshToken").Result == refreshToken);

            if (user != null)
            {
                await _userManager.RemoveAuthenticationTokenAsync(user, "CozinhaApp", "RefreshToken");
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante logout");
            return false;
        }
    }

    private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
    {
        _logger.LogInformation("🔐 Iniciando geração de token JWT para usuário: {Email}", user.Email);
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.NomeCompleto),
            new(ClaimTypes.Email, user.Email ?? ""),
            new("nome_completo", user.NomeCompleto),
            new("avatar_url", user.AvatarUrl ?? ""),
            new("ultimo_login", user.UltimoLogin?.ToString("O") ?? "")
        };
        
        _logger.LogInformation("✅ Claims básicas criadas");

        // Adicionar roles se necessário
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key não configurada.");
        Console.WriteLine($"🔑 Usando chave JWT com tamanho: {jwtKey.Length} caracteres ({jwtKey.Length * 8} bits)");
        _logger.LogInformation("📏 Tamanho da chave JWT: {Length} caracteres ({Bits} bits)", 
            jwtKey.Length, jwtKey.Length * 8);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        _logger.LogInformation("✅ SymmetricSecurityKey criada");

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        _logger.LogInformation("✅ SigningCredentials criadas usando HmacSha256");

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );
        _logger.LogInformation("✅ Token JWT criado com sucesso");

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        // Gerar refresh token seguro usando RandomNumberGenerator
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        var bytes = new byte[32];
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    private static UserDto MapToUserDto(ApplicationUser user, ClienteResponseDto? cliente = null)
    {
        return new UserDto
        {
            Id = user.Id,
            NomeCompleto = user.NomeCompleto,
            Email = user.Email!,
            Endereco = cliente?.Endereco ?? user.Endereco,
            Cidade = cliente?.Cidade ?? user.Cidade,
            Cep = cliente?.Cep ?? user.Cep,
            DataNascimento = user.DataNascimento,
            DataCriacao = user.DataCriacao,
            UltimoLogin = user.UltimoLogin,
            AvatarUrl = user.AvatarUrl,
            Telefone = cliente?.Telefone,
            ClienteId = cliente?.Id
        };
    }
}
