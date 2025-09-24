using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Services;
using CozinhaApp.API.Interfaces;
using CozinhaApp.API.Data;
using Microsoft.EntityFrameworkCore;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly CozinhaApp.API.Services.IPedidoService _pedidoService;
    private readonly ILoggingService _loggingService;
    private readonly CozinhaAppContext _context;

    public PedidosController(
        CozinhaApp.API.Services.IPedidoService pedidoService, 
        ILoggingService loggingService,
        CozinhaAppContext context)
    {
        _pedidoService = pedidoService;
        _loggingService = loggingService;
        _context = context;
    }

    /// <summary>
    /// Lista todos os pedidos (apenas Admin e Manager)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetAllPedidos()
    {
        try
        {
            var pedidos = await _pedidoService.GetAllPedidosAsync();
            return Ok(pedidos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar todos os pedidos", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Lista pedidos do cliente logado
    /// </summary>
    [HttpGet("meus-pedidos")]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetMeusPedidos()
    {
        try
        {
            _loggingService.LogApi($"🚀 GetMeusPedidos: Iniciando busca de pedidos");
            _loggingService.LogApi($"🚀 GetMeusPedidos: User.Identity.Name: {User.Identity?.Name}");
            _loggingService.LogApi($"🚀 GetMeusPedidos: User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");
            
            // Log de todas as claims
            _loggingService.LogApi($"🔍 GetMeusPedidos: Todas as claims disponíveis:");
            foreach (var claim in User.Claims)
            {
                _loggingService.LogApi($"🔍 GetMeusPedidos: Claim - {claim.Type}: {claim.Value}");
            }

            // Tentar extrair userId - primeiro 'sub', depois 'NameIdentifier'
            var userId = User.FindFirst("sub")?.Value;
            _loggingService.LogApi($"🔍 GetMeusPedidos: Tentando extrair 'sub' claim: {userId}");
            
            if (string.IsNullOrEmpty(userId))
            {
                _loggingService.LogApi($"🔍 GetMeusPedidos: 'sub' não encontrado, tentando 'NameIdentifier'...");
                var nameIdentifierClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                _loggingService.LogApi($"🔍 GetMeusPedidos: NameIdentifier claim encontrada: {nameIdentifierClaim != null}");
                if (nameIdentifierClaim != null)
                {
                    userId = nameIdentifierClaim.Value;
                    _loggingService.LogApi($"🔍 GetMeusPedidos: 'NameIdentifier' valor: {userId}");
                }
                else
                {
                    _loggingService.LogApi($"🔍 GetMeusPedidos: 'NameIdentifier' não encontrada");
                }
            }

            if (string.IsNullOrEmpty(userId))
            {
                _loggingService.LogApi($"❌ GetMeusPedidos: Usuário não identificado - nem 'sub' nem 'NameIdentifier' encontrados");
                _loggingService.LogApi($"❌ GetMeusPedidos: Claims disponíveis: {string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))}");
                return Unauthorized("Usuário não identificado");
            }

            _loggingService.LogApi($"✅ GetMeusPedidos: Usuário identificado: {userId}");

            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado");
            }

            var pedidos = await _pedidoService.GetPedidosByClienteAsync(cliente.Id);
            return Ok(pedidos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pedidos do cliente", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Lista pedidos por status (apenas Admin e Manager)
    /// </summary>
    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetPedidosByStatus(string status)
    {
        try
        {
            var pedidos = await _pedidoService.GetPedidosByStatusAsync(status);
            return Ok(pedidos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedidos por status '{status}'", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Busca pedido por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PedidoDto>> GetPedidoById(int id)
    {
        try
        {
            var pedido = await _pedidoService.GetPedidoByIdAsync(id);
            if (pedido == null)
            {
                return NotFound("Pedido não encontrado");
            }

            // Verificar se o usuário pode acessar este pedido
            var userId = User.FindFirst("sub")?.Value;
            var isAdminOrManager = User.IsInRole("Admin") || User.IsInRole("Manager");
            
            if (!isAdminOrManager)
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.UserId == userId);
                
                if (cliente == null || pedido.ClienteId != cliente.Id)
                {
                    return Forbid("Você não tem permissão para acessar este pedido");
                }
            }

            return Ok(pedido);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedido {id}", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Busca pedido por número
    /// </summary>
    [HttpGet("numero/{numeroPedido}")]
    public async Task<ActionResult<PedidoDto>> GetPedidoByNumero(string numeroPedido)
    {
        try
        {
            var pedido = await _pedidoService.GetPedidoByNumeroAsync(numeroPedido);
            if (pedido == null)
            {
                return NotFound("Pedido não encontrado");
            }

            // Verificar se o usuário pode acessar este pedido
            var userId = User.FindFirst("sub")?.Value;
            var isAdminOrManager = User.IsInRole("Admin") || User.IsInRole("Manager");
            
            if (!isAdminOrManager)
            {
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.UserId == userId);
                
                if (cliente == null || pedido.ClienteId != cliente.Id)
                {
                    return Forbid("Você não tem permissão para acessar este pedido");
                }
            }

            return Ok(pedido);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedido '{numeroPedido}'", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Cria um novo pedido
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PedidoDto>> CriarPedido([FromBody] CriarPedidoDto criarPedidoDto)
    {
        try
        {
            _loggingService.LogApi($"CriarPedido: Requisição recebida.");

            if (!ModelState.IsValid)
            {
                _loggingService.LogApi($"CriarPedido: ModelState inválido. Erros: {string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))}");
                return BadRequest(ModelState);
            }

            _loggingService.LogApi($"🚀 CriarPedido: Iniciando criação de pedido");
            _loggingService.LogApi($"🚀 CriarPedido: Request recebido: {System.Text.Json.JsonSerializer.Serialize(criarPedidoDto)}");
            _loggingService.LogApi($"🚀 CriarPedido: User.Identity.Name: {User.Identity?.Name}");
            _loggingService.LogApi($"🚀 CriarPedido: User.Identity.IsAuthenticated: {User.Identity?.IsAuthenticated}");
            _loggingService.LogApi($"🚀 CriarPedido: User.Identity.AuthenticationType: {User.Identity?.AuthenticationType}");
            
            // Log de todas as claims
            _loggingService.LogApi($"🔍 CriarPedido: Todas as claims disponíveis:");
            foreach (var claim in User.Claims)
            {
                _loggingService.LogApi($"🔍 CriarPedido: Claim - {claim.Type}: {claim.Value}");
            }

            var userId = User.FindFirst("sub")?.Value;
            _loggingService.LogApi($"🔍 CriarPedido: Tentando extrair 'sub' claim: {userId}");
            
            // Se não encontrar 'sub', tentar 'NameIdentifier'
            if (string.IsNullOrEmpty(userId))
            {
                _loggingService.LogApi($"🔍 CriarPedido: 'sub' não encontrado, tentando 'NameIdentifier'...");
                var nameIdentifierClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                _loggingService.LogApi($"🔍 CriarPedido: NameIdentifier claim encontrada: {nameIdentifierClaim != null}");
                if (nameIdentifierClaim != null)
                {
                    userId = nameIdentifierClaim.Value;
                    _loggingService.LogApi($"🔍 CriarPedido: 'NameIdentifier' valor: {userId}");
                }
                else
                {
                    _loggingService.LogApi($"🔍 CriarPedido: 'NameIdentifier' não encontrada");
                }
            }

            if (string.IsNullOrEmpty(userId))
            {
                _loggingService.LogApi($"❌ CriarPedido: Usuário não identificado - nem 'sub' nem 'NameIdentifier' encontrados");
                _loggingService.LogApi($"❌ CriarPedido: Claims disponíveis: {string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))}");
                return Unauthorized("Usuário não identificado");
            }

            _loggingService.LogApi($"✅ CriarPedido: Usuário identificado: {userId}");

            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cliente == null)
            {
                return NotFound("Cliente não encontrado. Complete seu cadastro primeiro.");
            }

            var pedido = await _pedidoService.CriarPedidoAsync(criarPedidoDto, cliente.Id);
            
            _loggingService.LogApi($"Pedido {pedido.NumeroPedido} criado com sucesso pelo cliente {cliente.Id}");
            return CreatedAtAction(nameof(GetPedidoById), new { id = pedido.Id }, pedido);
        }
        catch (ArgumentException ex)
        {
            _loggingService.LogError("Erro de validação ao criar pedido", ex);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao criar pedido", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Atualiza o status de um pedido (apenas Admin e Manager)
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<PedidoDto>> AtualizarStatusPedido(int id, [FromBody] AtualizarStatusPedidoDto atualizarDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pedido = await _pedidoService.AtualizarStatusPedidoAsync(id, atualizarDto);
            if (pedido == null)
            {
                return NotFound("Pedido não encontrado");
            }

            _loggingService.LogApi($"Status do pedido {id} atualizado para '{atualizarDto.Status}'");
            return Ok(pedido);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar status do pedido {id}", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Cancela um pedido
    /// </summary>
    [HttpPut("{id}/cancelar")]
    public async Task<ActionResult> CancelarPedido(int id)
    {
        try
        {
            var userId = User.FindFirst("sub")?.Value;
            var isAdminOrManager = User.IsInRole("Admin") || User.IsInRole("Manager");
            
            if (!isAdminOrManager)
            {
                // Verificar se o pedido pertence ao cliente
                var cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.UserId == userId);
                
                if (cliente == null)
                {
                    return NotFound("Cliente não encontrado");
                }

                var pedido = await _context.Pedidos
                    .FirstOrDefaultAsync(p => p.Id == id && p.ClienteId == cliente.Id);
                
                if (pedido == null)
                {
                    return NotFound("Pedido não encontrado");
                }

                // Clientes só podem cancelar pedidos pendentes
                if (pedido.Status != "Pendente")
                {
                    return BadRequest("Apenas pedidos pendentes podem ser cancelados pelo cliente");
                }
            }

            var sucesso = await _pedidoService.CancelarPedidoAsync(id);
            if (!sucesso)
            {
                return NotFound("Pedido não encontrado");
            }

            _loggingService.LogApi($"Pedido {id} cancelado");
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _loggingService.LogError($"Erro ao cancelar pedido {id}", ex);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao cancelar pedido {id}", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém estatísticas dos pedidos (apenas Admin)
    /// </summary>
    [HttpGet("estatisticas")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PedidoEstatisticasDto>> GetEstatisticasPedidos()
    {
        try
        {
            var estatisticas = await _pedidoService.GetEstatisticasPedidosAsync();
            return Ok(estatisticas);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas dos pedidos", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém pedidos recentes (apenas Admin e Manager)
    /// </summary>
    [HttpGet("recentes")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<PedidoResumoDto>>> GetPedidosRecentes([FromQuery] int quantidade = 10)
    {
        try
        {
            if (quantidade <= 0 || quantidade > 50)
            {
                return BadRequest("Quantidade deve estar entre 1 e 50");
            }

            var pedidosRecentes = await _pedidoService.GetPedidosRecentesAsync(quantidade);
            return Ok(pedidosRecentes);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pedidos recentes", ex);
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}