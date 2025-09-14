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
