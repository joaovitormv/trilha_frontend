
export interface User {
  id: number;
  name: string;
  email: string;
  // A senha nunca deve trafegar nas interfaces do frontend por segurança
}

