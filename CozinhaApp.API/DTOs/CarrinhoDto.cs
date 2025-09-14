using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class AddItemCarrinhoDto
{
    [Required(ErrorMessage = "O prato é obrigatório")]
    public int PratoId { get; set; }
    
    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }
    
    [StringLength(200, ErrorMessage = "As observações devem ter no máximo 200 caracteres")]
    public string? Observacoes { get; set; }
}

public class UpdateItemCarrinhoDto
{
    [Required(ErrorMessage = "A quantidade é obrigatória")]
    [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
    public int Quantidade { get; set; }
    
    [StringLength(200, ErrorMessage = "As observações devem ter no máximo 200 caracteres")]
    public string? Observacoes { get; set; }
}

public class ItemCarrinhoResponseDto
{
    public int Id { get; set; }
    public int PratoId { get; set; }
    public string PratoNome { get; set; } = string.Empty;
    public string? PratoImagemUrl { get; set; }
    public decimal PrecoUnitario { get; set; }
    public int Quantidade { get; set; }
    public decimal Subtotal { get; set; }
    public string? Observacoes { get; set; }
    public DateTime DataAdicao { get; set; }
}

public class CarrinhoResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; }
    public DateTime DataAtualizacao { get; set; }
    public List<ItemCarrinhoResponseDto> Itens { get; set; } = new();
    public int TotalItens { get; set; }
    public decimal ValorTotal { get; set; }
}

public class CarrinhoStatsDto
{
    public int TotalItens { get; set; }
    public decimal ValorTotal { get; set; }
    public int QuantidadeItensUnicos { get; set; }
    public DateTime? UltimaAtualizacao { get; set; }
}
