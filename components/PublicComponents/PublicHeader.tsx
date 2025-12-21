import Link from "next/link";
import Image from "next/image";

const PublicHeader = () => {
  return (
    <nav className="border-b bg-white px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
       <div className="flex items-center gap-4">
         <Link href="/" className="text-xl flex items-center gap-1 font-bold">
          <Image src={"/MonkArc.svg"} alt="MonkArc" height={80} width={40} />
          <span className="text-lg font-semibold">MonkArc</span>
        </Link>
        <Link href={'/auth/sign-in'}>
        <h1 className="text-sm text-gray-600 hover:text-gray-800 hover:underline">Create your Arc</h1>
        </Link>
        <Link href={'/what-is-monkarc'}>
        <h1 className="text-sm text-gray-600 hover:text-gray-800 hover:underline">What is MonkArc ?</h1>
        </Link>
        <Link href={'/contact'}>
        <h1 className="text-sm text-gray-600 hover:text-gray-800 hover:underline">Contact</h1>
        </Link>
       </div>

        <div className="flex items-center gap-4">
            <Link href={'/auth/sign-in'}>
            <button className="cursor-pointer border  text-white text-sm font-semibold p-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 ">Get Started</button>
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicHeader;
