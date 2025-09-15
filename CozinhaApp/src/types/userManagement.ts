// Tipos para gerenciamento de usuários
export interface UserManagement {
  id: string;
  nomeCompleto: string;
  email: string;
  role: string;
  ativo: boolean;
  dataCriacao: string;
  ultimoLogin?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
}

export interface UpdateUserRoleRequest {
  role: string;
}

export interface UpdateUserStatusRequest {
  ativo: boolean;
}
