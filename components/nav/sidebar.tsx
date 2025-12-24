"use client";
import { useUIStore } from "@/lib/store/ui-store";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Hexagon,
  Home,
  Loader2,
  LogOut,
  PlusCircle,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>("");
  const { openCreateModal } = useUIStore();
  const router = useRouter();
  const path = usePathname();
  useEffect(
    function () {
      async function getUser() {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        setCurrentUser(user?.id);
        if (error) return toast.error(error.message);
      }

      getUser();
    },
    [currentUser]
  );
  const NavItem = ({ href, icon: Icon, label, active }: any) => {
    return (
      <Link
        href={href}
        className={`${
          active
            ? "text-emerald-400 bg-emerald-900/30 "
            : "text-emerald-700/70 hover:text-emerald-400"
        } flex items-center mb-2 gap-4 text-emerald-100/60 hover:text-emerald-400 hover:bg-emerald-900/20 px-4 py-3 rounded-xl transition-all group`}
      >
        <Icon
          className="group-hover:drop-shadow-[0_0_5px_rgba(16, 185, 129, 0.5)] transition-all"
          size={24}
        />
        <span className="font-medium text-lg">{label}</span>
      </Link>
    );
  };

  async function handleLogout() {
    try {
      setIsLoading(true);
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();
      if (!error) {
        toast.success("You are logged out!");
        router.replace("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <aside className="hidden md:flex w-64 h-screen flex-col border-r border-emerald-900/30 fixed left-0 top-0 bg-[#022c22]/95 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <Hexagon
          className="text-emerald-500 fill-emerald-500/20 animate-pulse"
          size={32}
        />
        <h1 className="text-2xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
          Social Emerald
        </h1>
      </div>
      <nav>
        <NavItem
          href="/app"
          icon={Home}
          label="Home"
          active={path === "/app"}
        />
        <NavItem
          href="/app/explore"
          icon={Search}
          label="Explore"
          active={path === "/app/explore"}
        />
        <NavItem
          href="/app/activity"
          icon={Bell}
          label="Activity"
          active={path === "/app/activity"}
        />
        <NavItem
          href={`/app/profile/${currentUser}`}
          icon={User}
          label="Profile"
          active={path === `/app/profile/${currentUser}`}
        />

        <button
          onClick={openCreateModal}
          className="cursor-pointer w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform scale-[1.02] "
        >
          <PlusCircle size={20} />
          <span>New Post</span>
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-10 cursor-pointer flex justify-center items-center gap-4 text-emerald-700 hover:text-red-400 px-4 py-3 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <LogOut size={20} />
            <span>Logout</span>
          </>
        )}
      </button>
    </aside>
  );
}
