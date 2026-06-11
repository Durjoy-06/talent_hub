import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Talent } from '../types';
import { Eye, Heart, PlusCircle, Github, Linkedin, Send, Sparkles, User, Briefcase, GraduationCap, MapPin } from 'lucide-react';

interface SpotlightGalleryProps {
  talents: Talent[];
  selectedHub: string | null;
  onAddTalent: (talent: Talent) => void;
}

export default function SpotlightGallery({ talents, selectedHub, onAddTalent }: SpotlightGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Local state for adding a talent profile
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Full Stack Developer');
  const [newUniversity, setNewUniversity] = useState('');
  const [newDivision, setNewDivision] = useState('Dhaka');
  const [newSkills, setNewSkills] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newLookingFor, setNewLookingFor] = useState('');
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  const categories = ['All', 'AI & NLP', 'Full Stack', 'Design', 'Systems & CP'];

  // Filter talents
  const filteredTalents = talents.filter((t) => {
    // 1. Division filter (from map select)
    if (selectedHub && t.division.toLowerCase() !== selectedHub.toLowerCase()) {
      return false;
    }

    // 2. Category filter
    if (activeCategory === 'All') return true;
    if (activeCategory === 'AI & NLP') {
      return t.role.toLowerCase().includes('ai') || t.role.toLowerCase().includes('nlp') || t.skills.some(s => ['PyTorch', 'NLP', 'Transformers'].includes(s));
    }
    if (activeCategory === 'Full Stack') {
      return t.role.toLowerCase().includes('full stack') || t.role.toLowerCase().includes('architect') || t.skills.some(s => ['Go', 'Next.js', 'Kubernetes'].includes(s));
    }
    if (activeCategory === 'Design') {
      return t.role.toLowerCase().includes('design') || t.skills.some(s => ['Figma', 'System Design'].includes(s));
    }
    if (activeCategory === 'Systems & CP') {
      return t.role.toLowerCase().includes('competitive') || t.role.toLowerCase().includes('programmer') || t.role.toLowerCase().includes('iot') || t.skills.some(s => ['C++', 'Rust', 'Embedded C'].includes(s));
    }
    return true;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesState(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUniversity || !newBio) {
      alert('Please fill out Name, University, and Bio.');
      return;
    }

    const skillsArray = newSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newTalent: Talent = {
      id: `t-added-${Date.now()}`,
      name: newName,
      role: newRole,
      university: newUniversity,
      division: newDivision,
      skills: skillsArray.length > 0 ? skillsArray : ['TypeScript', 'React'],
      bio: newBio,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 5000000)}?auto=format&fit=crop&q=80&w=200` || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      connections: Math.floor(Math.random() * 50) + 5,
      views: Math.floor(Math.random() * 120) + 10,
      lookingFor: newLookingFor || 'Networking and collaborative projects.',
      featured: true,
    };

    onAddTalent(newTalent);

    // Reset forms
    setNewName('');
    setNewUniversity('');
    setNewSkills('');
    setNewBio('');
    setNewLookingFor('');
    setShowAddForm(false);
  };

  return (
    <div id="talent-spotlight" className="my-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#355872]" /> Immersive Showcase
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#355872] tracking-tight mt-1">
            Talent <span className="font-serif italic font-normal text-slate-700">Spotlight Grid</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-xl font-light">
            Highlighting exceptional student innovators, competitive programmers, and designers pushing boundaries across technical ecosystems.
          </p>
        </div>

        {/* Action and Category selection */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="register-profile-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[#355872] hover:bg-[#355872]/95 text-white text-xs font-mono font-medium px-4 py-2.5 rounded-xl transition duration-300 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Share My Profile
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white border border-[#7AAACE]/30 rounded-3xl p-6 md:p-8 mb-10 shadow-md max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 className="font-display text-lg font-semibold text-[#355872] flex items-center gap-2">
              <User className="w-5 h-5" /> Register Professional Talent Profile
            </h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-mono"
            >
              [ Close ]
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sadia Rahman"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">ROLE / INDENTIFICATION *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                >
                  <option value="AI Research Engineer">AI Research Engineer</option>
                  <option value="Full Stack Architect">Full Stack Architect</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Competitive Programmer">Competitive Programmer</option>
                  <option value="IoT Specialist">IoT Specialist</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">UNIVERSITY / INSTITUTE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SUST, DU, IUT"
                  value={newUniversity}
                  onChange={(e) => setNewUniversity(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">LOCATION DIVISION *</label>
                <select
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
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
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">SKILLS (Separated with commas) *</label>
              <input
                type="text"
                placeholder="Python, NLP, Framer, Go"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">DETAILED BIO / PASSION STATEMENT *</label>
              <textarea
                required
                rows={3}
                placeholder="Share your focus area, what you are building, or your achievements..."
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">WHAT TYPE OF OPPORTUNITIES ARE YOU SEEKING?</label>
              <input
                type="text"
                placeholder="e.g., Looking to join early-stage climate tech labs."
                value={newLookingFor}
                onChange={(e) => setNewLookingFor(e.target.value)}
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
              />
            </div>

            <button
              id="submit-profile-btn"
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#355872] text-white hover:bg-[#355872]/90 rounded-xl py-3 font-medium transition duration-300"
            >
              <Send className="w-4 h-4" /> Broadcast Profile to National Graph
            </button>
          </form>
        </motion.div>
      )}

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#F7F8F0]/60 p-1.5 rounded-2xl border border-slate-100 max-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-[#355872] text-[#F7F8F0] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/55'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedHub && (
        <div id="filter-notification" className="mb-6 text-xs font-mono bg-[#7AAACE]/10 text-[#355872] px-4 py-2 rounded-xl flex items-center justify-between">
          <span>Filtering spotlight results for division: <strong className="uppercase">{selectedHub}</strong></span>
          <button onClick={() => window.scrollTo({ top: document.getElementById('bangladesh-opportunity-network')?.offsetTop, behavior: 'smooth' })} className="underline">Change Hub</button>
        </div>
      )}

      {/* Grid List */}
      {filteredTalents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-display font-medium text-[#355872]">No matching profiles found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try choosing another skill filter, clearing the active divisional map filter, or be the first to broadcast from this region!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="profiles-grid">
          <AnimatePresence mode="popLayout">
            {filteredTalents.map((talent, index) => {
              const currentLikes = likesState[talent.id] || 0;
              return (
                <motion.div
                  key={talent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 10 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="bg-white border-2 border-[#355872]/15 rounded-3xl p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.08)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Decorative corner ticks */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#355872]/20" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#355872]/20" />

                  <div>
                    {/* Top row with division badge and university */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#355872]/70 font-semibold">
                        <GraduationCap className="w-3.5 h-3.5 text-[#7AAACE]" />
                        <span>{talent.university}</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-lg bg-[#355872]/8 text-[#355872] border border-[#355872]/15 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {talent.division}
                      </span>
                    </div>

                    {/* Image and core info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          referrerPolicy="no-referrer"
                          src={talent.avatarUrl}
                          alt={talent.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-3xs"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#9CD5FF] border-2 border-white pulsing-dot flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#355872]" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display font-semibold text-slate-800 group-hover:text-[#355872] transition-colors leading-tight">
                          {talent.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{talent.role}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-[#F7F8F0]/30 p-2.5 rounded-xl border border-dotted border-slate-100">
                      {talent.bio}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {talent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F7F8F0] border border-slate-100 text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom section with statistics tracker & outbound links */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        <span>{talent.views + (currentLikes * 3)}</span>
                      </div>
                      <button
                        onClick={(e) => handleLike(talent.id, e)}
                        className="flex items-center gap-1 text-slate-400 hover:text-pink-500 transition-colors group/like"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-transform group-hover/like:scale-125 ${currentLikes > 0 ? 'fill-pink-500 text-pink-500' : 'text-slate-300'}`} />
                        <span>{talent.connections + currentLikes}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {talent.github && (
                        <a href={talent.github} target="_blank" rel="noreferrer" className="p-1 px-1.5 rounded-lg bg-[#F7F8F0] border border-slate-100 text-slate-500 hover:text-[#355872]">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {talent.linkedin && (
                        <a href={talent.linkedin} target="_blank" rel="noreferrer" className="p-1 px-1.5 rounded-lg bg-[#F7F8F0] border border-slate-100 text-slate-500 hover:text-[#355872]">
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          alert(`Connection request initiated to ${talent.name}. Your details have been shared via TalentHub BD Graph Relay!`);
                        }}
                        className="text-[10px] font-mono border border-[#355872]/40 text-[#355872] px-2.5 py-1 rounded-lg hover:bg-[#355872] hover:text-white transition-all"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
