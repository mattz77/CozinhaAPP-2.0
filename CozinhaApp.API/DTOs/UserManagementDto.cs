using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.DTOs;

public class UserManagementDto
{
    public string Id { get; set; } = string.Empty;
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? UltimoLogin { get; set; }
    public string? Telefone { get; set; }
    public string? Endereco { get; set; }
    public string? Cidade { get; set; }
    public string? Cep { get; set; }
}

public class UpdateUserRoleDto
{
    [Required(ErrorMessage = "Role é obrigatório")]
    [RegularExpression("^(Admin|Manager|Usuario)$", ErrorMessage = "Role deve ser 'Admin', 'Manager' ou 'Usuario'")]
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserStatusDto
{
    [Required(ErrorMessage = "Status é obrigatório")]
    public bool Ativo { get; set; }
}
