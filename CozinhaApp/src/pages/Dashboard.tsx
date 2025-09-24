import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useSalesChart, useTopPratos } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SkeletonCard, SkeletonList } from '@/components/ui/Skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock,
  Calendar,
  Package,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [chartDays, setChartDays] = useState(30);
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesChart, isLoading: chartLoading } = useSalesChart(chartDays);
  const { data: topPratos, isLoading: topPratosLoading } = useTopPratos(10);

  // Debug: Log dos dados dos pratos populares
  console.log('🔍 Dashboard - topPratos:', topPratos);
  console.log('🔍 Dashboard - topPratosLoading:', topPratosLoading);
  console.log('🔍 Dashboard - topPratos type:', typeof topPratos);
  if (topPratos) {
    console.log('🔍 Dashboard - topPratos length:', topPratos.length);
    console.log('🔍 Dashboard - topPratos keys:', Object.keys(topPratos));
    console.log('🔍 Dashboard - topPratos primeiro item:', topPratos[0]);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar o dashboard.
            </p>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['#F5C442', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.nomeCompleto}! Aqui está um resumo do seu negócio.
          </p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(stats?.valorTotalVendas || 0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs mês anterior
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatNumber(stats?.totalPedidos || 0)}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs mês anterior
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pratos Disponíveis</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatNumber(stats?.pratosDisponiveis || 0)}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {stats?.totalPratos || 0} total
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(stats?.valorMedioPedido || 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Tempo médio: 25min
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Charts Section */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="top-dishes">Pratos Populares</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vendas por Período</CardTitle>
                  <div className="flex space-x-2">
                    {[7, 30, 90].map((days) => (
                      <Button
                        key={days}
                        variant={chartDays === days ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartDays(days)}
                      >
                        {days} dias
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {chartLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Carregando dados de vendas..." />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesChart?.vendasPorDia || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="data" 
                        tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
                      />
                      <YAxis tickFormatter={(value) => `R$ ${value}`} />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                        formatter={(value: number) => [formatCurrency(value), 'Vendas']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vendas" 
                        stroke="#F5C442" 
                        strokeWidth={3}
                        dot={{ fill: '#F5C442', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-dishes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pratos Mais Vendidos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ranking dos pratos mais pedidos pelos clientes
                </p>
              </CardHeader>
              <CardContent>
                {topPratosLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Carregando pratos populares..." />
                  </div>
                ) : topPratos && topPratos.length > 0 ? (
                  <div className="space-y-4">
                    {topPratos.map((prato, index) => (
                      <motion.div
                        key={prato.pratoId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {prato.nome}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {prato.categoriaNome}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                              {prato.quantidadeVendida}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              unidades
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                              {formatCurrency(prato.valorTotalVendido)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              faturamento
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                              {prato.numeroVendas} pedidos
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(prato.preco)} cada
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum prato encontrado</p>
                    <p className="text-sm">Os dados de vendas ainda não estão disponíveis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Carregando status dos pedidos..." />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pendentes', value: stats?.pedidosPendentes || 0 },
                            { name: 'Confirmados', value: stats?.pedidosConfirmados || 0 },
                            { name: 'Preparando', value: stats?.pedidosPreparando || 0 },
                            { name: 'Entregues', value: stats?.pedidosEntregues || 0 },
                            { name: 'Cancelados', value: stats?.pedidosCancelados || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1, 2, 3, 4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">Vendas Hoje</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(stats?.vendasHoje || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm">Esta Semana</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(stats?.vendasEstaSemana || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">Este Mês</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(stats?.vendasEsteMes || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
