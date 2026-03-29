const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const isAuthRoute = url.startsWith("/auth");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(isAuthRoute ? {} : getHeaders()),
      ...(options?.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    // login: (email: string, password: string) =>
    login: async (email: string, password: string) => {
      const res = await request<{
        success: boolean;
        statusCode: number;
        message: string;
        data: {
          token: string;
          user: any;
        };
        timestamp: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return res.data;
    },
    signup: (email: string, password: string) =>
      request<{
        success: boolean;
        statusCode: number;
        message: string;
        data: { user: { id: string; email: string; role: string } };
        timestamp: string;
      }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },
  meetings: {
    upload: (file: File, onProgress?: (pct: number) => void) => {
      return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress)
            onProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve(JSON.parse(xhr.responseText));
          else reject(new Error("Upload failed"));
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("POST", `${BASE_URL}/meetings/upload`);
        const token = localStorage.getItem("auth_token");
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    list: () => request<any[]>("/meetings/my-meetings"),
    get: (id: string) => request<any>(`/meetings/${id}`),
    getRecent: () => request<any>("/meetings/recent"),
    getDashboard: () => request<any>("/meetings/dashboard"),
  },
  actionItems: {
    getByMeeting: (meetingId: string) =>
      request<any[]>(`/action-items/meetings/${meetingId}/action-items`),
    list: (assignee?: string) =>
      request<any[]>(
        `/action-items/user-meetings`,
      ),
    update: (id: string, data: any) =>
      request<any>(`/action-items/action-items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};
