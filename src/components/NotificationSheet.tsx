import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  Megaphone, 
  Bell, 
  Check, 
  CheckCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (link: string) => void;
  userRole: 'student' | 'organizer' | 'guest';
}

export default function NotificationSheet({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
  userRole
}: NotificationSheetProps) {
  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'Application':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'Event':
        return <Megaphone className="w-4 h-4 text-pink-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#355872]" />;
    }
  };

  const getBadgeColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'Application':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Event':
        return 'bg-pink-50 border-pink-200 text-pink-700';
      default:
        return 'bg-blue-50 border-blue-200 text-[#355872]';
    }
  };

  // Filter or prioritize based on view context
  const filteredNotifications = [...notifications].sort((a, b) => {
    // Unread first, then newest
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Format dynamic timestamps politely
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const minutesAgo = Math.floor((Date.now() - d.getTime()) / 60000);
      if (minutesAgo < 1) return 'Just now';
      if (minutesAgo < 60) return `${minutesAgo}m ago`;
      const hoursAgo = Math.floor(minutesAgo / 60);
      if (hoursAgo < 24) return `${hoursAgo}h ago`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Slideover layout */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#F7F8F0]/95 backdrop-blur-xl border-l border-[#355872]/15 shadow-2xl flex flex-col justify-between"
              id="notification-slideover-panel"
            >
              {/* Top Header Controls with Glassmorphic Accent */}
              <div className="px-6 py-5 border-b border-[#355872]/15 bg-[#F7F8F0]/40 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-slate-800 text-base flex items-center gap-2">
                    Ecosystem Alerts <Sparkles className="w-4 h-4 text-[#D0674B]" />
                  </h3>
                  <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    {userRole} view realtime ledger
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-[10.5px] font-mono font-bold text-[#355872] bg-white border border-[#355872]/15 hover:border-[#355872] px-2.5 py-1.5 transition-all hover:shadow-[2px_2px_0px_0px_rgba(53,88,114,0.1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                      id="notif-mark-all-read"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Close notification panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Center Scroll Log Panel */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 select-none" id="notif-cards-scroll">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-20 px-4 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200/40 border border-slate-300 flex items-center justify-center mx-auto text-slate-400 animate-pulse">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-500 font-light leading-relaxed max-w-[220px] mx-auto">
                      All connections online. No active telemetry alerts matching your pipeline node.
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkRead(notif.id);
                        if (notif.link) {
                          onNavigate(notif.link);
                          onClose();
                        }
                      }}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 flex gap-3.5 p-4.5 cursor-pointer hover:shadow-sm ${
                        notif.isRead
                          ? 'bg-white/60 border-slate-200/50 text-slate-500'
                          : 'bg-white border-orange-200/70 shadow-[3px_3px_0px_0px_rgba(208,103,75,0.05)] text-slate-800 hover:border-orange-300'
                      }`}
                      id={`notification-card-${notif.id}`}
                    >
                      {/* Highlighted Stripe Accent line for Unreads */}
                      {!notif.isRead && (
                        <div className="absolute left-0 inset-y-0 w-1 bg-orange-500" />
                      )}

                      {/* Icon Container with categorical styles */}
                      <div className="shrink-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                          notif.isRead ? 'bg-slate-50 border-slate-200/60' : 'bg-slate-50 border-[#355872]/15 shadow-inner'
                        }`}>
                          {getIcon(notif.type)}
                        </div>
                      </div>

                      {/* Content Fields */}
                      <div className="flex-1 space-y-1.5 text-left">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border tracking-wide ${getBadgeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300" /> {formatTime(notif.createdAt)}
                          </span>
                        </div>

                        <p className={`text-xs font-light leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          {notif.link && (
                            <span className="text-[9px] font-mono font-bold text-[#355872] hover:underline flex items-center gap-1">
                              Action Required: Open <Zap className="w-2.5 h-2.5" />
                            </span>
                          )}
                          {!notif.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkRead(notif.id);
                              }}
                              className="text-[9px] font-mono font-bold text-orange-600 hover:text-orange-850 hover:underline flex items-center gap-1.5 ml-auto cursor-pointer"
                              title="Dismiss Alert"
                            >
                              Dismiss <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Telemetry Status Footer */}
              <div className="px-6 py-4.5 border-t border-[#355872]/15 bg-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#355872] animate-pulse" />
                  Ecosystem Gateway Connected
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  Version 4.2.1
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
