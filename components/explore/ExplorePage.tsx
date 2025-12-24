"use client";
import { searchUsers } from "@/actions";
import { PowerOffIcon, SearchIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ExplorePage() {
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(term: string) {
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const users: any = await searchUsers(term);
    setResults(users);
    setIsSearching(false);
  }
  console.log(results);
  return (
    <div className="pt-8 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-50 mb-6">Explore</h1>

      <div className="relative mb-8 ">
        <SearchIcon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 "
          size={20}
        />
        <input
          onChange={(e: any) => handleSearch(e.target.value)}
          type="text"
          placeholder="Find others...."
          className="w-full bg-[#031c16] border border-emerald-900 rounded-2xl py-4 pl-12 pr-4 text-emerald-50 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        />
      </div>

      <div className="grid gap-4">
        {results?.map((user, i) => (
          <div key={i}>
            <Link
              href={`/app/${user.username}`}
              className="glass p-4 rounded-2xl flex items-center justify-between group hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                {user.avatar_url ? (
                  <div className="size-12 rounded-full bg-emerald-900 overflow-hidden">
                    <Image
                      src={user.avatar_url}
                      width={500}
                      height={500}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <User size={32} />
                )}
                <div>
                  <p className="font-bold text-emerald-50">{user.username}</p>
                  {/* <p className="text-emerald-500/60 text-sm">{user.email}</p> */}
                </div>
              </div>
            </Link>
          </div>
        ))}

        {!isSearching && results.length === 0 && (
          <div className="text-center text-emerald-400 mt-10">
            <p>Search to discover</p>
          </div>
        )}
      </div>
    </div>
  );
}
