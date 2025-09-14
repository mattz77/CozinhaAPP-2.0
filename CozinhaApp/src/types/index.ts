// Tipos TypeScript para a API
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
  dataCriacao: string;
}

export interface Prato {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  disponivel: boolean;
  tempoPreparo: number;
  tipo?: string;
  dataCriacao: string;
  categoriaId: number;
  categoria?: Categoria;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  dataCriacao: string;
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
  pedidoId: number;
  pratoId: number;
  prato?: Prato;
}

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
  cliente?: Cliente;
  itensPedido: ItemPedido[];
}

// DTOs para criação
export interface CreateCategoriaDto {
  nome: string;
  descricao?: string;
}

export interface CreatePratoDto {
  nome: string;
  descricao?: string;
  preco: number;
  imagemUrl?: string;
  tempoPreparo: number;
  tipo?: string;
  categoriaId: number;
}

export interface CreateClienteDto {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
}

export interface CreateItemPedidoDto {
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
  pratoId: number;
}

export interface CreatePedidoDto {
  observacoes?: string;
  enderecoEntrega?: string;
  formaPagamento?: string;
  clienteId: number;
  itensPedido: CreateItemPedidoDto[];
}

// Tipos para Carrinho
export interface ItemCarrinhoResponseDto {
  id: number;
  pratoId: number;
  pratoNome: string;
  pratoImagemUrl?: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
  observacoes?: string;
  dataAdicao: string;
}

export interface CarrinhoResponseDto {
  id: number;
  userId: string;
  dataCriacao: string;
  dataAtualizacao: string;
  itens: ItemCarrinhoResponseDto[];
  totalItens: number;
  valorTotal: number;
}

export interface AddItemCarrinhoDto {
  pratoId: number;
  quantidade: number;
  observacoes?: string;
}

export interface UpdateItemCarrinhoDto {
  quantidade: number;
  observacoes?: string;
}

export interface CarrinhoStatsDto {
  totalItens: number;
  valorTotal: number;
  quantidadeItensUnicos: number;
  ultimaAtualizacao?: string;
}

// Tipos para Agendamentos
export interface CreateItemAgendamentoDto {
  pratoId: number;
  quantidade: number;
  observacoes?: string;
}

export interface CreateAgendamentoDto {
  dataAgendamento: string;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
  pagamentoAntecipado: boolean;
  metodoPagamento?: string;
  itens: CreateItemAgendamentoDto[];
}

export interface UpdateAgendamentoDto {
  status?: string;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
  metodoPagamento?: string;
}

export interface ItemAgendamentoResponseDto {
  id: number;
  pratoId: number;
  pratoNome: string;
  pratoImagemUrl?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  observacoes?: string;
}

export interface AgendamentoResponseDto {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  dataAgendamento: string;
  status: string;
  valorTotal: number;
  observacoes?: string;
  enderecoEntrega?: string;
  telefoneContato?: string;
  pagamentoAntecipado: boolean;
  metodoPagamento?: string;
  dataPagamento?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  itens: ItemAgendamentoResponseDto[];
}

export interface AgendamentoStatsDto {
  totalAgendamentos: number;
  agendamentosPendentes: number;
  agendamentosConfirmados: number;
  agendamentosPreparando: number;
  agendamentosProntos: number;
  agendamentosEntregues: number;
  agendamentosCancelados: number;
  valorTotalAgendamentos: number;
  valorMedioAgendamento: number;
}