export interface Pedido {
  id: number;
  numeroPedido: string;
  dataPedido: string;
  dataEntrega?: string;
  valorTotal: number;
  status: string;
  observacoes?: string;
  enderecoEntrega?: string;
  formaPagamento?: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  observacoes?: string;
  pratoId: number;
  pratoNome: string;
  pratoImagemUrl?: string;
}

export interface CriarPedidoRequest {
  enderecoEntrega: string;
  formaPagamento: string;
  observacoes?: string;
  itens: ItemPedidoCriacao[];
}

export interface ItemPedidoCriacao {
  pratoId: number;
  quantidade: number;
  observacoes?: string;
}

export interface AtualizarStatusPedidoRequest {
  status: string;
  observacoes?: string;
}

export interface PedidoResumo {
  id: number;
  numeroPedido: string;
  dataPedido: string;
  valorTotal: number;
  status: string;
  clienteNome: string;
  totalItens: number;
}

export interface PedidoEstatisticas {
  totalPedidos: number;
  pedidosPendentes: number;
  pedidosPreparando: number;
  pedidosEntregues: number;
  pedidosCancelados: number;
  valorTotalVendas: number;
  ticketMedio: number;
  statusCounts: StatusCount[];
  pedidosRecentes: PedidoResumo[];
}

export interface StatusCount {
  status: string;
  count: number;
  percentual: number;
}

export type StatusPedido = 
  | 'Pendente' 
  | 'Confirmado' 
  | 'Preparando' 
  | 'SaiuParaEntrega' 
  | 'Entregue' 
  | 'Cancelado';

export type FormaPagamento = 
  | 'Dinheiro' 
  | 'Cartão' 
  | 'PIX' 
  | 'Cartão de Débito' 
  | 'Cartão de Crédito';
