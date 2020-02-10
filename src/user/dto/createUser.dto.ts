export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthdate: string;
  status?: string;
  createdAt?: string;
}
