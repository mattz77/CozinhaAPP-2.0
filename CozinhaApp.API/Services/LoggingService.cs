using System.Text.Json;

namespace CozinhaApp.API.Services;

public interface ILoggingService
{
    void LogInfo(string message, object? data = null);
    void LogWarning(string message, object? data = null);
    void LogError(string message, Exception? exception = null, object? data = null);
    void LogDebug(string message, object? data = null);
    void LogAuth(string message, object? data = null);
    void LogApi(string message, object? data = null);
}

public class LoggingService : ILoggingService
{
    private readonly ILogger<LoggingService> _logger;
    private readonly string _logFilePath;

    public LoggingService(ILogger<LoggingService> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _logFilePath = Path.Combine(environment.ContentRootPath, "logs", "cozinhaapp.log");
        
        // Garantir que o diretório de logs existe
        var logDir = Path.GetDirectoryName(_logFilePath);
        if (!Directory.Exists(logDir))
        {
            Directory.CreateDirectory(logDir!);
        }
    }

    public void LogInfo(string message, object? data = null)
    {
        var logEntry = CreateLogEntry("INFO", message, data);
        _logger.LogInformation(logEntry);
        WriteToFile(logEntry);
    }

    public void LogWarning(string message, object? data = null)
    {
        var logEntry = CreateLogEntry("WARN", message, data);
        _logger.LogWarning(logEntry);
        WriteToFile(logEntry);
    }

    public void LogError(string message, Exception? exception = null, object? data = null)
    {
        var logEntry = CreateLogEntry("ERROR", message, data, exception);
        _logger.LogError(exception, logEntry);
        WriteToFile(logEntry);
    }

    public void LogDebug(string message, object? data = null)
    {
        var logEntry = CreateLogEntry("DEBUG", message, data);
        _logger.LogDebug(logEntry);
        WriteToFile(logEntry);
    }

    public void LogAuth(string message, object? data = null)
    {
        var logEntry = CreateLogEntry("AUTH", message, data);
        _logger.LogInformation($"🔐 {logEntry}");
        WriteToFile(logEntry);
    }

    public void LogApi(string message, object? data = null)
    {
        var logEntry = CreateLogEntry("API", message, data);
        _logger.LogInformation($"🌐 {logEntry}");
        WriteToFile(logEntry);
    }

    private string CreateLogEntry(string level, string message, object? data = null, Exception? exception = null)
    {
        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
        var logData = new
        {
            Timestamp = timestamp,
            Level = level,
            Message = message,
            Data = data,
            Exception = exception?.ToString()
        };

        return JsonSerializer.Serialize(logData, new JsonSerializerOptions 
        { 
            WriteIndented = false,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }

    private void WriteToFile(string logEntry)
    {
        try
        {
            File.AppendAllText(_logFilePath, logEntry + Environment.NewLine);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao escrever no arquivo de log");
        }
    }
}
