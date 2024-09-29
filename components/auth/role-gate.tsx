"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
  const userRole = useCurrentRole();

  if (userRole !== allowedRole) {
    return <FormError message="You don't have permission to view this content ..." />;
  }
  return <>{children}</>;
};
