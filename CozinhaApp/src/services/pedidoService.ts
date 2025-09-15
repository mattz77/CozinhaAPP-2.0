import { 
  Pedido, 
  CriarPedidoRequest, 
  AtualizarStatusPedidoRequest, 
  PedidoResumo, 
  PedidoEstatisticas 
} from '../types/pedidos';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5057/api';

class PedidoService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = sessionStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/pedidos${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na requisição');
    }

    // No content for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getAllPedidos(): Promise<Pedido[]> {
    return this.makeRequest<Pedido[]>('');
  }

  async getMeusPedidos(): Promise<Pedido[]> {
    return this.makeRequest<Pedido[]>('/meus-pedidos');
  }

  async getPedidosByStatus(status: string): Promise<Pedido[]> {
    return this.makeRequest<Pedido[]>(`/status/${status}`);
  }

  async getPedidoById(id: number): Promise<Pedido> {
    return this.makeRequest<Pedido>(`/${id}`);
  }

  async getPedidoByNumero(numeroPedido: string): Promise<Pedido> {
    return this.makeRequest<Pedido>(`/numero/${numeroPedido}`);
  }

  async criarPedido(pedido: CriarPedidoRequest): Promise<Pedido> {
    return this.makeRequest<Pedido>('', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  }

  async atualizarStatusPedido(id: number, status: AtualizarStatusPedidoRequest): Promise<Pedido> {
    return this.makeRequest<Pedido>(`/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  async cancelarPedido(id: number): Promise<void> {
    return this.makeRequest<void>(`/${id}/cancelar`, {
      method: 'PUT',
    });
  }

  async getEstatisticasPedidos(): Promise<PedidoEstatisticas> {
    return this.makeRequest<PedidoEstatisticas>('/estatisticas');
  }

  async getPedidosRecentes(quantidade: number = 10): Promise<PedidoResumo[]> {
    return this.makeRequest<PedidoResumo[]>(`/recentes?quantidade=${quantidade}`);
  }
}

export const pedidoService = new PedidoService();
