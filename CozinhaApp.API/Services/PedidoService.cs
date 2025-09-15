using Microsoft.EntityFrameworkCore;
using CozinhaApp.API.Data;
using CozinhaApp.API.Models;
using CozinhaApp.API.DTOs;
using CozinhaApp.API.Interfaces;

namespace CozinhaApp.API.Services;

public interface IPedidoService
{
    Task<IEnumerable<PedidoDto>> GetAllPedidosAsync();
    Task<IEnumerable<PedidoDto>> GetPedidosByClienteAsync(int clienteId);
    Task<IEnumerable<PedidoDto>> GetPedidosByStatusAsync(string status);
    Task<PedidoDto?> GetPedidoByIdAsync(int id);
    Task<PedidoDto?> GetPedidoByNumeroAsync(string numeroPedido);
    Task<PedidoDto> CriarPedidoAsync(CriarPedidoDto criarPedidoDto, int clienteId);
    Task<PedidoDto?> AtualizarStatusPedidoAsync(int id, AtualizarStatusPedidoDto atualizarDto);
    Task<bool> CancelarPedidoAsync(int id);
    Task<PedidoEstatisticasDto> GetEstatisticasPedidosAsync();
    Task<IEnumerable<PedidoResumoDto>> GetPedidosRecentesAsync(int quantidade = 10);
}

public class PedidoService : IPedidoService
{
    private readonly CozinhaAppContext _context;
    private readonly ILoggingService _loggingService;

    public PedidoService(CozinhaAppContext context, ILoggingService loggingService)
    {
        _context = context;
        _loggingService = loggingService;
    }

    public async Task<IEnumerable<PedidoDto>> GetAllPedidosAsync()
    {
        try
        {
            _loggingService.LogApi("Buscando todos os pedidos");

            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            var pedidosDto = pedidos.Select(MapToPedidoDto).ToList();

            _loggingService.LogApi($"Encontrados {pedidosDto.Count} pedidos");
            return pedidosDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pedidos", ex);
            throw;
        }
    }

    public async Task<IEnumerable<PedidoDto>> GetPedidosByClienteAsync(int clienteId)
    {
        try
        {
            _loggingService.LogApi($"Buscando pedidos do cliente {clienteId}");

            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .Where(p => p.ClienteId == clienteId)
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            var pedidosDto = pedidos.Select(MapToPedidoDto).ToList();

            _loggingService.LogApi($"Encontrados {pedidosDto.Count} pedidos para o cliente {clienteId}");
            return pedidosDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedidos do cliente {clienteId}", ex);
            throw;
        }
    }

    public async Task<IEnumerable<PedidoDto>> GetPedidosByStatusAsync(string status)
    {
        try
        {
            _loggingService.LogApi($"Buscando pedidos com status '{status}'");

            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .Where(p => p.Status == status)
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            var pedidosDto = pedidos.Select(MapToPedidoDto).ToList();

            _loggingService.LogApi($"Encontrados {pedidosDto.Count} pedidos com status '{status}'");
            return pedidosDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedidos com status '{status}'", ex);
            throw;
        }
    }

