import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_WALLET_HOST,
});

export const setAuthToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default instance;
