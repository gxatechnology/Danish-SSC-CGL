import React, { useState } from 'react';
import { ChapterTable } from '../types';
import { Copy, Check, Table as TableIcon } from 'lucide-react';

interface ChapterTableRendererProps {
  table: ChapterTable;
}

export const ChapterTableRenderer: React.FC<ChapterTableRendererProps> = ({ table }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopyRow = (row: string[], idx: number) => {
    const rowText = row.join(' | ');
    navigator.clipboard.writeText(rowText);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="my-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Header / Title */}
      <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {table.title}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
          {table.rows.length} Rows
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              {table.headers.map((header, hIdx) => (
                <th key={hIdx} className="px-4 py-3 first:pl-5 last:pr-5">
                  {header}
                </th>
              ))}
              <th className="px-3 py-3 text-right pr-4 w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {table.rows.map((row, rIdx) => (
              <tr 
                key={rIdx}
                className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td 
                    key={cIdx} 
                    className={`px-4 py-3 first:pl-5 last:pr-5 leading-relaxed ${
                      cIdx === 0 
                        ? 'font-semibold text-slate-900 dark:text-slate-100' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-3 py-3 text-right pr-4">
                  <button
                    onClick={() => handleCopyRow(row, rIdx)}
                    title="Copy row to clipboard"
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {copiedIdx === rIdx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
