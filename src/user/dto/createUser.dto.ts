export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthdate: Date;
  status?: string;
}
