"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

import { useCurrentUser } from "@/hooks/use-current-user";
import LoginButton from "./login-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";


const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className=" bg-sky-500 ">
            <FaUser className=" text-white " />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-40" align="end">
        <LoginButton>
          <DropdownMenuItem onClick={()=>signOut()}>
            <ExitIcon className=" w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LoginButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
