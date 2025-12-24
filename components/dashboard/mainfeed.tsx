"use client";
import { AnimatePresence, motion } from "motion/react";
import PostCard from "./postcard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfinitePosts } from "@/actions";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

export default function MainFeed({ currentUserId }: any) {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  console.log(selectedPost);
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: getInfinitePosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage: any, allPages) =>
        lastPage?.length === 5 ? allPages.length : undefined,
    });

  useEffect(
    function () {
      if (inView && hasNextPage) fetchNextPage();
    },
    [inView, hasNextPage]
  );

  if (status === "pending")
    return (
      <div className="text-emerald-500 text-center mt-20">
        <Loader2 className="animate-spin inline mr-2 " />
        Syncing Ecosystem...
      </div>
    );

  console.log(data?.pages);
  return (
    <div className="max-w-xl mx-auto pb-32">
      {data?.pages.map((group, i): any => (
        <div key={i}>
          {group?.data?.map((post: any) => (
            <PostCard key={post.id} post={post} setSelectedPost={setSelectedPost} currentUserId={currentUserId} />
          ))}
        </div>
      ))}

      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <Loader2 className="text-emerald-500 animate-spin" />
        )}
      </div>

      {selectedPost && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e: any) => e.stopPropagation()}
            >
              <button
                className="cursor-pointer absolute -top-12 right-0 text-white p-2"
                onClick={() => setSelectedPost(null)}
              >
                <X size={24} />
              </button>
              {selectedPost?.image_url && (
                <motion.div
                  layoutId={`image-${selectedPost?.id}`}
                  className="w-full rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                >
                  <Image
                    src={selectedPost?.image_url}
                    alt="image"
                    width={600}
                    height={600}
                    className="w-full h-auto max-h-[80vh] object-contain bg-[#022c22]"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
