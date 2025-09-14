using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class CreateClienteDto
{
    [Required(ErrorMessage = "O nome do cliente é obrigatório")]
    [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
    public string Nome { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(200, ErrorMessage = "O email deve ter no máximo 200 caracteres")]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O telefone é obrigatório")]
    [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres")]
    public string Telefone { get; set; } = string.Empty;
    
    [StringLength(200, ErrorMessage = "O endereço deve ter no máximo 200 caracteres")]
    public string? Endereco { get; set; }
    
    [StringLength(100, ErrorMessage = "A cidade deve ter no máximo 100 caracteres")]
    public string? Cidade { get; set; }
    
    [StringLength(10, ErrorMessage = "O CEP deve ter no máximo 10 caracteres")]
    public string? Cep { get; set; }
}

public class UpdateClienteDto : CreateClienteDto
{
    public int Id { get; set; }
}

public class ClienteResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public string? Cep { get; set; }
    public DateTime DataCriacao { get; set; }
    public int TotalPedidos { get; set; }
    public string? UserId { get; set; }
}
