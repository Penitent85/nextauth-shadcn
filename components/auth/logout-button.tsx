"use client";

import { logout } from "@/actions/logout";
import { signOut } from "@/auth";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
    // signOut();
  };
  return (
    <span className="  cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
