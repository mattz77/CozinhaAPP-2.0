namespace CozinhaApp.API.DTOs;

public class SalesReportDto
{
    public DateTime PeriodoInicio { get; set; }
    public DateTime PeriodoFim { get; set; }
    public string Agrupamento { get; set; } = string.Empty;
    public decimal TotalVendas { get; set; }
    public int TotalPedidos { get; set; }
    public int TotalAgendamentos { get; set; }
    public decimal TicketMedio { get; set; }
    public List<VendasPorPeriodoDto> VendasPorPeriodo { get; set; } = new();
    public List<VendasPorCategoriaDto> VendasPorCategoria { get; set; } = new();
    public List<VendasPorStatusDto> VendasPorStatus { get; set; } = new();
}

public class VendasPorPeriodoDto
{
    public DateTime Data { get; set; }
    public decimal ValorVendas { get; set; }
    public int QuantidadeVendas { get; set; }
}

public class VendasPorCategoriaDto
{
    public string CategoriaNome { get; set; } = string.Empty;
    public decimal ValorVendas { get; set; }
    public int QuantidadeVendida { get; set; }
}

public class VendasPorStatusDto
{
    public string Status { get; set; } = string.Empty;
    public decimal ValorVendas { get; set; }
    public int QuantidadeVendas { get; set; }
}

public class TopDishesReportDto
{
    public DateTime PeriodoInicio { get; set; }
    public DateTime PeriodoFim { get; set; }
    public int TotalPratosAnalisados { get; set; }
    public List<TopDishItemDto> Pratos { get; set; } = new();
    public int TotalQuantidadeVendida { get; set; }
    public decimal TotalValorVendido { get; set; }
}

public class TopDishItemDto
{
    public int PratoId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CategoriaNome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string? ImagemUrl { get; set; }
    public int QuantidadeVendida { get; set; }
    public decimal ValorTotalVendido { get; set; }
    public int NumeroVendas { get; set; }
}

public class FinancialReportDto
{
    public DateTime PeriodoInicio { get; set; }
    public DateTime PeriodoFim { get; set; }
    public decimal ReceitaTotal { get; set; }
    public decimal ReceitaPedidos { get; set; }
    public decimal ReceitaAgendamentos { get; set; }
    public int TotalTransacoes { get; set; }
    public decimal TicketMedio { get; set; }
    public List<VendasPorDiaDto> VendasPorDia { get; set; } = new();
    public List<VendasPorFormaPagamentoDto> VendasPorFormaPagamento { get; set; } = new();
    public decimal TaxaCancelamento { get; set; }
}

public class VendasPorDiaDto
{
    public DateTime Data { get; set; }
    public decimal ValorVendas { get; set; }
    public int QuantidadeVendas { get; set; }
}

public class VendasPorFormaPagamentoDto
{
    public string FormaPagamento { get; set; } = string.Empty;
    public decimal ValorVendas { get; set; }
    public int QuantidadeVendas { get; set; }
}




