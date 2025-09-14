interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'AUTH' | 'API';
  message: string;
  data?: any;
  error?: string;
}

class LoggingService {
  private logFilePath = 'frontend_debug.log';
  private maxLogSize = 5 * 1024 * 1024; // 5MB

  private createLogEntry(level: LogEntry['level'], message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error: error?.toString()
    };
  }

  private writeToFile(logEntry: LogEntry): void {
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      
      // Em desenvolvimento, usar console
      if (import.meta.env.DEV) {
        const emoji = this.getEmojiForLevel(logEntry.level);
        console.log(`${emoji} [${logEntry.level}] ${logEntry.message}`, logEntry.data || '');
        if (logEntry.error) {
          console.error(logEntry.error);
        }
      }
      
      // Salvar no localStorage para persistência (limitado)
      this.saveToStorage(logLine);
    } catch (err) {
      console.error('Erro ao escrever log:', err);
    }
  }

  private getEmojiForLevel(level: LogEntry['level']): string {
    const emojis = {
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌',
      DEBUG: '🐛',
      AUTH: '🔐',
      API: '🌐'
    };
    return emojis[level] || '📝';
  }

  private saveToStorage(logLine: string): void {
    try {
      const existingLogs = localStorage.getItem('cozinhaapp_logs') || '';
      const newLogs = existingLogs + logLine;
      
      // Limitar tamanho dos logs
      if (newLogs.length > this.maxLogSize) {
        const lines = newLogs.split('\n');
        const keepLines = lines.slice(-1000); // Manter últimas 1000 linhas
        localStorage.setItem('cozinhaapp_logs', keepLines.join('\n'));
      } else {
        localStorage.setItem('cozinhaapp_logs', newLogs);
      }
    } catch (err) {
      console.warn('Erro ao salvar logs no localStorage:', err);
    }
  }

  public logInfo(message: string, data?: any): void {
    const logEntry = this.createLogEntry('INFO', message, data);
    this.writeToFile(logEntry);
  }

  public logWarning(message: string, data?: any): void {
    const logEntry = this.createLogEntry('WARN', message, data);
    this.writeToFile(logEntry);
  }

  public logError(message: string, error?: Error, data?: any): void {
    const logEntry = this.createLogEntry('ERROR', message, data, error);
    this.writeToFile(logEntry);
  }

  public logDebug(message: string, data?: any): void {
    const logEntry = this.createLogEntry('DEBUG', message, data);
    this.writeToFile(logEntry);
  }

  public logAuth(message: string, data?: any): void {
    const logEntry = this.createLogEntry('AUTH', message, data);
    this.writeToFile(logEntry);
  }

  public logApi(message: string, data?: any): void {
    const logEntry = this.createLogEntry('API', message, data);
    this.writeToFile(logEntry);
  }

  public getLogs(): string {
    return localStorage.getItem('cozinhaapp_logs') || '';
  }

  public clearLogs(): void {
    localStorage.removeItem('cozinhaapp_logs');
  }

  public downloadLogs(): void {
    const logs = this.getLogs();
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cozinhaapp_logs_${new Date().toISOString().split('T')[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const loggingService = new LoggingService();
