import { signOut } from "@/auth";

export const logout = async () => {
  // server-side code
  await signOut();
};
