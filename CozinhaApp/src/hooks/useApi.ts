import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  categoriasService, 
  pratosService, 
  pedidosService, 
  clientesService 
} from '../services/api';
import { 
  CreateCategoriaDto, 
  CreatePratoDto, 
  CreatePedidoDto, 
  CreateClienteDto 
} from '../types';

// Hooks para Categorias
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false, // Não refetch quando focar na janela
    refetchOnMount: false, // Não refetch quando montar o componente
  });
};

export const useCategoria = (id: number) => {
  return useQuery({
    queryKey: ['categorias', id],
    queryFn: () => categoriasService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoriasService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCategoriaDto }) =>
      categoriasService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias', id] });
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoriasService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

// Hooks para Pratos
export const usePratos = () => {
  return useQuery({
    queryKey: ['pratos'],
    queryFn: pratosService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false, // Não refetch quando focar na janela
    refetchOnMount: false, // Não refetch quando montar o componente
  });
};

export const usePrato = (id: number) => {
  return useQuery({
    queryKey: ['pratos', id],
    queryFn: () => pratosService.getById(id),
    enabled: !!id,
  });
};

export const usePratosByCategoria = (categoriaId: number) => {
  return useQuery({
    queryKey: ['pratos', 'categoria', categoriaId],
    queryFn: () => pratosService.getByCategoria(categoriaId),
    enabled: !!categoriaId,
  });
};

export const useCreatePrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pratosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pratos'] });
    },
  });
};

export const useUpdatePrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePratoDto }) =>
      pratosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pratos'] });
      queryClient.invalidateQueries({ queryKey: ['pratos', id] });
    },
  });
};

export const useDeletePrato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pratosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pratos'] });
    },
  });
};

// Hooks para Pedidos
export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.getAll,
    staleTime: 1 * 60 * 1000, // 1 minuto (pedidos mudam frequentemente)
  });
};

export const usePedido = (id: number) => {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => pedidosService.getById(id),
    enabled: !!id,
  });
};

export const usePedidosByCliente = (clienteId: number) => {
  return useQuery({
    queryKey: ['pedidos', 'cliente', clienteId],
    queryFn: () => pedidosService.getByCliente(clienteId),
    enabled: !!clienteId,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pedidosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useUpdatePedidoStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      pedidosService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', id] });
    },
  });
};

// Hooks para Clientes
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
};
