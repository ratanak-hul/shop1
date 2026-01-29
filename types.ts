
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  location: string;
}
