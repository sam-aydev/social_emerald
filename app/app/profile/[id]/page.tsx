import ProfileView from "@/components/profile/ProfileView";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Profile({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const [profileRes, postRes, followerRes, followingRes, isFollowingRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),

      supabase
        .from("posts")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false }),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id),

      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", id),

      currentUser
        ? supabase
            .from("follows")
            .select("*")
            .eq("follower_id", currentUser.id)
            .eq("following_id", id)
            .single()
        : Promise.resolve({ data: null }),
    ]);
  console.log(postRes.data?.length);
  if (!profileRes.data) return notFound();

  return (
    <ProfileView
      initialProfile={profileRes.data}
      initialPosts={postRes.data || []}
      stats={{
        followers: followerRes.count || 0,
        following: followingRes.count || 0,
        postCount: postRes.data?.length || 0,
      }}
      isFollowing={!!isFollowingRes.data}
      currentUser={currentUser}
    />
  );
}

export async function generateMetadata() {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  return {
    title: `${currentUser?.user_metadata?.user_name} profile page`,
  };
}
