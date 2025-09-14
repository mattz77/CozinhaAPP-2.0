using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CozinhaApp.API.Services;
using CozinhaApp.API.DTOs;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Protege todos os endpoints por padrão
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly ILoggingService _loggingService;
    private readonly DebugLoggingService _debugLogger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger, ILoggingService loggingService)
    {
        _authService = authService;
        _logger = logger;
        _loggingService = loggingService;
        _debugLogger = new DebugLoggingService();
    }

    /// <summary>
    /// Realiza login do usuário
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous] // Permite acesso sem autenticação
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            _loggingService.LogApi("Recebida requisição de login", new { Email = loginDto.Email });

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                _loggingService.LogApi("ModelState inválido", new { Errors = errors });
                return BadRequest(new { message = "Dados inválidos", errors = errors });
            }

            var result = await _authService.LoginAsync(loginDto);
            
            _loggingService.LogApi("Login realizado com sucesso", new { 
                Email = loginDto.Email, 
                UserId = result.User.Id,
                TokenLength = result.Token.Length,
                RefreshTokenLength = result.RefreshToken.Length,
                ResultType = result.GetType().Name,
                HasToken = !string.IsNullOrEmpty(result.Token),
                HasRefreshToken = !string.IsNullOrEmpty(result.RefreshToken),
                HasUser = result.User != null
            });
            
            _loggingService.LogApi("Retornando resultado Ok", new { 
                StatusCode = 200,
                ContentType = "application/json"
            });
            
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            _loggingService.LogApi("Login falhou: Credenciais inválidas", new { Email = loginDto.Email });
            return Unauthorized(new { message = "Credenciais inválidas" });
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro durante login", ex, new { Email = loginDto.Email });
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Registra um novo usuário
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous] // Permite acesso sem autenticação
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante registro");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Renova o token de acesso usando refresh token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Refresh token inválido" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante refresh token");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Altera a senha do usuário autenticado
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var success = await _authService.ChangePasswordAsync(userId, changePasswordDto);
            if (!success)
            {
                return BadRequest(new { message = "Erro ao alterar senha" });
            }

            return Ok(new { message = "Senha alterada com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao alterar senha");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém informações do usuário autenticado
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar usuário atual");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Realiza logout do usuário
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout([FromBody] RefreshTokenDto refreshTokenDto)
    {
        try
        {
            await _authService.LogoutAsync(refreshTokenDto.RefreshToken);
            return Ok(new { message = "Logout realizado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro durante logout");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Endpoint de teste para verificar serialização
    /// </summary>
    [HttpGet("test")]
    [AllowAnonymous]
    public ActionResult TestSerialization()
    {
        _debugLogger.Log("Teste de serialização simples iniciado");
        
        try
        {
            var result = "Teste funcionando!";
            _debugLogger.Log("Teste de serialização simples concluído", new { Result = result });
            return Ok(result);
        }
        catch (Exception ex)
        {
            _debugLogger.Log("Erro no teste de serialização simples", new { Error = ex.Message, StackTrace = ex.StackTrace });
            throw;
        }
    }

    /// <summary>
    /// Endpoint de teste para verificar serialização JSON
    /// </summary>
    [HttpGet("test-json")]
    [AllowAnonymous]
    public ActionResult TestJsonSerialization()
    {
        var testData = new
        {
            message = "Teste de serialização JSON",
            timestamp = DateTime.UtcNow,
            success = true
        };

        _loggingService.LogApi("Teste de serialização JSON", testData);
        return Ok(testData);
    }
}
