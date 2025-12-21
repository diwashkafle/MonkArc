import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { DropdownMenuHeader } from "@/components/ProtectedUiComponents/ProtectedHeader/UserDropDownMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LiaBookMedicalSolid } from "react-icons/lia";
import { MdOutlineDashboard } from "react-icons/md";
const PublicHeader = async() => { 
  const session = await auth();

  return ( 
    <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
             <Link href="/" className="text-xl flex items-center gap-1 font-bold">
          <Image src={"/MonkArc.svg"} alt="MonkArc" height={80} width={40} />
          <span className="text-lg font-semibold">MonkArc</span>
        </Link> 
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it Works</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Price</Link>
            </div>
            <div className="flex items-center gap-4">
             {
              session ?  
              <div className="flex items-center gap-4">
                <Link href={'/journey/new'}>
              <Tooltip>
      <TooltipTrigger asChild>
        <button className="border border-gray-300 cursor-pointer rounded-md p-1"><LiaBookMedicalSolid className="text-gray-700" size={25}/></button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Create new journey</p>
      </TooltipContent>
    </Tooltip>
          </Link>
          <Link href={'/dashboard'}>
          
          <Tooltip>
      <TooltipTrigger asChild>
        <button className="border border-gray-300 cursor-pointer rounded-md p-1"><MdOutlineDashboard className="text-gray-700" size={25}/></button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Go to Dashboard</p>
      </TooltipContent>
    </Tooltip>
          </Link>

          <DropdownMenuHeader username={session?.user.username} image={session?.user.image} />
              </div>
          : <Link
                href="/auth/sign-in"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Get Started
              </Link>
             }
            </div>
          </div>
        </div>
      </nav>
  );
};

export default PublicHeader;
