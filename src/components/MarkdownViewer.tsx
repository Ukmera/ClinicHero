"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Info, Sparkles, Lightbulb } from "lucide-react";

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) return null;

  // Découpage par blocs de paragraphes et sections
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let index = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${index++}`} className="space-y-2 my-3">
          {currentList.map((item, liIdx) => (
            <li
              key={liIdx}
              className="flex items-start gap-2.5 text-xs md:text-sm text-slate-200 bg-slate-900/90 border border-slate-800 p-3 rounded-xl font-medium shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 shadow-xs" />
              <div
                className="flex-1 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatBoldAndItalic(item),
                }}
              />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatBoldAndItalic = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-black text-amber-300'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic text-slate-300'>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-slate-950 border border-slate-800 text-indigo-300 px-1.5 py-0.5 rounded-md font-mono text-xs'>$1</code>");
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();

    if (!rawLine) {
      flushList();
      continue;
    }

    // Titres H1 / H2 / H3
    if (rawLine.startsWith("### ")) {
      flushList();
      const title = rawLine.replace("### ", "");
      renderedElements.push(
        <div key={`h3-${index++}`} className="mt-5 mb-2.5 flex items-center gap-2">
          <div className="w-1.5 h-4 rounded-full bg-amber-400" />
          <h3 className="font-black text-sm md:text-base text-white tracking-tight">
            {title}
          </h3>
        </div>
      );
      continue;
    }

    if (rawLine.startsWith("## ")) {
      flushList();
      const title = rawLine.replace("## ", "");
      renderedElements.push(
        <div key={`h2-${index++}`} className="mt-6 mb-3 border-b border-slate-800 pb-2">
          <h2 className="font-black text-base md:text-lg text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{title}</span>
          </h2>
        </div>
      );
      continue;
    }

    // Alertes / Pièges (lignes commençant par ⚠️)
    if (rawLine.startsWith("⚠️") || rawLine.toLowerCase().includes("drapeaux rouges")) {
      flushList();
      renderedElements.push(
        <div
          key={`alert-${index++}`}
          className="my-3 p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs md:text-sm font-medium flex items-start gap-3 shadow-md"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div
            className="space-y-1 flex-1 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatBoldAndItalic(rawLine) }}
          />
        </div>
      );
      continue;
    }

    // Listes à puces (- ou *)
    if (rawLine.startsWith("- ") || rawLine.startsWith("* ")) {
      currentList.push(rawLine.substring(2));
      continue;
    }

    // Éléments numérotés (1., 2., etc.)
    if (/^\d+\.\s/.test(rawLine)) {
      flushList();
      const match = rawLine.match(/^(\d+)\.\s(.*)/);
      if (match) {
        const num = match[1];
        const text = match[2];
        renderedElements.push(
          <div
            key={`num-${index++}`}
            className="my-2 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-start gap-3 shadow-xs"
          >
            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              {num}
            </span>
            <div
              className="text-xs md:text-sm text-slate-200 flex-1 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: formatBoldAndItalic(text) }}
            />
          </div>
        );
        continue;
      }
    }

    // Paragraphe normal
    flushList();
    renderedElements.push(
      <p
        key={`p-${index++}`}
        className="my-2 text-xs md:text-sm text-slate-200 leading-relaxed font-normal"
        dangerouslySetInnerHTML={{ __html: formatBoldAndItalic(rawLine) }}
      />
    );
  }

  flushList();

  return <div className="space-y-1 text-slate-200">{renderedElements}</div>;
}
