export type Executive = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "org_admin" | "authority_user" | "observer";
  isActive: boolean;
  createdAt: string;
  organizationId?: number | null;
  organization?: { name: string };
  lastLoginAt: string;
  updatedAt: string;
};
