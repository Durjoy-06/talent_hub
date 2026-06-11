import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventHub } from '../types';
import { Calendar, Users, MapPin, Tag, Plus, CheckCircle, Ticket, Compass, ArrowUpRight } from 'lucide-react';

interface EventsSectionProps {
  events: EventHub[];
  selectedHub: string | null;
  onAddEvent: (ev: EventHub) => void;
  onRegisterAttendee: (id: string) => void;
}

export default function EventsSection({ events, selectedHub, onAddEvent, onRegisterAttendee }: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<Record<string, boolean>>({});
  const [showTicketId, setShowTicketId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Hackathon' | 'Bootcamp' | 'Workshop' | 'Meetup'>('Hackathon');
  const [date, setDate] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [organizer, setOrganizer] = useState('');
  const [description, setDescription] = useState('');

  const tabs = ['All', 'Hackathon', 'Workshop', 'Bootcamp', 'Meetup'];

  const filteredEvents = events.filter((ev) => {
    // 1. Hub filter
    if (selectedHub && ev.division.toLowerCase() !== selectedHub.toLowerCase()) {
      return false;
    }

    // 2. Tab filter
    if (activeTab === 'All') return true;
    return ev.type.toLowerCase() === activeTab.toLowerCase();
  });

  const handlePostEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !organizer || !description) {
      alert('Please fill out all fields.');
      return;
    }

    const newEv: EventHub = {
      id: `ev-added-${Date.now()}`,
      title,
      type,
      date,
      division,
      organizer,
      attendeesCount: 0,
      description,
      registrationOpen: true
    };

    onAddEvent(newEv);
    setTitle('');
    setDate('');
    setOrganizer('');
    setDescription('');
    setShowPostForm(false);
  };

  const handleRSVP = (evId: string) => {
    if (registeredEventIds[evId]) {
      // show digital ticket
      setShowTicketId(evId);
      return;
    }

    onRegisterAttendee(evId);
    setRegisteredEventIds(prev => ({
      ...prev,
      [evId]: true
    }));
    setShowTicketId(evId);
  };

  const ticketEvent = events.find(e => e.id === showTicketId);

  return (
    <div id="events-agenda" className="my-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#7AAACE] uppercase flex items-center gap-1.5 font-semibold">
            <Compass className="w-3.5 h-3.5 text-[#355872]" /> Immersive Acceleration Calendar
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#355872] mt-1 tracking-tight">
            Student Hackathons & <span className="font-serif italic font-normal text-slate-700">Meetup Hub</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-light">
            Explore and participate in national level competitive frameworks, technical bootcamps, and divisional student tea chats.
          </p>
        </div>

        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="flex items-center gap-2 bg-[#355872] hover:bg-[#355872]/95 border-2 border-[#355872] text-[#F7F8F0] text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition duration-300 shadow-[3px_3px_0px_0px_rgba(122,170,206,0.3)]"
        >
          <Plus className="w-4 h-4" /> Create Event Listing
        </button>
      </div>

      {showPostForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-[#7AAACE]/20 rounded-3xl p-6 md:p-8 mb-10 max-w-2xl mx-auto shadow-md"
        >
          <h3 className="font-display text-lg font-semibold text-[#355872] mb-4 flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-[#7AAACE]" /> Post a Talent Ecosystem Event
          </h3>
          <form onSubmit={handlePostEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">EVENT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Du Hacking Fest 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">ORGANIZER GROUP *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SUST ACM Student Chapter"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">EVENT TYPE *</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Meetup">Meetup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">SCHEDULE DATE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., June 22, 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">DIVISION HUB *</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full bg-[#F7F8F0]/50 border border-slate-200 outline-none rounded-xl px-3 py-2 text-sm"
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
              <label className="block text-xs font-mono text-slate-500 mb-1">BRIEF PURPOSE / TOPIC DETAILS *</label>
              <textarea
                required
                rows={3}
                placeholder="Give details about key speakers, code guidelines, or prize pools..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F7F8F0]/50 border border-slate-200 focus:border-[#355872] outline-none rounded-xl px-4 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#355872] hover:bg-[#355872]/95 text-white rounded-xl text-xs font-mono font-semibold"
              >
                Broadcast to National Calendar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ticket Modal Overlay Dialog */}
      <AnimatePresence>
        {ticketEvent && (
          <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-[#F7F8F0] border-4 border-[#355872] rounded-3xl p-6 md:p-8 max-w-sm w-full relative shadow-2xl overflow-hidden"
            >
              {/* Decorative side ticket notches */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#1E293B]/70" />
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#1E293B]/70" />

              <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 [word-spacing:3px] block">BOARDING CARD</span>
                <span className="text-xs font-mono font-bold text-[#355872] bg-[#355872]/10 px-3 py-1 rounded-full inline-block mt-2">
                  TALENTHUB_BD_TICKET_ID: {ticketEvent.id.toUpperCase()}
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="text-center px-4">
                  <h4 className="font-display font-bold text-[#1E293B] text-lg leading-snug">
                    {ticketEvent.title}
                  </h4>
                  <span className="text-xs font-mono text-[#7AAACE] font-semibold mt-1 block">
                    Hosted by {ticketEvent.organizer}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white border border-slate-100 p-3.5 rounded-2xl text-xs font-mono text-slate-500">
                  <div>
                    <span className="block text-[8px] text-slate-400">HUB REGION</span>
                    <strong className="text-slate-700">{ticketEvent.division.toUpperCase()} HUB</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400">SCHEDULE</span>
                    <strong className="text-slate-700">{ticketEvent.date}</strong>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-2">
                  {/* Pseudo Barcode */}
                  <div className="w-full h-10 bg-slate-800 flex items-center justify-between px-3 gap-0.5 mt-2 opacity-85">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full bg-[#F7F8F0]"
                        style={{ width: `${Math.random() > 0.55 ? (Math.random() > 0.6 ? '4px' : '2.5px') : '1.2px'}` }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">SECURED HACKER CERTIFICATE PASS</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('Ticket downloaded to credentials matrix!');
                  }}
                  className="flex-1 py-2.5 bg-[#355872] hover:bg-[#355872]/90 text-white rounded-xl text-xs font-mono font-semibold"
                >
                  Download SVG Pass
                </button>
                <button
                  onClick={() => setShowTicketId(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-mono font-semibold"
                >
                  Dimiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedHub && (
        <div className="mb-6 text-xs font-mono bg-[#7AAACE]/10 text-[#355872] px-4 py-2 rounded-xl flex items-center justify-between">
          <span>Filtering events calendar for: <strong className="uppercase">{selectedHub} DIVISION</strong></span>
          <button onClick={() => window.scrollTo({ top: document.getElementById('bangladesh-opportunity-network')?.offsetTop, behavior: 'smooth' })} className="underline">Change location map</button>
        </div>
      )}

      {/* Categories Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-8 bg-[#F7F8F0]/80 p-1 rounded-xl max-w-max">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#355872] text-[#F7F8F0] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Events */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl">
          <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <span className="text-xs font-mono text-slate-400">No events found under this scope.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="events-grid shadow">
          {filteredEvents.map((ev) => {
            const hasRSVPd = registeredEventIds[ev.id];

            return (
              <motion.div
                key={ev.id}
                layout
                className="bg-white border-2 border-[#355872]/15 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(53,88,114,0.08)] hover:shadow-[6px_6px_0px_0px_#355872] hover:border-[#355872] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative corner ticks for Artistic layout */}
                <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#355872]/20" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#355872]/20" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold font-mono px-2.5 py-1 rounded-lg bg-[#355872]/10 text-[#355872] flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#7AAACE]" /> {ev.type}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <Users className="w-3.5 h-3.5" />
                      <span>{ev.attendeesCount + (hasRSVPd ? 1 : 0)} joined</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-lg text-[#1E293B]">
                      {ev.title}
                    </h3>
                    <span className="text-xs font-mono text-[#355872] bg-[#F7F8F0] px-2 py-0.5 rounded-md inline-block mt-1">
                      {ev.organizer}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4 mt-6">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-mono text-slate-400">HUB DIVISION</span>
                    <span className="text-xs font-mono font-medium flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#7AAACE]" /> {ev.division}
                    </span>
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-mono text-slate-400">DATE TIMELINE</span>
                    <span className="text-xs font-mono font-medium flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-[#355872]" /> {ev.date}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRSVP(ev.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 shadow-3xs ${
                      hasRSVPd
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                        : 'bg-[#355872] hover:bg-[#355872]/95 text-white'
                    }`}
                  >
                    {hasRSVPd ? (
                      <>
                        <Ticket className="w-3.5 h-3.5" /> View Ticket
                      </>
                    ) : (
                      <>
                        Join Event <ArrowUpRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
