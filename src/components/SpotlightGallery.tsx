import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Talent, LoggedInUser } from '../types';
import { Eye, Heart, PlusCircle, Github, Linkedin, Send, Sparkles, User, Briefcase, GraduationCap, MapPin, Mail, UserCheck, Trophy, Award, Tv, Play, Globe, ExternalLink } from 'lucide-react';

interface SpotlightGalleryProps {
  talents: Talent[];
  selectedHub: string | null;
  onAddTalent: (talent: Talent) => void;
  currentUser: LoggedInUser | null;
  onLoginSuccess?: (user: LoggedInUser) => void;
}

export default function SpotlightGallery({ 
  talents, 
  selectedHub, 
  onAddTalent,
  currentUser,
  onLoginSuccess
}: SpotlightGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Student Sign-in state
  const [signInName, setSignInName] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInUniversity, setSignInUniversity] = useState('BUET');
  const [signInDivision, setSignInDivision] = useState('Dhaka');

  // Local state for adding a talent profile
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Full Stack Developer');
  const [newUniversity, setNewUniversity] = useState('');
  const [newDivision, setNewDivision] = useState('Dhaka');
  const [newSkills, setNewSkills] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newLookingFor, setNewLookingFor] = useState('');
  const [likesState, setLikesState] = useState<Record<string, number>>({});

  // Sync profile form state with currentUser on load/login so it prepopulates
  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      setNewName(currentUser.name);
      if (currentUser.university) setNewUniversity(currentUser.university);
      if (currentUser.division) setNewDivision(currentUser.division);
    }
  }, [currentUser]);

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

  const handleLocalSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInName || !signInEmail) {
      alert('Please fill out Name and Email fields.');
      return;
    }

    const localStudent: LoggedInUser = {
      id: 'stud_active_' + Date.now().toString().slice(-4),
      name: signInName,
      email: signInEmail,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      division: signInDivision,
      university: signInUniversity,
      skills: ['React', 'TypeScript'],
      bio: 'Eager student builder sharing profile on TalentHub BD.',
    };

    if (onLoginSuccess) {
      onLoginSuccess(localStudent);
    } else {
      localStorage.setItem('talenthub_bd_user', JSON.stringify(localStudent));
    }

    alert(`SUCCESS: Student session established for "${signInName}". You can now proceed to input and register your professional talent profile!`);
  };

  const isStudentLoggedIn = currentUser && currentUser.role === 'student';
  const isOrganizerLoggedIn = currentUser && currentUser.role === 'organizer';

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
          className="bg-white border-2 border-[#355872]/20 rounded-3xl p-6 md:p-8 mb-10 shadow-md max-w-2xl mx-auto relative overflow-hidden"
        >
          {/* Section decoration ticks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#355872]/10" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#355872]/10" />

          {/* Close button always visible */}
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <h3 className="font-display text-lg font-bold text-[#355872] flex items-center gap-2">
              {isStudentLoggedIn ? (
                <>
                  <User className="w-5 h-5 text-[#7AAACE]" /> Register Professional Talent Profile
                </>
              ) : isOrganizerLoggedIn ? (
                <>
                  <UserCheck className="w-5 h-5 text-red-500" /> Organizer Role Warning
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 text-[#355872]" /> Student Verification Gateway
                </>
              )}
            </h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-mono border px-2 py-0.5 rounded-lg bg-slate-50 transition-colors"
            >
              [ Close ]
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isOrganizerLoggedIn ? (
              <motion.div
                key="organizer-warning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 space-y-4 font-mono text-xs"
              >
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl max-w-md mx-auto">
                  💡 <strong>Organizer Account Detected</strong>: Your current active session is configured with administrative privileges. Sharing talent profiles is reserved exclusively for students.
                </div>
                <p className="text-slate-400">Please disconnect your organizer node first to proceed as a student builder.</p>
              </motion.div>
            ) : !isStudentLoggedIn ? (
              <motion.div
                key="student-signin"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-left"
              >
                <div className="bg-[#355872]/5 border-l-4 border-[#355872] p-3 rounded-r-xl">
                  <p className="text-xs text-[#355872] leading-relaxed">
                    💡 <strong>System Ingress Requirements</strong>: To prevent spam registries, students are requested to quickly verify their student identity. Existing accounts can sign-in immediately.
                  </p>
                </div>

                <form onSubmit={handleLocalSignIn} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Sadia Rahman"
                        value={signInName}
                        onChange={(e) => setSignInName(e.target.value)}
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., sadia@student.buet.ac.bd"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">UNIVERSITY *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., BUET, DU, SUST"
                        value={signInUniversity}
                        onChange={(e) => setSignInUniversity(e.target.value)}
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">LOCATION DIVISION *</label>
                      <select
                        value={signInDivision}
                        onChange={(e) => setSignInDivision(e.target.value)}
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all"
                      >
                        {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#355872] hover:bg-[#355872]/95 text-white rounded-xl py-3 text-xs font-mono font-bold shadow-md transition-all duration-300"
                  >
                    <UserCheck className="w-4 h-4 text-[#9CD5FF]" /> [ Verify identity & Load Registration Form ]
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-talent-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-left"
              >
                <div className="bg-[#355872]/5 p-3 rounded-2xl border border-dashed border-[#355872]/20 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-[#355872] font-semibold">Active Session: {currentUser?.name} ({currentUser?.university})</span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[9px] font-bold">VERIFIED_CELL</span>
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
                      <label className="block text-xs font-mono text-slate-500 mb-1">ROLE / IDENTIFICATION *</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all animate-none"
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
                        className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm focus:bg-white transition-all animate-none"
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
                    className="w-full flex items-center justify-center gap-2 bg-[#355872] text-white hover:bg-[#355872]/90 rounded-xl py-3 font-medium transition duration-300 font-mono text-xs shadow-sm"
                  >
                    <Send className="w-4 h-4" /> [ Broadcast Profile to National Graph ]
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
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
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]" id="profiles-grid">
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
                  className="break-inside-avoid mb-6 inline-block w-full bg-white border-2 border-[#355872]/15 rounded-3xl p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.08)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden group hover:shadow-[5px_5px_0px_0px_#355872]"
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

                    {/* Showcase Content Panel (Card Morphing) */}
                    {talent.showcases && talent.showcases.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        {talent.showcases.map((sc) => (
                          <div key={sc.id} className="text-left">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border tracking-tight ${
                                sc.category === 'Dev' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                sc.category === 'Design' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                sc.category === 'CP' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                {sc.category} Showcase
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">Featured</span>
                            </div>

                            <h4 className="font-sans font-bold text-xs text-slate-800 leading-tight mb-1">{sc.title}</h4>
                            <p className="text-[11px] text-slate-500 font-light leading-relaxed mb-3 line-clamp-2">{sc.description}</p>
                            
                            {/* Inner morph content details */}
                            {sc.category === 'Dev' && (
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-2 text-[10px] font-mono">
                                {sc.language && (
                                  <div className="flex justify-between items-center text-[9px]">
                                    <span className="text-slate-400">STACK</span>
                                    <span className="font-bold text-[#355872] bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">{sc.language}</span>
                                  </div>
                                )}
                                <div className="flex gap-3 pt-1 border-t border-dashed border-slate-200/50">
                                  {sc.githubUrl && (
                                    <a href={sc.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-600 hover:text-[#355872] hover:underline">
                                      <Github className="w-3 h-3" /> Repo
                                    </a>
                                  )}
                                  {sc.liveUrl && (
                                    <a href={sc.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-600 hover:text-[#355872] hover:underline ml-auto">
                                      <ExternalLink className="w-3 h-3" /> Live
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {sc.category === 'Design' && (
                              <div className="space-y-2 mt-2">
                                {sc.imageUrl && (
                                  <div className="relative rounded-xl overflow-hidden aspect-video border bg-slate-100 select-none group/img">
                                    <img 
                                      src={sc.imageUrl} 
                                      alt={sc.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover transition-transform group-hover/img:scale-105 duration-300 animate-fade-in"
                                    />
                                    {/* Hover Reveal effects */}
                                    <div className="absolute inset-0 bg-[#355872]/85 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                                      <p className="text-[10px] font-mono text-white text-center font-bold tracking-tight">EXPLORE CONCEPT SHEETS</p>
                                    </div>
                                  </div>
                                )}
                                {sc.liveUrl && (
                                  <div className="text-[10px] font-mono">
                                    <a href={sc.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-600 hover:text-pink-800 hover:underline font-bold">
                                      <ExternalLink className="w-3 h-3" /> Presentation Draft
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {sc.category === 'CP' && (
                              <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/25 rounded-xl p-3 mt-1 relative overflow-hidden">
                                <div className="absolute right-1 bottom-0.5 opacity-[0.08]">
                                  <Trophy className="w-12 h-12 text-amber-600" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                  <div>
                                    <span className="text-[8px] text-slate-400 block font-bold leading-none uppercase">ID HANDLE</span>
                                    <span className="font-bold text-slate-800 break-all">{sc.cpHandle}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[8px] text-slate-400 block font-bold leading-none uppercase">RATING INDEX</span>
                                    <span className="font-black text-amber-750">{sc.cpRating || 1500} pts</span>
                                  </div>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-dashed border-amber-500/15 flex items-center justify-between">
                                  <span className="text-[8px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200 select-none uppercase">
                                    ★ CF: {sc.cpRank || 'Specialist'}
                                  </span>
                                  <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-0.5">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> VERIFIED BADGE
                                  </span>
                                </div>
                              </div>
                            )}

                            {sc.category === 'Hackathon' && (
                              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 mt-2 text-[10px] font-mono">
                                <div className="flex items-center gap-1.5 text-purple-800 font-bold mb-1">
                                  <Tv className="w-3.5 h-3.5 text-purple-700" /> Hackathon Demo Pitch
                                </div>
                                <div className="flex gap-4 pt-1.5 border-t border-dashed border-purple-250 mt-1">
                                  {sc.demoVideo && (
                                    <a href={sc.demoVideo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline">
                                      <Play className="w-3 h-3 fill-purple-700 stroke-none" /> Play Video
                                    </a>
                                  )}
                                  {sc.docLink && (
                                    <a href={sc.docLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline ml-auto">
                                      <Globe className="w-3.5 h-3.5" /> Documentation
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
