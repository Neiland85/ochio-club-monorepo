export interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    isDefault: boolean;
    recipientName: string;
    recipientPhone: string;
    instructions?: string;
}

export interface AddressSelectorProps {
    addresses: Address[];
    selectedAddressId: string;
    onSelectAddress: (id: string) => void;
}
