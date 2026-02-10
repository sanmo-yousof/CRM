export type Users = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "org_admin" | "authority_user" | "observer";
  isActive: boolean;
  createdAt: string;
  organizationId?: number | null;
  lastLoginAt: string;
  updatedAt: string;
};