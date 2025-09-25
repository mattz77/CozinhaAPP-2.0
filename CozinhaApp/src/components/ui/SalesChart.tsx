import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface SalesChartProps {
  data: Array<{
    data: string;
    vendas: number;
  }>;
  isLoading?: boolean;
  title?: string;
}

export const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  isLoading = false, 
  title = "Vendas por Período" 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado de vendas disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular estatísticas
  const totalVendas = data.reduce((sum, item) => sum + item.vendas, 0);
  const vendasMedias = totalVendas / data.length;
  const maiorVenda = Math.max(...data.map(item => item.vendas));
  const menorVenda = Math.min(...data.map(item => item.vendas));
  const crescimento = data.length > 1 ? 
    ((data[data.length - 1].vendas - data[0].vendas) / data[0].vendas) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              R$ {vendasMedias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Média</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              R$ {maiorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Maior</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              R$ {menorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Menor</p>
          </div>
        </div>

        {/* Indicador de Crescimento */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            crescimento >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {crescimento >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {crescimento >= 0 ? '+' : ''}{crescimento.toFixed(1)}% de crescimento
            </span>
          </div>
        </div>

        {/* Gráfico Simples (Barra) */}
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = (item.vendas / maiorVenda) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.data}</span>
                  <span className="text-muted-foreground">
                    R$ {item.vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
