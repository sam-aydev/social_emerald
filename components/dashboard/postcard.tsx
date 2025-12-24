"use client";
import Image from "next/image";
import LikeButton from "./likebutton";
import { motion } from "motion/react";
import Link from "next/link";

export default function PostCard({
  post,
  currentUserId,
  setSelectedPost,
}: any) {
  // console.log(cur);
  return (
    <div className="glass rounded-3xl p-5 border-emerald-900/50  mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/app/profile/${post.user_id}`} className="cursor-pointer">
          <div className="size-10 rounded-full bg-emerald-900 border border-emerald-500/30">
            {post.profiles.avatar_url ? (
              <Image
                src={post.profiles.avatar_url}
                alt="avatar"
                width={600}
                height={600}
                className="w-full h-full object-cover size-30 rounded-full"
              />
            ) : (
              <div className="flex items-center w-full h-full justify-center text-emerald-500 text-xs">
                ?
              </div>
            )}
          </div>
        </Link>

        <div>
          <h3>{post.profiles.username || "No username"}</h3>
          <p className="text-xs text-emerald-500/40">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-emerald-100/80 mb-4 leading-relaxed ">
        {post.content}
      </p>
      {post?.image_url && (
        <motion.div
          layoutId={`image-${post.id}`}
          onClick={() => setSelectedPost(post)}
          className="w-full  aspect-video rounded-2xl bg-black/40 overflow-hidden cursor-zoom-in border border-r-emerald-900/30 relative group"
        >
          <Image
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={post.image_url}
            alt="post"
            width={600}
            height={600}
          />
        </motion.div>
      )}

      <div className="flex items-center gap-6 pt-2  border-t border-emerald-900/30">
        <LikeButton
          postId={post.id}
          initialLiked={post.like?.some(
            (l: any) => l.user_id === currentUserId
          )}
          initialCount={post.likes_count[0]?.count || 0}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
