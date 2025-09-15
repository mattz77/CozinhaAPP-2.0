using Microsoft.AspNetCore.Http;
using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;

namespace CozinhaApp.API.Middleware;

public class SecurityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityMiddleware> _logger;
    private readonly IConfiguration _configuration;
    
    // Rate limiting storage (em produção, use Redis)
    private static readonly ConcurrentDictionary<string, List<DateTime>> _requestCounts = new();
    private static readonly object _lockObject = new object();

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
        var now = DateTime.UtcNow;

        lock (_lockObject)
        {
            if (!_requestCounts.TryGetValue(clientIp, out var requests))
            {
                requests = new List<DateTime>();
                _requestCounts[clientIp] = requests;
            }

            // Remover requisições antigas (mais de 1 minuto)
            requests.RemoveAll(r => now - r > TimeSpan.FromMinutes(1));

            // Verificar limite de 100 requisições por minuto
            if (requests.Count >= 100)
            {
                _logger.LogWarning($"Rate limit excedido para IP: {clientIp}");
                
                // Verificar se a resposta já começou antes de tentar definir o status code
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    context.Response.ContentType = "application/json";
                    
                    var errorResponse = new
                    {
                        error = "Rate limit excedido",
                        message = "Muitas requisições. Tente novamente em 1 minuto.",
                        retryAfter = 60
                    };
                    
                    var jsonResponse = JsonSerializer.Serialize(errorResponse);
                    _ = context.Response.WriteAsync(jsonResponse);
                }
                return;
            }

            // Adicionar requisição atual
            requests.Add(now);
        }

        _logger.LogDebug($"Acesso de {clientIp} para {endpoint} - {_requestCounts[clientIp].Count} req/min");
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
        var allowedOrigins = _configuration.GetSection("Security:AllowedOrigins").Get<string[]>() ?? 
            new[] { "http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001" };
            
        var origin = context.Request.Headers["Origin"].FirstOrDefault();
        var path = context.Request.Path.Value;
        var method = context.Request.Method;

        _logger.LogInformation($"🔍 Validando requisição: Origem={origin}, Path={path}, Method={method}");

        if (string.IsNullOrEmpty(origin))
        {
            _logger.LogInformation("✅ Requisição sem origem (provavelmente local)");
            return;
        }

        if (!allowedOrigins.Contains(origin))
        {
            _logger.LogWarning($"❌ Origem não autorizada: {origin}");
            _logger.LogWarning($"📋 Origens permitidas: {string.Join(", ", allowedOrigins)}");
            
            // Verificar se a resposta já começou antes de tentar definir o status code
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                context.Response.ContentType = "application/json";
                
                var errorResponse = new
                {
                    error = "Origem não autorizada",
                    message = "Esta origem não tem permissão para acessar a API",
                    origin = origin,
                    allowedOrigins = allowedOrigins
                };
                
                var jsonResponse = JsonSerializer.Serialize(errorResponse);
                await context.Response.WriteAsync(jsonResponse);
            }
            return;
        }

        _logger.LogInformation($"✅ Origem validada: {origin}");
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
        // Verificar se a resposta já começou antes de tentar definir o status code
        if (!context.Response.HasStarted)
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
}
