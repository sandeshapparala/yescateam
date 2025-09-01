import YescaHome from "./components/YescaHome";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <ThemeToggle />
        <Link 
          href="/home" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md flex items-center h-12"
        >
          View Gallery
        </Link>
      </div>
      <YescaHome />
    </>
  );
}
