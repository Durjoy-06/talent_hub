import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI (Gemini) safely with agent configurations
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully connected and initialized GoogleGenAI.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not configured or uses default value. Gemini AI will run in responsive guided simulation mode.");
}

// API endpoint for adaptive context-aware assistant chat proxy
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userRole, userName, userContext } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!ai) {
      return simulateAssistantResponse(res, messages, userRole, userName, userContext);
    }

    // Build highly polished, Stripe-like, Apple-inspired adaptive startup system instructions
    let systemInstruction = "You are TalentHub BD AI Companion, a high-end vector startup-inspired career assistant and mentor. Your design and linguistic values are inspired by Apple and Stripe: premium, highly literate, encouraging, crisp, objective, and deeply professional. Avoid any AI cliches, emojis, or dry corporate speak. Limit answers to 2-3 brief, highly scannable paragraphs with elegant bullet points if necessary. Keep responses practical and contextualized to the talent ecosystem of Bangladesh (Dhaka, Chattogram, Sylhet, etc.).";
    
    if (userRole === "student") {
      systemInstruction += ` You are conversing with ${userName || 'a student developer'}. Here is their active portfolio context: ${JSON.stringify(userContext || {})}.
Advising options:
1. Underline Codeforces / CP: Discuss building Competitive Programming rating indices, tracking Codeforces handles, and climbing ranges.
2. Underline Hackathon showreels: Encourage recording clean 2-min demo pitch play videos and adding documentation guides.
3. Underline Projects & Design: Guide writing clean taglines, deploying showcase products, and drafting clean portfolio cards.`;
    } else if (userRole === "organizer") {
      systemInstruction += ` You are conversing with ${userName || 'an Ecosystem Organizer / Talent Evaluator'}. 
Help them:
1. Query talents: Discuss utilizing regional hub maps, checking different clusters (Dhaka, Chattogram, Sylhet), or masonry categories (Dev, Design, CP, Hackathon).
2. Create events/spaces: Assist in structuring career bootcamps, defining criteria for high-fidelity talent showcases, or designing dynamic opportunity cards.`;
    } else {
      systemInstruction += " Guide this guest user. Detail the core advantages of the National developer graph, regional clusters, and how talented students build verified spotlights.";
    }

    // Convert message history to conform to @google/genai format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (apiErr: any) {
      console.warn("Gemini model call failed or is unavailable. Falling back to local responsive simulation mode...", apiErr);
      return simulateAssistantResponse(res, messages, userRole, userName, userContext);
    }
  } catch (error: any) {
    console.error("Gemini Assistant route system error:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve AI analysis" });
  }
});

// Mock simulation helper for offline/non-configured/default key grace states
function simulateAssistantResponse(res: any, messages: any[], role: string, name: string, context: any) {
  const latestMessage = messages[messages.length - 1];
  const query = (latestMessage?.content || "").toLowerCase();
  let text = "";
  
  if (role === "student") {
    if (query.includes("cp") || query.includes("codeforces") || query.includes("rating") || query.includes("competitive")) {
      text = `Hello ${name || 'Developer'}! Competitive programming status is a vital telemetry metric on TalentHub BD. Your **CP Showcase** is powered by live verification. 
      
*   **Handle Verification**: Link your Codeforces handle in your profile setup to automatically synchronize target rating pts.
*   **Rank High**: Display badges like **Specialist**, **Expert**, or **Candidate Master** on your masonry cards to catch recruiters' attention.

What specific problem-solving domains are you focusing on today? I can help you draft a compelling title for your CP card!`;
    } else if (query.includes("hackathon") || query.includes("pitch") || query.includes("demo") || query.includes("video")) {
      text = `Greetings ${name || 'Developer'}! Incorporating a **Hackathon Project** requires visual and architectural clarity.
      
*   **2-Minute Play**: Embed a clear video walkthrough (Loom, Youtube, or Drive) illustrating core mechanics. 
*   **Live Node**: Publish your documentation and live prototype link under the Hackathon category in your profile.

Would you like me to helper-draft a clean, professional description for your current hackathon showcase?`;
    } else if (query.includes("design") || query.includes("portfolio") || query.includes("figma")) {
      text = `Welcome back, ${name}! High-end product UI/UX showcases are designed to stand out.
      
*   **Concept Sheets**: Under the **Design** showcase, you can add beautiful, high-resolution Figma embed links or concept sheet URLs.
*   **Presentation Draft**: Add custom process steps—moving from wireframes to high-fidelity responsive state screens.

Let me know what design concept you're current hacking on!`;
    } else {
      text = `Hello ${name || 'Developer'}! I am your AI Career Companion. I help you position your capabilities perfectly for scaling startups.
      
*   **Masonry Focus**: Your profile is visible across Dhaka, Chattogram, and Sylhet clusters. You can publish under four categories: Dev, Design, CP, or Hackathons.
*   **System Telemetry**: Link your Github, Linkedin, and direct showreel video clips.

How can I help you refine your portfolio credentials today? Just let me know if you want to draft a project deck!`;
    }
  } else if (role === "organizer") {
    if (query.includes("scout") || query.includes("talent") || query.includes("filter") || query.includes("masonry")) {
      text = `Greetings, Organizer! Talent acquisitions are streamlined via the unified Regional Node Map.
      
*   **Regional Filter**: Toggle hubs like Dhaka, Chattogram, or Sylhet from the map to refine candidates.
*   **Showcase Cross-check**: Toggle categories (CP, Developer, Designer, Hackers) to check on-canvas accomplishments and live code repos directly.

What special technical competencies are you looking to recruit in this current cycle?`;
    } else {
      text = `Hello, Organizer! I am your Ecosystem Strategy Guide.
      
*   **Active Telemetry**: Review active submitted student applications, view live links, and manage student statuses directly from your Hub Command Center.
*   **Ecosystem Expansion**: Add fresh projects, collaborative spaces, or code bootcamps to increase student developer engagement across regions.

How can I assist you with talent evaluation or hub planning today?`;
    }
  } else {
    text = `Welcome to TalentHub BD! 🇧🇩

I am your Ecosystem Concierge, designed to navigate you through Bangladesh's leading high-end technical talent network graph.

*   **For Talent**: Expand your spotlight with verified Developer repositories, Design Figma concept sheets, Codeforces CP ratings, and Hackathon demo walkthroughs.
*   **For Curators & Organizers**: Access regional telemetry nodes, launch collaborative workspaces, and discover top builders.

To get started, feel free to sign into your workspace via the **Portal Gateway** or ask me details about the unified cluster networks!`;
  }

  return res.json({ text });
}

