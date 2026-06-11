import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  MapPin, 
  Sliders, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Users, 
  Briefcase, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Globe, 
  Terminal, 
  FileText, 
  Send, 
  RefreshCw,
  Bell,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { LoggedInUser, Opportunity, EventHub, Application } from '../types';

interface OrganizerDashboardProps {
  user: LoggedInUser;
  onLogout: () => void;
  opportunities: Opportunity[];
  events: EventHub[];
  applications: Application[];
  onChangeApplicationStatus: (appId: string, newStatus: Application['status']) => void;
  onAddOpportunity: (newOpp: Opportunity) => void;
  onAddEvent: (newEvent: EventHub) => void;
  onDeleteOpportunity: (oppId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function OrganizerDashboard({
  user,
  onLogout,
  opportunities,
  events,
  applications,
  onChangeApplicationStatus,
  onAddOpportunity,
  onAddEvent,
  onDeleteOpportunity,
  onDeleteEvent
}: OrganizerDashboardProps) {

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'command' | 'applicants' | 'postings' | 'publish'>('command');
  const [currentUtc, setCurrentUtc] = useState<string>('06:58:27');
  
  // Analytics counter trigger
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [activeAdNode, setActiveAdNode] = useState<number>(0);

  // Form states - Opportunity Posting
  const [oppTitle, setOppTitle] = useState<string>('');
  const [oppOrg, setOppOrg] = useState<string>('');
  const [oppType, setOppType] = useState<'Internship' | 'Full-Time' | 'Fellowship' | 'Project'>('Internship');
  const [oppStipend, setOppStipend] = useState<string>('BDT 25,000 / month');
  const [oppDivision, setOppDivision] = useState<string>('Dhaka');
  const [oppSkills, setOppSkills] = useState<string>('React, TypeScript, Framer Motion');
  const [oppDesc, setOppDesc] = useState<string>('');

  // Form states - Event Posting
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventType, setEventType] = useState<'Hackathon' | 'Bootcamp' | 'Workshop' | 'Meetup'>('Hackathon');
  const [eventDate, setEventDate] = useState<string>('June 25, 2026');
  const [eventOrganizer, setEventOrganizer] = useState<string>('');
  const [eventDivision, setEventDivision] = useState<string>('Dhaka');
  const [eventDesc, setEventDesc] = useState<string>('');

  useEffect(() => {
    const regTarget = 2390;
    const nodeTarget = 427;
    
    let regCurrent = 0;
    let nodeCurrent = 0;

    const regInterval = setInterval(() => {
      if (regCurrent < regTarget) {
        regCurrent += Math.ceil((regTarget - regCurrent) / 10);
        setTotalRegistrations(regCurrent);
      } else {
        setTotalRegistrations(regTarget);
        clearInterval(regInterval);
      }
    }, 25);

    const nodeInterval = setInterval(() => {
      if (nodeCurrent < nodeTarget) {
        nodeCurrent += Math.ceil((nodeTarget - nodeCurrent) / 10);
        setActiveAdNode(nodeCurrent);
      } else {
        setActiveAdNode(nodeTarget);
        clearInterval(nodeInterval);
      }
    }, 30);

    return () => {
      clearInterval(regInterval);
      clearInterval(nodeInterval);
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

  // Handle publishes
  const postNewOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle || !oppOrg || !oppDesc) {
      alert('Must fill out Title, Organization, and Description fields.');
      return;
    }

    const newOpp: Opportunity = {
      id: 'o_dyn_' + Date.now().toString().slice(-4),
      title: oppTitle,
      type: oppType,
      organization: oppOrg,
      division: oppDivision,
      skillsRequired: oppSkills.split(',').map(s => s.trim()).filter(Boolean),
      description: oppDesc,
      stipend: oppStipend,
      datePosted: 'June 11, 2026',
      applicantsCount: 0
    };

    onAddOpportunity(newOpp);
    alert(`SUCCESS: Opportunity "${oppTitle}" is now live across Bangladesh's opportunity networks!`);
    
    // reset form fields
    setOppTitle('');
    setOppOrg('');
    setOppDesc('');
    setActiveTab('postings');
  };

  const postNewEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventOrganizer || !eventDesc) {
      alert('Must fill out Title, Organizer, and Description fields.');
      return;
    }

    const newEv: EventHub = {
      id: 'e_dyn_' + Date.now().toString().slice(-4),
      title: eventTitle,
      type: eventType,
      date: eventDate,
      division: eventDivision,
      organizer: eventOrganizer,
      attendeesCount: 0,
      description: eventDesc,
      registrationOpen: true
    };

    onAddEvent(newEv);
    alert(`SUCCESS: Event "${eventTitle}" has been scheduled live and registrations are open.`);
    
    setEventTitle('');
    setEventOrganizer('');
    setEventDesc('');
    setActiveTab('postings');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-800 flex overflow-hidden">
      
      {/* 1. Arc / Linear-Inspired Collapsible Sidebar with Organizer color theme */}
      <motion.aside 
        animate={{ width: isSidebarExpanded ? 240 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-slate-950 border-r border-slate-900 flex flex-col justify-between shrink-0 h-screen sticky top-0 text-slate-400 z-30 select-none"
      >
        <div className="flex flex-col">
          {/* Logo Bar in deep warm palette */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900">
            <AnimatePresence mode="wait">
              {isSidebarExpanded ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="font-display font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    TalentHub<span className="text-orange-400 font-serif italic">.BD</span>
                  </span>
                  <span className="text-[7px] font-mono bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded uppercase">ORGANIZER</span>
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-orange-700 flex items-center justify-center text-white mx-auto">
                  <span className="font-serif italic text-sm">O</span>
                </div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
              id="organizer-sidebar-toggle-btn"
            >
              {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Organizer Profile detail */}
          <div className="p-3 border-b border-slate-900/60 overflow-hidden">
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

          {/* Links stack representing rust/terracotta theme */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('command')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'command' 
                  ? 'bg-orange-700 text-white shadow-sm' 
                  : 'hover:bg-slate-900 hover:text-slate-200'
              }`}
              id="org-nav-command-btn"
            >
              <Activity className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Command Center ]</span>}
            </button>

            <button
              onClick={() => setActiveTab('applicants')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all relative ${
                activeTab === 'applicants' 
                  ? 'bg-orange-700 text-white shadow-sm' 
                  : 'hover:bg-slate-900 hover:text-slate-200'
              }`}
              id="org-nav-applicants-btn"
            >
              <Users className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Applicant Matrix ]</span>}
              {applications.length > 0 && isSidebarExpanded && (
                <span className="absolute right-3 bg-slate-900 text-white text-[9px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {applications.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('postings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'postings' 
                  ? 'bg-orange-700 text-white shadow-sm' 
                  : 'hover:bg-slate-900 hover:text-slate-200'
              }`}
              id="org-nav-postings-btn"
            >
              <Sliders className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Grid Postings ]</span>}
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'publish' 
                  ? 'bg-orange-700 text-white shadow-sm' 
                  : 'hover:bg-slate-900 hover:text-slate-200'
              }`}
              id="org-nav-publish-btn"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Quick Publish ]</span>}
            </button>
          </nav>
        </div>

