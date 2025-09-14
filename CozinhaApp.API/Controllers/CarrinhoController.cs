using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Services;
using System.Security.Claims;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CarrinhoController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public CarrinhoController(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    // GET: api/carrinho
    [HttpGet]
    public async Task<ActionResult<CarrinhoResponseDto>> GetCarrinho()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            _loggingService.LogApi("Buscando carrinho do usuário", new { userId, endpoint = "GET /api/carrinho" });

            var carrinho = await _context.Carrinhos
                .Include(c => c.Itens)
                    .ThenInclude(i => i.Prato)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (carrinho == null)
            {
                // Criar carrinho vazio se não existir
                carrinho = new Carrinho
                {
                    UserId = userId,
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                };
                _context.Carrinhos.Add(carrinho);
                await _context.SaveChangesAsync();
            }

            var response = new CarrinhoResponseDto
            {
                Id = carrinho.Id,
                UserId = carrinho.UserId,
                DataCriacao = carrinho.DataCriacao,
                DataAtualizacao = carrinho.DataAtualizacao,
                Itens = carrinho.Itens.Select(i => new ItemCarrinhoResponseDto
                {
                    Id = i.Id,
                    PratoId = i.PratoId,
                    PratoNome = i.Prato.Nome,
                    PratoImagemUrl = i.Prato.ImagemUrl,
                    PrecoUnitario = i.PrecoUnitario,
                    Quantidade = i.Quantidade,
                    Subtotal = i.PrecoUnitario * i.Quantidade,
                    Observacoes = i.Observacoes,
                    DataAdicao = i.DataAdicao
                }).ToList(),
                TotalItens = carrinho.Itens.Sum(i => i.Quantidade),
                ValorTotal = carrinho.Itens.Sum(i => i.PrecoUnitario * i.Quantidade)
            };

            _loggingService.LogApi("Carrinho encontrado", new { 
                userId, 
                totalItens = response.TotalItens, 
                valorTotal = response.ValorTotal 
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // POST: api/carrinho/item
    [HttpPost("item")]
    public async Task<ActionResult<ItemCarrinhoResponseDto>> AdicionarItem([FromBody] AddItemCarrinhoDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            _loggingService.LogApi("Adicionando item ao carrinho", new { 
                userId, 
                pratoId = dto.PratoId, 
                quantidade = dto.Quantidade,
                endpoint = "POST /api/carrinho/item"
            });

            // Verificar se o prato existe e está disponível
            var prato = await _context.Pratos
                .FirstOrDefaultAsync(p => p.Id == dto.PratoId && p.Disponivel);

            if (prato == null)
            {
                return BadRequest(new { message = "Prato não encontrado ou indisponível" });
            }

            // Buscar ou criar carrinho
            var carrinho = await _context.Carrinhos
                .Include(c => c.Itens)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (carrinho == null)
            {
                carrinho = new Carrinho
                {
                    UserId = userId,
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                };
                _context.Carrinhos.Add(carrinho);
                await _context.SaveChangesAsync();
            }

            // Verificar se o item já existe no carrinho
            var itemExistente = carrinho.Itens.FirstOrDefault(i => i.PratoId == dto.PratoId);

            if (itemExistente != null)
            {
                // Atualizar quantidade do item existente
                itemExistente.Quantidade += dto.Quantidade;
                itemExistente.Observacoes = dto.Observacoes ?? itemExistente.Observacoes;
            }
            else
            {
                // Adicionar novo item
                var novoItem = new ItemCarrinho
                {
                    CarrinhoId = carrinho.Id,
                    PratoId = dto.PratoId,
                    Quantidade = dto.Quantidade,
                    PrecoUnitario = prato.Preco,
                    Observacoes = dto.Observacoes,
                    DataAdicao = DateTime.UtcNow
                };
                _context.ItensCarrinho.Add(novoItem);
            }

            carrinho.DataAtualizacao = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Buscar o item atualizado para retornar
            var itemAtualizado = await _context.ItensCarrinho
                .Include(i => i.Prato)
                .FirstOrDefaultAsync(i => i.CarrinhoId == carrinho.Id && i.PratoId == dto.PratoId);

            var response = new ItemCarrinhoResponseDto
            {
                Id = itemAtualizado!.Id,
                PratoId = itemAtualizado.PratoId,
                PratoNome = itemAtualizado.Prato.Nome,
                PratoImagemUrl = itemAtualizado.Prato.ImagemUrl,
                PrecoUnitario = itemAtualizado.PrecoUnitario,
                Quantidade = itemAtualizado.Quantidade,
                Subtotal = itemAtualizado.PrecoUnitario * itemAtualizado.Quantidade,
                Observacoes = itemAtualizado.Observacoes,
                DataAdicao = itemAtualizado.DataAdicao
            };

            _loggingService.LogApi("Item adicionado ao carrinho", new { 
                userId, 
                itemId = response.Id,
                quantidade = response.Quantidade,
                subtotal = response.Subtotal
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao adicionar item ao carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // PUT: api/carrinho/item/{itemId}
    [HttpPut("item/{itemId}")]
    public async Task<ActionResult<ItemCarrinhoResponseDto>> AtualizarItem(int itemId, [FromBody] UpdateItemCarrinhoDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            _loggingService.LogApi("Atualizando item do carrinho", new { 
                userId, 
                itemId, 
                quantidade = dto.Quantidade,
                endpoint = "PUT /api/carrinho/item/{itemId}"
            });

            var item = await _context.ItensCarrinho
                .Include(i => i.Carrinho)
                .Include(i => i.Prato)
                .FirstOrDefaultAsync(i => i.Id == itemId && i.Carrinho.UserId == userId);

            if (item == null)
            {
                return NotFound(new { message = "Item não encontrado no carrinho" });
            }

            item.Quantidade = dto.Quantidade;
            item.Observacoes = dto.Observacoes;
            item.Carrinho.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = new ItemCarrinhoResponseDto
            {
                Id = item.Id,
                PratoId = item.PratoId,
                PratoNome = item.Prato.Nome,
                PratoImagemUrl = item.Prato.ImagemUrl,
                PrecoUnitario = item.PrecoUnitario,
                Quantidade = item.Quantidade,
                Subtotal = item.PrecoUnitario * item.Quantidade,
                Observacoes = item.Observacoes,
                DataAdicao = item.DataAdicao
            };

            _loggingService.LogApi("Item atualizado no carrinho", new { 
                userId, 
                itemId = response.Id,
                quantidade = response.Quantidade,
                subtotal = response.Subtotal
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao atualizar item do carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // DELETE: api/carrinho/item/{itemId}
    [HttpDelete("item/{itemId}")]
    public async Task<IActionResult> RemoverItem(int itemId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            _loggingService.LogApi("Removendo item do carrinho", new { 
                userId, 
                itemId,
                endpoint = "DELETE /api/carrinho/item/{itemId}"
            });

            var item = await _context.ItensCarrinho
                .Include(i => i.Carrinho)
                .FirstOrDefaultAsync(i => i.Id == itemId && i.Carrinho.UserId == userId);

            if (item == null)
            {
                return NotFound(new { message = "Item não encontrado no carrinho" });
            }

            _context.ItensCarrinho.Remove(item);
            item.Carrinho.DataAtualizacao = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _loggingService.LogApi("Item removido do carrinho", new { 
                userId, 
                itemId
            });

            return NoContent();
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao remover item do carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // DELETE: api/carrinho
    [HttpDelete]
    public async Task<IActionResult> LimparCarrinho()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            _loggingService.LogApi("Limpando carrinho", new { 
                userId,
                endpoint = "DELETE /api/carrinho"
            });

            var carrinho = await _context.Carrinhos
                .Include(c => c.Itens)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (carrinho != null)
            {
                _context.ItensCarrinho.RemoveRange(carrinho.Itens);
                carrinho.DataAtualizacao = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            _loggingService.LogApi("Carrinho limpo", new { userId });

            return NoContent();
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao limpar carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    // GET: api/carrinho/stats
    [HttpGet("stats")]
    public async Task<ActionResult<CarrinhoStatsDto>> GetCarrinhoStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Usuário não autenticado" });
            }

            var carrinho = await _context.Carrinhos
                .Include(c => c.Itens)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            var stats = new CarrinhoStatsDto
            {
                TotalItens = carrinho?.Itens.Sum(i => i.Quantidade) ?? 0,
                ValorTotal = carrinho?.Itens.Sum(i => i.PrecoUnitario * i.Quantidade) ?? 0,
                QuantidadeItensUnicos = carrinho?.Itens.Count ?? 0,
                UltimaAtualizacao = carrinho?.DataAtualizacao
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar estatísticas do carrinho", ex);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
        }
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
