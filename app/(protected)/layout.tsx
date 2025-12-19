import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import {redirect } from "next/navigation";
import { Toaster } from "sonner";
import Header from "@/components/ProtectedUiComponents/ProtectedHeader/Header";



interface LayoutProps {
  children: ReactNode;
}
export default async function DashBoardLayout({
  children,
}: LayoutProps) {
 

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }


  return (
    <div>
      <Header session={session}/>
      <main className="">{children}</main>
      <Toaster/>
    </div>
  );
}