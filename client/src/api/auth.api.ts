import { api } from "./axios";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const baseURL = `/api/auth`;

export const authApi = {

  signup(data: SignupData) {
    return api.post(`${baseURL}/signup`, data);
  },

  login(data: LoginData) {
    return api.post(`${baseURL}/login`, data);
  },

  logout() {
    return api.post(`${baseURL}/logout`);
  },

  me() {
    return api.get(`${baseURL}/me`);
  },
};
