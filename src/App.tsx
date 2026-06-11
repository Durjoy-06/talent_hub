import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Network, 
  Layers, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Plus, 
  Flame, 
  ChevronRight, 
  Globe, 
  Cpu,
  Bookmark,
  UserCheck
} from 'lucide-react';
import { 
  Talent, 
  Opportunity, 
  EventHub, 
  LoggedInUser,
  Application,
  INITIAL_TALENTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_EVENTS, 
  INITIAL_APPLICATIONS,
  GENERAL_STATS 
} from './types';

// Importing Custom Handcrafted Components
import ConstellationMesh from './components/ConstellationMesh';
import NetworkMap from './components/NetworkMap';
import SpotlightGallery from './components/SpotlightGallery';
import OpportunitiesSection from './components/OpportunitiesSection';
import CommunitiesClusters from './components/CommunitiesClusters';
import EventsSection from './components/EventsSection';
import StatsDashboard from './components/StatsDashboard';

// Dashboard Egress Portals
import PortalGateway from './components/PortalGateway';
import StudentDashboard from './components/StudentDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';

// @ts-ignore
import huntclubBgTeam from './assets/images/huntclub_bg_team_v2_1781179955964.jpg';

export default function App() {
  // Navigation Routing State
  const [view, setView] = useState<'landing' | 'auth' | 'student-dashboard' | 'organizer-dashboard'>(() => {
    const savedUser = localStorage.getItem('talenthub_bd_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser) as LoggedInUser;
      return parsed.role === 'student' ? 'student-dashboard' : 'organizer-dashboard';
    }
    return 'landing';
  });

  // Active User session state
  const [user, setUser] = useState<LoggedInUser | null>(() => {
    const savedUser = localStorage.getItem('talenthub_bd_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Synchronized applications list
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Saved / Registered indices
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_saved_opp_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_applied_opp_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_reg_event_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Hub filter state (synchronized across map, listings, and events)
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

  // High-fidelity local states with LocalStorage persistence fallback
  const [talents, setTalents] = useState<Talent[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_talents');
    return saved ? JSON.parse(saved) : INITIAL_TALENTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [events, setEvents] = useState<EventHub[]>(() => {
    const saved = localStorage.getItem('talenthub_bd_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('talenthub_bd_stats');
    if (saved) return JSON.parse(saved);
    return {
      activeStudents: GENERAL_STATS.activeStudents,
      activeProjects: INITIAL_OPPORTUNITIES.length,
      connectedHubs: GENERAL_STATS.connectedHubs,
      placedTalents: GENERAL_STATS.placedTalents
    };
  });

  // Synchronizers to localStorage
  useEffect(() => {
    localStorage.setItem('talenthub_bd_user', user ? JSON.stringify(user) : '');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_saved_opp_ids', JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_applied_opp_ids', JSON.stringify(appliedOpportunityIds));
  }, [appliedOpportunityIds]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_reg_event_ids', JSON.stringify(registeredEventIds));
  }, [registeredEventIds]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_talents', JSON.stringify(talents));
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_opportunities', JSON.stringify(opportunities));
    setStats((prev: any) => ({ ...prev, activeProjects: opportunities.length }));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_stats', JSON.stringify(stats));
  }, [stats]);


  // Session Handlers
  const handleLoginSuccess = (loggedInUser: LoggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'student') {
      setView('student-dashboard');
    } else {
      setView('organizer-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    localStorage.removeItem('talenthub_bd_user');
  };


  // Student Actions Integrations
  const handleApplyOpportunity = (oppId: string) => {
    if (!user) {
      setView('auth');
      return;
    }

    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return;

    // Check if duplicate submission
    if (appliedOpportunityIds.includes(oppId)) return;

    // 1. Create a true application log
    const newApp: Application = {
      id: 'app_dyn_' + Date.now().toString().slice(-4),
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      studentUniversity: user.university || 'BUET',
      studentDivision: user.division || 'Dhaka',
      opportunityId: oppId,
      opportunityTitle: opp.title,
      organization: opp.organization,
      status: 'Under Review',
      dateApplied: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setApplications(prev => [newApp, ...prev]);
    setAppliedOpportunityIds(prev => [...prev, oppId]);

    // 2. Increment applicant rate on listed opportunities
    setOpportunities(prev => 
      prev.map(o => o.id === oppId ? { ...o, applicantsCount: o.applicantsCount + 1 } : o)
    );
  };

  const handleSaveOpportunity = (oppId: string) => {
    if (!user) {
      setView('auth');
      return;
    }

    setSavedOpportunityIds(prev => 
      prev.includes(oppId) ? prev.filter(id => id !== oppId) : [...prev, oppId]
    );
  };

  const handleRegisterEvent = (eventId: string) => {
    if (!user) {
      setView('auth');
      return;
    }

    if (registeredEventIds.includes(eventId)) {
      alert('You have already reserved a seat for this event timeline.');
      return;
    }

    // Lock in event id
    setRegisteredEventIds(prev => [...prev, eventId]);

    // Increment global database counts
    setEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, attendeesCount: e.attendeesCount + 1 } : e)
    );

    alert('REGISTRATION SECURED: Your booking token is generated. View your chronological timeline schedule on the workspace dashboard.');
  };


  // Organizer Action Integrations
  const handleChangeApplicationStatus = (appId: string, newStatus: Application['status']) => {
    setApplications(prev => 
      prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
    );
  };

  const handleAddTalent = (newTalent: Talent) => {
    setTalents(prev => [newTalent, ...prev]);
    setStats((prev: any) => ({ ...prev, activeStudents: prev.activeStudents + 1 }));
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== oppId));
    setApplications(prev => prev.filter(a => a.opportunityId !== oppId));
    setSavedOpportunityIds(prev => prev.filter(id => id !== oppId));
    setAppliedOpportunityIds(prev => prev.filter(id => id !== oppId));
  };

  const handleAddEvent = (newEvent: EventHub) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
  };


  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-800 font-sans tracking-tight relative selection:bg-[#9CD5FF] selection:text-[#355872]">
      
      <AnimatePresence mode="wait">
        
        {/* Landing Page Route View */}
        {view === 'landing' && (
          <motion.div 
            key="landing_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative background grids */}
            <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-[0.14] artistic-dashed" />
            <div className="absolute top-[800px] right-0 w-48 h-48 pointer-events-none opacity-[0.1] artistic-dashed" />
            <div className="absolute bottom-64 left-10 w-40 h-40 pointer-events-none opacity-[0.08] artistic-dashed" />

            {/* Header Navigation - Reverted to Authentic Slate Off-White Header */}
            <header className="sticky top-0 z-40 bg-[#F7F8F0]/85 backdrop-blur-md border-b-2 border-[#355872]/15">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative group cursor-pointer" onClick={() => scrollToSection('landing')}>
                    <div className="w-10 h-10 rounded-none bg-[#355872] border border-[#355872]/20 flex items-center justify-center text-white shadow-md hover:rotate-12 transition-all duration-300">
                      <Cpu className="w-5 h-5 text-[#9CD5FF] group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                      <div className="w-2.5 h-2.5 rounded-none bg-emerald-600 border border-[#F7F8F0]" />
                      <div className="w-2.5 h-2.5 rounded-none bg-red-500 border border-[#F7F8F0]" />
                    </div>
                  </div>

                  <div className="cursor-pointer select-none" onClick={() => scrollToSection('landing')}>
                    <span className="font-display font-extrabold text-xl text-[#355872] tracking-tighter">
                      TalentHub<span className="text-[#7AAACE] font-serif italic font-normal">.BD</span>
                    </span>
                    <span className="block text-[8px] font-mono text-slate-500 font-semibold tracking-widest uppercase">SYNERGETIC GRID_NET</span>
                  </div>
                </div>

                {/* Navigation pills - Styled as sharp-cornered ghost modules */}
                <nav className="hidden md:flex items-center gap-2">
                  <button 
                    onClick={() => scrollToSection('bangladesh-opportunity-network')}
                    className="flex items-center gap-2 group text-[11px] text-[#355872] font-mono px-3.5 py-2.5 rounded-none border border-[#355872]/15 hover:border-[#355872] bg-transparent hover:bg-[#355872]/5 transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
                  >
                    <span className="w-1.5 h-1.5 bg-[#7AAACE] group-hover:scale-125 transition-transform" />
                    <span>Hub Grid</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('talent-spotlight')}
                    className="flex items-center gap-2 group text-[11px] text-[#355872] font-mono px-3.5 py-2.5 rounded-none border border-[#355872]/15 hover:border-[#355872] bg-transparent hover:bg-[#355872]/5 transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
                  >
                    <span className="w-1.5 h-1.5 bg-[#9CD5FF] animate-pulse" />
                    <span>Talent Directory</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('opportunities-matrix')}
                    className="flex items-center gap-2 group text-[11px] text-[#355872] font-mono px-3.5 py-2.5 rounded-none border border-[#355872]/15 hover:border-[#355872] bg-transparent hover:bg-[#355872]/5 transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-400" />
                    <span>Opportunity Board</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('events-agenda')}
                    className="flex items-center gap-2 group text-[11px] text-[#355872] font-mono px-3.5 py-2.5 rounded-none border border-[#355872]/15 hover:border-[#355872] bg-transparent hover:bg-[#355872]/5 transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-500 animate-pulse" />
                    <span>National Events</span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('communities')}
                    className="flex items-center gap-2 group text-[11px] text-[#355872] font-mono px-3.5 py-2.5 rounded-none border border-[#355872]/15 hover:border-[#355872] bg-transparent hover:bg-[#355872]/5 transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-600" />
                    <span>Clusters</span>
                  </button>
                </nav>

                {/* Entry Workspace Control Badge */}
                <div className="flex items-center gap-2">
                  {user ? (
                    <button
                      onClick={() => setView(user.role === 'student' ? 'student-dashboard' : 'organizer-dashboard')}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-none text-xs font-mono font-bold text-[#F7F8F0] bg-[#355872] border-2 border-[#34536b] shadow-[3px_3px_0px_0px_rgba(53,88,114,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
                      id="launch-workspace-btn"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#9CD5FF]" /> [ Open My Workspace ]
                    </button>
                  ) : (
                    <button
                      onClick={() => setView('auth')}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-none text-xs font-mono font-bold text-[#F7F8F0] bg-[#355872] border-2 border-[#34536b] shadow-[3px_3px_0px_0px_rgba(53,88,114,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
                      id="launch-portal-btn"
                    >
                      [ Portal Gateway ]
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Hero Section - HuntClub Dark-Mode Cinematic Style */}
            <section className="relative overflow-hidden pt-20 lg:pt-28 pb-24 lg:pb-28 bg-[#090D11] border-b-2 border-slate-950">
              {/* Full-bleed background team overlay with dark gradient sweeps */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <img 
                  src={huntclubBgTeam} 
                  alt="Bangladesh Synergetic Graph Professional Team" 
                  className="absolute right-0 top-0 h-full w-full lg:w-[65%] object-cover object-right opacity-30 md:opacity-50 lg:opacity-75 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                {/* Complex gradient fades to mask the image perfectly into the dark background on the left and bottom */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#090D11] via-[#090D11]/90 md:via-[#090D11]/60 lg:via-[#090D11]/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D11] via-transparent to-transparent opacity-90" />
                {/* Subtle top light vignette */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-950/20 to-transparent pointer-events-none" />
              </div>

              <ConstellationMesh />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                  
                  {/* Left Column: High-Contrast typography overlays over background */}
                  <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-left">
                    <div className="inline-flex items-center gap-2 bg-slate-900/95 border border-slate-800 px-4 py-2 rounded-3xl backdrop-blur-md shadow-lg pointer-events-auto cursor-default">
                      <Flame className="w-4 h-4 text-[#9CD5FF] animate-pulse" />
                      <span className="text-[10px] sm:text-xs font-mono font-semibold text-slate-300">
                        Bangladesh's digital node density:
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-[#9CD5FF] bg-[#355872]/20 border border-[#7AAACE]/30 px-2.5 py-0.5 rounded-full">
                        427 cluster connections/sec
                      </span>
                    </div>

                    <div className="space-y-5">
                      <h1 className="font-display font-extrabold text-white leading-[1.1] tracking-tight text-3xl sm:text-5xl lg:text-5xl">
                        There's a builder in Bangladesh <span className="text-[#9CD5FF] font-serif italic font-normal bg-clip-text text-transparent bg-gradient-to-r from-[#9CD5FF] via-[#7AAACE] to-sky-400 block mt-2">you should connect with.</span>
                      </h1>
                      <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed font-light max-w-xl">
                        A centralized, premium digital grid linking top software engineers, competitive programmers, product designers, and academic hackathons across Bangladesh's division hub networks.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 pointer-events-auto">
                      <button
                        onClick={() => scrollToSection('talent-spotlight')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#7AAACE] hover:bg-[#9CD5FF] border-2 border-[#7AAACE] text-slate-950 rounded-none text-xs font-mono font-bold px-6 py-4 transition-all shadow-[4px_4px_0px_0px_rgba(122,170,206,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(122,170,206,0.5)] active:translate-x-0.5 active:translate-y-0.5 duration-300 group"
                      >
                        Explore Talent Directory <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-950" />
                      </button>
                      <button
                        onClick={() => {
                          if (user) {
                            setView(user.role === 'student' ? 'student-dashboard' : 'organizer-dashboard');
                          } else {
                            setView('auth');
                          }
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-transparent hover:bg-slate-800/40 border-2 border-[#355872] hover:border-[#7AAACE] text-[#9CD5FF] hover:text-white rounded-none text-xs font-mono font-bold px-6 py-4 active:scale-95 transition-all duration-300"
                      >
                        {user ? 'Open My Dashboard Console' : 'Launch Gateway Pass'}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Left empty to let the background graphic layout blend beautifully */}
                  <div className="hidden lg:block lg:col-span-5" />

                </div>
              </div>

              {/* Infinite Horizontal Continuous Scroll Marquee Bar */}
              <div className="mt-20 border-t border-slate-800/40 pt-8 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-[9px] tracking-[0.2em] font-mono text-slate-500 font-bold mb-6 text-center lg:text-left">
                    // BROADCASTING ACROSS UNIVERSITY GRID CHANNELS & DIVISION NODES //
                  </p>
                </div>

                <div className="w-full overflow-hidden relative select-none py-2 bg-[#355872]/5 border-y border-slate-800/40">
                  {/* Fade-out left and right bounds */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#090D11] to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#090D11] to-transparent z-10 pointer-events-none" />

                  <div className="flex animate-marquee whitespace-nowrap gap-x-12">
                    {/* First stream copy */}
                    <div className="flex items-center gap-x-12 shrink-0">
                      {[
                        { main: "BUET_CORES", sub: "DHAKA DISTRICT" },
                        { main: "DU_CLUSTERS", sub: "ROOT NODE_01" },
                        { main: "SUST_GRID", sub: "SYLHET GRAPH_PORT" },
                        { main: "IUT_SPECTRUM", sub: "ENGINEERING_GATE" },
                        { main: "RUET_NODE", sub: "WEST RAJSHAHI" },
                        { main: "MIST_COMPS", sub: "MILITARY SECTOR" },
                        { main: "CHT_HUBS", sub: "PORT_NODE 04" }
                      ].map((chan, idx) => (
                        <div key={`c1-${idx}`} className="flex flex-col items-start min-w-[150px]">
                          <span className="font-mono text-[11px] font-black text-[#9CD5FF] tracking-wider hover:text-white transition-colors">{chan.main}</span>
                          <span className="text-[7px] font-mono text-slate-400 uppercase mt-0.5">{chan.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Second stream copy for seamless tiling */}
                    <div className="flex items-center gap-x-12 shrink-0" aria-hidden="true">
                      {[
                        { main: "BUET_CORES", sub: "DHAKA DISTRICT" },
                        { main: "DU_CLUSTERS", sub: "ROOT NODE_01" },
                        { main: "SUST_GRID", sub: "SYLHET GRAPH_PORT" },
                        { main: "IUT_SPECTRUM", sub: "ENGINEERING_GATE" },
                        { main: "RUET_NODE", sub: "WEST RAJSHAHI" },
                        { main: "MIST_COMPS", sub: "MILITARY SECTOR" },
                        { main: "CHT_HUBS", sub: "PORT_NODE 04" }
                      ].map((chan, idx) => (
                        <div key={`c2-${idx}`} className="flex flex-col items-start min-w-[150px]">
                          <span className="font-mono text-[11px] font-black text-[#9CD5FF] tracking-wider hover:text-white transition-colors">{chan.main}</span>
                          <span className="text-[7px] font-mono text-slate-400 uppercase mt-0.5">{chan.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Modules Grid List */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <StatsDashboard stats={stats} />
              
              <NetworkMap onSelectHub={setSelectedHub} selectedHub={selectedHub} />
              
              <SpotlightGallery 
                talents={talents} 
                selectedHub={selectedHub} 
                onAddTalent={handleAddTalent} 
                currentUser={user}
                onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
              />
              
              <CommunitiesClusters />
              
              <OpportunitiesSection 
                opportunities={opportunities} 
                selectedHub={selectedHub}
                onAddOpportunity={handleAddOpportunity}
                onIncrementApplicants={handleApplyOpportunity}
              />
              
              <EventsSection 
                events={events} 
                selectedHub={selectedHub}
                onAddEvent={handleAddEvent}
                onRegisterAttendee={handleRegisterEvent}
              />
            </main>

             {/* Call to action section */}
            <section className="bg-[#355872]/5 border-t border-[#355872]/15 py-16 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#F7F8F0]/30 pointer-events-none" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                <span className="text-[10px] font-mono tracking-widest text-[#7AAACE] uppercase font-bold">
                  [ SECURE ECOSYSTEM INGRESS ]
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#355872] max-w-xl mx-auto">
                  Ready to integrate with Bangladesh's flagship talent graph?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                  Join thousands of academic computer societies, innovative startup enterprises, and student builders crafting software models today.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <button
                    onClick={() => {
                      if (user) {
                        setView(user.role === 'student' ? 'student-dashboard' : 'organizer-dashboard');
                      } else {
                        setView('auth');
                      }
                    }}
                    className="px-6 py-3 bg-[#355872] hover:bg-[#355872]/90 text-white rounded-none text-xs font-mono font-bold transition-all shadow-sm"
                  >
                    {user ? 'Enter My Active Dashboard' : 'Secure My Membership Pass'}
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-[#355872] border border-[#355872]/20 rounded-none text-xs font-mono transition-all"
                  >
                    Return to Top 
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-10 font-mono text-[11px] border-t border-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#9CD5FF]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-slate-200">TalentHub BD</span>
                    <p className="text-[9px] text-slate-500 font-mono">BANGLADESH OPP_SECURE NETWORK GRAPH v2.6</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-y-1 gap-x-6 text-slate-500">
                  <span>[ SYSTEM: OPERATIONAL ]</span>
                  <span>[ ENCRYPTION: SECURE ]</span>
                  <span>[ DOMAIN: ACCELERATED ]</span>
                </div>

                <div className="text-slate-500">
                  TalentHub BD © 2026. Made for Bangladesh's growing engineering landscape.
                </div>
              </div>
            </footer>
          </motion.div>
        )}

        {/* Portal Authentication Gateway View */}
        {view === 'auth' && (
          <motion.div 
            key="auth_view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <PortalGateway 
              onLoginSuccess={handleLoginSuccess}
              onBackToLanding={() => setView('landing')}
            />
          </motion.div>
        )}

        {/* Student Workspace Portal */}
        {view === 'student-dashboard' && user && (
          <motion.div 
            key="student_dashboard_view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
          >
            <StudentDashboard
              user={user}
              onLogout={handleLogout}
              opportunities={opportunities}
              events={events}
              applications={applications}
              savedOpportunityIds={savedOpportunityIds}
              appliedOpportunityIds={appliedOpportunityIds}
              registeredEventIds={registeredEventIds}
              onApplyOpportunity={handleApplyOpportunity}
              onSaveOpportunity={handleSaveOpportunity}
              onRegisterEvent={handleRegisterEvent}
            />
          </motion.div>
        )}

        {/* Organizer Command Center Portal */}
        {view === 'organizer-dashboard' && user && (
          <motion.div 
            key="organizer_dashboard_view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
          >
            <OrganizerDashboard
              user={user}
              onLogout={handleLogout}
              opportunities={opportunities}
              events={events}
              applications={applications}
              onChangeApplicationStatus={handleChangeApplicationStatus}
              onAddOpportunity={handleAddOpportunity}
              onAddEvent={handleAddEvent}
              onDeleteOpportunity={handleDeleteOpportunity}
              onDeleteEvent={handleDeleteEvent}
            />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
