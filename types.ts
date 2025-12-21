
export interface Car {
  _id?: string;
  id: string; // fallback for local state
  name: string;
  brand: string;
  acceleration: string;
  power: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export interface User {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isAdmin: boolean;
}

export interface CartItem {
  carId: string;
  quantity: number;
}
