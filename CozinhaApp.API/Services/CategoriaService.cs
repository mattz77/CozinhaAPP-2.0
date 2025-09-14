using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Interfaces;
using CozinhaApp.API.Models;

namespace CozinhaApp.API.Services;

public class CategoriaService : ICategoriaService
{
    private readonly CozinhaAppContext _context;

    public CategoriaService(CozinhaAppContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoriaResponseDto>> GetAllAsync()
    {
        var categorias = await _context.Categorias
            .Include(c => c.Pratos)
            .ToListAsync();

        return categorias.Select(c => new CategoriaResponseDto
        {
            Id = c.Id,
            Nome = c.Nome,
            Descricao = c.Descricao,
            Ativa = c.Ativa,
            DataCriacao = c.DataCriacao,
            TotalPratos = c.Pratos.Count
        });
    }

    public async Task<CategoriaResponseDto?> GetByIdAsync(int id)
    {
        var categoria = await _context.Categorias
            .Include(c => c.Pratos)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (categoria == null) return null;

        return new CategoriaResponseDto
        {
            Id = categoria.Id,
            Nome = categoria.Nome,
            Descricao = categoria.Descricao,
            Ativa = categoria.Ativa,
            DataCriacao = categoria.DataCriacao,
            TotalPratos = categoria.Pratos.Count
        };
    }

    public async Task<CategoriaResponseDto> CreateAsync(CreateCategoriaDto dto)
    {
        var categoria = new Categoria
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            Ativa = dto.Ativa,
            DataCriacao = DateTime.UtcNow
        };

        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return new CategoriaResponseDto
        {
            Id = categoria.Id,
            Nome = categoria.Nome,
            Descricao = categoria.Descricao,
            Ativa = categoria.Ativa,
            DataCriacao = categoria.DataCriacao,
            TotalPratos = 0
        };
    }

    public async Task<CategoriaResponseDto?> UpdateAsync(int id, UpdateCategoriaDto dto)
    {
        var categoria = await _context.Categorias.FindAsync(id);
        if (categoria == null) return null;

        categoria.Nome = dto.Nome;
        categoria.Descricao = dto.Descricao;
        categoria.Ativa = dto.Ativa;

        await _context.SaveChangesAsync();

        return new CategoriaResponseDto
        {
            Id = categoria.Id,
            Nome = categoria.Nome,
            Descricao = categoria.Descricao,
            Ativa = categoria.Ativa,
            DataCriacao = categoria.DataCriacao,
            TotalPratos = categoria.Pratos.Count
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);
        if (categoria == null) return false;

        // Verificar se há pratos associados
        var temPratos = await _context.Pratos.AnyAsync(p => p.CategoriaId == id);
        if (temPratos) return false;

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();
        return true;
    }
}
