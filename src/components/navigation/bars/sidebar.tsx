import { Link } from "rakkasjs";
import { Home } from "lucide-react";
import { MiniSettingsModal } from "../mini-settings/MiniSettings";


interface SidebarProps {}

export function Sidebar({}: SidebarProps) {
  return (
    <header
      className="stickt top-0 min-h-[99vh]  flex flex-col  justify-between items-center   
    z-30 gap-1 "
    >
      <div className="w-full h-full flex flex-col justify-between items-center bg-primary p-2 pb-12 pt-3">
        <Link href="/" className="text-2xl font-bold">
          <Home />
        </Link>
        <Link
          href="/"
          className="text-3xl  items-center flex gap-3 
        hover:bg-base-300 
        rounded-lg p-2 lg:p-4"
        >
          <Home />
          <div className="hidden lg:flex text-2xl fornt-bold">Home</div>
        </Link>
        <MiniSettingsModal />
      </div>
    </header>
  );
}
