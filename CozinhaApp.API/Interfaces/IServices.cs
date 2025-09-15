using CozinhaApp.API.DTOs;
using CozinhaApp.API.Models;

namespace CozinhaApp.API.Interfaces;

public interface ICategoriaService
{
    Task<IEnumerable<CategoriaResponseDto>> GetAllAsync();
    Task<CategoriaResponseDto?> GetByIdAsync(int id);
    Task<CategoriaResponseDto> CreateAsync(CreateCategoriaDto dto);
    Task<CategoriaResponseDto?> UpdateAsync(int id, UpdateCategoriaDto dto);
    Task<bool> DeleteAsync(int id);
}

public interface IPratoService
{
    Task<IEnumerable<PratoResponseDto>> GetAllAsync();
    Task<PratoResponseDto?> GetByIdAsync(int id);
    Task<IEnumerable<PratoResponseDto>> GetByCategoriaAsync(int categoriaId);
    Task<PratoResponseDto> CreateAsync(CreatePratoDto dto);
    Task<PratoResponseDto?> UpdateAsync(int id, UpdatePratoDto dto);
    Task<bool> DeleteAsync(int id);
}

public interface IClienteService
{
    Task<IEnumerable<ClienteResponseDto>> GetAllAsync();
    Task<ClienteResponseDto?> GetByIdAsync(int id);
    Task<ClienteResponseDto> CreateAsync(CreateClienteDto dto);
    Task<ClienteResponseDto?> UpdateAsync(int id, UpdateClienteDto dto);
    Task<bool> DeleteAsync(int id);
    
    // Métodos adicionais para integração com AuthService
    Task<ClienteResponseDto?> GetClienteByUserIdAsync(string userId);
    Task<ClienteResponseDto?> GetClienteByEmailAsync(string email);
    Task<ClienteResponseDto> CreateClienteAsync(CreateClienteDto clienteDto, string userId);
}

