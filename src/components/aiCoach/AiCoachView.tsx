import React from 'react';
import { Sparkles, ShieldCheck, Code, Layers, Server, Calendar, ArrowRight } from 'lucide-react';
import { Subject, Task } from '../../types';

interface AiCoachViewProps {
  subjects: Subject[];
  tasks: Task[];
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({ subjects, tasks }) => {
  const totalHours = subjects.reduce((sum, s) => sum + s.completedHours, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Study Coach</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture Blueprint & Integration Specifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
            Scheduled for Phase 2 Backend Implementation
          </span>
        </div>
      </div>

      {/* Integration Notice Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
          Active Security Policy
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In strict accordance with production security standards, no simulated or client-side Gemini API calls are executed in this MVP. Real AI coaching capabilities will be wired in Phase 2 via server-side proxy routes on Node.js/Express, preventing client-side API key exposure.
        </p>
      </div>

      {/* Architecture Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Zero Client Key Exposure</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gemini API credentials will reside strictly in server-side environment variables (<code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code>). Browser clients never touch secret credentials.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Target Express Proxy Route</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The frontend will issue authenticated <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">POST /api/ai/coach/plan</code> requests sending sanitized metrics ({subjects.length} subjects, {tasks.length} tasks, {totalHours} logged hours).
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="w-8 h-8 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
            <Code className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">FastAPI Schedule Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In Phase 3, a Python FastAPI microservice will handle constraint-based timetable scheduling and vector embeddings for technical interview question retrieval.
          </p>
        </div>
      </div>

      {/* Planned API Contract */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Phase 2 Planned Endpoint Contract
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified JSON schema for client-to-backend communication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block font-mono">
              Request: POST /api/ai/coach/plan
            </span>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-md text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "totalLoggedHours": ${totalHours},
  "subjects": [
    ${subjects.map((s) => `"${s.name} (${s.completedHours}h / ${s.targetHours}h)"`).join(',\n    ')}
  ],
  "pendingTaskCount": ${tasks.filter((t) => t.status !== 'completed').length}
}`}
            </pre>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block font-mono">
              Expected Response Schema
            </span>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-md text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "primaryWeakArea": "Distributed Systems",
  "recommendedWeeklyBlocks": [
    { "subject": "Distributed Computing", "focus": "Raft Consensus", "durationMinutes": 90 },
    { "subject": "MERN Stack", "focus": "Express Middleware", "durationMinutes": 60 }
  ],
  "interviewTips": "Emphasize partition tolerance under CAP theorem."
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
