using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Services;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public CategoriasController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    // GET: api/categorias
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> GetCategorias()
    {
        try
        {
            _loggingService.LogApi("Buscando categorias", new { endpoint = "GET /api/categorias" });

            var categorias = await _context.Categorias
                .Where(c => c.Ativa)
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

            _loggingService.LogApi("Categorias encontradas", new { count = categorias.Count });
            return Ok(categorias);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar categorias", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/categorias/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Categoria>> GetCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
        {
            return NotFound();
        }

        return categoria;
    }

    // POST: api/categorias
    [HttpPost]
    public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCategoria", new { id = categoria.Id }, categoria);
    }

    // PUT: api/categorias/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
    {
        if (id != categoria.Id)
        {
            return BadRequest();
        }

        _context.Entry(categoria).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CategoriaExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/categorias/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategoria(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);
        if (categoria == null)
        {
            return NotFound();
        }

        // Soft delete - apenas marca como inativa
        categoria.Ativa = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/categorias/{id}/pratos
    [HttpGet("{id}/pratos")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> GetPratosPorCategoria(int id)
    {
        try
        {
            _loggingService.LogApi("Buscando pratos por categoria", new { 
                categoriaId = id, 
                endpoint = "GET /api/categorias/{id}/pratos" 
            });

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada" });
            }

            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.CategoriaId == id && p.Disponivel)
                .OrderBy(p => p.Nome)
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

            return Ok(pratos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pratos da categoria {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/categorias/stats
    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<CategoriaStatsDto>> GetCategoriaStats()
    {
        try
        {
            _loggingService.LogApi("Buscando estatísticas de categorias", new { 
                endpoint = "GET /api/categorias/stats" 
            });

            var stats = new CategoriaStatsDto
            {
                TotalCategorias = await _context.Categorias.CountAsync(),
                CategoriasAtivas = await _context.Categorias.CountAsync(c => c.Ativa),
                CategoriasInativas = await _context.Categorias.CountAsync(c => !c.Ativa),
                CategoriaComMaisPratos = await _context.Categorias
                    .Include(c => c.Pratos)
                    .OrderByDescending(c => c.Pratos.Count)
                    .Select(c => c.Nome)
                    .FirstOrDefaultAsync() ?? "Nenhuma",
                MediaPratosPorCategoria = (decimal)await _context.Categorias
                    .AverageAsync(c => c.Pratos.Count)
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas de categorias", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // POST: api/categorias
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CategoriaResponseDto>> CreateCategoria([FromBody] CreateCategoriaDto createCategoriaDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dados inválidos", errors = ModelState });
            }

            _loggingService.LogApi("Criando nova categoria", new { 
                nome = createCategoriaDto.Nome,
                endpoint = "POST /api/categorias" 
            });

            // Verificar se já existe uma categoria com o mesmo nome
            var categoriaExistente = await _context.Categorias
                .FirstOrDefaultAsync(c => c.Nome.ToLower() == createCategoriaDto.Nome.ToLower());
            
            if (categoriaExistente != null)
            {
                return BadRequest(new { message = "Já existe uma categoria com este nome" });
            }

            var categoria = new Categoria
            {
                Nome = createCategoriaDto.Nome,
                Descricao = createCategoriaDto.Descricao,
                Ativa = createCategoriaDto.Ativa,
                DataCriacao = DateTime.UtcNow
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Categoria criada com sucesso", new { 
                categoriaId = categoria.Id, 
                nome = categoria.Nome 
            });

            var responseDto = new CategoriaResponseDto
            {
                Id = categoria.Id,
                Nome = categoria.Nome,
                Descricao = categoria.Descricao,
                Ativa = categoria.Ativa,
                DataCriacao = categoria.DataCriacao,
                TotalPratos = 0
            };

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, responseDto);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao criar categoria", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // PUT: api/categorias/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCategoria(int id, [FromBody] UpdateCategoriaDto updateCategoriaDto)
    {
        try
        {
            if (id != updateCategoriaDto.Id)
            {
                return BadRequest(new { message = "ID da categoria não confere" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dados inválidos", errors = ModelState });
            }

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada" });
            }

            // Verificar se já existe outra categoria com o mesmo nome (excluindo a atual)
            var categoriaExistente = await _context.Categorias
                .FirstOrDefaultAsync(c => c.Nome.ToLower() == updateCategoriaDto.Nome.ToLower() && c.Id != id);
            
            if (categoriaExistente != null)
            {
                return BadRequest(new { message = "Já existe outra categoria com este nome" });
            }

            categoria.Nome = updateCategoriaDto.Nome;
            categoria.Descricao = updateCategoriaDto.Descricao;
            categoria.Ativa = updateCategoriaDto.Ativa;

            await _context.SaveChangesAsync();

            _loggingService.LogApi("Categoria atualizada com sucesso", new { 
                categoriaId = categoria.Id, 
                nome = categoria.Nome 
            });

            return NoContent();
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar categoria {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    private bool CategoriaExists(int id)
    {
        return _context.Categorias.Any(e => e.Id == id);
    }
}