        {/* Exit Logout option */}
        <div className="p-3 border-t border-slate-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            id="org-sidebar-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarExpanded && <span>[ Disconnect Hub ]</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Main content area */}
      <div className="flex-1 overflow-y-auto h-screen relative flex flex-col justify-between">
        
        {/* Persistent top dashboard stats band */}
        <header className="sticky top-0 z-20 bg-[#F7F8F0]/90 backdrop-blur-md border-b border-rose-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-orange-100 border border-orange-200 text-orange-800 rounded-2xl flex items-center justify-center">
              <Building className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg text-slate-800">
                  Organizer Command, <span className="text-orange-800 font-serif italic font-normal">{user.name.split(' ')[0]}</span> ⚙️
                </h1>
                <span className="text-[9px] font-mono font-bold bg-orange-50 border border-orange-150 text-orange-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-orange-800" /> {user.division} HUB Hub
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                Centralized Administrator Node • Authority Level: Grade-A Global Secure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <span className="block text-[8px] font-mono text-slate-400 font-semibold tracking-wider uppercase">SECTOR_CLOCK UTC_SYST</span>
              <span className="block font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 mt-0.5">{currentUtc}</span>
            </div>
            
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 3. Render sub-pages */}
        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          <AnimatePresence mode="wait">
            {activeTab === 'command' && (
              <motion.div
                key="command_center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Admin Counter Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-orange-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(158,88,56,0.06)]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ HUB_STUDENT_DENSITY ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2 flex items-baseline gap-1">
                      {totalRegistrations.toLocaleString()} <span className="text-[10px] text-orange-600 font-bold font-mono">SECTOR_ID</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Verified registries from public academies.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-orange-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(158,88,56,0.06)]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ PENDING_REVIEW_QUEUE ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2 flex items-baseline gap-1">
                      {applications.filter(a => a.status === 'Under Review').length} <span className="text-[10px] text-amber-600 font-bold font-mono">NODES</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Applications awaiting assessment certificates.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-orange-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(158,88,56,0.06)]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ LIVE_OPPORTUNITY_SLATES ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2">
                      {opportunities.length} <span className="text-[10px] text-slate-400 font-mono">channels</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Active industrial fellowships & internships.</p>
                  </div>

                  <div className="bg-white border-2 border-slate-200/60 p-5 rounded-3xl relative overflow-hidden group hover:border-orange-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(158,88,56,0.06)]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">[ CURRENT_GATEWAY_TRAFFIC ]</span>
                    <div className="text-2xl font-mono font-black text-slate-800 mt-2">
                      {activeAdNode} <span className="text-[10px] text-emerald-600 font-bold font-mono">CONS/SEC</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Fiber mesh node rate averages.</p>
                  </div>
                </div>

                {/* Highly aesthetic analytical SVG visualizer */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Custom Trend Graph */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-3xl text-left relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#7AAACE] uppercase tracking-wider font-bold">// SYSTEM METRIC DYNAMICS</span>
                        <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-orange-600" /> Platform Registrations & Engagement Curve
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border px-2.5 py-1 rounded-lg">LAST 7 CYCLES</span>
                    </div>

                    {/* Handmade High-Fidelity SVG Curve Chart */}
                    <div className="relative h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9E5838" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#9E5838" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                        {/* Trend Area */}
                        <path 
                          d="M 0 130 Q 80 110 140 80 T 280 60 T 420 40 T 500 20 L 500 150 L 0 150 Z" 
                          fill="url(#curveGradient)" 
                        />
                        {/* Trend Line */}
                        <path 
                          d="M 0 130 Q 80 110 140 80 T 280 60 T 420 40 T 500 20" 
                          fill="none" 
                          stroke="#9E5838" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                        />
                        {/* Data marker dots */}
                        <circle cx="140" cy="80" r="4" fill="#9E5838" stroke="white" strokeWidth="1.5" />
                        <circle cx="280" cy="60" r="4" fill="#9E5838" stroke="white" strokeWidth="1.5" />
                        <circle cx="420" cy="40" r="4" fill="#9E5838" stroke="white" strokeWidth="1.5" />
                        <circle cx="500" cy="20" r="5" fill="#bc6c25" stroke="white" strokeWidth="2.0" />
                      </svg>
                    </div>

                    {/* Chart Labels bar */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-4 mt-2">
                      <span>MON 05</span>
                      <span>TUE 06</span>
                      <span>WED 07</span>
                      <span>THU 08</span>
                      <span>FRI 09</span>
                      <span>SAT 10</span>
                      <span className="text-orange-700 font-bold">TODAY 11 ✓</span>
                    </div>
                  </div>

                  {/* Division Distribution Spark Panel */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-3xl">
                    <span className="text-[9px] font-mono text-slate-400 font-bold block mb-4 uppercase">[ SECTORAL_DENS BD_MAP ]</span>
                    <h3 className="font-sans font-bold text-xs text-slate-800 mb-3">Cluster Registrations</h3>
                    
                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                          <span>Dhaka Gateway</span>
                          <strong>1,420 connection</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-700 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                          <span>Chattogram Gateway</span>
                          <strong>680 connection</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-700 rounded-full" style={{ width: '50%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                          <span>Sylhet Gateway</span>
                          <strong>450 connection</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-700 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
                          <span>Rajshahi Gateway</span>
                          <strong>590 connection</strong>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-700 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Organizer Info panel */}
                <div className="bg-[#9E5838] text-white p-6 rounded-3xl shadow-sm text-left relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#F7F8F0]/5 opacity-[0.05] pointer-events-none" />
                  <div className="absolute top-[20%] right-[-10%] w-32 h-32 opacity-[0.05] artistic-dashed" />
                  <div className="flex items-center gap-2 text-[10px] font-mono text-orange-200 uppercase font-bold">
                    <ShieldCheck className="w-4 h-4" /> SECURE ROOT CONTROLLER CONSOLE
                  </div>
                  <h4 className="font-display font-extrabold text-base mt-2">Grid Operational Stability Standard: optimal</h4>
                  <p className="text-xs text-orange-100 mt-1 max-w-xl font-light leading-relaxed">
                    All published opportunity nodes trace back to encrypted sectors. Incoming candidate portfolios undergo structural checksum filtering automatically.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'applicants' && (
              <motion.div
                key="applicants_registry"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ live queue ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">Job Applicant Matrix</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-100 border text-slate-500 font-bold rounded-xl">
                    {applications.length} Candidates Pending Evaluation
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-white border rounded-3xl p-12 text-center text-slate-400 space-y-4">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono text-slate-600">[ APPLICATION PIPELINE VACANT ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto">No student builder has applied to active nodes yet. Make sure opportunities are highly relevant and categorized properly.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-white border-2 border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-[3px_3px_0px_0px_rgba(158,88,56,0.03)] hover:border-orange-500 transition-colors text-left"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{app.studentName}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border">{app.studentUniversity}</span>
                              <span className="text-[10px] font-mono text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> {app.studentDivision}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-500 mt-2">
                              Applied To: <strong className="text-slate-700 font-medium font-sans">{app.opportunityTitle}</strong> Line at <span className="font-bold">{app.organization}</span>
                            </p>
                            
                            <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-3 pt-3 border-t border-slate-50">
                              <span>Profile Email: {app.studentEmail}</span>
                              <span>Form Ref: {app.id}</span>
                            </div>
                          </div>

                          <div className="flex flex-col md:items-end justify-between gap-3 shrink-0">
                            {/* Current badge */}
                            <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg border text-center ${
                              app.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              app.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              app.status === 'Offer Received' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {app.status}
                            </span>

                            {/* State changer triggers inside Organizer portal */}
                            <div className="flex flex-wrap gap-1 md:justify-end text-[10px] font-mono">
                              <button 
                                onClick={() => {
                                  onChangeApplicationStatus(app.id, 'Shortlisted');
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 border text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 font-bold transition-all"
                                id={`btn-shortlist-${app.id}`}
                              >
                                [ Shortlist ]
                              </button>
                              <button 
                                onClick={() => {
                                  onChangeApplicationStatus(app.id, 'Interviewing');
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 border text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 font-bold transition-all"
                                id={`btn-interview-${app.id}`}
                              >
                                [ Schedule Call ]
                              </button>
                              <button 
                                onClick={() => {
                                  onChangeApplicationStatus(app.id, 'Offer Received');
                                }}
                                className="px-2.5 py-1.5 bg-orange-850 hover:bg-orange-700 text-white rounded-lg font-bold transition-all shadow-[2px_2px_0px_0px_rgba(158,88,56,0.2)]"
                                id={`btn-offer-${app.id}`}
                              >
                                [ Send Offer ]
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'postings' && (
              <motion.div
                key="active_postings_board"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ MANAGER CONSOLE ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">Active Published Channels</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-100 border text-slate-500 font-bold rounded-xl">
                    {opportunities.length + events.length} Port Registry Nodes
                  </span>
                </div>

                {/* Subsections of published postings */}
                <div className="space-y-8">
                  {/* Opportunities list */}
                  <div className="space-y-4 text-left">
                    <h3 className="font-display font-extrabold text-sm text-slate-705 flex items-center gap-1.5 border-b pb-2">
                      <Briefcase className="w-4 h-4 text-orange-700" /> Vetted Opportunity Posts ({opportunities.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {opportunities.map(opp => (
                        <div key={opp.id} className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl flex flex-col justify-between hover:border-slate-800 transition-colors">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 font-bold block">{opp.organization}</span>
                                <h4 className="font-sans font-bold text-xs text-slate-800 mt-0.5">{opp.title}</h4>
                              </div>
                              <button 
                                onClick={() => {
                                  if (confirm(`Confirm deleting opportunity "${opp.title}" from global index?`)) {
                                    onDeleteOpportunity(opp.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors border"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 font-light line-clamp-2 leading-relaxed">{opp.description}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t pt-3 mt-4">
                            <span>Applicants: {opp.applicantsCount} student</span>
                            <span className="text-orange-700 font-bold">{opp.stipend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Events list */}
                  <div className="space-y-4 text-left">
                    <h3 className="font-display font-extrabold text-sm text-slate-705 flex items-center gap-1.5 border-b pb-2">
                      <Calendar className="w-4 h-4 text-orange-700" /> Scheduled Academic Slates ({events.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map(ev => (
                        <div key={ev.id} className="bg-white border-2 border-slate-200/80 p-5 rounded-3xl flex flex-col justify-between hover:border-slate-800 transition-colors">
                          <div>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 font-bold block">{ev.organizer}</span>
                                <h4 className="font-sans font-bold text-xs text-slate-800 mt-0.5">{ev.title}</h4>
                              </div>
                              <button 
                                onClick={() => {
                                  if (confirm(`Confirm deleting event board "${ev.title}" from global slates?`)) {
                                    onDeleteEvent(ev.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors border"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 font-light line-clamp-2 leading-relaxed">{ev.description}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t pt-3 mt-4">
                            <span>Bookings: {ev.attendeesCount} student</span>
                            <span className="text-orange-700 font-bold">{ev.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'publish' && (
              <motion.div
                key="publish_tools"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ registry uploads ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">Quick Publish Ingress</h2>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-slate-100 border text-slate-500 font-bold rounded-xl">
                    Secure Ingress Terminal Access
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start text-left">
                  
                  {/* Publish Opportunity Form */}
                  <div className="bg-white border rounded-3xl p-6 border-slate-205 shadow-sm space-y-4">
                    <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
                      <Briefcase className="w-4.5 h-4.5 text-orange-700" /> [ INJECT OPPORTUNITY NODE ]
                    </h3>

                    <form onSubmit={postNewOpportunity} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400">OPPORTUNITY TITLE</label>
                        <input 
                          type="text" 
                          value={oppTitle} 
                          onChange={(e) => setOppTitle(e.target.value)}
                          placeholder="e.g. Distributed Systems Intern"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          required
                          id="field-opp-title"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">ORGANIZATION</label>
                          <input 
                            type="text" 
                            value={oppOrg} 
                            onChange={(e) => setOppOrg(e.target.value)}
                            placeholder="e.g. Delve Labs"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                            required
                            id="field-opp-org"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">STIPEND RANGE</label>
                          <input 
                            type="text" 
                            value={oppStipend} 
                            onChange={(e) => setOppStipend(e.target.value)}
                            placeholder="BDT 25,000 / month"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                            required
                            id="field-opp-stipend"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">PORT TYPE</label>
                          <select 
                            value={oppType}
                            onChange={(e) => setOppType(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          >
                            <option value="Internship">[ Internship ]</option>
                            <option value="Full-Time">[ Full-Time ]</option>
                            <option value="Fellowship">[ Fellowship ]</option>
                            <option value="Project">[ Project Contract ]</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">DIVISION HUB SECTOR</label>
                          <select 
                            value={oppDivision}
                            onChange={(e) => setOppDivision(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          >
                            {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400">SKILLS REQUIRED (COMMA SEPARATED)</label>
                        <input 
                          type="text" 
                          value={oppSkills} 
                          onChange={(e) => setOppSkills(e.target.value)}
                          placeholder="React, TypeScript, Framer Motion"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          required
                          id="field-opp-skills"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400">JOB DETAILS DESCRIPTION</label>
                        <textarea 
                          rows={3}
                          value={oppDesc} 
                          onChange={(e) => setOppDesc(e.target.value)}
                          placeholder="A detailed overview of the requirements..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none resize-none"
                          required
                          id="field-opp-desc"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-2.5 bg-orange-700 hover:bg-orange-850 text-white font-mono text-xs font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(158,88,56,0.2)] transition-all"
                        id="btn-opp-submit"
                      >
                        [ Publish Opportunity Slate ]
                      </button>
                    </form>
                  </div>

                  {/* Publish Event Form */}
                  <div className="bg-white border rounded-3xl p-6 border-slate-205 shadow-sm space-y-4">
                    <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b pb-2">
                      <Calendar className="w-4.5 h-4.5 text-orange-700" /> [ INJECT ACADEMIC EVENT SLATE ]
                    </h3>

                    <form onSubmit={postNewEvent} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400">EVENT TITLE</label>
                        <input 
                          type="text" 
                          value={eventTitle} 
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="e.g. National Bangla NLP Hackathon"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          required
                          id="field-ev-title"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">ORGANIZATION HOSTS</label>
                          <input 
                            type="text" 
                            value={eventOrganizer} 
                            onChange={(e) => setEventOrganizer(e.target.value)}
                            placeholder="BUET Computer Club"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                            required
                            id="field-ev-org"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">DATE SCHEDULE</label>
                          <input 
                            type="text" 
                            value={eventDate} 
                            onChange={(e) => setEventDate(e.target.value)}
                            placeholder="June 25, 2026"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                            required
                            id="field-ev-date"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">SLATE MODEL</label>
                          <select 
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          >
                            <option value="Hackathon">[ Hackathon ]</option>
                            <option value="Bootcamp">[ Bootcamp ]</option>
                            <option value="Workshop">[ Workshop ]</option>
                            <option value="Meetup">[ Meetup ]</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">DIVISION LINK SECTOR</label>
                          <select 
                            value={eventDivision}
                            onChange={(e) => setEventDivision(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none"
                          >
                            {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400">EVENT DESCRIPTION</label>
                        <textarea 
                          rows={3}
                          value={eventDesc} 
                          onChange={(e) => setEventDesc(e.target.value)}
                          placeholder="Outline the rules, location, and key parameters..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none resize-none"
                          required
                          id="field-ev-desc"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="w-full py-2.5 bg-orange-700 hover:bg-orange-850 text-white font-mono text-xs font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(158,88,56,0.2)] transition-all"
                        id="btn-ev-submit"
                      >
                        [ Publish Scheduled slate ]
                      </button>
                    </form>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Console footer */}
        <footer className="bg-slate-950 text-slate-500 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono mt-auto border-t border-slate-900">
          <span>ROOT LEVEL AUTHENTICATED SYSTEM OPERATING ID: admin_master</span>
          <span>TalentHub.BD v2.6 • Operational Node Integrity Checked</span>
        </footer>

      </div>

    </div>
  );
}
