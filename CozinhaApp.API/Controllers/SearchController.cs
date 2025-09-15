using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Services;
using CozinhaApp.API.DTOs;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public SearchController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    /// <summary>
    /// Busca pratos por termo de pesquisa
    /// </summary>
    [HttpGet("pratos")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchResultDto<PratoResponseDto>>> SearchPratos(
        [FromQuery] string? q,
        [FromQuery] int? categoriaId,
        [FromQuery] decimal? precoMin,
        [FromQuery] decimal? precoMax,
        [FromQuery] int? tempoPreparoMax,
        [FromQuery] string? tipo,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = "nome",
        [FromQuery] string? sortOrder = "asc")
    {
        try
        {
            _loggingService.LogApi("Buscando pratos", new { 
                endpoint = "GET /api/search/pratos",
                query = q,
                categoriaId = categoriaId,
                page = page,
                pageSize = pageSize
            });

            var query = _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Disponivel);

            // Aplicar filtros
            if (!string.IsNullOrEmpty(q))
            {
                query = query.Where(p => p.Nome.Contains(q) || 
                                       (p.Descricao != null && p.Descricao.Contains(q)));
            }

            if (categoriaId.HasValue)
            {
                query = query.Where(p => p.CategoriaId == categoriaId.Value);
            }

            if (precoMin.HasValue)
            {
                query = query.Where(p => p.Preco >= precoMin.Value);
            }

            if (precoMax.HasValue)
            {
                query = query.Where(p => p.Preco <= precoMax.Value);
            }

            if (tempoPreparoMax.HasValue)
            {
                query = query.Where(p => p.TempoPreparo <= tempoPreparoMax.Value);
            }

            if (!string.IsNullOrEmpty(tipo))
            {
                query = query.Where(p => p.Tipo == tipo);
            }

            // Aplicar ordenação
            switch (sortBy?.ToLower())
            {
                case "nome":
                    query = sortOrder?.ToLower() == "desc" 
                        ? query.OrderByDescending(p => p.Nome)
                        : query.OrderBy(p => p.Nome);
                    break;
                case "preco":
                    query = sortOrder?.ToLower() == "desc" 
                        ? query.OrderByDescending(p => p.Preco)
                        : query.OrderBy(p => p.Preco);
                    break;
                case "tempo":
                    query = sortOrder?.ToLower() == "desc" 
                        ? query.OrderByDescending(p => p.TempoPreparo)
                        : query.OrderBy(p => p.TempoPreparo);
                    break;
                case "data":
                    query = sortOrder?.ToLower() == "desc" 
                        ? query.OrderByDescending(p => p.DataCriacao)
                        : query.OrderBy(p => p.DataCriacao);
                    break;
                default:
                    query = query.OrderBy(p => p.Nome);
                    break;
            }

            // Contar total de registros
            var totalCount = await query.CountAsync();

            // Aplicar paginação
            var pratos = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PratoResponseDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    Preco = p.Preco,
                    ImagemUrl = p.ImagemUrl,
                    Disponivel = p.Disponivel,
                    TempoPreparo = p.TempoPreparo,
                    Tipo = p.Tipo,
                    DataCriacao = p.DataCriacao,
                    CategoriaId = p.CategoriaId,
                    CategoriaNome = p.Categoria.Nome
                })
                .ToListAsync();

            var result = new SearchResultDto<PratoResponseDto>
            {
                Items = pratos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                HasNextPage = page < (int)Math.Ceiling((double)totalCount / pageSize),
                HasPreviousPage = page > 1
            };

            _loggingService.LogApi("Busca de pratos concluída", new { 
                totalFound = totalCount,
                page = page,
                pageSize = pageSize
            });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pratos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Busca categorias por termo de pesquisa
    /// </summary>
    [HttpGet("categorias")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> SearchCategorias([FromQuery] string? q)
    {
        try
        {
            _loggingService.LogApi("Buscando categorias", new { 
                endpoint = "GET /api/search/categorias",
                query = q
            });

            var query = _context.Categorias.Where(c => c.Ativa);

            if (!string.IsNullOrEmpty(q))
            {
                query = query.Where(c => c.Nome.Contains(q) || 
                                       (c.Descricao != null && c.Descricao.Contains(q)));
            }

            var categorias = await query
                .OrderBy(c => c.Nome)
                .Select(c => new CategoriaResponseDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Descricao = c.Descricao,
                    Ativa = c.Ativa,
                    DataCriacao = c.DataCriacao,
                    TotalPratos = c.Pratos.Count(p => p.Disponivel)
                })
                .ToListAsync();

            return Ok(categorias);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar categorias", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém sugestões de busca baseadas em termos populares
    /// </summary>
    [HttpGet("suggestions")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchSuggestionsDto>> GetSearchSuggestions([FromQuery] string? q, [FromQuery] int limit = 10)
    {
        try
        {
            _loggingService.LogApi("Buscando sugestões", new { 
                endpoint = "GET /api/search/suggestions",
                query = q,
                limit = limit
            });

            var suggestions = new SearchSuggestionsDto();

            if (!string.IsNullOrEmpty(q) && q.Length >= 2)
            {
                // Sugestões de pratos
                suggestions.Pratos = await _context.Pratos
                    .Where(p => p.Disponivel && p.Nome.Contains(q))
                    .Select(p => p.Nome)
                    .Distinct()
                    .Take(limit / 2)
                    .ToListAsync();

                // Sugestões de categorias
                suggestions.Categorias = await _context.Categorias
                    .Where(c => c.Ativa && c.Nome.Contains(q))
                    .Select(c => c.Nome)
                    .Distinct()
                    .Take(limit / 2)
                    .ToListAsync();

                // Sugestões de tipos de prato
                suggestions.Tipos = await _context.Pratos
                    .Where(p => p.Disponivel && !string.IsNullOrEmpty(p.Tipo) && p.Tipo.Contains(q))
                    .Select(p => p.Tipo!)
                    .Distinct()
                    .Take(limit / 3)
                    .ToListAsync();
            }
            else
            {
                // Sugestões populares quando não há query
                suggestions.Pratos = await _context.Pratos
                    .Where(p => p.Disponivel)
                    .OrderBy(p => p.Nome)
                    .Select(p => p.Nome)
                    .Take(limit / 2)
                    .ToListAsync();

                suggestions.Categorias = await _context.Categorias
                    .Where(c => c.Ativa)
                    .OrderBy(c => c.Nome)
                    .Select(c => c.Nome)
                    .Take(limit / 2)
                    .ToListAsync();

                suggestions.Tipos = await _context.Pratos
                    .Where(p => p.Disponivel && !string.IsNullOrEmpty(p.Tipo))
                    .Select(p => p.Tipo!)
                    .Distinct()
                    .Take(limit / 3)
                    .ToListAsync();
            }

            return Ok(suggestions);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar sugestões", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtém filtros disponíveis para busca
    /// </summary>
    [HttpGet("filters")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchFiltersDto>> GetSearchFilters()
    {
        try
        {
            _loggingService.LogApi("Buscando filtros disponíveis", new { 
                endpoint = "GET /api/search/filters"
            });

            var filters = new SearchFiltersDto
            {
                Categorias = await _context.Categorias
                    .Where(c => c.Ativa)
                    .Select(c => new FilterOptionDto
                    {
                        Id = c.Id,
                        Nome = c.Nome,
                        Count = c.Pratos.Count(p => p.Disponivel)
                    })
                    .ToListAsync(),

                Tipos = await _context.Pratos
                    .Where(p => p.Disponivel && !string.IsNullOrEmpty(p.Tipo))
                    .GroupBy(p => p.Tipo!)
                    .Select(g => new FilterOptionDto
                    {
                        Id = 0,
                        Nome = g.Key,
                        Count = g.Count()
                    })
                    .OrderBy(f => f.Nome)
                    .ToListAsync(),

                FaixaPreco = new FaixaPrecoDto
                {
                    PrecoMinimo = await _context.Pratos.MinAsync(p => p.Preco),
                    PrecoMaximo = await _context.Pratos.MaxAsync(p => p.Preco),
                    PrecoMedio = await _context.Pratos.AverageAsync(p => p.Preco)
                },

                TempoPreparo = new TempoPreparoDto
                {
                    TempoMinimo = await _context.Pratos.MinAsync(p => p.TempoPreparo),
                    TempoMaximo = await _context.Pratos.MaxAsync(p => p.TempoPreparo),
                    TempoMedio = await _context.Pratos.AverageAsync(p => p.TempoPreparo)
                }
            };

            return Ok(filters);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar filtros", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}
