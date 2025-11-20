import api from "@/api/Axios";

const API_URL = "http://localhost:3000/api/v1/auth";

export async function registerService(data: { username: string; name: string; email: string; password: string }) {
  const res = await api.post(`${API_URL}/register`, data);
  return res.data;
}

export async function loginService(data: { identifier: string; password: string }) {
  const res = await api.post(`${API_URL}/login`, data);
  return res.data;
}

export const getAllThreads = async () => {
  return api.get("/thread");
};

export const createThread = async (formData: FormData) => {
  return api.post("/thread", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getThreadById = async (id: number) => {
  return api.get(`/thread/${id}`);
};

// export const createReply = async (id: number, data: any) => {
//   return api.post(`/thread/${id}/reply`, data);
// };
