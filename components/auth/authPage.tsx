"use client";

import { AnimatePresence } from "motion/react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "motion/react";
import { useState } from "react";
import { GithubIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { githubOAuth } from "@/actions";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGithubLogin() {
    await githubOAuth();
    toast.success("Successfully logged in!");
  }
  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user_name = formData.get("username") as string;
    const supabase = await createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return toast.error(error.message);
        }
        toast.success("Welcome back to the Jungle!");
        router.push("/app");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name,
            },
          },
        });
        if (error) return toast.error(error.message);
        toast.success("Your account have been successfully created!");
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%, rgba(16, 185, 129, 0.1), transparent_70%)]" />

      <ToastContainer theme="dark" position="bottom-right" />
      <div className="w-full max-w-md p-4 relative z-10 perspective-[1000px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "Login" : "Sign Up"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="glass rounded-3xl p-8 shadow-2xl border border-emerald-500/20"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b  from-emerald-300  to-emerald-600 ">
                Social Emerald
              </h1>
              <p className="text-emerald-200/60 mt-2 ">Enter Social Emerald</p>
            </div>

            {isLogin ? (
              <form onSubmit={handleAuth} className="space-y-3">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@nmae.ocm"
                    className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-emerald-500/50 transition-all placeholder:text-emerald-700/50"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="John Doe"
                    className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-emerald-500/50 transition-all placeholder:text-emerald-700/50"
                  />
                </div>
                <button className="w-full cursor-pointer bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16, 185, 129, 0.4)] hover:shadow-[0_0_30px_rgba(16, 185, 129, 0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center  items-center">
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-3">
                <div>
                  <input
                    type="Username"
                    name="username"
                    placeholder="johndoe"
                    className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-emerald-500/50 transition-all placeholder:text-emerald-700/50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@nmae.ocm"
                    className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-emerald-500/50 transition-all placeholder:text-emerald-700/50"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="John Doe"
                    className="w-full bg-black/20 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-emerald-500/50 transition-all placeholder:text-emerald-700/50"
                  />
                </div>
                <button className="w-full cursor-pointer bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16, 185, 129, 0.4)] hover:shadow-[0_0_30px_rgba(16, 185, 129, 0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center  items-center">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            )}
            <div className="text-center mt-4">OR</div>

            <button
              onClick={handleGithubLogin}
              className=" cursor-pointer bg-transparent border-2 mt-4 border-emerald-800 rounded-2xl justify-center items-center flex w-full mx-auto text-center p-2"
            >
              <span className="p-2 rounded-full bg-emerald-800">
                <GithubIcon className="size-3" />
              </span>
              <span className="px-2">Continue With Github</span>
            </button>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin((login) => !login)}
                className="cursor-pointer text-emerald-400/80 hover:text-emerald-300 text-sm transition-colors"
              >
                {isLogin
                  ? "New Here? Plant a seed."
                  : "Already have roots? Sign In."}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
