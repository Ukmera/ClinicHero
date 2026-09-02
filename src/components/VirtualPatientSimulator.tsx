"use client";

import React, { useState, useEffect } from "react";
import {
  CLINICAL_CASES,
  ClinicalCase,
  ClinicalQuestion,
  PhysicalManeuver,
  InvestigationTest,
} from "@/lib/rpg/cases";
import { playRetroSound } from "@/lib/rpg/audio";
import GrandBlouseAvatar from "./rpg/GrandBlouseAvatar";
import {
  Heart,
  Activity,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  Gem,
  MessageSquare,
  Shield,
  Clock,
  Search,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function VirtualPatientSimulator() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const activeCase = CLINICAL_CASES.find((c) => c.id === selectedCaseId) || CLINICAL_CASES[0];

  // Étapes de la consultation : 1 (Anamnèse), 2 (Examen Physique), 3 (Examens), 4 (Diagnostic)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // État de l'anamnèse
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);
  const [currentActiveQuestion, setCurrentActiveQuestion] = useState<ClinicalQuestion | null>(null);
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(true);

  // État de l'examen physique
  const [performedManeuverIds, setPerformedManeuverIds] = useState<string[]>([]);
  const [activeManeuver, setActiveManeuver] = useState<PhysicalManeuver | null>(null);

  // État des examens complémentaires
  const [orderedInvestigationIds, setOrderedInvestigationIds] = useState<string[]>([]);

  // Diagnostic et Conduite à tenir
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Réinitialiser l'état lors du changement de cas
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentStep(1);
    setAskedQuestionIds([]);
    setCurrentActiveQuestion(null);
    setTypewriterText("");
    setIsTypingComplete(true);
    setPerformedManeuverIds([]);
    setActiveManeuver(null);
    setOrderedInvestigationIds([]);
    setSelectedDiagnosisId(null);
    setSelectedActionId(null);
    setIsSubmitted(false);
    playRetroSound("click");
  };

  // Effet Machine à écrire pour la réponse du patient
  useEffect(() => {
    if (!currentActiveQuestion) return;

    const fullText = currentActiveQuestion.patientAnswer;
    setTypewriterText("");
    setIsTypingComplete(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentActiveQuestion]);

  const handleAskQuestion = (question: ClinicalQuestion) => {
    setCurrentActiveQuestion(question);
    if (!askedQuestionIds.includes(question.id)) {
      setAskedQuestionIds((prev) => [...prev, question.id]);
    }
    playRetroSound("click");
  };

  const handlePerformManeuver = (maneuver: PhysicalManeuver) => {
    setActiveManeuver(maneuver);
    if (!performedManeuverIds.includes(maneuver.id)) {
      setPerformedManeuverIds((prev) => [...prev, maneuver.id]);
    }
    playRetroSound(maneuver.isPositive ? "correct" : "click");
  };

  const handleOrderInvestigation = (inv: InvestigationTest) => {
    if (!orderedInvestigationIds.includes(inv.id)) {
      setOrderedInvestigationIds((prev) => [...prev, inv.id]);
      playRetroSound("correct");
    }
  };

  const handleFinalSubmit = () => {
    if (!selectedDiagnosisId || !selectedActionId) return;

    setIsSubmitted(true);
    const chosenDiag = activeCase.diagnostics.find((d) => d.id === selectedDiagnosisId);
    const chosenAct = activeCase.urgentActions.find((a) => a.id === selectedActionId);

    const isSuccess = chosenDiag?.isCorrect && chosenAct?.isCorrect;
    if (isSuccess) {
      playRetroSound("victory");
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      playRetroSound("wrong");
    }
  };

  // Calcul du score de rigueur sémiologique
  const calculateScore = () => {
    const totalKeyQuestions = activeCase.questions.filter((q) => q.isKeyClue).length;
    const askedKeyQuestions = activeCase.questions.filter(
      (q) => q.isKeyClue && askedQuestionIds.includes(q.id)
    ).length;

    const totalCriticalManeuvers = activeCase.maneuvers.filter((m) => m.isCritical).length;
    const performedCriticalManeuvers = activeCase.maneuvers.filter(
      (m) => m.isCritical && performedManeuverIds.includes(m.id)
    ).length;

    const chosenDiag = activeCase.diagnostics.find((d) => d.id === selectedDiagnosisId);
    const chosenAct = activeCase.urgentActions.find((a) => a.id === selectedActionId);

    const anamnesisScore = (askedKeyQuestions / Math.max(1, totalKeyQuestions)) * 25;
    const examScore = (performedCriticalManeuvers / Math.max(1, totalCriticalManeuvers)) * 25;
    const diagScore = chosenDiag?.isCorrect ? 30 : 0;
    const actScore = chosenAct?.isCorrect ? 20 : 0;

    return Math.round(anamnesisScore + examScore + diagScore + actScore);
  };

  return (
    <div className="space-y-6">
      {/* 1. SÉLECTEUR DE CAS CLINIQUE */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
        <span className="text-[11px] font-black uppercase text-slate-400 px-2 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Sélection du Patient :</span>
        </span>

        {CLINICAL_CASES.map((c) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <span>{c.patient.avatarEmoji}</span>
              <span>{c.patient.name} ({c.patient.age} ans)</span>
            </button>
          );
        })}
      </div>

      {/* 2. FICHE PATIENT & MONITEUR DES CONSTANTES */}
      <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400/40 flex items-center justify-center text-4xl shrink-0 shadow-lg">
              {activeCase.patient.avatarEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{activeCase.patient.name}</h2>
                <span className="text-xs font-bold text-slate-400">
                  • {activeCase.patient.age} ans ({activeCase.patient.occupation})
                </span>
              </div>
              <p className="text-xs text-amber-400 font-bold mt-0.5">{activeCase.title}</p>
            </div>
          </div>

          {/* Mini Moniteur de Constantes Vitales */}
          <div className="grid grid-cols-4 gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shrink-0">
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">PA</div>
              <div className="text-xs font-black text-rose-400 mt-0.5">
                {activeCase.patient.initialVitals.bp}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">FC</div>
              <div className="text-xs font-black text-amber-400 mt-0.5">
                {activeCase.patient.initialVitals.hr} bpm
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">SpO2</div>
              <div className="text-xs font-black text-cyan-400 mt-0.5">
                {activeCase.patient.initialVitals.spo2} %
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">Temp</div>
              <div className="text-xs font-black text-emerald-400 mt-0.5">
                {activeCase.patient.initialVitals.temp} °C
              </div>
            </div>
          </div>
        </div>

        {/* Bulle de Dialogue du Patient (Plainte initiale ou réponse actuelle) */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl relative">
          <div className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentActiveQuestion ? "Réponse du patient :" : "Motif de consultation spontané :"}
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
            « {currentActiveQuestion ? typewriterText : activeCase.patient.initialComplaint} »
            {!isTypingComplete && <span className="animate-pulse text-amber-400 font-black"> ▼</span>}
          </p>

          {currentActiveQuestion && isTypingComplete && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Observation notée : {currentActiveQuestion.clinicalClue}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. STEPPER 4 ÉTAPES DE LA CONSULTATION */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, label: "1. Anamnèse", icon: MessageSquare },
          { step: 2, label: "2. Examen Physique", icon: Stethoscope },
          { step: 3, label: "3. Examens Compl.", icon: Search },
          { step: 4, label: "4. Diagnostic", icon: Trophy },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(s.step as any);
                playRetroSound("click");
              }}
              className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 select-none ${
                isActive
                  ? "bg-slate-900 border-amber-400 text-amber-400 shadow-lg shadow-amber-500/10 scale-105"
                  : isDone
                  ? "bg-slate-950 border-emerald-500/40 text-emerald-300 hover:border-emerald-400"
                  : "bg-slate-950/80 border-slate-800 text-slate-500 hover:border-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. CONTENU DE L'ÉTAPE ACTIVE */}

      {/* =========================================================================
          ÉTAPE 1 : ANAMNÈSE & INTERROGATOIRE P-A-R-A-S-I-T-E
      ========================================================================= */}
      {currentStep === 1 && (
        <div className="card-rpg p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
              <span>🗣️</span>
              <span>Posez vos questions d&apos;interrogatoire au patient :</span>
            </h3>
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              {askedQuestionIds.length} / {activeCase.questions.length} questions posées
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeCase.questions.map((q) => {
              const isAsked = askedQuestionIds.includes(q.id);
              const isCurrentlySelected = currentActiveQuestion?.id === q.id;

              return (
                <button
                  key={q.id}
                  onClick={() => handleAskQuestion(q)}
                  className={`p-3.5 rounded-2xl border text-left transition-all text-xs font-bold leading-snug flex items-start gap-2.5 ${
                    isCurrentlySelected
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.01]"
                      : isAsked
                      ? "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-400/40 hover:text-white"
                  }`}
                >
                  <span className="shrink-0 text-sm mt-0.5">{isAsked ? "💬" : "❓"}</span>
                  <div className="space-y-1">
                    <div>{q.question}</div>
                    {isAsked && (
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                        ✓ Renseigné
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setCurrentStep(2);
                playRetroSound("click");
              }}
              className="btn-rpg-gold px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <span>Passer à l&apos;Examen Physique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 2 : EXAMEN PHYSIQUE & MANŒUVRES SÉMIOLOGIQUES
      ========================================================================= */}
      {currentStep === 2 && (
        <div className="card-rpg p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
              <span>🩺</span>
              <span>Réalisez vos gestes d&apos;examen clinique au lit du patient :</span>
            </h3>
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              {performedManeuverIds.length} / {activeCase.maneuvers.length} gestes réalisés
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCase.maneuvers.map((m) => {
              const isPerformed = performedManeuverIds.includes(m.id);
              const isActive = activeManeuver?.id === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => handlePerformManeuver(m)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isActive
                      ? "bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/10"
                      : isPerformed
                      ? "bg-slate-900/90 border-slate-800 text-slate-200"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-400/40 hover:text-white"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0">{m.icon}</span>
                    <div>
                      <div className="text-xs font-black text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{m.actionDescription}</div>
                    </div>
                  </div>

                  {isPerformed && (
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-bold mt-2">
                      <div className="text-emerald-400 font-black flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Résultat clinique :</span>
                      </div>
                      <p className="text-slate-300 mt-1 leading-relaxed">{m.finding}</p>
                      {m.clinicalSignName && (
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 mt-1 bg-amber-500/15 p-1 rounded">
                          ✨ {m.clinicalSignName}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => {
                setCurrentStep(1);
                playRetroSound("click");
              }}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold"
            >
              ← Retour Anamnèse
            </button>

            <button
              onClick={() => {
                setCurrentStep(3);
                playRetroSound("click");
              }}
              className="btn-rpg-gold px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <span>Passer aux Examens Complémentaires</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 3 : EXAMENS COMPLÉMENTAIRES DE 1ÈRE INTENTION
      ========================================================================= */}
      {currentStep === 3 && (
        <div className="card-rpg p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
              <span>🔬</span>
              <span>Prescrivez les examens indispensables de 1ère intention :</span>
            </h3>
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-400/30">
              {orderedInvestigationIds.length} examens demandés
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeCase.investigations.map((inv) => {
              const isOrdered = orderedInvestigationIds.includes(inv.id);

              return (
                <div
                  key={inv.id}
                  className={`p-4 rounded-2xl border text-left space-y-3 transition-all ${
                    isOrdered
                      ? "bg-slate-900 border-amber-400/50 shadow-lg shadow-amber-500/10"
                      : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-white">{inv.name}</h4>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Délai : {inv.delay}</span>
                      </span>
                    </div>

                    {!isOrdered && (
                      <button
                        onClick={() => handleOrderInvestigation(inv)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Demander
                      </button>
                    )}
                  </div>

                  {isOrdered && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 animate-bounce-short">
                      <div className="text-[11px] font-black text-amber-300 uppercase">
                        📋 Compte-rendu sémiologique :
                      </div>
                      <p className="text-emerald-300 font-bold">{inv.resultSummary}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{inv.resultDetails}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => {
                setCurrentStep(2);
                playRetroSound("click");
              }}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold"
            >
              ← Retour Examen Physique
            </button>

            <button
              onClick={() => {
                setCurrentStep(4);
                playRetroSound("click");
              }}
              className="btn-rpg-gold px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <span>Poser le Diagnostic & Conduite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 4 : SYNTHÈSE DIAGNOSTIQUE & DÉBRIEFING DE LA GRANDE BLOUSE
      ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {!isSubmitted ? (
            <div className="card-rpg p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🎯</span>
                  <span>Synthèse Clinique & Prise de Décision</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Formulez votre hypothèse diagnostique principale et décidez de la conduite à tenir d&apos;urgence.
                </p>
              </div>

              {/* 1. Choix du Diagnostic */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-amber-400">
                  1. Quel est votre diagnostic principal ?
                </div>
                <div className="space-y-2">
                  {activeCase.diagnostics.map((diag) => {
                    const isSelected = selectedDiagnosisId === diag.id;
                    return (
                      <button
                        key={diag.id}
                        onClick={() => {
                          setSelectedDiagnosisId(diag.id);
                          playRetroSound("click");
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-black transition-all flex items-center gap-3 ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.01]"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center shrink-0 text-[10px]">
                          {isSelected ? "●" : ""}
                        </span>
                        <span>{diag.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Choix de la Conduite à Tenir */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-black uppercase text-amber-400">
                  2. Quelle est votre conduite à tenir thérapeutique prioritaire ?
                </div>
                <div className="space-y-2">
                  {activeCase.urgentActions.map((act) => {
                    const isSelected = selectedActionId === act.id;
                    return (
                      <button
                        key={act.id}
                        onClick={() => {
                          setSelectedActionId(act.id);
                          playRetroSound("click");
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-black transition-all flex items-center gap-3 ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.01]"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center shrink-0 text-[10px]">
                          {isSelected ? "●" : ""}
                        </span>
                        <span>{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(3);
                    playRetroSound("click");
                  }}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold"
                >
                  ← Retour Examens
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!selectedDiagnosisId || !selectedActionId}
                  className={`btn-rpg-gold px-8 py-3.5 text-xs font-black uppercase tracking-wider ${
                    !selectedDiagnosisId || !selectedActionId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Valider la Prise en Charge Clinique
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================================
                RÉSULTAT & DÉBRIEFING DE LA GRANDE BLOUSE
            ========================================================================= */
            <div className="space-y-6 animate-bounce-short">
              {/* Carte de Résultat Global */}
              <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <GrandBlouseAvatar
                      emotion={calculateScore() >= 75 ? "happy" : "alert"}
                      size="md"
                      glow={true}
                    />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                        Débriefing de Consultation Clinique
                      </div>
                      <h3 className="text-xl font-black text-white">
                        {calculateScore() >= 75
                          ? "Félicitations, prise en charge exemplaire !"
                          : "Prise en charge à perfectionner"}
                      </h3>
                    </div>
                  </div>

                  {/* Score de Rigueur */}
                  <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl text-center shrink-0 shadow-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Rigueur Sémiologique</div>
                    <div className="text-2xl font-black text-amber-400 mt-0.5">
                      {calculateScore()} / 100
                    </div>
                  </div>
                </div>

                {/* Butin attribué */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black">
                      <Zap className="w-5 h-5 fill-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">XP Gagnés</div>
                      <div className="text-base font-black text-indigo-300">
                        +{activeCase.rewards.xp} XP
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                      <Gem className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Gemmes Récoltées</div>
                      <div className="text-base font-black text-amber-300">
                        +{activeCase.rewards.gems} 💎
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnostic Final & Points Clés */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Diagnostic Affirmé : {activeCase.debriefing.finalDiagnosis}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeCase.debriefing.keyLearningPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">✦</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Mnémotechnique */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-black">
                    💡 Mnémo : {activeCase.debriefing.mnemonic}
                  </div>

                  <div className="text-[10px] text-slate-400 italic">
                    Source : {activeCase.debriefing.reference}
                  </div>
                </div>

                {/* Bouton Recommencer ou Changer de Patient */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleSelectCase(activeCase.id)}
                    className="btn-rpg-gold flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Recommencer ce Cas</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
