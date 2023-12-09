import { Icons } from "@/components/icons/Iconts";
import { Timeline } from "@/components/posts/timeline/Timeline";
import { useUser } from "@/lib/rakkas/hooks/useUser";
import { LayoutDashboard, Receipt, Store, Users2Icon } from "lucide-react";
import { Link, PageProps } from "rakkasjs";

export default function HomePage({}: PageProps) {
  const parts = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-8 h-8" />,
    },

  ];
  const {user} = useUser()
  return (
    <main className="flex flex-col items-center justify-center w-full max-h-screen overflow-y-scroll h-full gap-3">
      {/* <Icons.lost className="w-[30%] h-[30%] fill-primary" />
        <Icons.gopher /> */}
      {/* <div className="flex flex-wrap sm:items-center justify-center w-full h-full gap-3">
        {parts.map((part) => (
          <Link
            key={part.href}
            href={part.href}
            className="h-32 sm:h-[200px] w-[90%] md:w-[40%] flex flex-col items-center justify-center  bg-base-200 shadow-xl 
              hover:text-accent  rounded-lg"
          >
            <div
              className="text-4xl font-bold hover:scale-[200%] duration-200 transition-transform 
            flex gap-8 items-center justify-center"
            >
              {part.icon}
              <> {part.name} </>
            </div>
          </Link>
        ))}
      </div> */}
      <Timeline 
      user={user}
      main_key="custom_pocketbook_posts" />
    </main>
  );
}
