using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.Models;

public class ApplicationUser : IdentityUser
{
    [Required]
    [StringLength(100)]
    public string NomeCompleto { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? Endereco { get; set; }
    
    [StringLength(100)]
    public string? Cidade { get; set; }
    
    [StringLength(10)]
    public string? Cep { get; set; }
    
    public DateTime DataNascimento { get; set; }
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    public DateTime? UltimoLogin { get; set; }
    
    public bool Ativo { get; set; } = true;
    
    [StringLength(500)]
    public string? AvatarUrl { get; set; }
    
    [StringLength(50)]
    public string Role { get; set; } = "Usuario"; // Usuario, Admin
    
    // Relacionamento com pedidos
    public List<Pedido> Pedidos { get; set; } = new();
}
