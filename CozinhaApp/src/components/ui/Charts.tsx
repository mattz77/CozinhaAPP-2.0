import React from 'react';
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
  Cell,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';

interface ChartProps {
  className?: string;
}

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Componente de Gráfico de Vendas
export const SalesChart = ({ data, className }: { data: any[]; className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Vendas por Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="data" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Vendas']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <Area 
              type="monotone" 
              dataKey="vendas" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de Gráfico de Pedidos
export const OrdersChart = ({ data, className }: { data: any[]; className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          Pedidos por Dia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="data" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [value, 'Pedidos']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <Bar dataKey="quantidadePedidos" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de Gráfico de Pizza para Status
export const StatusPieChart = ({ data, title, className }: { 
  data: { label: string; value: number; color: string }[]; 
  title: string;
  className?: string;
}) => {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    color: item.color
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de Gráfico de Linha para Tendências
export const TrendLineChart = ({ data, className }: { data: any[]; className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Tendência de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="data" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Vendas']}
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <Line 
              type="monotone" 
              dataKey="vendas" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de Comparação de Períodos
export const ComparisonChart = ({ data, className }: { data: any[]; className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-orange-600" />
          Comparação de Períodos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `R$ ${value.toFixed(2)}`, 
                name === 'vendas' ? 'Vendas' : 'Agendamentos'
              ]}
            />
            <Legend />
            <Bar dataKey="vendas" fill="#F59E0B" name="Vendas" />
            <Bar dataKey="agendamentos" fill="#EF4444" name="Agendamentos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente de Métricas em Tempo Real
export const RealTimeMetrics = ({ 
  vendasHoje, 
  vendasOntem, 
  pedidosHoje, 
  pedidosOntem,
  className 
}: {
  vendasHoje: number;
  vendasOntem: number;
  pedidosHoje: number;
  pedidosOntem: number;
  className?: string;
}) => {
  const vendasVariacao = vendasOntem > 0 ? ((vendasHoje - vendasOntem) / vendasOntem) * 100 : 0;
  const pedidosVariacao = pedidosOntem > 0 ? ((pedidosHoje - pedidosOntem) / pedidosOntem) * 100 : 0;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendas Hoje</p>
              <p className="text-2xl font-bold">R$ {vendasHoje.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1">
              {vendasVariacao >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${vendasVariacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(vendasVariacao).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
              <p className="text-2xl font-bold">{pedidosHoje}</p>
            </div>
            <div className="flex items-center gap-1">
              {pedidosVariacao >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${pedidosVariacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(pedidosVariacao).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
