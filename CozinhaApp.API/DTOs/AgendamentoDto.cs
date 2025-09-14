using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class CreateAgendamentoDto
{
    [Required]
    public DateTime DataAgendamento { get; set; }
    
    [StringLength(500)]
    public string? Observacoes { get; set; }
    
    [StringLength(200)]
    public string? EnderecoEntrega { get; set; }
    
    [StringLength(20)]
    public string? TelefoneContato { get; set; }
    
    public bool PagamentoAntecipado { get; set; } = false;
    
    [StringLength(100)]
    public string? MetodoPagamento { get; set; }
    
    [Required]
    public List<CreateItemAgendamentoDto> Itens { get; set; } = new();
}

public class CreateItemAgendamentoDto
{
    [Required]
    public int PratoId { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantidade { get; set; }
    
    [StringLength(200)]
    public string? Observacoes { get; set; }
}

public class UpdateAgendamentoDto
{
    [StringLength(200)]
    public string? Status { get; set; }
    
    [StringLength(500)]
    public string? Observacoes { get; set; }
    
    [StringLength(200)]
    public string? EnderecoEntrega { get; set; }
    
    [StringLength(20)]
    public string? TelefoneContato { get; set; }
    
    [StringLength(100)]
    public string? MetodoPagamento { get; set; }
}

public class ItemAgendamentoResponseDto
{
    public int Id { get; set; }
    public int PratoId { get; set; }
    public string PratoNome { get; set; } = string.Empty;
    public string? PratoImagemUrl { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public string? Observacoes { get; set; }
}

public class AgendamentoResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public DateTime DataAgendamento { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal ValorTotal { get; set; }
    public string? Observacoes { get; set; }
    public string? EnderecoEntrega { get; set; }
    public string? TelefoneContato { get; set; }
    public bool PagamentoAntecipado { get; set; }
    public string? MetodoPagamento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
    public List<ItemAgendamentoResponseDto> Itens { get; set; } = new();
}

public class AgendamentoStatsDto
{
    public int TotalAgendamentos { get; set; }
    public int AgendamentosPendentes { get; set; }
    public int AgendamentosConfirmados { get; set; }
    public int AgendamentosPreparando { get; set; }
    public int AgendamentosProntos { get; set; }
    public int AgendamentosEntregues { get; set; }
    public int AgendamentosCancelados { get; set; }
    public decimal ValorTotalAgendamentos { get; set; }
    public decimal ValorMedioAgendamento { get; set; }
}
