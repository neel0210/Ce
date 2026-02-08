import React, { useState, useEffect } from 'react';
import { Timer, Type, CheckCircle2 } from 'lucide-react';

const Simulator = ({ task, onFinish }) => {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(task.type === 1 ? 27 * 60 : 26 * 60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const progress = Math.min((wordCount / 200) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#020617] text-slate-200 font-sans">
      {/* Top Header: Professional Dark */}
      <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md px-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Type size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase">CELPIP Writing Task {task.type}</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black">Official Simulation Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 font-mono text-lg">
            <Timer size={18} className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-indigo-400"} />
            <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Task Instructions (Glass Card) */}
        <div className="w-[40%] p-10 overflow-y-auto border-r border-white/10 bg-gradient-to-b from-transparent to-indigo-500/5">
          <div className="max-w-xl">
            <h2 className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Prompt Instructions</h2>
            <div className="glass p-8 rounded-3xl leading-relaxed text-lg text-slate-300 italic shadow-2xl">
              {task.prompt}
            </div>
          </div>
        </div>

        {/* Right: Answer Box (Liquid Glass UI) */}
        <div className="w-[60%] p-10 flex flex-col bg-[#030816]">
          <div className="flex-1 flex flex-col gap-6">
            <div className="relative flex-1 group">
              {/* The Liquid Glass Answer Box */}
              <textarea
                className="liquid-textarea w-full h-full p-10 rounded-[2.5rem] outline-none text-xl leading-relaxed font-light text-white shadow-2xl transition-all placeholder:text-slate-700"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck="false"
                placeholder="Compose your response here..."
              />
              
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none border border-indigo-500/10 group-focus-within:border-indigo-500/30 transition-colors" />
            </div>

            {/* Robust Bottom Bar */}
            <div className="glass p-6 rounded-3xl flex items-center justify-between">
              <div className="flex flex-col gap-2 flex-1 max-w-xs">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest px-1">
                  <span className={wordCount < 150 || wordCount > 200 ? "text-amber-500" : "text-emerald-400"}>
                    {wordCount} Words
                  </span>
                  <span className="text-slate-500">Target: 150-200</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${wordCount > 200 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              <button 
                onClick={() => onFinish(text)} 
                className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                SUBMIT FOR AI EVALUATION
                <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;