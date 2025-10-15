export type ProductPayload = {
    id: string;
    name: string;
    odometer: string;
    station_name: string;
    fuel_brand: string;
    fuel_grade: string;
    quantity: number;
    total_amount: number;
}


export type ProductIdPayload = {
    productId: string;
}
