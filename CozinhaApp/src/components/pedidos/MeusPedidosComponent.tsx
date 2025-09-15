import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pedidoService } from '@/services/pedidoService';
import { Pedido, StatusPedido } from '@/types/pedidos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  RefreshCw,
  Eye,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';

export const MeusPedidosComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPedidos = await pedidoService.getMeusPedidos();
      setPedidos(fetchedPedidos);
    } catch (err: any) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Erro ao carregar pedidos. Verifique sua conexão.');
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [isAuthenticated]);

  const getStatusBadgeVariant = (status: StatusPedido) => {
    switch (status) {
      case 'Pendente':
        return 'secondary';
      case 'Confirmado':
        return 'default';
      case 'Preparando':
        return 'outline';
      case 'SaiuParaEntrega':
        return 'default';
      case 'Entregue':
        return 'default';
      case 'Cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: StatusPedido) => {
    switch (status) {
      case 'Pendente':
        return <Clock className="h-4 w-4" />;
      case 'Confirmado':
        return <CheckCircle className="h-4 w-4" />;
      case 'Preparando':
        return <Package className="h-4 w-4" />;
      case 'SaiuParaEntrega':
        return <Truck className="h-4 w-4" />;
      case 'Entregue':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCancelarPedido = async (pedidoId: number) => {
    try {
      await pedidoService.cancelarPedido(pedidoId);
      toast.success('Pedido cancelado com sucesso!');
      fetchPedidos(); // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao cancelar pedido:', err);
      toast.error(err.message || 'Erro ao cancelar pedido.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Você precisa estar logado para visualizar seus pedidos.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Carregando seus pedidos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{error}</p>
        <Button onClick={fetchPedidos} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
        </Button>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não fez nenhum pedido. Que tal explorar nosso cardápio?
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Ver Cardápio
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary flex items-center">
          <Package className="h-6 w-6 mr-2" /> Meus Pedidos
        </h2>
        <Button onClick={fetchPedidos} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Pedido #{pedido.numeroPedido}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(pedido.dataPedido)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(pedido.status as StatusPedido)} className="flex items-center">
                    {getStatusIcon(pedido.status as StatusPedido)}
                    <span className="ml-1">{pedido.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações do pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Endereço:</span>
                    <span className="ml-2">{pedido.enderecoEntrega || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Pagamento:</span>
                    <span className="ml-2">{pedido.formaPagamento || 'Não informado'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(pedido.valorTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pedido.itens.length} item{pedido.itens.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Itens do pedido */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Itens do pedido:</h4>
                <div className="space-y-1">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.quantidade}x</span>
                        <span>{item.pratoNome}</span>
                        {item.observacoes && (
                          <span className="text-muted-foreground">({item.observacoes})</span>
                        )}
                      </div>
                      <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              {pedido.observacoes && (
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Observações:</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {pedido.observacoes}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                  </Button>
                  {pedido.status === 'Pendente' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelarPedido(pedido.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                  )}
                </div>
                {pedido.dataEntrega && (
                  <div className="text-sm text-muted-foreground">
                    Entregue em: {formatDate(pedido.dataEntrega)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
