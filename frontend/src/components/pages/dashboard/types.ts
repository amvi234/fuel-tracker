// Types.
export interface Product {
  id: string;
  name: string;
  odometer: string;
  station_name: string;
  fuel_brand: string;
  fuel_grade: string;
  quantity: string;
  total_amount: string;
}

export interface FormData {
  name: string;
  odometer: string;
  station_name: string;
  fuel_brand: string;
  fuel_grade: string;
  quantity: string;
  total_amount: string;
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}


export interface CategoryOption {
    value: string;
    label: string;
  }