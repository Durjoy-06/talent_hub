import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Users, MessageSquare, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface Cluster {
  id: string;
  name: string;
  count: number;
  focus: string;
  tags: string[];
  color: string;
  scale: number;
  location: string;
}

const FALLBACK_CLUSTERS: Cluster[] = [
  { id: 'c1', name: 'BUET Computer Club', count: 420, focus: 'dhaka engineering portal', tags: ['CS', 'DHAKA'], color: 'rgba(53, 88, 114, 0.95)', scale: 1.1, location: 'Dhaka' },
  { id: 'c2', name: 'DU IT Society', count: 350, focus: 'Information technology research', tags: ['IT', 'DHAKA'], color: 'rgba(122, 170, 206, 0.95)', scale: 1.2, location: 'Dhaka' },
  { id: 'c3', name: 'BanglaTech Institute', count: 280, focus: 'Community of builders, researchers, and student innovators', tags: ['AI', 'Web', 'Community'], color: 'rgba(76, 142, 186, 0.95)', scale: 1.0, location: 'Dhaka' },
  { id: 'c4', name: 'Chittagong Startup Circle', count: 190, focus: 'Early-stage founders and startup mentorship', tags: ['Startups', 'Business', 'Innovation'], color: 'rgba(97, 164, 115, 0.95)', scale: 0.95, location: 'Chittagong' },
  { id: 'c5', name: 'Sylhet Dev Collective', count: 165, focus: 'Open-source projects and software collaboration', tags: ['Open Source', 'DevOps', 'Cloud'], color: 'rgba(176, 101, 182, 0.95)', scale: 0.98, location: 'Sylhet' }
];

