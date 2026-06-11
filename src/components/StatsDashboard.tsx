import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Users, Code, HelpCircle, Briefcase, Network, Radio } from 'lucide-react';

interface StatsDashboardProps {
  stats: {
    activeStudents: number;
    activeProjects: number;
    connectedHubs: number;
    placedTalents: number;
  };
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  // Local state for animating and simulating growth
  const [activeStudents, setActiveStudents] = useState(stats.activeStudents);
  const [activeProjects, setActiveProjects] = useState(stats.activeProjects);
  const [placedTalents, setPlacedTalents] = useState(stats.placedTalents);
  const [recentLog, setRecentLog] = useState<string>('National talent registry synchronized.');
  const [isPinging, setIsPinging] = useState(false);

  // Auto increment stats occasionally to simulate a living network
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random increments
      setActiveStudents(prev => prev + Math.floor(Math.random() * 3) + 1);
      
      if (Math.random() > 0.75) {
        setActiveProjects(prev => prev + 1);
        setRecentLog(`Opportunity Node published: New remote frontend contract added.`);
      }
      if (Math.random() > 0.85) {
        setPlacedTalents(prev => prev + 1);
        setRecentLog(`Talent Placed: Developer from SUST Hub joined Lion Labs BD.`);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handlePingNetwork = () => {
    setIsPinging(true);
    // Add bump to numbers
    setActiveStudents(prev => prev + Math.floor(Math.random() * 8) + 3);
    setActiveProjects(prev => prev + Math.floor(Math.random() * 2));
    setRecentLog(`Security handshake complete. 14 student clusters reporting from Rajshahi and Chattogram.`);
    
    setTimeout(() => {
      setIsPinging(false);
    }, 1200);
  };

  return (
    <div id="live-ecosystem" className="my-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Radio className="w-3.5 h-3.5 text-[#355872] pulsing-dot" /> Live Registry Statistics
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#355872] tracking-tight">
            Live Bangladesh Ecosystem Indices
          </h2>
        </div>

        <button
          onClick={handlePingNetwork}
          disabled={isPinging}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium border border-slate-200 shadow-3xs transition-all ${
            isPinging 
              ? 'bg-[#355872] text-[#F7F8F0] border-[#355872]' 
              : 'bg-white text-[#355872] hover:bg-[#F7F8F0]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isPinging ? 'bg-white animate-ping' : 'bg-green-500'}`} />
          {isPinging ? 'Broadcasting Hub Overload...' : 'Simulate Network Ping'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden group">
          {/* Decorative Corner Ticks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#355872]/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#355872]/40" />
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#355872]/10 border border-[#355872]/25 flex items-center justify-center text-[#355872]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">[ REGISTRY_ID: 104 ]</span>
          </div>
          <span className="text-xs font-mono text-slate-400 block uppercase">Student Members</span>
          <div className="text-3xl font-mono font-bold text-[#355872] mt-1 filter drop-shadow-3xs">
            {activeStudents.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Verified engineers, writers, designers, and research students.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden group">
          {/* Decorative Corner Ticks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#355872]/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#355872]/40" />

          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#7AAACE]/10 border border-[#7AAACE]/25 flex items-center justify-center text-[#7AAACE]">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">[ CODE_SHARDS ]</span>
          </div>
          <span className="text-xs font-mono text-slate-400 block uppercase">Vetted Opportunities</span>
          <div className="text-3xl font-mono font-bold text-[#1E293B] mt-1">
            {activeProjects}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Active industrial internships, contracts and open fellowships.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden group">
          {/* Decorative Corner Ticks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#355872]/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#355872]/40" />

          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#9CD5FF]/15 border border-[#9CD5FF]/30 flex items-center justify-center text-slate-700">
              <Network className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">[ EDGES_BD ]</span>
          </div>
          <span className="text-xs font-mono text-slate-400 block uppercase">Divisional Hubs</span>
          <div className="text-3xl font-mono font-bold text-[#355872] mt-1">
            {stats.connectedHubs}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Geographic focal zones linked with active fiber mesh gateways.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden group">
          {/* Decorative Corner Ticks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#355872]/40" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#355872]/40" />

          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 -z-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/25 flex items-center justify-center text-emerald-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">[ OUTCOMES_BD ]</span>
          </div>
          <span className="text-xs font-mono text-slate-400 block uppercase">Placed Innovators</span>
          <div className="text-3xl font-mono font-bold text-emerald-700 mt-1">
            {placedTalents}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Students fully integrated into paid startup cycles and labs.
          </p>
        </div>

      </div>

      {/* Realtime Terminal Stream */}
      <div className="mt-6 bg-[#1D2430] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9CD5FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9CD5FF]"></span>
          </span>
          <span className="text-xs font-mono text-slate-400">STATUS_FEED:</span>
          <span className="text-xs font-mono text-[#9CD5FF]">{recentLog}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          LAST ACCELERATOR PULSE: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
