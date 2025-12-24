"use client";
import { toggleFollow, updateProfile } from "@/actions";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogOutIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

type ProfileViewProps = {
  initialProfile: any;
  initialPosts: any[];
  stats: { followers: number; following: number; postCount: number };
  isFollowing: boolean;
  currentUser: any;
};
export default function ProfileView({
  initialProfile,
  initialPosts,
  stats,
  isFollowing,
  currentUser,
}: ProfileViewProps) {
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);
  const [localFollowers, setLocalFollowers] = useState(stats.followers);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const isMe = currentUser?.id === initialProfile.id;

  async function handleFollow() {
    if (isMe) return;
    const newStatus = !isFollowing;
    setLocalIsFollowing(newStatus);

    setLocalFollowers((prev) => (newStatus ? prev + 1 : prev - 1));

    startTransition(async () => {
      const result = await toggleFollow(initialProfile.id, newStatus);
      console.log(result);
      if (result?.error || !result?.success) {
        setLocalIsFollowing(!newStatus);
        setLocalFollowers((prev) => (newStatus ? prev - 1 : prev + 1));
        toast.error(result?.error);
      }
      toast.success(newStatus ? "Following" : "Unfollowed");
    });
  }
  async function handleEditProfile(e: any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File;
    startTransition(async () => {
      const { error } = await updateProfile(bio, avatarFile);

      if (error) {
        toast.error(error);
      }
      toast.success("Successfully updated!");
      setIsEditOpen(false);
    });
  }

  async function signOut() {
    setIsLoading(true);
    const supabase = await createClient();
    await supabase.auth.signOut();
    replace("/");
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-balck text-white  pb-20">
      <div className="max-w-4xl mx-auto pt-12 px-6">
        <LogOutIcon
          className="md:hidden cursor-pointer bg-emerald-800 rounded-full p-2 hover:bg-emerald-700"
          onClick={signOut}
          size={32}
        />
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative size-32 md:size-40 rounded-full border-4 border-emerald-500/20">
            {initialProfile.avatar_url ? (
              <Image
                src={initialProfile.avatar_url}
                width={500}
                height={500}
                alt="avatar"
                className="object-cover rounded-full size-30 md:size-38"
              />
            ) : (
              <div className="flex items-center w-full h-full justify-center text-emerald-500 text-lg">
                ?
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-5">
            <div className="flex flex-col md:flex-row gap-5 justify-center md:justify-between ">
              <h1>{initialProfile.username}</h1>
              {isMe ? (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="px-6 py-2 rounded-full bg-emerald-800 cursor-pointer"
                >
                  Edit profile
                </button>
              ) : (
                <button
                  onClick={() => handleFollow()}
                  className={`cursor-pointer px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    localIsFollowing
                      ? "bg-transparent border border-emerald-700 text-emerald-400  hover:text-red-400 hover:border-red-900"
                      : "bg-emerald-800 text-white hover:bg-emrald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  }`}
                >
                  {localIsFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <div className="flex gap-8 justify-center md:justify-start text-sm">
              <div className="text-center md:text-left">
                <span className="block font-bold text-lg text-emerald-400">
                  {stats.postCount}
                </span>
                <span className="text-emerald-500">posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-bold text-lg text-emerald-400">
                  {localFollowers}
                </span>
                <span className="text-emerald-500">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-bold text-lg text-emerald-400">
                  {stats.following}
                </span>
                <span className="text-emerald-500">following</span>
              </div>
            </div>

            <p className="text-emerald-300 max-w-lg mx-auto md:mx-0 whitespace-pre-wrap leading-relaxed">
              {initialProfile.bio || "Member of Social Emerald"}
            </p>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-950 border-emerald-900/40 p-6 rounded-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button
                  className="cursor-pointer"
                  onClick={() => setIsEditOpen(false)}
                >
                  <X className="text-emerald-500 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleEditProfile}>
                <div>
                  <label className="block text-xs font-bold text-emerald-500 uppercase mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    defaultValue={initialProfile.bio || ""}
                    id=""
                    className="w-full resize-none bg-transparent border border-emerald-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors min-h-[100px]"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-500 mb-2 uppercase">
                    Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    className="block w-full text-sm text-emerald-400 file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-emerald-900 file:text-emerald-100 hover:file:bg-emerald-800 cursor-pointer"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-emerald-900 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
