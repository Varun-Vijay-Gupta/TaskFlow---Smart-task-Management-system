import type { Task, TaskFormData, TaskStats, TaskStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  async guestLogin(name?: string) {
    return this.request<{
      success: boolean;
      data: { user: { id: string; name: string; isGuest: boolean }; token: string };
    }>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getProfile() {
    return this.request<{
      success: boolean;
      data: { user: { id: string; name: string; email?: string; isGuest: boolean } };
    }>('/auth/profile');
  }

  async getTasks(params?: {
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
    }
    const qs = query.toString();
    return this.request<{
      success: boolean;
      data: {
        tasks: Task[];
        stats: TaskStats;
      };
    }>(`/tasks${qs ? `?${qs}` : ''}`);
  }

  async createTask(task: Partial<TaskFormData>) {
    return this.request<{ success: boolean; data: { task: Task } }>(
      '/tasks',
      { method: 'POST', body: JSON.stringify(task) }
    );
  }

  async updateTask(id: string, task: Partial<TaskFormData>) {
    return this.request<{ success: boolean; data: { task: Task } }>(
      `/tasks/${id}`,
      { method: 'PUT', body: JSON.stringify(task) }
    );
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    return this.request<{ success: boolean; data: { task: Task } }>(
      `/tasks/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) }
    );
  }

  async deleteTask(id: string) {
    return this.request<{ success: boolean; message: string }>(
      `/tasks/${id}`,
      { method: 'DELETE' }
    );
  }
}

export const api = new ApiClient();
