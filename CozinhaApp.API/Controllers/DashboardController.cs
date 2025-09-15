using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Services;
using CozinhaApp.API.DTOs;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public DashboardController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    /// <summary>
    /// Obtém estatísticas gerais do sistema
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        try
        {
            _loggingService.LogApi("Buscando estatísticas do dashboard", new { endpoint = "GET /api/dashboard/stats" });

            var stats = new DashboardStatsDto
            {
                TotalPratos = await _context.Pratos.CountAsync(),
                PratosDisponiveis = await _context.Pratos.CountAsync(p => p.Disponivel),
                TotalCategorias = await _context.Categorias.CountAsync(c => c.Ativa),
                TotalPedidos = await _context.Pedidos.CountAsync(),
                TotalAgendamentos = await _context.Agendamentos.CountAsync(),
                TotalCarrinhos = await _context.Carrinhos.CountAsync(),
                
                // Estatísticas financeiras
                ValorTotalVendas = await _context.Pedidos.SumAsync(p => p.ValorTotal),
                ValorMedioPedido = await _context.Pedidos.AverageAsync(p => p.ValorTotal),
                ValorTotalAgendamentos = await _context.Agendamentos.SumAsync(a => a.ValorTotal),
                
                // Estatísticas por status
                PedidosPendentes = await _context.Pedidos.CountAsync(p => p.Status == "Pendente"),
                PedidosConfirmados = await _context.Pedidos.CountAsync(p => p.Status == "Confirmado"),
                PedidosPreparando = await _context.Pedidos.CountAsync(p => p.Status == "Preparando"),
                PedidosEntregues = await _context.Pedidos.CountAsync(p => p.Status == "Entregue"),
                PedidosCancelados = await _context.Pedidos.CountAsync(p => p.Status == "Cancelado"),
                
                AgendamentosPendentes = await _context.Agendamentos.CountAsync(a => a.Status == "Pendente"),
                AgendamentosConfirmados = await _context.Agendamentos.CountAsync(a => a.Status == "Confirmado"),
                AgendamentosPreparando = await _context.Agendamentos.CountAsync(a => a.Status == "Preparando"),
                AgendamentosProntos = await _context.Agendamentos.CountAsync(a => a.Status == "Pronto"),
                AgendamentosEntregues = await _context.Agendamentos.CountAsync(a => a.Status == "Entregue"),
                AgendamentosCancelados = await _context.Agendamentos.CountAsync(a => a.Status == "Cancelado"),
                
                // Estatísticas por período
                VendasHoje = await _context.Pedidos
                    .Where(p => p.DataPedido.Date == DateTime.UtcNow.Date)
                    .SumAsync(p => p.ValorTotal),
                VendasEstaSemana = await _context.Pedidos
                    .Where(p => p.DataPedido >= DateTime.UtcNow.AddDays(-7))
                    .SumAsync(p => p.ValorTotal),
                VendasEsteMes = await _context.Pedidos
                    .Where(p => p.DataPedido.Month == DateTime.UtcNow.Month && p.DataPedido.Year == DateTime.UtcNow.Year)
                    .SumAsync(p => p.ValorTotal)
            };

            _loggingService.LogApi("Estatísticas do dashboard obtidas com sucesso", new { 
                totalPratos = stats.TotalPratos,
                totalPedidos = stats.TotalPedidos,
                valorTotalVendas = stats.ValorTotalVendas
            });

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas do dashboard", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém dados para gráficos de vendas por período
    /// </summary>
    [HttpGet("sales-chart")]
    public async Task<ActionResult<SalesChartDto>> GetSalesChart([FromQuery] int days = 30)
    {
        try
        {
            _loggingService.LogApi("Buscando dados do gráfico de vendas", new { 
                endpoint = "GET /api/dashboard/sales-chart",
                days = days 
            });

            var startDate = DateTime.UtcNow.AddDays(-days);
            
            var vendasPorDia = await _context.Pedidos
                .Where(p => p.DataPedido >= startDate)
                .GroupBy(p => p.DataPedido.Date)
                .Select(g => new SalesChartItemDto
                {
                    Data = g.Key,
                    Vendas = g.Sum(p => p.ValorTotal),
                    QuantidadePedidos = g.Count()
                })
                .OrderBy(x => x.Data)
                .ToListAsync();

            var agendamentosPorDia = await _context.Agendamentos
                .Where(a => a.DataAgendamento >= startDate)
                .GroupBy(a => a.DataAgendamento.Date)
                .Select(g => new SalesChartItemDto
                {
                    Data = g.Key,
                    Vendas = g.Sum(a => a.ValorTotal),
                    QuantidadePedidos = g.Count()
                })
                .OrderBy(x => x.Data)
                .ToListAsync();

            var chart = new SalesChartDto
            {
                Periodo = days,
                VendasPorDia = vendasPorDia,
                AgendamentosPorDia = agendamentosPorDia,
                TotalVendas = vendasPorDia.Sum(v => v.Vendas),
                TotalAgendamentos = agendamentosPorDia.Sum(a => a.Vendas),
                MediaDiariaVendas = vendasPorDia.Any() ? (decimal)vendasPorDia.Average(v => v.Vendas) : 0,
                MediaDiariaPedidos = vendasPorDia.Any() ? (decimal)vendasPorDia.Average(v => v.QuantidadePedidos) : 0
            };

            return Ok(chart);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar dados do gráfico de vendas", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém os pratos mais vendidos
    /// </summary>
    [HttpGet("top-pratos")]
    public async Task<ActionResult<IEnumerable<TopPratoDto>>> GetTopPratos([FromQuery] int limit = 10)
    {
        try
        {
            _loggingService.LogApi("Buscando pratos mais vendidos", new { 
                endpoint = "GET /api/dashboard/top-pratos",
                limit = limit 
            });

            var topPratos = await _context.ItensPedido
                .Include(ip => ip.Prato)
                .Include(ip => ip.Prato.Categoria)
                .GroupBy(ip => new { ip.PratoId, ip.Prato.Nome, ip.Prato.Preco, ip.Prato.ImagemUrl, CategoriaNome = ip.Prato.Categoria.Nome })
                .Select(g => new TopPratoDto
                {
                    PratoId = g.Key.PratoId,
                    Nome = g.Key.Nome,
                    Preco = g.Key.Preco,
                    ImagemUrl = g.Key.ImagemUrl,
                    CategoriaNome = g.Key.CategoriaNome,
                    QuantidadeVendida = g.Sum(ip => ip.Quantidade),
                    ValorTotalVendido = g.Sum(ip => ip.Quantidade * ip.PrecoUnitario),
                    NumeroVendas = g.Count()
                })
                .OrderByDescending(tp => tp.QuantidadeVendida)
                .Take(limit)
                .ToListAsync();

            return Ok(topPratos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pratos mais vendidos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém estatísticas de categorias
    /// </summary>
    [HttpGet("categorias-stats")]
    public async Task<ActionResult<IEnumerable<CategoriaDetailStatsDto>>> GetCategoriasStats()
    {
        try
        {
            _loggingService.LogApi("Buscando estatísticas de categorias", new { 
                endpoint = "GET /api/dashboard/categorias-stats"
            });

            var categoriasStats = await _context.Categorias
                .Include(c => c.Pratos)
                .Where(c => c.Ativa)
                .Select(c => new CategoriaDetailStatsDto
                {
                    CategoriaId = c.Id,
                    Nome = c.Nome,
                    Descricao = c.Descricao,
                    TotalPratos = c.Pratos.Count(),
                    PratosDisponiveis = c.Pratos.Count(p => p.Disponivel),
                    PratoMaisCaro = c.Pratos.Any() ? c.Pratos.Max(p => p.Preco) : 0,
                    PratoMaisBarato = c.Pratos.Any() ? c.Pratos.Min(p => p.Preco) : 0,
                    PrecoMedio = c.Pratos.Any() ? c.Pratos.Average(p => p.Preco) : 0
                })
                .OrderByDescending(cs => cs.TotalPratos)
                .ToListAsync();

            return Ok(categoriasStats);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas de categorias", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém relatório de performance por período
    /// </summary>
    [HttpGet("performance")]
    public async Task<ActionResult<PerformanceReportDto>> GetPerformanceReport([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            _loggingService.LogApi("Buscando relatório de performance", new { 
                endpoint = "GET /api/dashboard/performance",
                startDate = start,
                endDate = end
            });

            var pedidos = await _context.Pedidos
                .Where(p => p.DataPedido >= start && p.DataPedido <= end)
                .ToListAsync();

            var agendamentos = await _context.Agendamentos
                .Where(a => a.DataAgendamento >= start && a.DataAgendamento <= end)
                .ToListAsync();

            var report = new PerformanceReportDto
            {
                PeriodoInicio = start,
                PeriodoFim = end,
                TotalPedidos = pedidos.Count,
                TotalAgendamentos = agendamentos.Count,
                VendasTotais = pedidos.Sum(p => p.ValorTotal) + agendamentos.Sum(a => a.ValorTotal),
                TicketMedio = pedidos.Any() ? pedidos.Average(p => p.ValorTotal) : 0,
                TaxaCancelamento = pedidos.Any() ? (decimal)pedidos.Count(p => p.Status == "Cancelado") / pedidos.Count * 100 : 0,
                TempoMedioPreparo = (decimal)await _context.Pratos.AverageAsync(p => p.TempoPreparo),
                CategoriaMaisVendida = await _context.ItensPedido
                    .Include(ip => ip.Prato)
                    .Include(ip => ip.Prato.Categoria)
                    .Where(ip => ip.Pedido.DataPedido >= start && ip.Pedido.DataPedido <= end)
                    .GroupBy(ip => ip.Prato.Categoria.Nome)
                    .Select(g => new { Nome = g.Key, Quantidade = g.Sum(ip => ip.Quantidade) })
                    .OrderByDescending(x => x.Quantidade)
                    .Select(x => x.Nome)
                    .FirstOrDefaultAsync()
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar relatório de performance", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}
