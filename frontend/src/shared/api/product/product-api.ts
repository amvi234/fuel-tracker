import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { ApiErrorResponse, ApiResponse } from "../types";
import type { ProductIdPayload, ProductPayload } from "./types";

// List Products
export const listProductsRequest = async (params?: { category?: string; search?: string }): Promise<ApiResponse<ProductPayload[]>> => {
  const queryParams = new URLSearchParams();
  if (params?.category && params.category !== 'all') {
    queryParams.append('category', params.category);
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  const url = `/product/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await api.get<ApiResponse<ProductPayload[]>>(url);
  return res.data;
}

export const useListProducts = (params?: { category?: string; search?: string }) =>
  useQuery<ApiResponse<ProductPayload[]>>({
    queryKey: ["products", params],
    queryFn: () => listProductsRequest(params),
  })

// Create Product
const createProductRequest = async (payload: Omit<ProductPayload, 'id'>): Promise<ApiResponse<ProductPayload>> => {
  const res = await api.post<ApiResponse<ProductPayload>>('/product/', payload);
  return res.data;
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ProductPayload>, ApiErrorResponse, Omit<ProductPayload, 'id'>>({
    mutationFn: createProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Update Product
const updateProductRequest = async (payload: { id: string } & Partial<ProductPayload>): Promise<ApiResponse<ProductPayload>> => {
    const { id, ...data } = payload;
    const res = await api.put<ApiResponse<ProductPayload>>(`/product/${id}/`, data); 
    return res.data;
  }
  
  

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ProductPayload>, ApiErrorResponse, { id: string } & Partial<ProductPayload>>({
    mutationFn: updateProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Delete Product
const deleteProductRequest = async (payload: ProductIdPayload): Promise<ApiResponse> =>
  await api.delete(`/product/${payload.productId}/`);

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse, ApiErrorResponse, ProductIdPayload>({
    mutationFn: deleteProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}