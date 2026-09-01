"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Code2, Terminal as TerminalIcon, X, Maximize2, Minimize2 } from "lucide-react";
import { soundManager } from "@/lib/sounds";

interface CommandLog {
  id: string;
  type: "input" | "output" | "error" | "success";
  text: string | React.ReactNode;
}

const WELCOME_BANNER = `
  ██╗  ██╗██╗   ██╗███╗   ██╗ █████╗ ██╗         ██████╗ ███████╗
  ██║ ██╔╝██║   ██║████╗  ██║██╔══██╗██║        ██╔═══██╗██╔════╝
  █████═╝ ██║   ██║██╔██╗ ██║███████║██║        ██║   ██║███████╗
  ██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║        ██║   ██║╚════██║
  ██║ ╚██╗╚██████╔╝██║ ╚████║██║  ██║███████╗   ╚██████╔╝███████║
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝    ╚═════╝ ╚══════╝
  Kunal Singh - AI Engineer & Full Stack Developer (v2.6.0)
  Type "help" to see available commands or "sudo hire-me" to celebrate!
`;

export function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: "init-banner", type: "output", text: WELCOME_BANNER },
  ]);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Toggle listener on tilde key (~ / `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (target === inputRef.current && e.key === "Escape") {
          setIsOpen(false);
        }
        return;
      }

      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) soundManager.playPop();
          return next;
        });
      }
    };

    const handleCustomOpen = () => {
      soundManager.playPop();
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-terminal-modal", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-terminal-modal", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, logs]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    soundManager.playClick();
    const newLogs: CommandLog[] = [
      ...logs,
      { id: `${Date.now()}-in`, type: "input", text: `kunal@dev:~$ ${cmd}` },
    ];

    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const lower = cmd.toLowerCase();

    if (lower === "clear" || lower === "cls") {
      setLogs([]);
      setInputVal("");
      return;
    }

    if (lower === "help") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1 py-1">
            <p className="text-primary font-bold">Available Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
              <div><span className="text-foreground font-semibold">whoami / about</span> - Summary & bio</div>
              <div><span className="text-foreground font-semibold">skills</span> - Technical stack & tools</div>
              <div><span className="text-foreground font-semibold">projects</span> - Key featured projects</div>
              <div><span className="text-foreground font-semibold">exp / work</span> - Work experience history</div>
              <div><span className="text-foreground font-semibold">resume</span> - Resume credentials link</div>
              <div><span className="text-foreground font-semibold">contact</span> - Email & phone info</div>
              <div><span className="text-foreground font-semibold">socials</span> - GitHub, LinkedIn, LeetCode</div>
              <div><span className="text-foreground font-semibold">clear</span> - Clear terminal output</div>
              <div className="sm:col-span-2 text-emerald-400 font-semibold"><span className="text-yellow-400 font-bold">sudo hire-me</span> - Hire Kunal & trigger celebration</div>
            </div>
          </div>
        ),
      });
    } else if (lower === "whoami" || lower === "about") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1">
            <p className="text-foreground font-semibold">Kunal Singh - AI Engineer & Full Stack Developer</p>
            <p className="text-muted-foreground">Specializing in Generative AI, RAG architecture, LLM orchestration, and robust MERN web systems.</p>
            <p className="text-xs text-primary">Greater Noida, UP, India | B.Tech CSE @ Gautam Buddha University (2022-2026)</p>
          </div>
        ),
      });
    } else if (lower === "skills") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-1 text-xs">
            <p><span className="text-primary font-bold">Languages:</span> Python, C++, SQL, TypeScript, JavaScript</p>
            <p><span className="text-primary font-bold">AI / GenAI:</span> LangChain, ChromaDB, RAG, Prompt Engineering, Groq, Google Gemini, TensorFlow</p>
            <p><span className="text-primary font-bold">Full Stack:</span> React.js, Next.js, Node.js, Express.js, Tailwind CSS, MongoDB, REST APIs</p>
            <p><span className="text-primary font-bold">DevOps & Tools:</span> Git, GitHub, Postman, Vercel, Firebase, Google Sheets</p>
          </div>
        ),
      });
    } else if (lower === "projects") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-emerald-400 font-bold">1. StudyMate:</span> GenAI Study Assistant (RAG, ChromaDB, LangChain, Python).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">2. AlphaCare:</span> AI Healthcare Voice Symptom Triage (Next.js, Vapi API, Gemini).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">3. Buddhimaan:</span> AI Content & Image Generation Platform (OpenAI, Stable Diffusion, Node.js).
            </div>
            <div>
              <span className="text-emerald-400 font-bold">4. StudyNotion:</span> Full-Stack Course Selling Platform (MERN, JWT).
            </div>
          </div>
        ),
      });
    } else if (lower === "exp" || lower === "experience" || lower === "work") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-yellow-400 font-bold">★ Software Engineer</span> @ <span className="text-foreground font-semibold">Technocratiq Digital Pvt. Ltd.</span> (Jul 2026 - Present | Delhi)
              <p className="text-muted-foreground">Orchestrated 47+ automation pipelines across marketing, CRM, analytics, and internal workflows.</p>
            </div>
            <div>
              <span className="text-primary font-bold">• AI Intern</span> @ <span className="text-foreground">Manipal Business Solution</span> (Apr 2026 - Jun 2026 | Noida)
              <p className="text-muted-foreground">Automated reporting cut manual effort by 90%; refined conversational AI accuracy by 25%.</p>
            </div>
            <div>
              <span className="text-primary font-bold">• Engineering Intern</span> @ <span className="text-foreground">Thales Group</span> (Jun 2025 - Jul 2025 | Noida)
              <p className="text-muted-foreground">Built GenAI platform using Google Gemini & OpenAI; reduced inference latency by 25%.</p>
            </div>
            <div>
              <span className="text-primary font-bold">• Full Stack Intern</span> @ <span className="text-foreground">MI Matdar</span> (Feb 2025 - Apr 2025 | Maharashtra)
            </div>
          </div>
        ),
      });
    } else if (lower === "resume") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p className="text-foreground font-semibold">Resume Link:</p>
            <a
              href="https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              https://drive.google.com/.../view
            </a>
          </div>
        ),
      });
    } else if (lower === "contact") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p><span className="text-foreground">Email:</span> kunalsingh203001@gmail.com</p>
            <p><span className="text-foreground">Phone:</span> +91 9456473642</p>
            <p><span className="text-foreground">Website:</span> https://kunalsingh.dev</p>
          </div>
        ),
      });
    } else if (lower === "socials") {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "output",
        text: (
          <div className="text-xs space-y-1">
            <p>GitHub: github.com/72897</p>
            <p>LinkedIn: linkedin.com/in/kunal-singh-454368289/</p>
            <p>LeetCode: leetcode.com/u/kunal26_7/</p>
          </div>
        ),
      });
    } else if (lower === "sudo hire-me" || lower === "hire-me" || lower === "hire") {
      soundManager.playSuccess();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"],
      });

      newLogs.push({
        id: `${Date.now()}-out`,
        type: "success",
        text: (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl space-y-2 my-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Code2 size={16} />
              <span>Permission Granted: OFFER_SUBMITTED_SUCCESSFULLY!</span>
            </div>
            <p className="text-xs text-foreground">
              Thank you for considering me! Let&apos;s talk compensation, scope, and technical roadmap:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="mailto:kunalsingh203001@gmail.com?subject=Job%20Opportunity%20for%20Kunal%20Singh"
                className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded text-[11px] hover:opacity-90 transition"
              >
                Send Email Now
              </a>
              <a
                href="https://www.linkedin.com/in/kunal-singh-454368289/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted text-foreground border border-border px-3 py-1 rounded text-[11px] hover:bg-muted/80 transition"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        ),
      });
    } else {
      newLogs.push({
        id: `${Date.now()}-out`,
        type: "error",
        text: `zsh: command not found: "${cmd}". Type "help" for a list of commands.`,
      });
    }

    setLogs(newLogs);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInputVal(history[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal("");
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className={`terminal-shell relative flex flex-col bg-[#0b0f19] border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 font-mono transition-all duration-200 ${
              isMaximized
                ? "w-full h-full max-w-none max-h-none rounded-none"
                : "w-full max-w-3xl h-[480px] sm:h-[520px]"
            }`}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-b border-border/40 select-none">
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-red-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Close Terminal"
                />
                <div
                  onClick={() => setLogs([])}
                  className="w-3 h-3 rounded-full bg-yellow-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Clear Output"
                />
                <div
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="w-3 h-3 rounded-full bg-green-500/90 hover:opacity-80 cursor-pointer transition"
                  title="Toggle Maximize"
                />
                <span className="ml-3 text-xs text-muted-foreground/80 flex items-center gap-1.5">
                  <TerminalIcon size={13} className="text-primary" />
                  <span>kunal@dev-box: ~ (zsh)</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1 hover:text-foreground transition cursor-pointer"
                >
                  {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:text-foreground transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-2 text-slate-200">
              {logs.map((log) => {
                if (log.type === "input") {
                  return (
                    <div key={log.id} className="text-primary font-bold">
                      {log.text}
                    </div>
                  );
                }
                if (log.type === "error") {
                  return (
                    <div key={log.id} className="text-rose-400">
                      {log.text}
                    </div>
                  );
                }
                if (typeof log.text === "string" && log.id === "init-banner") {
                  return (
                    <pre key={log.id} className="text-[9px] sm:text-[10.5px] leading-none text-emerald-400 overflow-x-auto whitespace-pre font-mono select-none">
                      {log.text}
                    </pre>
                  );
                }
                return (
                  <div key={log.id} className="text-slate-300">
                    {log.text}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Terminal Input Prompt */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#0d121f] border-t border-border/40">
              <span className="text-emerald-400 font-bold shrink-0">kunal@dev:~$</span>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command (try: help, skills, sudo hire-me)..."
                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono text-xs"
              />
              <span className="w-2 h-4 bg-primary animate-pulse shrink-0" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
