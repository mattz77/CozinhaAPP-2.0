import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoriasService, 
  pratosService, 
  pedidosService, 
  clientesService 
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
    queryFn: () => categoriasService.getAll(token),
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
  });
};

// Hooks para Pratos
export const usePratos = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['pratos'],
    queryFn: () => pratosService.getAll(token),
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
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