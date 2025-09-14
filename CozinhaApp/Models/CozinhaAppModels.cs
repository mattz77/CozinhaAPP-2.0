using System.ComponentModel.DataAnnotations;

namespace CozinhaApp.API.Models;

public class Categoria
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Descricao { get; set; }
    
    public bool Ativa { get; set; } = true;
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    // Relacionamento
    public List<Prato> Pratos { get; set; } = new();
}

public class Prato
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Nome { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Descricao { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
    public decimal Preco { get; set; }
    
    [StringLength(500)]
    public string? ImagemUrl { get; set; }
    
    public bool Disponivel { get; set; } = true;
    
    public int TempoPreparo { get; set; } // em minutos
    
    [StringLength(50)]
    public string? Tipo { get; set; } // Entrada, Prato Principal, Sobremesa, etc.
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    // Relacionamento
    public int CategoriaId { get; set; }
    public Categoria Categoria { get; set; } = null!;
    
    public List<ItemPedido> ItensPedido { get; set; } = new();
}

public class Cliente
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string Telefone { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? Endereco { get; set; }
    
    [StringLength(100)]
    public string? Cidade { get; set; }
    
    [StringLength(10)]
    public string? Cep { get; set; }
    
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    
    // Relacionamento
    public List<Pedido> Pedidos { get; set; } = new();
}

public class Pedido
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string NumeroPedido { get; set; } = string.Empty;
    
    public DateTime DataPedido { get; set; } = DateTime.UtcNow;
    
    public DateTime? DataEntrega { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal ValorTotal { get; set; }
    
    [StringLength(20)]
    public string Status { get; set; } = "Pendente"; // Pendente, Confirmado, Preparando, SaiuParaEntrega, Entregue, Cancelado
    
    [StringLength(500)]
    public string? Observacoes { get; set; }
    
    [StringLength(200)]
    public string? EnderecoEntrega { get; set; }
    
    [StringLength(20)]
    public string? FormaPagamento { get; set; } // Dinheiro, Cartão, PIX
    
    // Relacionamento
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;
    
    public List<ItemPedido> ItensPedido { get; set; } = new();
}

public class ItemPedido
{
    public int Id { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantidade { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal PrecoUnitario { get; set; }
    
    [StringLength(200)]
    public string? Observacoes { get; set; }
    
    // Relacionamento
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;
    
    public int PratoId { get; set; }
    public Prato Prato { get; set; } = null!;
}
