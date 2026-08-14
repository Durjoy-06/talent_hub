import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SendOfferButton } from './SendOfferButton';
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
  UserCheck,
  Github,
  Linkedin,
  ExternalLink,
  Trophy,
  Eye,
  Award,
  Play,
  Tv,
  X
} from 'lucide-react';
import { LoggedInUser, Opportunity, EventHub, Application, Talent } from '../types';

interface OrganizerDashboardProps {
  user: LoggedInUser;
  onLogout: () => void;
  opportunities: Opportunity[];
  events: EventHub[];
  applications: Application[];
  talents: Talent[];
  onChangeApplicationStatus: (appId: string, newStatus: Application['status']) => void;
  onAddOpportunity: (newOpp: Opportunity) => void;
  onAddEvent: (newEvent: EventHub) => void;
  onDeleteOpportunity: (oppId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  requestedTab?: 'command' | 'applicants' | 'postings' | 'publish' | 'brand';
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export default function OrganizerDashboard({
  user,
  onLogout,
  opportunities,
  events,
  applications,
  talents,
  onChangeApplicationStatus,
  onAddOpportunity,
  onAddEvent,
  onDeleteOpportunity,
  onDeleteEvent,
  requestedTab,
  onOpenNotifications,
  unreadCount = 0
}: OrganizerDashboardProps) {

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'command' | 'applicants' | 'postings' | 'publish' | 'brand'>('command');

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);
  const [currentUtc, setCurrentUtc] = useState<string>('06:58:27');
  
  // Dialog state for applicant spotlight evaluation
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  
  // Analytics counter trigger
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [activeAdNode, setActiveAdNode] = useState<number>(0);

  // Organization Identity Suite state
  const [orgId, setOrgId] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [orgWebsite, setOrgWebsite] = useState<string>('');
  const [orgLocation, setOrgLocation] = useState<string>('');
  const [orgBio, setOrgBio] = useState<string>('');
  const [orgLogoUrl, setOrgLogoUrl] = useState<string>('');
  const [orgBannerUrl, setOrgBannerUrl] = useState<string>('');
  const [orgDeactivated, setOrgDeactivated] = useState<boolean>(false);

  // Status/Validation and Feedback UI
  const [isSavingOrg, setIsSavingOrg] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [orgToast, setOrgToast] = useState<{ message: string; show: boolean } | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState<boolean>(false);

  // Crop controls
  const [logoZoom, setLogoZoom] = useState<number>(1);
  const [logoCropShape, setLogoCropShape] = useState<'circle' | 'square'>('circle');

  // Premium Preset Assets
  const LOGO_PRESETS = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop", // Teal Node
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&h=150&fit=crop", // AI Core
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&h=150&fit=crop", // Executive Slate
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop", // Modern Office Icon
  ];

