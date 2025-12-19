import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

interface DropdownMenuProp{
    image:string | null | undefined;
}
export function DropdownMenuHeader({image}:DropdownMenuProp) {
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
         <Link href={'/profile'}>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
         </Link>
         <Link href={'#'}>
          <DropdownMenuItem disabled>
            Billing
          </DropdownMenuItem>
         </Link>
         
           <Link
              href="/settings"
            >
                 <DropdownMenuItem>
                    Settings
                 </DropdownMenuItem>
              
            </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton/>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
