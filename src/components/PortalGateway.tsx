import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chrome, 
  ArrowLeft, 
  User, 
  Building, 
  ShieldCheck, 
  Lock, 
  Mail, 
  MapPin, 
  Cpu, 
  CloudLightning,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { LoggedInUser } from '../types';

interface PortalGatewayProps {
  onLoginSuccess: (user: LoggedInUser) => void;
  onBackToLanding: () => void;
}

export default function PortalGateway({ onLoginSuccess, onBackToLanding }: PortalGatewayProps) {
  const [role, setRole] = useState<'student' | 'organizer'>('student');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('durjoybanik06@gmail.com');
  const [name, setName] = useState<string>('');
  const [university, setUniversity] = useState<string>('BUET');
  const [division, setDivision] = useState<string>('Dhaka');
  
  // Handshake connection state
  const [authState, setAuthState] = useState<'idle' | 'oauth_connecting' | 'securing_tokens' | 'finalizing' | 'success'>('idle');
  const [authProgressMessage, setAuthProgressMessage] = useState<string>('');

  const divisionsList = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];
  const universitiesList = ['BUET', 'DU', 'SUST', 'CUET', 'RUET', 'KUET', 'IUT', 'NSU', 'BracU'];

  // Handle OAuth Trigger sequence
  const triggerGoogleOAuth = () => {
    if (isSignUp && !name) {
      alert('Please enter a Full Name for registration.');
      return;
    }
    
    setAuthState('oauth_connecting');
    setAuthProgressMessage('Initiating Google OAuth Client via secure endpoint...');
    
    // Animate discrete steps of credential exchanges
    setTimeout(() => {
      setAuthState('securing_tokens');
      setAuthProgressMessage('Retrieving ID token & validating client cookies...');
      
      setTimeout(() => {
        setAuthState('finalizing');
        setAuthProgressMessage('Registering sector encryption certificates & pulling graph profiles...');
        
        setTimeout(() => {
          setAuthState('success');
          setAuthProgressMessage('Session established securely. Injecting terminal tokens...');
          
          setTimeout(() => {
            // Generate user profiles based on signup/signin state
            const loggedInUser: LoggedInUser = {
              id: role === 'student' ? 'stud_active_' + Date.now().toString().slice(-4) : 'org_active_' + Date.now().toString().slice(-4),
              name: name || (role === 'student' ? 'Durjoy Banik' : 'Adnan Chowdhury'),
              email: email,
              role: role,
              avatar: role === 'student' 
                ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' 
                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
              division: division,
              university: role === 'student' ? university : undefined,
              skills: role === 'student' ? ['React', 'Next.js', 'TypeScript', 'Motion'] : undefined,
              bio: role === 'student' 
                ? 'Student Builder eager to connect with engineering networks across Bangladesh.' 
                : 'Organizer coordinating student events & digital hackathons.',
              github: role === 'student' ? 'https://github.com/durjoy' : undefined,
              linkedin: role === 'student' ? 'https://linkedin.com/in/durjoy' : undefined,
            };
            
            // Execute parent login logic (transitions out)
            onLoginSuccess(loggedInUser);
          }, 1000);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  // Primary Theme definitions
  const activeColor = role === 'student' ? '#355872' : '#9E5838';
  const accentLight = role === 'student' ? 'rgba(53, 88, 114, 0.05)' : 'rgba(158, 88, 56, 0.05)';
  const borderLight = role === 'student' ? 'rgba(53, 88, 114, 0.15)' : 'rgba(158, 88, 56, 0.15)';

  return (
    <div className="min-h-screen bg-[#F7F8F0] relative overflow-hidden flex flex-col justify-between items-center px-4 py-8">
      
      {/* Visual background decorations corresponding to Active Role */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full blur-[160px] opacity-[0.25] transition-colors duration-1000"
          style={{ backgroundColor: activeColor }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full blur-[140px] opacity-[0.16] transition-colors duration-1000"
          style={{ backgroundColor: activeColor }}
        />
        <div className="absolute top-[30%] lg:top-[20%] right-[10%] w-32 h-32 opacity-[0.06] artistic-dashed" />
        <div className="absolute bottom-[30%] left-[8%] w-40 h-40 opacity-[0.06] artistic-dashed" />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <button 
          onClick={onBackToLanding}
          className="group flex items-center gap-2 hover:bg-slate-200/50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono transition-all duration-200"
          id="gateway-back-to-landing-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> [ Return To Home Matrix ]
        </button>
        
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> [ SECURE PORTAL GATEWAY ]
        </div>
      </header>

      {/* Main Glassmorphism Card */}
      <main className="w-full max-w-md my-auto relative z-10 py-8">
        
        {/* Entrance Portal Card Outer Frame */}
        <div className="bg-white/80 backdrop-blur-xl border-2 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(53,88,114,0.06)]"
             style={{ borderColor: borderLight }}>
          
          {/* Aesthetic grid line layout inside card overlay */}
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 opacity-30" style={{ borderColor: activeColor }} />
          <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 opacity-30" style={{ borderColor: activeColor }} />
          <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 opacity-30" style={{ borderColor: activeColor }} />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 opacity-30" style={{ borderColor: activeColor }} />

          {/* Logo Mark and Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-[#F7F8F0] transition-colors duration-1000 shadow-sm"
                 style={{ backgroundColor: activeColor }}>
              <Cpu className="w-6 h-6 text-[#9CD5FF]" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-[#355872] tracking-tight">
              TalentHub<span className="text-slate-500 font-serif italic font-normal">.BD Portal</span>
            </h1>
            <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">
              GRID ACCESS GATEWAY
            </p>
          </div>

          {/* Role switcher - Dual Entrance */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 relative">
            <button
              onClick={() => { if (authState === 'idle') setRole('student'); }}
              disabled={authState !== 'idle'}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                role === 'student' 
                  ? 'bg-[#355872] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="role-switch-student-btn"
            >
              <User className="w-3.5 h-3.5" /> [ Student Hub ]
            </button>
            <button
              onClick={() => { if (authState === 'idle') setRole('organizer'); }}
              disabled={authState !== 'idle'}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                role === 'organizer' 
                  ? 'bg-[#9E5838] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
              id="role-switch-organizer-btn"
            >
              <Building className="w-3.5 h-3.5" /> [ Organizer Hub ]
            </button>
          </div>

          {/* Authentication Process Layers */}
          <AnimatePresence mode="wait">
            {authState === 'idle' ? (
              <motion.div 
                key="auth_form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                {/* Form fields */}
                <div className="space-y-3">
                  {isSignUp && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3" /> REGISTERED FULL NAME
                      </label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Durjoy Banik"
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans transition-all"
                        style={{ '--tw-ring-color': activeColor } as React.CSSProperties}
                        required
                        id="auth-input-name"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> VERIFIED EMAIL ADDRESS
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="durjoybanik06@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-sans transition-all"
                      id="auth-input-email"
                    />
                  </div>

                  {isSignUp && role === 'student' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> UNIVERSITY ACADEMY
                        </label>
                        <select 
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-sans transition-all"
                        >
                          {universitiesList.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> DIVISION HUB
                        </label>
                        <select 
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-sans transition-all"
                        >
                          {divisionsList.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {isSignUp && role === 'organizer' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> HUB SECTOR / DIVISION
                      </label>
                      <select 
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none rounded-xl px-3 py-2.5 text-xs font-sans transition-all"
                      >
                        {divisionsList.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Google OAuth trigger */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={triggerGoogleOAuth}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold py-3 px-4 shadow-[4px_4px_0px_0px_rgba(30,41,59,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 duration-200"
                    id="google-oauth-btn"
                  >
                    <Chrome className="w-4 h-4 text-orange-400" />
                    <span>[ Connect with Google Workspace ]</span>
                  </button>
                </div>

                {/* Switch Login vs Register */}
                <div className="text-center pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                    }}
                    className="text-[11px] font-mono hover:underline"
                    style={{ color: activeColor }}
                    id="auth-toggle-signup-btn"
                  >
                    {isSignUp 
                      ? 'Already have an active Node registry? Sign In'
                      : 'Don\'t have an active Node registry? Create Profile'
                    }
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="auth_loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                {/* Simulated cryptographic loaders */}
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-4 border-dashed bg-transparent"
                    style={{ borderColor: activeColor, borderTopColor: 'transparent' }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {authState === 'success' ? (
                      <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                    ) : (
                      <CloudLightning className="w-8 h-8 text-slate-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <span className="inline-block text-[10px] uppercase font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 tracking-wider">
                    {authState === 'success' ? 'CONNECTED' : 'ENCRYPTING'}
                  </span>
                  <p className="text-xs font-mono text-slate-700 leading-snug">
                    {authProgressMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer System indicators */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 font-mono text-[9px] relative z-10 border-t border-slate-200/50 pt-4">
        <span>BANGLADESH NETWORK GATEWAY SECURE END_ROUTE</span>
        <div className="flex gap-4">
          <span>IP: 103.114.17.2</span>
          <span>MD5_CRYPT: OK</span>
          <span>SSL_PORT: 443</span>
        </div>
      </footer>

    </div>
  );
}
