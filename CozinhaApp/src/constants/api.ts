// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? 'http://localhost:5057/api' : 'http://localhost:5057/api',
  ENDPOINTS: {
    CATEGORIAS: '/categorias',
    PRATOS: '/pratos',
    PEDIDOS: '/pedidos',
    CLIENTES: '/clientes',
  },
  TIMEOUT: 10000, // 10 segundos
} as const;

// Status de pedidos
export const PEDIDO_STATUS = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  PREPARANDO: 'Preparando',
  PRONTO: 'Pronto',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
} as const;

// Tipos de pratos
export const PRATO_TIPOS = {
  ENTRADA: 'Entrada',
  PRINCIPAL: 'Prato Principal',
  SOBREMESA: 'Sobremesa',
  BEBIDA: 'Bebida',
} as const;

// Formas de pagamento
export const FORMAS_PAGAMENTO = {
  DINHEIRO: 'Dinheiro',
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito',
  PIX: 'PIX',
} as const;
