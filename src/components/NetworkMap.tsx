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
        <div className="lg:col-span-7 bg-[#F7F8F0]/30 rounded-2xl border-2 border-[#355872]/10 p-6 relative min-h-[400px] md:min-h-[450px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#F7F8F0]/30 pointer-events-none" />
          
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
            <span>[ COORDINATES: BD_TRANSVERSE_GRAPH_V2 ]</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">PROXIMITY RADIAL CONNECTIONS</span>
          </div>

          {/* SVG Map Lines representation */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#355872" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7AAACE" stopOpacity="0.1" />
                </linearGradient>
                <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#9CD5FF" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Draw connected lines */}
              {INITIAL_HUBS.map((hub) => {
                return hub.connections.map((connId) => {
                  const targetHub = INITIAL_HUBS.find(h => h.id === connId);
                  if (!targetHub) return null;
                  
                  // Active highlight if either node is active/hovered
                  const isActiveConnection = 
                    activeHub.id === hub.id || 
                    activeHub.id === targetHub.id ||
                    (hoveredHub && (hoveredHub.id === hub.id || hoveredHub.id === targetHub.id));

                  return (
                    <line
                      key={`${hub.id}-${targetHub.id}`}
                      x1={`${hub.x}%`}
                      y1={`${hub.y}%`}
                      x2={`${targetHub.x}%`}
                      y2={`${targetHub.y}%`}
                      stroke={isActiveConnection ? '#7AAACE' : 'rgba(53, 88, 114, 0.12)'}
                      strokeWidth={isActiveConnection ? '1.8' : '0.8'}
                      strokeDasharray={isActiveConnection ? '4 2' : 'none'}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </svg>
          </div>

          {/* Floating Nodes */}
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
                    {/* Ring glow */}
                    {(isActive || isHovered || isSelected) && (
                      <motion.div
                        layoutId="nodeGlow"
                        className="absolute inset-0 rounded-full bg-[#9CD5FF]/20"
                        style={{ filter: 'blur(3px)' }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      />
                    )}

                    {/* Node Core */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                        isSelected
                          ? 'bg-[#355872] border-[#9CD5FF] scale-110'
                          : isActive
                            ? 'bg-[#355872] border-[#7AAACE]'
                            : 'bg-white border-slate-300 hover:border-[#355872]'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isSelected 
                          ? 'bg-[#9CD5FF] pulsing-dot' 
                          : isActive 
                            ? 'bg-[#7AAACE]' 
                            : 'bg-slate-400 group-hover:bg-[#355872]'
                      }`} />
                    </motion.div>

                    {/* Node Tooltip Label */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap overflow-visible z-30">
                      <div className={`px-2 py-1 rounded-md text-[10px] font-medium font-mono border transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#355872] text-white border-[#355872]'
                          : isActive
                            ? 'bg-[#1E293B] text-white border-slate-700 shadow-lg'
                            : 'bg-white text-slate-600 border-slate-100 shadow-sm opacity-80 group-hover:opacity-100 group-hover:border-slate-300'
                      }`}>
                        {hub.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 relative z-10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>[ Click nodes to filter directory ]</span>
            <span>GRIDSCALE: 1:1.20M BD</span>
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
