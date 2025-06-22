export interface AdminPanelProps {
    users: AdminUser[];
    bakeries: AdminBakery[];
    products: AdminProduct[];
    orders: AdminOrder[];
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AdminBakery {
    id: string;
    name: string;
    location: string;
}

export interface AdminProduct {
    id: string;
    name: string;
    price: number;
}

export interface AdminOrder {
    id: string;
    customerName: string;
    total: number;
}
