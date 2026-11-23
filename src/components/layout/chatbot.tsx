"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Send, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 12;

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, isLoading, failed]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (pathname.startsWith("/admin")) return null;

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const history: Message[] = [...messages, { role: "user", content: question }];
    setInput("");
    setFailed(false);
    setMessages(history);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-MAX_HISTORY) }),
      });
      const data: { message?: string } | null = response.ok ? await response.json() : null;
      const reply = data?.message?.trim();
      if (reply) {
        setMessages([...history, { role: "assistant", content: reply }]);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="grid size-14 cursor-pointer place-items-center rounded-2xl border border-white/10 bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        aria-controls="site-chat"
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <MessageSquare size={24} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <section
          id="site-chat"
          aria-label="Chat about Kunal's work"
          className="absolute bottom-[4.5rem] right-0 flex h-[min(520px,calc(100dvh-120px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">Ask about my work</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Answers are AI-generated and can be wrong.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div
            data-lenis-prevent
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Ask about my projects, experience or skills. For anything else,
                use the{" "}
                <Link href="/contact" className="font-semibold text-primary underline">
                  contact page
                </Link>
                .
              </p>
            ) : null}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isLoading ? (
              <p className="text-xs text-muted-foreground">Waiting for a reply…</p>
            ) : null}

            {failed ? (
              <p role="alert" className="rounded-xl border border-border bg-muted px-3 py-2 text-xs leading-relaxed text-foreground">
                The chat is unavailable right now. You can reach me through the{" "}
                <Link href="/contact" className="font-semibold text-primary underline">
                  contact page
                </Link>{" "}
                instead.
              </p>
            ) : null}

            <div ref={endRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex shrink-0 items-center gap-2 border-t border-border p-3"
          >
            <label htmlFor="chat-question" className="sr-only">
              Your question
            </label>
            <input
              ref={inputRef}
              id="chat-question"
              type="text"
              autoComplete="off"
              maxLength={500}
              placeholder="Ask about projects, skills, experience"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={14} aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
