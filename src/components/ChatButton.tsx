import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  FileText, 
  Terminal, 
  Code2, 
  GraduationCap, 
  Compass, 
  Building2,
  Dot,
  Loader2
} from 'lucide-react';
import { LoggedInUser } from '../types';

interface ChatButtonProps {
  user: LoggedInUser | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatButton({ user }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Magnetic FAB Animation States
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // User details
  const userRole = user ? user.role : 'guest';
  const userName = user ? user.name : '';
  const userContext = user ? {
    division: user.division,
    currentFocus: user.bio,
    skills: user.skills
  } : null;

  // Initialize welcome message based on role
  useEffect(() => {
    let welcomeText = "Welcome to TalentHub BD! 🇧🇩 I am your AI assistant. How can I guide your journey through Bangladesh's developer landscape today?";
    if (userRole === 'student') {
      welcomeText = `Assalamu Alaikum, ${userName}! I'm your TalentHub Career Guide. I can help review your competitive programming handles, suggest demo structures for hackathon showreels, or polish your developer showcase cards. What shall we work on today?`;
    } else if (userRole === 'organizer') {
      welcomeText = `Assalamu Alaikum ${userName}. I am your Startup Talent Strategist. I can help you filter candidate spotlights across Dhaka, Chattogram, & Sylhet, or write compelling opportunity postings. How can I assist your pipeline today?`;
    }
    
    setMessages([
      {
        id: 'initial_welcome',
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [userRole, userName]);

  // Scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Magnetic Hover Math
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnet strength coefficient (limit movement within 15px radius)
    const pullX = (clientX - centerX) * 0.28;
    const pullY = (clientY - centerY) * 0.28;
    setCoords({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  // Submit chat handler proxy
  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: chatHistory,
          userRole,
          userName,
          userContext
        })
      });

      if (!res.ok) {
        throw new Error('Server responded with an error status');
      }

      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.text || "I was unable to gather a solid response. Please verify details.",
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error("Failed to query API chat assistant:", err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: "Network response staggered. Please verify your internet connection or backend telemetry rules.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset micro guidance prompts
  const getSuggestionChips = () => {
    if (userRole === 'student') {
      return [
        { label: "⚡ Competitive Programming Tips", text: "How can I optimize my Codeforces handle in the Spotlight Gallery and improve my Rating Index score?" },
        { label: "🎬 Hackathon Showreel Guide", text: "What is required to register a Hackathon project showcase video and make it high contrast?" },
        { label: "✍️ Help me draft a Dev Portfolio", text: "Can you help me design and write a high-end showcase card for a React and Express fullstack app?" }
      ];
    } else if (userRole === 'organizer') {
      return [
        { label: "🔍 Talent Scouting Filters", text: "Explain how the regional map and multi-axis masonry grid help me find expert developers in Dhaka, Chattogram or Sylhet." },
        { label: "🚀 Draft a Job Opportunity", text: "Can you help me draft a compelling and high-converting student engineer posting for an advanced startup?" }
      ];
    } else {
      return [
        { label: "📊 What is TalentHub BD?", text: "Can you explain what the National Programmer Graph and divisional clusters represent?" },
        { label: "💡 How do I register?", text: "Explain how student builders can get verified and publish showcases on the spotlight board." }
      ];
    }
  };

  // Get status color based on role
  const getStatusColor = () => {
    if (userRole === 'student') return 'bg-sky-400'; // Sky blue for students
    if (userRole === 'organizer') return 'bg-emerald-400'; // Emerald for organizers
    return 'bg-purple-400'; // Purple for landing guests
  };

  const getStatusLabel = () => {
    if (userRole === 'student') return 'Dev Guide active';
    if (userRole === 'organizer') return 'Acquisition bot ready';
    return 'Unified radar active';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans" id="ai-assistant-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[410px] h-[520px] bg-white border border-[#355872]/15 shadow-[0_16px_40px_rgba(53,88,114,0.12)] rounded-3xl overflow-hidden flex flex-col"
            id="ai-assistant-panel"
          >
            {/* Elegant Top Header with Apple/Stripe-inspired aesthetic */}
            <div className="bg-[#355872] p-4 text-white flex justify-between items-center relative overflow-hidden">
              {/* Absolutes for elegant styling background */}
              <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-white/5 rounded-full blur-xl" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
                  {/* Embedded custom geometry sparkling node */}
                  <svg viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 text-white" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 11.5c0-4.14-3.8-7.5-8.5-7.5S4 7.36 4 11.5c0 1.95.84 3.73 2.23 5.08L5 20l3.87-1.16c1.11.31 2.3.48 3.53.48 4.7 0 8.5-3.36 8.5-7.5zM12.5 8.5c0 1.38-1.12 2.5-2.5 2.5 1.38 0 2.5 1.12 2.5 2.5 0-1.38 1.12-2.5 2.5-2.5-1.38 0-2.5-1.12-2.5-2.5zM15.5 7.5c0 .55-.45 1-1 1 .55 0 1 .45 1 1 0-.55.45-1 1-1-.55 0-1-.45-1-1z" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm tracking-tight flex items-center gap-1.5">
                    TalentHub AI Companion <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor()}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor()}`} />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-300">{getStatusLabel()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors pointer-events-auto"
                aria-label="Close assistant panel"
                id="close-chat-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Core panel */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4" id="chat-messages-scroll">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-[#355872] text-white flex items-center justify-center text-[10px] shrink-0 font-bold shadow-sm">
                        AI
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-light shadow-sm border ${
                        msg.role === 'user' 
                          ? 'bg-[#355872] text-white border-[#355872] rounded-tr-none' 
                          : 'bg-white text-slate-700 border-[#355872]/5 rounded-tl-none'
                      }`}>
                        {/* Multi-line parse */}
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-7 h-7 rounded-lg bg-[#355872] text-white flex items-center justify-center text-[10px] shrink-0 font-bold loader">
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-400 border border-[#355872]/5 flex items-center gap-2 shadow-sm font-mono">
                      <span>Analyzing portfolio metadata...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto select-none no-scrollbar">
              {getSuggestionChips().map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(undefined, chip.text)}
                  disabled={isLoading}
                  className="shrink-0 text-[10.5px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:border-[#355872] hover:text-[#355872] active:bg-slate-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat form footer */}
            <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={userRole === 'student' ? 'Ask Career Guide...' : 'Find top builders...'}
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#355872] focus:bg-white transition-all disabled:opacity-50"
                id="ai-assistant-input"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-9 h-9 bg-[#355872] hover:bg-[#2c495f] disabled:opacity-40 disabled:hover:bg-[#355872] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                aria-label="Send message"
                id="send-message-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-End Floating Action Button */}
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
        aria-expanded={isOpen}
        animate={{ x: coords.x, y: coords.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="w-14 h-14 bg-[#355872] rounded-full flex items-center justify-center text-white cursor-pointer shadow-[0_12px_24px_rgba(53,88,114,0.3)] border-2 border-white hover:border-[#355872] hover:scale-105 transition-transform duration-100 group relative select-none"
        id="floating-chat-button"
      >
        {/* Entrance visual cues (pulsing rings matched with visual setup) */}
        <span className="absolute inset-0 rounded-full bg-[#355872] opacity-20 group-hover:animate-ping animate-pulse pointer-events-none" />
        
        {/* Dynamic Status Dot relative to startup state awareness */}
        <div className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 z-20">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${getStatusColor()}`} />
          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${getStatusColor()}`} />
        </div>

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close_icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="vector_icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Modern Apple/Stripe-inspired custom geometrical sparkle inside outline bubble */}
              <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5 text-white" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5c0-4.14-3.8-7.5-8.5-7.5S4 7.36 4 11.5c0 1.95.84 3.73 2.23 5.08L5 20l3.87-1.16c1.11.31 2.3.48 3.53.48 4.7 0 8.5-3.36 8.5-7.5zM12.5 8.5c0 1.38-1.12 2.5-2.5 2.5 1.38 0 2.5 1.12 2.5 2.5 0-1.38 1.12-2.5 2.5-2.5-1.38 0-2.5-1.12-2.5-2.5zM15.5 7.5c0 .55-.45 1-1 1 .55 0 1 .45 1 1 0-.55.45-1 1-1-.55 0-1-.45-1-1z" fill="currentColor" stroke="none" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
