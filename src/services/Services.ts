import api from "@/api/Axios";

export interface QueryParams {
  thread_id: number;
}

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

export const getRepliesByThreadId = async (queryparams: QueryParams) => {
  try {
    const response = await api.get(`/reply`, {
      params: queryparams,
    });

    return response.data.data.replies;
  } catch (error) {
    console.error("Error getReplies:", error);
    return [];
  }
};

export const createReply = async (queryparams: QueryParams, formdata: FormData) => {
  return api.post(`/reply`, formdata, {
    params: queryparams,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProfileService = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateProfileService = async (formData: FormData) => {
  const res = api.patch("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data?.data ?? res.data;
};

export const getFollows = async (type: "followers" | "following") => {
  const res = await api.get("/follows", { params: { type } });
  return res.data;
};

export const followUser = async (followed_user_id: number) => {
  const res = await api.post("/follows", { followed_user_id });
  return res.data;
};

export const unfollowUser = async (followed_id: number) => {
  const res = await api.delete("/follows", { data: { followed_id } });
  return res.data;
};

export async function getSuggestedService() {
  const res = await api.get("/suggested");
  return res.data.data;
}
