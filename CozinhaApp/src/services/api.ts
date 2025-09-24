import { 
  Categoria, 
  Prato, 
  Cliente, 
  Pedido, 
  CreateCategoriaDto, 
  CreatePratoDto, 
  CreateClienteDto, 
  CreatePedidoDto,
  CarrinhoResponseDto,
  ItemCarrinhoResponseDto,
  AddItemCarrinhoDto,
  UpdateItemCarrinhoDto,
  CarrinhoStatsDto,
  CreateAgendamentoDto,
  UpdateAgendamentoDto,
  AgendamentoResponseDto,
  AgendamentoStatsDto,
  DashboardStatsDto,
  SalesChartDto,
  TopPratoDto,
  CategoriaDetailStatsDto,
  PerformanceReportDto
} from '../types';
import { API_CONFIG } from '../constants/api';

// Novos tipos para os endpoints adicionados
export interface DashboardStatsDto {
  TotalPratos: number;
  PratosDisponiveis: number;
  TotalCategorias: number;
  TotalPedidos: number;
  TotalAgendamentos: number;
  TotalCarrinhos: number;
  ValorTotalVendas: number;
  ValorMedioPedido: number;
  ValorTotalAgendamentos: number;
  PedidosPendentes: number;
  PedidosConfirmados: number;
  PedidosPreparando: number;
  PedidosEntregues: number;
  PedidosCancelados: number;
  AgendamentosPendentes: number;
  AgendamentosConfirmados: number;
  AgendamentosPreparando: number;
  AgendamentosProntos: number;
  AgendamentosEntregues: number;
  AgendamentosCancelados: number;
  VendasHoje: number;
  VendasEstaSemana: number;
  VendasEsteMes: number;
}

export interface SearchResultDto<T> {
  Items: T[];
  TotalCount: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
  HasNextPage: boolean;
  HasPreviousPage: boolean;
}

export interface SearchSuggestionsDto {
  Pratos: string[];
  Categorias: string[];
  Tipos: string[];
}

export interface AppSettingsDto {
  NomeRestaurante: string;
  TelefoneContato: string;
  EmailContato: string;
  EnderecoRestaurante: string;
  HorarioFuncionamento: string;
  TempoEntregaEstimado: number;
  TaxaEntrega: number;
  ValorMinimoPedido: number;
  FormasPagamento: string[];
  CategoriasDisponiveis: string[];
  TiposDisponiveis: string[];
  TempoPreparoMaximo: number;
  PrecoMinimo: number;
  PrecoMaximo: number;
}

export interface SystemInfoDto {
  Nome: string;
  Versao: string;
  Ambiente: string;
  DataHoraServidor: string;
  TimeZone: string;
  DotNetVersion: string;
  OsVersion: string;
  MachineName: string;
  ProcessadorCount: number;
  WorkingSet: number;
  Uptime: number;
}

export interface HealthCheckDto {
  Status: string;
  Timestamp: string;
  Database: boolean;
  Memory: {
    WorkingSet: number;
    PrivateMemory: number;
    VirtualMemory: number;
    PeakWorkingSet: number;
    PeakVirtualMemory: number;
  };
  Disk: {
    TotalSize: number;
    FreeSpace: number;
    UsedSpace: number;
    DriveName: string;
  };
  Services: Record<string, string>;
}

const API_BASE_URL = API_CONFIG.BASE_URL;

