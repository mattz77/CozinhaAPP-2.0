import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Phone, CreditCard, Plus, Minus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartSync } from '@/hooks/useCartSync';
import { agendamentosService } from '@/services/api';
import { CreateAgendamentoDto, CreateItemAgendamentoDto, Prato } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pratos?: Prato[];
}

export const AgendamentoModal: React.FC<AgendamentoModalProps> = ({ 
  isOpen, 
  onClose, 
  pratos = [] 
}) => {
  const { token } = useAuth();
  const { items: carrinhoItems } = useCartSync();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados do formulário
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horaAgendamento, setHoraAgendamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [pagamentoAntecipado, setPagamentoAntecipado] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  
  // Estados dos itens
  const [itensAgendamento, setItensAgendamento] = useState<CreateItemAgendamentoDto[]>([]);
  const [pratoSelecionado, setPratoSelecionado] = useState<number | null>(null);

  // Inicializar com itens do carrinho se disponíveis
  useEffect(() => {
    if (carrinhoItems && carrinhoItems.length > 0) {
      const itens = carrinhoItems.map(item => ({
        pratoId: item.id,
        quantidade: item.quantidade,
        observacoes: ''
      }));
      setItensAgendamento(itens);
    }
  }, [carrinhoItems]);

  // Calcular valor total
  const valorTotal = itensAgendamento.reduce((total, item) => {
    const prato = pratos.find(p => p.id === item.pratoId);
    return total + (prato?.preco || 0) * item.quantidade;
  }, 0);

  // Adicionar item ao agendamento
  const adicionarItem = () => {
    if (!pratoSelecionado) return;
    
    const pratoExistente = itensAgendamento.find(item => item.pratoId === pratoSelecionado);
    
    if (pratoExistente) {
      setItensAgendamento(prev => 
        prev.map(item => 
          item.pratoId === pratoSelecionado 
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setItensAgendamento(prev => [...prev, {
        pratoId: pratoSelecionado,
        quantidade: 1,
        observacoes: ''
      }]);
    }
    
    setPratoSelecionado(null);
  };

  // Atualizar quantidade de item
  const atualizarQuantidade = (pratoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      setItensAgendamento(prev => prev.filter(item => item.pratoId !== pratoId));
    } else {
      setItensAgendamento(prev => 
        prev.map(item => 
          item.pratoId === pratoId 
            ? { ...item, quantidade: novaQuantidade }
            : item
        )
      );
    }
  };

  // Remover item
  const removerItem = (pratoId: number) => {
    setItensAgendamento(prev => prev.filter(item => item.pratoId !== pratoId));
  };

  // Criar agendamento
  const criarAgendamento = async () => {
    if (!token) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um agendamento",
        variant: "destructive"
      });
      return;
    }

    if (itensAgendamento.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao agendamento",
        variant: "destructive"
      });
      return;
    }

    if (!dataAgendamento || !horaAgendamento) {
      toast({
        title: "Erro",
        description: "Selecione data e hora para o agendamento",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataHoraCompleta = new Date(`${dataAgendamento}T${horaAgendamento}`);
      
      const agendamento: CreateAgendamentoDto = {
        dataAgendamento: dataHoraCompleta.toISOString(),
        observacoes,
        enderecoEntrega,
        telefoneContato,
        pagamentoAntecipado,
        metodoPagamento: pagamentoAntecipado ? metodoPagamento : undefined,
        itens: itensAgendamento
      };

      await agendamentosService.createAgendamento(agendamento, token);
      
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso! Você receberá uma notificação 30 minutos antes.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Agendar Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data do Agendamento</Label>
              <Input
                id="data"
                type="date"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Horário</Label>
              <Input
                id="hora"
                type="time"
                value={horaAgendamento}
                onChange={(e) => setHoraAgendamento(e.target.value)}
              />
            </div>
          </div>

          {/* Itens do Agendamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Itens do Pedido</h3>
            
            {/* Adicionar Item */}
            <div className="flex gap-2">
              <Select value={pratoSelecionado?.toString() || ''} onValueChange={(value) => setPratoSelecionado(Number(value))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione um prato" />
                </SelectTrigger>
                <SelectContent>
                  {pratos.map(prato => (
                    <SelectItem key={prato.id} value={prato.id.toString()}>
                      {prato.nome} - R$ {prato.preco.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={adicionarItem} disabled={!pratoSelecionado}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de Itens */}
            <div className="space-y-2">
              {itensAgendamento.map(item => {
                const prato = pratos.find(p => p.id === item.pratoId);
                if (!prato) return null;

                return (
                  <Card key={item.pratoId} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{prato.nome}</h4>
                        <p className="text-sm text-muted-foreground">R$ {prato.preco.toFixed(2)} cada</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarQuantidade(item.pratoId, item.quantidade - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarQuantidade(item.pratoId, item.quantidade + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removerItem(item.pratoId)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <span className="font-semibold">
                        Subtotal: R$ {(prato.preco * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Valor Total */}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                Total: R$ {valorTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço de Entrega</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro..."
                value={enderecoEntrega}
                onChange={(e) => setEnderecoEntrega(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone de Contato</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={telefoneContato}
                onChange={(e) => setTelefoneContato(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações especiais para o pedido..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            {/* Pagamento Antecipado */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pagamentoAntecipado"
                  checked={pagamentoAntecipado}
                  onChange={(e) => setPagamentoAntecipado(e.target.checked)}
                />
                <Label htmlFor="pagamentoAntecipado">
                  Pagar antecipadamente (recomendado)
                </Label>
              </div>

              {pagamentoAntecipado && (
                <div className="space-y-2">
                  <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                  <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={criarAgendamento} 
              disabled={isLoading || itensAgendamento.length === 0}
              className="flex-1"
            >
              {isLoading ? 'Criando...' : 'Agendar Pedido'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
