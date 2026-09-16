export type LoginCredentials = {
  email: string;
  senha: string;
}

export type UserRole = 'ADMIN' | 'FUNCIONARIO';

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
}