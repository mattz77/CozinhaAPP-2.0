import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Package, 
  Clock, 
  MapPin, 
  CreditCard, 
  Eye, 
  X,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { pedidoService } from '@/services/pedidoService';
import { Pedido, StatusPedido } from '@/types/pedidos';
import { useAuth } from '@/contexts/AuthContext';

const MeusPedidos: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPedidos();
    }
  }, [isAuthenticated]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const pedidosData = await pedidoService.getMeusPedidos();
      setPedidos(pedidosData);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setShowDetails(true);
  };

  const handleCancelPedido = async (pedidoId: number) => {
    try {
      await pedidoService.cancelarPedido(pedidoId);
      toast.success('Pedido cancelado com sucesso!');
      loadPedidos(); // Recarregar lista
    } catch (error: any) {
      console.error('Erro ao cancelar pedido:', error);
      toast.error('Erro ao cancelar pedido. Tente novamente.');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparando': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SaiuParaEntrega': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Entregue': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendente': return <Clock className="h-4 w-4" />;
      case 'Confirmado': return <CheckCircle className="h-4 w-4" />;
      case 'Preparando': return <Package className="h-4 w-4" />;
      case 'SaiuParaEntrega': return <Truck className="h-4 w-4" />;
      case 'Entregue': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelado': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancel = (status: string) => {
    return status === 'Pendente';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você precisa estar logado para visualizar seus pedidos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-primary mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe o status dos seus pedidos
          </p>
        </motion.div>

        {/* Lista de Pedidos */}
        {pedidos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não fez nenhum pedido.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Fazer Primeiro Pedido
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido, index) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Pedido #{pedido.numeroPedido}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(pedido.dataPedido)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(pedido.status)}>
                          {getStatusIcon(pedido.status)}
                          <span className="ml-1">{pedido.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pedido.enderecoEntrega || 'Não informado'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pedido.formaPagamento || 'Não informado'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pedido.itens.length} item(s)
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(pedido.valorTotal)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(pedido)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        {canCancel(pedido.status) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelPedido(pedido.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes */}
        {showDetails && selectedPedido && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Pedido #{selectedPedido.numeroPedido}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status e Informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Badge className={getStatusColor(selectedPedido.status)}>
                      {getStatusIcon(selectedPedido.status)}
                      <span className="ml-1">{selectedPedido.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data do Pedido</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedPedido.dataPedido)}
                    </p>
                  </div>
                </div>

                {/* Endereço e Pagamento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPedido.enderecoEntrega || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Forma de Pagamento</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPedido.formaPagamento || 'Não informado'}
                    </p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div>
                  <h3 className="font-semibold mb-4">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedPedido.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.pratoImagemUrl && (
                            <img
                              src={item.pratoImagemUrl}
                              alt={item.pratoNome}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.pratoNome}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantidade}x {formatCurrency(item.precoUnitario)}
                            </p>
                            {item.observacoes && (
                              <p className="text-xs text-muted-foreground">
                                Obs: {item.observacoes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedPedido.valorTotal)}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                {selectedPedido.observacoes && (
                  <div>
                    <h3 className="font-semibold mb-2">Observações</h3>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                      {selectedPedido.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeusPedidos;
