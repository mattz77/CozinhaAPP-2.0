using System.Text.Json;

namespace CozinhaApp.API.Services;

public class DebugLoggingService
{
    private readonly string _logFilePath;
    private readonly object _lock = new object();

    public DebugLoggingService()
    {
        _logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "debug.log");
    }

    public void Log(string message, object? data = null)
    {
        var logEntry = new
        {
            Timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff"),
            Message = message,
            Data = data
        };

        var logLine = JsonSerializer.Serialize(logEntry) + Environment.NewLine;
        
        lock (_lock)
        {
            File.AppendAllText(_logFilePath, logLine);
        }
        
        Console.WriteLine($"[DEBUG] {message}");
        if (data != null)
        {
            Console.WriteLine($"[DEBUG] Data: {JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true })}");
        }
    }
}
