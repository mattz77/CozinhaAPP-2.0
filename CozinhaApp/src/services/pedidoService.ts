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

    const url = `${API_BASE_URL}/pedidos${endpoint}`;
    console.log('🌐 PedidoService: Fazendo requisição para:', url);
    console.log('🔑 PedidoService: Token presente:', !!token);
    console.log('🔑 PedidoService: Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
    console.log('🌐 PedidoService: Headers:', headers);
    console.log('🌐 PedidoService: Options:', options);
    console.log('📋 PedidoService: Body sendo enviado:', options.body);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📡 PedidoService: Response status:', response.status);
    console.log('📡 PedidoService: Response statusText:', response.statusText);
    console.log('📡 PedidoService: Response ok:', response.ok);
    console.log('📡 PedidoService: Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Erro na requisição';
      
      // Clonar a resposta para poder ler o corpo sem consumir o stream original
      const responseClone = response.clone();
      
      try {
        // Tentar ler como JSON primeiro
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        try {
          // Se não conseguir fazer parse do JSON, tentar como texto do clone
          const errorText = await responseClone.text();
          errorMessage = errorText || errorMessage;
        } catch {
          // Se nem texto conseguir ler, usar mensagem padrão
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
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
    console.log('🛒 PedidoService: Criando pedido:', pedido);
    
    // Converter para o formato esperado pelo backend (PascalCase)
    const pedidoBackend = {
      EnderecoEntrega: pedido.enderecoEntrega,
      FormaPagamento: pedido.formaPagamento,
      Observacoes: pedido.observacoes,
      Itens: pedido.itens.map(item => ({
        PratoId: item.pratoId,
        Quantidade: item.quantidade,
        Observacoes: item.observacoes
      }))
    };
    
    console.log('🛒 PedidoService: Pedido convertido para backend:', pedidoBackend);
    
    return this.makeRequest<Pedido>('', {
      method: 'POST',
      body: JSON.stringify(pedidoBackend),
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
