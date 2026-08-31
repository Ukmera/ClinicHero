"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, X, Sparkles, Scroll } from "lucide-react";
import { getGlossaryTermsAction } from "@/app/actions/user";

interface MedicalGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export default function MedicalGlossaryModal({
  isOpen,
  onClose,
  initialSearch = "",
}: MedicalGlossaryModalProps) {
  const [terms, setTerms] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getGlossaryTermsAction().then((data) => {
        setTerms(data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = terms.filter(
    (t) =>
      t.terme.toLowerCase().includes(search.toLowerCase()) ||
      t.definition_fr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card-rpg max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-bounce-short p-0 border-slate-700">
        {/* En-tête du Grimoire */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-xs">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">
                Grimoire Sémiologique
              </h2>
              <p className="text-[11px] text-slate-400">
                Définitions, repères et mécanismes cardiovasculaires
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher un terme (ex: Angor, B1, Orthopnée, IAo...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Liste des définitions */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-800 space-y-3 bg-slate-900/40">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Consultation des manuscrits...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Aucun terme ne correspond à votre recherche arcanique.
            </div>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                    <span>✦</span>
                    <span>{t.terme}</span>
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full">
                    {t.systeme}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-3.5">{t.definition_fr}</p>
                {t.exemples && (
                  <p className="text-[11px] text-indigo-300 italic pl-3.5">
                    💡 Contexte clinique : {t.exemples}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
