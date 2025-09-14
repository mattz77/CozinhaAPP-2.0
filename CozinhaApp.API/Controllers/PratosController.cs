using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PratosController : ControllerBase
{
    private readonly CozinhaAppContext _context;

    public PratosController(CozinhaAppContext context)
    {
        _context = context;
    }

    // GET: api/pratos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Prato>>> GetPratos()
    {
        try
        {
            // Buscar apenas os pratos básicos primeiro
            var pratos = await _context.Pratos
                .Where(p => p.Disponivel)
                .OrderBy(p => p.Nome)
                .ToListAsync();
            
            return Ok(pratos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    // GET: api/pratos/with-categories
    [HttpGet("with-categories")]
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
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    // GET: api/pratos/test
    [HttpGet("test")]
    public async Task<ActionResult> TestPratos()
    {
        try
        {
            var count = await _context.Pratos.CountAsync();
            return Ok(new { message = $"Total de pratos: {count}" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    // GET: api/pratos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Prato>> GetPrato(int id)
    {
        var prato = await _context.Pratos
            .Include(p => p.Categoria)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (prato == null)
        {
            return NotFound();
        }

        return prato;
    }

    // GET: api/pratos/categoria/5
    [HttpGet("categoria/{categoriaId}")]
    public async Task<ActionResult<IEnumerable<Prato>>> GetPratosPorCategoria(int categoriaId)
    {
        var pratos = await _context.Pratos
            .Include(p => p.Categoria)
            .Where(p => p.CategoriaId == categoriaId && p.Disponivel)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        return pratos;
    }

    // POST: api/pratos
    [HttpPost]
    public async Task<ActionResult<Prato>> PostPrato(Prato prato)
    {
        _context.Pratos.Add(prato);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPrato", new { id = prato.Id }, prato);
    }

    // PUT: api/pratos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPrato(int id, Prato prato)
    {
        if (id != prato.Id)
        {
            return BadRequest();
        }

        _context.Entry(prato).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PratoExists(id))
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

    // DELETE: api/pratos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePrato(int id)
    {
        var prato = await _context.Pratos.FindAsync(id);
        if (prato == null)
        {
            return NotFound();
        }

        // Soft delete - apenas marca como indisponível
        prato.Disponivel = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PratoExists(int id)
    {
        return _context.Pratos.Any(e => e.Id == id);
    }
}