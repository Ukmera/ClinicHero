"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, RotateCcw, User, Stethoscope, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { playRetroSound } from "@/lib/rpg/audio";

export default function BottomNav() {
  const pathname = usePathname();

  // Ne pas afficher la barre de navigation pendant une session d'exercice pour une concentration maximale
  if (pathname.startsWith("/session/")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Donjons", icon: Compass },
    { href: "/simulations", label: "Laboratoire", icon: Stethoscope },
    { href: "/review", label: "Rituels", icon: RotateCcw },
    { href: "/modules", label: "Grimoire", icon: BookOpen },
    { href: "/profile", label: "Héros", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe shadow-2xl">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playRetroSound("click")}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all",
                isActive
                  ? "text-amber-400 font-black"
                  : "text-slate-400 hover:text-slate-200 font-bold"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30 scale-110 shadow-xs"
                    : "text-slate-400"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
