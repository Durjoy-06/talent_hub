export interface Talent {
  id: string;
  name: string;
  role: string;
  university: string;
  division: string; // Hub
  skills: string[];
  bio: string;
  avatarUrl: string;
  connections: number;
  views: number;
  lookingFor: string;
  github?: string;
  linkedin?: string;
  featured: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Internship' | 'Full-Time' | 'Fellowship' | 'Project';
  organization: string;
  division: string;
  skillsRequired: string[];
  description: string;
  stipend: string;
  datePosted: string;
  applicantsCount: number;
}

export interface EventHub {
  id: string;
  title: string;
  type: 'Hackathon' | 'Bootcamp' | 'Workshop' | 'Meetup';
  date: string;
  division: string;
  organizer: string;
  attendeesCount: number;
  description: string;
  registrationOpen: boolean;
}

export interface HubNode {
  id: string;
  name: string;
  x: number; // percentage coordinate on representation
  y: number; // percentage coordinate on representation
  connections: string[]; // IDs of other hubs to connect to
  studentCount: number;
  eventCount: number;
  description: string;
}

// Initial divisional nodes for Bangladesh's representational graph
export const INITIAL_HUBS: HubNode[] = [
  {
    id: 'dhaka',
    name: 'Dhaka Hub',
    x: 50,
    y: 50,
    connections: ['chattogram', 'sylhet', 'mymensingh', 'rajshahi', 'khulna', 'barishal'],
    studentCount: 1420,
    eventCount: 24,
    description: 'The mega-center of tech innovation, administrative nodes, and major public & private engineering academies.'
  },
  {
    id: 'chattogram',
    name: 'Chattogram Hub',
    x: 75,
    y: 75,
    connections: ['dhaka', 'sylhet'],
    studentCount: 680,
    eventCount: 12,
    description: 'Port city gateway driving hardware initiatives, IoT solutions, and maritime software stacks.'
  },
  {
    id: 'sylhet',
    name: 'Sylhet Hub',
    x: 78,
    y: 35,
    connections: ['dhaka', 'chattogram', 'mymensingh'],
    studentCount: 450,
    eventCount: 8,
    description: 'High concentration of global software remote workers, freelancers, and immersive tech academies.'
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi Hub',
    x: 23,
    y: 40,
    connections: ['dhaka', 'rangpur', 'khulna'],
    studentCount: 590,
    eventCount: 9,
    description: 'Educational metropolis with premium Research institutes, agriculture-tech, and deep engineering focus.'
  },
  {
    id: 'khulna',
    name: 'Khulna Hub',
    x: 28,
    y: 72,
    connections: ['dhaka', 'rajshahi', 'barishal'],
    studentCount: 480,
    eventCount: 6,
    description: 'Eco-analytics focus, geospatial engineering, and growing regional development networks.'
  },
  {
    id: 'barishal',
    name: 'Barishal Hub',
    x: 48,
    y: 80,
    connections: ['dhaka', 'khulna'],
    studentCount: 260,
    eventCount: 3,
    description: 'Agri-tech solutions, dynamic student circles, and community engagement for south Bengal.'
  },
  {
    id: 'rangpur',
    name: 'Rangpur Hub',
    x: 20,
    y: 18,
    connections: ['rajshahi', 'mymensingh'],
    studentCount: 310,
    eventCount: 4,
    description: 'Rising talent pool, heavy digitization programs, and local regional hub accelerators.'
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh Hub',
    x: 52,
    y: 30,
    connections: ['dhaka', 'sylhet', 'rangpur'],
    studentCount: 370,
    eventCount: 5,
    description: 'Heavy research, bio-informatics integrations, and close connections to capital engineering labs.'
  }
];

