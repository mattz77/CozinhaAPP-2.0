// Tipos para autenticação
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nomeCompleto: string;
  email: string;
  password: string;
  confirmPassword: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  dataNascimento?: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  nomeCompleto: string;
  email: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  dataNascimento: string;
  dataCriacao: string;
  ultimoLogin?: string;
  avatarUrl?: string;
  telefone?: string;
  clienteId?: number;
  role: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Context de autenticação
export interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  changePassword: (passwords: ChangePasswordDto) => Promise<void>;
}
