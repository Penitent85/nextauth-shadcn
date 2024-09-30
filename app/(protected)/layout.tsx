import React from "react";
import Navbar from "./_components/navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className=" h-full w-full flex flex-col gap-y-10 items-center justify-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 to-black"
    >
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