// Memory pool for notifications
interface AppNotification {
  id: string;
  userId: string;
  type: 'Application' | 'Event' | 'System';
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

let notificationPool: AppNotification[] = [
  {
    id: 'notif-p1',
    userId: 'stud1', // Zareen Subah
    type: 'Application',
    message: 'Your application for Frontend Engineer at Delve Labs BD has been updated to [Shortlisted]!',
    link: 'applications',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'notif-p2',
    userId: 'stud2', // Faisal Ahmed
    type: 'Application',
    message: 'Your submission for Distributed Systems Fellow is now [Interviewing]. Ready your documentation.',
    link: 'applications',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'notif-p3',
    userId: 'admin_master', // Organizer/Admin Hub
    type: 'Application',
    message: 'Tahmid Khan submitted a new application for Distributed Systems Fellow at BanglaTech Institute.',
    link: 'applicants',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-p4',
    userId: 'all', // Public System
    type: 'System',
    message: 'Sylhet Node Hub telemetry links expanded. Active events schedule released!',
    link: 'events',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let sseClients: { userId: string; res: any }[] = [];

// SECURE JUNCTION SYSTEM: EVENT REGISTRATIONS
interface EventRegistration {
  id: string;
  studentId: string;
  eventId: string;
  registeredAt: string;
}

let registrationsPool: EventRegistration[] = [];

app.get('/api/registrations', (req: any, res: any) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.json({ success: true, registrations: registrationsPool });
  }
  const filtered = registrationsPool.filter(r => r.studentId === studentId);
  res.json({ success: true, registrations: filtered });
});

app.post('/api/registrations', (req: any, res: any) => {
  const { studentId, eventId } = req.body;
  if (!studentId || !eventId) {
    return res.status(400).json({ error: 'Missing studentId or eventId parameters' });
  }

  const exists = registrationsPool.some(r => r.studentId === studentId && r.eventId === eventId);
  if (exists) {
    return res.json({ success: true, message: 'Already registered' });
  }

  const newReg: EventRegistration = {
    id: 'reg-' + Math.random().toString(36).substring(4),
    studentId,
    eventId,
    registeredAt: new Date().toISOString()
  };

  registrationsPool.push(newReg);
  res.status(201).json({ success: true, registration: newReg });
});

app.delete('/api/registrations', (req: any, res: any) => {
  const { studentId, eventId } = req.body;
  if (!studentId || !eventId) {
    return res.status(400).json({ error: 'Missing studentId or eventId params' });
  }

  registrationsPool = registrationsPool.filter(r => !(r.studentId === studentId && r.eventId === eventId));
  res.json({ success: true, message: 'Registration cancelled successfully' });
});

// SECURE REST APIS FOR NOTIFICATIONS
app.get('/api/notifications', (req: any, res: any) => {
  const userId = req.query.userId || '';
  // Return notifications belonging to the user OR posted globally to 'all'
  const filtered = notificationPool.filter(n => n.userId === userId || n.userId === 'all');
  res.json({ success: true, notifications: filtered });
});

app.post('/api/notifications', (req: any, res: any) => {
  const { userId, type, message, link } = req.body;
  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'Missing notification core parameters' });
  }

  const newNotif: AppNotification = {
    id: 'notif-' + Math.random().toString(36).substring(4),
    userId,
    type,
    message,
    link: link || '',
    isRead: false,
    createdAt: new Date().toISOString()
  };

  notificationPool.unshift(newNotif);

  // Broadcast in real-time to SSE clients
  const targets = sseClients.filter(c => c.userId === userId || c.userId === 'all' || userId === 'all');
  targets.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(newNotif)}\n\n`);
    } catch (err) {
      console.error("Failed to push notification SSE:", err);
    }
  });

  res.status(201).json({ success: true, notification: newNotif });
});

app.put('/api/notifications/:id/read', (req: any, res: any) => {
  const { id } = req.params;
  const index = notificationPool.findIndex(n => n.id === id);
  if (index !== -1) {
    notificationPool[index].isRead = true;
    res.json({ success: true, notification: notificationPool[index] });
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.put('/api/notifications/read-all', (req: any, res: any) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  notificationPool = notificationPool.map(n => {
    if (n.userId === userId || n.userId === 'all') {
      return { ...n, isRead: true };
    }
    return n;
  });

  res.json({ success: true, message: 'All notifications set to read' });
});

// Server-Sent Events real-time sync mechanism
app.get('/api/notifications/stream', (req: any, res: any) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId for event subscription' });
  }

  // Set response headers for HTTP Server-Sent Events stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const client = { userId, res };
  sseClients.push(client);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.res !== res);
  });
});

// Vite middleware for development or build assets servicing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
