namespace CozinhaApp.API.DTOs;

public class SystemInfoDto
{
    public string Nome { get; set; } = string.Empty;
    public string Versao { get; set; } = string.Empty;
    public string Ambiente { get; set; } = string.Empty;
    public DateTime DataHoraServidor { get; set; }
    public string TimeZone { get; set; } = string.Empty;
    public string DotNetVersion { get; set; } = string.Empty;
    public string OsVersion { get; set; } = string.Empty;
    public string MachineName { get; set; } = string.Empty;
    public int ProcessadorCount { get; set; }
    public long WorkingSet { get; set; }
    public long Uptime { get; set; }
}

public class AppSettingsDto
{
    public string NomeRestaurante { get; set; } = string.Empty;
    public string TelefoneContato { get; set; } = string.Empty;
    public string EmailContato { get; set; } = string.Empty;
    public string EnderecoRestaurante { get; set; } = string.Empty;
    public string HorarioFuncionamento { get; set; } = string.Empty;
    public int TempoEntregaEstimado { get; set; }
    public decimal TaxaEntrega { get; set; }
    public decimal ValorMinimoPedido { get; set; }
    public List<string> FormasPagamento { get; set; } = new();
    public List<string> CategoriasDisponiveis { get; set; } = new();
    public List<string> TiposDisponiveis { get; set; } = new();
    public int TempoPreparoMaximo { get; set; }
    public decimal PrecoMinimo { get; set; }
    public decimal PrecoMaximo { get; set; }
}

public class HealthCheckDto
{
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool Database { get; set; }
    public MemoryInfoDto Memory { get; set; } = new();
    public DiskInfoDto Disk { get; set; } = new();
    public Dictionary<string, string> Services { get; set; } = new();
}

public class MemoryInfoDto
{
    public long WorkingSet { get; set; }
    public long PrivateMemory { get; set; }
    public long VirtualMemory { get; set; }
    public long PeakWorkingSet { get; set; }
    public long PeakVirtualMemory { get; set; }
}

public class DiskInfoDto
{
    public long TotalSize { get; set; }
    public long FreeSpace { get; set; }
    public long UsedSpace { get; set; }
    public string DriveName { get; set; } = string.Empty;
}

public class EndpointsInfoDto
{
    public string BaseUrl { get; set; } = string.Empty;
    public List<ControllerInfoDto> Controllers { get; set; } = new();
}

public class ControllerInfoDto
{
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public List<string> Endpoints { get; set; } = new();
}