// Serviço para Categorias
export const categoriasService = {
  async getAll(token?: string): Promise<Categoria[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }
    return response.json();
  },

  async getById(id: number): Promise<Categoria> {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar categoria');
    }
    return response.json();
  },

  async create(categoria: CreateCategoriaDto): Promise<Categoria> {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar categoria');
    }
    return response.json();
  },

  async update(id: number, categoria: CreateCategoriaDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar categoria');
    }
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar categoria');
    }
  },

  // Novos métodos utilizando os novos endpoints
  async getPratosPorCategoria(id: number): Promise<Prato[]> {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}/pratos`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos da categoria');
    }
    return response.json();
  },

  async getStats(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/categorias/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas de categorias');
    }
    return response.json();
  },
};

// Serviço para Pratos
export const pratosService = {
  async getAll(token?: string): Promise<Prato[]> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/pratos/with-categories`, {
        headers,
      });
      if (!response.ok) {
        console.error('Erro na API de pratos:', response.status, response.statusText);
        throw new Error(`Erro ao buscar pratos: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Erro ao buscar pratos:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Prato> {
    const response = await fetch(`${API_BASE_URL}/pratos/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar prato');
    }
    return response.json();
  },

  async getByCategoria(categoriaId: number): Promise<Prato[]> {
    const response = await fetch(`${API_BASE_URL}/pratos/categoria/${categoriaId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos por categoria');
    }
    return response.json();
  },

  async create(prato: CreatePratoDto): Promise<Prato> {
    const response = await fetch(`${API_BASE_URL}/pratos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prato),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar prato');
    }
    return response.json();
  },

  async update(id: number, prato: CreatePratoDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pratos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prato),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar prato');
    }
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pratos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar prato');
    }
  },

  // Novos métodos utilizando os novos endpoints
  async search(params: {
    q?: string;
    categoriaId?: number;
    precoMin?: number;
    precoMax?: number;
    tipo?: string;
    limit?: number;
  }): Promise<Prato[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/pratos/search?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos');
    }
    return response.json();
  },

  async getRecent(limit: number = 10): Promise<Prato[]> {
    const response = await fetch(`${API_BASE_URL}/pratos/recent?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos recentes');
    }
    return response.json();
  },

  async getFeatured(limit: number = 6): Promise<Prato[]> {
    const response = await fetch(`${API_BASE_URL}/pratos/featured?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos em destaque');
    }
    return response.json();
  },

  async getTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/pratos/types`);
    if (!response.ok) {
      throw new Error('Erro ao buscar tipos de pratos');
    }
    return response.json();
  },
};

// Serviço para Pedidos
export const pedidosService = {
  async getAll(): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }
    return response.json();
  },

  async getById(id: number): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedido');
    }
    return response.json();
  },

  async getByCliente(clienteId: number): Promise<Pedido[]> {
    const response = await fetch(`${API_BASE_URL}/pedidos/cliente/${clienteId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos por cliente');
    }
    return response.json();
  },

  async create(pedido: CreatePedidoDto): Promise<Pedido> {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar pedido');
    }
    return response.json();
  },

  async updateStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar status do pedido');
    }
  },
};

// Serviço para Clientes
export const clientesService = {
  async create(cliente: CreateClienteDto): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar cliente');
    }
    return response.json();
  },
};

// Serviço para Carrinho
export const carrinhoService = {
  async getCarrinho(token: string): Promise<CarrinhoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/carrinho`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar carrinho');
    }
    return response.json();
  },

  async adicionarItem(data: AddItemCarrinhoDto, token: string): Promise<ItemCarrinhoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/carrinho/item`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erro ao adicionar item ao carrinho');
    }
    return response.json();
  },

  async atualizarItem(itemId: number, data: UpdateItemCarrinhoDto, token: string): Promise<ItemCarrinhoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/carrinho/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar item do carrinho');
    }
    return response.json();
  },

  async removerItem(itemId: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/carrinho/item/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao remover item do carrinho');
    }
  },

  async limparCarrinho(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/carrinho`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao limpar carrinho');
    }
  },

  async getStats(token: string): Promise<CarrinhoStatsDto> {
    const response = await fetch(`${API_BASE_URL}/carrinho/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas do carrinho');
    }
    return response.json();
  },
};

