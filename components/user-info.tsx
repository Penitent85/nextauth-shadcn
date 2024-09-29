import { ExtendedUser } from "@/next-auth";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label?: string;
}
const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className=" w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className=" space-y-4">
        <div className=" flex items-center flex-row justify-between border  p-3 shadow-sm">
          <p className=" text-sm font-medium  ">ID</p>
          <p className="truncate  text-xs max-w-[180px]  bg-slate-100 font-mono ">
            {" "}
            {user?.id}
          </p>
        </div>
        <div className=" flex items-center flex-row justify-between border  p-3 shadow-sm">
          <p className=" text-sm font-medium  ">Name</p>
          <p className="truncate  text-xs max-w-[180px]  bg-slate-100 font-mono ">
            {" "}
            {user?.name}
          </p>
        </div>
        <div className=" flex items-center flex-row justify-between border  p-3 shadow-sm">
          <p className=" text-sm font-medium  ">Email</p>
          <p className="truncate  text-xs max-w-[180px]  bg-slate-100 font-mono ">
            {" "}
            {user?.email}
          </p>
        </div>
        <div className=" flex items-center flex-row justify-between border  p-3 shadow-sm">
          <p className=" text-sm font-medium  ">Role</p>
          <p className="truncate  text-xs max-w-[180px]  bg-slate-100 font-mono ">
            {" "}
            {user?.role}
          </p>
        </div>
        <div className=" flex items-center flex-row justify-between border  p-3 shadow-sm">
          <p className=" text-sm font-medium  ">user Authentication</p>

          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
