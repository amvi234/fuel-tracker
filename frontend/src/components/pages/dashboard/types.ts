// Types.
export interface Product {
  id: string;
  name: string;
  category: string;
  cost_price: string;
  selling_price: string;
  description: string;
  stock_available: number;
  units_sold: number;
  demand_forecast: number | null;
  optimized_price?: string;
}

export interface FormData {
  name: string;
  category: string;
  cost_price: string;
  selling_price: string;
  description: string;
  stock_available: string;
  units_sold: string;
  demand_forecast: string;
  optimized_price: string;
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}


export interface CategoryOption {
    value: string;
    label: string;
  }