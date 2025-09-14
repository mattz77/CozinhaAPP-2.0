using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Interfaces;

namespace CozinhaApp.API.Services;

public class ClienteService : IClienteService
{
    private readonly CozinhaAppContext _context;
    private readonly ILogger<ClienteService> _logger;

    public ClienteService(CozinhaAppContext context, ILogger<ClienteService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ClienteResponseDto?> GetClienteByUserIdAsync(string userId)
    {
        try
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.UserId == userId);

            return cliente != null ? MapToClienteResponseDto(cliente) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente por UserId: {UserId}", userId);
            return null;
        }
    }

    public async Task<ClienteResponseDto?> GetClienteByEmailAsync(string email)
    {
        try
        {
            var cliente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.Email == email);

            return cliente != null ? MapToClienteResponseDto(cliente) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente por email: {Email}", email);
            return null;
        }
    }

    public async Task<ClienteResponseDto> CreateClienteAsync(CreateClienteDto clienteDto, string userId)
    {
        try
        {
            var cliente = new Cliente
            {
                Nome = clienteDto.Nome,
                Email = clienteDto.Email,
                Telefone = clienteDto.Telefone,
                Endereco = clienteDto.Endereco,
                Cidade = clienteDto.Cidade,
                Cep = clienteDto.Cep,
                DataCriacao = DateTime.UtcNow,
                UserId = userId
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return MapToClienteResponseDto(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar cliente para UserId: {UserId}", userId);
            throw;
        }
    }

    public async Task<ClienteResponseDto?> UpdateClienteAsync(int clienteId, UpdateClienteDto clienteDto)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null)
                return null;

            cliente.Nome = clienteDto.Nome;
            cliente.Email = clienteDto.Email;
            cliente.Telefone = clienteDto.Telefone;
            cliente.Endereco = clienteDto.Endereco;
            cliente.Cidade = clienteDto.Cidade;
            cliente.Cep = clienteDto.Cep;

            await _context.SaveChangesAsync();

            return MapToClienteResponseDto(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente: {ClienteId}", clienteId);
            return null;
        }
    }


    public async Task<IEnumerable<ClienteResponseDto>> GetAllAsync()
    {
        try
        {
            var clientes = await _context.Clientes
                .Include(c => c.Pedidos)
                .ToListAsync();

            return clientes.Select(MapToClienteResponseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar todos os clientes");
            return new List<ClienteResponseDto>();
        }
    }

    public async Task<ClienteResponseDto?> GetByIdAsync(int id)
    {
        try
        {
            var cliente = await _context.Clientes
                .Include(c => c.Pedidos)
                .FirstOrDefaultAsync(c => c.Id == id);

            return cliente != null ? MapToClienteResponseDto(cliente) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar cliente por ID: {Id}", id);
            return null;
        }
    }

    public async Task<ClienteResponseDto> CreateAsync(CreateClienteDto dto)
    {
        try
        {
            var cliente = new Cliente
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                Cidade = dto.Cidade,
                Cep = dto.Cep,
                DataCriacao = DateTime.UtcNow
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return MapToClienteResponseDto(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar cliente");
            throw;
        }
    }

    public async Task<ClienteResponseDto?> UpdateAsync(int id, UpdateClienteDto dto)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return null;

            cliente.Nome = dto.Nome;
            cliente.Email = dto.Email;
            cliente.Telefone = dto.Telefone;
            cliente.Endereco = dto.Endereco;
            cliente.Cidade = dto.Cidade;
            cliente.Cep = dto.Cep;

            await _context.SaveChangesAsync();

            return MapToClienteResponseDto(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar cliente: {Id}", id);
            return null;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return false;

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar cliente: {Id}", id);
            return false;
        }
    }

    private static ClienteResponseDto MapToClienteResponseDto(Cliente cliente)
    {
        return new ClienteResponseDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            Email = cliente.Email,
            Telefone = cliente.Telefone,
            Endereco = cliente.Endereco,
            Cidade = cliente.Cidade,
            Cep = cliente.Cep,
            DataCriacao = cliente.DataCriacao,
            TotalPedidos = cliente.Pedidos?.Count ?? 0,
            UserId = cliente.UserId
        };
    }
}