  const BANNER_PRESETS = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=300&fit=crop", // Workspace
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=300&fit=crop", // Vector Cyber Space
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=300&fit=crop", // Abstract Tech Node
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop", // Cosmic Network
  ];

  // Load organization details from API on mount
  useEffect(() => {
    if (user && user.id) {
      fetch(apiUrl(`/api/organizations?owner_id=${user.id}`))
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.organization) {
            const org = data.organization;
            setOrgId(org.id);
            setOrgName(org.org_name);
            setOppOrg(org.org_name);
            setEventOrganizer(org.org_name);
            setOrgWebsite(org.website_url);
            setOrgLocation(org.location);
            setOrgBio(org.bio);
            setOrgLogoUrl(org.logo_url);
            setOrgBannerUrl(org.banner_url);
            setOrgDeactivated(org.deactivated);
          } else {
            // Unsaved brand state - prefill defaults using user metadata
            const defaultName = user.name + ' Foundation';
            setOrgName(defaultName);
            setOppOrg(defaultName);
            setEventOrganizer(defaultName);
            setOrgLocation(user.division + ', Bangladesh');
            setOrgWebsite('https://' + user.name.toLowerCase().replace(/\s/g, '') + '.org');
            setOrgBio('Advancing technology networks and fostering exceptional young developer talent across regional clusters.');
            setOrgLogoUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop');
            setOrgBannerUrl('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=300&fit=crop');
          }
        })
        .catch(err => {
          console.warn("Error fetching organization profile:", err);
        });
    }
  }, [user]);

  const saveOrganizationToSupabase = async (payload: any) => {
    try {
      const { getSupabaseClient } = await import('../lib/supabase');
      const supabase = getSupabaseClient() as any;
      if (supabase) {
        console.log("Supabase Connection Live - Syncing Organization state...");
        const { error } = await supabase
          .from('organizations')
          .upsert({
            id: payload.id,
            owner_id: payload.owner_id,
            org_name: payload.org_name,
            bio: payload.bio,
            location: payload.location,
            logo_url: payload.logo_url,
            banner_url: payload.banner_url,
            website_url: payload.website_url,
            updated_at: new Date().toISOString()
          }, { onConflict: 'owner_id' });
        
        if (error) {
          console.error("Supabase organization synchronization failed: ", error);
        } else {
          console.log("Supabase synchronization completed successfully.");
        }
      }
    } catch (err) {
      console.warn("Supabase database dynamic sync offline:", err);
    }
  };

  const validateWebsiteUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (_) {
      const regex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\/?/;
      return regex.test(url);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setValidationError(`Failed: File exceeds maximum size limits (Max: 2MB). Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setValidationError('Failed: Unsupported image format. Only JPEG and PNG images are permitted.');
      return;
    }

    setValidationError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        if (type === 'logo') {
          setOrgLogoUrl(event.target.result as string);
        } else {
          setOrgBannerUrl(event.target.result as string);
        }
        setOrgToast({ message: `Successfully loaded new ${type} asset!`, show: true });
        setTimeout(() => setOrgToast(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveOrganizationBrand = async () => {
    if (!orgName.trim()) {
      setValidationError('Profile Validation Failed: An organization or club name is required.');
      return;
    }

    if (orgWebsite && !validateWebsiteUrl(orgWebsite)) {
      setValidationError('Profile Validation Failed: The website URL format is invalid. Ensure it begins with http/https or is a valid domain.');
      return;
    }

    if (orgBio.length > 250) {
      setValidationError(`Profile Validation Failed: Bio is ${orgBio.length} characters long. Character limit is 250.`);
      return;
    }

    setValidationError('');
    setIsSavingOrg(true);

    const payload = {
      id: orgId || 'org-' + Math.random().toString(36).substring(4),
      owner_id: user.id,
      org_name: orgName,
      bio: orgBio,
      location: orgLocation,
      logo_url: orgLogoUrl,
      banner_url: orgBannerUrl,
      website_url: orgWebsite
    };

    setOrgToast({ message: `Successfully saved organization changes! Your profile node is active.`, show: true });
    setOrgDeactivated(false);
    setOppOrg(orgName);
    setEventOrganizer(orgName);
    setTimeout(() => {
      setOrgToast(prev => prev ? { ...prev, show: false } : null);
    }, 4500);

    try {
      const response = await fetch(apiUrl('/api/organizations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.id
        },
        body: JSON.stringify(payload)
      });
      
      const resData = await response.json();
      if (resData && resData.success) {
        if (resData.organization) {
          setOrgId(resData.organization.id);
        }
        await saveOrganizationToSupabase(payload);
      } else {
        setValidationError(resData.error || 'Failed to securely sync identity to the database.');
      }
    } catch (err: any) {
      console.warn("Offline fallback sync active. Storing registry details locally:", err);
    } finally {
      setIsSavingOrg(false);
    }
  };

  const handleDeactivateOrganizationConfirmed = async () => {
    setShowDeactivateDialog(false);
    try {
      const response = await fetch(apiUrl('/api/organizations/deactivate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.id
        },
        body: JSON.stringify({ owner_id: user.id })
      });
      const data = await response.json();
      if (data && data.success) {
        setOrgDeactivated(true);
        setOrgToast({ message: "Organization public-facing directory deactivated successfully.", show: true });
        setTimeout(() => setOrgToast(null), 3500);
      } else {
        setValidationError(data.error || 'Security error: Failed to deactivate page elements.');
      }
    } catch (err) {
      console.warn("Database offline. Acting on optimistic deactivation cascade...", err);
      setOrgDeactivated(true);
    }
  };

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

  const handleViewApplicantProfile = (app: Application) => {
    // Attempt matching by studentId first, then by name
    const matched = talents.find(t => t.id === app.studentId || t.name.toLowerCase() === app.studentName.toLowerCase());
    if (matched) {
      setSelectedTalent(matched);
    } else {
      // Fallback profile container
      setSelectedTalent({
        id: app.studentId || 'generated_' + Math.random(),
        name: app.studentName,
        role: 'Technical Applicant',
        university: app.studentUniversity || 'Bangladesh University',
        division: app.studentDivision || 'Dhaka',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        bio: 'Dedicated student builder. Champion of sustainable technology ecosystems across regional hubs.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        connections: 180,
        views: 390,
        lookingFor: 'Seeking engineering opportunities with dynamic growth trajectories.',
        featured: false,
        showcases: [
          {
            id: 'sc-generated-1',
            category: 'Dev',
            title: app.opportunityTitle + ' Walkthrough',
            description: 'Core submission for the role at ' + app.organization + '. Fully functional dashboard with responsive routing framework and persistence adapters.',
            language: 'TypeScript'
          }
        ]
      });
    }
  };

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

            <button
              onClick={() => setActiveTab('brand')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === 'brand' 
                  ? 'bg-orange-700 text-white shadow-sm' 
                  : 'hover:bg-slate-900 hover:text-slate-200'
              }`}
              id="org-nav-brand-btn"
            >
              <Building className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span>[ Brand Identity ]</span>}
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
                  <div className="lg:col-span-8 bg-white border border-slate-200 p-4 sm:p-6 rounded-3xl text-left relative overflow-hidden shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                      <div className="space-y-0.5 min-w-0">
                        <span className="block text-[9px] font-mono text-[#7AAACE] uppercase tracking-wider font-bold">// SYSTEM METRIC DYNAMICS</span>
                        <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-orange-600 shrink-0" /> Platform Registrations & Engagement Curve
                        </h3>
                      </div>
                      <span className="self-start sm:self-auto text-[10px] font-mono text-slate-400 bg-slate-50 border px-2.5 py-1 rounded-lg whitespace-nowrap">LAST 7 CYCLES</span>
                    </div>

                    {/* Responsive SVG Curve Chart — auto-resizes via ResizeObserver */}
                    <ResponsiveTrendChart />

                    {/* Chart Labels bar */}
                    <div className="grid grid-cols-7 items-center text-[9px] sm:text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4 mt-2 gap-1 text-center">
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
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3.5 pt-3 border-t border-slate-100">
                              <span className="text-[10px] font-mono text-slate-400">Profile Email: {app.studentEmail}</span>
                              <span className="text-[10px] font-mono text-slate-400">•</span>
                              <span className="text-[10px] font-mono text-slate-400">Form Ref: {app.id}</span>
                              <button
                                onClick={() => handleViewApplicantProfile(app)}
                                className="md:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#355872] text-white hover:bg-[#2c495f] rounded-lg text-[10.5px] font-mono font-bold transition-all hover:shadow-[3px_3px_0px_0px_rgba(53,88,114,0.15)] cursor-pointer"
                                id={`view-profile-btn-${app.id}`}
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                View Profile & Showcases
                              </button>
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
                              <SendOfferButton
                                registrationId={app.id}
                                onSuccess={(id) => {
                                  onChangeApplicationStatus(id, 'Offer Received');
                                }}
                                onError={(err) => {
                                  console.error('SendOfferButton failed:', err);
                                }}
                              />
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

            {activeTab === 'brand' && (
              <motion.div
                key="brand_identity_suite"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Dashboard Toast Alert Portal for Org Brand updates */}
                <AnimatePresence>
                  {orgToast && orgToast.show && (
                    <motion.div
                      initial={{ opacity: 0, y: 60, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.95 }}
                      className="fixed bottom-8 right-8 z-[100] bg-slate-900 border border-slate-800 text-[#F7F8F0] px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-sans max-w-sm select-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-orange-400 font-bold block tracking-wider uppercase">[ BRAND_SYNCED ]</span>
                        <p className="text-xs font-light text-slate-100 leading-snug">{orgToast.message}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub-header Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-slate-200 gap-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-orange-700 uppercase font-semibold">[ BRAND GATEWAY SYSTEM ]</span>
                    <h2 className="font-display text-2xl font-black text-slate-800">Organization Identity Suite</h2>
                    <p className="text-xs text-slate-500 font-light mt-0.5 font-sans">Maintain professional presence, design credentials, and manage community portals.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Public profile button */}
                    <button
                      onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
                      className="px-4.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-mono font-bold text-xs hover:border-slate-800 hover:text-slate-900 transition-colors flex items-center gap-2 bg-white"
                      id="toggle-preview-mode-btn"
                    >
                      {previewMode === 'edit' ? (
                        <>
                          <Eye className="w-4 h-4 text-orange-700" /> [ View Public Presets ]
                        </>
                      ) : (
                        <>
                          <Sliders className="w-4 h-4 text-slate-500" /> [ Back to Config ]
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {orgDeactivated && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex gap-3 items-center">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <div className="text-xs font-sans">
                      <span className="font-bold">Notice:</span> This node's public-facing directory portal is deactivated. Students will not see your registry block until you press update and save changes again.
                    </div>
                  </div>
                )}

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
                  
                  {/* CONFIG FORM: LEFT 7 COLS (or Full if previewOnly) */}
                  <div className={`space-y-6 ${previewMode === 'preview' ? 'hidden' : 'lg:col-span-7'}`}>
                    
                    {/* Identity Branding Section */}
                    <div className="bg-white border rounded-3xl p-6 border-slate-205 shadow-sm space-y-4">
                      <h3 className="font-display font-extrabold text-xs text-slate-800 flex items-center gap-2 border-b pb-2 uppercase tracking-wide">
                        <ShieldCheck className="w-4.5 h-4.5 text-orange-700" /> Core BRANDING parameters
                      </h3>

                      {validationError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-mono">
                          {validationError}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">ORGANIZATION / CLUB NAME *</label>
                          <input 
                            type="text" 
                            value={orgName} 
                            onChange={(e) => {
                              if(e.target.value.length <= 80) setOrgName(e.target.value);
                            }}
                            placeholder="e.g. BUET Computer Club"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none font-sans"
                            required
                            id="field-org-name"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400">OFFICIAL WEBSITE URL</label>
                            <input 
                              type="text" 
                              value={orgWebsite} 
                              onChange={(e) => setOrgWebsite(e.target.value)}
                              placeholder="e.g. https://buetcomputerclub.org"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none font-sans"
                              id="field-org-website"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400">PHYSICAL LOCATION</label>
                            <input 
                              type="text" 
                              value={orgLocation} 
                              onChange={(e) => setOrgLocation(e.target.value)}
                              placeholder="e.g. Dhaka, Bangladesh"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none font-sans"
                              id="field-org-location"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-mono font-bold text-slate-400">BIO & MISSION STATEMENT (character limit 250)</label>
                            <span className={`text-[9px] font-mono font-bold ${orgBio.length > 250 ? 'text-red-500' : 'text-slate-400'}`}>
                              {orgBio.length}/250
                            </span>
                          </div>
                          <textarea 
                            rows={3}
                            value={orgBio} 
                            onChange={(e) => {
                              if (e.target.value.length <= 300) {
                                setOrgBio(e.target.value);
                              }
                            }}
                            placeholder="Present your organization mission, priorities and regional developer hub engagements..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-orange-600 focus:outline-none resize-none font-sans"
                            id="field-org-bio"
                          />
                        </div>
                      </div>
                    </div>

                    {/* TWO-TIER MEDIA ASSETS */}
                    <div className="bg-white border rounded-3xl p-6 border-slate-205 shadow-sm space-y-6">
                      <h3 className="font-display font-extrabold text-xs text-slate-800 flex items-center gap-2 border-b pb-2 uppercase tracking-wide">
                        <Activity className="w-4.5 h-4.5 text-orange-700" /> Media Asset Management
                      </h3>

                      {/* Tier 1: Cover Banner */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block">[ 1. COVER BANNER ]</span>
                          <span className="text-[9px] font-mono text-slate-400">Recommended: 800×300 (Max 2MB)</span>
                        </div>

                        {/* Interactive Drag & Drop Box */}
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50/50 transition-colors relative group">
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => handleImageFileChange(e, 'banner')}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            id="input-org-banner"
                          />
                          <div className="space-y-2 pointer-events-none">
                            <span className="px-3 py-1 bg-orange-50 text-orange-850 font-mono text-[9px] rounded-lg font-bold inline-block">
                              Choose high-res banner block
                            </span>
                            <p className="text-[10px] text-slate-400 font-light font-sans">Drag banner here or click to upload (PNG/JPEG under 2MB)</p>
                          </div>
                        </div>

                        {/* Quick preset banners */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono font-black text-slate-400 uppercase">[ Preset Banners ]</p>
                          <div className="grid grid-cols-4 gap-2">
                            {BANNER_PRESETS.map((bp, idx) => (
                              <button
                                key={idx}
                                onClick={() => setOrgBannerUrl(bp)}
                                className={`h-11 rounded-lg border-2 overflow-hidden transition-all ${orgBannerUrl === bp ? 'border-orange-600 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-800'}`}
                              >
                                <img src={bp} alt="Banner preset" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tier 2: Profile Logo Avatar with visual crop shapes */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase block">[ 2. PROFILE AVATAR & CROP ]</span>
                          <span className="text-[9px] font-mono text-slate-400">Ratio: 1:1 Square (Max 2MB)</span>
                        </div>

                        {/* Interactive upload drag drop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50/50 transition-colors relative">
                            <input 
                              type="file" 
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => handleImageFileChange(e, 'logo')}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              id="input-org-logo"
                            />
                            <div className="space-y-2 pointer-events-none">
                              <span className="px-3 py-1 bg-orange-50 text-orange-850 font-mono text-[9px] rounded-lg font-bold inline-block">
                                Choose logo image
                              </span>
                              <p className="text-[10px] text-slate-400 font-sans">Click to import logo file</p>
                            </div>
                          </div>

                          {/* Quick preset logos */}
                          <div className="space-y-1.5 text-left">
                            <p className="text-[9px] font-mono font-black text-slate-400 uppercase">[ Preset Logos ]</p>
                            <div className="flex gap-2">
                              {LOGO_PRESETS.map((lp, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setOrgLogoUrl(lp)}
                                  className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition-all ${orgLogoUrl === lp ? 'border-orange-600 scale-95' : 'border-slate-200 hover:border-slate-700'}`}
                                >
                                  <img src={lp} alt="Logo preset" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CROP AND ALIGNMENT CONTROL SHEETS */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-3">
                          <span className="text-[9px] font-mono font-bold text-slate-700 block uppercase">[ Crop Configuration Tool ]</span>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {/* Shape Selector */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono font-bold text-slate-400 block">CROP FOCUS MASK</label>
                              <div className="flex gap-1.5 bg-white p-1 rounded-xl border">
                                <button
                                  type="button"
                                  onClick={() => setLogoCropShape('circle')}
                                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold ${logoCropShape === 'circle' ? 'bg-orange-700 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                  Circle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLogoCropShape('square')}
                                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold ${logoCropShape === 'square' ? 'bg-orange-700 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                  Square
                                </button>
                              </div>
                            </div>

                            {/* Scale zoom */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono font-bold text-slate-400 block">ZOOM ALIGNMENT: {logoZoom.toFixed(1)}x</label>
                              <div className="flex items-center gap-2 pt-1 pb-1">
                                <span className="text-[9px] font-mono text-slate-400">-</span>
                                <input 
                                  type="range"
                                  min="0.8"
                                  max="2.5"
                                  step="0.1"
                                  value={logoZoom}
                                  onChange={(e) => setLogoZoom(parseFloat(e.target.value))}
                                  className="w-full accent-orange-700 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-[9px] font-mono text-slate-400">+</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS CONTROLS & DANGER ZONE */}
                    <div className="space-y-6">
                      <div className="bg-white border rounded-3xl p-5 border-slate-205 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="text-left">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-black block">[ REVISION CONTROLLER ]</span>
                          <p className="text-xs font-light text-slate-500 font-sans">Perform an optimistic write to layout nodes, secure database elements.</p>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                          <button
                            onClick={handleSaveOrganizationBrand}
                            disabled={isSavingOrg}
                            className="flex-1 sm:flex-none py-3 px-6 bg-orange-700 hover:bg-orange-850 text-white font-mono text-xs font-bold rounded-xl shadow-[3px_3px_0px_0px_rgba(158,88,56,0.2)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            id="btn-org-brand-save"
                          >
                            {isSavingOrg ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing...
                              </>
                            ) : (
                              <>
                                [ Save Identity Changes ]
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* DANGER ZONE AT BOTTOM */}
                      <div className="bg-red-50/40 border-2 border-red-200/50 rounded-3xl p-6 text-left space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-xl text-red-700 shrink-0">
                            <Trash2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-mono font-bold text-red-800 uppercase">[ Security System Danger Zone ]</h4>
                            <p className="text-xs font-light text-slate-600 mt-0.5 font-sans">
                              Actions performed here bypass standard node filters. Double-verify authentication keys before taking critical steps.
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-red-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5 text-left">
                            <span className="text-xs font-bold text-slate-800 block">Deactivate Public Organization Page</span>
                            <span className="block text-[10px] text-slate-500 font-light font-sans">
                              Temporarily unpublishes your organization profile and archives active opportunity card slates.
                            </span>
                          </div>

                          <button
                            onClick={() => setShowDeactivateDialog(true)}
                            className="bg-red-600 text-white font-mono text-[10px] font-black px-4 py-2.5 rounded-xl hover:bg-red-700 shadow-sm transition-all text-nowrap align-self-start cursor-pointer border border-transparent"
                            id="btn-org-brand-deactivate"
                          >
                            [ Deactivate Organization Page ]
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW: RIGHT 5 COLS (or Full if previewMode === 'preview') */}
                  <div className={`space-y-6 ${previewMode === 'preview' ? 'lg:col-span-12 max-w-3xl mx-auto w-full' : 'lg:col-span-5'}`}>
                    <div className="sticky top-24 space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono tracking-widest text-[#7AAACE] uppercase font-bold">[ INSTANT LIVE PREVIEW ]</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-850 text-[10px] font-mono rounded font-black uppercase tracking-wide">
                          Real-time stream active
                        </span>
                      </div>

                      {/* Actual Mock Public Directory Layout */}
                      <div className="bg-slate-100 border-2 border-slate-200/80 rounded-3xl overflow-hidden shadow-xl transition-all">
                        {/* Cover Image banner */}
                        <div className="h-32 sm:h-40 relative bg-slate-200">
                          {orgBannerUrl ? (
                            <img src={orgBannerUrl} alt="Cover Banner" className="w-full h-full object-cover animate-fade-in" />
                          ) : (
                            <div className="w-full h-full bg-slate-300 animate-pulse flex items-center justify-center text-slate-400 text-xs font-sans">
                              No Cover Banner Image Loaded
                            </div>
                          )}

                          {/* Location Badge */}
                          <div className="absolute top-3 right-3 bg-slate-100/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider border border-slate-250">
                            {orgLocation ? orgLocation : 'Location Node unspecified'}
                          </div>
                        </div>

                        {/* Logo floating container */}
                        <div className="px-6 pb-6 relative">
                          <div className="flex justify-between items-end -translate-y-8 h-10 mb-2">
                            <div className="relative">
                              {orgLogoUrl ? (
                                <div 
                                  className={`w-20 h-20 bg-white border-4 border-slate-100 shadow-md flex items-center justify-center overflow-hidden transition-all ${logoCropShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}`}
                                >
                                  <img 
                                    src={orgLogoUrl} 
                                    alt="Logo Avatar" 
                                    className="object-cover"
                                    style={{
                                      transform: `scale(${logoZoom})`,
                                      width: '100%',
                                      height: '100%'
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-slate-300 rounded-full border-4 border-slate-150 flex items-center justify-center text-slate-500 font-mono text-[9px] uppercase">
                                  No Logo
                                </div>
                              )}
                            </div>

                            {orgWebsite && validateWebsiteUrl(orgWebsite) && (
                              <button 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-700 text-white rounded-lg text-[9px] font-mono font-bold transition-all animate-none"
                              >
                                Website <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Organization details */}
                          <div className="space-y-3 -translate-y-4">
                            <div>
                              <span className="text-[9px] font-mono text-emerald-600 block font-bold tracking-wider uppercase">[ VERIFIED IDENTITY SLATE ]</span>
                              <h3 className="font-display font-black text-lg text-slate-800 tracking-tight">
                                {orgName ? orgName : 'Untitled Organization'}
                              </h3>
                              {orgWebsite && (
                                <span className={`text-[10px] font-mono ${validateWebsiteUrl(orgWebsite) ? 'text-slate-400' : 'text-red-500 font-bold'}`}>
                                  {orgWebsite} {!validateWebsiteUrl(orgWebsite) && ' (Invalid URL Format)'}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 font-light leading-relaxed whitespace-pre-line bg-white/70 backdrop-blur border p-4.5 rounded-2xl block min-h-20 text-left font-sans">
                              {orgBio ? orgBio : 'No organization biography or mission statement has been added yet. Use the Identity Suite forms to tell students what you build.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1 justify-start">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#355872]/8 text-[#355872] rounded">
                                Active Node: {user.division} Cluster
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                                Curator: {user.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Growth Feed Simulation Item */}
                      <div className="bg-[#FAFBF7] border border-slate-200 rounded-3xl p-5 text-left space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">[ Growth Feed Simulator ]</span>
                          <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">● LIVE STREAM</span>
                        </div>
                        
                        <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                              {orgLogoUrl ? (
                                <img src={orgLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                              ) : (
                                <Building className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{orgName || 'Untitled Organization'}</h4>
                              <p className="text-[10px] text-slate-400 font-mono">Posted a new Opportunity • Just now</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-slate-700">Engineering Internship Node</span>
                              <span className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">STIPEND: ৳15,000</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-light line-clamp-2">
                              Join {orgName || 'Your Org'} to build high-performance data grids and synergetic network solutions in {orgLocation || 'Bangladesh'}...
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Auxiliary view public button */}
                      <div className="bg-[#FAFBF7] border border-slate-200 rounded-3xl p-5 text-center space-y-2">
                        <p className="text-[9px] font-mono text-slate-500 font-bold uppercase">[ POST-UPDATE DIRECTORY ACTION ]</p>
                        <button
                          onClick={() => {
                            if (!orgName) {
                              setValidationError('Please specify a valid organization name before running verification checks.');
                              return;
                            }
                            setPreviewMode('preview');
                            setOrgToast({ message: "Loaded full-screen public profile template simulation!", show: true });
                            setTimeout(() => setOrgToast(null), 3500);
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          [ Run Verify Public Profile Preview ]
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* DEACTIVATION TRIGGER DIALOG BOX */}
                <AnimatePresence>
                  {showDeactivateDialog && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDeactivateDialog(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl border p-6 shadow-2xl w-full max-w-md relative z-10 text-slate-800 space-y-4 text-left"
                      >
                        <h4 className="font-display font-black text-lg text-red-700 flex items-center gap-2">
                          ⚠️ [ CONFIRM DEACTIVATION ]
                        </h4>
                        
                        <p className="text-xs text-slate-500 font-light leading-relaxed font-sans">
                          You are about to deactivate the public listing for <strong className="font-bold text-slate-800">"{orgName || 'your organization'}"</strong>. 
                          This action will withdraw your bio, banner indices, and website links from the public student talent pools and searches.
                        </p>

                        <div className="bg-amber-50 rounded-xl p-3 border text-[11px] text-amber-900 leading-normal font-sans">
                          <strong>Note:</strong> Active jobs and academy registration slates remains archived. You can reactivate public directories at any point by configuring and updating your identity suite again.
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            onClick={() => setShowDeactivateDialog(false)}
                            className="px-4 py-2 border rounded-xl text-xs font-mono font-bold hover:bg-slate-50 cursor-pointer"
                          >
                            [ Cancel ]
                          </button>
                          <button
                            onClick={handleDeactivateOrganizationConfirmed}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                          >
                            [ Yes, Deactivate Page ]
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Applicant Spotlight Showcase Profile Modal */}
        <AnimatePresence>
          {selectedTalent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop Blur overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTalent(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(53,88,114,0.18)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col scrollbar-thin text-slate-800"
              >
                {/* Header Visual Stripe-inspired */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={selectedTalent.avatarUrl}
                        alt={selectedTalent.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#355872]/10"
                        referrerPolicy="no-referrer"
                      />
                      {selectedTalent.featured && (
                        <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 text-[8px] border-2 border-white font-bold uppercase animate-pulse">
                          ★
                        </span>
                      )}
                    </div>
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-sans font-black text-lg text-slate-800 leading-tight">
                          {selectedTalent.name}
                        </h4>
                        <span className="text-[9px] font-mono tracking-wider text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">
                          {selectedTalent.division} Node
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#355872] font-semibold">
                        {selectedTalent.role}
                      </p>
                      <p className="text-[11px] text-slate-400 font-light flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-300" />
                        {selectedTalent.university}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTalent(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close Profile"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 text-left">
                  {/* About & Seeking section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-2">
                      <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
                        [ Candidate Bio-metric ]
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {selectedTalent.bio}
                      </p>
                    </div>
                    <div className="space-y-2 col-span-1 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100 pt-4 md:pt-0">
                      <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
                        [ Dynamic Engagement ]
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                          <span className="text-slate-400 text-[10px] block">Views</span>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {selectedTalent.views || 45}
                          </span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                          <span className="text-slate-400 text-[10px] block">Connects</span>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {selectedTalent.connections || 12}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seeking objective */}
                  {selectedTalent.lookingFor && (
                    <div className="bg-slate-50/55 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                      <span className="text-[9px] font-mono text-[#355872] font-bold block uppercase tracking-wider">
                        Target Placement Objective
                      </span>
                      <p className="text-xs text-slate-600 font-light leading-relaxed">
                        {selectedTalent.lookingFor}
                      </p>
                    </div>
                  )}

                  {/* Technical Competencies Skills */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
                      Core Verified Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTalent.skills.map((skill, si) => (
                        <span
                          key={si}
                          className="text-[10px] font-mono text-[#355872] bg-[#355872]/5 px-2 py-1 rounded-lg border border-[#355872]/15 hover:border-[#355872]/40 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolios and Showcases Sub-section */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase tracking-wider">
                        Showcase Portfolio Ledger
                      </span>
                      <span className="h-px bg-slate-100 flex-1" />
                    </div>

                    {!selectedTalent.showcases || selectedTalent.showcases.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No project showcase details published for this node.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedTalent.showcases.map((sc) => (
                          <div
                            key={sc.id}
                            className="border border-[#355872]/10 bg-white rounded-2xl p-5 shadow-sm space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border tracking-tight ${
                                  sc.category === 'Dev' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  sc.category === 'Design' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                  sc.category === 'CP' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                  'bg-purple-50 text-purple-700 border-purple-200'
                                }`}
                              >
                                {sc.category} Showcase Link 
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">Status: Verified</span>
                            </div>

                            <div className="space-y-1">
                              <h5 className="font-sans font-black text-sm text-slate-800">
                                {sc.title}
                              </h5>
                              <p className="text-xs text-slate-500 font-light leading-relaxed">
                                {sc.description}
                              </p>
                            </div>

                            {/* Specific Showcase Morph Data Panels */}
                            {sc.category === 'Dev' && (
                              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 space-y-2.5 text-[10.5px] font-mono">
                                {sc.language && (
                                  <div className="flex justify-between items-center text-slate-800">
                                    <span className="text-slate-400">ACTIVE STACK</span>
                                    <span className="font-bold text-[#355872] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                      {sc.language}
                                    </span>
                                  </div>
                                )}
                                <div className="flex gap-4 pt-1.5 border-t border-dashed border-slate-200/60">
                                  {sc.githubUrl && (
                                    <a
                                      href={sc.githubUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 text-slate-600 hover:text-[#355872] underline font-bold"
                                    >
                                      <Github className="w-3.5 h-3.5" /> Code Repo
                                    </a>
                                  )}
                                  {sc.liveUrl && (
                                    <a
                                      href={sc.liveUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 text-slate-600 hover:text-[#355872] underline font-bold ml-auto"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {sc.category === 'Design' && (
                              <div className="space-y-3">
                                {sc.imageUrl && (
                                  <div className="rounded-xl overflow-hidden aspect-video border bg-slate-50">
                                    <img
                                      src={sc.imageUrl}
                                      alt={sc.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                                {sc.liveUrl && (
                                  <a
                                    href={sc.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-800 text-[11px] font-mono font-bold hover:underline"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Showcase Figma Presentation Draft
                                  </a>
                                )}
                              </div>
                            )}

                            {sc.category === 'CP' && (
                              <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-3.5 mt-1 relative overflow-hidden text-slate-800">
                                <Trophy className="absolute right-2 bottom-2 w-12 h-12 text-amber-500/10" />
                                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                  <div>
                                    <span className="text-[8px] text-slate-400 block font-bold uppercase leading-none mb-1">
                                      Platform HANDLE
                                    </span>
                                    <span className="font-extrabold text-slate-800">{sc.cpHandle}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[8px] text-slate-400 block font-bold uppercase leading-none mb-1">
                                      Global rating
                                    </span>
                                    <span className="font-black text-amber-800">{sc.cpRating || 2400} pts</span>
                                  </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-dashed border-amber-500/15 flex items-center justify-between">
                                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                    ★ {sc.cpRank || 'Grandmaster'}
                                  </span>
                                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live API Checked
                                  </span>
                                </div>
                              </div>
                            )}

                            {sc.category === 'Hackathon' && (
                              <div className="bg-purple-50/70 border border-purple-150 rounded-xl p-3 text-xs font-mono text-slate-800">
                                <div className="flex items-center gap-1.5 text-purple-800 font-bold mb-2">
                                  <Tv className="w-4 h-4 text-purple-700" /> Demo Pitch Video Deck
                                </div>
                                <div className="flex gap-4 pt-2 border-t border-dashed border-purple-200 mt-1">
                                  {sc.demoVideo && (
                                    <a
                                      href={sc.demoVideo}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-bold hover:underline"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-purple-700 stroke-none" /> Play Walkthrough Walk
                                    </a>
                                  )}
                                  {sc.docLink && (
                                    <a
                                      href={sc.docLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-bold hover:underline ml-auto"
                                    >
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

                  {/* Direct Outreach link buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100 flex-wrap">
                    {selectedTalent.github && (
                      <a
                        href={selectedTalent.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#355872] hover:bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub Profile
                      </a>
                    )}
                    {selectedTalent.linkedin && (
                      <a
                        href={selectedTalent.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#355872] hover:bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700"
                      >
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                      </a>
                    )}
                    <button
                      onClick={() => {
                        alert(`Direct recruitment evaluation notes logged! Interview proposal dispatched via Graph Relay to ${selectedTalent.name}.`);
                      }}
                      className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-orange-700 hover:bg-orange-850 text-white rounded-xl text-xs font-mono font-bold shadow-md transition-all cursor-pointer"
                    >
                      Direct Interview Offer
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Console footer */}
        <footer className="bg-slate-950 text-slate-500 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono mt-auto border-t border-slate-900">
          <span>ROOT LEVEL AUTHENTICATED SYSTEM OPERATING ID: admin_master</span>
          <span>TalentHub.BD v2.6 • Operational Node Integrity Checked</span>
        </footer>

      </div>

    </div>
  );
}

// --- Responsive Trend Chart -----------------------------------------------------
// Self-contained chart that measures its container with ResizeObserver so it
// always fills its parent (mobile → tiny column, desktop → wide row) and
// re-renders whenever the window or layout changes. Includes smooth hover
// tooltips that dim non-active elements and emphasize the active data point.
type TrendPoint = {
  x: number;
  y: number;
  label: string;
  registrations: number;
  engagement: number;
  highlight?: boolean;
};

function ResponsiveTrendChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 500, h: 176 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const apply = () => {
      const rect = el.getBoundingClientRect();
      // Use the rendered CSS size. viewBox maps it to a 500x150 coordinate space.
      setSize({
        w: Math.max(120, Math.round(rect.width)),
        h: Math.max(80, Math.round(rect.height)),
      });
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, []);

  // Stable design coordinates — independent of actual pixel size.
  const VB_W = 500;
  const VB_H = 150;

  // 7 data points evenly distributed across the viewBox width.
  const points: TrendPoint[] = [
    { x: 0,   y: 130, label: 'MON 05', registrations: 124, engagement: 38 },
    { x: 83,  y: 118, label: 'TUE 06', registrations: 168, engagement: 46 },
    { x: 166, y: 95,  label: 'WED 07', registrations: 214, engagement: 61 },
    { x: 250, y: 78,  label: 'THU 08', registrations: 286, engagement: 79 },
    { x: 333, y: 55,  label: 'FRI 09', registrations: 372, engagement: 94 },
    { x: 416, y: 35,  label: 'SAT 10', registrations: 451, engagement: 118 },
    { x: 500, y: 18,  label: 'TODAY',  registrations: 528, engagement: 142, highlight: true },
  ];

  // Build a smooth path that flows through every data point.
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaPath = `${linePath} L ${VB_W} ${VB_H} L 0 ${VB_H} Z`;

  // Horizontal grid lines.
  const gridLines = [30, 75, 120];

  // Active index (hovered takes priority, then focused for keyboard nav).
  const activeIdx = hovered ?? focused;
  const hasActive = activeIdx !== null;

  // Convert a viewBox X coordinate to a pixel offset within the container,
  // accounting for preserveAspectRatio="none" stretching uniformly to fill.
  const xToPx = (vbX: number) => (vbX / VB_W) * size.w;
  const yToPx = (vbY: number) => (vbY / VB_H) * size.h;

  // Compute the trend delta vs the previous day for the active point.
  const activePoint = activeIdx !== null ? points[activeIdx] : null;
  const prevPoint = activeIdx !== null && activeIdx > 0 ? points[activeIdx - 1] : null;
  const deltaReg = activePoint && prevPoint ? activePoint.registrations - prevPoint.registrations : 0;
  const deltaEng = activePoint && prevPoint ? activePoint.engagement - prevPoint.engagement : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-44 sm:h-52 md:h-56 overflow-visible"
      style={{ minHeight: 160 }}
      data-size={`${size.w}x${size.h}`}
      data-active={activeIdx !== null ? points[activeIdx].label : 'none'}
      onMouseLeave={() => setHovered(null)}
    >
      <svg
        className="block w-full h-full"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Platform registrations and engagement curve over the last 7 days"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9E5838" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#9E5838" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveGradientActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9E5838" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#9E5838" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Group wrapper for non-active elements so we can dim them in one place */}
        <g
          style={{
            transition: 'opacity 220ms ease-out',
            opacity: hasActive ? 0.28 : 1,
          }}
        >
          {/* Horizontal grid */}
          {gridLines.map((y) => (
            <line
              key={`g-${y}`}
              x1="0"
              y1={y}
              x2={VB_W}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Vertical guides under each data point (non-active) */}
          {points.map((p) => (
            <line
              key={`v-${p.x}`}
              x1={p.x}
              y1={0}
              x2={p.x}
              y2={VB_H}
              stroke="#f1f5f9"
              strokeWidth="1"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Filled area */}
          <path d={areaPath} fill="url(#curveGradient)" />
        </g>

        {/* Active vertical guide — pops in only when a point is hovered */}
        {hasActive && (
          <line
            x1={points[activeIdx!].x}
            y1={0}
            x2={points[activeIdx!].x}
            y2={VB_H}
            stroke="#9E5838"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.45"
            style={{ transition: 'opacity 180ms ease-out' }}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Active area — slightly more saturated on hover */}
        <path
          d={areaPath}
          fill="url(#curveGradientActive)"
          style={{
            transition: 'opacity 220ms ease-out',
            opacity: hasActive ? 1 : 0,
          }}
        />

        {/* Trend line — stays full opacity, the "spotlight" comes from the dots */}
        <path
          d={linePath}
          fill="none"
          stroke="#9E5838"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'opacity 220ms ease-out, stroke-width 220ms ease-out',
            opacity: hasActive ? 0.4 : 1,
            strokeWidth: hasActive ? 3 : 2.5,
          }}
          vectorEffect="non-scaling-stroke"
        />

        {/* Invisible hit-target overlay — wide rectangles so the gap between
            data points is also hoverable, giving a smooth cross-fade. */}
        {points.map((p, i) => {
          // Each cell extends halfway to the next point on each side.
          const left = i === 0 ? p.x : (p.x + points[i - 1].x) / 2;
          const right = i === points.length - 1 ? p.x : (p.x + points[i + 1].x) / 2;
          return (
            <rect
              key={`hit-${i}`}
              x={left}
              y={0}
              width={right - left}
              height={VB_H}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              tabIndex={0}
              role="button"
              aria-label={`${p.label}: ${p.registrations} registrations, ${p.engagement} engagement`}
            />
          );
        })}

        {/* Data marker dots — only the active one is fully opaque. */}
        {points.map((p, i) => {
          const isActive = i === activeIdx;
          const isHighlight = p.highlight;
          return (
            <g
              key={`pt-${p.x}`}
              style={{
                transition: 'opacity 220ms ease-out, transform 220ms ease-out',
                opacity: hasActive ? (isActive ? 1 : 0.35) : 1,
                transformOrigin: `${p.x}px ${p.y}px`,
                transform: isActive ? 'scale(1.25)' : 'scale(1)',
              }}
            >
              {/* Outer halo on active point only */}
              {isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill="#bc6c25"
                  fillOpacity="0.18"
                  style={{ transition: 'opacity 180ms ease-out' }}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {/* Permanent highlight ring on TODAY */}
              {isHighlight && !isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={9}
                  fill="#bc6c25"
                  fillOpacity="0.18"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 5.5 : isHighlight ? 5 : 4}
                fill={isActive ? '#bc6c25' : '#9E5838'}
                stroke="white"
                strokeWidth={isActive ? 2.5 : isHighlight ? 2 : 1.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip — HTML overlay positioned in pixel space for crisp text.
          Anchored to the active point, flipped at the edges so it never clips. */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: xToPx(activePoint.x),
            top: Math.max(0, yToPx(activePoint.y) - 12),
            transform: 'translate(-50%, -100%)',
            transition: 'left 180ms ease-out, top 180ms ease-out, opacity 180ms ease-out',
          }}
        >
          <div
            className="relative bg-white border border-slate-200 rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] px-3 py-2.5 min-w-[160px] sm:min-w-[180px]"
            style={{
              // Counter the parent dimming by ensuring the tooltip is always bright.
              opacity: 1,
            }}
          >
            {/* Tooltip arrow */}
            <span
              className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-slate-200"
              style={{ transform: 'translateX(-50%) rotate(45deg)' }}
            />
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
                {activePoint.label}
              </span>
              {activePoint.highlight && (
                <span className="text-[9px] font-mono font-semibold text-[#bc6c25] bg-[#bc6c25]/10 px-1.5 py-0.5 rounded">
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Registrations</span>
              <span className="text-sm font-mono font-bold text-[#9E5838]">
                {activePoint.registrations.toLocaleString()}
              </span>
            </div>
            {prevPoint && deltaReg !== 0 && (
              <div className="flex items-baseline justify-between gap-3 -mt-0.5">
                <span className="sr-only">Change</span>
                <span
                  className={`text-[10px] font-mono ml-auto ${
                    deltaReg > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {deltaReg > 0 ? '▲' : '▼'} {Math.abs(deltaReg)}
                </span>
              </div>
            )}
            <div className="h-px bg-slate-100 my-1.5" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Engagement</span>
              <span className="text-sm font-mono font-bold text-[#355872]">
                {activePoint.engagement.toLocaleString()}
              </span>
            </div>
            {prevPoint && deltaEng !== 0 && (
              <div className="flex items-baseline justify-between gap-3 -mt-0.5">
                <span className="sr-only">Change</span>
                <span
                  className={`text-[10px] font-mono ml-auto ${
                    deltaEng > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {deltaEng > 0 ? '▲' : '▼'} {Math.abs(deltaEng)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
