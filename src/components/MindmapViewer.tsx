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
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            isRoot
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : depth === 1
              ? "bg-indigo-50 text-indigo-950 border border-indigo-200"
              : "bg-slate-50 text-slate-800 border border-slate-200 ml-4"
          }`}
        >
          {!isRoot && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
          <span>{node.label}</span>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="pl-4 border-l-2 border-indigo-200 space-y-2 ml-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
        <GitBranch className="w-4 h-4 text-indigo-600" />
        <span>{data.title}</span>
      </div>

      <div className="space-y-2 pt-1">
        {data.nodes.map((node) => renderNode(node, 0))}
      </div>
    </div>
  );
}
