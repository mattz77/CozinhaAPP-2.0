import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, BarChart3 } from 'lucide-react';

interface DistributionChartProps {
  data: Array<{
    nome: string;
    quantidadeVendida: number;
    valorTotalVendido: number;
  }>;
  isLoading?: boolean;
  title?: string;
  type?: 'quantity' | 'value';
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ 
  data, 
  isLoading = false, 
  title = "Distribuição de Vendas",
  type = 'quantity'
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
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
            <PieChart className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular totais
  const totalQuantity = data.reduce((sum, item) => sum + item.quantidadeVendida, 0);
  const totalValue = data.reduce((sum, item) => sum + item.valorTotalVendido, 0);
  const maxValue = Math.max(...data.map(item => type === 'quantity' ? item.quantidadeVendida : item.valorTotalVendido));

  // Cores para as barras
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {totalQuantity.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-muted-foreground">Total de Vendas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">Valor Total</p>
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="space-y-4">
          {data.map((item, index) => {
            const value = type === 'quantity' ? item.quantidadeVendida : item.valorTotalVendido;
            const percentage = (value / maxValue) * 100;
            const colorClass = colors[index % colors.length];
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                    <span className="font-medium text-sm">{item.nome}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      {type === 'quantity' 
                        ? `${value} vendas`
                        : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {type === 'quantity' 
                        ? `${((value / totalQuantity) * 100).toFixed(1)}%`
                        : `${((value / totalValue) * 100).toFixed(1)}%`
                      }
                    </p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`${colorClass} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top 3 */}
        {data.length > 3 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">Top 3</h4>
            <div className="space-y-2">
              {data.slice(0, 3).map((item, index) => {
                const value = type === 'quantity' ? item.quantidadeVendida : item.valorTotalVendido;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{item.nome}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {type === 'quantity' 
                        ? `${value} vendas`
                        : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
