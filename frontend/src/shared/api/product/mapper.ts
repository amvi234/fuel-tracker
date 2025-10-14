import type { ApiResponse } from "../types";
import type { ProductPayload } from "./types";

export const listProductResponseMapper = (response: ApiResponse): ProductPayload[] => {
    const data = response.data || {};
    return data;
}
