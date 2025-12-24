import { toggleLikePost } from "@/actions";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  currentUserId,
}: any) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);

    setCount((prev: any) => (newLiked ? prev + 1 : prev - 1));
    if (newLiked) setIsAnimating(true);
    await toggleLikePost(postId, currentUserId);
  }
  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-2 group relative cursor-pointer"
    >
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="absolute inset-0 bg-emerald-400 rounded-full blur-sm"
          />
        )}
      </AnimatePresence>
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={liked ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
      >
        <Heart
          className={`transition-colors duration-300 ${
            liked ? "text-emrald-400" : "text-emerald-700"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            liked ? "text-emerald-400" : "text-emerald-700"
          }`}
        >
          {count}
        </span>
      </motion.div>
    </button>
  );
}
