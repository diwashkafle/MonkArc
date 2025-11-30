import Link from "next/link";

export default function Home() {
  return (
   <main className="flex w-full h-screen flex-col justify-center items-center">
    This is main page
    <Link href={'/dashboard'}>
    <button className="p-2 cursor-pointer border border-gray-300 rounded-2xl">
          Click here to route to dashboard
    </button>
    </Link>
   </main>
  );
}
