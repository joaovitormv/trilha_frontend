export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  password?: string;
}