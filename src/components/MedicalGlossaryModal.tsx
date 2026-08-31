"use client";

import { useState, useEffect } from "react";
import { BookOpen, Search, X, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-bounce-short">
        {/* En-tête */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                Glossaire Sémiologique
              </h2>
              <p className="text-[11px] text-slate-500">
                Définitions et mécanismes des termes cardiovasculaires
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher un terme (ex: Angor, B1, Orthopnée...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Liste des définitions */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Aucun terme ne correspond à votre recherche.
            </div>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-indigo-900">{t.terme}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                    {t.systeme}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{t.definition_fr}</p>
                {t.exemples && (
                  <p className="text-[11px] text-slate-500 italic">
                    💡 Contexte : {t.exemples}
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
