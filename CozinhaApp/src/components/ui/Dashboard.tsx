import { useDashboardStats, useSalesChart, useTopPratos } from '@/hooks/useApi';
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
  const [chartPeriod, setChartPeriod] = useState(30);
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesChart, isLoading: chartLoading } = useSalesChart(chartPeriod);
  const { data: topPratos, isLoading: topPratosLoading } = useTopPratos(5);

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
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">Não foi possível carregar as estatísticas do dashboard.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Pratos",
      value: stats.totalPratos,
      change: `${stats.pratosDisponiveis} disponíveis`,
      icon: ChefHat,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total de Categorias",
      value: stats.totalCategorias,
      change: "Ativas no sistema",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pedidos Hoje",
      value: stats.pedidosPendentes + stats.pedidosConfirmados + stats.pedidosPreparando + stats.pedidosEntregues,
      change: `${stats.pedidosEntregues} entregues`,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Agendamentos",
      value: stats.totalAgendamentos,
      change: `${stats.agendamentosPendentes} pendentes`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Vendas Hoje",
      value: `R$ ${stats.vendasHoje.toFixed(2)}`,
      change: `Média: R$ ${stats.valorMedioPedido.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Vendas Esta Semana",
      value: `R$ ${stats.vendasEstaSemana.toFixed(2)}`,
      change: `Crescimento semanal`,
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Vendas Este Mês",
      value: `R$ ${stats.vendasEsteMes.toFixed(2)}`,
      change: `Total acumulado`,
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Total de Carrinhos",
      value: stats.totalCarrinhos,
      change: "Ativos no sistema",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  const statusStats = [
    {
      title: "Status dos Pedidos",
      data: [
        { label: "Pendentes", value: stats.pedidosPendentes, color: "bg-yellow-500" },
        { label: "Confirmados", value: stats.pedidosConfirmados, color: "bg-blue-500" },
        { label: "Preparando", value: stats.pedidosPreparando, color: "bg-orange-500" },
        { label: "Entregues", value: stats.pedidosEntregues, color: "bg-green-500" },
        { label: "Cancelados", value: stats.pedidosCancelados, color: "bg-red-500" },
      ],
    },
    {
      title: "Status dos Agendamentos",
      data: [
        { label: "Pendentes", value: stats.agendamentosPendentes, color: "bg-yellow-500" },
        { label: "Confirmados", value: stats.agendamentosConfirmados, color: "bg-blue-500" },
        { label: "Preparando", value: stats.agendamentosPreparando, color: "bg-orange-500" },
        { label: "Prontos", value: stats.agendamentosProntos, color: "bg-purple-500" },
        { label: "Entregues", value: stats.agendamentosEntregues, color: "bg-green-500" },
        { label: "Cancelados", value: stats.agendamentosCancelados, color: "bg-red-500" },
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
        {statCards.map((stat, index) => (
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
                      {stat.value}
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
        ))}
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
                {topPratos.map((prato: any, index: number) => (
                  <motion.div
                    key={prato.PratoId}
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
                      <p className="text-sm font-medium truncate">{prato.Nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {prato.QuantidadeVendida} vendas • R$ {prato.ValorTotalVendido.toFixed(2)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {prato.CategoriaNome}
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






