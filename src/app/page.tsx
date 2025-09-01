import YescaHome from "./components/YescaHome";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Link 
          href="/home" 
          className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors shadow-md"
        >
          View Gallery
        </Link>
      </div>
      <YescaHome />
    </>
  );
}
