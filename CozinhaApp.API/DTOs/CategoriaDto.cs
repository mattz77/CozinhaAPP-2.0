using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class CreateCategoriaDto
{
    [Required(ErrorMessage = "O nome da categoria é obrigatório")]
    [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres")]
    public string? Descricao { get; set; }
    
    public bool Ativa { get; set; } = true;
}

public class UpdateCategoriaDto : CreateCategoriaDto
{
    public int Id { get; set; }
}

public class CategoriaResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativa { get; set; }
    public DateTime DataCriacao { get; set; }
    public int TotalPratos { get; set; }
}

public class CategoriaStatsDto
{
    public int TotalCategorias { get; set; }
    public int CategoriasAtivas { get; set; }
    public int CategoriasInativas { get; set; }
    public string CategoriaComMaisPratos { get; set; } = string.Empty;
    public decimal MediaPratosPorCategoria { get; set; }
}