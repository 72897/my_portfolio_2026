"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot } from "lucide-react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm Kunal's AI Twin. Ask me anything about his projects, skills, work experience, or education. How can I help you today?",
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
        body: JSON.stringify({ messages: chatHistory }),
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

  return (
    <div className="fixed bottom-6 right-6 z-50 font-[family-name:var(--font-body)]">
      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/20 flex items-center justify-center cursor-pointer border border-white/10 select-none relative group"
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
            className="absolute bottom-18 right-0 w-[340px] sm:w-[380px] h-[500px] rounded-2xl border border-border/60 shadow-2xl bg-card overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary/10 via-secondary/15 to-accent/10 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/10 relative">
                  <Bot size={16} className="text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-[family-name:var(--font-heading)] leading-none text-foreground flex items-center gap-1.5">
                    Kunal&apos;s AI Twin
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
                      {msg.content}
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
              className="p-3 border-t border-border/40 bg-card/60 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about projects, skills, experience..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-muted/50 focus:bg-muted border border-border/60 focus:border-primary/50 text-foreground text-xs rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all duration-200"
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
