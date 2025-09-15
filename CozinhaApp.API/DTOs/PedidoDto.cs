using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class PedidoDto
{
    public int Id { get; set; }
    public string NumeroPedido { get; set; } = string.Empty;
    public DateTime DataPedido { get; set; }
    public DateTime? DataEntrega { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Observacoes { get; set; }
    public string? EnderecoEntrega { get; set; }
    public string? FormaPagamento { get; set; }
    public int ClienteId { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public string ClienteEmail { get; set; } = string.Empty;
    public string ClienteTelefone { get; set; } = string.Empty;
    public List<ItemPedidoDto> Itens { get; set; } = new();
}

public class ItemPedidoDto
{
    public int Id { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public decimal Subtotal => Quantidade * PrecoUnitario;
    public string? Observacoes { get; set; }
    public int PratoId { get; set; }
    public string PratoNome { get; set; } = string.Empty;
    public string? PratoImagemUrl { get; set; }
}

public class CriarPedidoDto
{
    [Required(ErrorMessage = "Endereço de entrega é obrigatório")]
    [StringLength(200, ErrorMessage = "Endereço deve ter no máximo 200 caracteres")]
    public string EnderecoEntrega { get; set; } = string.Empty;

    [Required(ErrorMessage = "Forma de pagamento é obrigatória")]
    [StringLength(20, ErrorMessage = "Forma de pagamento deve ter no máximo 20 caracteres")]
    public string FormaPagamento { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
    public string? Observacoes { get; set; }

    [Required(ErrorMessage = "Itens do pedido são obrigatórios")]
    [MinLength(1, ErrorMessage = "Pedido deve ter pelo menos 1 item")]
    public List<ItemPedidoCriacaoDto> Itens { get; set; } = new();
}

public class ItemPedidoCriacaoDto
{
    [Required(ErrorMessage = "ID do prato é obrigatório")]
    public int PratoId { get; set; }

    [Required(ErrorMessage = "Quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }

    [StringLength(200, ErrorMessage = "Observações devem ter no máximo 200 caracteres")]
    public string? Observacoes { get; set; }
}

public class AtualizarStatusPedidoDto
{
    [Required(ErrorMessage = "Status é obrigatório")]
    [StringLength(20, ErrorMessage = "Status deve ter no máximo 20 caracteres")]
    public string Status { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
    public string? Observacoes { get; set; }
}

public class PedidoResumoDto
{
    public int Id { get; set; }
    public string NumeroPedido { get; set; } = string.Empty;
    public DateTime DataPedido { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ClienteNome { get; set; } = string.Empty;
    public int TotalItens { get; set; }
}

public class PedidoEstatisticasDto
{
    public int TotalPedidos { get; set; }
    public int PedidosPendentes { get; set; }
    public int PedidosPreparando { get; set; }
    public int PedidosEntregues { get; set; }
    public int PedidosCancelados { get; set; }
    public decimal ValorTotalVendas { get; set; }
    public decimal TicketMedio { get; set; }
    public List<StatusCountDto> StatusCounts { get; set; } = new();
    public List<PedidoResumoDto> PedidosRecentes { get; set; } = new();
}

public class StatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentual { get; set; }
}