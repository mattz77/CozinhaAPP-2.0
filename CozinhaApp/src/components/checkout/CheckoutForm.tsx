import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/hooks/useCheckout';
import { FormaPagamento } from '@/types/pedidos';

// Componente separado para o Select de forma de pagamento
const PaymentMethodSelect = React.memo(({ 
  value, 
  onValueChange, 
  disabled, 
  formasPagamento 
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  formasPagamento: { value: FormaPagamento; label: string }[];
}) => {
  console.log('🔍 PaymentMethodSelect: Renderizando com value:', value, 'disabled:', disabled);
  
  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a forma de pagamento" />
        </SelectTrigger>
        <SelectContent className="z-[200]">
          {formasPagamento.map((forma) => (
            <SelectItem key={forma.value} value={forma.value}>
              {forma.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

PaymentMethodSelect.displayName = 'PaymentMethodSelect';

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagemUrl?: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  totalPrice: number;
  onSuccess: () => void;
  onClose: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  totalPrice,
  onSuccess,
  onClose
}) => {
  const { user } = useAuth();
  const { isProcessing, processCheckout, validateCheckoutData } = useCheckout();
  const [formData, setFormData] = useState({
    enderecoEntrega: '',
    formaPagamento: '' as FormaPagamento,
    observacoes: ''
  });

  // Memoizar as opções de pagamento para evitar re-renders
  const formasPagamento = useMemo(() => [
    { value: 'PIX' as FormaPagamento, label: 'PIX' },
    { value: 'Cartão de Débito' as FormaPagamento, label: 'Cartão de Débito' },
    { value: 'Cartão de Crédito' as FormaPagamento, label: 'Cartão de Crédito' },
    { value: 'Dinheiro' as FormaPagamento, label: 'Dinheiro' }
  ], []);

  // Usar useCallback para evitar re-renders desnecessários
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados
    const errors = validateCheckoutData(formData);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      console.log('🛒 CheckoutForm: Processando checkout...');
      
      const pedido = await processCheckout(formData);
      
      toast.success(`Pedido #${pedido.numeroPedido} criado com sucesso!`);
      
      // Chamar callback de sucesso
      onSuccess();
      
    } catch (error: any) {
      console.error('❌ CheckoutForm: Erro ao processar checkout:', error);
      toast.error(error.message || 'Erro ao criar pedido. Tente novamente.');
    }
  }, [formData, validateCheckoutData, processCheckout, onSuccess]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ zIndex: 100 }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Finalizar Pedido</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Resumo do Pedido */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Resumo do Pedido
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{item.quantidade}x</span>
                      <span>{item.nome}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.preco * item.quantidade)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Formulário de Checkout */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Endereço de Entrega */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereço de Entrega *
                </Label>
                <Textarea
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade - CEP"
                  value={formData.enderecoEntrega}
                  onChange={(e) => handleInputChange('enderecoEntrega', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label htmlFor="pagamento" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Forma de Pagamento *
                </Label>
                <PaymentMethodSelect
                  value={formData.formaPagamento}
                  onValueChange={(value) => handleInputChange('formaPagamento', value)}
                  disabled={isProcessing}
                  formasPagamento={formasPagamento}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">
                  Observações (opcional)
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Instruções especiais para o pedido..."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              {/* Informações do Cliente */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Cliente</h4>
                <p className="font-medium">{user?.nomeCompleto}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              {/* Botões */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="min-w-[140px]"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Aviso */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Importante:</p>
                  <p>Após finalizar o pedido, você receberá um número de acompanhamento e poderá acompanhar o status em "Meus Pedidos".</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
