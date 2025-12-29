'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useParams } from "next/navigation";

interface DropdownMenuProp {
  image: string | null | undefined;
  username:string | null | undefined;
}
export function DropdownMenuHeader({ image,username }: DropdownMenuProp) {

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/sign-in" })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full cursor-pointer border-gray-400">
          <Image
            src={image || ""}
            alt="user-image"
            height={30}
            width={30}
            className="rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href={`/profile/${username}`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href={"#"}>
            <DropdownMenuItem disabled>Billing</DropdownMenuItem>
          </Link>

          <Link href="/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
       <Link href="/support">
            <DropdownMenuItem>Support</DropdownMenuItem>
          </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
         SignOut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
