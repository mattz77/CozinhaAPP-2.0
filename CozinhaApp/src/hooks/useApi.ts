import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoriasService, 
  pratosService, 
  pedidosService, 
  clientesService,
  dashboardService,
  searchService,
  configService
} from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CreateCategoriaDto, 
  CreatePratoDto, 
  CreatePedidoDto, 
  CreateClienteDto 
} from '../types';

// Hooks para Categorias
export const useCategorias = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      try {
        console.log('🔍 useCategorias: Fazendo requisição...');
        const result = await categoriasService.getAll(token);
        console.log('✅ useCategorias: Sucesso:', result?.length || 0, 'categorias');
        return result;
      } catch (error) {
        console.error('❌ useCategorias: Erro:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1, // Reduzir tentativas
    retryDelay: 1000,
  });
};

// Hooks para Pratos
export const usePratos = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['pratos'],
    queryFn: async () => {
      try {
        console.log('🔍 usePratos: Fazendo requisição...');
        const result = await pratosService.getAll(token);
        console.log('✅ usePratos: Sucesso:', result?.length || 0, 'pratos');
        return result;
      } catch (error) {
        console.error('❌ usePratos: Erro:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1, // Reduzir tentativas
    retryDelay: 1000,
  });
};

export const usePratosByCategoria = (categoriaId: number) => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['pratos', 'categoria', categoriaId, { auth: isAuthenticated }],
    queryFn: () => pratosService.getByCategoria(categoriaId, token),
    enabled: !!categoriaId && isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Hooks para Pedidos
export const usePedidos = () => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['pedidos', { auth: isAuthenticated }],
    queryFn: () => pedidosService.getAll(token),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30 * 1000, // Atualiza a cada 30 segundos
    retry: 2,
  });
};

export const usePedidosByCliente = (clienteId: number) => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['pedidos', 'cliente', clienteId, { auth: isAuthenticated }],
    queryFn: () => pedidosService.getByCliente(clienteId, token),
    enabled: !!clienteId && isAuthenticated,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000,
    retry: 2,
  });
};

// Mutations
export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreatePedidoDto) => pedidosService.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useUpdatePedidoStatus = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      pedidosService.updateStatus(id, status, token),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', id] });
    },
  });
};

// Hooks para Clientes
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: (data: CreateClienteDto) => clientesService.create(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};

// Novos hooks para funcionalidades aprimoradas

// Hooks para Dashboard
export const useDashboardStats = () => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(token!),
    enabled: isAuthenticated && !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
};

export const useSalesChart = (days: number = 30) => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', 'sales-chart', days],
    queryFn: () => dashboardService.getSalesChart(token!, days),
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useTopPratos = (limit: number = 10) => {
  const { token, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', 'top-pratos', limit],
    queryFn: () => dashboardService.getTopPratos(token!, limit),
    enabled: isAuthenticated && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hooks para Busca
export const useSearchPratos = (params: {
  q?: string;
  categoriaId?: number;
  precoMin?: number;
  precoMax?: number;
  tipo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: ['search', 'pratos', params],
    queryFn: () => searchService.searchPratos(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: true, // Sempre habilitado
  });
};

export const useSearchSuggestions = (q?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['search', 'suggestions', q, limit],
    queryFn: () => searchService.getSuggestions(q, limit),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useSearchFilters = () => {
  return useQuery({
    queryKey: ['search', 'filters'],
    queryFn: () => searchService.getFilters(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hooks para Pratos Aprimorados
export const usePratosRecent = (limit: number = 10) => {
  return useQuery({
    queryKey: ['pratos', 'recent', limit],
    queryFn: () => pratosService.getRecent(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const usePratosFeatured = (limit: number = 6) => {
  return useQuery({
    queryKey: ['pratos', 'featured', limit],
    queryFn: () => pratosService.getFeatured(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const usePratosTypes = () => {
  return useQuery({
    queryKey: ['pratos', 'types'],
    queryFn: () => pratosService.getTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};


// Hooks para Configurações
export const useAppSettings = () => {
  return useQuery({
    queryKey: ['config', 'app-settings'],
    queryFn: () => configService.getAppSettings(),
    staleTime: 60 * 60 * 1000, // 1 hora
  });
};

export const useSystemInfo = () => {
  return useQuery({
    queryKey: ['config', 'system-info'],
    queryFn: () => configService.getSystemInfo(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['config', 'health'],
    queryFn: () => configService.getHealthCheck(),
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Verifica a cada minuto
  });
};