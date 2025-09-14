import { API_CONFIG } from '../constants/api';
import { 
  LoginDto, 
  RegisterDto, 
  AuthResponseDto, 
  UserDto, 
  RefreshTokenDto, 
  ChangePasswordDto 
} from '../types/auth';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Serviço de autenticação
export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async register(userData: RegisterDto): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar usuário');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao renovar token');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<UserDto> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar usuário');
      }

      return response.json();
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  },

  async changePassword(token: string, passwords: ChangePasswordDto): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  async logout(token: string, refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn('Erro ao fazer logout no servidor');
      }
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
    }
  }
};