// Serviço para Agendamentos
export const agendamentosService = {
  async getAgendamentos(token: string): Promise<AgendamentoResponseDto[]> {
    const response = await fetch(`${API_BASE_URL}/agendamentos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar agendamentos');
    }
    return response.json();
  },

  async getAgendamento(id: number, token: string): Promise<AgendamentoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar agendamento');
    }
    return response.json();
  },

  async createAgendamento(agendamento: CreateAgendamentoDto, token: string): Promise<AgendamentoResponseDto> {
    const response = await fetch(`${API_BASE_URL}/agendamentos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamento),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar agendamento');
    }
    return response.json();
  },

  async updateAgendamento(id: number, agendamento: UpdateAgendamentoDto, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamento),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar agendamento');
    }
  },

  async cancelAgendamento(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/agendamentos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao cancelar agendamento');
    }
  },

  async getStats(token: string): Promise<AgendamentoStatsDto> {
    const response = await fetch(`${API_BASE_URL}/agendamentos/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas de agendamentos');
    }
    return response.json();
  },
};

// Serviço para Dashboard
export const dashboardService = {
  async getStats(token: string): Promise<DashboardStatsDto> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas do dashboard');
    }
    const data = await response.json();
    
    // Debug: Log dos dados brutos da API
    console.log('🔍 API Response Raw Data:', data);
    console.log('🔍 API Response Keys:', Object.keys(data));
    console.log('🔍 API Response - totalPratos:', data.totalPratos);
    console.log('🔍 API Response - totalPedidos:', data.totalPedidos);
    console.log('🔍 API Response - vendasHoje:', data.vendasHoje);
    
    // Os dados já estão em camelCase, não precisamos mapear!
    // A API está retornando dados em camelCase, não PascalCase
    const mappedData = {
      totalPratos: data.totalPratos,
      pratosDisponiveis: data.pratosDisponiveis,
      totalCategorias: data.totalCategorias,
      totalPedidos: data.totalPedidos,
      totalAgendamentos: data.totalAgendamentos,
      totalCarrinhos: data.totalCarrinhos,
      valorTotalVendas: data.valorTotalVendas,
      valorMedioPedido: data.valorMedioPedido,
      valorTotalAgendamentos: data.valorTotalAgendamentos,
      pedidosPendentes: data.pedidosPendentes,
      pedidosConfirmados: data.pedidosConfirmados,
      pedidosPreparando: data.pedidosPreparando,
      pedidosEntregues: data.pedidosEntregues,
      pedidosCancelados: data.pedidosCancelados,
      agendamentosPendentes: data.agendamentosPendentes,
      agendamentosConfirmados: data.agendamentosConfirmados,
      agendamentosPreparando: data.agendamentosPreparando,
      agendamentosProntos: data.agendamentosProntos,
      agendamentosEntregues: data.agendamentosEntregues,
      agendamentosCancelados: data.agendamentosCancelados,
      vendasHoje: data.vendasHoje,
      vendasEstaSemana: data.vendasEstaSemana,
      vendasEsteMes: data.vendasEsteMes,
    };
    
    // Debug: Log dos dados mapeados
    console.log('🔍 Mapped Data:', mappedData);
    console.log('🔍 Mapped Data - totalPratos:', mappedData.totalPratos);
    console.log('🔍 Mapped Data - totalPedidos:', mappedData.totalPedidos);
    console.log('🔍 Mapped Data - vendasHoje:', mappedData.vendasHoje);
    
    return mappedData;
  },

  async getSalesChart(token: string, days: number = 30): Promise<SalesChartDto> {
    const response = await fetch(`${API_BASE_URL}/dashboard/sales-chart?days=${days}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do gráfico de vendas');
    }
    return response.json();
  },

  async getTopPratos(token: string, limit: number = 10): Promise<TopPratoDto[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/top-pratos?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos mais vendidos');
    }
    return response.json();
  },

  async getCategoriasStats(token: string): Promise<CategoriaDetailStatsDto[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/categorias-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas de categorias');
    }
    return response.json();
  },

  async getPerformanceReport(token: string, startDate?: string, endDate?: string): Promise<PerformanceReportDto> {
    let url = `${API_BASE_URL}/dashboard/performance`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar relatório de performance');
    }
    return response.json();
  },
};

// Serviço para Busca
export const searchService = {
  async searchPratos(params: {
    q?: string;
    categoriaId?: number;
    precoMin?: number;
    precoMax?: number;
    tempoPreparoMax?: number;
    tipo?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<SearchResultDto<Prato>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/search/pratos?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar pratos');
    }
    return response.json();
  },

  async searchCategorias(q?: string): Promise<Categoria[]> {
    let url = `${API_BASE_URL}/search/categorias`;
    if (q) url += `?q=${encodeURIComponent(q)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias');
    }
    return response.json();
  },

  async getSuggestions(q?: string, limit: number = 10): Promise<SearchSuggestionsDto> {
    let url = `${API_BASE_URL}/search/suggestions?limit=${limit}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar sugestões');
    }
    return response.json();
  },

  async getFilters(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/search/filters`);
    if (!response.ok) {
      throw new Error('Erro ao buscar filtros');
    }
    return response.json();
  },
};

// Serviço para Configurações
export const configService = {
  async getSystemInfo(): Promise<SystemInfoDto> {
    const response = await fetch(`${API_BASE_URL}/config/system-info`);
    if (!response.ok) {
      throw new Error('Erro ao buscar informações do sistema');
    }
    return response.json();
  },

  async getAppSettings(): Promise<AppSettingsDto> {
    const response = await fetch(`${API_BASE_URL}/config/app-settings`);
    if (!response.ok) {
      throw new Error('Erro ao buscar configurações da aplicação');
    }
    return response.json();
  },

  async getHealthCheck(): Promise<HealthCheckDto> {
    const response = await fetch(`${API_BASE_URL}/config/health`);
    if (!response.ok) {
      throw new Error('Erro ao verificar saúde do sistema');
    }
    return response.json();
  },

  async getEndpoints(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/config/endpoints`);
    if (!response.ok) {
      throw new Error('Erro ao buscar endpoints disponíveis');
    }
    return response.json();
  },
};
