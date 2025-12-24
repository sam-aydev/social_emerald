"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized!" };

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const filename = `${user.id}/${Date.now()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from("posts")
      .upload(filename, imageFile);
    if (error) return { error: error.message };

    const {
      data: { publicUrl },
    } = await supabase.storage.from("posts").getPublicUrl(filename);
    imageUrl = publicUrl;
  }
  const { error: insertError } = await supabase.from("posts").insert({
    user_id: user.id,
    content,
    image_url: imageUrl,
  });
  if (insertError) return { error: insertError.message };
  revalidatePath("/app");
  return { success: true };
}

export async function getInfinitePosts({
  pageParam = 0,
}: {
  pageParam: number;
}) {
  const supabase = await createClient();
  const PAGE_SIZE = 5;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `*, profiles!user_id (username, avatar_url), likes (user_id), likes_count:likes(count)`
    )
    .order("created_at", { ascending: false })
    .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

  if (error) return { error: error.message };
  revalidatePath("/app");
  return { data: data };
}

export async function toggleLikePost(postId: string, userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("likes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (data) {
    await supabase
      .from("likes")
      .delete()
      .match({ post_id: postId, user_id: userId });
    return "unliked";
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: userId });
    return "liked";
  }
}

export async function searchUsers(query: string) {
  const supabase = await createClient();
  if (!query) return [];

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", `%${query}%`)
    .limit(10);

  return data || [];
}

export async function getNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("notifications")
    .select(
      `*, actor:profiles!notifications_actor_id_fkey(username, avatar_url)`
    )
    .eq("recipent_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}

export async function toggleFollow(targetId: string, shouldFollow: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) return { error: error?.message };

  try {
    if (shouldFollow) {
      const { error: shouldFollowError } = await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: targetId });
      if (shouldFollowError) return { error: shouldFollowError.message };

      await supabase.from("notifications").insert({
        recipent_id: targetId,
        actor_id: user.id,
        type: "follow",
        read: false,
      });
    } else {
      const { error: noFollowError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetId);

      if (noFollowError) return { error: noFollowError.message };
    }
    revalidatePath(`/app/profile/${targetId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Toogle Follow error");
    return { error: error.message };
  }
}

export async function updateProfile(bio: string, avatarFile: File) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized!" };

  try {
    const updates: any = {
      bio,
      updated_at: new Date().toISOString(),
    };

    if (!bio && !avatarFile)
      return { error: "Please fill at least one field!" };
    if (avatarFile && avatarFile.size > 0) {
      if (!avatarFile.type.startsWith("image/")) {
        return { error: "File must be an image" };
      }
      const filePath = `public/${user.id}/$${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) return { error: uploadError.message };

      const {
        data: { publicUrl },
      } = await supabase.storage.from("avatars").getPublicUrl(filePath);
      updates.avatar_url = publicUrl;

      const { error: dbError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      if (dbError) return { error: dbError.message };
    }
    const { error: dbError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (dbError) return { error: dbError.message };

    revalidatePath(`app/profile/${user.id}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function githubOAuth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
