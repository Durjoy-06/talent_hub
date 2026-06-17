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
  Bell,
  X,
  Trash2,
  ExternalLink,
  Plus,
  Upload,
  Globe,
  Tv,
  Play,
  Trophy,
  Code,
  Image,
  Award,
  Video
} from 'lucide-react';
import { LoggedInUser, Opportunity, EventHub, Application } from '../types';

// Dynamic CountDown Clock Component for Registered Events Itinerary
const CountdownClock = ({ eventDate }: { eventDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        const dStr = eventDate.includes('2026') ? eventDate : `${eventDate}, 2026`;
        const eventTime = new Date(dStr).getTime();
        const difference = eventTime - Date.now();

        if (difference <= 0) {
          setTimeLeft(null);
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } catch (e) {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-mono font-black animate-pulse">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1" />
        ● HUB SESSION LIVE
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-200/55 px-2 py-1 rounded-lg">
      <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold mr-1">Starts In:</span>
      <span className="px-1 py-0.5 bg-slate-200/40 rounded text-slate-700 font-bold">{String(timeLeft.days).padStart(2, '0')}d</span>
      <span>:</span>
      <span className="px-1 py-0.5 bg-slate-200/40 rounded text-slate-700 font-bold">{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span>:</span>
      <span className="px-1 py-0.5 bg-slate-200/40 rounded text-slate-700 font-bold">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      <span>:</span>
      <span className="px-1 py-0.5 bg-slate-100 rounded text-rose-600 font-black">{String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  );
};

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
  onUpdateProfile?: (updatedUser: LoggedInUser) => void;
  requestedTab?: 'growth' | 'applications' | 'events' | 'saved' | 'showcase';
  onOpenNotifications?: () => void;
  unreadCount?: number;
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
  onRegisterEvent,
  onUpdateProfile,
  requestedTab,
  onOpenNotifications,
  unreadCount = 0
}: StudentDashboardProps) {
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  
  // User Profile Slide-over States
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Profile Editable state buffers
  const [profileName, setProfileName] = useState<string>(user.name || '');
  const [profileAvatar, setProfileAvatar] = useState<string>(user.avatar || '');
  const [profileUniversity, setProfileUniversity] = useState<string>(user.university || '');
  const [profileEnrollmentYear, setProfileEnrollmentYear] = useState<string>(user.enrollmentYear || '');
  const [profilePhone, setProfilePhone] = useState<string>(user.phone || '');
  const [profileAddress, setProfileAddress] = useState<string>(user.address || '');
  const [profileBio, setProfileBio] = useState<string>(user.bio || '');
  const [profileSkills, setProfileSkills] = useState<string[]>(user.skills || []);

  const [tagInput, setTagInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // --- SHOWCASE PORTFOLIO STATES ---
  const [isAddShowcaseOpen, setIsAddShowcaseOpen] = useState<boolean>(false);
  const [showcaseCategory, setShowcaseCategory] = useState<'Dev' | 'Design' | 'CP' | 'Hackathon'>('Dev');
  const [showcaseTitle, setShowcaseTitle] = useState<string>('');
  const [showcaseDescription, setShowcaseDescription] = useState<string>('');
  
  // Category specific fields
  const [showcaseImageUrl, setShowcaseImageUrl] = useState<string>('');
  const [showcaseGithubUrl, setShowcaseGithubUrl] = useState<string>('');
  const [showcaseLiveUrl, setShowcaseLiveUrl] = useState<string>('');
  const [showcaseLanguage, setShowcaseLanguage] = useState<string>('TypeScript');
  
  const [showcaseCpPlatform, setShowcaseCpPlatform] = useState<'Codeforces' | 'CodeChef'>('Codeforces');
  const [showcaseCpHandle, setShowcaseCpHandle] = useState<string>('');
  const [showcaseCpRating, setShowcaseCpRating] = useState<number>(1500);
  const [showcaseCpRank, setShowcaseCpRank] = useState<string>('Specialist');
  const [cpFetchLoading, setCpFetchLoading] = useState<boolean>(false);
  const [cpFetchStatus, setCpFetchStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cpFetchError, setCpFetchError] = useState<string>('');

  const [showcaseDemoVideo, setShowcaseDemoVideo] = useState<string>('');
  const [showcaseDocLink, setShowcaseDocLink] = useState<string>('');
  const [scDragActive, setScDragActive] = useState<boolean>(false);

  // Sync drag-and-drop for showcase image upload
  const handleScDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setScDragActive(true);
    } else if (e.type === "dragleave") {
      setScDragActive(false);
    }
  };

  const handleScDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setShowcaseImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setShowcaseImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDashboardJoinEvent = (eventId: string, eventTitle: string) => {
    setMorphingEventId(eventId);
    setDashboardToast({ message: `Successfully registered for "${eventTitle}"!`, show: true });
    
    // Call the parent state registration trigger immediately (Optimistic UI)
    onRegisterEvent(eventId);

    setTimeout(() => {
      setDashboardToast(prev => prev ? { ...prev, show: false } : null);
    }, 4500);

    // Dynamic reset
    setTimeout(() => {
      setMorphingEventId(null);
    }, 800);
  };

  // Async Codeforces API Rating sync
  const handleSyncCodeforces = async () => {
    if (!showcaseCpHandle.trim()) {
      setCpFetchStatus('error');
      setCpFetchError('Please enter a handle first.');
      return;
    }
    setCpFetchLoading(true);
    setCpFetchStatus('idle');
    setCpFetchError('');
    try {
      const resp = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(showcaseCpHandle.trim())}`);
      const data = await resp.json();
      if (data.status === 'OK' && data.result && data.result[0]) {
        const userInfo = data.result[0];
        setShowcaseCpRating(userInfo.rating || 1500);
        setShowcaseCpRank(userInfo.rank || 'Unrated');
        setCpFetchStatus('success');
      } else {
        setCpFetchStatus('error');
        setCpFetchError(data.comment || 'Handle not found or invalid response from Codeforces API.');
      }
    } catch (err: any) {
      console.error(err);
      setCpFetchStatus('error');
      setCpFetchError('Network error connecting to Codeforces API. Codeforces might be rate-limiting. Try manual entry or check input.');
    } finally {
      setCpFetchLoading(false);
    }
  };

  // Commit dynamic showcase to student log
  const handleAddShowcaseItem = () => {
    if (!showcaseTitle.trim()) {
      alert('Please enter a Title for this showcase.');
      return;
    }
    
    const newShowcase: any = {
      id: `sc-${Date.now()}`,
      category: showcaseCategory,
      title: showcaseTitle,
      description: showcaseDescription,
    };

    if (showcaseCategory === 'Dev') {
      newShowcase.githubUrl = showcaseGithubUrl;
      newShowcase.liveUrl = showcaseLiveUrl;
      newShowcase.language = showcaseLanguage;
    } else if (showcaseCategory === 'Design') {
      newShowcase.imageUrl = showcaseImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600';
      newShowcase.liveUrl = showcaseLiveUrl;
    } else if (showcaseCategory === 'CP') {
      newShowcase.cpPlatform = showcaseCpPlatform;
      newShowcase.cpHandle = showcaseCpHandle;
      newShowcase.cpRating = showcaseCpRating;
      newShowcase.cpRank = showcaseCpRank;
    } else if (showcaseCategory === 'Hackathon') {
      newShowcase.demoVideo = showcaseDemoVideo;
      newShowcase.docLink = showcaseDocLink;
      newShowcase.githubUrl = showcaseGithubUrl;
    }

    const updatedShowcases = [...(user.showcases || []), newShowcase];
    
    if (onUpdateProfile) {
      onUpdateProfile({
        ...user,
        showcases: updatedShowcases
      });
    }

    // Reset fields
    setShowcaseTitle('');
    setShowcaseDescription('');
    setShowcaseImageUrl('');
    setShowcaseGithubUrl('');
    setShowcaseLiveUrl('');
    setShowcaseLanguage('TypeScript');
    setShowcaseCpHandle('');
    setShowcaseCpRating(1500);
    setShowcaseCpRank('Specialist');
    setShowcaseDemoVideo('');
    setShowcaseDocLink('');
    setCpFetchStatus('idle');
    setIsAddShowcaseOpen(false);
  };

  // Delete dynamic showcase from student log
  const handleDeleteShowcaseItem = (idToDelete: string) => {
    if (!window.confirm('Are you sure you want to remove this showcase item?')) return;
    const updatedShowcases = (user.showcases || []).filter(item => item.id !== idToDelete);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...user,
        showcases: updatedShowcases
      });
    }
  };

  // Sync to outer user updates
  useEffect(() => {
    setProfileName(user.name || '');
    setProfileAvatar(user.avatar || '');
    setProfileUniversity(user.university || '');
    setProfileEnrollmentYear(user.enrollmentYear || '');
    setProfilePhone(user.phone || '');
    setProfileAddress(user.address || '');
    setProfileBio(user.bio || '');
    setProfileSkills(user.skills || []);
  }, [user]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !profileSkills.includes(trimmed)) {
        setProfileSkills([...profileSkills, trimmed]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setProfileSkills(profileSkills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!onUpdateProfile) return;
    
    const updatedUser = {
      ...user,
      name: profileName,
      avatar: profileAvatar,
      university: profileUniversity,
      enrollmentYear: profileEnrollmentYear,
      phone: profilePhone,
      address: profileAddress,
      bio: profileBio,
      skills: profileSkills
    };

    // 1. Optimistic Update (Immediate Feedback)
    onUpdateProfile(updatedUser);
    
    // 2. Slow down backend state sync simulation
    setIsSaving(true);
    setSaveMessage('Updating profile state on secure node ledger...');
    
    setTimeout(() => {
      setSaveMessage('Profile state successfully synchronized!');
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        setSaveMessage('');
      }, 1000);
    }, 1200);
  };

  const handleCancelProfile = () => {
    setProfileName(user.name || '');
    setProfileAvatar(user.avatar || '');
    setProfileUniversity(user.university || '');
    setProfileEnrollmentYear(user.enrollmentYear || '');
    setProfilePhone(user.phone || '');
    setProfileAddress(user.address || '');
    setProfileBio(user.bio || '');
    setProfileSkills(user.skills || []);

    setIsEditing(false);
  };
  const [activeTab, setActiveTab] = useState<'growth' | 'applications' | 'events' | 'saved' | 'showcase'>('growth');
  const [dashboardToast, setDashboardToast] = useState<{ message: string; show: boolean } | null>(null);
  const [morphingEventId, setMorphingEventId] = useState<string | null>(null);
  const [discoveryTab, setDiscoveryTab] = useState<'All' | 'Active' | 'Deadline Near'>('All');

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);
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
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="p-3 border-b border-slate-800/60 overflow-hidden cursor-pointer hover:bg-slate-800/50 transition-colors group"
            id="sidebar-profile-trigger"
          >
            <div className="flex items-center gap-3">
              <img 
                src={profileAvatar || user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-xl border border-slate-700 shrink-0 object-cover group-hover:scale-105 transition-transform" 
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
              onClick={() => setActiveTab('showcase')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'showcase' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              id="nav-showcase-tab-btn"
            >
              <Sparkles className="w-4 h-4 shrink-0 text-yellow-300 animate-pulse" />
              {isSidebarExpanded && <span>[ Showcase Hub ]</span>}
              <span className="absolute right-3 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
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
              {unreadCount > 0 && (
                <motion.span 
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-600 text-[8px] font-mono font-black text-white shadow-sm border-2 border-[#F7F8F0] z-10" 
                >
                  {unreadCount}
                </motion.span>
              )}
              <button 
                onClick={onOpenNotifications}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer relative"
                aria-label="Toggle notifications menu"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            {/* Profile trigger avatar in top right (clearly visible, proper pacing and prominence) */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1 bg-white border-2 border-[#355872]/20 hover:border-[#D0674B] rounded-xl hover:bg-slate-50 transition-all shadow-sm group cursor-pointer duration-300 relative"
              id="top-profile-trigger"
              title="Access My Identity Profile"
            >
              <img 
                src={profileAvatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                alt={profileName} 
                className="w-8 h-8 rounded-lg object-cover select-none shrink-0"
              />
              <span className="text-[10px] font-mono font-black text-[#355872] pr-1.5 hidden sm:inline select-none group-hover:text-[#D0674B] transition-colors">
                PROFL_GRID
              </span>
              <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white" />
            </button>
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
                className="space-y-12 relative"
              >
                {/* Dashboard Toast Alert Portal */}
                <AnimatePresence>
                  {dashboardToast && dashboardToast.show && (
                    <motion.div
                      initial={{ opacity: 0, y: 60, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.95 }}
                      className="fixed bottom-8 right-8 z-[100] bg-slate-900 border border-slate-800 text-[#F7F8F0] px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-sans max-w-sm select-none"
                      style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold block tracking-wider uppercase">[ SEAT STATUS SECURED ]</span>
                        <p className="text-xs font-light text-slate-100 leading-snug">{dashboardToast.message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* --- Section A: Registered Itinerary --- */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-semibold">[ GRID TIMELINE ]</span>
                      <h2 className="font-display text-2xl font-black text-slate-800">My Registered Events</h2>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-xl bg-[#355872]/8 text-[#355872] border font-bold">
                      {registeredEventIds.length} Scheduled Slates
                    </span>
                  </div>

                  {registeredEventIds.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-4">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold font-mono text-slate-600">[ NO EVENT BOOKINGS FOUND ]</p>
                        <p className="text-xs font-light max-w-sm mx-auto">Your schedule is currently clear. Use the discovery grid below to reserve your seats instantly.</p>
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
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-slate-400 flex items-center gap-1.5 text-[10px] font-mono">
                                  <MapPin className="w-3.5 h-3.5 text-[#7AAACE]" /> Linked Node: {ev.division} division
                                </span>
                                
                                <CountdownClock eventDate={ev.date} />
                              </div>

                              <div className="flex items-center gap-2">
                                {(ev.type === 'Workshop' || ev.type === 'Meetup' || ev.type === 'Bootcamp') && (
                                  <a 
                                    href={`https://meet.google.com/abc-defg-hij?event=${ev.id}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[10px] font-mono transition-all duration-350 hover:shadow-[3px_3px_0px_0px_rgba(79,70,229,0.2)] cursor-pointer"
                                    onClick={(e) => {
                                      console.log("Entering Google Meet session...");
                                    }}
                                  >
                                    Join Session <Video className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button 
                                  onClick={() => alert(`LOBBY DETAILS: Connected with digital access token client_token_${ev.id}. Room links are sent via durjoybanik06@gmail.com.`)}
                                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-mono font-bold text-[10px] cursor-pointer"
                                >
                                  [ Digital Pass ]
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- Section B: Explore Public Event Agenda --- */}
                <div className="space-y-6 pt-6 border-t border-slate-150">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-indigo-600 font-bold uppercase block">[ CONNECT_NODE_DISCOVERY ]</span>
                      <h2 className="font-display text-2xl font-black text-slate-850">Explore Public Event Agenda</h2>
                      <p className="text-xs text-slate-500 font-light mt-1">Discover, join, & register for regional technology events instantly from your hub center dashboard.</p>
                    </div>

                    {/* Sub-tabs inside discovery cockpit */}
                    <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl border">
                      {(['All', 'Active', 'Deadline Near'] as const).map((t) => {
                        const count = events.filter(e => {
                          if (registeredEventIds.includes(e.id)) return false;
                          if (t === 'Active') return e.registrationOpen === true;
                          if (t === 'Deadline Near') return e.id === 'e1' || e.id === 'e2';
                          return true;
                        }).length;

                        return (
                          <button
                            key={t}
                            onClick={() => setDiscoveryTab(t)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                              discoveryTab === t
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                            }`}
                          >
                            {t} 
                            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filtered Agenda discovery grid */}
                  {events.filter(e => !registeredEventIds.includes(e.id)).length === 0 ? (
                    <div className="bg-[#FAFBF7] border border-slate-200 rounded-3xl p-10 text-center text-slate-500 space-y-2">
                      <p className="text-xs font-mono font-bold tracking-wider text-slate-600">[ ALL EVENTS REGISTERED ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto leading-relaxed">Awesome! You have successfully reserved seats for every active regional tech event. Check your schedule timeline above.</p>
                    </div>
                  ) : (
                    (() => {
                      const list = events.filter(e => {
                        if (registeredEventIds.includes(e.id)) return false;
                        if (discoveryTab === 'Active') return e.registrationOpen === true;
                        if (discoveryTab === 'Deadline Near') return e.id === 'e1' || e.id === 'e2';
                        return true;
                      });

                      if (list.length === 0) {
                        return (
                          <div className="bg-[#FAFBF7] border border-slate-200 rounded-3xl p-8 text-center text-slate-400">
                            <p className="text-xs font-mono font-bold">[ NO FILTER MATCHES ]</p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {list.map((ev) => {
                            const isMorphing = morphingEventId === ev.id;
                            const isNear = ev.id === 'e1' || ev.id === 'e2';
                            
                            return (
                              <motion.div
                                key={ev.id}
                                layout
                                className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:border-slate-800 transition-colors relative flex flex-col justify-between"
                              >
                                {isNear && (
                                  <div className="absolute -top-2.5 right-6 bg-rose-500 text-white font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-md shadow-sm uppercase tracking-wider animate-pulse">
                                    Deadline Near
                                  </div>
                                )}
                                
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <span className="text-[10px] font-mono text-slate-400 font-bold block">{ev.organizer}</span>
                                      <h3 className="font-sans font-bold text-sm text-slate-800 leading-snug mt-0.5">{ev.title}</h3>
                                    </div>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-black uppercase text-nowrap shrink-0">
                                      {ev.type}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">{ev.description}</p>
                                </div>

                                <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center gap-3">
                                  <div className="space-y-1">
                                    <span className="text-slate-400 flex items-center gap-1.5 text-[10px] font-mono">
                                      <MapPin className="w-3.5 h-3.5 text-[#7AAACE]" /> {ev.division} division
                                    </span>
                                    <span className="text-slate-400 flex items-center gap-1.5 text-[9px] font-mono">
                                      <Clock className="w-3 h-3 text-slate-300" /> Date: {ev.date}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleDashboardJoinEvent(ev.id, ev.title)}
                                    disabled={isMorphing}
                                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm border ${
                                      isMorphing 
                                        ? 'bg-[#F7F8F0] border-emerald-500 text-emerald-600'
                                        : 'bg-[#355872] border-transparent text-white hover:bg-[#355872]/95 hover:shadow-md'
                                    }`}
                                  >
                                    {isMorphing ? (
                                      <>
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Registered
                                      </>
                                    ) : (
                                      <>
                                        Join Event
                                      </>
                                    )}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })()
                  )}
                </div>
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

            {activeTab === 'showcase' && (
              <motion.div
                key="showcase_hub"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Header Title with Upload trigger */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200">
                  <div className="text-left">
                    <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase font-bold">[ CREATIVE_PORTFOLIO_LEDGER ]</span>
                    <h2 className="font-display text-2xl font-black text-[#355872] tracking-tight mt-1">My Dynamic Showcase Feed</h2>
                    <p className="text-slate-500 text-xs mt-1 max-w-xl font-light">
                      Assemble work samples, design drafts, or competitive programming metrics here. Updates broadcast instantly to the spotlight grid.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddShowcaseOpen(true)}
                    className="flex items-center gap-2 bg-[#355872] hover:bg-[#355872]/90 text-white text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition duration-300 shadow-sm shrink-0 cursor-pointer"
                    id="trigger-new-showcase-btn"
                  >
                    <Plus className="w-4 h-4 text-yellow-300" /> Add New Showcase
                  </button>
                </div>

                {/* Grid listing */}
                {!user.showcases || user.showcases.length === 0 ? (
                  <div className="bg-white border text-center rounded-3xl p-12 text-slate-400 space-y-4 shadow-sm">
                    <div className="w-16 h-16 bg-[#355872]/5 rounded-3xl flex items-center justify-center mx-auto border border-dashed border-[#355872]/30">
                      <Sparkles className="w-8 h-8 text-[#355872] animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold font-mono text-slate-600 uppercase">[ PORTFOLIO_MESH_EMPTY ]</p>
                      <p className="text-xs font-light max-w-sm mx-auto">
                        No active showcases published to the National Graph. Work samples, design drafts, or competitive programming handles can be added using the button above.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {user.showcases.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 relative flex flex-col justify-between hover:border-[#355872] transition-all duration-300 shadow-sm relative overflow-hidden group hover:shadow-[5px_5px_0px_0px_#355872]"
                      >
                        {/* Decorative corner ticks */}
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#355872]/20" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#355872]/20" />
                        
                        <div>
                          {/* Top Card Row */}
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                              item.category === 'Dev' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              item.category === 'Design' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                              item.category === 'CP' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}>
                              [{item.category}]
                            </span>
                            
                            <button
                              onClick={() => handleDeleteShowcaseItem(item.id)}
                              className="text-slate-450 hover:text-red-655 p-1 rounded-lg transition-colors hover:bg-red-50 cursor-pointer"
                              title="Delete Showcase"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Title & Description */}
                          <h3 className="font-sans font-bold text-base text-slate-850 mb-1 leading-tight">{item.title}</h3>
                          <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">{item.description}</p>
                          
                          {/* Category Morph Content Panels */}
                          {item.category === 'Dev' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 mt-2">
                              {item.language && (
                                <div className="text-[10px] font-mono flex justify-between items-center">
                                  <span className="text-slate-400 font-semibold">[ CODE_FLAVOR ]</span>
                                  <span className="font-bold text-[#355872] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">{item.language}</span>
                                </div>
                              )}
                              <div className="flex gap-4 text-[10px] font-mono pt-1.5 border-t border-dashed border-slate-200/60">
                                {item.githubUrl && (
                                  <a href={item.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-650 hover:text-indigo-600 hover:underline">
                                    <Github className="w-3.5 h-3.5" /> Repository
                                  </a>
                                )}
                                {item.liveUrl && (
                                  <a href={item.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-650 hover:text-indigo-600 hover:underline ml-auto">
                                    <ExternalLink className="w-3.5 h-3.5" /> Live Site
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {item.category === 'Design' && (
                            <div className="space-y-3 mt-2">
                              {item.imageUrl && (
                                <div className="relative rounded-2xl overflow-hidden aspect-video border bg-slate-100 select-none">
                                  <img 
                                    src={item.imageUrl} 
                                    referrerPolicy="no-referrer"
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                  />
                                </div>
                              )}
                              {item.liveUrl && (
                                <div className="text-[10px] font-mono pt-1">
                                  <a href={item.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-pink-600 hover:underline font-bold">
                                    <ExternalLink className="w-3.5 h-3.5" /> View Design Concept
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {item.category === 'CP' && (
                            <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 mt-2 relative overflow-hidden">
                              <div className="absolute right-2 bottom-1 opacity-10">
                                <Trophy className="w-16 h-16 text-amber-600" />
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mb-2">Verified Competitor Badging</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                  <div className="text-[9px] text-slate-400 font-mono">LEAGUE ID</div>
                                  <div className="text-xs font-mono font-bold text-slate-800">{item.cpHandle}</div>
                                </div>
                                <div className="space-y-0.5 text-right">
                                  <div className="text-[9px] text-slate-400 font-mono">RANK TIER</div>
                                  <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase">
                                    ★ {item.cpRank || 'Expert'}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-slate-400 font-semibold">ECOSYSTEM LEVEL SCORE</span>
                                  <span className="text-xs font-mono font-black text-amber-700">{item.cpRating || 1500} pts</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                  <div 
                                    className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${Math.min(100, (item.cpRating || 1500) / 3800 * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {item.category === 'Hackathon' && (
                            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-3.5 space-y-2.5 mt-2">
                              <div className="text-[10px] font-mono flex justify-between">
                                <span className="text-slate-400">DELIVERABLES</span>
                                <span className="text-purple-700 font-bold flex items-center gap-1">
                                  <Tv className="w-3 h-3" /> Event Pitch Demo
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-500 italic leading-relaxed">Attached demo video contains proof of hack and documentation blueprints.</p>
                              <div className="flex gap-4 text-[10px] font-mono pt-1">
                                {item.demoVideo && (
                                  <a href={item.demoVideo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-750 hover:text-purple-900 font-bold hover:underline">
                                    <Play className="w-3 h-3 fill-purple-700 stroke-none" /> Play Demo Video
                                  </a>
                                )}
                                {item.docLink && (
                                  <a href={item.docLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-750 hover:text-purple-900 font-bold hover:underline ml-auto">
                                    <Globe className="w-3.5 h-3.5" /> Docs Blueprint
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. NEW SHOWCASE MODAL OVERLAY */}
          <AnimatePresence>
            {isAddShowcaseOpen && (
              <>
                {/* Backdrop Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/70 z-50 backdrop-blur-sm"
                  onClick={() => setIsAddShowcaseOpen(false)}
                />

                {/* Modal Dialog Content container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-[#F7F8F0] border-2 border-[#355872] rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
                >
                  <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center bg-gradient-to-r from-white via-blue-50/10 to-yellow-50/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border-2 border-yellow-400 flex items-center justify-center text-white text-xs font-serif italic">
                        SC
                      </div>
                      <div>
                        <h2 className="font-display font-black text-slate-800 text-sm tracking-tight text-left">Add Showcase Project</h2>
                        <p className="text-[10px] font-mono text-slate-400">Universal Dynamic Aggregation Node</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsAddShowcaseOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-left">
                    {/* Category Selection Tab-Selector */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">1. CATEGORIES CLASSIFICATION</label>
                      <div className="grid grid-cols-4 gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl">
                        {['Dev', 'Design', 'CP', 'Hackathon'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setShowcaseCategory(cat as any)}
                            className={`py-2 text-[10px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
                              showcaseCategory === cat 
                                ? 'bg-slate-900 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Common project Title and description */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">2. TITLE / DESCRIPTIVE HEADLINE</label>
                      <input
                        type="text"
                        value={showcaseTitle}
                        onChange={(e) => setShowcaseTitle(e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2 outline-none"
                        placeholder="e.g., Shonali Core Engine, Bangla Viz Dashboard"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">3. SYNOPSIS / HIGHLIGHT ACHIEVEMENTS</label>
                      <textarea
                        value={showcaseDescription}
                        onChange={(e) => setShowcaseDescription(e.target.value)}
                        rows={3}
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2 outline-none resize-none"
                        placeholder="Provide a clean synopsis of why this project stands out, results attained, and tech/research methods utilized."
                      />
                    </div>

                    {/* Dynamic fields (Card Morphing inputs) */}
                    {showcaseCategory === 'Dev' && (
                      <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl">
                        <div className="text-[10px] font-mono font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-600" /> [ DEVELOPMENT CORE PARAMETERS ]
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-slate-400">PRIMARY LANGUAGE</label>
                          <select
                            value={showcaseLanguage}
                            onChange={(e) => setShowcaseLanguage(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none"
                          >
                            <option value="TypeScript">TypeScript</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Go">Go</option>
                            <option value="Python">Python</option>
                            <option value="C++">C++</option>
                            <option value="Rust">Rust</option>
                            <option value="Java">Java</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">GITHUB REPOSITORY URL</label>
                            <input
                              type="text"
                              value={showcaseGithubUrl}
                              onChange={(e) => setShowcaseGithubUrl(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">LIVE WEBSITE URL</label>
                            <input
                              type="text"
                              value={showcaseLiveUrl}
                              onChange={(e) => setShowcaseLiveUrl(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                              placeholder="https://myproj.app"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {showcaseCategory === 'Design' && (
                      <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl">
                        <div className="text-[10px] font-mono font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5 text-pink-600" /> [ VISUAL ARTS & DESIGN PREVIEW ]
                        </div>

                        {/* Drag and drop zone */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono font-bold text-slate-400">PORTFOLIO IMAGE FILE OR DROPZONE</label>
                          <div
                            onDragEnter={handleScDrag}
                            onDragOver={handleScDrag}
                            onDragLeave={handleScDrag}
                            onDrop={handleScDrop}
                            onClick={() => document.getElementById('sc-image-file-input2')?.click()}
                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 relative ${
                              scDragActive
                                ? 'border-pink-500 bg-pink-50/20'
                                : 'border-slate-300 hover:border-[#355872] bg-slate-50'
                            }`}
                          >
                            <input
                              type="file"
                              id="sc-image-file-input2"
                              className="hidden"
                              accept="image/*"
                              onChange={handleScFileInput}
                            />
                            {showcaseImageUrl ? (
                              <div className="flex items-center gap-3">
                                <img src={showcaseImageUrl} className="w-12 h-12 rounded object-cover border" alt="preview" />
                                <div className="text-left">
                                  <span className="text-xs font-mono font-bold text-emerald-600">Image Loaded Successfully!</span>
                                  <span className="block text-[9px] text-slate-400">Click or drop a different file to replace.</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-5 h-5 text-slate-400 animate-bounce" />
                                <span className="text-[11px] font-bold text-slate-700">Drag high-resolution image file here</span>
                                <span className="text-[9px] text-slate-400">JPEG, PNG or SVG formats up to 4MB</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-slate-400">DIRECT INSTAGRAM / FIGMA / PORTFOLIO IMAGE URL (FALLBACK)</label>
                          <input
                            type="text"
                            value={showcaseImageUrl}
                            onChange={(e) => setShowcaseImageUrl(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-slate-400">PROTOTYPE SHOWCASE / FIGMA LIVE LINK</label>
                          <input
                            type="text"
                            value={showcaseLiveUrl}
                            onChange={(e) => setShowcaseLiveUrl(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                            placeholder="https://figma.com/file/..."
                          />
                        </div>
                      </div>
                    )}

                    {showcaseCategory === 'CP' && (
                      <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl">
                        <div className="text-[10px] font-mono font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> [ COMPETITIVE PROGRAMMING STATS-CARD SYNC ]
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">ALGORITHMIC LEAGUE</label>
                            <select
                              value={showcaseCpPlatform}
                              onChange={(e) => setShowcaseCpPlatform(e.target.value as any)}
                              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none"
                            >
                              <option value="Codeforces">Codeforces</option>
                              <option value="CodeChef">CodeChef</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">USER HANDLE (e.g. tourist)</label>
                            <input
                              type="text"
                              value={showcaseCpHandle}
                              onChange={(e) => {
                                setShowcaseCpHandle(e.target.value);
                                setCpFetchStatus('idle');
                              }}
                              className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                              placeholder="tourist"
                            />
                          </div>
                        </div>

                        {showcaseCpPlatform === 'Codeforces' && (
                          <div className="space-y-1.5">
                            <button
                              type="button"
                              onClick={handleSyncCodeforces}
                              disabled={cpFetchLoading}
                              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 border-2 border-slate-900 rounded-xl py-2 text-[10px] font-mono font-bold shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
                            >
                              {cpFetchLoading ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                  <span>Querying Codeforces Ledger API...</span>
                                </>
                              ) : (
                                <>
                                  <Trophy className="w-3.5 h-3.5 text-slate-900" /> [ Pull Codeforces Rating Instantly ]
                                </>
                              )}
                            </button>
                            
                            {/* Status notification */}
                            {cpFetchStatus === 'success' && (
                              <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded-xl text-[10px] font-mono border border-emerald-200 flex items-center justify-between">
                                <span>✓ API verified. Active Rating synced as: <strong>{showcaseCpRating}</strong> [{showcaseCpRank}]</span>
                                <span className="bg-emerald-200 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded text-[9px]">LIVE</span>
                              </div>
                            )}
                            {cpFetchStatus === 'error' && (
                              <div className="bg-red-50 text-red-850 px-3 py-2 rounded-xl text-[10px] font-mono border border-red-200">
                                ⚠ Sync failed: {cpFetchError}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-slate-100">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">RATING SCORE (MANUAL / LIVE)</label>
                            <input
                              type="number"
                              value={showcaseCpRating}
                              onChange={(e) => setShowcaseCpRating(Number(e.target.value))}
                              className="w-full text-xs font-medium text-[#D0674B] bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none font-mono font-bold"
                              placeholder="1500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">RANK TIER (MANUAL / LIVE)</label>
                            <input
                              type="text"
                              value={showcaseCpRank}
                              onChange={(e) => setShowcaseCpRank(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 outline-none font-mono"
                              placeholder="e.g., Master"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {showcaseCategory === 'Hackathon' && (
                      <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl">
                        <div className="text-[10px] font-mono font-bold text-slate-850 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-purple-600" /> [ EVENT & HACKATHON DELIVERABLES ]
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-slate-400">PROJECT DEMO VIDEO LINK (YOUTUBE/VIC/LOOM)</label>
                          <input
                            type="text"
                            value={showcaseDemoVideo}
                            onChange={(e) => setShowcaseDemoVideo(e.target.value)}
                            className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">DOCUMENTATION LINK</label>
                            <input
                              type="text"
                              value={showcaseDocLink}
                              onChange={(e) => setShowcaseDocLink(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                              placeholder="e.g. GitBook or Slideshow link"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] font-mono font-bold text-slate-400">Blueprints Repository URL (Optional)</label>
                            <input
                              type="text"
                              value={showcaseGithubUrl}
                              onChange={(e) => setShowcaseGithubUrl(e.target.value)}
                              className="w-full text-xs font-medium text-slate-800 bg-[#F7F8F0]/50 border border-slate-300 rounded-xl px-3 py-2 outline-none focus:bg-white"
                              placeholder="e.g., https://github.org/..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal footer actions */}
                  <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsAddShowcaseOpen(false)}
                      className="px-4 py-2 text-xs font-mono border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      [ Cancel ]
                    </button>
                    <button
                      type="button"
                      onClick={handleAddShowcaseItem}
                      className="px-5 py-2 text-xs font-mono bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer text-yellow-300"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      [ Broadcast Showcase ]
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </main>

        {/* Custom footer design inside dashboard */}
        <footer className="bg-slate-950 text-slate-500 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono mt-auto border-t border-slate-900">
          <span>COSMIC SHARD WORKSPACE ID: 0x98A7F</span>
          <span>TalentHub.BD v2.6 • Active Session Verified Encryption TLSv1.3</span>
        </footer>

      </div>

      {/* 4. SLEEK PROFILE SLIDE-OVER PANEL */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 z-50 backdrop-blur-sm"
              onClick={() => {
                if (!isSaving) {
                  setIsProfileOpen(false);
                  setIsEditing(false);
                }
              }}
            />

            {/* Slide-out Panel container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F7F8F0] border-l-2 border-[#355872]/20 shadow-2xl z-50 overflow-hidden flex flex-col font-sans"
            >
              {/* Header block with Logo color accents */}
              <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center bg-gradient-to-r from-white via-[#FECE2F]/5 to-[#D0674B]/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border-2 border-[#FECE2F] flex items-center justify-center text-white text-xs font-serif italic">
                    TH
                  </div>
                  <div>
                    <h2 className="font-display font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      Identity Profile <span className="text-[9px] font-mono bg-blue-100 text-[#355872] px-1.5 py-0.5 rounded-full uppercase border border-blue-200">Sync Node</span>
                    </h2>
                    <p className="text-[10px] font-mono text-slate-400">Manage digital talent mesh parameters</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isSaving) {
                      setIsProfileOpen(false);
                      setIsEditing(false);
                    }
                  }}
                  disabled={isSaving}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  id="profile-close-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Background saving status band */}
              {isSaving && (
                <div className="bg-[#FECE2F] text-slate-900 px-4 py-2 text-[10px] font-mono flex items-center gap-2 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping shrink-0" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* Main Profile Fields Form Block */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* READ-ONLY & ACTIVE FORM WRAPPER */}
                <div className="space-y-6">

                  {/* PROFILE PICTURE DRAG-DROP & PREVIEW */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">[ Profile Picture Node ]</label>
                    
                    {!isEditing ? (
                      // Read Only Avatar view
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl">
                        <img 
                          src={profileAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={profileName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shrink-0 select-none shadow-sm"
                        />
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-600 uppercase block bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full w-max text-[9px]">
                            [ Status: Read-Only ]
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 mt-1 block">Click "Edit Profile" to modify files</span>
                        </div>
                      </div>
                    ) : (
                      // Interactive Drag and Drop Upload View
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('avatar-file-input')?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 relative ${
                          dragActive 
                            ? 'border-[#D0674B] bg-[#FECE2F]/10' 
                            : 'border-slate-300 hover:border-[#355872] bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="file" 
                          id="avatar-file-input" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileInput}
                        />
                        
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <img 
                              src={profileAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                              alt="Upload preview"
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                            />
                            <div className="absolute -bottom-1 -right-1 p-1 bg-[#D0674B] text-white rounded-full border border-white">
                              <Sparkles className="w-2.5 h-2.5" />
                            </div>
                          </div>
                          
                          <div className="text-xs font-semibold text-slate-700">
                            {dragActive ? "Drop image file here..." : "Drag image here or click to upload"}
                          </div>
                          <p className="text-[9px] font-mono text-slate-400">JPEG, PNG or WEBP formats up to 4MB</p>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ACADEMIC & PROFESSIONAL INFO SECTION */}
                  <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <GraduationCap className="w-4 h-4 text-[#355872]" />
                      <span className="text-[11px] font-mono font-bold tracking-wider text-slate-800 uppercase">Academic Reference</span>
                    </div>

                    {/* University Name */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">INSTITUTION_NAME</label>
                      {!isEditing ? (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {profileUniversity || 'N/A'}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={profileUniversity}
                          onChange={(e) => setProfileUniversity(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="e.g. BUET, CUET, SUST, Dhaka University"
                        />
                      )}
                    </div>

                    {/* Enrollment Year */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">ENROLLMENT_YEAR</label>
                      {!isEditing ? (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {profileEnrollmentYear || 'N/A'}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={profileEnrollmentYear}
                          onChange={(e) => setProfileEnrollmentYear(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="e.g. 2022, 2023, 2024"
                        />
                      )}
                    </div>
                  </div>


                  {/* CONTACT & BIOGRAPHY SECTION */}
                  <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <Activity className="w-4 h-4 text-[#D0674B]" />
                      <span className="text-[11px] font-mono font-bold tracking-wider text-slate-800 uppercase">Contact & Biography</span>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">NODE_IDENTITY_NAME</label>
                      {!isEditing ? (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {profileName}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="Zareen Subah"
                        />
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">PHONE_NUMBER</label>
                      {!isEditing ? (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {profilePhone || 'Not Configured'}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="e.g. +8801700000000"
                        />
                      )}
                    </div>

                    {/* Physical Address */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">PHYSICAL_ADDRESS</label>
                      {!isEditing ? (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {profileAddress || 'Not Configured'}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="e.g. Banani, Dhaka"
                        />
                      )}
                    </div>

                    {/* Bio Paragraph */}
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-400 tracking-wider">GRID_BIOGRAPHY</label>
                      {!isEditing ? (
                        <p className="text-xs font-normal text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed select-text">
                          {profileBio || 'No active biography set. Click edit to add descriptions.'}
                        </p>
                      ) : (
                        <textarea 
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          rows={3}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors resize-none"
                          placeholder="Briefly describe your focus areas, interests or global development goals..."
                        />
                      )}
                    </div>
                  </div>


                  {/* TECH SKILLS TAG-INPUT DYNAMIC SYSTEM */}
                  <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-800 uppercase">Core Skills Map</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {profileSkills.length} Assets
                      </span>
                    </div>

                    {/* Skills rendering */}
                    <div className="flex flex-wrap gap-1.5">
                      {profileSkills.length === 0 ? (
                        <span className="text-[10px] font-mono text-slate-400 italic">No skills registered on node ledger.</span>
                      ) : (
                        profileSkills.map((skill, index) => (
                          <span 
                            key={`${skill}-${index}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg bg-[#FECE2F]/15 text-[#D0674B] border border-[#FECE2F]/40 select-none shadow-sm"
                          >
                            <span>#{skill}</span>
                            {isEditing && (
                              <button 
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="w-3.5 h-3.5 rounded-full hover:bg-[#D0674B]/20 text-[#D0674B] flex items-center justify-center font-bold text-xs cursor-pointer"
                                title={`Remove ${skill}`}
                              >
                                &times;
                              </button>
                            )}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Tag add input */}
                    {isEditing && (
                      <div className="space-y-1 pt-1">
                        <input 
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 focus:border-[#D0674B] focus:ring-1 focus:ring-[#D0674B] rounded-xl px-3 py-2 outline-none transition-colors"
                          placeholder="Type a skill (e.g. React, GO) & press Enter"
                        />
                        <span className="block text-[8px] font-mono text-slate-400 font-semibold">[ PRESS_ENTER TO MAP AS REGISTRY_TAG ]</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Drawer Action Bar */}
              <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
                {!isEditing ? (
                  // Display State Actions
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsProfileOpen(false)}
                      className="px-4 py-2 text-xs font-mono border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl transition-all font-bold cursor-pointer"
                    >
                      [ Close Panel ]
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-xs font-mono bg-[#355872] hover:bg-[#355872]/90 text-white rounded-xl transition-all font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                      id="edit-profile-action"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      [ Edit Identity ]
                    </button>
                  </>
                ) : (
                  // Active Editing State Actions
                  <>
                    <button 
                      type="button"
                      onClick={handleCancelProfile}
                      disabled={isSaving}
                      className="px-4 py-2 text-xs font-mono border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition-all font-bold disabled:opacity-50 cursor-pointer"
                      id="cancel-profile-action"
                    >
                      [ Cancel changes ]
                    </button>
                    
                    <button 
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-5 py-2 text-xs font-mono bg-[#D0674B] hover:bg-[#D0674B]/90 text-white rounded-xl transition-all font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      id="save-profile-action"
                    >
                      {isSaving ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>[ Syncing... ]</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-green-300 animate-bounce" />
                          <span>[ Commit Changes ]</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
