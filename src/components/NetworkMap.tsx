import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Users, Calendar, ArrowRight, Network } from 'lucide-react';
import { INITIAL_HUBS, HubNode } from '../types';

interface NetworkMapProps {
  onSelectHub: (hubName: string | null) => void;
  selectedHub: string | null;
}

export default function NetworkMap({ onSelectHub, selectedHub }: NetworkMapProps) {
  const [hoveredHub, setHoveredHub] = useState<HubNode | null>(null);
  const [activeHub, setActiveHub] = useState<HubNode>(INITIAL_HUBS[0]); // default to Dhaka

  const handleNodeClick = (hub: HubNode) => {
    setActiveHub(hub);
    // Convert e.g., 'Dhaka Hub' to 'Dhaka' for filtering in parent
    const shortName = hub.name.replace(' Hub', '');
    if (selectedHub === shortName) {
      onSelectHub(null); // toggle filter off
    } else {
      onSelectHub(shortName);
    }
  };

  return (
    <div id="bangladesh-opportunity-network" className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] relative overflow-hidden">
      {/* Decorative corner ticks for Artistic layout */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#355872]/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#355872]/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#355872]/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#355872]/30" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Network className="w-3 h-3 text-[#355872]" /> Topological Relationship Mapping
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#355872] mt-1 tracking-tight">
            Bangladesh Opportunity <span className="font-serif italic font-normal text-slate-600">Network Map</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl font-light">
            An interconnected graph visualizing regional synergy and digital talent densities across Bangladesh divisional accelerators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            id="clear-hub-filter"
            onClick={() => {
              onSelectHub(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all duration-300 border-2 ${
              selectedHub 
                ? 'bg-[#355872] text-[#F7F8F0] border-[#34536b] hover:bg-[#355872]/90 shadow-sm' 
                : 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200/55'
            }`}
          >
            {selectedHub ? `× Clear Filter (${selectedHub})` : 'All Hubs Active'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Graph representation container */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#091522] via-[#050B14] to-[#02050B] rounded-2xl border-2 border-[#355872]/20 p-6 relative min-h-[400px] md:min-h-[450px] overflow-hidden flex flex-col justify-between shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),_0_8px_16px_rgba(0,0,0,0.5)]">
          {/* Futuristic grid overlay background & soft blue ambient flare */}
          <div className="absolute inset-0 bg-radial-gradient from-[#7AAACE]/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#9CD5FF]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-[10px] font-mono text-[#7AAACE]/70">
            <span>[ SYSTEM_MAPPED: REAL_GEOGRAPHIC_GRID_BD ]</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">HIGH_FIDELITY_TOPOLOGICAL_OVERLAY</span>
          </div>

          {/* SVG Map Lines & Geographic Outline representation */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="map-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E344A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0D1F31" stopOpacity="0.75" />
                </linearGradient>
                <filter id="glow-effect" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="1.0" result="blur" />
                  <feComponentTransfer in="blur" result="glow">
                    <feFuncA type="linear" slope="0.8"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <pattern id="tech-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(122, 170, 206, 0.08)" strokeWidth="0.15" />
                  <circle cx="10" cy="10" r="0.45" fill="rgba(156, 213, 255, 0.15)" />
                </pattern>
              </defs>

              {/* Blueprint Grid and Point Accents */}
              <rect width="100" height="100" fill="url(#tech-dots)" />

              {/* Geographic Bangladesh Outline (Real Bangladesh Map Silhouette) */}
              <g className="transition-opacity duration-500">
                {/* Glow Backdrop */}
                <path
                  d="M 20 8 C 22 7.5, 23 7, 24 7 C 25.5 8, 26.5 9, 27 10 C 27 13.5, 27 16, 27 18 C 30 20.5, 32.5 22, 35 23 C 38.5 23.5, 42 24, 45 24 C 48 22.5, 50.5 21, 53 20 C 55.5 21, 58 21.5, 60 22 C 63 20.5, 65.5 19, 68 18 C 71 18, 73 18, 75 18 C 78 20, 80.5 21.5, 82 23 C 81.5 26, 81 28.5, 81 31 C 82.5 33.5, 83.5 36, 84 38 C 81 40.5, 78.5 42, 76 44 C 74.5 45.5, 73 47, 72 48 C 72.5 51, 72.8 53.5, 73 56 C 74 58.5, 75 60.5, 76 62 C 78.5 63, 80.5 64, 82 65 C 84 68, 85 70.5, 86 73 C 84.5 75.5, 83.5 78, 83 80 C 85 83, 86 86, 87 88 C 86.5 90.5, 86 92.5, 86 94 C 84.5 92.5, 83 91, 82 90 C 81 87.5, 80.5 85.5, 80 84 C 78 81.5, 76 79.5, 75 78 C 73 76.8, 71.5 75.8, 70 75 C 68 76, 66.5 76.5, 65 77 C 63 79, 61.5 80.5, 60 82 C 57.5 83, 55.5 83.5, 54 84 C 51.5 85.5, 49.5 87, 48 88 C 46 87, 44.5 86, 43 85 C 40.5 85.5, 38.5 85.8, 37 86 C 34 86.5, 32 86.8, 30 87 C 28 86.5, 27 86.2, 26 86 C 24.5 83.5, 23.5 81.5, 23 80 C 24 77, 24.5 74.5, 25 72 C 23.5 69.5, 22 67, 21 65 C 19.5 62.5, 18.5 60.5, 18 59 C 16 56.5, 15 54.5, 14 53 C 12.5 50.5, 11.5 48, 11 46 C 9.5 43.5, 8.5 42, 8 41 C 9 39, 9.5 37.5, 10 36 C 12 35, 13.5 34, 15 33 C 14 30.5, 13.5 28, 13 26 C 12.5 23.5, 12 21, 12 19 C 13.5 16.5, 14.5 14, 15 12 C 17 10.5, 18.5 9, 20 8 Z"
                  fill="url(#map-grad)"
                  stroke="#7AAACE"
                  strokeWidth="1.2"
                  filter="url(#glow-effect)"
                  strokeOpacity="0.45"
                />
                {/* Crisp Foreground Outline */}
                <path
                  d="M 20 8 C 22 7.5, 23 7, 24 7 C 25.5 8, 26.5 9, 27 10 C 27 13.5, 27 16, 27 18 C 30 20.5, 32.5 22, 35 23 C 38.5 23.5, 42 24, 45 24 C 48 22.5, 50.5 21, 53 20 C 55.5 21, 58 21.5, 60 22 C 63 20.5, 65.5 19, 68 18 C 71 18, 73 18, 75 18 C 78 20, 80.5 21.5, 82 23 C 81.5 26, 81 28.5, 81 31 C 82.5 33.5, 83.5 36, 84 38 C 81 40.5, 78.5 42, 76 44 C 74.5 45.5, 73 47, 72 48 C 72.5 51, 72.8 53.5, 73 56 C 74 58.5, 75 60.5, 76 62 C 78.5 63, 80.5 64, 82 65 C 84 68, 85 70.5, 86 73 C 84.5 75.5, 83.5 78, 83 80 C 85 83, 86 86, 87 88 C 86.5 90.5, 86 92.5, 86 94 C 84.5 92.5, 83 91, 82 90 C 81 87.5, 80.5 85.5, 80 84 C 78 81.5, 76 79.5, 75 78 C 73 76.8, 71.5 75.8, 70 75 C 68 76, 66.5 76.5, 65 77 C 63 79, 61.5 80.5, 60 82 C 57.5 83, 55.5 83.5, 54 84 C 51.5 85.5, 49.5 87, 48 88 C 46 87, 44.5 86, 43 85 C 40.5 85.5, 38.5 85.8, 37 86 C 34 86.5, 32 86.8, 30 87 C 28 86.5, 27 86.2, 26 86 C 24.5 83.5, 23.5 81.5, 23 80 C 24 77, 24.5 74.5, 25 72 C 23.5 69.5, 22 67, 21 65 C 19.5 62.5, 18.5 60.5, 18 59 C 16 56.5, 15 54.5, 14 53 C 12.5 50.5, 11.5 48, 11 46 C 9.5 43.5, 8.5 42, 8 41 C 9 39, 9.5 37.5, 10 36 C 12 35, 13.5 34, 15 33 C 14 30.5, 13.5 28, 13 26 C 12.5 23.5, 12 21, 12 19 C 13.5 16.5, 14.5 14, 15 12 C 17 10.5, 18.5 9, 20 8 Z"
                  fill="none"
                  stroke="#9CD5FF"
                  strokeWidth="0.45"
                  strokeOpacity="0.8"
                />
              </g>

              {/* Draw connected topological lines */}
              {INITIAL_HUBS.map((hub) => {
                return hub.connections.map((connId) => {
                  const targetHub = INITIAL_HUBS.find(h => h.id === connId);
                  if (!targetHub) return null;
                  
                  const isActiveConnection = 
                    activeHub.id === hub.id || 
                    activeHub.id === targetHub.id ||
                    (hoveredHub && (hoveredHub.id === hub.id || hoveredHub.id === targetHub.id));

                  return (
                    <line
                      key={`${hub.id}-${targetHub.id}`}
                      x1={hub.x}
                      y1={hub.y}
                      x2={targetHub.x}
                      y2={targetHub.y}
                      stroke={isActiveConnection ? '#9CD5FF' : 'rgba(122, 170, 206, 0.16)'}
                      strokeWidth={isActiveConnection ? '1.2' : '0.45'}
                      strokeDasharray={isActiveConnection ? '3 1.5' : 'none'}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </svg>
          </div>

          {/* Floating Interactive Nodes */}
          <div className="absolute inset-0" id="topological-nodes-container">
            {INITIAL_HUBS.map((hub) => {
              const isSelected = selectedHub === hub.name.replace(' Hub', '');
              const isActive = activeHub.id === hub.id;
              const isHovered = hoveredHub?.id === hub.id;

              return (
                <div
                  key={hub.id}
                  style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  {/* Click trigger area */}
                  <div
                    onClick={() => handleNodeClick(hub)}
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                    className="relative cursor-pointer p-4"
                  >
                    {/* Glowing active rings */}
                    {(isActive || isHovered || isSelected) && (
                      <motion.div
                        layoutId="nodeGlow"
                        className="absolute inset-0 rounded-full bg-[#9CD5FF]/25"
                        style={{ filter: 'blur(4px)' }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1.35, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                      />
                    )}

                    {/* Node Core */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      className={`w-5 h-5 rounded-none flex items-center justify-center border-2 transition-all duration-300 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                        isSelected
                          ? 'bg-[#355872] border-[#FECE2F] scale-110 shadow-[0_0_12px_rgba(254,206,47,0.5)]'
                          : isActive
                            ? 'bg-[#355872] border-[#7AAACE]'
                            : 'bg-[#080E14] border-[#355872]/60 hover:border-[#9CD5FF]'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-none ${
                        isSelected 
                          ? 'bg-[#D0674B] pulsing-dot' 
                          : isActive 
                            ? 'bg-emerald-400 animate-pulse' 
                            : 'bg-[#7AAACE] group-hover:bg-[#9CD5FF]'
                      }`} />
                    </motion.div>

                    {/* Node Tooltip Label (Sharp ghost terminal style) */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap overflow-visible z-30 pointer-events-none">
                      <div className={`px-2.5 py-1 rounded-none text-[9px] font-bold font-mono border transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#FECE2F] text-slate-950 border-[#FECE2F] shadow-[0_0_8px_rgba(254,206,47,0.4)]'
                          : isActive
                            ? 'bg-white text-slate-950 border-white shadow-md'
                            : 'bg-[#050b14]/90 text-[#7AAACE] border-[#355872]/45 opacity-80 group-hover:opacity-100 group-hover:border-[#9CD5FF] group-hover:text-white'
                      }`}>
                        {hub.name.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 relative z-10 flex items-center justify-between text-xs font-mono text-[#7AAACE]/75">
            <span>[ TARGET NODE SELECTION CONTROLS ]</span>
            <span>SCALE: 1:1.15M REAL_LATITUDE</span>
          </div>
        </div>

        {/* Info panel side bar */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-slate-100 rounded-2xl p-6 bg-[#F8FAFC]/50">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#355872]/10 flex items-center justify-center text-[#355872]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400">Active Division Accelerator</span>
                <h3 className="font-display text-xl font-semibold text-[#355872]">{activeHub.name}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed min-h-[70px]">
              {activeHub.description}
            </p>

            {/* Hub Metrics */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
                  <Users className="w-3.5 h-3.5 text-[#355872]" />
                  <span>STUDENT NODES</span>
                </div>
                <div className="text-2xl font-mono font-bold text-[#355872]">
                  {activeHub.studentCount}
                  <span className="text-xs font-sans font-normal text-slate-400 ml-1">users</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#7AAACE]" />
                  <span>ANNUAL EVENTS</span>
                </div>
                <div className="text-2xl font-mono font-bold text-[#1E293B]">
                  {activeHub.eventCount}
                  <span className="text-xs font-sans font-normal text-slate-400 ml-1">major</span>
                </div>
              </div>
            </div>

            {/* Interest Clusters */}
            <div className="mb-4">
              <span className="text-xs font-mono text-slate-400 block mb-2">CONNECTED INTEREST CLUSTERS</span>
              <div className="flex flex-wrap gap-1.5">
                {activeHub.id === 'dhaka' && ['NLP Hub', 'BUET DeepTech', 'Venture capital', 'Design Circles', 'Agritech-Alpha'].map((cat) => (
                  <span key={cat} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-600 font-mono">
                    #{cat}
                  </span>
                ))}
                {activeHub.id === 'chattogram' && ['Embedded IoT', 'Maritime systems', 'HardwareLabs', 'Port Logistics'].map((cat) => (
                  <span key={cat} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-600 font-mono">
                    #{cat}
                  </span>
                ))}
                {activeHub.id === 'sylhet' && ['Global SaaS Devs', 'Remote Labs', 'SUST Algorists', 'Freelance Council'].map((cat) => (
                  <span key={cat} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-600 font-mono">
                    #{cat}
                  </span>
                ))}
                {!['dhaka', 'chattogram', 'sylhet'].includes(activeHub.id) && ['AgriTech', 'Climate Analytics', 'Student Hackers', 'OpenSource BD'].map((cat) => (
                  <span key={cat} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-600 font-mono">
                    #{cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => handleNodeClick(activeHub)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#355872] hover:bg-[#355872]/90 text-white rounded-xl text-sm font-medium transition-all group"
            >
              <span className="flex items-center gap-1.5">
                {selectedHub === activeHub.name.replace(' Hub', '') ? 'Showing Filtered Directory' : `Filter Network by ${activeHub.name.replace(' Hub', '')}`}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
