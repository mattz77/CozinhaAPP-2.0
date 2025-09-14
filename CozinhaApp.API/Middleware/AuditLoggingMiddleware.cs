using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Text;

namespace CozinhaApp.API.Middleware;

public class AuditLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLoggingMiddleware> _logger;

    public AuditLoggingMiddleware(RequestDelegate next, ILogger<AuditLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString();
        
        // Adicionar request ID ao contexto
        context.Items["RequestId"] = requestId;

        // Log da requisição
        LogRequest(context, requestId);

        // Capturar resposta original
        var originalBodyStream = context.Response.Body;

        try
        {
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            stopwatch.Stop();

            // Log da resposta
            LogResponse(context, requestId, stopwatch.ElapsedMilliseconds);

            // Copiar resposta para o stream original
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            LogError(context, requestId, ex, stopwatch.ElapsedMilliseconds);
            throw;
        }
        finally
        {
            context.Response.Body = originalBodyStream;
        }
    }

    private void LogRequest(HttpContext context, string requestId)
    {
        var request = context.Request;
        var clientIp = GetClientIpAddress(context);
        var userAgent = request.Headers["User-Agent"].FirstOrDefault() ?? "Unknown";

        // Sanitizar dados sensíveis
        var sanitizedPath = SanitizePath(request.Path.Value);
        var sanitizedQueryString = SanitizeQueryString(request.QueryString.Value);

        var logData = new
        {
            RequestId = requestId,
            Timestamp = DateTime.UtcNow,
            Method = request.Method,
            Path = sanitizedPath,
            QueryString = sanitizedQueryString,
            ClientIp = MaskIpAddress(clientIp),
            UserAgent = TruncateString(userAgent, 200),
            UserId = context.User?.Identity?.Name ?? "Anonymous",
            ContentType = request.ContentType,
            ContentLength = request.ContentLength
        };

        _logger.LogInformation("Requisição recebida: {@LogData}", logData);
    }

    private void LogResponse(HttpContext context, string requestId, long elapsedMs)
    {
        var response = context.Response;
        var statusCode = response.StatusCode;

        var logData = new
        {
            RequestId = requestId,
            Timestamp = DateTime.UtcNow,
            StatusCode = statusCode,
            ElapsedMs = elapsedMs,
            ContentType = response.ContentType,
            ContentLength = response.ContentLength,
            UserId = context.User?.Identity?.Name ?? "Anonymous"
        };

        if (statusCode >= 400)
        {
            _logger.LogWarning("Resposta com erro: {@LogData}", logData);
        }
        else
        {
            _logger.LogInformation("Resposta enviada: {@LogData}", logData);
        }
    }

    private void LogError(HttpContext context, string requestId, Exception ex, long elapsedMs)
    {
        var logData = new
        {
            RequestId = requestId,
            Timestamp = DateTime.UtcNow,
            Error = ex.Message,
            StackTrace = ex.StackTrace,
            ElapsedMs = elapsedMs,
            Path = context.Request.Path.Value,
            Method = context.Request.Method,
            UserId = context.User?.Identity?.Name ?? "Anonymous"
        };

        _logger.LogError(ex, "Erro na requisição: {@LogData}", logData);
    }

    private string GetClientIpAddress(HttpContext context)
    {
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

    private static string SanitizePath(string? path)
    {
        if (string.IsNullOrEmpty(path)) return string.Empty;
        
        // Remover IDs de usuário dos paths
        return System.Text.RegularExpressions.Regex.Replace(path, @"/\d+", "/{id}");
    }

    private static string SanitizeQueryString(string? queryString)
    {
        if (string.IsNullOrEmpty(queryString)) return string.Empty;
        
        // Remover parâmetros sensíveis
        var sensitiveParams = new[] { "password", "token", "email", "cpf", "telefone" };
        var sanitized = queryString;
        
        foreach (var param in sensitiveParams)
        {
            sanitized = System.Text.RegularExpressions.Regex.Replace(
                sanitized, 
                $@"{param}=[^&]*", 
                $"{param}=***", 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        }
        
        return sanitized;
    }

    private static string MaskIpAddress(string ip)
    {
        if (string.IsNullOrEmpty(ip) || ip == "Unknown") return "Unknown";
        
        var parts = ip.Split('.');
        if (parts.Length == 4)
        {
            return $"{parts[0]}.{parts[1]}.xxx.xxx";
        }
        
        return "xxx.xxx.xxx.xxx";
    }

    private static string TruncateString(string? input, int maxLength)
    {
        if (string.IsNullOrEmpty(input)) return string.Empty;
        return input.Length <= maxLength ? input : input[..maxLength] + "...";
    }
}
