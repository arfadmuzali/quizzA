import axios from "axios";
import { createClient } from "./supabase/client";

const authApi = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await createClient().auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authApi;
