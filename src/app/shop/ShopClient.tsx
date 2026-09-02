"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
  Heart,
  Crown,
  Lock,
  CheckCircle2,
  Flame,
  Stethoscope,
  FlaskConical,
  Hammer,
} from "lucide-react";
import { SHOP_CATALOG, ShopItem, ItemCategory, getRarityColor } from "@/lib/rpg/items";
import { buyItemAction, useConsumableAction } from "@/app/actions/shop";
import { playRetroSound } from "@/lib/rpg/audio";
import PixelAvatar from "@/components/rpg/PixelAvatar";
import GrandBlouseAvatar from "@/components/rpg/GrandBlouseAvatar";

interface ShopUserData {
  id: string;
  gems: number;
  user_level: number;
  hp_current: number;
  hp_max: number;
  mana_current: number;
  mana_max: number;
  inventory: string[];
  character_class: string;
  avatar_id: string;
}

interface ShopClientProps {
  initialUserData: ShopUserData | null;
}

export default function ShopClient({ initialUserData }: ShopClientProps) {
  const [userData, setUserData] = useState<ShopUserData | null>(initialUserData);
  const [activeCategory, setActiveCategory] = useState<"all" | ItemCategory>("all");
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [celebrationItem, setCelebrationItem] = useState<ShopItem | null>(null);

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400 space-y-4">
        <p>Veuillez vous connecter pour accéder à La Forge d&apos;Équipements.</p>
        <Link href="/login" className="btn-rpg-gold inline-block px-6 py-2">
          Connexion
        </Link>
      </div>
    );
  }

  const filteredItems = SHOP_CATALOG.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const handleBuy = async (item: ShopItem) => {
    setLoadingItemId(item.id);
    setErrorMessage(null);

    try {
      const res = await buyItemAction(item.id);
      if (res.error) {
        setErrorMessage(res.error);
        playRetroSound("wrong");
      } else if (res.success && res.newGems !== undefined) {
        playRetroSound("levelup");
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                gems: res.newGems!,
                inventory: res.inventory!,
                hp_max: res.hpMax!,
                mana_max: res.manaMax!,
                hp_current: res.hpCurrent!,
                mana_current: res.manaCurrent!,
              }
            : null
        );
        setCelebrationItem(item);
      }
    } catch (e) {
      setErrorMessage("Une erreur est survenue lors de l'achat.");
      playRetroSound("wrong");
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleUseConsumable = async (item: ShopItem) => {
    setLoadingItemId(item.id);
    setErrorMessage(null);

    try {
      const res = await useConsumableAction(item.id);
      if (res.error) {
        setErrorMessage(res.error);
        playRetroSound("wrong");
      } else if (res.success) {
        playRetroSound("correct");
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                inventory: res.inventory!,
                hp_current: res.hpCurrent!,
                mana_current: res.manaCurrent!,
              }
            : null
        );
      }
    } catch (e) {
      setErrorMessage("Impossible de consommer cet objet.");
    } finally {
      setLoadingItemId(null);
    }
  };

  const countOwnedConsumable = (itemId: string) => {
    return userData.inventory.filter((id) => id === itemId).length;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-7">
      {/* Bouton Retour & Bannière de Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => playRetroSound("click")}
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-amber-400 transition-colors uppercase tracking-wider bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Retour aux Donjons</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-2xl shadow-lg shadow-amber-500/10">
            <span className="text-lg">💎</span>
            <span className="text-base font-black tracking-tight">{userData.gems}</span>
            <span className="text-[10px] font-black uppercase text-amber-400/80 tracking-widest hidden sm:inline">
              Gemmes
            </span>
          </div>
        </div>
      </div>

      {/* Hero Forge & Maître Forgeron */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-500/30 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pixel-rendering pointer-events-none"
          style={{ backgroundImage: "url('/pixel-crawler/mockups/Tavern.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/80" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuaire de l&apos;Équipement Clinique</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              La Forge d&apos;Aethelgard
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Dépense tes Gemmes pour forger des stéthoscopes légendaires, revêtir la Blouse de Chef de Clinique et acquérir des reliques renforçant tes PV et ton Mana en donjon.
            </p>
          </div>

          {/* Avatar Mentor Flottant */}
          <div className="shrink-0 flex flex-col items-center bg-slate-900/80 border border-slate-800 p-4 rounded-3xl shadow-xl">
            <GrandBlouseAvatar emotion="happy" size="md" glow={true} />
            <div className="text-[11px] font-black text-amber-300 mt-2">La Grande Blouse</div>
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
              Maître Forgeron
            </div>
          </div>
        </div>

        {/* Barre de Stats Actuelles du Joueur */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black shrink-0">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">PV Max</div>
              <div className="text-sm font-black text-rose-300">
                {userData.hp_current} / {userData.hp_max}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black shrink-0">
              <Zap className="w-4 h-4 fill-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Mana Max</div>
              <div className="text-sm font-black text-cyan-300">
                {userData.mana_current} / {userData.mana_max}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Niveau</div>
              <div className="text-sm font-black text-emerald-300">Rang {userData.user_level}</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Inventaire</div>
              <div className="text-sm font-black text-purple-300">
                {userData.inventory.length} objets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message d'erreur éventuel */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold animate-shake flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Onglets Filtres des Catégories (Boutons RPG 3D) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: "all", label: "Tous les Objets", icon: Sparkles },
          { id: "stethoscope", label: "Stéthoscopes", icon: Stethoscope },
          { id: "coat", label: "Blouses & Tenues", icon: Shield },
          { id: "relic", label: "Reliques Sémiologiques", icon: Hammer },
          { id: "consumable", label: "Potions & Élixirs", icon: FlaskConical },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id as any);
                playRetroSound("click");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all select-none ${
                isActive
                  ? "bg-amber-400 text-slate-950 border-2 border-amber-300 shadow-lg shadow-amber-500/20 scale-105"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grille des Articles de la Boutique */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const rarity = getRarityColor(item.rarity);
          const isOwned = userData.inventory.includes(item.id);
          const ownedCount = countOwnedConsumable(item.id);
          const isAffordable = userData.gems >= item.price;
          const isLockedByLevel = !!item.requiredLevel && userData.user_level < item.requiredLevel;
          const isLoading = loadingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`card-rpg p-5 rounded-3xl border-2 ${rarity.border} ${rarity.bg} ${rarity.glow} flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:scale-[1.02]`}
            >
              {/* Badge de Rareté & Niveau */}
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${rarity.badge}`}>
                  {item.rarity}
                </span>

                {item.requiredLevel && (
                  <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span>Niv. {item.requiredLevel}+</span>
                  </span>
                )}
              </div>

              {/* Icône & Titre */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-md">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white leading-snug">{item.name}</h3>
                  <p className="text-xs font-bold text-amber-300">{item.description}</p>
                </div>
              </div>

              {/* Lore / Histoire */}
              <p className="text-[11px] text-slate-400 italic leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                « {item.lore} »
              </p>

              {/* Bouton d'Achat / Équipé */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {/* Affichage du prix */}
                <div className="flex items-center gap-1 text-sm font-black text-amber-400">
                  {item.price === 0 ? (
                    <span className="text-emerald-400 uppercase text-xs">Gratuit</span>
                  ) : (
                    <>
                      <span>💎</span>
                      <span>{item.price}</span>
                    </>
                  )}
                </div>

                {/* Bouton d'Action */}
                {isOwned && item.category !== "consumable" ? (
                  <div className="flex items-center gap-1 text-xs font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3.5 py-2 rounded-xl shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Équipé</span>
                  </div>
                ) : item.category === "consumable" && ownedCount > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUseConsumable(item)}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Boire ({ownedCount})</span>
                    </button>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={isLoading || !isAffordable}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold uppercase transition-all"
                    >
                      +1
                    </button>
                  </div>
                ) : isLockedByLevel ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Verrouillé</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isLoading || !isAffordable}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                      isAffordable
                        ? "btn-rpg-gold text-slate-950"
                        : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isLoading ? "Forge..." : "Forger"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modale de Célébration lors d'un Achat Réussi */}
      {celebrationItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-rpg max-w-sm w-full p-6 text-center space-y-5 animate-bounce-short border-amber-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-amber-400/80 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 animate-pulse">
              {celebrationItem.icon}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                🎉 Objet Forgé avec Succès !
              </div>
              <h3 className="text-xl font-black text-white">{celebrationItem.name}</h3>
              <p className="text-xs font-bold text-emerald-300 mt-1">
                {celebrationItem.description}
              </p>
            </div>

            <p className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              « {celebrationItem.lore} »
            </p>

            <button
              onClick={() => {
                setCelebrationItem(null);
                playRetroSound("click");
              }}
              className="btn-rpg-gold w-full py-3 text-xs font-black uppercase tracking-wider"
            >
              Équiper & Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