export const INITIAL_TALENTS: Talent[] = [
  {
    id: 't1',
    name: 'Zareen Subah',
    role: 'AI Research Engineer',
    university: 'BUET',
    division: 'Dhaka',
    skills: ['PyTorch', 'NLP', 'Transformers', 'FastAPI'],
    bio: 'Dedicated researcher focusing on low-resource Bangla NLP and Speech Recognition systems. Passionate about democratizing technology.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    connections: 342,
    views: 1890,
    lookingFor: 'Collaborators for Bangla LLM paper & AI labs.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    featured: true
  },
  {
    id: 't2',
    name: 'Faisal Ahmed',
    role: 'Full Stack Architect',
    university: 'CUET',
    division: 'Chattogram',
    skills: ['Next.js', 'Go', 'Docker', 'Kubernetes', 'GraphQL'],
    bio: 'Cloud enthusiast and open-source contributor. Former lead dev at CUET computer club. Love systems scaling and fine-tuning databases.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    connections: 512,
    views: 2430,
    lookingFor: 'Remote DevOps internship or high-scaling startup projects.',
    github: 'https://github.com',
    featured: true
  },
  {
    id: 't3',
    name: 'Nuzhat Tabassum',
    role: 'Product Designer',
    university: 'USTC',
    division: 'Chattogram',
    skills: ['Figma', 'System Design', 'Framer Motion', 'Spline'],
    bio: 'Crafting clean interactive micro-experiences. Translating human emotion into elegant spatial digital interfaces.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    connections: 289,
    views: 1110,
    lookingFor: 'Full-time junior designer roles in visual-heavy teams.',
    featured: true
  },
  {
    id: 't4',
    name: 'Tahmid Khan',
    role: 'Competitive Programmer',
    university: 'SUST',
    division: 'Sylhet',
    skills: ['C++', 'Competitive Programming', 'Algorithms', 'Rust'],
    bio: 'ACM-ICPC World Finals contestant. Specialized in graph theory, network flow, and writing blazing-fast low-level software.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    connections: 610,
    views: 3100,
    lookingFor: 'Systems Programming fellowships or algorithmic problem-setter roles.',
    github: 'https://github.com',
    featured: true
  },
  {
    id: 't5',
    name: 'Sajidul Islam',
    role: 'IoT Specialist',
    university: 'RUET',
    division: 'Rajshahi',
    skills: ['Embedded C', 'ESP32', 'Raspberry Pi', 'Bland AI'],
    bio: 'Building automated agriculture management hardware systems to modernize regional crop yields and water conservation.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    connections: 195,
    views: 890,
    lookingFor: 'Seed-stage agri-tech co-founders & supply chain partners.',
    featured: false
  },
  {
    id: 't6',
    name: 'Amina Chowdhury',
    role: 'Data Analyst & Animator',
    university: 'KUET',
    division: 'Khulna',
    skills: ['Python', 'D3.js', 'WebGL', 'R'],
    bio: 'Fusing scientific data visualization with playful animation principles to present climate-impact studies beautifully.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    connections: 240,
    views: 1200,
    lookingFor: 'Data visualization consulting roles or climate-tech labs.',
    featured: false
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'o1',
    title: 'Frontend Engineer (React & Motion)',
    type: 'Internship',
    organization: 'Delve Labs BD',
    division: 'Dhaka',
    skillsRequired: ['TypeScript', 'React', 'Framer Motion', 'Tailwind'],
    description: 'We are seeking an exceptionally detail-oriented designer-engineer who loves micro-interactions, responsive typography, and tactile scroll effects.',
    stipend: 'BDT 25,000 / month',
    datePosted: 'June 09, 2026',
    applicantsCount: 42
  },
  {
    id: 'o2',
    title: 'Distributed Systems Fellow',
    type: 'Fellowship',
    organization: 'BanglaTech Institute',
    division: 'Sylhet',
    skillsRequired: ['Go', 'gRPC', 'Distributed Databases', 'Raft'],
    description: 'Join our research cohort investigating high-performance localized database cache rings optimized for low-network districts around Sylhet.',
    stipend: 'BDT 40,000 / month',
    datePosted: 'June 08, 2026',
    applicantsCount: 19
  },
  {
    id: 'o3',
    title: 'Agri-Tech Hardware Architect',
    type: 'Project',
    organization: 'Shishir Shastho Solutions',
    division: 'Rajshahi',
    skillsRequired: ['ESP32', 'Firmware', 'Sensor Calibration', 'MQTT'],
    description: 'A 3-month contract project designing autonomous soil moisture node telemetry for private mango plantations near Naogaon and Rajshahi.',
    stipend: 'BDT 80,000 total',
    datePosted: 'June 10, 2026',
    applicantsCount: 8
  },
  {
    id: 'o4',
    title: 'Senior Product Designer',
    type: 'Full-Time',
    organization: 'DynamicBD',
    division: 'Dhaka',
    skillsRequired: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    description: 'Lead design for Bangladesh\'s next-generation transport and logistics operating system. Work directly with ex-Silicon Valley founders.',
    stipend: 'BDT 120,000 / month',
    datePosted: 'June 05, 2026',
    applicantsCount: 31
  }
];

