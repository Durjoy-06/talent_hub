import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Opportunity } from '../types';
import { Briefcase, Calendar, ChevronDown, ChevronUp, MapPin, Send, Terminal, Sparkles, DollarSign, Plus } from 'lucide-react';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
  selectedHub: string | null;
  onAddOpportunity: (opp: Opportunity) => void;
  onIncrementApplicants: (id: string) => void;
}

export default function OpportunitiesSection({
  opportunities,
  selectedHub,
  onAddOpportunity,
  onIncrementApplicants
}: OpportunitiesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  // Add Opp local states
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [type, setType] = useState<'Internship' | 'Full-Time' | 'Fellowship' | 'Project'>('Internship');
  const [division, setDivision] = useState('Dhaka');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [description, setDescription] = useState('');
  const [stipend, setStipend] = useState('');

  // Apply form local states
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');

  const filteredOpps = selectedHub
    ? opportunities.filter(o => o.division.toLowerCase() === selectedHub.toLowerCase())
    : opportunities;

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePostOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !description || !stipend) {
      alert('Please complete all fields.');
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-added-${Date.now()}`,
      title,
      type,
      organization,
      division,
      skillsRequired: skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
      description,
      stipend,
      datePosted: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      applicantsCount: 0
    };

    onAddOpportunity(newOpp);
    setTitle('');
    setOrganization('');
    setSkillsRequired('');
    setDescription('');
    setStipend('');
    setShowPostForm(false);
  };

  const handleApplySubmit = (e: React.FormEvent, oppId: string) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert('Please fill out Name and Email.');
      return;
    }

    // Register active apply state
    onIncrementApplicants(oppId);
    setAppliedIds(prev => ({
      ...prev,
      [oppId]: true
    }));

    // Reset apply state fields
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPortfolio('');
  };

  return (
    <div id="opportunities-matrix" className="my-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-[#355872]" /> Collaborative Open Source & Employment Hub
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#355872] tracking-tight mt-1">
            Featured <span className="font-serif italic font-normal text-slate-700">Opportunities Grid</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-light">
            Vetted fellowships, technical internships, and regional client initiatives curated by premium local communities and tier-1 national startups.
          </p>
        </div>

        <button
          id="post-opportunity-btn"
          onClick={() => setShowPostForm(!showPostForm)}
          className="flex items-center gap-1.5 border-2 border-[#355872] text-[#355872] hover:bg-[#355872] hover:text-white text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition duration-300 shadow-[2px_2px_0px_0px_rgba(53,88,114,0.15)]"
        >
          <Plus className="w-4 h-4" /> Create Opportunity Post
        </button>
      </div>

      {showPostForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-dashed border-[#7AAACE]/60 rounded-3xl p-6 md:p-8 mb-10 max-w-2xl mx-auto"
        >
          <h3 className="font-display text-lg font-semibold text-[#355872] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7AAACE] pulsing-dot" /> Post Vetted Collaborative Opportunity
          </h3>
          <form onSubmit={handlePostOpp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">ROLE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Firmware Intern, Junior Rust Dev"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">ORGANIZATION *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Tiger Coding, SUST Lab"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">POSTING TYPE *</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-2.5 py-2.5 text-sm"
                >
                  <option value="Internship">Internship</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Project">Project Contract</option>
                  <option value="Full-Time">Full-Time Job</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">DIVISION HUB *</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-2.5 py-2.5 text-sm"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">COMPENSATION / MONTH *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., BDT 35,000 / month"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">REQUIRED SKILL STACK (Commas)</label>
              <input
                type="text"
                placeholder="React, REST APIs, Python"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1 font-semibold">OPPORTUNITY DESCRIPTION *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail core goals, duties, responsibilities, and application criteria..."
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2.5 text-sm resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="submit-opp-btn"
                type="submit"
                className="px-6 py-2 bg-[#355872] hover:bg-[#355872]/95 text-white rounded-xl text-xs font-mono font-semibold"
              >
                Broadcast to Opportunity Grid
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {selectedHub && (
        <div className="mb-6 text-xs font-mono bg-[#7AAACE]/10 text-[#355872] px-4 py-2 rounded-xl flex items-center justify-between">
          <span>Filtering opportunities for: <strong className="uppercase">{selectedHub} HUB</strong></span>
          <button onClick={() => window.scrollTo({ top: document.getElementById('bangladesh-opportunity-network')?.offsetTop, behavior: 'smooth' })} className="underline">Reset Hub map</button>
        </div>
      )}

      {/* Staggered Non-Grid Strips List */}
      <div className="space-y-4" id="opportunities-list">
        {filteredOpps.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span className="text-sm font-display font-medium text-slate-500 block">No opportunities posted in this region yet.</span>
            <button onClick={() => setShowPostForm(true)} className="text-xs font-mono text-[#355872] underline mt-1">Be the first to post a listing</button>
          </div>
        ) : (
          filteredOpps.map((opp, index) => {
            const isExpanded = expandedId === opp.id;
            const hasApplied = appliedIds[opp.id];

            return (
              <motion.div
                key={opp.id}
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                className={`bg-white border-2 rounded-2xl md:rounded-3xl hover:border-[#355872] overflow-hidden transition-all duration-300 relative ${
                  isExpanded 
                    ? 'border-[#355872] shadow-[6px_6px_0px_0px_#355872]' 
                    : 'border-[#355872]/15 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.06)]'
                }`}
              >
                {/* Decorative corner line accents */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#355872]/20" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#355872]/20" />
                {/* Visual Strip Row */}
                <div
                  id={`opp-strip-${opp.id}`}
                  onClick={() => handleToggleExpand(opp.id)}
                  className="cursor-pointer p-5 sm:p-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none hover:bg-[#F8FAFC]/40"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-[#355872]/10 text-[#355872] uppercase font-bold">
                        {opp.type}
                      </span>
                      <span className="text-slate-400">posted {opp.datePosted}</span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-slate-800 transition-colors">
                      {opp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-500">
                      <span className="text-slate-800 font-medium">{opp.organization}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7AAACE]" /> {opp.division} Hub
                      </span>
                    </div>
                  </div>

                  {/* Compensation & Applicants summary counts */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 sm:gap-10 border-t border-slate-50 md:border-none pt-3 md:pt-0">
                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] font-mono text-slate-400">COMPENSATION</span>
                      <span className="text-sm font-mono text-[#355872] font-semibold flex items-center gap-0.5 md:justify-end">
                        <DollarSign className="w-3.5 h-3.5 text-[#7AAACE]" /> {opp.stipend}
                      </span>
                    </div>

                    <div className="flex flex-col text-left md:text-right">
                      <span className="text-[10px] font-mono text-slate-400">APPLICATIONS</span>
                      <span className="text-sm font-mono font-bold text-slate-700 md:text-right">
                        {opp.applicantsCount} active
                      </span>
                    </div>

                    <div className="p-2 rounded-full bg-[#1E293B]/5 group-hover:bg-[#355872]/10 transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#355872]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded deep-dive content drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-slate-100 bg-[#F8FAFC]/60"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          {/* Left Column: Requirements & Info */}
                          <div className="lg:col-span-7 space-y-5">
                            <div>
                              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Scope & Details</h4>
                              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                                {opp.description}
                              </p>
                            </div>

                            <div>
                              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Target Technical Stack</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {opp.skillsRequired.map((skill) => (
                                  <span key={skill} className="text-xs font-mono px-3 py-1 rounded-lg bg-white border border-slate-200 text-[#355872]">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Application form */}
                          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 md:p-6">
                            <h4 className="font-display font-semibold text-slate-800 text-sm mb-3">
                              Express Instant Application interest
                            </h4>

                            {hasApplied ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1.5"
                              >
                                <span className="font-mono font-bold block">✓ Application Dispatched</span>
                                <p>Your local TalentHub BD digital credentials and CV links have been stacked for `{opp.organization}` reviewing teams.</p>
                              </motion.div>
                            ) : (
                              <form onSubmit={(e) => handleApplySubmit(e, opp.id)} className="space-y-3">
                                <div>
                                  <label className="block text-[10px] font-mono text-slate-400 mb-1">YOUR FULL NAME</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g., Anika Islam"
                                    value={applicantName}
                                    onChange={(e) => setApplicantName(e.target.value)}
                                    className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-mono text-slate-400 mb-1">EMAIL ADDRESS</label>
                                    <input
                                      type="email"
                                      required
                                      placeholder="anika@g.com"
                                      value={applicantEmail}
                                      onChange={(e) => setApplicantEmail(e.target.value)}
                                      className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-3 py-2 text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-mono text-slate-400 mb-1">PORTFOLIO URL / GH</label>
                                    <input
                                      type="url"
                                      placeholder="https://github.com/anika"
                                      value={applicantPortfolio}
                                      onChange={(e) => setApplicantPortfolio(e.target.value)}
                                      className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-3 py-2 text-xs"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="w-full flex items-center justify-center gap-1.5 bg-[#355872] hover:bg-[#355872]/95 text-white text-xs font-mono font-semibold py-2.5 rounded-xl transition duration-300"
                                >
                                  <Send className="w-3 h-3" /> Submit Instant Application
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
