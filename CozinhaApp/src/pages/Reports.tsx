import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useSalesChart, useTopPratos } from '@/hooks/useApi';
import { SalesChart } from '@/components/ui/SalesChart';
import { DistributionChart } from '@/components/ui/DistributionChart';

const Reports: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Dados do dashboard
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useSalesChart();
  const { data: topPratos, isLoading: topPratosLoading } = useTopPratos();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para acessar os relatórios.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsLoading(true);
    // Simular exportação
    setTimeout(() => {
      setIsLoading(false);
      alert(`Relatório exportado em formato ${format.toUpperCase()}`);
    }, 2000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simular atualização
    setTimeout(() => {
      setIsLoading(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Relatórios e Analytics
              </h1>
              <p className="text-muted-foreground">
                Análise detalhada de vendas e performance do negócio
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar PDF</span>
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                disabled={isLoading}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Excel</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filtros de Período */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="font-medium">Filtros:</span>
                  <div className="flex space-x-2">
                    {['7d', '30d', '90d', '1y'].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period === '7d' && '7 dias'}
                        {period === '30d' && '30 dias'}
                        {period === '90d' && '90 dias'}
                        {period === '1y' && '1 ano'}
                      </Button>
                    ))}
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Métricas Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Vendas Totais</p>
                  <p className="text-2xl font-bold text-blue-700">
                    R$ {stats?.valorTotalVendas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Pedidos</p>
                  <p className="text-2xl font-bold text-green-700">
                    {stats?.totalPedidos || 0}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Pratos</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats?.totalPratos || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-orange-700">
                    R$ {stats?.totalPedidos > 0 ? (stats.valorTotalVendas / stats.totalPedidos).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs de Relatórios */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart 
                data={salesData || []} 
                isLoading={salesLoading}
                title="Vendas por Período"
              />

              <DistributionChart 
                data={topPratos || []} 
                isLoading={topPratosLoading}
                title="Distribuição de Vendas"
                type="value"
              />
            </div>
          </TabsContent>

          {/* Vendas */}
          <TabsContent value="sales" className="space-y-6">
            <SalesChart 
              data={salesData || []} 
              isLoading={salesLoading}
              title="Análise Detalhada de Vendas"
            />
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistributionChart 
                data={topPratos || []} 
                isLoading={topPratosLoading}
                title="Pratos Mais Vendidos (Quantidade)"
                type="quantity"
              />

              <DistributionChart 
                data={topPratos || []} 
                isLoading={topPratosLoading}
                title="Pratos Mais Vendidos (Valor)"
                type="value"
              />
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart 
                data={salesData || []} 
                isLoading={salesLoading}
                title="Performance de Vendas"
              />

              <DistributionChart 
                data={topPratos || []} 
                isLoading={topPratosLoading}
                title="Performance por Produto"
                type="value"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;