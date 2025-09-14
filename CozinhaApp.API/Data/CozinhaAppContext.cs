using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using CozinhaApp.API.Models;

namespace CozinhaApp.API.Data;

public class CozinhaAppContext : IdentityDbContext<ApplicationUser>
{
    public CozinhaAppContext(DbContextOptions<CozinhaAppContext> options) : base(options)
    {
    }

    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Prato> Pratos { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }
    public DbSet<Carrinho> Carrinhos { get; set; }
    public DbSet<ItemCarrinho> ItensCarrinho { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da entidade Categoria
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descricao).HasMaxLength(500);
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETUTCDATE()");
            
            // Índices
            entity.HasIndex(e => e.Nome).IsUnique();
        });

        // Configuração da entidade Prato
        modelBuilder.Entity<Prato>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descricao).HasMaxLength(1000);
            entity.Property(e => e.Preco).HasColumnType("decimal(10,2)");
            entity.Property(e => e.ImagemUrl).HasMaxLength(500);
            entity.Property(e => e.Tipo).HasMaxLength(50);
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETUTCDATE()");
            
            // Relacionamento com Categoria
            entity.HasOne(p => p.Categoria)
                  .WithMany(c => c.Pratos)
                  .HasForeignKey(p => p.CategoriaId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            // Índices
            entity.HasIndex(e => e.Nome);
            entity.HasIndex(e => e.CategoriaId);
            entity.HasIndex(e => e.Disponivel);
        });

        // Configuração da entidade Cliente
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Telefone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Endereco).HasMaxLength(200);
            entity.Property(e => e.Cidade).HasMaxLength(100);
            entity.Property(e => e.Cep).HasMaxLength(10);
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETUTCDATE()");
            
            // Relacionamento com ApplicationUser
            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.SetNull);
            
            // Índices
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Telefone);
            entity.HasIndex(e => e.UserId);
        });

        // Configuração da entidade Pedido
        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NumeroPedido).IsRequired().HasMaxLength(50);
            entity.Property(e => e.DataPedido).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.ValorTotal).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Pendente");
            entity.Property(e => e.Observacoes).HasMaxLength(500);
            entity.Property(e => e.EnderecoEntrega).HasMaxLength(200);
            entity.Property(e => e.FormaPagamento).HasMaxLength(20);
            
            // Relacionamento com Cliente
            entity.HasOne(p => p.Cliente)
                  .WithMany(c => c.Pedidos)
                  .HasForeignKey(p => p.ClienteId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            // Índices
            entity.HasIndex(e => e.NumeroPedido).IsUnique();
            entity.HasIndex(e => e.ClienteId);
            entity.HasIndex(e => e.DataPedido);
            entity.HasIndex(e => e.Status);
        });

        // Configuração da entidade ItemPedido
        modelBuilder.Entity<ItemPedido>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PrecoUnitario).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Observacoes).HasMaxLength(200);
            
            // Relacionamento com Pedido
            entity.HasOne(ip => ip.Pedido)
                  .WithMany(p => p.ItensPedido)
                  .HasForeignKey(ip => ip.PedidoId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            // Relacionamento com Prato
            entity.HasOne(ip => ip.Prato)
                  .WithMany(p => p.ItensPedido)
                  .HasForeignKey(ip => ip.PratoId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            // Índices
            entity.HasIndex(e => e.PedidoId);
            entity.HasIndex(e => e.PratoId);
        });

        // Configuração da entidade Carrinho
        modelBuilder.Entity<Carrinho>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(450);
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.DataAtualizacao).HasDefaultValueSql("GETUTCDATE()");
            
            // Relacionamento com ApplicationUser
            entity.HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            // Índices
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.DataCriacao);
        });

        // Configuração da entidade ItemCarrinho
        modelBuilder.Entity<ItemCarrinho>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PrecoUnitario).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Observacoes).HasMaxLength(200);
            entity.Property(e => e.DataAdicao).HasDefaultValueSql("GETUTCDATE()");
            
            // Relacionamento com Carrinho
            entity.HasOne(ic => ic.Carrinho)
                  .WithMany(c => c.Itens)
                  .HasForeignKey(ic => ic.CarrinhoId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            // Relacionamento com Prato
            entity.HasOne(ic => ic.Prato)
                  .WithMany()
                  .HasForeignKey(ic => ic.PratoId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            // Índices
            entity.HasIndex(e => e.CarrinhoId);
            entity.HasIndex(e => e.PratoId);
            entity.HasIndex(e => e.DataAdicao);
            
            // Índice único para evitar duplicatas
            entity.HasIndex(e => new { e.CarrinhoId, e.PratoId }).IsUnique();
        });

        // Dados iniciais (Seed Data)
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Categorias iniciais
        modelBuilder.Entity<Categoria>().HasData(
            new Categoria { Id = 1, Nome = "Entradas", Descricao = "Aperitivos e entradas", Ativa = true, DataCriacao = new DateTime(2024, 1, 1) },
            new Categoria { Id = 2, Nome = "Pratos Principais", Descricao = "Pratos principais e refeições completas", Ativa = true, DataCriacao = new DateTime(2024, 1, 1) },
            new Categoria { Id = 3, Nome = "Sobremesas", Descricao = "Doces e sobremesas", Ativa = true, DataCriacao = new DateTime(2024, 1, 1) },
            new Categoria { Id = 4, Nome = "Bebidas", Descricao = "Bebidas e drinks", Ativa = true, DataCriacao = new DateTime(2024, 1, 1) }
        );

        // Pratos iniciais
        modelBuilder.Entity<Prato>().HasData(
            new Prato 
            { 
                Id = 1, 
                Nome = "Bruschetta Italiana", 
                Descricao = "Pão italiano grelhado com tomate, manjericão e azeite", 
                Preco = 18.90m, 
                CategoriaId = 1, 
                Disponivel = true, 
                TempoPreparo = 15,
                Tipo = "Entrada",
                DataCriacao = new DateTime(2024, 1, 1)
            },
            new Prato 
            { 
                Id = 2, 
                Nome = "Risotto de Cogumelos", 
                Descricao = "Arroz cremoso com cogumelos porcini e parmesão", 
                Preco = 45.90m, 
                CategoriaId = 2, 
                Disponivel = true, 
                TempoPreparo = 30,
                Tipo = "Prato Principal",
                DataCriacao = new DateTime(2024, 1, 1)
            },
            new Prato 
            { 
                Id = 3, 
                Nome = "Tiramisu", 
                Descricao = "Sobremesa italiana com café, mascarpone e cacau", 
                Preco = 22.90m, 
                CategoriaId = 3, 
                Disponivel = true, 
                TempoPreparo = 20,
                Tipo = "Sobremesa",
                DataCriacao = new DateTime(2024, 1, 1)
            }
        );
    }
}
