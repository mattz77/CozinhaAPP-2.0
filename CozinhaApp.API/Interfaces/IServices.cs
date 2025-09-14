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
}

public interface IPedidoService
{
    Task<IEnumerable<PedidoResponseDto>> GetAllAsync();
    Task<PedidoResponseDto?> GetByIdAsync(int id);
    Task<IEnumerable<PedidoResponseDto>> GetByClienteAsync(int clienteId);
    Task<PedidoResponseDto> CreateAsync(CreatePedidoDto dto);
    Task<bool> UpdateStatusAsync(int id, UpdatePedidoStatusDto dto);
    Task<bool> DeleteAsync(int id);
}
