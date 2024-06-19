export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: number;
  address?: string;
  role: 'admin' | 'user';
};

export type TLoginUser = {
  email: string;
  password: string;
};
