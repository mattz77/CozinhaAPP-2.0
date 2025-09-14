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

        var logData = new
        {
            RequestId = requestId,
            Timestamp = DateTime.UtcNow,
            Method = request.Method,
            Path = request.Path.Value,
            QueryString = request.QueryString.Value,
            ClientIp = clientIp,
            UserAgent = userAgent,
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
}
