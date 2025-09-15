import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useSalesChart, useTopPratos } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [chartDays, setChartDays] = useState(30);
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesChart, isLoading: chartLoading } = useSalesChart(chartDays);
  const { data: topPratos, isLoading: topPratosLoading } = useTopPratos(10);

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
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(stats?.ValorTotalVendas || 0)}
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
                      {formatNumber(stats?.TotalPedidos || 0)}
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
                      {formatNumber(stats?.PratosDisponiveis || 0)}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {stats?.TotalPratos || 0} total
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
                      {formatCurrency(stats?.ValorMedioPedido || 0)}
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
          </div>
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesChart?.VendasPorDia || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="Data" 
                        tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
                      />
                      <YAxis tickFormatter={(value) => `R$ ${value}`} />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                        formatter={(value: number) => [formatCurrency(value), 'Vendas']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Vendas" 
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
              </CardHeader>
              <CardContent>
                {topPratosLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topPratos?.slice(0, 8) || []} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="Nome" 
                        type="category" 
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatNumber(value), 'Quantidade Vendida']}
                      />
                      <Bar dataKey="QuantidadeVendida" fill="#F5C442" />
                    </BarChart>
                  </ResponsiveContainer>
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pendentes', value: stats?.PedidosPendentes || 0 },
                            { name: 'Confirmados', value: stats?.PedidosConfirmados || 0 },
                            { name: 'Preparando', value: stats?.PedidosPreparando || 0 },
                            { name: 'Entregues', value: stats?.PedidosEntregues || 0 },
                            { name: 'Cancelados', value: stats?.PedidosCancelados || 0 }
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
                      {formatCurrency(stats?.VendasHoje || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm">Esta Semana</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(stats?.VendasEstaSemana || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">Este Mês</span>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(stats?.VendasEsteMes || 0)}
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
