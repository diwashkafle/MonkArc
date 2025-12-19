import Link from "next/link";
import type { Session } from "next-auth";
import Image from "next/image";
import { DropdownMenuHeader } from "./UserDropDownMenu";
import { MdDashboard } from "react-icons/md";

type HeaderProp = {
  session: Session | null;
};
const Header = ({ session }: HeaderProp) => {
  return (
    <nav className="border-b bg-white px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          <Image src={"/MonkArc.svg"} alt="MonkArc" height={80} width={40} />
        </Link>

        <div className="flex items-center gap-4">
          <Link className="border border-gray-300 rounded-lg p-1" href={'/dashboard'}>
          <MdDashboard className="text-gray-700" size={25}/>
          </Link>
          <DropdownMenuHeader image={session?.user.image} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
