"use client";

import React from "react";
import { GitBranch, ChevronRight } from "lucide-react";

interface MindmapNode {
  label: string;
  children?: MindmapNode[];
}

interface MindmapViewerProps {
  data: {
    title: string;
    nodes: MindmapNode[];
  };
}

export default function MindmapViewer({ data }: MindmapViewerProps) {
  const renderNode = (node: MindmapNode, depth = 0) => {
    const isRoot = depth === 0;
    return (
      <div key={node.label} className="space-y-2">
        <div
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
            isRoot
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : depth === 1
              ? "bg-indigo-950 text-indigo-200 border border-indigo-700/80 shadow-xs"
              : "bg-slate-900 text-slate-200 border border-slate-800 ml-4"
          }`}
        >
          {!isRoot && <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <span>{node.label}</span>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-800 space-y-2 ml-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
      <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
        <GitBranch className="w-4 h-4 text-amber-400" />
        <span>{data.title}</span>
      </div>

      <div className="space-y-2 pt-1">
        {data.nodes.map((node) => renderNode(node, 0))}
      </div>
    </div>
  );
}
