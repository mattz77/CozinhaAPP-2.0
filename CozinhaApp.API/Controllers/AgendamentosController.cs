using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Models;
using System.Security.Claims;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgendamentosController : ControllerBase
{
    private readonly CozinhaAppContext _context;
    private readonly ILogger<AgendamentosController> _logger;

    public AgendamentosController(CozinhaAppContext context, ILogger<AgendamentosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/agendamentos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgendamentoResponseDto>>> GetAgendamentos()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var agendamentos = await _context.Agendamentos
                .Where(a => a.UserId == userId)
                .Include(a => a.User)
                .Include(a => a.Itens)
                    .ThenInclude(i => i.Prato)
                .OrderByDescending(a => a.DataAgendamento)
                .ToListAsync();

            var response = agendamentos.Select(a => new AgendamentoResponseDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = a.User?.UserName ?? "Usuário",
                UserEmail = a.User?.Email ?? "",
                DataAgendamento = a.DataAgendamento,
                Status = a.Status,
                ValorTotal = a.ValorTotal,
                Observacoes = a.Observacoes,
                EnderecoEntrega = a.EnderecoEntrega,
                TelefoneContato = a.TelefoneContato,
                PagamentoAntecipado = a.PagamentoAntecipado,
                MetodoPagamento = a.MetodoPagamento,
                DataPagamento = a.DataPagamento,
                DataCriacao = a.DataCriacao,
                DataAtualizacao = a.DataAtualizacao,
                Itens = a.Itens.Select(i => new ItemAgendamentoResponseDto
                {
                    Id = i.Id,
                    PratoId = i.PratoId,
                    PratoNome = i.Prato.Nome,
                    PratoImagemUrl = i.Prato.ImagemUrl,
                    Quantidade = i.Quantidade,
                    PrecoUnitario = i.PrecoUnitario,
                    Subtotal = i.Quantidade * i.PrecoUnitario,
                    Observacoes = i.Observacoes
                }).ToList()
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar agendamentos do usuário {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    // GET: api/agendamentos/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<AgendamentoResponseDto>> GetAgendamento(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var agendamento = await _context.Agendamentos
                .Include(a => a.User)
                .Include(a => a.Itens)
                    .ThenInclude(i => i.Prato)
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (agendamento == null)
                return NotFound();

            var response = new AgendamentoResponseDto
            {
                Id = agendamento.Id,
                UserId = agendamento.UserId,
                UserName = agendamento.User?.UserName ?? "Usuário",
                UserEmail = agendamento.User?.Email ?? "",
                DataAgendamento = agendamento.DataAgendamento,
                Status = agendamento.Status,
                ValorTotal = agendamento.ValorTotal,
                Observacoes = agendamento.Observacoes,
                EnderecoEntrega = agendamento.EnderecoEntrega,
                TelefoneContato = agendamento.TelefoneContato,
                PagamentoAntecipado = agendamento.PagamentoAntecipado,
                MetodoPagamento = agendamento.MetodoPagamento,
                DataPagamento = agendamento.DataPagamento,
                DataCriacao = agendamento.DataCriacao,
                DataAtualizacao = agendamento.DataAtualizacao,
                Itens = agendamento.Itens.Select(i => new ItemAgendamentoResponseDto
                {
                    Id = i.Id,
                    PratoId = i.PratoId,
                    PratoNome = i.Prato.Nome,
                    PratoImagemUrl = i.Prato.ImagemUrl,
                    Quantidade = i.Quantidade,
                    PrecoUnitario = i.PrecoUnitario,
                    Subtotal = i.Quantidade * i.PrecoUnitario,
                    Observacoes = i.Observacoes
                }).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar agendamento {AgendamentoId} do usuário {UserId}", id, User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    // POST: api/agendamentos
    [HttpPost]
    public async Task<ActionResult<AgendamentoResponseDto>> CreateAgendamento(CreateAgendamentoDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Validar data de agendamento (mínimo 1 hora no futuro)
            if (dto.DataAgendamento <= DateTime.UtcNow.AddHours(1))
                return BadRequest("A data de agendamento deve ser pelo menos 1 hora no futuro");

            // Validar se os pratos existem e estão disponíveis
            var pratoIds = dto.Itens.Select(i => i.PratoId).ToList();
            var pratos = await _context.Pratos
                .Where(p => pratoIds.Contains(p.Id) && p.Disponivel)
                .ToListAsync();

            if (pratos.Count != pratoIds.Count)
                return BadRequest("Um ou mais pratos não estão disponíveis");

            // Calcular valor total
            decimal valorTotal = 0;
            foreach (var item in dto.Itens)
            {
                var prato = pratos.First(p => p.Id == item.PratoId);
                valorTotal += prato.Preco * item.Quantidade;
            }

            // Criar agendamento
            var agendamento = new Agendamento
            {
                UserId = userId,
                DataAgendamento = dto.DataAgendamento,
                Status = "Pendente",
                ValorTotal = valorTotal,
                Observacoes = dto.Observacoes,
                EnderecoEntrega = dto.EnderecoEntrega,
                TelefoneContato = dto.TelefoneContato,
                PagamentoAntecipado = dto.PagamentoAntecipado,
                MetodoPagamento = dto.MetodoPagamento,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = DateTime.UtcNow
            };

            _context.Agendamentos.Add(agendamento);
            await _context.SaveChangesAsync();

            // Adicionar itens
            foreach (var itemDto in dto.Itens)
            {
                var prato = pratos.First(p => p.Id == itemDto.PratoId);
                var item = new ItemAgendamento
                {
                    AgendamentoId = agendamento.Id,
                    PratoId = itemDto.PratoId,
                    Quantidade = itemDto.Quantidade,
                    PrecoUnitario = prato.Preco,
                    Observacoes = itemDto.Observacoes
                };
                _context.ItensAgendamento.Add(item);
            }

            await _context.SaveChangesAsync();

            // Retornar agendamento criado
            var response = await GetAgendamento(agendamento.Id);
            return CreatedAtAction(nameof(GetAgendamento), new { id = agendamento.Id }, response.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar agendamento para usuário {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    // PUT: api/agendamentos/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAgendamento(int id, UpdateAgendamentoDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var agendamento = await _context.Agendamentos
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (agendamento == null)
                return NotFound();

            // Só permite atualizar se ainda estiver pendente
            if (agendamento.Status != "Pendente")
                return BadRequest("Só é possível atualizar agendamentos pendentes");

            // Atualizar campos
            if (!string.IsNullOrEmpty(dto.Status))
                agendamento.Status = dto.Status;
            
            if (dto.Observacoes != null)
                agendamento.Observacoes = dto.Observacoes;
            
            if (dto.EnderecoEntrega != null)
                agendamento.EnderecoEntrega = dto.EnderecoEntrega;
            
            if (dto.TelefoneContato != null)
                agendamento.TelefoneContato = dto.TelefoneContato;
            
            if (dto.MetodoPagamento != null)
                agendamento.MetodoPagamento = dto.MetodoPagamento;

            agendamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar agendamento {AgendamentoId} do usuário {UserId}", id, User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    // DELETE: api/agendamentos/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAgendamento(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var agendamento = await _context.Agendamentos
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (agendamento == null)
                return NotFound();

            // Só permite cancelar se ainda estiver pendente
            if (agendamento.Status != "Pendente")
                return BadRequest("Só é possível cancelar agendamentos pendentes");

            agendamento.Status = "Cancelado";
            agendamento.DataAtualizacao = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar agendamento {AgendamentoId} do usuário {UserId}", id, User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    // GET: api/agendamentos/stats
    [HttpGet("stats")]
    public async Task<ActionResult<AgendamentoStatsDto>> GetStats()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var agendamentos = await _context.Agendamentos
                .Where(a => a.UserId == userId)
                .ToListAsync();

            var stats = new AgendamentoStatsDto
            {
                TotalAgendamentos = agendamentos.Count,
                AgendamentosPendentes = agendamentos.Count(a => a.Status == "Pendente"),
                AgendamentosConfirmados = agendamentos.Count(a => a.Status == "Confirmado"),
                AgendamentosPreparando = agendamentos.Count(a => a.Status == "Preparando"),
                AgendamentosProntos = agendamentos.Count(a => a.Status == "Pronto"),
                AgendamentosEntregues = agendamentos.Count(a => a.Status == "Entregue"),
                AgendamentosCancelados = agendamentos.Count(a => a.Status == "Cancelado"),
                ValorTotalAgendamentos = agendamentos.Sum(a => a.ValorTotal),
                ValorMedioAgendamento = agendamentos.Any() ? agendamentos.Average(a => a.ValorTotal) : 0
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar estatísticas de agendamentos do usuário {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}
