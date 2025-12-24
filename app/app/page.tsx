import DashboardComp from "@/components/dashboard/dashboardcomp";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return;
  }

  return <DashboardComp currentUserId={data?.user.id} />;
}


export const metadata: Metadata ={
  title: "Social Emerald Dashboard"
}