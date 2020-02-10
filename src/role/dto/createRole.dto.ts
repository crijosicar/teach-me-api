export interface CreateRoleDto {
  name: string;
  description: string;
  permissions?: string[];
  status?: string;
  createdAt?: string;
}
