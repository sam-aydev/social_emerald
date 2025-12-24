"use client";
import { motion } from "motion/react";
import MainFeed from "./mainfeed";

export default function DashboardComp({currentUserId}: any) {
  return (
    <div className="max-w-2xl mx-auto pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8 sticky top-0 bg-[#022c22]"
      >
        <h2 className="text-xl font-bold text-emerald-50">Stream</h2>
        <p className="text-emerald-500/60 text-sm">Live from the ecosystem</p>
      </motion.div>

      <MainFeed currentUserId={currentUserId}/>
    </div>
  );
}
