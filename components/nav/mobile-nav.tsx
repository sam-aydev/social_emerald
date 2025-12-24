"use client";
import { useUIStore } from "@/lib/store/ui-store";
import { createClient } from "@/lib/supabase/client";
import { Bell, Home, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function MobileNav() {
  const path = usePathname();
  const { openCreateModal } = useUIStore();
  const [currentUser, setCurrentUser] = useState<any>("");

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
  const NavItem = ({ href, icon: Icon, active }: any) => {
    return (
      <Link
        href={href}
        className={`p-3 rounded-full transition-all duration-300 ${
          active
            ? "text-emerald-400 bg-emerald-900/30 "
            : "text-emerald-700/70 hover:text-emerald-400"
        }`}
      >
        <Icon size={24} />
      </Link>
    );
  };
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass rounded-full px-6 py-3 flex justify-between items-center shadow-2xl">
        <NavItem href="/app" icon={Home} active={path === "/app"} />
        <NavItem
          href="/app/explore"
          icon={Search}
          active={path === "/app/explore"}
        />

        <button
          onClick={openCreateModal}
          className="bg-emerald-500  text-black p-3 rounded-full -mt-8 cursor-pointer  shadow-[0_0_20px_rgba(16,185,129,0.5)]  border-4 border-[#022c22] transform hover:scale-110 transition-transform"
        >
          <Plus strokeWidth={3} size={28} />
        </button>

        <NavItem
          href="/app/activity"
          icon={Bell}
          active={path === "/app/activity"}
        />
        <NavItem
          href={`/app/profile/${currentUser}`}
          icon={User}
          active={path === `/app/profile/${currentUser}`}
        />
      </div>
    </div>
  );
}
