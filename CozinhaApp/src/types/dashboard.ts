// Tipos TypeScript para o Dashboard

export interface DashboardStatsDto {
  // Estatísticas básicas
  totalPratos: number;
  pratosDisponiveis: number;
  totalCategorias: number;
  totalPedidos: number;
  totalAgendamentos: number;
  totalCarrinhos: number;
  
  // Estatísticas financeiras
  valorTotalVendas: number;
  valorMedioPedido: number;
  valorTotalAgendamentos: number;
  
  // Estatísticas de pedidos por status
  pedidosPendentes: number;
  pedidosConfirmados: number;
  pedidosPreparando: number;
  pedidosEntregues: number;
  pedidosCancelados: number;
  
  // Estatísticas de agendamentos por status
  agendamentosPendentes: number;
  agendamentosConfirmados: number;
  agendamentosPreparando: number;
  agendamentosProntos: number;
  agendamentosEntregues: number;
  agendamentosCancelados: number;
  
  // Estatísticas por período
  vendasHoje: number;
  vendasEstaSemana: number;
  vendasEsteMes: number;
}

export interface SalesChartItemDto {
  data: string;
  vendas: number;
  quantidadePedidos: number;
}

export interface SalesChartDto {
  periodo: number;
  vendasPorDia: SalesChartItemDto[];
  agendamentosPorDia: SalesChartItemDto[];
  totalVendas: number;
  totalAgendamentos: number;
  mediaDiariaVendas: number;
  mediaDiariaPedidos: number;
}

export interface TopPratoDto {
  pratoId: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  categoriaNome: string;
  quantidadeVendida: number;
  valorTotalVendido: number;
  numeroVendas: number;
}

export interface CategoriaDetailStatsDto {
  categoriaId: number;
  nome: string;
  descricao?: string;
  totalPratos: number;
  pratosDisponiveis: number;
  pratoMaisCaro: number;
  pratoMaisBarato: number;
  precoMedio: number;
}

export interface PerformanceReportDto {
  periodoInicio: string;
  periodoFim: string;
  totalPedidos: number;
  totalAgendamentos: number;
  vendasTotais: number;
  ticketMedio: number;
  taxaCancelamento: number;
  tempoMedioPreparo: number;
  categoriaMaisVendida?: string;
}
