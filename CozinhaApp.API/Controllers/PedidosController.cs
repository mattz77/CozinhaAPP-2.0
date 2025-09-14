using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly CozinhaAppContext _context;

    public PedidosController(CozinhaAppContext context)
    {
        _context = context;
    }

    // GET: api/pedidos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
    {
        return await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.ItensPedido)
                .ThenInclude(ip => ip.Prato)
            .OrderByDescending(p => p.DataPedido)
            .ToListAsync();
    }

    // GET: api/pedidos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> GetPedido(int id)
    {
        var pedido = await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.ItensPedido)
                .ThenInclude(ip => ip.Prato)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pedido == null)
        {
            return NotFound();
        }

        return pedido;
    }

    // GET: api/pedidos/cliente/5
    [HttpGet("cliente/{clienteId}")]
    public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosPorCliente(int clienteId)
    {
        var pedidos = await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.ItensPedido)
                .ThenInclude(ip => ip.Prato)
            .Where(p => p.ClienteId == clienteId)
            .OrderByDescending(p => p.DataPedido)
            .ToListAsync();

        return pedidos;
    }

    // POST: api/pedidos
    [HttpPost]
    public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
    {
        // Gerar número do pedido
        pedido.NumeroPedido = await GerarNumeroPedido();
        
        // Calcular valor total
        pedido.ValorTotal = pedido.ItensPedido.Sum(ip => ip.Quantidade * ip.PrecoUnitario);

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPedido", new { id = pedido.Id }, pedido);
    }

    // PUT: api/pedidos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPedido(int id, Pedido pedido)
    {
        if (id != pedido.Id)
        {
            return BadRequest();
        }

        _context.Entry(pedido).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PedidoExists(id))
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

    // PUT: api/pedidos/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> AtualizarStatusPedido(int id, [FromBody] string novoStatus)
    {
        var pedido = await _context.Pedidos.FindAsync(id);
        if (pedido == null)
        {
            return NotFound();
        }

        pedido.Status = novoStatus;
        
        if (novoStatus == "Entregue")
        {
            pedido.DataEntrega = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool PedidoExists(int id)
    {
        return _context.Pedidos.Any(e => e.Id == id);
    }

    private async Task<string> GerarNumeroPedido()
    {
        var ultimoPedido = await _context.Pedidos
            .OrderByDescending(p => p.Id)
            .FirstOrDefaultAsync();

        var proximoNumero = ultimoPedido?.Id + 1 ?? 1;
        return $"PED{proximoNumero:D6}";
    }
}
