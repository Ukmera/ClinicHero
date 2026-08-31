"use client";

import { useState, useEffect } from "react";
import { saveOnboardingProfileAction } from "@/app/actions/user";
import { CharacterClassId } from "@/lib/rpg/types";
import ClassSelector from "./rpg/ClassSelector";
import { Sparkles, Stethoscope, GraduationCap, Award, ArrowRight, Check, Shield } from "lucide-react";
import { playRetroSound } from "@/lib/rpg/audio";

interface OnboardingModalProps {
  initialProfession?: string | null;
  initialNiveau?: string | null;
  initialMode?: string | null;
  initialClass?: string | null;
  isOpen: boolean;
  onClose?: () => void;
}

export default function OnboardingModal({
  initialProfession = "medecine",
  initialNiveau = "debutant",
  initialMode = "complet",
  initialClass = "clerc",
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState(initialProfession || "medecine");
  const [professionAutre, setProfessionAutre] = useState("");
  const [characterClass, setCharacterClass] = useState<CharacterClassId>(
    (initialClass as CharacterClassId) || "clerc"
  );
  const [avatarVariant, setAvatarVariant] = useState<1 | 2>(1);
  const [niveau, setNiveau] = useState(initialNiveau || "debutant");
  const [mode, setMode] = useState(initialMode || "complet");
  const [saving, setSaving] = useState(false);

  // Auto-suggestion de classe en fonction de la filière
  useEffect(() => {
    if (profession === "medecine") setCharacterClass("clerc");
    else if (profession === "pharma") setCharacterClass("alchimiste");
    else if (profession === "kine" || profession === "osteo") setCharacterClass("moine");
  }, [profession]);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("profession", profession);
    formData.append("profession_autre", professionAutre);
    formData.append("character_class", characterClass);
    formData.append("avatar_id", `${characterClass}_${avatarVariant}`);
    formData.append("niveau_etudes", niveau);
    formData.append("mode_apprentissage", mode);

    await saveOnboardingProfileAction(formData);
    setSaving(false);
    playRetroSound("levelup");
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 md:p-8 text-slate-100 shadow-2xl space-y-6 my-8 animate-bounce-short">
        {/* Barre d'étapes */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Initiation Sémiologique ({step}/4)</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  s === step ? "bg-amber-400" : s < step ? "bg-emerald-500" : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ÉTAPE 1 : Filière */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Quelle est ta filière de santé ?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ajuste les orientations cliniques et les cas pratiques de tes entraînements.
              </p>
            </div>

            <div className="space-y-2.5">
              {professions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProfession(p.id);
                    playRetroSound("click");
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    profession === p.id
                      ? "border-amber-400 bg-slate-950 text-white shadow-xs"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-300"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-xs text-slate-400">{p.desc}</div>
                  </div>
                  {profession === p.id && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
                </button>
              ))}

              {profession === "autre" && (
                <input
                  type="text"
                  placeholder="Précise ta profession (ex: Infirmier, Sage-femme...)"
                  value={professionAutre}
                  onChange={(e) => setProfessionAutre(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mt-2"
                />
              )}
            </div>

            <button
              onClick={() => {
                setStep(2);
                playRetroSound("click");
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm mt-4"
            >
              <span>Continuer vers le Choix de Classe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Classe & Avatar RPG */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Choisis ton Archétype Médical ⚔️
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Chaque classe possède un trait passif qui t&apos;assiste dans tes diagnostics.
              </p>
            </div>

            <ClassSelector
              selectedClass={characterClass}
              onSelectClass={setCharacterClass}
              selectedAvatarVariant={avatarVariant}
              onSelectAvatarVariant={setAvatarVariant}
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  playRetroSound("click");
                }}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-bold text-sm"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  playRetroSound("click");
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Niveau d'études */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Quel est ton niveau actuel ?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Le contenu des micro-cours s&apos;adaptera automatiquement à ton niveau de pratique.
              </p>
            </div>

            <div className="space-y-3">
              {niveaux.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      setNiveau(n.id);
                      playRetroSound("click");
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                      niveau === n.id
                        ? "border-amber-400 bg-slate-950 text-white shadow-xs"
                        : "border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-300"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shadow-2xs shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm text-white">{n.title}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{n.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  playRetroSound("click");
                }}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-bold text-sm"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(4);
                  playRetroSound("click");
                }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Mode d'apprentissage */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Comment souhaites-tu apprendre ?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tu pourras changer ce réglage à tout moment depuis ton Grimoire de profil.
              </p>
            </div>

            <div className="space-y-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    playRetroSound("click");
                  }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between ${
                    mode === m.id
                      ? "border-amber-400 bg-slate-950 text-white shadow-xs"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/80 text-slate-300"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-white">{m.title}</div>
                    <div className="text-xs text-slate-400">{m.desc}</div>
                  </div>
                  {mode === m.id && <Check className="w-5 h-5 text-amber-400 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  playRetroSound("click");
                }}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-bold text-sm"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
              >
                <span>{saving ? "Invocation en cours..." : "Entrer dans l'Ordre 🏰"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
