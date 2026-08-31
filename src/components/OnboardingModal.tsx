"use client";

import { useState } from "react";
import { saveOnboardingProfileAction } from "@/app/actions/user";
import { Sparkles, Stethoscope, GraduationCap, Award, ArrowRight, Check } from "lucide-react";

interface OnboardingModalProps {
  initialProfession?: string | null;
  initialNiveau?: string | null;
  initialMode?: string | null;
  isOpen: boolean;
  onClose?: () => void;
}

export default function OnboardingModal({
  initialProfession = "medecine",
  initialNiveau = "debutant",
  initialMode = "complet",
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState(initialProfession || "medecine");
  const [professionAutre, setProfessionAutre] = useState("");
  const [niveau, setNiveau] = useState(initialNiveau || "debutant");
  const [mode, setMode] = useState(initialMode || "complet");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("profession", profession);
    formData.append("profession_autre", professionAutre);
    formData.append("niveau_etudes", niveau);
    formData.append("mode_apprentissage", mode);

    await saveOnboardingProfileAction(formData);
    setSaving(false);
    if (onClose) onClose();
  };

  const professions = [
    { id: "medecine", label: "Médecine", desc: "Étudiants en médecine, externes, internes" },
    { id: "kine", label: "Kinésithérapie", desc: "Étudiants en masso-kinésithérapie (IFMK)" },
    { id: "osteo", label: "Ostéopathie", desc: "Étudiants et écoles d'ostéopathie" },
    { id: "pharma", label: "Pharmacie", desc: "Étudiants en pharmacie et officinaux" },
    { id: "autre", label: "Autre filière", desc: "Infirmier, IPA, sage-femme, podologue..." },
  ];

  const niveaux = [
    {
      id: "debutant",
      icon: GraduationCap,
      title: "1ère – 3ème année (Fondations)",
      desc: "Idéal pour débuter : vocabulaire médical détaillé, rappels anatomiques et explications complètes pas à pas.",
    },
    {
      id: "avance",
      icon: Stethoscope,
      title: "4ème – 6ème année (Clinique & Urgences)",
      desc: "Format synthétique : fiches 'Points clés & Pièges', scores d'urgence et réflexes diagnostiques.",
    },
    {
      id: "praticien",
      icon: Award,
      title: "Praticien Diplômé (Formation continue)",
      desc: "Pratique directe et quiz rapides pour réactiver la mémoire, avec fiches de rappel accessibles en 1 clic.",
    },
  ];

  const modes = [
    {
      id: "complet",
      title: "📖 Guide Complet",
      desc: "Micro-cours interactif complet avant d'aborder les exercices pratiques.",
    },
    {
      id: "synthetique",
      title: "⚡ Points Clés & Essentiel",
      desc: "Fiche mémo ultra-visuelle avec mnémotechniques et drapeaux rouges.",
    },
    {
      id: "pratique_directe",
      title: "🎯 Pratique Directe",
      desc: "Lancement immédiat des questions, avec cours consultable à tout moment.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 my-8 animate-bounce-short">
        {/* Barre d'étapes */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Personnalisation Pédagogique ({step}/3)</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s === step ? "bg-indigo-600" : s < step ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ÉTAPE 1 : Filière */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Quelle est ta filière de santé ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Cela nous permet d&apos;ajuster les orientations cliniques de tes leçons.
              </p>
            </div>

            <div className="space-y-2.5">
              {professions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    profession === p.id
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-xs text-slate-500">{p.desc}</div>
                  </div>
                  {profession === p.id && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
                </button>
              ))}

              {profession === "autre" && (
                <input
                  type="text"
                  placeholder="Précise ta profession (ex: Infirmier, Sage-femme...)"
                  value={professionAutre}
                  onChange={(e) => setProfessionAutre(e.target.value)}
                  className="w-full p-3 rounded-xl border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-2"
                />
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm mt-4"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Niveau */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Quel est ton niveau actuel ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Le contenu des cours et le degré d&apos;approfondissement s&apos;adapteront à ton profil.
              </p>
            </div>

            <div className="space-y-3">
              {niveaux.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => setNiveau(n.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                      niveau === n.id
                        ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm text-slate-900">{n.title}</div>
                      <div className="text-xs text-slate-600 leading-relaxed">{n.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Mode d'apprentissage */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Comment souhaites-tu apprendre ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tu pourras changer ce réglage à tout moment depuis ton profil.
              </p>
            </div>

            <div className="space-y-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between ${
                    mode === m.id
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900">{m.title}</div>
                    <div className="text-xs text-slate-600">{m.desc}</div>
                  </div>
                  {mode === m.id && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
              >
                Retour
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>{saving ? "Enregistrement..." : "Valider mon profil 🚀"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
