import { UserManagement, UpdateUserRoleRequest, UpdateUserStatusRequest } from '../types/userManagement';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class UserManagementService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = sessionStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    return response.json();
  }

  async getUsers(): Promise<UserManagement[]> {
    return this.makeRequest<UserManagement[]>('/users');
  }

  async updateUserRole(userId: string, roleData: UpdateUserRoleRequest): Promise<void> {
    await this.makeRequest(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async updateUserStatus(userId: string, statusData: UpdateUserStatusRequest): Promise<void> {
    await this.makeRequest(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }
}

export const userManagementService = new UserManagementService();