    public async Task<PedidoDto?> GetPedidoByIdAsync(int id)
    {
        try
        {
            _loggingService.LogApi($"Buscando pedido por ID {id}");

            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                _loggingService.LogApi($"Pedido {id} não encontrado");
                return null;
            }

            var pedidoDto = MapToPedidoDto(pedido);
            _loggingService.LogApi($"Pedido {id} encontrado");
            return pedidoDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedido {id}", ex);
            throw;
        }
    }

    public async Task<PedidoDto?> GetPedidoByNumeroAsync(string numeroPedido)
    {
        try
        {
            _loggingService.LogApi($"Buscando pedido por número '{numeroPedido}'");

            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .FirstOrDefaultAsync(p => p.NumeroPedido == numeroPedido);

            if (pedido == null)
            {
                _loggingService.LogApi($"Pedido '{numeroPedido}' não encontrado");
                return null;
            }

            var pedidoDto = MapToPedidoDto(pedido);
            _loggingService.LogApi($"Pedido '{numeroPedido}' encontrado");
            return pedidoDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao buscar pedido '{numeroPedido}'", ex);
            throw;
        }
    }

    public async Task<PedidoDto> CriarPedidoAsync(CriarPedidoDto criarPedidoDto, int clienteId)
    {
        try
        {
            _loggingService.LogApi($"Criando novo pedido para cliente {clienteId}");

            // Verificar se o cliente existe
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null)
            {
                throw new ArgumentException($"Cliente {clienteId} não encontrado");
            }

            // Gerar número do pedido único
            var numeroPedido = await GerarNumeroPedidoAsync();

            // Calcular valor total
            decimal valorTotal = 0;
            var itensPedido = new List<ItemPedido>();

            foreach (var itemDto in criarPedidoDto.Itens)
            {
                var prato = await _context.Pratos.FindAsync(itemDto.PratoId);
                if (prato == null)
                {
                    throw new ArgumentException($"Prato {itemDto.PratoId} não encontrado");
                }

                if (!prato.Disponivel)
                {
                    throw new ArgumentException($"Prato '{prato.Nome}' não está disponível");
                }

                var subtotal = itemDto.Quantidade * prato.Preco;
                valorTotal += subtotal;

                itensPedido.Add(new ItemPedido
                {
                    PratoId = itemDto.PratoId,
                    Quantidade = itemDto.Quantidade,
                    PrecoUnitario = prato.Preco,
                    Observacoes = itemDto.Observacoes
                });
            }

            // Criar o pedido
            var pedido = new Pedido
            {
                NumeroPedido = numeroPedido,
                ClienteId = clienteId,
                ValorTotal = valorTotal,
                Status = "Pendente",
                EnderecoEntrega = criarPedidoDto.EnderecoEntrega,
                FormaPagamento = criarPedidoDto.FormaPagamento,
                Observacoes = criarPedidoDto.Observacoes,
                DataPedido = DateTime.UtcNow,
                ItensPedido = itensPedido
            };

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // Buscar o pedido criado com todos os relacionamentos
            var pedidoCriado = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .FirstAsync(p => p.Id == pedido.Id);

            var pedidoDto = MapToPedidoDto(pedidoCriado);

            _loggingService.LogApi($"Pedido {numeroPedido} criado com sucesso. Valor total: R$ {valorTotal:F2}");
            return pedidoDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao criar pedido para cliente {clienteId}", ex);
            throw;
        }
    }

    public async Task<PedidoDto?> AtualizarStatusPedidoAsync(int id, AtualizarStatusPedidoDto atualizarDto)
    {
        try
        {
            _loggingService.LogApi($"Atualizando status do pedido {id} para '{atualizarDto.Status}'");

            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                    .ThenInclude(ip => ip.Prato)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                _loggingService.LogApi($"Pedido {id} não encontrado");
                return null;
            }

            var statusAnterior = pedido.Status;
            pedido.Status = atualizarDto.Status;
            
            if (!string.IsNullOrEmpty(atualizarDto.Observacoes))
            {
                pedido.Observacoes = atualizarDto.Observacoes;
            }

            // Se o status for "Entregue", definir data de entrega
            if (atualizarDto.Status == "Entregue" && pedido.DataEntrega == null)
            {
                pedido.DataEntrega = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            var pedidoDto = MapToPedidoDto(pedido);

            _loggingService.LogApi($"Status do pedido {id} atualizado de '{statusAnterior}' para '{atualizarDto.Status}'");
            return pedidoDto;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao atualizar status do pedido {id}", ex);
            throw;
        }
    }

    public async Task<bool> CancelarPedidoAsync(int id)
    {
        try
        {
            _loggingService.LogApi($"Cancelando pedido {id}");

            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                _loggingService.LogApi($"Pedido {id} não encontrado");
                return false;
            }

            if (pedido.Status == "Entregue")
            {
                throw new InvalidOperationException("Não é possível cancelar um pedido já entregue");
            }

            pedido.Status = "Cancelado";
            await _context.SaveChangesAsync();

            _loggingService.LogApi($"Pedido {id} cancelado com sucesso");
            return true;
        }
        catch (Exception ex)
        {
            _loggingService.LogError($"Erro ao cancelar pedido {id}", ex);
            throw;
        }
    }

    public async Task<PedidoEstatisticasDto> GetEstatisticasPedidosAsync()
    {
        try
        {
            _loggingService.LogApi("Buscando estatísticas dos pedidos");

            var pedidos = await _context.Pedidos.ToListAsync();

            var estatisticas = new PedidoEstatisticasDto
            {
                TotalPedidos = pedidos.Count,
                PedidosPendentes = pedidos.Count(p => p.Status == "Pendente"),
                PedidosPreparando = pedidos.Count(p => p.Status == "Preparando"),
                PedidosEntregues = pedidos.Count(p => p.Status == "Entregue"),
                PedidosCancelados = pedidos.Count(p => p.Status == "Cancelado"),
                ValorTotalVendas = pedidos.Where(p => p.Status == "Entregue").Sum(p => p.ValorTotal),
                TicketMedio = pedidos.Where(p => p.Status == "Entregue").Any() 
                    ? pedidos.Where(p => p.Status == "Entregue").Average(p => p.ValorTotal) 
                    : 0
            };

            // Contagem por status
            var statusGroups = pedidos.GroupBy(p => p.Status)
                .Select(g => new StatusCountDto
                {
                    Status = g.Key,
                    Count = g.Count(),
                    Percentual = estatisticas.TotalPedidos > 0 ? (decimal)g.Count() / estatisticas.TotalPedidos * 100 : 0
                })
                .OrderByDescending(s => s.Count)
                .ToList();

            estatisticas.StatusCounts = statusGroups;

            // Pedidos recentes
            var pedidosRecentes = await _context.Pedidos
                .Include(p => p.Cliente)
                .OrderByDescending(p => p.DataPedido)
                .Take(10)
                .Select(p => new PedidoResumoDto
                {
                    Id = p.Id,
                    NumeroPedido = p.NumeroPedido,
                    DataPedido = p.DataPedido,
                    ValorTotal = p.ValorTotal,
                    Status = p.Status,
                    ClienteNome = p.Cliente.Nome,
                    TotalItens = p.ItensPedido.Sum(ip => ip.Quantidade)
                })
                .ToListAsync();

            estatisticas.PedidosRecentes = pedidosRecentes;

            _loggingService.LogApi($"Estatísticas calculadas: {estatisticas.TotalPedidos} pedidos total");
            return estatisticas;
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao calcular estatísticas dos pedidos", ex);
            throw;
        }
    }

    public async Task<IEnumerable<PedidoResumoDto>> GetPedidosRecentesAsync(int quantidade = 10)
    {
        try
        {
            _loggingService.LogApi($"Buscando {quantidade} pedidos recentes");

            var pedidosRecentes = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.ItensPedido)
                .OrderByDescending(p => p.DataPedido)
                .Take(quantidade)
                .Select(p => new PedidoResumoDto
                {
                    Id = p.Id,
                    NumeroPedido = p.NumeroPedido,
                    DataPedido = p.DataPedido,
                    ValorTotal = p.ValorTotal,
                    Status = p.Status,
                    ClienteNome = p.Cliente.Nome,
                    TotalItens = p.ItensPedido.Sum(ip => ip.Quantidade)
                })
                .ToListAsync();

            _loggingService.LogApi($"Encontrados {pedidosRecentes.Count} pedidos recentes");
            return pedidosRecentes;
        }
        catch (Exception ex)
        {
            _loggingService.LogError("Erro ao buscar pedidos recentes", ex);
            throw;
        }
    }

    private async Task<string> GerarNumeroPedidoAsync()
    {
        var dataAtual = DateTime.Now;
        var prefixo = $"PED{dataAtual:yyyyMMdd}";
        
        var ultimoPedido = await _context.Pedidos
            .Where(p => p.NumeroPedido.StartsWith(prefixo))
            .OrderByDescending(p => p.NumeroPedido)
            .FirstOrDefaultAsync();

        int proximoNumero = 1;
        if (ultimoPedido != null)
        {
            var ultimoNumero = ultimoPedido.NumeroPedido.Substring(prefixo.Length);
            if (int.TryParse(ultimoNumero, out int numero))
            {
                proximoNumero = numero + 1;
            }
        }

        return $"{prefixo}{proximoNumero:D4}";
    }

    private static PedidoDto MapToPedidoDto(Pedido pedido)
    {
        return new PedidoDto
        {
            Id = pedido.Id,
            NumeroPedido = pedido.NumeroPedido,
            DataPedido = pedido.DataPedido,
            DataEntrega = pedido.DataEntrega,
            ValorTotal = pedido.ValorTotal,
            Status = pedido.Status,
            Observacoes = pedido.Observacoes,
            EnderecoEntrega = pedido.EnderecoEntrega,
            FormaPagamento = pedido.FormaPagamento,
            ClienteId = pedido.ClienteId,
            ClienteNome = pedido.Cliente.Nome,
            ClienteEmail = pedido.Cliente.Email,
            ClienteTelefone = pedido.Cliente.Telefone,
            Itens = pedido.ItensPedido.Select(ip => new ItemPedidoDto
            {
                Id = ip.Id,
                Quantidade = ip.Quantidade,
                PrecoUnitario = ip.PrecoUnitario,
                Observacoes = ip.Observacoes,
                PratoId = ip.PratoId,
                PratoNome = ip.Prato.Nome,
                PratoImagemUrl = ip.Prato.ImagemUrl
            }).ToList()
        };
    }
}
