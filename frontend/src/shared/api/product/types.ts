export type ProductPayload = {
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


export type ProductIdPayload = {
    productId: string;
}
