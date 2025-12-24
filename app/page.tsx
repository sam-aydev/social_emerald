import Home from "@/components/auth/authPage";
import { Metadata } from "next";

export default function Page() {
  return <Home />;
}

export const metadata: Metadata = {
  title: "Social Emerald Web App",
  description: "A social media for connecting people in the agro field!",
};
