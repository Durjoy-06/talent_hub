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
  Cpu
} from 'lucide-react';
import { 
  Talent, 
  Opportunity, 
  EventHub, 
  INITIAL_TALENTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_EVENTS, 
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

export default function App() {
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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('talenthub_bd_talents', JSON.stringify(talents));
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_opportunities', JSON.stringify(opportunities));
    setStats(prev => ({ ...prev, activeProjects: opportunities.length }));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('talenthub_bd_stats', JSON.stringify(stats));
  }, [stats]);

  // Handlers for interactive registry insertions
  const handleAddTalent = (newTalent: Talent) => {
    setTalents(prev => [newTalent, ...prev]);
    setStats(prev => ({ ...prev, activeStudents: prev.activeStudents + 1 }));
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleIncrementApplicants = (oppId: string) => {
    setOpportunities(prev => 
      prev.map(o => o.id === oppId ? { ...o, applicantsCount: o.applicantsCount + 1 } : o)
    );
  };

  const handleAddEvent = (newEvent: EventHub) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleRegisterAttendee = (eventId: string) => {
    setEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, attendeesCount: e.attendeesCount + 1 } : e)
    );
  };

  // UI smooth scroll helpers
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-800 font-sans tracking-tight relative selection:bg-[#9CD5FF] selection:text-[#355872]">
      
      {/* Decorative corner grids and indicators of Artistic design */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-[0.14] artistic-dashed" />
      <div className="absolute top-[800px] right-0 w-48 h-48 pointer-events-none opacity-[0.1] artistic-dashed" />
      <div className="absolute bottom-64 left-10 w-40 h-40 pointer-events-none opacity-[0.08] artistic-dashed" />

      {/* Premium Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F7F8F0]/85 backdrop-blur-md border-b-2 border-[#355872]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Mark with Bangladesh soft national dots */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-[#355872] flex items-center justify-center text-white shadow-md hover:rotate-12 transition-all duration-300">
                <Cpu className="w-5 h-5 text-[#9CD5FF]" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-[#F7F8F0]" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-[#F7F8F0]" />
              </div>
            </div>

            <div>
              <span className="font-display font-extrabold text-xl text-[#355872] tracking-tighter">
                TalentHub<span className="text-[#7AAACE] font-serif italic font-normal">.BD</span>
              </span>
              <span className="block text-[8px] font-mono text-slate-400 font-semibold tracking-widest uppercase">SYNERGETIC GRAPH_NET</span>
            </div>
          </div>

          {/* Nav pills with exquisite artistic formatting */}
          <nav className="hidden md:flex items-center gap-1">
            <button 
              id="nav-map-btn"
              onClick={() => scrollToSection('bangladesh-opportunity-network')}
              className="text-[11px] text-slate-500 hover:text-[#355872] font-mono px-3 py-2 rounded-lg hover:bg-[#355872]/5 transition-all duration-200"
            >
              [ Hub Matrix ]
            </button>
            <button 
              id="nav-talents-btn"
              onClick={() => scrollToSection('talent-spotlight')}
              className="text-[11px] text-slate-500 hover:text-[#355872] font-mono px-3 py-2 rounded-lg hover:bg-[#355872]/5 transition-all duration-200"
            >
              [ Talent Directory ]
            </button>
            <button 
              id="nav-opps-btn"
              onClick={() => scrollToSection('opportunities-matrix')}
              className="text-[11px] text-slate-500 hover:text-[#355872] font-mono px-3 py-2 rounded-lg hover:bg-[#355872]/5 transition-all duration-200"
            >
              [ Opportunity Board ]
            </button>
            <button 
              id="nav-hacks-btn"
              onClick={() => scrollToSection('events-agenda')}
              className="text-[11px] text-slate-500 hover:text-[#355872] font-mono px-3 py-2 rounded-lg hover:bg-[#355872]/5 transition-all duration-200"
            >
              [ National Events ]
            </button>
            <button 
              id="nav-comms-btn"
              onClick={() => scrollToSection('communities')}
              className="text-[11px] text-slate-500 hover:text-[#355872] font-mono px-3 py-2 rounded-lg hover:bg-[#355872]/5 transition-all duration-200"
            >
              [ Clusters ]
            </button>
          </nav>

          {/* Selected Status badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#355872]/8 text-[#355872] border border-[#355872]/15 px-3 py-1.5 rounded-3xl font-mono flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> GRID_LIVE
            </span>
          </div>
        </div>
      </header>

      {/* Hero section with Constellation Mesh Background and Artistic design grids */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b-2 border-[#355872]/10 bg-radial-gradient from-white via-[#F7F8F0] to-[#F7F8F0]/40">
        
        {/* Constellation Canvas mesh behind */}
        <ConstellationMesh />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 pointer-events-none">
          <div className="inline-flex items-center gap-2 bg-white/95 border-2 border-[#355872]/15 px-4 py-2 rounded-3xl backdrop-blur-md shadow-[3px_3px_0px_0px_rgba(53,88,114,0.1)] pointer-events-auto cursor-default">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold text-slate-500">
              Bangladesh's digital node density:
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#355872] bg-[#355872]/8 border border-[#355872]/15 px-2.5 py-0.5 rounded-full">
              427 cluster connections/sec
            </span>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Extremely dramatic font display mixing rigid sans with romantic italic serif */}
            <h1 className="font-display font-extrabold text-[#355872] leading-[1.1] tracking-tight text-3xl sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
              An Interconnected Grid for Bangladesh's <span className="font-serif italic font-normal text-slate-700 underline decoration-[#7AAACE] decoration-wavy underline-offset-8">Next-Gen</span> Talent
            </h1>
            <p className="text-slate-600 font-sans text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-light">
              A centralized, premium digital grid linking top software engineers, competitive programmers, product designers, and academic hackathons across Bangladesh's division hub networks.
            </p>
          </div>

          {/* CTAs with beautiful bespoke painterly style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pointer-events-auto">
            <button
              onClick={() => scrollToSection('talent-spotlight')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#355872] hover:bg-[#355872]/95 border-2 border-[#355872] text-[#F7F8F0] rounded-xl text-xs font-mono font-bold px-6 py-4 transition-all shadow-[4px_4px_0px_0px_rgba(122,170,206,0.4)] hover:shadow-[6px_6px_0px_0px_rgba(122,170,206,0.8)] group duration-300"
            >
              Explore Talent Directory <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('bangladesh-opportunity-network')}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-[#F7F8F0]/60 border-2 border-[#355872] text-[#355872] rounded-xl text-xs font-mono font-bold px-6 py-4 transition-all shadow-[4px_4px_0px_0px_rgba(53,88,114,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(53,88,114,0.3)] duration-300"
            >
              Browse Network Hub Map
            </button>
          </div>
        </div>
      </section>

      {/* Main content grid ecosystem */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 1. Live system indicators stats */}
        <StatsDashboard stats={stats} />

        {/* 2. Bangladesh non-traditional relationship graph map mapping */}
        <NetworkMap onSelectHub={setSelectedHub} selectedHub={selectedHub} />

        {/* 3. Immersive Spotlight selection matrix */}
        <SpotlightGallery 
          talents={talents} 
          selectedHub={selectedHub} 
          onAddTalent={handleAddTalent} 
        />

        {/* 4. Collaborative interest circles */}
        <CommunitiesClusters />

        {/* 5. Featured opportunities */}
        <OpportunitiesSection 
          opportunities={opportunities} 
          selectedHub={selectedHub}
          onAddOpportunity={handleAddOpportunity}
          onIncrementApplicants={handleIncrementApplicants}
        />

        {/* 6. Scheduled events of hacks & meetups */}
        <EventsSection 
          events={events} 
          selectedHub={selectedHub}
          onAddEvent={handleAddEvent}
          onRegisterAttendee={handleRegisterAttendee}
        />

      </main>

      {/* Dynamic final call to action block with premium feel */}
      <section className="bg-white border-t border-slate-100 py-16 text-center shadow-inner relative overflow-hidden">
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
                alert('Welcome to TalentHub BD! You are now locked in as an active Node participant.');
              }}
              className="px-6 py-3 bg-[#355872] hover:bg-[#355872]/90 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm"
            >
              Secure My Membership pass
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-mono transition-all"
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

    </div>
  );
}