export default function CommunitiesClusters() {
  const [clusters, setClusters] = useState<Cluster[]>(FALLBACK_CLUSTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeClusterId, setActiveClusterId] = useState<string>(FALLBACK_CLUSTERS[0].id);
  const [joinedClusterIds, setJoinedClusterIds] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.organizations) {
          const orgs = data.organizations.filter((o: any) => !o.deactivated).map((o: any) => ({
            id: o.id,
            name: o.org_name,
            count: Math.floor(Math.random() * 500) + 50, // Mock count based on ID or random for variety
            focus: o.bio || 'Verified Student Organization Node',
            tags: ['Community', o.location || 'Bangladesh', 'TalentHub'],
            color: o.id.includes('org_') ? 'rgba(53, 88, 114, 0.95)' : 'rgba(122, 170, 206, 0.95)',
            scale: 1 + (Math.random() * 0.3),
            location: o.location || 'Dhaka'
          }));

          if (orgs.length > 0) {
            const mergedClusters = [
              ...FALLBACK_CLUSTERS,
              ...orgs.filter(org => !FALLBACK_CLUSTERS.some(cluster => cluster.name === org.name))
            ];
            setClusters(mergedClusters);
            setActiveClusterId(mergedClusters[0].id);
            return;
          }
        }
        // Empty response or unsuccessful shape -> use defaults
        setClusters(FALLBACK_CLUSTERS);
        setActiveClusterId(FALLBACK_CLUSTERS[0].id);
      })
      .catch(err => {
        console.warn("Error fetching clusters, using fallback:", err);
        setClusters(FALLBACK_CLUSTERS);
        setActiveClusterId(FALLBACK_CLUSTERS[0].id);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleJoinCircle = (id: string) => {
    if (joinedClusterIds[id]) return; // already joined

    setClusters(prev =>
      prev.map(c => c.id === id ? { ...c, count: c.count + 1 } : c)
    );

    setJoinedClusterIds(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const selectedCluster = clusters.find(c => c.id === activeClusterId) || clusters[0];

  if (!isLoading && !selectedCluster) {
    return null;
  }

  return (
    <div id="communities" className="my-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#355872]" /> Collaborative Interest Hubs
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#355872] tracking-tight mt-1">
            Interconnected <span className="font-serif italic font-normal text-slate-700">Communities</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-light">
            Hover over interest clusters to reveal deep organizational contexts, membership numbers, and technical stack parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border-2 border-[#355872]/15 rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.1)] relative overflow-hidden">
        {/* Decorative corner ticks for Artistic layout */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#355872]/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#355872]/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#355872]/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#355872]/30" />
        
        {/* Left Interactive Node Area */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[320px] bg-[#F7F8F0]/30 rounded-2xl p-6 relative overflow-hidden border border-[#355872]/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <div className="absolute top-4 left-4 z-10 flex gap-2 text-[10px] uppercase font-mono text-slate-400">
            <span>[ CLUSTER CONSTELLATION ]</span>
          </div>

          {/* Connected Lines Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="30%" y1="25%" x2="70%" y2="25%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
            <line x1="70%" y1="25%" x2="80%" y2="65%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
            <line x1="80%" y1="65%" x2="45%" y2="80%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
            <line x1="45%" y1="80%" x2="20%" y2="55%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
            <line x1="20%" y1="55%" x2="30%" y2="25%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
            <line x1="70%" y1="25%" x2="45%" y2="80%" stroke="rgba(53, 88, 114, 0.15)" strokeWidth="1" />
          </svg>

          {/* Clusters visual positioning */}
          <div className="flex flex-wrap justify-center items-center gap-6 relative z-10 py-6">
            {clusters.map((cluster) => {
              const isActive = activeClusterId === cluster.id;
              const hasJoined = joinedClusterIds[cluster.id];

              return (
                <motion.div
                  key={cluster.id}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                  onClick={() => setActiveClusterId(cluster.id)}
                  className={`p-1.5 rounded-full cursor-pointer transition-all duration-300 relative ${
                    isActive ? 'ring-4 ring-[#9CD5FF]' : 'hover:ring-2 hover:ring-slate-300'
                  }`}
                  style={{
                    scale: cluster.scale,
                  }}
                >
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-center p-3 text-white shadow-md relative overflow-hidden"
                    style={{ backgroundColor: cluster.color }}
                  >
                    {/* Background faint pulse */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/10 text-[8px] font-mono py-0.5 whitespace-nowrap">
                      {cluster.location}
                    </div>

                    <span className="text-[10px] font-display font-medium tracking-tight leading-dense mb-1">
                      {cluster.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-white/80">
                      {cluster.count} members
                    </span>
                  </div>

                  {/* Joined Indicator dot */}
                  {hasJoined && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 text-[10px] font-mono text-slate-400">
            [ SELECT ANY CLUSTER BUBBLE TO DEEP DIVE ]
          </div>
        </div>

        {/* Right Info Section */}
        <div className="lg:col-span-6 flex flex-col justify-between min-h-[320px] p-2 md:p-4">
          <div className="space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Network className="w-4 h-4 text-[#7AAACE]" /> ACTIVE ECOSYSTEM CIRCLE
            </span>

            <h3 className="font-display font-bold text-2xl text-[#355872]">
              {selectedCluster.name}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedCluster.focus}
            </p>

            <div className="bg-[#F8FAFC]/55 border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">COMMUNITY LOCATION:</span>
                <span className="text-slate-700 font-semibold uppercase">{selectedCluster.location} Hub</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">MEMBER COUNT:</span>
                <span className="text-slate-700 font-semibold">{selectedCluster.count} Students & Engineers</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">PROJECT OUTCOMES:</span>
                <span className="text-slate-700 font-semibold">12 public publications</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-slate-400 block mb-2">TARGET SKILL MATRIX</span>
              <div className="flex flex-wrap gap-1.5 focus:outline-none">
                {selectedCluster.tags.map((tg) => (
                  <span
                    key={tg}
                    className="text-xs font-mono px-3 py-1 rounded-xl bg-[#F7F8F0] border border-slate-200 text-slate-600"
                  >
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-150 flex items-center gap-4 mt-6">
            <button
              onClick={() => handleJoinCircle(selectedCluster.id)}
              disabled={joinedClusterIds[selectedCluster.id]}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                joinedClusterIds[selectedCluster.id]
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
                  : 'bg-[#355872] text-white hover:bg-[#355872]/90 shadow-sm'
              }`}
            >
              <Users className="w-4 h-4" />
              {joinedClusterIds[selectedCluster.id] ? 'Registered in Cluster Network' : `Request to Join ${selectedCluster.name.split(' ')[0]}`}
            </button>

            <button
              onClick={() => {
                alert(`Redirecting to internal telemetry chats for ${selectedCluster.name}. Link synced!`);
              }}
              className="px-4 py-3 bg-[#F7F8F0] border border-slate-200 text-slate-600 rounded-xl text-xs font-mono hover:bg-[#355872] hover:text-white transition-all"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
