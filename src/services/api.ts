const BASE_URL = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: { ...getHeaders(), ...(options?.headers || {}) },
  });
  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (email: string, password: string, name: string) =>
      request<{ token: string; user: any }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
  },
  meetings: {
    upload: (file: File, onProgress?: (pct: number) => void) => {
      return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
          else reject(new Error('Upload failed'));
        });
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', `${BASE_URL}/meetings/upload`);
        const token = localStorage.getItem('auth_token');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    list: () => request<any[]>('/meetings/my-meetings'),
    get: (id: string) => request<any>(`/meetings/${id}`),
  },
  actionItems: {
    getByMeeting: (meetingId: string) =>
      request<any[]>(`/action-items/meetings/${meetingId}/action-items`),
    list: (assignee?: string) =>
      request<any[]>(`/action-items/action-items${assignee ? `?assignee=${assignee}` : ''}`),
    update: (id: string, data: any) =>
      request<any>(`/action-items/action-items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
};
