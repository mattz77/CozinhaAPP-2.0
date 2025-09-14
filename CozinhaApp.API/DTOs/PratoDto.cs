using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class CreatePratoDto
{
    [Required(ErrorMessage = "O nome do prato é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres")]
    public string? Descricao { get; set; }
    
    [Required(ErrorMessage = "O preço é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal Preco { get; set; }
    
    [StringLength(500, ErrorMessage = "A URL da imagem deve ter no máximo 500 caracteres")]
    public string? ImagemUrl { get; set; }
    
    public bool Disponivel { get; set; } = true;
    
    [Range(1, int.MaxValue, ErrorMessage = "O tempo de preparo deve ser maior que zero")]
    public int TempoPreparo { get; set; }
    
    [StringLength(50, ErrorMessage = "O tipo deve ter no máximo 50 caracteres")]
    public string? Tipo { get; set; }
    
    [Required(ErrorMessage = "A categoria é obrigatória")]
    public int CategoriaId { get; set; }
}

public class UpdatePratoDto : CreatePratoDto
{
    public int Id { get; set; }
}

public class PratoResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
    public string? ImagemUrl { get; set; }
    public bool Disponivel { get; set; }
    public int TempoPreparo { get; set; }
    public string? Tipo { get; set; }
    public DateTime DataCriacao { get; set; }
    public int CategoriaId { get; set; }
    public string CategoriaNome { get; set; } = string.Empty;
}
