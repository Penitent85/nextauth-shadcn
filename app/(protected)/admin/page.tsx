"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const onServerActionClick = async () => {
    admin().then((res) => {
      if ("success" in res) {
        toast.success("Allowed Server Action ");
      } else {
        toast.error("Not Allowed Server Action ");
      }
    });
  };
  const onApiRouteClick = async () => {
    await fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed API Route ");
      } else {
        toast.error("Not Allowed API Route ");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center"> 🔑 Admin </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content " />
        </RoleGate>
        <div
          className="flex flex-row rounded-lg p-3 shadow-md items-center justify-between
        "
        >
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div
          className="flex flex-row rounded-lg p-3 shadow-md items-center justify-between
        "
        >
          <p className="text-sm font-medium">Admin-only Server Action </p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
