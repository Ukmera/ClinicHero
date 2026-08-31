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
              className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 bg-slate-50/80 border border-slate-200/70 p-2.5 rounded-xl font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              <div
                className="flex-1"
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
      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-extrabold text-slate-900'>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em class='italic text-slate-700'>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md font-mono text-xs'>$1</code>");
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
          <div className="w-2 h-4 rounded-full bg-indigo-600" />
          <h3 className="font-extrabold text-sm md:text-base text-slate-900">
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
        <div key={`h2-${index++}`} className="mt-6 mb-3 border-b border-slate-100 pb-2">
          <h2 className="font-extrabold text-base md:text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
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
          className="my-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs md:text-sm font-medium flex items-start gap-3 shadow-2xs"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div
            className="space-y-1 flex-1"
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
            className="my-2 p-3 bg-white border border-slate-200/80 rounded-xl flex items-start gap-3 shadow-2xs"
          >
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              {num}
            </span>
            <div
              className="text-xs md:text-sm text-slate-800 flex-1 leading-relaxed"
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
        className="my-2 text-xs md:text-sm text-slate-700 leading-relaxed font-normal"
        dangerouslySetInnerHTML={{ __html: formatBoldAndItalic(rawLine) }}
      />
    );
  }

  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
}
