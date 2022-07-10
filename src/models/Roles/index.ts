export interface RoleDto{
  id: string;
  key: string;
  name: string;
  permission: {
    name: string;
    key: string;
  }[]
}
