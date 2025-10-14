import { localStorageManager } from "../../../lib/utils";
import type { ApiResponse } from "../types";
import type { LoginResponse } from "./types";

export const loginResponseMapper = (response: ApiResponse): LoginResponse => {
  const data = response.data || {};

  if (data.access) {
    localStorageManager.setToken(data.access);
  }

  if (data.refresh) {
    localStorageManager.setRefreshToken(data.refresh);
  }

  if (data.name) {
    localStorageManager.setName(data.name);
  }

  return {
    access: data.access || '',
    refresh: data.refresh || '',
    name: data.name || '',
  };
};

export const registerResponseMapper = (response: ApiResponse): object => {
  return response;
};

