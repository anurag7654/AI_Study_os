import React from 'react';
import { X, Server, Database, Cpu, Layout, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="arch-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 id="arch-title" className="text-base font-semibold text-slate-900">
              Technical Architecture & Interview Blueprint
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How AI Study OS scales from React MVP to full MERN + Python FastAPI + Gemini
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          {/* Data Flow Diagram Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
              Planned Fullstack Data Flow Architecture
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-md flex flex-col items-center">
                <Layout className="w-5 h-5 text-indigo-600 mb-1" />
                <span className="font-semibold text-slate-900">React Client</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Vite SPA · Tailwind v4</span>
                <span className="text-[10px] text-slate-400 mt-2">State & UI rendering</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-slate-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-md flex flex-col items-center">
                <Server className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="font-semibold text-slate-900">Express Backend</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Node.js REST API</span>
                <span className="text-[10px] text-slate-400 mt-2">Auth, validation, CRUD</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-md flex flex-col items-center">
                <Database className="w-5 h-5 text-emerald-700 mb-1" />
                <span className="font-semibold text-slate-900">MongoDB</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Mongoose ODM</span>
                <span className="text-[10px] text-slate-400 mt-2">Subjects, Tasks, Logs</span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-2.5 bg-white border border-blue-100 rounded-md flex items-center gap-3">
                <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 text-[11px]">Python Microservice (FastAPI)</div>
                  <div className="text-[10px] text-slate-500">Heuristic schedule optimizer & spaced-repetition scheduler</div>
                </div>
              </div>
              <div className="p-2.5 bg-white border border-purple-100 rounded-md flex items-center gap-3">
                <Layers className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 text-[11px]">Gemini 2.5 API (Server-Side)</div>
                  <div className="text-[10px] text-slate-500">Adaptive study plan generation & interview question feedback</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Interview Talking Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Key Architectural Decisions for Technical Interviews
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">1. Unidirectional Data Flow in React:</strong>
                    <p className="mt-0.5">
                      State for subjects, timetable slots, and tasks lives at the top-level workspace state hook. State mutations happen through explicit handler callbacks (e.g. <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">handleToggleTaskStatus</code>), preventing synchronization mismatches across the dashboard and planner.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">2. Why Separate Node/Express from Python/FastAPI:</strong>
                    <p className="mt-0.5">
                      Node.js handles high-throughput I/O-bound CRUD tasks (user sessions, websocket alerts, task persistence in MongoDB). FastAPI in Python is dedicated to compute-heavy operations: genetic timetable optimization, spaced-repetition curve calculations, and AI embeddings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">3. Secure AI Architecture:</strong>
                    <p className="mt-0.5">
                      The Gemini API key is strictly kept in server-side environment variables. The client never talks directly to Gemini. Instead, the client sends a structured request to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">POST /api/ai/coach/plan</code>, which validates the user token, bounds tokens, applies prompt system instructions, and returns clean typed JSON.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">4. MongoDB Schema Strategy:</strong>
                    <p className="mt-0.5">
                      Embedded subdocuments for syllabus topics (which don't change independently), but referenced documents for <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">tasks</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">study_logs</code> to avoid document growth limits and enable fast indexed queries on user ID and completion timestamp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Use this modal anytime to refresh your technical interview explanations.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
