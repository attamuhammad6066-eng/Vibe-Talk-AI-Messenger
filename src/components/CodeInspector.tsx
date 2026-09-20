import { useState } from 'react';
import { FileCode, Layers, ShieldCheck, Database, Smartphone, Copy, Check } from 'lucide-react';
import { ANDROID_CODE_FILES } from '../data/androidFiles';

interface CodeInspectorProps {
  isDark: boolean;
}

export function CodeInspector({ isDark }: CodeInspectorProps) {
  const [selectedFile, setSelectedFile] = useState(ANDROID_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`h-full flex flex-col rounded-3xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#0E131C] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      {/* Top Bar */}
      <div
        className={`px-5 py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold">Android Phase 0 Codebase Inspector</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
            Kotlin + Compose M3
          </span>
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 cursor-pointer transition-colors ${
              isDark
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-semibold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: File Explorer on left + Code Viewer on right */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree List */}
        <div
          className={`w-64 border-r p-3 overflow-y-auto space-y-1 ${
            isDark ? 'border-slate-800 bg-[#0A0D14]' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Foundation Modules
          </div>
          {ANDROID_CODE_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex flex-col cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate text-[11px]">{file.path.split('/').pop()}</span>
                </div>
                <span className="text-[9px] text-slate-500 truncate ml-5">
                  {file.path.split('/').slice(0, -1).join('/') || 'root'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#070A0F] text-slate-200">
          <div className="px-4 py-2 bg-[#0B0E14] border-b border-slate-800/60 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>{selectedFile.path}</span>
            <span className="text-emerald-400 uppercase text-[10px] font-bold">
              {selectedFile.category}
            </span>
          </div>
          <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
