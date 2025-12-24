"use client";
import { getNotifications } from "@/actions";
import { createClient } from "@/lib/supabase/client";
import { createBrowserClient } from "@supabase/ssr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ActivityPage() {
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  const queryClient = useQueryClient();

  useEffect(
    function () {
      const channel = supabase
        .channel("realtime-activity")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
          },
          (payload) => {
            toast.info("New activity detected!");

            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    [supabase, queryClient]
  );
  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-50 mb-8">Activity</h1>
      <div className="space-y-4">
        {notifications?.map((notify, i) => (
          <div
            key={i}
            className="glass p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-emerald-500"
          >
            <div>
              {notify.type === "like" && (
                <Heart
                  size={18}
                  className="text-emerald-400 fill-emerald-400"
                />
              )}
              {notify.type === "follow" && (
                <UserPlus size={18} className="text-emerald-400" />
              )}
            </div>

            <div className="flex-1 ">
              <p className="text-emerald-50 flex space-x-3">
                <span>{notify.actor.username}</span>
                <span>
                  {notify.type === "like" ? "liked your post" : "follows you!"}
                </span>
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                {new Date(notify?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {notifications?.length === 0 && (
          <p className="text-center text-emerald-800">No signal yet!</p>
        )}
      </div>
    </div>
  );
}
