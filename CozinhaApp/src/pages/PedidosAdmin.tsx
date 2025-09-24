import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { 
  Package, 
  Clock, 
  MapPin, 
  CreditCard, 
  Eye, 
  CheckCircle,
  Truck,
  AlertCircle,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  User,
  X,
  ShoppingCart
} from 'lucide-react';
import { pedidoService } from '@/services/pedidoService';
import { Pedido, StatusPedido, PedidoEstatisticas } from '@/types/pedidos';
import { useAuth } from '@/contexts/AuthContext';

const PedidosAdmin: React.FC = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estatisticas, setEstatisticas] = useState<PedidoEstatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pedidosData, estatisticasData] = await Promise.all([
        pedidoService.getAllPedidos(),
        pedidoService.getEstatisticasPedidos()
      ]);
      setPedidos(pedidosData);
      setEstatisticas(estatisticasData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (pedidoId: number, newStatus: string) => {
    try {
      setUpdatingStatus(pedidoId);
      await pedidoService.atualizarStatusPedido(pedidoId, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      loadData(); // Recarregar dados
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status. Tente novamente.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelPedido = async (pedidoId: number) => {
    try {
      await pedidoService.cancelarPedido(pedidoId);
      toast.success('Pedido cancelado com sucesso!');
      loadData(); // Recarregar dados
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
      case 'Cancelado': return <AlertCircle className="h-4 w-4" />;
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

  const filteredPedidos = statusFilter === 'todos' 
    ? pedidos 
    : pedidos.filter(pedido => pedido.status === statusFilter);

  const statusOptions = [
    { value: 'todos', label: 'Todos os Status' },
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Confirmado', label: 'Confirmado' },
    { value: 'Preparando', label: 'Preparando' },
    { value: 'SaiuParaEntrega', label: 'Saiu para Entrega' },
    { value: 'Entregue', label: 'Entregue' },
    { value: 'Cancelado', label: 'Cancelado' }
  ];

  const nextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case 'Pendente': return 'Confirmado';
      case 'Confirmado': return 'Preparando';
      case 'Preparando': return 'SaiuParaEntrega';
      case 'SaiuParaEntrega': return 'Entregue';
      default: return null;
    }
  };

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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Gestão de Pedidos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os pedidos do sistema
              </p>
            </div>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </motion.div>

        {/* Estatísticas */}
        {estatisticas && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                    <p className="text-2xl font-bold">{estatisticas.totalPedidos}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vendas Totais</p>
                    <p className="text-2xl font-bold">{formatCurrency(estatisticas.valorTotalVendas)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                    <p className="text-2xl font-bold">{formatCurrency(estatisticas.ticketMedio)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{estatisticas.pedidosPendentes}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  {filteredPedidos.length} pedido(s) encontrado(s)
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Pedidos */}
        {filteredPedidos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">
              Não há pedidos com o filtro selecionado.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredPedidos.map((pedido, index) => (
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
                          {formatDate(pedido.dataPedido)} • {pedido.clienteNome}
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
                        
                        {nextStatus(pedido.status) && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateStatus(pedido.id, nextStatus(pedido.status)!)}
                            disabled={updatingStatus === pedido.id}
                          >
                            {updatingStatus === pedido.id ? (
                              <LoadingSpinner />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Avançar Status
                              </>
                            )}
                          </Button>
                        )}

                        {pedido.status !== 'Entregue' && pedido.status !== 'Cancelado' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelPedido(pedido.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Pedido #{selectedPedido.numeroPedido}
                    </h2>
                    <p className="text-primary-foreground/80 text-sm">
                      {formatDate(selectedPedido.dataPedido)} às {new Date(selectedPedido.dataPedido).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[calc(95vh-120px)] overflow-y-auto">
                {/* Informações do Cliente */}
                <div className="bg-gray-800 border-2 border-gray-700 hover:border-primary/40 transition-colors p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Informações do Cliente</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nome</label>
                      <p className="text-white font-semibold text-lg">{selectedPedido.clienteNome}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <p className="text-white font-semibold">{selectedPedido.clienteEmail}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Telefone</label>
                      <p className="text-white font-semibold">{selectedPedido.clienteTelefone}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Status</label>
                      <Badge className={`${getStatusColor(selectedPedido.status)} text-white font-semibold px-4 py-2`}>
                        {getStatusIcon(selectedPedido.status)}
                        <span className="ml-2">{selectedPedido.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Endereço e Pagamento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 border-2 border-gray-700 hover:border-green-500/40 transition-colors p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Endereço de Entrega</h3>
                    </div>
                    <p className="text-white font-semibold text-lg">
                      {selectedPedido.enderecoEntrega || 'Não informado'}
                    </p>
                  </div>
                  <div className="bg-gray-800 border-2 border-gray-700 hover:border-orange-500/40 transition-colors p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Forma de Pagamento</h3>
                    </div>
                    <p className="text-white font-semibold text-lg">
                      {selectedPedido.formaPagamento || 'Não informado'}
                    </p>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="bg-gray-800 border-2 border-gray-700 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Itens do Pedido</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedPedido.itens.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 bg-gray-700 border border-gray-600 hover:border-primary/40 transition-colors rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          {item.pratoImagemUrl ? (
                            <img
                              src={item.pratoImagemUrl}
                              alt={item.pratoNome}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-600"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white text-lg">{item.pratoNome}</p>
                            <p className="text-gray-300 font-medium">
                              {item.quantidade}x {formatCurrency(item.precoUnitario)}
                            </p>
                            {item.observacoes && (
                              <p className="text-sm text-yellow-400 font-medium">
                                Obs: {item.observacoes}
                              </p>
                            )}
                          </div>
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

                {/* Total */}
                <div className="bg-gradient-to-r from-primary/20 to-primary/30 border-2 border-primary/40 bg-gray-800 p-6 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">Total do Pedido</span>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(selectedPedido.valorTotal)}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                {selectedPedido.observacoes && (
                  <div className="bg-gray-800 border-2 border-yellow-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Observações</h3>
                    </div>
                    <p className="text-white font-medium bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
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

export default PedidosAdmin;
