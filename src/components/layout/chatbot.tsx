"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Bot, Briefcase, Zap, TrendingUp, Terminal } from "lucide-react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GOKU_SYSTEM_PROMPT = `You are Goku, Kunal Singh's AI training partner! Your goal is to introduce visitors to Kunal in an energetic, motivational, and battle-ready way.
- Speak in Goku's voice: use energetic expressions like "Yo!", "I'm Goku!", "Wow!", and "Let's train!"
- Refer to Kunal as your martial arts student or training partner.
- Describe his technical SDE and AI Engineering skills as power levels or combat techniques. For example, "His AI Engineering power level is over 9000!"
- IMPORTANT: Keep your answers extremely short and concise (maximum 2 sentences). This is a tiny chat bubble, so long responses are unreadable. Keep it fast and energetic!
- Keep his actual technical details (internships at Thales Group/Manipal, B.Tech CSE Graduation from GBU) accurate, but describe them like epic battles or training achievements.
- Be super supportive, friendly, and urge recruiters to recruit him.`;

const RECRUITER_SYSTEM_PROMPT = `You are Kunal's Personal Talent Agent. Your goal is to convince hiring managers and recruiters to hire Kunal for Software Engineering, AI Engineering, or Full-Stack roles.
- Speak in a highly persuasive, business-savvy, and direct tone.
- Highlight metrics, ROI, and internship accomplishments.
- IMPORTANT: Keep all responses extremely short and concise (under 3 brief bullet points or 2 sentences). Avoid long paragraphs. Make it quick to read.
- Focus on his technical stack (TypeScript, Next.js, Python, LangChain, TensorFlow) and clear suitability for fast-paced engineering teams.
- Keep answers formatted with brief bullet points for easy scanning.`;

const AI_ENGINEER_SYSTEM_PROMPT = `You are Kunal Singh's GenAI and LLM Specialist Twin. Your goal is to showcase his AI engineering skills.
- Speak in a highly technical, intelligent, and system-oriented tone.
- Highlight his expertise in:
  * Prompt Engineering, RAG (Retrieval-Augmented Generation), Semantic Search, and Vector Embeddings (using ChromaDB).
  * Orchestration frameworks like LangChain, APIs like Groq, OpenAI, Gemini, and Vapi (voice latent orchestrations).
  * Machine learning libraries: TensorFlow, PyTorch, Hugging Face transformers.
  * Project highlights: StudyMate (GenAI/RAG, 40% review speedup), AlphaCare (Voice-symptom screening, 280ms voice latency via Gemini/Vapi).
- IMPORTANT: Keep your answers extremely short and concise (maximum 2 sentences or 3 brief bullet points). Never write long paragraphs or blocky texts. Keep it punchy!`;

const SDE_SYSTEM_PROMPT = `You are Kunal Singh's Software Development Engineer (SDE) Twin. Your goal is to highlight his MERN and Full-Stack capabilities.
- Speak in a pragmatic, structured, and developer-centric tone.
- Highlight his expertise in:
  * Frontend: React.js, Next.js (Turbopack, Server Actions), Tailwind CSS, TypeScript.
  * Backend & DB: Node.js, Express.js, MongoDB database schema design, and query optimization.
  * Key accomplishments: StudyNotion course platform (JWT auth, role dashboards, 98% test coverage), Travel Planner.
  * Optimizations: Boosting API response times by 40% with custom aggregation pipelines and indexing.
- IMPORTANT: Keep your answers extremely short and concise (maximum 2 sentences or 3 brief bullet points). Never write long paragraphs or blocky texts. Keep it punchy!`;

const PERSONAS = [
  {
    id: "professional",
    name: "Professional",
    icon: Briefcase,
    label: "Professional AI Twin",
    greeting: "Hi there! I'm Kunal's AI Twin. Ask me anything about his projects, skills, work experience, or education. How can I help you today?",
    systemPrompt: "", // Default prompt on server
  },
  {
    id: "goku",
    name: "Goku Stance",
    icon: Zap,
    label: "Super Saiyan Trainer",
    greeting: "Yo! I'm Goku, Kunal's AI training partner. Let's talk about his coding power levels and training! What do you want to test him on first?",
    systemPrompt: GOKU_SYSTEM_PROMPT,
  },
  {
    id: "ai_engineer",
    name: "AI Engineer",
    icon: Bot,
    label: "GenAI & LLM Specialist",
    greeting: "Hello! I am Kunal's GenAI Twin. Ask me about his RAG pipelines, LangChain orchestration, semantic indexing, or LLM latency optimization.",
    systemPrompt: AI_ENGINEER_SYSTEM_PROMPT,
  },
  {
    id: "sde",
    name: "SDE / Full Stack",
    icon: Terminal,
    label: "Full Stack Engineer",
    greeting: "Ready. I am Kunal's SDE Twin. Ask me about his Next.js app architecture, Node backend REST APIs, database indexing, or MERN configurations.",
    systemPrompt: SDE_SYSTEM_PROMPT,
  },
  {
    id: "recruiter",
    name: "Recruiter Pitch",
    icon: TrendingUp,
    label: "Kunal's Talent Agent",
    greeting: "Hello! I am Kunal's Talent Agent. Ready to view his internship highlights, metrics, and technical expertise? Let's discuss why he is a great fit for your engineering team.",
    systemPrompt: RECRUITER_SYSTEM_PROMPT,
  },
];

