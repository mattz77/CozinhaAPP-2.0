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
  CarrinhoStatsDto
} from '../types';
import { API_CONFIG } from '../constants/api';

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
