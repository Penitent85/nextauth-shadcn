import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900 to-black">
      {children}
    </div>
  );
};

export default AuthLayout;