export const INITIAL_EVENTS: EventHub[] = [
  {
    id: 'e1',
    title: 'National Bangla NLP Hackathon 2026',
    type: 'Hackathon',
    date: 'June 25, 2026',
    division: 'Dhaka',
    organizer: 'BUET Computer Club × Bangla AI Foundation',
    attendeesCount: 280,
    description: '36 hours of continuous hacking focused purely on Bengali language models, OCR engines, and low-resource dialect adaptation toolkits.',
    registrationOpen: true
  },
  {
    id: 'e2',
    title: 'Spatial Interactive & Audio Sync Seminar',
    type: 'Workshop',
    date: 'June 18, 2026',
    division: 'Chattogram',
    organizer: 'Creative Devs Chat',
    attendeesCount: 110,
    description: 'Unlock WebGL, Spline rendering, and framer-motion physics parameters to present interactive state layers in a tactile, high-end manner.',
    registrationOpen: true
  },
  {
    id: 'e3',
    title: 'Sylhet Tech-Chai Meetup',
    type: 'Meetup',
    date: 'June 30, 2026',
    division: 'Sylhet',
    organizer: 'Sylhet Freelanders Consortium',
    attendeesCount: 150,
    description: 'Annual gathering of remote engineers, global contractors, and high-growth freelancers to discuss micro-agency scaling and distributed setups.',
    registrationOpen: true
  },
  {
    id: 'e4',
    title: 'Agro-Robotics Field Bootcamp',
    type: 'Bootcamp',
    date: 'July 05, 2026',
    division: 'Rajshahi',
    organizer: 'Rajshahi Agri-Innovators',
    attendeesCount: 85,
    description: 'A fast-paced hands-on bootcamp taking student engineers into the agricultural farms of Rajshahi, testing thermal drones and telemetry sensors.',
    registrationOpen: true
  }
];

export const GENERAL_STATS = {
  activeStudents: 12450,
  activeProjects: 382,
  connectedHubs: 8,
  placedTalents: 1420
};

export interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'organizer';
  avatar?: string;
  division?: string;
  university?: string;
  skills?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentUniversity: string;
  studentDivision: string;
  opportunityId: string;
  opportunityTitle: string;
  organization: string;
  status: 'Under Review' | 'Shortlisted' | 'Interviewing' | 'Offer Received' | 'Declined';
  dateApplied: string;
}

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    studentId: 'stud1',
    studentName: 'Zareen Subah',
    studentEmail: 'zareen.subah@buet.ac.bd',
    studentUniversity: 'BUET',
    studentDivision: 'Dhaka',
    opportunityId: 'o1',
    opportunityTitle: 'Frontend Engineer (React & Motion)',
    organization: 'Delve Labs BD',
    status: 'Shortlisted',
    dateApplied: 'June 10, 2026'
  },
  {
    id: 'app2',
    studentId: 'stud2',
    studentName: 'Faisal Ahmed',
    studentEmail: 'faisal.architect@cuet.ac.bd',
    studentUniversity: 'CUET',
    studentDivision: 'Chattogram',
    opportunityId: 'o2',
    opportunityTitle: 'Distributed Systems Fellow',
    organization: 'BanglaTech Institute',
    status: 'Interviewing',
    dateApplied: 'June 10, 2026'
  },
  {
    id: 'app3',
    studentId: 'stud3',
    studentName: 'Tahmid Khan',
    studentEmail: 'tahmid.code@sust.edu',
    studentUniversity: 'SUST',
    studentDivision: 'Sylhet',
    opportunityId: 'o2',
    opportunityTitle: 'Distributed Systems Fellow',
    organization: 'BanglaTech Institute',
    status: 'Under Review',
    dateApplied: 'June 11, 2026'
  }
];

