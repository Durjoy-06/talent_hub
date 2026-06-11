import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Compass, 
  Bookmark, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Flame, 
  Activity, 
  Sparkles, 
  BookOpen, 
  Github, 
  Linkedin, 
  ArrowRight,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Sliders,
  Bell
} from 'lucide-react';
import { LoggedInUser, Opportunity, EventHub, Application } from '../types';

interface StudentDashboardProps {
  user: LoggedInUser;
  onLogout: () => void;
  opportunities: Opportunity[];
  events: EventHub[];
  applications: Application[];
  savedOpportunityIds: string[];
  appliedOpportunityIds: string[];
  registeredEventIds: string[];
  onApplyOpportunity: (opportunityId: string) => void;
  onSaveOpportunity: (opportunityId: string) => void;
  onRegisterEvent: (eventId: string) => void;
}

export default function StudentDashboard({
  user,
  onLogout,
  opportunities,
  events,
  applications,
  savedOpportunityIds,
  appliedOpportunityIds,
  registeredEventIds,
  onApplyOpportunity,
  onSaveOpportunity,
  onRegisterEvent
}: StudentDashboardProps) {
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'growth' | 'applications' | 'events' | 'saved'>('growth');
  const [currentUtc, setCurrentUtc] = useState<string>('06:58:27');

  // Animated counters state
  const [skillIndex, setSkillIndex] = useState<number>(0);
  const [hubReputation, setHubReputation] = useState<number>(0);

  // Trigger non-intrusive animated counters on mount
  useEffect(() => {
    const skillTarget = 875;
    const repTarget = 420;
    
    let skillCurrent = 0;
    let repCurrent = 0;

    const skillInterval = setInterval(() => {
      if (skillCurrent < skillTarget) {
        skillCurrent += Math.ceil((skillTarget - skillCurrent) / 10);
        setSkillIndex(skillCurrent);
      } else {
        setSkillIndex(skillTarget);
        clearInterval(skillInterval);
      }
    }, 30);

    const repInterval = setInterval(() => {
      if (repCurrent < repTarget) {
        repCurrent += Math.ceil((repTarget - repCurrent) / 10);
        setHubReputation(repCurrent);
      } else {
        setHubReputation(repTarget);
        clearInterval(repInterval);
      }
    }, 35);

    return () => {
      clearInterval(skillInterval);
      clearInterval(repInterval);
    };
  }, []);

  // Sync clock time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentUtc(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const studentApplications = applications.filter(app => app.studentEmail === user.email);

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-800 flex overflow-hidden">
      
      {/* 1. Arc / Linear-Inspired Collapsible Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarExpanded ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 text-slate-400 z-30 select-none"
      >
        <div className="flex flex-col">
          {/* Logo Brand bar */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            <AnimatePresence mode="wait">
              {isSidebarExpanded ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    TalentHub<span className="text-[#9CD5FF] font-serif italic">.BD</span>
                  </span>
                  <span className="text-[7px] font-mono bg-blue-500/10 text-[#9CD5FF] px-1.5 py-0.5 rounded uppercase">STUDENT</span>
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto">
                  <span className="font-serif italic text-sm">T</span>
                </div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
              id="sidebar-toggle-btn"
            >
              {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* User Profile Summary row */}
          <div className="p-3 border-b border-slate-800/60 overflow-hidden">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-xl border border-slate-700 shrink-0" 
              />
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden min-w-0"
                  >
                    <span className="block text-xs font-bold text-slate-200 truncate">{user.name}</span>
                    <span className="block text-[9px] font-mono text-slate-500 truncate">{user.email}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Links Stack */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('growth')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'growth' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              id="nav-growth-tab-btn"
            >
              <Compass className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Growth Feed ]</span>}
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all relative ${
                activeTab === 'applications' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              id="nav-app-tab-btn"
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Applications ]</span>}
              {studentApplications.length > 0 && isSidebarExpanded && (
                <span className="absolute right-3 bg-slate-800 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {studentApplications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'events' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              id="nav-events-tab-btn"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Event Agenda ]</span>}
              {registeredEventIds.length > 0 && isSidebarExpanded && (
                <span className="absolute right-3 bg-emerald-600 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {registeredEventIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'saved' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              id="nav-saved-tab-btn"
            >
              <Bookmark className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Saved Posts ]</span>}
              {savedOpportunityIds.length > 0 && isSidebarExpanded && (
                <span className="absolute right-3 bg-sky-600 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {savedOpportunityIds.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Exit Logout Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            id="dashboard-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarExpanded && <span>[ Disconnect Hub ]</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Main content block workspace */}
      <div className="flex-1 overflow-y-auto h-screen relative flex flex-col justify-between">
        
        {/* Dynamic header stats band */}
        <header className="sticky top-0 z-20 bg-[#F7F8F0]/90 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-100 border border-blue-200 text-blue-700 rounded-2xl flex items-center justify-center">
              <User className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-slate-800">
                  Welcome Back, <span className="text-blue-700 font-serif italic font-normal">{user.name.split(' ')[0]}</span> 👋
                </h1>
                <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" /> {user.division} HUB Node
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {user.university} Academy • Synapse Identity: {user.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <span className="block text-[8px] font-mono text-slate-400 font-semibold tracking-wider uppercase">SECTOR_CLOCK UTC_SYST</span>
              <span className="block font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 mt-0.5">{currentUtc}</span>
            </div>
            
            <div className="relative">
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 3. Primary active tab view block */}
        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          <AnimatePresence mode="wait">
            {activeTab === 'growth' && (
              <motion.div
                key="growth_feed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Profile Personal growth stats counters block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.06)]">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full -mr-4 -mt-4 opacity-70" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ GRAPH_SCORE ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2 flex items-baseline gap-1">
                      {skillIndex} <span className="text-[10px] font-mono text-blue-600 font-medium">INDEX</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Calculated from verified skill assets.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.06)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#7AAACE]/10 rounded-full -mr-4 -mt-4 opacity-70" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ HUB_REPUTATION ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2 flex items-baseline gap-1">
                      {hubReputation} <span className="text-[10px] font-mono text-emerald-600 font-bold">REP</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Silver Tier. High cluster coordination.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.06)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full -mr-4 -mt-4 opacity-70" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ ACTIVE_APPLICATIONS ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2">
                      {studentApplications.length} <span className="text-[10px] font-mono text-slate-400 font-normal">nodes</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Sectors currently evaluating.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-blue-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.06)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-full -mr-4 -mt-4 opacity-70" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ SCHEDULED_EVENTS ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2">
                      {registeredEventIds.length} <span className="text-[10px] font-mono text-slate-400 font-normal">slates</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">National bootcamps locked in.</p>
                  </div>
                </div>

                {/* Sub-cards: Personal Growth Feed recommendations & Task list */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column Feed */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border text-left rounded-3xl p-6 border-slate-200/80 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] artistic-dashed" />
                      <div className="flex items-center gap-2 text-blue-600 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold uppercase">Dynamic Personalized Recommendations</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/40 hover:bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-4 transition-all duration-200 cursor-pointer">
                          <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">RECOMMENDED COURSEWAY</span>
                            <h3 className="font-semibold text-xs text-slate-800 mt-1">Optimize Transformer weights for Low-Resource Languages</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Contribute to BUET's Bangla dialect project. Your NLP skills match 85% of standard parameters.</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 self-center ml-auto" />
                        </div>

                        <div className="p-4 bg-[#F7F8F0]/50 hover:bg-[#F7F8F0]/70 rounded-2xl border border-slate-200 flex items-start gap-4 transition-all duration-200 cursor-pointer">
                          <Activity className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">HIGH IMPRESSION OPP</span>
                            <h3 className="font-semibold text-xs text-slate-800 mt-1">Distributed Systems Fellowship at BanglaTech Institute</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Sylhet Hub is evaluating. Highlight your C++ or Go credentials to catch their lead problem setter.</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0 self-center ml-auto" />
                        </div>
                      </div>
                    </div>

                    {/* Integrated Bio editing block */}
                    <div className="bg-white border rounded-3xl p-6 border-slate-200/80 shadow-sm">
                      <h2 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-emerald-600" /> Digital Credentials & Bio Profile Node
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">PERSONAL BIO</span>
                          <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-light">
                            {user.bio || 'Your bio profile is currently blank. Update your grid specs to describe your skills.'}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 font-bold block">VERIFIED CODE SPEC SHEETS</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {user.skills?.map(skill => (
                                <span key={skill} className="text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-150 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-600 transition-colors">
                              <Github className="w-3.5 h-3.5" /> [ Github ]
                            </a>
                            <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-150 border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-mono text-slate-600 transition-colors">
                              <Linkedin className="w-3.5 h-3.5" /> [ LinkedIn ]
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Action Log */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border rounded-3xl p-5 border-slate-200/80 shadow-sm">
                      <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> [ SYSTEM_WALKTHROUGH ]
                      </h3>
                      
                      <div className="space-y-3.5 pt-1">
                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-1" />
                          <div className="text-[11px] text-slate-600">
                            <strong>Sync Google OAuth</strong>
                            <p className="text-slate-400 text-[10px]">Registry profile aligned with google account.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" checked={studentApplications.length > 0} readOnly className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-1 pointer-events-none" />
                          <div className="text-[11px] text-slate-600">
                            <strong>Submit First Application</strong>
                            <p className="text-slate-400 text-[10px]">{studentApplications.length > 0 ? 'Completed. Under evaluation.' : 'Evaluate the jobs matrix.'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" checked={registeredEventIds.length > 0} readOnly className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-1 pointer-events-none" />
                          <div className="text-[11px] text-slate-600">
                            <strong>Register for NLP Hack</strong>
                            <p className="text-slate-400 text-[10px]">{registeredEventIds.length > 0 ? 'Token locked in timeline.' : 'Check the Events directory.'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-1" />
                          <div className="text-[11px] text-slate-600">
                            <strong>Link Division Node</strong>
                            <p className="text-slate-400 text-[10px]">Your node map shows deep {user.division} link.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fun mini status badge */}
                    <div className="bg-[#355872] text-[#F7F8F0] p-5 rounded-3xl shadow-sm relative overflow-hidden text-left">
                      <div className="absolute top-[-30%] right-[-10%] w-24 h-24 bg-white/5 rounded-full" />
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#9CD5FF] font-bold uppercase">
                        <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> CLUSTER INTEGRITY STATUS
                      </div>
                      <h4 className="font-display font-extrabold text-sm mt-2">Core Connection: Standard High</h4>
                      <p className="text-[10px] text-[#9CD5FF]/80 mt-1 font-light leading-relaxed">
                        Data flows are isolated. Encrypted socket active with 0% latency loss recorded.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">[ REALTIME LOGS ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">My Opportunity Applications</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 border text-slate-500 font-bold">
                    {studentApplications.length} Evaluation Nodes Active
                  </span>
                </div>

                {studentApplications.length === 0 ? (
                  <div className="bg-white border rounded-3xl p-12 text-center text-slate-400 space-y-4">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono text-slate-600">[ NO ACTIVE APPLICATION FOUND ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto">You haven't submitted any digital applications yet. Browse saved posts or check the opportunity board.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentApplications.map(app => {
                      const statusColor = 
                        app.status === 'Shortlisted' ? 'emerald' :
                        app.status === 'Interviewing' ? 'blue' :
                        app.status === 'Offer Received' ? 'violet' : 'amber';
                      
                      return (
                        <div 
                          key={app.id} 
                          className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 relative overflow-hidden hover:border-slate-800 transition-colors"
                        >
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">{app.organization}</span>
                              <h3 className="font-sans font-bold text-sm text-slate-800 mt-1 leading-snug">{app.opportunityTitle}</h3>
                            </div>
                            <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-lg border ${
                              statusColor === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              statusColor === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              statusColor === 'violet' ? 'bg-violet-50 text-violet-700 border-violet-200 animate-pulse' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex flex-wrap justify-between items-center gap-2">
                            <span className="font-mono">Applied: {app.dateApplied}</span>
                            <span className="font-mono">Sync ID: {app.id}</span>
                          </div>

                          {/* Dynamic actions for specific status types */}
                          {app.status === 'Offer Received' && (
                            <div className="mt-4 p-3.5 bg-violet-50/40 border-2 border-violet-200 rounded-2xl flex flex-col justify-between items-stretch gap-2 animate-pulse">
                              <span className="text-[10px] text-violet-800 font-bold block">🎉 Sector Offer Received. Confirm your fellowship terms instantly.</span>
                              <div className="flex gap-2 text-[10px] font-mono">
                                <button className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold">Accept Offer</button>
                                <button className="flex-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg font-bold">Decline</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ GRID TIMELINE ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">My Registered Events</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 border text-slate-500 font-bold">
                    {registeredEventIds.length} Scheduled Slates
                  </span>
                </div>

                {registeredEventIds.length === 0 ? (
                  <div className="bg-white border rounded-3xl p-12 text-center text-slate-400 space-y-4">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono text-slate-600">[ NO EVENT BOOKINGS FOUND ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto">Your schedule is currently clear. Access the events agenda on the main page to reserve your seat.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 before:dashed">
                    {events.filter(e => registeredEventIds.includes(e.id)).map((ev, idx) => (
                      <div key={ev.id} className="relative">
                        {/* Timeline Node dot */}
                        <div className="absolute -left-[30px] sm:-left-[34px] top-1.5 w-5 h-5 rounded-full bg-slate-900 border-4 border-[#F7F8F0] flex items-center justify-center text-white" />
                        
                        <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.04)] hover:border-slate-800 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-400 font-bold block">{ev.organizer}</span>
                              <h3 className="font-sans font-bold text-sm text-slate-800">{ev.title}</h3>
                            </div>
                            <span className="text-[9px] font-mono font-bold bg-[#355872]/8 text-[#355872] px-2.5 py-1 rounded-lg border border-slate-100 self-start sm:self-center uppercase">
                              {ev.date}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-light leading-relaxed max-w-2xl">{ev.description}</p>
                          
                          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-4 text-[10px] font-mono">
                            <span className="text-slate-400 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#7AAACE]" /> Linked Node: {ev.division} division
                            </span>
                            <button 
                              onClick={() => alert(`LOBBY DETAILS: Connected with digital access token client_token_${ev.id}. Room links are sent via durjoybanik06@gmail.com.`)}
                              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-8 transition-colors font-bold"
                            >
                              [ Digital Lobby Token ]
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ REPOSITORY_DRAFT ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">My Saved Opportunities</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 border text-slate-500 font-bold">
                    {savedOpportunityIds.length} Saved Posts
                  </span>
                </div>

                {savedOpportunityIds.length === 0 ? (
                  <div className="bg-white border rounded-3xl p-12 text-center text-slate-400 space-y-4">
                    <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono text-slate-600">[ NO SAVED POSTS FOUND ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto">Your saved list is empty. Hover and select opportunities to archive them under your personal folder index.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {opportunities.filter(o => savedOpportunityIds.includes(o.id)).map(opp => {
                      const isApplied = appliedOpportunityIds.includes(opp.id);
                      
                      return (
                        <div 
                          key={opp.id} 
                          className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 relative flex flex-col justify-between hover:border-slate-800 transition-colors"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">{opp.organization}</span>
                                <h3 className="font-sans font-bold text-sm text-slate-800 mt-1">{opp.title}</h3>
                              </div>
                              <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                {opp.type}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-light mt-2 line-clamp-2 leading-relaxed">{opp.description}</p>
                            
                            <div className="flex flex-wrap gap-1.5 pt-3 mb-4">
                              {opp.skillsRequired.map(s => (
                                <span key={s} className="text-[9px] font-mono bg-[#355872]/5 text-[#355872] px-2 py-0.5 rounded border border-slate-100 font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4 flex gap-2 justify-between items-center text-[11px] font-mono mt-auto">
                            <span className="text-slate-500 font-bold">{opp.stipend}</span>
                            
                            <div className="flex gap-1.5">
                              <button 
                                onClick={() => onSaveOpportunity(opp.id)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200"
                              >
                                <Bookmark className="w-4 h-4 fill-sky-600 outline-none stroke-sky-700" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (!isApplied) {
                                    onApplyOpportunity(opp.id);
                                    alert(`SUCCESS: Application submitted to ${opp.organization} for ${opp.title}! Check your status on the applications tab.`);
                                  }
                                }}
                                disabled={isApplied}
                                className={`px-4 py-2 text-xs font-mono font-bold rounded-lg ${
                                  isApplied 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                              >
                                {isApplied ? '[ Applied ✓ ]' : '[ Apply Instantly ]'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Custom footer design inside dashboard */}
        <footer className="bg-slate-950 text-slate-500 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono mt-auto border-t border-slate-900">
          <span>COSMIC SHARD WORKSPACE ID: 0x98A7F</span>
          <span>TalentHub.BD v2.6 • Active Session Verified Encryption TLSv1.3</span>
        </footer>

      </div>

    </div>
  );
}
