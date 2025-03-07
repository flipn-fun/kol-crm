import { storageStore } from "@/utils";
import { create } from "zustand";

const authStorage = storageStore("auth");

interface AuthState {
  token: string | undefined;
  setToken: (token: string | undefined, address?: string) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: undefined,
  setToken: (token, address) => {
    if (address) {
      authStorage?.set(`token:${address}`, token);
    }
    set({ token });
  },
}));

export const getAddressToken = (address?: string) => {
  if (!address) return undefined;
  return authStorage?.get<string>(`token:${address}`);
};
