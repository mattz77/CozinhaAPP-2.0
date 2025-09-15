using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Interfaces;
using CozinhaApp.API.Services;

namespace CozinhaApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requer autenticação
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<UsersController> _logger;
    private readonly ILoggingService _loggingService;

    public UsersController(
        UserManager<ApplicationUser> userManager,
        ILogger<UsersController> logger,
        ILoggingService loggingService)
    {
        _userManager = userManager;
        _logger = logger;
        _loggingService = loggingService;
    }

    /// <summary>
    /// Lista todos os usuários (apenas para administradores)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserManagementDto>>> GetUsers()
    {
        try
        {
            // Verificar se o usuário atual é admin
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid("Apenas administradores podem acessar esta funcionalidade");
            }

            var users = _userManager.Users
                .Where(user => user.Role == "Admin" || user.Role == "Manager")
                .ToList();
            var userDtos = users.Select(user => new UserManagementDto
            {
                Id = user.Id,
                NomeCompleto = user.NomeCompleto,
                Email = user.Email!,
                Role = user.Role,
                Ativo = user.Ativo,
                DataCriacao = user.DataCriacao,
                UltimoLogin = user.UltimoLogin,
                Telefone = user.PhoneNumber,
                Endereco = user.Endereco,
                Cidade = user.Cidade,
                Cep = user.Cep
            }).ToList();

            _loggingService.LogApi("Lista de usuários retornada", new { 
                Count = userDtos.Count,
                RequestedBy = currentUser.Email
            });

            return Ok(userDtos);
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao listar usuários", ex);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Atualiza o role de um usuário (apenas para administradores)
    /// </summary>
    [HttpPut("{userId}/role")]
    public async Task<ActionResult> UpdateUserRole(string userId, [FromBody] UpdateUserRoleDto updateRoleDto)
    {
        try
        {
            // Verificar se o usuário atual é admin
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid("Apenas administradores podem alterar roles de usuários");
            }

            // Validar role
            if (updateRoleDto.Role != "Admin" && updateRoleDto.Role != "Usuario")
            {
                return BadRequest(new { message = "Role deve ser 'Admin' ou 'Usuario'" });
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            // Não permitir que o próprio admin altere seu próprio role
            if (user.Id == currentUser.Id)
            {
                return BadRequest(new { message = "Você não pode alterar seu próprio role" });
            }

            var oldRole = user.Role;
            user.Role = updateRoleDto.Role;
            
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = $"Erro ao atualizar usuário: {errors}" });
            }

            _loggingService.LogApi("Role de usuário atualizado", new { 
                UserId = userId,
                UserEmail = user.Email,
                OldRole = oldRole,
                NewRole = updateRoleDto.Role,
                UpdatedBy = currentUser.Email
            });

            return Ok(new { message = "Role atualizado com sucesso" });
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao atualizar role do usuário", ex, new { UserId = userId });
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Ativa/desativa um usuário (apenas para administradores)
    /// </summary>
    [HttpPut("{userId}/status")]
    public async Task<ActionResult> UpdateUserStatus(string userId, [FromBody] UpdateUserStatusDto updateStatusDto)
    {
        try
        {
            // Verificar se o usuário atual é admin
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || currentUser.Role != "Admin")
            {
                return Forbid("Apenas administradores podem alterar status de usuários");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado" });
            }

            // Não permitir que o próprio admin desative sua própria conta
            if (user.Id == currentUser.Id && !updateStatusDto.Ativo)
            {
                return BadRequest(new { message = "Você não pode desativar sua própria conta" });
            }

            var oldStatus = user.Ativo;
            user.Ativo = updateStatusDto.Ativo;
            
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest(new { message = $"Erro ao atualizar usuário: {errors}" });
            }

            _loggingService.LogApi("Status de usuário atualizado", new { 
                UserId = userId,
                UserEmail = user.Email,
                OldStatus = oldStatus,
                NewStatus = updateStatusDto.Ativo,
                UpdatedBy = currentUser.Email
            });

            return Ok(new { message = "Status atualizado com sucesso" });
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao atualizar status do usuário", ex, new { UserId = userId });
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
