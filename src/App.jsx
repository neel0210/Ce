import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Mail, BarChart3, Trophy, CheckCircle, Circle, PlusCircle, X } from 'lucide-react';
import Simulator from './components/Simulator';
import Evaluator from './components/Evaluator';
import { tasks } from './data/tasks';

export default function App() {
  const [view, setView] = useState('landing'); 
  const [currentTask, setCurrentTask] = useState(null);
  const [studentResponse, setStudentResponse] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Progress Tracking
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('celwrite_progress') || '[]');
    } catch { return []; }
  });

  const progressPercentage = Math.round((completedTasks.length / tasks.length) * 100);

  const handleFinish = (text) => {
    setStudentResponse(text);
    const newProgress = [...new Set([...completedTasks, currentTask.id])];
    setCompletedTasks(newProgress);
    localStorage.setItem('celwrite_progress', JSON.stringify(newProgress));
    setView('results');
  };

  // View Switcher
  if (view === 'exam') return <Simulator task={currentTask} onFinish={handleFinish} />;
  if (view === 'results') return <Evaluator userInput={studentResponse} task={currentTask} onReset={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[140px]" />
      </div>

      <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black italic bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">CELWRITE.</h1>
        <div className="flex items-center gap-6">
          <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <span className="text-sm font-bold">{progressPercentage}% Done</span>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10">
            <Settings size={24} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 mt-12">
        <header className="mb-12">
          <h2 className="text-7xl font-bold mb-4">Practice <span className="text-indigo-400 italic">Smart.</span></h2>
          <p className="text-slate-400 text-xl">Official CELPIP writing simulation powered by Gemini AI.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-16">
          <button onClick={() => setActiveTab(1)} className={`flex-1 py-8 rounded-[2.5rem] border-2 transition-all font-bold text-xl flex items-center justify-center gap-3 ${activeTab === 1 ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/10'}`}>
            <Mail size={28} /> Task 1
          </button>
          <button onClick={() => setActiveTab(2)} className={`flex-1 py-8 rounded-[2.5rem] border-2 transition-all font-bold text-xl flex items-center justify-center gap-3 ${activeTab === 2 ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/10'}`}>
            <BarChart3 size={28} /> Task 2
          </button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tasks.filter(t => t.type === activeTab).map((task) => (
            <div key={task.id} onClick={() => { setCurrentTask(task); setView('exam'); }} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">Recall</span>
                {completedTasks.includes(task.id) && <CheckCircle className="text-emerald-400" size={24} />}
              </div>
              <h3 className="text-2xl font-bold mb-4">{task.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{task.prompt}</p>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase">
                Start Simulation <PlusCircle size={14} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-[3rem] p-10 relative">
              <button onClick={() => setShowSettings(false)} className="absolute top-8 right-8 text-slate-500"><X size={24}/></button>
              <h3 className="text-2xl font-bold mb-8">Gemini Setup</h3>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">API Key</label>
              <input 
                type="password"
                defaultValue={localStorage.getItem('celwrite_gemini_key') || ''}
                placeholder="Paste Gemini Key..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none"
                onChange={(e) => localStorage.setItem('celwrite_gemini_key', e.target.value)}
              />
              <button onClick={() => setShowSettings(false)} className="w-full mt-10 bg-indigo-600 py-5 rounded-2xl font-black text-sm transition active:scale-95">SAVE CONFIG</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}