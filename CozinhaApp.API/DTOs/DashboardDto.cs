using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class DashboardStatsDto
{
    // Estatísticas básicas
    public int TotalPratos { get; set; }
    public int PratosDisponiveis { get; set; }
    public int TotalCategorias { get; set; }
    public int TotalPedidos { get; set; }
    public int TotalAgendamentos { get; set; }
    public int TotalCarrinhos { get; set; }
    
    // Estatísticas financeiras
    public decimal ValorTotalVendas { get; set; }
    public decimal ValorMedioPedido { get; set; }
    public decimal ValorTotalAgendamentos { get; set; }
    
    // Estatísticas de pedidos por status
    public int PedidosPendentes { get; set; }
    public int PedidosConfirmados { get; set; }
    public int PedidosPreparando { get; set; }
    public int PedidosEntregues { get; set; }
    public int PedidosCancelados { get; set; }
    
    // Estatísticas de agendamentos por status
    public int AgendamentosPendentes { get; set; }
    public int AgendamentosConfirmados { get; set; }
    public int AgendamentosPreparando { get; set; }
    public int AgendamentosProntos { get; set; }
    public int AgendamentosEntregues { get; set; }
    public int AgendamentosCancelados { get; set; }
    
    // Estatísticas por período
    public decimal VendasHoje { get; set; }
    public decimal VendasEstaSemana { get; set; }
    public decimal VendasEsteMes { get; set; }
}

public class SalesChartItemDto
{
    public DateTime Data { get; set; }
    public decimal Vendas { get; set; }
    public int QuantidadePedidos { get; set; }
}

public class SalesChartDto
{
    public int Periodo { get; set; }
    public List<SalesChartItemDto> VendasPorDia { get; set; } = new();
    public List<SalesChartItemDto> AgendamentosPorDia { get; set; } = new();
    public decimal TotalVendas { get; set; }
    public decimal TotalAgendamentos { get; set; }
    public decimal MediaDiariaVendas { get; set; }
    public decimal MediaDiariaPedidos { get; set; }
}

public class TopPratoDto
{
    public int PratoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? ImagemUrl { get; set; }
    public string CategoriaNome { get; set; } = string.Empty;
    public int QuantidadeVendida { get; set; }
    public decimal ValorTotalVendido { get; set; }
    public int NumeroVendas { get; set; }
}

public class CategoriaDetailStatsDto
{
    public int CategoriaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public int TotalPratos { get; set; }
    public int PratosDisponiveis { get; set; }
    public decimal PratoMaisCaro { get; set; }
    public decimal PratoMaisBarato { get; set; }
    public decimal PrecoMedio { get; set; }
}

public class PerformanceReportDto
{
    public DateTime PeriodoInicio { get; set; }
    public DateTime PeriodoFim { get; set; }
    public int TotalPedidos { get; set; }
    public int TotalAgendamentos { get; set; }
    public decimal VendasTotais { get; set; }
    public decimal TicketMedio { get; set; }
    public decimal TaxaCancelamento { get; set; }
    public decimal TempoMedioPreparo { get; set; }
    public string? CategoriaMaisVendida { get; set; }
}