function formatMessage(content: string) {
  const combinedRegex = /(https?:\/\/[^\s\)]+)|([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})|(\+?[0-9]{2,3}[-\s]?[0-9]{5}[-\s]?[0-9]{5}|\b\d{10}\b)|((?:^|\s)\/(?:contact|projects|skills|experience|blog|github|leetcode|resume|about)\b)/g;
  
  const parts = content.split(combinedRegex);
  
  return parts.map((part, index) => {
    if (!part) return null;
    
    // Check if it's a URL
    if (part.match(/^https?:\/\//)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 text-primary font-semibold break-all">
          {part}
        </a>
      );
    }
    
    // Check if it's an email
    if (part.match(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      return (
        <a key={index} href={`mailto:${part}`} className="underline hover:opacity-80 text-primary font-semibold break-all">
          {part}
        </a>
      );
    }
    
    // Check if it's a phone number
    if (part.match(/^(\+?[0-9]{2,3}[-\s]?[0-9]{5}[-\s]?[0-9]{5}|\d{10})$/)) {
      return (
        <a key={index} href={`tel:${part.replace(/\s+/g, "")}`} className="underline hover:opacity-80 text-primary font-semibold">
          {part}
        </a>
      );
    }

    // Check if it's an internal path link
    const cleanPart = part.trim();
    const pathMatch = cleanPart.match(/^\/?(contact|projects|skills|experience|blog|github|leetcode|resume|about)$/);
    if (pathMatch) {
      const cleanPath = cleanPart.startsWith("/") ? cleanPart : `/${cleanPart}`;
      return (
        <a key={index} href={cleanPath} className="underline hover:opacity-80 text-primary font-semibold">
          {part}
        </a>
      );
    }
    
    return part;
  });
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: PERSONAS[0].greeting,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Don't show chatbot in admin panel
  if (pathname.startsWith("/admin")) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const chatHistory = [...messages, { role: "user", content: userMessage }];
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          systemPrompt: activePersona.systemPrompt || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I ran into an error connecting to my AI core. Please try again in a bit!",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! A network issue occurred. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaChange = (persona: typeof PERSONAS[number]) => {
    if (persona.id === activePersona.id) return;
    setActivePersona(persona);
    setMessages([
      {
        role: "assistant",
        content: persona.greeting,
      },
    ]);
  };

  return (
    <div className="spatial-chatbot fixed bottom-6 right-6 z-50 font-[family-name:var(--font-body)]">
      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="spatial-chat-fab w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20 flex items-center justify-center cursor-pointer border border-white/10 select-none relative group"
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={24} />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-primary animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hover label */}
        {!isOpen && (
          <div className="absolute right-16 bg-card border border-border text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Chat with AI Twin
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="spatial-chat-panel absolute bottom-18 right-0 w-[min(340px,calc(100vw-32px))] sm:w-[380px] h-[min(540px,calc(100dvh-120px))] rounded-2xl border border-border/60 shadow-2xl bg-card overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/10 via-secondary/15 to-accent/10 border-b border-border/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/10 relative">
                  <Bot size={16} className="text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-[family-name:var(--font-heading)] leading-none text-foreground flex items-center gap-1.5">
                    {activePersona.label}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1 inline-block">Online • Powered by Llama 3.3</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close chat window"
              >
                <X size={18} />
              </button>
            </div>

            {/* Persona Selector Panel */}
            <div className="px-3 py-2 bg-muted/40 border-b border-border/40 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 select-none">
              {PERSONAS.map((p) => {
                const Icon = p.icon;
                const isSelected = activePersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePersonaChange(p)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={10} />
                    {p.name}
                  </button>
                );
              })}
            </div>

            {/* Messages Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 relative select-text custom-scrollbar">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern bg-[size:20px_20px]" />
              
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isUser
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[75%] ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                          : "bg-muted text-foreground rounded-tl-none border border-border/30"
                      }`}
                    >
                      {formatMessage(msg.content)}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Bot size={13} />
                  </div>
                  <div className="p-3 bg-muted text-foreground rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-border/40 bg-card/60 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                name="portfolio-question"
                aria-label="Ask Kunal's AI twin a question"
                autoComplete="off"
                placeholder="Ask about projects, skills, experience…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-muted/50 focus:bg-muted border border-border/60 focus:border-primary/50 text-foreground text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-[background-color,border-color,box-shadow] duration-200"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center cursor-pointer transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 shrink-0 shadow-md shadow-primary/10"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
