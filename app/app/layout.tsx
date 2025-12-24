"use client";
import { MobileNav } from "@/components/nav/mobile-nav";
import Sidebar from "@/components/nav/sidebar";
import CreateModalPost from "@/components/ui/create-modal-post";
import { useUIStore } from "@/lib/store/ui-store";
import { ToastContainer } from "react-toastify";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isCreateModalOpen, closeCreateModal } = useUIStore();
  return (
    <div className="min-h-screen bg-[#022c22] ">
      <Sidebar />
      <main className="md:ml-64 min-h-screen pb-24 md:pb-0">{children}</main>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <CreateModalPost isOpen={isCreateModalOpen} onClose={closeCreateModal} />
      <ToastContainer theme="dark" />
    </div>
  );
}
