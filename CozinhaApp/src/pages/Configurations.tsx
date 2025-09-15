import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings, useSystemInfo, useHealthCheck } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SkeletonCard, SkeletonList } from '@/components/ui/Skeleton';
import { UserManagementComponent } from '@/components/admin/UserManagementComponent';
import { 
  Settings, 
  Server, 
  Shield, 
  Bell, 
  Save, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Cpu,
  HardDrive,
  MemoryStick,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

const Configurations = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Verificar se o usuário é admin
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [settings, setSettings] = useState({
    nomeRestaurante: 'CozinhaApp',
    telefoneContato: '+55 (11) 99999-9999',
    emailContato: 'contato@cozinhaapp.com',
    enderecoRestaurante: 'Rua das Flores, 123 - São Paulo/SP',
    horarioFuncionamento: 'Segunda a Sexta: 11h às 22h | Sábado e Domingo: 10h às 23h',
    tempoEntregaEstimado: 30,
    taxaEntrega: 5.00,
    valorMinimoPedido: 25.00,
    tempoPreparoMaximo: 60,
    precoMinimo: 5.00,
    precoMaximo: 100.00,
    notificacoesEmail: true,
    notificacoesPush: true,
    manutencao: false
  });

  const { data: appSettings, isLoading: settingsLoading } = useAppSettings();
  const { data: systemInfo, isLoading: systemLoading } = useSystemInfo();
  const { data: healthCheck, isLoading: healthLoading } = useHealthCheck();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar as configurações.
            </p>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Apenas administradores podem acessar as configurações do sistema.
            </p>
            <Button onClick={() => window.history.back()}>
              Voltar
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (tickCount: number) => {
    const days = Math.floor(tickCount / (1000 * 60 * 60 * 24));
    const hours = Math.floor((tickCount % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((tickCount % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleSaveSettings = () => {
    // Implementar salvamento das configurações
    console.log('Salvando configurações:', settings);
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Saudável</Badge>;
      case 'Unhealthy':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Não Saudável</Badge>;
      default:
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" /> Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e monitore a saúde da aplicação.
          </p>
        </div>

        <Tabs defaultValue="app" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="app">Aplicação</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configurações da Aplicação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nomeRestaurante">Nome do Restaurante</Label>
                    <Input
                      id="nomeRestaurante"
                      value={settings.nomeRestaurante}
                      onChange={(e) => setSettings(prev => ({ ...prev, nomeRestaurante: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneContato">Telefone de Contato</Label>
                    <Input
                      id="telefoneContato"
                      value={settings.telefoneContato}
                      onChange={(e) => setSettings(prev => ({ ...prev, telefoneContato: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailContato">Email de Contato</Label>
                    <Input
                      id="emailContato"
                      type="email"
                      value={settings.emailContato}
                      onChange={(e) => setSettings(prev => ({ ...prev, emailContato: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tempoEntregaEstimado">Tempo de Entrega (min)</Label>
                    <Input
                      id="tempoEntregaEstimado"
                      type="number"
                      value={settings.tempoEntregaEstimado}
                      onChange={(e) => setSettings(prev => ({ ...prev, tempoEntregaEstimado: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="enderecoRestaurante">Endereço do Restaurante</Label>
                  <Textarea
                    id="enderecoRestaurante"
                    value={settings.enderecoRestaurante}
                    onChange={(e) => setSettings(prev => ({ ...prev, enderecoRestaurante: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                  <Textarea
                    id="horarioFuncionamento"
                    value={settings.horarioFuncionamento}
                    onChange={(e) => setSettings(prev => ({ ...prev, horarioFuncionamento: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="taxaEntrega">Taxa de Entrega</Label>
                    <Input
                      id="taxaEntrega"
                      type="number"
                      step="0.01"
                      value={settings.taxaEntrega}
                      onChange={(e) => setSettings(prev => ({ ...prev, taxaEntrega: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valorMinimoPedido">Valor Mínimo do Pedido</Label>
                    <Input
                      id="valorMinimoPedido"
                      type="number"
                      step="0.01"
                      value={settings.valorMinimoPedido}
                      onChange={(e) => setSettings(prev => ({ ...prev, valorMinimoPedido: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tempoPreparoMaximo">Tempo Máximo de Preparo (min)</Label>
                    <Input
                      id="tempoPreparoMaximo"
                      type="number"
                      value={settings.tempoPreparoMaximo}
                      onChange={(e) => setSettings(prev => ({ ...prev, tempoPreparoMaximo: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" text="Carregando informações do sistema..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nome do Sistema</span>
                        <span className="font-semibold">{systemInfo?.Nome || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Versão</span>
                        <Badge variant="secondary">{systemInfo?.Versao || 'N/A'}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ambiente</span>
                        <Badge variant={systemInfo?.Ambiente === 'Production' ? 'default' : 'secondary'}>
                          {systemInfo?.Ambiente || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Data/Hora do Servidor</span>
                        <span className="font-semibold text-sm">
                          {systemInfo?.DataHoraServidor ? 
                            format(new Date(systemInfo.DataHoraServidor), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="font-semibold">
                          {systemInfo?.Uptime ? formatUptime(systemInfo.Uptime) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Processadores</span>
                        <span className="font-semibold">{systemInfo?.ProcessadorCount || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Memória</span>
                        <span className="font-semibold">
                          {systemInfo?.WorkingSet ? formatBytes(systemInfo.WorkingSet) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Machine Name</span>
                        <span className="font-semibold">{systemInfo?.MachineName || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Saúde do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" text="Verificando saúde do sistema..." />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Status Geral</span>
                      {getHealthStatus(healthCheck?.Status || 'Unknown')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          Banco de Dados
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status</span>
                            {getHealthStatus(healthCheck?.Database ? 'Healthy' : 'Unhealthy')}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center">
                          <MemoryStick className="h-4 w-4 mr-2" />
                          Memória
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Working Set</span>
                            <span className="font-semibold">
                              {healthCheck?.Memory?.WorkingSet ? formatBytes(healthCheck.Memory.WorkingSet) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Private Memory</span>
                            <span className="font-semibold">
                              {healthCheck?.Memory?.PrivateMemory ? formatBytes(healthCheck.Memory.PrivateMemory) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Disco
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Espaço Total</span>
                          <span className="font-semibold">
                            {healthCheck?.Disk?.TotalSize ? formatBytes(healthCheck.Disk.TotalSize) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Espaço Livre</span>
                          <span className="font-semibold">
                            {healthCheck?.Disk?.FreeSpace ? formatBytes(healthCheck.Disk.FreeSpace) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Espaço Usado</span>
                          <span className="font-semibold">
                            {healthCheck?.Disk?.UsedSpace ? formatBytes(healthCheck.Disk.UsedSpace) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="manutencao">Modo de Manutenção</Label>
                      <p className="text-sm text-muted-foreground">
                        Ative para colocar o sistema em manutenção
                      </p>
                    </div>
                    <Switch
                      id="manutencao"
                      checked={settings.manutencao}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, manutencao: checked }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="precoMinimo">Preço Mínimo dos Pratos</Label>
                    <Input
                      id="precoMinimo"
                      type="number"
                      step="0.01"
                      value={settings.precoMinimo}
                      onChange={(e) => setSettings(prev => ({ ...prev, precoMinimo: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoMaximo">Preço Máximo dos Pratos</Label>
                    <Input
                      id="precoMaximo"
                      type="number"
                      step="0.01"
                      value={settings.precoMaximo}
                      onChange={(e) => setSettings(prev => ({ ...prev, precoMaximo: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações de Segurança
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Configurações de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notificacoesEmail">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações importantes por email
                      </p>
                    </div>
                    <Switch
                      id="notificacoesEmail"
                      checked={settings.notificacoesEmail}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificacoesEmail: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notificacoesPush">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações push no navegador
                      </p>
                    </div>
                    <Switch
                      id="notificacoesPush"
                      checked={settings.notificacoesPush}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificacoesPush: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações de Notificações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagementComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configurations;
