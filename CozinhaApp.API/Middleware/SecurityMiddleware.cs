using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace CozinhaApp.API.Middleware;

public class SecurityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityMiddleware> _logger;
    private readonly IConfiguration _configuration;

    public SecurityMiddleware(RequestDelegate next, ILogger<SecurityMiddleware> logger, IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Rate limiting básico por IP
            ApplyRateLimiting(context);

            // Headers de segurança
            ApplySecurityHeaders(context);

            // Validação de origem
            await ValidateOrigin(context);

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no middleware de segurança");
            await HandleSecurityException(context, ex);
        }
    }

    private void ApplyRateLimiting(HttpContext context)
    {
        var clientIp = GetClientIpAddress(context);
        var endpoint = context.Request.Path.Value;

        // Implementar rate limiting básico aqui
        // Em produção, use Redis ou outro sistema de cache distribuído
        _logger.LogInformation($"Acesso de {clientIp} para {endpoint}");
    }

    private void ApplySecurityHeaders(HttpContext context)
    {
        var response = context.Response;

        // Headers de segurança
        response.Headers["X-Content-Type-Options"] = "nosniff";
        response.Headers["X-Frame-Options"] = "DENY";
        response.Headers["X-XSS-Protection"] = "1; mode=block";
        response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

        // Content Security Policy
        response.Headers["Content-Security-Policy"] = 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none';";

        // Remove server header
        response.Headers.Remove("Server");
    }

    private async Task ValidateOrigin(HttpContext context)
    {
        var allowedOrigins = _configuration.GetSection("Security:AllowedOrigins").Get<string[]>();
        var origin = context.Request.Headers["Origin"].FirstOrDefault();

        if (!string.IsNullOrEmpty(origin) && allowedOrigins != null && !allowedOrigins.Contains(origin))
        {
            _logger.LogWarning($"Tentativa de acesso de origem não autorizada: {origin}");
            context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
            await context.Response.WriteAsync("Origem não autorizada");
            return;
        }
    }

    private string GetClientIpAddress(HttpContext context)
    {
        // Verificar headers de proxy
        var xForwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(xForwardedFor))
        {
            return xForwardedFor.Split(',')[0].Trim();
        }

        var xRealIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(xRealIp))
        {
            return xRealIp;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    }

    private async Task HandleSecurityException(HttpContext context, Exception ex)
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        context.Response.ContentType = "application/json";

        var errorResponse = new
        {
            error = "Erro interno de segurança",
            message = "Ocorreu um erro interno. Tente novamente mais tarde.",
            timestamp = DateTime.UtcNow
        };

        var jsonResponse = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(jsonResponse);
    }
}
