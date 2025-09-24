import { useDashboardStats, useSalesChart, useTopPratos } from '@/hooks/useApi';
import { TopPratoDto } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Star,
  ChefHat,
  Calendar,
  Package,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  SalesChart,
  OrdersChart,
  StatusPieChart,
  TrendLineChart,
  ComparisonChart,
  RealTimeMetrics
} from './Charts';

interface DashboardProps {
  className?: string;
}

export const Dashboard = ({ className }: DashboardProps) => {
  console.log('🔍 Dashboard: Componente Dashboard iniciado!');
  
  const [chartPeriod, setChartPeriod] = useState(30);
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesChart, isLoading: chartLoading } = useSalesChart(chartPeriod);
  const { data: topPratos, isLoading: topPratosLoading } = useTopPratos(5);

  // Debug: Log dos dados recebidos
  console.log('🔍 Dashboard - stats:', stats);
  console.log('🔍 Dashboard - statsLoading:', statsLoading);
  console.log('🔍 Dashboard - stats type:', typeof stats);
  if (stats) {
    console.log('🔍 Dashboard - stats keys:', Object.keys(stats));
    console.log('🔍 Dashboard - totalPratos:', stats.totalPratos);
    console.log('🔍 Dashboard - totalPedidos:', stats.totalPedidos);
    console.log('🔍 Dashboard - vendasHoje:', stats.vendasHoje);
    console.log('🔍 Dashboard - stats completo:', JSON.stringify(stats, null, 2));
  
    // Debug: Verificar se os dados estão sendo usados nos cards
    console.log('🔍 Dashboard - Verificando dados para cards:');
    console.log('🔍 Dashboard - totalPratos para card:', stats.totalPratos);
    console.log('🔍 Dashboard - totalPedidos para card:', stats.totalPedidos);
    console.log('🔍 Dashboard - vendasHoje para card:', stats.vendasHoje);
  }


  if (statsLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Não foi possível carregar as estatísticas do dashboard.</p>
        </div>
      </div>
    );
  }


  // Debug: Verificar se os dados estão sendo processados nos cards
  console.log('🔍 Dashboard - Processando cards com stats:', {
    totalPratos: stats.totalPratos,
    totalPedidos: stats.totalPedidos,
    vendasHoje: stats.vendasHoje
  });
  
  // Debug: Verificar se os dados estão sendo processados corretamente
  console.log('🔍 Dashboard - Verificando valores dos cards:');
  console.log('🔍 Dashboard - Card 1 - Total de Pratos:', stats.totalPratos || 0);
  console.log('🔍 Dashboard - Card 2 - Total de Pedidos:', stats.totalPedidos || 0);
  console.log('🔍 Dashboard - Card 3 - Vendas Hoje:', stats.vendasHoje || 0);
  
  // Debug: Verificar se os dados estão sendo processados nos cards
  console.log('🔍 Dashboard - Verificando valores dos cards:');
  console.log('🔍 Dashboard - Card 1 - Total de Pratos:', stats.totalPratos || 0);
  console.log('🔍 Dashboard - Card 2 - Total de Pedidos:', stats.totalPedidos || 0);
  console.log('🔍 Dashboard - Card 3 - Vendas Hoje:', stats.vendasHoje || 0);

  // Debug: Verificar se os dados estão sendo processados nos cards
  console.log('🔍 Dashboard - Verificando valores dos cards:');
  console.log('🔍 Dashboard - Card 1 - Total de Pratos:', stats.totalPratos || 0);
  console.log('🔍 Dashboard - Card 2 - Total de Pedidos:', stats.totalPedidos || 0);
  console.log('🔍 Dashboard - Card 3 - Vendas Hoje:', stats.vendasHoje || 0);

  // Debug: Verificar se os dados estão sendo processados nos cards
  console.log('🔍 Dashboard - Processando cards com stats:', {
    totalPratos: stats.totalPratos,
    totalPedidos: stats.totalPedidos,
    vendasHoje: stats.vendasHoje
  });
  
  // Debug: Verificar se os dados estão sendo processados corretamente
  console.log('🔍 Dashboard - Verificando valores dos cards:');
  console.log('🔍 Dashboard - Card 1 - Total de Pratos:', stats.totalPratos || 0);
  console.log('🔍 Dashboard - Card 2 - Total de Pedidos:', stats.totalPedidos || 0);
  console.log('🔍 Dashboard - Card 3 - Vendas Hoje:', stats.vendasHoje || 0);

  const statCards = [
    {
      title: "Total de Pratos",
      value: stats.totalPratos || 0,
      change: `${stats.pratosDisponiveis || 0} disponíveis`,
      icon: ChefHat,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Categorias",
      value: stats.totalCategorias || 0,
      change: "Ativas no sistema",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pedidos Hoje",
      value: (stats.pedidosPendentes || 0) + (stats.pedidosConfirmados || 0) + (stats.pedidosPreparando || 0) + (stats.pedidosEntregues || 0),
      change: `${stats.pedidosEntregues || 0} entregues`,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Agendamentos",
      value: stats.totalAgendamentos || 0,
      change: `${stats.agendamentosPendentes || 0} pendentes`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Vendas Hoje",
      value: `R$ ${(stats.vendasHoje || 0).toFixed(2)}`,
      change: `Média: R$ ${(stats.valorMedioPedido || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Vendas Esta Semana",
      value: `R$ ${(stats.vendasEstaSemana || 0).toFixed(2)}`,
      change: `Crescimento semanal`,
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Vendas Este Mês",
      value: `R$ ${(stats.vendasEsteMes || 0).toFixed(2)}`,
      change: `Total acumulado`,
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Total de Carrinhos",
      value: stats.totalCarrinhos || 0,
      change: "Ativos no sistema",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  // Debug: Verificar se os cards estão sendo criados corretamente
  console.log('🔍 Dashboard - Cards criados:', statCards);
  console.log('🔍 Dashboard - Card 1 (Total de Pratos):', statCards[0]);
  console.log('🔍 Dashboard - Card 2 (Total de Categorias):', statCards[1]);
  console.log('🔍 Dashboard - Card 3 (Pedidos Hoje):', statCards[2]);
  console.log('🔍 Dashboard - Card 4 (Agendamentos):', statCards[3]);
  console.log('🔍 Dashboard - Card 5 (Vendas Hoje):', statCards[4]);
  console.log('🔍 Dashboard - Card 6 (Vendas Esta Semana):', statCards[5]);
  console.log('🔍 Dashboard - Card 7 (Vendas Este Mês):', statCards[6]);
  console.log('🔍 Dashboard - Card 8 (Total de Carrinhos):', statCards[7]);

  // Debug: Verificar se os dados estão sendo processados nos statusStats
  console.log('🔍 Dashboard - Processando statusStats com stats:', {
    pedidosPendentes: stats.pedidosPendentes,
    pedidosConfirmados: stats.pedidosConfirmados,
    pedidosEntregues: stats.pedidosEntregues
  });

  const statusStats = [
    {
      title: "Status dos Pedidos",
      data: [
        { label: "Pendentes", value: stats.pedidosPendentes || 0, color: "bg-yellow-500" },
        { label: "Confirmados", value: stats.pedidosConfirmados || 0, color: "bg-blue-500" },
        { label: "Preparando", value: stats.pedidosPreparando || 0, color: "bg-orange-500" },
        { label: "Entregues", value: stats.pedidosEntregues || 0, color: "bg-green-500" },
        { label: "Cancelados", value: stats.pedidosCancelados || 0, color: "bg-red-500" },
      ],
    },
    {
      title: "Status dos Agendamentos",
      data: [
        { label: "Pendentes", value: stats.agendamentosPendentes || 0, color: "bg-yellow-500" },
        { label: "Confirmados", value: stats.agendamentosConfirmados || 0, color: "bg-blue-500" },
        { label: "Preparando", value: stats.agendamentosPreparando || 0, color: "bg-orange-500" },
        { label: "Prontos", value: stats.agendamentosProntos || 0, color: "bg-purple-500" },
        { label: "Entregues", value: stats.agendamentosEntregues || 0, color: "bg-green-500" },
        { label: "Cancelados", value: stats.agendamentosCancelados || 0, color: "bg-red-500" },
      ],
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Título do Dashboard */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-primary mb-2">
          Dashboard do Sistema
        </h2>
        <p className="text-muted-foreground">
          Visão geral das estatísticas e métricas do CozinhaApp
        </p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          // Debug: Log de cada card sendo renderizado
          console.log(`🔍 Dashboard - Renderizando Card ${index + 1}:`, {
            title: stat.title,
            value: stat.value,
            change: stat.change
          });
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {(() => {
                          console.log(`🔍 Dashboard - Renderizando valor do card "${stat.title}":`, stat.value);
                          return stat.value;
                        })()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Gráfico de Vendas e Top Pratos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={chartPeriod === days ? "default" : "outline"}
                size="sm"
                onClick={() => setChartPeriod(days)}
              >
                {days} dias
              </Button>
            ))}
          </div>
          {chartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : salesChart ? (
            <SalesChart data={salesChart.vendasPorDia} />
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Nenhum dado de vendas disponível
            </div>
          )}
        </div>

        {/* Top Pratos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Pratos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPratosLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="h-10 w-10 bg-muted rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-1"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topPratos && topPratos.length > 0 ? (
              <div className="space-y-3">
                {topPratos.map((prato: TopPratoDto, index: number) => (
                  <motion.div
                    key={prato.pratoId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{prato.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {prato.quantidadeVendida} vendas • R$ {prato.valorTotalVendido.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {prato.categoriaNome}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum dado de vendas disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statusStats.map((statusGroup, groupIndex) => (
          <Card key={statusGroup.title}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                {statusGroup.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statusGroup.data.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (groupIndex * 0.1) + (index * 0.05) }}
                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <Badge variant="secondary">{item.value}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção de Gráficos Avançados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Status dos Pedidos */}
        <StatusPieChart 
          data={statusStats[0].data}
          title="Status dos Pedidos"
        />

        {/* Gráfico de Status dos Agendamentos */}
        <StatusPieChart 
          data={statusStats[1].data}
          title="Status dos Agendamentos"
        />
      </div>

      {/* Métricas em Tempo Real */}
      <RealTimeMetrics 
        vendasHoje={stats.vendasHoje}
        vendasOntem={stats.vendasHoje * 0.8} // Simulado - em produção viria da API
        pedidosHoje={stats.pedidosPendentes + stats.pedidosConfirmados + stats.pedidosPreparando + stats.pedidosEntregues}
        pedidosOntem={Math.floor((stats.pedidosPendentes + stats.pedidosConfirmados + stats.pedidosPreparando + stats.pedidosEntregues) * 0.9)}
        className="mt-6"
      />

      {/* Gráfico de Tendências */}
      {salesChart && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TrendLineChart data={salesChart.vendasPorDia} />
          <OrdersChart data={salesChart.vendasPorDia} />
        </div>
      )}
    </div>
  );
};






