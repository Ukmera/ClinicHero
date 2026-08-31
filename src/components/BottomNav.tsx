"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, RotateCcw, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  // Ne pas afficher la barre de navigation pendant une session d'exercice pour une concentration maximale
  if (pathname.startsWith("/session/")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Parcours", icon: Compass },
    { href: "/simulations", label: "Atelier", icon: Stethoscope },
    { href: "/review", label: "Révision SRS", icon: RotateCcw },
    { href: "/modules", label: "Modules", icon: BookOpen },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors",
                isActive
                  ? "text-indigo-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all",
                  isActive ? "bg-indigo-50 text-indigo-600 scale-110" : ""
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
