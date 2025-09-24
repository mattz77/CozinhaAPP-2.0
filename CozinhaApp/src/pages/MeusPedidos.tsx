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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Pedido #{selectedPedido.numeroPedido}
                    </h2>
                    <p className="text-white/90 text-lg">
                      {formatDate(selectedPedido.dataPedido)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                      {getStatusIcon(selectedPedido.status)}
                      <span className="ml-2">{selectedPedido.status}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
                <div className="space-y-8">
                  {/* Informações Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 bg-gray-800 border-2 border-gray-700 hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-lg text-white">Endereço de Entrega</h3>
                      </div>
                      <p className="text-gray-300">
                        {selectedPedido.enderecoEntrega || 'Não informado'}
                      </p>
                    </Card>

                    <Card className="p-4 bg-gray-800 border-2 border-gray-700 hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CreditCard className="h-5 w-5 text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg text-white">Forma de Pagamento</h3>
                      </div>
                      <p className="text-gray-300">
                        {selectedPedido.formaPagamento || 'Não informado'}
                      </p>
                    </Card>
                  </div>

                  {/* Itens do Pedido */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Package className="h-5 w-5 text-orange-400" />
                      </div>
                      <h3 className="font-semibold text-xl text-white">Itens do Pedido</h3>
                      <Badge variant="outline" className="ml-auto bg-gray-700 text-gray-300 border-gray-600">
                        {selectedPedido.itens.length} item(s)
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedPedido.itens.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors border border-gray-700"
                        >
                          {item.pratoImagemUrl ? (
                            <img
                              src={item.pratoImagemUrl}
                              alt={item.pratoNome}
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1 text-white">{item.pratoNome}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <span className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {item.quantidade}x
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                {formatCurrency(item.precoUnitario)} cada
                              </span>
                            </div>
                            {item.observacoes && (
                              <p className="text-xs text-gray-400 mt-1 italic">
                                Obs: {item.observacoes}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo Financeiro */}
                  <Card className="p-6 bg-gradient-to-r from-primary/20 to-primary/30 border-2 border-primary/40 bg-gray-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-white">Total do Pedido</h3>
                        <p className="text-gray-300">Incluindo todos os itens</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-primary">
                          {formatCurrency(selectedPedido.valorTotal)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Observações */}
                  {selectedPedido.observacoes && (
                    <Card className="p-6 border-2 border-yellow-500/30 bg-yellow-500/10 bg-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <h3 className="font-semibold text-lg text-white">Observações Especiais</h3>
                      </div>
                      <p className="text-gray-300 italic">
                        "{selectedPedido.observacoes}"
                      </p>
                    </Card>
                  )}

                  {/* Ações */}
                  <div className="flex justify-center gap-4 pt-4">
                    {canCancel(selectedPedido.status) && (
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => {
                          setShowDetails(false);
                          handleCancelPedido(selectedPedido.id);
                        }}
                        className="px-8 bg-red-600 hover:bg-red-700 text-white border-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar Pedido
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowDetails(false)}
                      className="px-8 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeusPedidos;
