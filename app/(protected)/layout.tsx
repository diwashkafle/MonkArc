import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import {redirect } from "next/navigation";
import { Toaster } from "sonner";
import Header from "@/components/ProtectedUiComponents/ProtectedHeader/Header"; 
import { ensureUsername } from "@/lib/server-actions/user-action";




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

  const username = await ensureUsername(
    session.user.id,
    session.user.name || '',
    session.user.email || ''
  )
  
  // ✅ Add username to session for Navbar
  const updatedSession = {
    ...session,
    user: {
      ...session.user,
      username, // Now guaranteed to exist
    }
  }
  



  return (
    <div>
      <Header session={updatedSession}/>
     
      <main className="">{children}</main>
      <Toaster/>
    </div>
  );
}