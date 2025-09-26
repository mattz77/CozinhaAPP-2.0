using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Services;
using CozinhaApp.API.DTOs;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public ConfigController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    /// <summary>
    /// Obtém informações do sistema
    /// </summary>
    [HttpGet("system-info")]
    [AllowAnonymous]
    public ActionResult<SystemInfoDto> GetSystemInfo()
    {
        try
        {
            _loggingService.LogApi("Buscando informações do sistema", new { 
                endpoint = "GET /api/config/system-info" 
            });

            var systemInfo = new SystemInfoDto
            {
                Nome = "CozinhaApp API",
                Versao = "2.0.0",
                Ambiente = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
                DataHoraServidor = DateTime.UtcNow,
                TimeZone = TimeZoneInfo.Local.Id,
                DotNetVersion = Environment.Version.ToString(),
                OsVersion = Environment.OSVersion.ToString(),
                MachineName = Environment.MachineName,
                ProcessadorCount = Environment.ProcessorCount,
                WorkingSet = Environment.WorkingSet,
                Uptime = Environment.TickCount64
            };

            return Ok(systemInfo);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar informações do sistema", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém configurações da aplicação
    /// </summary>
    [HttpGet("app-settings")]
    [AllowAnonymous]
    public ActionResult<AppSettingsDto> GetAppSettings()
    {
        try
        {
            _loggingService.LogApi("Buscando configurações da aplicação", new { 
                endpoint = "GET /api/config/app-settings" 
            });

            var appSettings = new AppSettingsDto
            {
                NomeRestaurante = "CozinhaApp",
                TelefoneContato = "+55 (11) 99999-9999",
                EmailContato = "contato@cozinhaapp.com",
                EnderecoRestaurante = "Rua das Flores, 123 - São Paulo/SP",
                HorarioFuncionamento = "Segunda a Sexta: 11h às 22h | Sábado e Domingo: 10h às 23h",
                TempoEntregaEstimado = 30,
                TaxaEntrega = 5.00m,
                ValorMinimoPedido = 25.00m,
                FormasPagamento = new List<string> { "Dinheiro", "Cartão", "PIX" },
                CategoriasDisponiveis = new List<string> { "Entradas", "Pratos Principais", "Sobremesas", "Bebidas" },
                TiposDisponiveis = new List<string> { "Vegetariano", "Vegano", "Sem Glúten", "Apimentado", "Tradicional" },
                TempoPreparoMaximo = 60,
                PrecoMinimo = 5.00m,
                PrecoMaximo = 100.00m
            };

            return Ok(appSettings);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar configurações da aplicação", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém estatísticas de saúde do sistema
    /// </summary>
    [HttpGet("health")]
    [AllowAnonymous]
    public async Task<ActionResult<HealthCheckDto>> GetHealthCheck()
    {
        try
        {
            _loggingService.LogApi("Verificando saúde do sistema", new { 
                endpoint = "GET /api/config/health" 
            });

            var health = new HealthCheckDto
            {
                Status = "Healthy",
                Timestamp = DateTime.UtcNow,
                Database = await CheckDatabaseHealth(),
                Memory = GetMemoryInfo(),
                Disk = GetDiskInfo(),
                Services = new Dictionary<string, string>
                {
                    ["API"] = "Healthy",
                    ["Database"] = await CheckDatabaseHealth() ? "Healthy" : "Unhealthy",
                    ["Authentication"] = "Healthy",
                    ["Logging"] = "Healthy"
                }
            };

            return Ok(health);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao verificar saúde do sistema", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém lista de endpoints disponíveis
    /// </summary>
    [HttpGet("endpoints")]
    [AllowAnonymous]
    public ActionResult<EndpointsInfoDto> GetEndpoints()
    {
        try
        {
            _loggingService.LogApi("Listando endpoints disponíveis", new { 
                endpoint = "GET /api/config/endpoints" 
            });

            var endpoints = new EndpointsInfoDto
            {
                BaseUrl = "/api",
                Controllers = new List<ControllerInfoDto>
                {
                    new() { Nome = "Auth", Descricao = "Autenticação e autorização", Endpoints = new List<string> { "POST /login", "POST /register", "POST /refresh", "GET /me", "POST /logout" }},
                    new() { Nome = "Categorias", Descricao = "Gerenciamento de categorias", Endpoints = new List<string> { "GET /", "GET /{id}", "GET /{id}/pratos", "GET /stats", "POST /", "PUT /{id}", "DELETE /{id}" }},
                    new() { Nome = "Pratos", Descricao = "Gerenciamento de pratos", Endpoints = new List<string> { "GET /", "GET /{id}", "GET /categoria/{id}", "GET /stats", "GET /with-categories", "POST /", "PUT /{id}", "PATCH /{id}/preco", "PATCH /{id}/disponibilidade", "DELETE /{id}", "POST /bulk" }},
                    new() { Nome = "Pedidos", Descricao = "Gerenciamento de pedidos", Endpoints = new List<string> { "GET /", "GET /{id}", "GET /cliente/{id}", "POST /", "PUT /{id}", "PUT /{id}/status" }},
                    new() { Nome = "Carrinho", Descricao = "Gerenciamento do carrinho", Endpoints = new List<string> { "GET /", "POST /item", "PUT /item/{id}", "DELETE /item/{id}", "DELETE /", "GET /stats" }},
                    new() { Nome = "Agendamentos", Descricao = "Gerenciamento de agendamentos", Endpoints = new List<string> { "GET /", "GET /{id}", "POST /", "PUT /{id}", "DELETE /{id}", "GET /stats" }},
                    new() { Nome = "Dashboard", Descricao = "Dashboard e estatísticas", Endpoints = new List<string> { "GET /stats", "GET /sales-chart", "GET /top-pratos", "GET /categorias-stats", "GET /performance" }},
                    new() { Nome = "Search", Descricao = "Busca e filtros", Endpoints = new List<string> { "GET /pratos", "GET /categorias", "GET /suggestions", "GET /filters" }},
                    new() { Nome = "Reports", Descricao = "Relatórios", Endpoints = new List<string> { "GET /sales", "GET /top-dishes", "GET /financial" }},
                    new() { Nome = "Config", Descricao = "Configurações do sistema", Endpoints = new List<string> { "GET /system-info", "GET /app-settings", "GET /health", "GET /endpoints" }}
                }
            };

            return Ok(endpoints);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao listar endpoints", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    #region Métodos Auxiliares

    private async Task<bool> CheckDatabaseHealth()
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync("SELECT 1");
            return true;
        }
        catch
        {
            return false;
        }
    }

    private MemoryInfoDto GetMemoryInfo()
    {
        var process = System.Diagnostics.Process.GetCurrentProcess();
        return new MemoryInfoDto
        {
            WorkingSet = process.WorkingSet64,
            PrivateMemory = process.PrivateMemorySize64,
            VirtualMemory = process.VirtualMemorySize64,
            PeakWorkingSet = process.PeakWorkingSet64,
            PeakVirtualMemory = process.PeakVirtualMemorySize64
        };
    }

    private DiskInfoDto GetDiskInfo()
    {
        var drives = DriveInfo.GetDrives();
        var systemDrive = drives.FirstOrDefault(d => d.IsReady && d.Name == @"C:\");
        
        if (systemDrive != null)
        {
            return new DiskInfoDto
            {
                TotalSize = systemDrive.TotalSize,
                FreeSpace = systemDrive.AvailableFreeSpace,
                UsedSpace = systemDrive.TotalSize - systemDrive.AvailableFreeSpace,
                DriveName = systemDrive.Name
            };
        }

        return new DiskInfoDto();
    }

    #endregion
}









