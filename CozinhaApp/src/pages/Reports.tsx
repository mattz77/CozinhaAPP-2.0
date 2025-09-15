import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchPratos } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Download, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const Reports = () => {
  const { user, isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [groupBy, setGroupBy] = useState('day');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - em produção, isso viria dos hooks da API
  const mockSalesData = [
    { date: '2025-01-01', sales: 1200, orders: 15 },
    { date: '2025-01-02', sales: 1800, orders: 22 },
    { date: '2025-01-03', sales: 1500, orders: 18 },
    { date: '2025-01-04', sales: 2200, orders: 28 },
    { date: '2025-01-05', sales: 1900, orders: 24 },
    { date: '2025-01-06', sales: 2500, orders: 32 },
    { date: '2025-01-07', sales: 2100, orders: 26 }
  ];

  const mockTopDishes = [
    { id: 1, nome: 'Pizza Margherita', categoria: 'Pizzas', vendas: 45, receita: 1350 },
    { id: 2, nome: 'Hambúrguer Artesanal', categoria: 'Lanches', vendas: 38, receita: 1140 },
    { id: 3, nome: 'Lasanha à Bolonhesa', categoria: 'Massas', vendas: 32, receita: 1280 },
    { id: 4, nome: 'Salada Caesar', categoria: 'Saladas', vendas: 28, receita: 840 },
    { id: 5, nome: 'Frango Grelhado', categoria: 'Carnes', vendas: 25, receita: 1000 }
  ];

  const mockCategoryData = [
    { name: 'Pizzas', value: 35, color: '#F5C442' },
    { name: 'Lanches', value: 25, color: '#FF6B6B' },
    { name: 'Massas', value: 20, color: '#4ECDC4' },
    { name: 'Saladas', value: 12, color: '#45B7D1' },
    { name: 'Carnes', value: 8, color: '#96CEB4' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar os relatórios.
            </p>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleExport = (type: string) => {
    // Implementar exportação de dados
    console.log(`Exportando relatório: ${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada de vendas, produtos e performance do negócio.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="groupBy">Agrupar Por</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Dia</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vendas por Período</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport('sales')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                      formatter={(value: number, name: string) => [
                        name === 'sales' ? formatCurrency(value) : formatNumber(value),
                        name === 'sales' ? 'Vendas' : 'Pedidos'
                      ]}
                    />
                    <Bar dataKey="sales" fill="#F5C442" name="sales" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Vendas</p>
                      <p className="text-2xl font-bold text-primary">R$ 13.200,00</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                      <p className="text-2xl font-bold text-primary">165</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                      <p className="text-2xl font-bold text-primary">R$ 80,00</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {/* Top Products Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vendas por Categoria</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport('products')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Participação']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTopDishes.map((dish) => (
                      <TableRow key={dish.id}>
                        <TableCell className="font-medium">{dish.nome}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dish.categoria}</Badge>
                        </TableCell>
                        <TableCell>{formatNumber(dish.vendas)}</TableCell>
                        <TableCell>{formatCurrency(dish.receita)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Package className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita vs Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                        formatter={(value: number) => [formatCurrency(value), 'Receita']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#F5C442" 
                        strokeWidth={2}
                        name="Receita"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Receita Total</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(13200)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Custos Operacionais</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(6600)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margem de Lucro</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(6600)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margem %</span>
                    <span className="font-semibold text-primary">
                      50%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('excel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
