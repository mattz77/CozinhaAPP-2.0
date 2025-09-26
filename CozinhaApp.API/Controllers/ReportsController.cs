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
public class ReportsController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public ReportsController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    /// <summary>
    /// Relatório de vendas por período
    /// </summary>
    [HttpGet("sales")]
    public async Task<ActionResult<SalesReportDto>> GetSalesReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string groupBy = "day") // day, week, month
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            _loggingService.LogApi("Gerando relatório de vendas", new { 
                endpoint = "GET /api/reports/sales",
                startDate = start,
                endDate = end,
                groupBy = groupBy
            });

            var pedidos = await _context.Pedidos
                .Include(p => p.ItensPedido)
                .ThenInclude(ip => ip.Prato)
                .ThenInclude(pr => pr.Categoria)
                .Where(p => p.DataPedido >= start && p.DataPedido <= end)
                .ToListAsync();

            var agendamentos = await _context.Agendamentos
                .Include(a => a.Itens)
                .ThenInclude(i => i.Prato)
                .ThenInclude(pr => pr.Categoria)
                .Where(a => a.DataAgendamento >= start && a.DataAgendamento <= end)
                .ToListAsync();

            var report = new SalesReportDto
            {
                PeriodoInicio = start,
                PeriodoFim = end,
                Agrupamento = groupBy,
                TotalVendas = pedidos.Sum(p => p.ValorTotal) + agendamentos.Sum(a => a.ValorTotal),
                TotalPedidos = pedidos.Count,
                TotalAgendamentos = agendamentos.Count,
                TicketMedio = pedidos.Any() ? pedidos.Average(p => p.ValorTotal) : 0,
                VendasPorPeriodo = GenerateSalesByPeriod(pedidos, agendamentos, groupBy),
                VendasPorCategoria = GenerateSalesByCategory(pedidos, agendamentos),
                VendasPorStatus = GenerateSalesByStatus(pedidos, agendamentos)
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao gerar relatório de vendas", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Relatório de pratos mais vendidos
    /// </summary>
    [HttpGet("top-dishes")]
    public async Task<ActionResult<TopDishesReportDto>> GetTopDishesReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int limit = 20)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            _loggingService.LogApi("Gerando relatório de pratos mais vendidos", new { 
                endpoint = "GET /api/reports/top-dishes",
                startDate = start,
                endDate = end,
                limit = limit
            });

            var itensPedidos = await _context.ItensPedido
                .Include(ip => ip.Prato)
                .Include(ip => ip.Prato.Categoria)
                .Include(ip => ip.Pedido)
                .Where(ip => ip.Pedido.DataPedido >= start && ip.Pedido.DataPedido <= end)
                .ToListAsync();

            var itensAgendamentos = await _context.ItensAgendamento
                .Include(ia => ia.Prato)
                .Include(ia => ia.Prato.Categoria)
                .Include(ia => ia.Agendamento)
                .Where(ia => ia.Agendamento.DataAgendamento >= start && ia.Agendamento.DataAgendamento <= end)
                .ToListAsync();

            var pratosVendidos = new Dictionary<int, TopDishItemDto>();

            // Processar itens de pedidos
            foreach (var item in itensPedidos)
            {
                if (!pratosVendidos.ContainsKey(item.PratoId))
                {
                    pratosVendidos[item.PratoId] = new TopDishItemDto
                    {
                        PratoId = item.PratoId,
                        Nome = item.Prato.Nome,
                        CategoriaNome = item.Prato.Categoria.Nome,
                        Preco = item.Prato.Preco,
                        ImagemUrl = item.Prato.ImagemUrl
                    };
                }

                pratosVendidos[item.PratoId].QuantidadeVendida += item.Quantidade;
                pratosVendidos[item.PratoId].ValorTotalVendido += item.Quantidade * item.PrecoUnitario;
                pratosVendidos[item.PratoId].NumeroVendas++;
            }

            // Processar itens de agendamentos
            foreach (var item in itensAgendamentos)
            {
                if (!pratosVendidos.ContainsKey(item.PratoId))
                {
                    pratosVendidos[item.PratoId] = new TopDishItemDto
                    {
                        PratoId = item.PratoId,
                        Nome = item.Prato.Nome,
                        CategoriaNome = item.Prato.Categoria.Nome,
                        Preco = item.Prato.Preco,
                        ImagemUrl = item.Prato.ImagemUrl
                    };
                }

                pratosVendidos[item.PratoId].QuantidadeVendida += item.Quantidade;
                pratosVendidos[item.PratoId].ValorTotalVendido += item.Quantidade * item.PrecoUnitario;
                pratosVendidos[item.PratoId].NumeroVendas++;
            }

            var topPratos = pratosVendidos.Values
                .OrderByDescending(p => p.QuantidadeVendida)
                .Take(limit)
                .ToList();

            var report = new TopDishesReportDto
            {
                PeriodoInicio = start,
                PeriodoFim = end,
                TotalPratosAnalisados = pratosVendidos.Count,
                Pratos = topPratos,
                TotalQuantidadeVendida = topPratos.Sum(p => p.QuantidadeVendida),
                TotalValorVendido = topPratos.Sum(p => p.ValorTotalVendido)
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao gerar relatório de pratos mais vendidos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Relatório de performance financeira
    /// </summary>
    [HttpGet("financial")]
    public async Task<ActionResult<FinancialReportDto>> GetFinancialReport(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var start = startDate ?? DateTime.UtcNow.AddDays(-30);
            var end = endDate ?? DateTime.UtcNow;

            _loggingService.LogApi("Gerando relatório financeiro", new { 
                endpoint = "GET /api/reports/financial",
                startDate = start,
                endDate = end
            });

            var pedidos = await _context.Pedidos
                .Where(p => p.DataPedido >= start && p.DataPedido <= end)
                .ToListAsync();

            var agendamentos = await _context.Agendamentos
                .Where(a => a.DataAgendamento >= start && a.DataAgendamento <= end)
                .ToListAsync();

            var report = new FinancialReportDto
            {
                PeriodoInicio = start,
                PeriodoFim = end,
                ReceitaTotal = pedidos.Sum(p => p.ValorTotal) + agendamentos.Sum(a => a.ValorTotal),
                ReceitaPedidos = pedidos.Sum(p => p.ValorTotal),
                ReceitaAgendamentos = agendamentos.Sum(a => a.ValorTotal),
                TotalTransacoes = pedidos.Count + agendamentos.Count,
                TicketMedio = (pedidos.Count + agendamentos.Count) > 0 
                    ? (pedidos.Sum(p => p.ValorTotal) + agendamentos.Sum(a => a.ValorTotal)) / (pedidos.Count + agendamentos.Count)
                    : 0,
                VendasPorDia = await GetDailySales(pedidos, agendamentos),
                VendasPorFormaPagamento = GetSalesByPaymentMethod(pedidos, agendamentos),
                TaxaCancelamento = CalculateCancellationRate(pedidos, agendamentos)
            };

            return Ok(report);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao gerar relatório financeiro", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    #region Métodos Auxiliares

    private List<VendasPorPeriodoDto> GenerateSalesByPeriod(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos, string groupBy)
    {
        var vendas = new Dictionary<DateTime, VendasPorPeriodoDto>();

        foreach (var pedido in pedidos)
        {
            var key = groupBy switch
            {
                "week" => pedido.DataPedido.Date.AddDays(-(int)pedido.DataPedido.DayOfWeek),
                "month" => new DateTime(pedido.DataPedido.Year, pedido.DataPedido.Month, 1),
                _ => pedido.DataPedido.Date
            };

            if (!vendas.ContainsKey(key))
            {
                vendas[key] = new VendasPorPeriodoDto { Data = key };
            }

            vendas[key].ValorVendas += pedido.ValorTotal;
            vendas[key].QuantidadeVendas++;
        }

        foreach (var agendamento in agendamentos)
        {
            var key = groupBy switch
            {
                "week" => agendamento.DataAgendamento.Date.AddDays(-(int)agendamento.DataAgendamento.DayOfWeek),
                "month" => new DateTime(agendamento.DataAgendamento.Year, agendamento.DataAgendamento.Month, 1),
                _ => agendamento.DataAgendamento.Date
            };

            if (!vendas.ContainsKey(key))
            {
                vendas[key] = new VendasPorPeriodoDto { Data = key };
            }

            vendas[key].ValorVendas += agendamento.ValorTotal;
            vendas[key].QuantidadeVendas++;
        }

        return vendas.Values.OrderBy(v => v.Data).ToList();
    }

    private List<VendasPorCategoriaDto> GenerateSalesByCategory(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos)
    {
        var vendas = new Dictionary<string, VendasPorCategoriaDto>();

        foreach (var pedido in pedidos)
        {
            foreach (var item in pedido.ItensPedido)
            {
                var categoria = item.Prato.Categoria.Nome;
                if (!vendas.ContainsKey(categoria))
                {
                    vendas[categoria] = new VendasPorCategoriaDto { CategoriaNome = categoria };
                }

                vendas[categoria].ValorVendas += item.Quantidade * item.PrecoUnitario;
                vendas[categoria].QuantidadeVendida += item.Quantidade;
            }
        }

        foreach (var agendamento in agendamentos)
        {
            foreach (var item in agendamento.Itens)
            {
                var categoria = item.Prato.Categoria.Nome;
                if (!vendas.ContainsKey(categoria))
                {
                    vendas[categoria] = new VendasPorCategoriaDto { CategoriaNome = categoria };
                }

                vendas[categoria].ValorVendas += item.Quantidade * item.PrecoUnitario;
                vendas[categoria].QuantidadeVendida += item.Quantidade;
            }
        }

        return vendas.Values.OrderByDescending(v => v.ValorVendas).ToList();
    }

    private List<VendasPorStatusDto> GenerateSalesByStatus(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos)
    {
        var vendas = new Dictionary<string, VendasPorStatusDto>();

        foreach (var pedido in pedidos)
        {
            if (!vendas.ContainsKey(pedido.Status))
            {
                vendas[pedido.Status] = new VendasPorStatusDto { Status = pedido.Status };
            }

            vendas[pedido.Status].ValorVendas += pedido.ValorTotal;
            vendas[pedido.Status].QuantidadeVendas++;
        }

        foreach (var agendamento in agendamentos)
        {
            if (!vendas.ContainsKey(agendamento.Status))
            {
                vendas[agendamento.Status] = new VendasPorStatusDto { Status = agendamento.Status };
            }

            vendas[agendamento.Status].ValorVendas += agendamento.ValorTotal;
            vendas[agendamento.Status].QuantidadeVendas++;
        }

        return vendas.Values.OrderByDescending(v => v.ValorVendas).ToList();
    }

    private async Task<List<VendasPorDiaDto>> GetDailySales(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos)
    {
        var vendas = new Dictionary<DateTime, VendasPorDiaDto>();

        foreach (var pedido in pedidos)
        {
            var data = pedido.DataPedido.Date;
            if (!vendas.ContainsKey(data))
            {
                vendas[data] = new VendasPorDiaDto { Data = data };
            }

            vendas[data].ValorVendas += pedido.ValorTotal;
            vendas[data].QuantidadeVendas++;
        }

        foreach (var agendamento in agendamentos)
        {
            var data = agendamento.DataAgendamento.Date;
            if (!vendas.ContainsKey(data))
            {
                vendas[data] = new VendasPorDiaDto { Data = data };
            }

            vendas[data].ValorVendas += agendamento.ValorTotal;
            vendas[data].QuantidadeVendas++;
        }

        return vendas.Values.OrderBy(v => v.Data).ToList();
    }

    private List<VendasPorFormaPagamentoDto> GetSalesByPaymentMethod(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos)
    {
        var vendas = new Dictionary<string, VendasPorFormaPagamentoDto>();

        foreach (var pedido in pedidos)
        {
            var formaPagamento = pedido.FormaPagamento ?? "Não informado";
            if (!vendas.ContainsKey(formaPagamento))
            {
                vendas[formaPagamento] = new VendasPorFormaPagamentoDto { FormaPagamento = formaPagamento };
            }

            vendas[formaPagamento].ValorVendas += pedido.ValorTotal;
            vendas[formaPagamento].QuantidadeVendas++;
        }

        foreach (var agendamento in agendamentos)
        {
            var formaPagamento = agendamento.MetodoPagamento ?? "Não informado";
            if (!vendas.ContainsKey(formaPagamento))
            {
                vendas[formaPagamento] = new VendasPorFormaPagamentoDto { FormaPagamento = formaPagamento };
            }

            vendas[formaPagamento].ValorVendas += agendamento.ValorTotal;
            vendas[formaPagamento].QuantidadeVendas++;
        }

        return vendas.Values.OrderByDescending(v => v.ValorVendas).ToList();
    }

    private decimal CalculateCancellationRate(List<Models.Pedido> pedidos, List<Models.Agendamento> agendamentos)
    {
        var total = pedidos.Count + agendamentos.Count;
        var cancelados = pedidos.Count(p => p.Status == "Cancelado") + agendamentos.Count(a => a.Status == "Cancelado");
        
        return total > 0 ? (decimal)cancelados / total * 100 : 0;
    }

    #endregion
}









