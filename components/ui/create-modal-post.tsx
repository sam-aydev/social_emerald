"use client";
import { createPost } from "@/actions";
import { useUIStore } from "@/lib/store/ui-store";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookMarked,
  CheckCircle,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateModalPost({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsloading] = useState(false);
  const [upload, setUpload] = useState(false);
  const { closeCreateModal } = useUIStore();
  const queryClient = useQueryClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsloading(true);
      const formData = new FormData(e.currentTarget);
      const { error, success } = await createPost(formData);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (success) {
        toast.success("Broadcasted to the ecosystem");
        onClose();
      }
      toast.error(error);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsloading(false);
      setUpload(false);
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center h-screen p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute  inset-0 bg-black/80 backdrop-blur-sm h-screen flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-5/6 mx-auto  rounded-3xl max-w-lg glass p-6 relative bg-[#022c22] border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
              <button
                onClick={closeCreateModal}
                className="absolute cursor-pointer top-4 right-4 text-emerald-500/50 hover:text-emerald-400"
              >
                <X size={24} />
              </button>
              <h2 className="text-lg fontbold text-emerald-50 mb-6">
                New Transmission
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  name="content"
                  placeholder="What is growing?"
                  className="resize-none w-full bg-black/20 border border-emerald-900/50 rounded-xl p-4 text-emerald-50 placeholder:text-emerald-800 focus:outline-none focus:border-emerald-500/50 min-h-[150px] "
                ></textarea>
                <div className="flex items-center justify-between pt-4 border-t  border-emerald-300">
                  <label className="cursor-pointer p-2  hover:bg-emerald-900/30 rounded-full text-emerald-600 transition-colors">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={() => setUpload(true)}
                    />
                    {upload ? <CheckCircle size={20} /> : <Upload size={20} />}
                  </label>
                  <button className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all">
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
