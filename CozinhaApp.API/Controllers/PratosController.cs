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
public class PratosController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public PratosController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    // GET: api/pratos
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> GetPratos()
    {
        try
        {
            _loggingService.LogApi("Buscando todos os pratos", new { endpoint = "GET /api/pratos" });

            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Disponivel)
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
                    CategoriaNome = p.Categoria != null ? p.Categoria.Nome : "Sem categoria"
                })
                .ToListAsync();

            _loggingService.LogApi("Pratos encontrados", new { count = pratos.Count });
            return Ok(pratos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pratos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/with-categories
    [HttpGet("with-categories")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Prato>>> GetPratosWithCategories()
    {
        try
        {
            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Disponivel)
                .OrderBy(p => p.Nome)
                .ToListAsync();
            
            return Ok(pratos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pratos com categorias", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<PratoResponseDto>> GetPrato(int id)
    {
        try
        {
            var prato = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Id == id)
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
                    CategoriaNome = p.Categoria != null ? p.Categoria.Nome : "Sem categoria"
                })
                .FirstOrDefaultAsync();

            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            return Ok(prato);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/categoria/{categoriaId}
    [HttpGet("categoria/{categoriaId}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> GetPratosPorCategoria(int categoriaId)
    {
        try
        {
            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.CategoriaId == categoriaId && p.Disponivel)
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
                    CategoriaNome = p.Categoria != null ? p.Categoria.Nome : "Sem categoria"
                })
                .ToListAsync();

            return Ok(pratos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pratos da categoria {categoriaId}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // POST: api/pratos
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PratoResponseDto>> CreatePrato([FromBody] CreatePratoDto createPratoDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dados inválidos", errors = ModelState });
            }

            // Verificar se a categoria existe
            var categoria = await _context.Categorias.FindAsync(createPratoDto.CategoriaId);
            if (categoria == null)
            {
                return BadRequest(new { message = "Categoria não encontrada" });
            }

            // Verificar se já existe um prato com o mesmo nome
            var pratoExistente = await _context.Pratos
                .FirstOrDefaultAsync(p => p.Nome.ToLower() == createPratoDto.Nome.ToLower());
            
            if (pratoExistente != null)
            {
                return BadRequest(new { message = "Já existe um prato com este nome" });
            }

            var prato = new Prato
            {
                Nome = createPratoDto.Nome,
                Descricao = createPratoDto.Descricao,
                Preco = createPratoDto.Preco,
                ImagemUrl = createPratoDto.ImagemUrl,
                Disponivel = createPratoDto.Disponivel,
                TempoPreparo = createPratoDto.TempoPreparo,
                Tipo = createPratoDto.Tipo,
                DataCriacao = DateTime.UtcNow,
                CategoriaId = createPratoDto.CategoriaId
            };

            _context.Pratos.Add(prato);
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Prato criado com sucesso", new { 
                pratoId = prato.Id, 
                nome = prato.Nome,
                categoria = categoria.Nome 
            });

            var responseDto = new PratoResponseDto
            {
                Id = prato.Id,
                Nome = prato.Nome,
                Descricao = prato.Descricao,
                Preco = prato.Preco,
                ImagemUrl = prato.ImagemUrl,
                Disponivel = prato.Disponivel,
                TempoPreparo = prato.TempoPreparo,
                Tipo = prato.Tipo,
                DataCriacao = prato.DataCriacao,
                CategoriaId = prato.CategoriaId,
                CategoriaNome = categoria.Nome
            };

            return CreatedAtAction(nameof(GetPrato), new { id = prato.Id }, responseDto);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao criar prato", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // PUT: api/pratos/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdatePrato(int id, [FromBody] UpdatePratoDto updatePratoDto)
    {
        try
        {
            if (id != updatePratoDto.Id)
            {
                return BadRequest(new { message = "ID do prato não confere" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dados inválidos", errors = ModelState });
            }

            var prato = await _context.Pratos.FindAsync(id);
            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            // Verificar se a categoria existe
            var categoria = await _context.Categorias.FindAsync(updatePratoDto.CategoriaId);
            if (categoria == null)
            {
                return BadRequest(new { message = "Categoria não encontrada" });
            }

            // Verificar se já existe outro prato com o mesmo nome (excluindo o atual)
            var pratoExistente = await _context.Pratos
                .FirstOrDefaultAsync(p => p.Nome.ToLower() == updatePratoDto.Nome.ToLower() && p.Id != id);
            
            if (pratoExistente != null)
            {
                return BadRequest(new { message = "Já existe outro prato com este nome" });
            }

            // Atualizar propriedades
            prato.Nome = updatePratoDto.Nome;
            prato.Descricao = updatePratoDto.Descricao;
            prato.Preco = updatePratoDto.Preco;
            prato.ImagemUrl = updatePratoDto.ImagemUrl;
            prato.Disponivel = updatePratoDto.Disponivel;
            prato.TempoPreparo = updatePratoDto.TempoPreparo;
            prato.Tipo = updatePratoDto.Tipo;
            prato.CategoriaId = updatePratoDto.CategoriaId;

            await _context.SaveChangesAsync();

            _loggingService.LogApi("Prato atualizado com sucesso", new { 
                pratoId = prato.Id, 
                nome = prato.Nome,
                categoria = categoria.Nome 
            });

            return NoContent();
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // PATCH: api/pratos/{id}/preco
    [HttpPatch("{id}/preco")]
    [Authorize]
    public async Task<IActionResult> UpdatePreco(int id, [FromBody] decimal novoPreco)
    {
        try
        {
            if (novoPreco <= 0)
            {
                return BadRequest(new { message = "O preço deve ser maior que zero" });
            }

            var prato = await _context.Pratos.FindAsync(id);
            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            var precoAnterior = prato.Preco;
            prato.Preco = novoPreco;
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Preço do prato atualizado", new { 
                pratoId = prato.Id, 
                nome = prato.Nome,
                precoAnterior = precoAnterior,
                novoPreco = novoPreco 
            });

            return Ok(new { message = "Preço atualizado com sucesso", novoPreco });
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar preço do prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // PATCH: api/pratos/{id}/disponibilidade
    [HttpPatch("{id}/disponibilidade")]
    [Authorize]
    public async Task<IActionResult> UpdateDisponibilidade(int id, [FromBody] bool disponivel)
    {
        try
        {
            var prato = await _context.Pratos.FindAsync(id);
            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            prato.Disponivel = disponivel;
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Disponibilidade do prato atualizada", new { 
                pratoId = prato.Id, 
                nome = prato.Nome,
                disponivel = disponivel 
            });

            return Ok(new { message = "Disponibilidade atualizada com sucesso", disponivel });
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar disponibilidade do prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // DELETE: api/pratos/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeletePrato(int id)
    {
        try
        {
            var prato = await _context.Pratos.FindAsync(id);
            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            // Soft delete - apenas marca como indisponível
            prato.Disponivel = false;
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Prato removido (soft delete)", new { 
                pratoId = prato.Id, 
                nome = prato.Nome 
            });

            return Ok(new { message = "Prato removido com sucesso" });
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao remover prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // DELETE: api/pratos/{id}/hard
    [HttpDelete("{id}/hard")]
    [Authorize]
    public async Task<IActionResult> HardDeletePrato(int id)
    {
        try
        {
            var prato = await _context.Pratos.FindAsync(id);
            if (prato == null)
            {
                return NotFound(new { message = "Prato não encontrado" });
            }

            _context.Pratos.Remove(prato);
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Prato removido permanentemente", new { 
                pratoId = prato.Id, 
                nome = prato.Nome 
            });

            return Ok(new { message = "Prato removido permanentemente" });
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao remover permanentemente o prato {id}", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/stats
    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult> GetStats()
    {
        try
        {
            var totalPratos = await _context.Pratos.CountAsync();
            var pratosDisponiveis = await _context.Pratos.CountAsync(p => p.Disponivel);
            var pratosIndisponiveis = totalPratos - pratosDisponiveis;
            
            var pratosPorCategoria = await _context.Pratos
                .Include(p => p.Categoria)
                .GroupBy(p => p.Categoria.Nome)
                .Select(g => new { Categoria = g.Key, Quantidade = g.Count() })
                .ToListAsync();

            var precoMedio = await _context.Pratos
                .Where(p => p.Disponivel)
                .AverageAsync(p => p.Preco);

            var stats = new
            {
                TotalPratos = totalPratos,
                PratosDisponiveis = pratosDisponiveis,
                PratosIndisponiveis = pratosIndisponiveis,
                PrecoMedio = Math.Round(precoMedio, 2),
                PratosPorCategoria = pratosPorCategoria
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas dos pratos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // POST: api/pratos/bulk
    [HttpPost("bulk")]
    [Authorize]
    public async Task<ActionResult> CreateBulkPratos([FromBody] List<CreatePratoDto> pratosDto)
    {
        try
        {
            if (!pratosDto.Any())
            {
                return BadRequest(new { message = "Lista de pratos não pode estar vazia" });
            }

            var pratosCriados = 0;
            var erros = new List<string>();

            foreach (var pratoDto in pratosDto)
            {
                try
                {
                    // Verificar se a categoria existe
                    var categoria = await _context.Categorias.FindAsync(pratoDto.CategoriaId);
                    if (categoria == null)
                    {
                        erros.Add($"Categoria não encontrada para o prato: {pratoDto.Nome}");
                        continue;
                    }

                    // Verificar se já existe um prato com o mesmo nome
                    var pratoExistente = await _context.Pratos
                        .FirstOrDefaultAsync(p => p.Nome.ToLower() == pratoDto.Nome.ToLower());
                    
                    if (pratoExistente != null)
                    {
                        erros.Add($"Já existe um prato com o nome: {pratoDto.Nome}");
                        continue;
                    }

                    var prato = new Prato
                    {
                        Nome = pratoDto.Nome,
                        Descricao = pratoDto.Descricao,
                        Preco = pratoDto.Preco,
                        ImagemUrl = pratoDto.ImagemUrl,
                        Disponivel = pratoDto.Disponivel,
                        TempoPreparo = pratoDto.TempoPreparo,
                        Tipo = pratoDto.Tipo,
                        DataCriacao = DateTime.UtcNow,
                        CategoriaId = pratoDto.CategoriaId
                    };

                    _context.Pratos.Add(prato);
                    pratosCriados++;
                }
                catch (Exception ex)
                {
                    erros.Add($"Erro ao criar prato {pratoDto.Nome}: {ex.Message}");
                }
            }

            await _context.SaveChangesAsync();

            _loggingService.LogApi("Criação em lote de pratos concluída", new { 
                pratosCriados = pratosCriados,
                totalEnviados = pratosDto.Count,
                erros = erros.Count 
            });

            return Ok(new { 
                message = "Processamento em lote concluído",
                pratosCriados = pratosCriados,
                totalEnviados = pratosDto.Count,
                erros = erros
            });
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao criar pratos em lote", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/search
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> SearchPratos(
        [FromQuery] string? q,
        [FromQuery] int? categoriaId,
        [FromQuery] decimal? precoMin,
        [FromQuery] decimal? precoMax,
        [FromQuery] string? tipo,
        [FromQuery] int limit = 20)
    {
        try
        {
            _loggingService.LogApi("Buscando pratos", new { 
                endpoint = "GET /api/pratos/search",
                query = q,
                categoriaId = categoriaId,
                limit = limit
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

            if (!string.IsNullOrEmpty(tipo))
            {
                query = query.Where(p => p.Tipo == tipo);
            }

            var pratos = await query
                .OrderBy(p => p.Nome)
                .Take(limit)
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
            _loggingService.LogError("Erro ao buscar pratos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/recent
    [HttpGet("recent")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> GetRecentPratos([FromQuery] int limit = 10)
    {
        try
        {
            _loggingService.LogApi("Buscando pratos recentes", new { 
                endpoint = "GET /api/pratos/recent",
                limit = limit
            });

            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Disponivel)
                .OrderByDescending(p => p.DataCriacao)
                .Take(limit)
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
            _loggingService.LogError("Erro ao buscar pratos recentes", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/featured
    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PratoResponseDto>>> GetFeaturedPratos([FromQuery] int limit = 6)
    {
        try
        {
            _loggingService.LogApi("Buscando pratos em destaque", new { 
                endpoint = "GET /api/pratos/featured",
                limit = limit
            });

            // Buscar pratos mais vendidos (baseado em pedidos)
            var pratosMaisVendidos = await _context.ItensPedido
                .Include(ip => ip.Prato)
                .Include(ip => ip.Prato.Categoria)
                .Where(ip => ip.Prato.Disponivel)
                .GroupBy(ip => ip.PratoId)
                .Select(g => new { PratoId = g.Key, Quantidade = g.Sum(ip => ip.Quantidade) })
                .OrderByDescending(x => x.Quantidade)
                .Take(limit)
                .ToListAsync();

            var pratosIds = pratosMaisVendidos.Select(x => x.PratoId).ToList();

            var pratos = await _context.Pratos
                .Include(p => p.Categoria)
                .Where(p => p.Disponivel && pratosIds.Contains(p.Id))
                .OrderBy(p => pratosIds.IndexOf(p.Id))
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
            _loggingService.LogError("Erro ao buscar pratos em destaque", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/pratos/types
    [HttpGet("types")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<string>>> GetPratoTypes()
    {
        try
        {
            _loggingService.LogApi("Buscando tipos de pratos", new { 
                endpoint = "GET /api/pratos/types"
            });

            var tipos = await _context.Pratos
                .Where(p => p.Disponivel && !string.IsNullOrEmpty(p.Tipo))
                .Select(p => p.Tipo!)
                .Distinct()
                .OrderBy(t => t)
                .ToListAsync();

            return Ok(tipos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar tipos de pratos", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }
}