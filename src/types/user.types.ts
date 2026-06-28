export interface User {
  id: string;
  mobile: string;
  name: string;
  email?: string;
  address?: string;
  pincode?: string;
  city?: string;
  state?: string;
  isAdmin?: boolean;
  createdAt: string;
}