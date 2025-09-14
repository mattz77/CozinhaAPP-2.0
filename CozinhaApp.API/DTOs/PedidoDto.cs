using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class CreateItemPedidoDto
{
    [Required(ErrorMessage = "O prato é obrigatório")]
    public int PratoId { get; set; }
    
    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }
    
    [StringLength(200, ErrorMessage = "As observações devem ter no máximo 200 caracteres")]
    public string? Observacoes { get; set; }
}

public class CreatePedidoDto
{
    [Required(ErrorMessage = "O cliente é obrigatório")]
    public int ClienteId { get; set; }
    
    [Required(ErrorMessage = "Pelo menos um item é obrigatório")]
    [MinLength(1, ErrorMessage = "Pelo menos um item é obrigatório")]
    public List<CreateItemPedidoDto> Itens { get; set; } = new();
    
    [StringLength(500, ErrorMessage = "As observações devem ter no máximo 500 caracteres")]
    public string? Observacoes { get; set; }
    
    [StringLength(200, ErrorMessage = "O endereço de entrega deve ter no máximo 200 caracteres")]
    public string? EnderecoEntrega { get; set; }
    
    [StringLength(20, ErrorMessage = "A forma de pagamento deve ter no máximo 20 caracteres")]
    public string? FormaPagamento { get; set; }
}

public class UpdatePedidoStatusDto
{
    [Required(ErrorMessage = "O status é obrigatório")]
    [StringLength(20, ErrorMessage = "O status deve ter no máximo 20 caracteres")]
    public string Status { get; set; } = string.Empty;
}

public class PedidoResponseDto
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
    public List<ItemPedidoResponseDto> ItensPedido { get; set; } = new();
}

public class ItemPedidoResponseDto
{
    public int Id { get; set; }
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
    public string? Observacoes { get; set; }
    public int PratoId { get; set; }
    public string PratoNome { get; set; } = string.Empty;
}
