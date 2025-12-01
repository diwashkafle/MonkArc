import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import {redirect } from "next/navigation";
import { Toaster } from "sonner";



interface LayoutProps {
  children: ReactNode;
}
export default async function DashBoardLayout({
  children,
}: LayoutProps) {
 

  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }


  return (
    <div>
      <main className="">{children}</main>
      <Toaster/>
    </div>
  );
}