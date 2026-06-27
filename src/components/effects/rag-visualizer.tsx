"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, Cpu, FileText, ArrowRight, Layers, HelpCircle, CheckCircle, Terminal as TermIcon } from "lucide-react";

interface DocumentPreset {
  title: string;
  text: string;
  chunks: { id: string; content: string; vector: string }[];
  queries: { question: string; targetChunkId: string; score: number; answer: string }[];
}

export function RagVisualizer() {
  const PRESETS: DocumentPreset[] = [
    {
      title: "📄 Thales Internship Records",
      text: "Thales Group (Engineering Intern, Jun 2025 - Jul 2025, Noida): Designed and deployed an enterprise Generative AI platform using Google Gemini and OpenAI API endpoints. Tuned LLM inference prompts, boosting output relevance by 30% and cutting latency by 25%. Built robust NLP pipelines.",
      chunks: [
        { 
          id: "C1", 
          content: "Thales Group (Engineering Intern, Jun 2025 - Jul 2025, Noida): Designed and deployed an enterprise Generative AI platform using Google Gemini and OpenAI API endpoints.",
          vector: "[0.15, -0.42, 0.88, 0.03, -0.21, 0.54, 0.77]"
        },
        { 
          id: "C2", 
          content: "Tuned LLM inference prompts, boosting output relevance by 30% and cutting latency by 25%. Built robust NLP pipelines and integrated with cross-functional pipelines.",
          vector: "[-0.08, 0.51, 0.33, 0.94, -0.12, 0.19, -0.36]"
        }
      ],
      queries: [
        {
          question: "What did Kunal build at Thales?",
          targetChunkId: "C1",
          score: 0.91,
          answer: "At Thales, Kunal designed and deployed an enterprise Generative AI platform integrating Google Gemini and OpenAI API endpoints into their NLP pipelines."
        },
        {
          question: "What performance metrics did he achieve?",
          targetChunkId: "C2",
          score: 0.88,
          answer: "By tuning LLM inference prompts at Thales, Kunal achieved a 30% increase in output relevance and reduced processing latency by 25%."
        }
      ]
    },
    {
      title: "📄 StudyMate Project Specs",
      text: "StudyMate is a GenAI Study Assistant. It utilizes Retrieval-Augmented Generation (RAG) to enable semantic search, document retrieval, and PDF summarization. Built using Python, LangChain, Groq, Gradio, ChromaDB, and Hugging Face. Saves 40% time in document reviews.",
      chunks: [
        { 
          id: "C1", 
          content: "StudyMate (GenAI Study Assistant): RAG assistant, semantic search, and PDF summarization built using Python, LangChain, Groq, Gradio, ChromaDB, and Hugging Face.",
          vector: "[0.62, 0.11, -0.19, 0.73, 0.45, -0.82, 0.09]"
        },
        { 
          id: "C2", 
          content: "Saves 40% time in document reviews by automating context-aware semantic search and document retrieval across long study materials.",
          vector: "[0.04, -0.32, 0.59, 0.28, -0.66, 0.15, 0.92]"
        }
      ],
      queries: [
        {
          question: "How does StudyMate save time?",
          targetChunkId: "C2",
          score: 0.94,
          answer: "StudyMate saves 40% of time in document reviews by automating semantic search and context-aware PDF document retrieval."
        },
        {
          question: "What is the tech stack of StudyMate?",
          targetChunkId: "C1",
          score: 0.89,
          answer: "StudyMate is built on Python, LangChain, Groq, Gradio, ChromaDB, and Hugging Face embeddings."
        }
      ]
    }
  ];

  const [step, setStep] = useState(1);
  const [selectedDocIdx, setSelectedDocIdx] = useState(0);
  const [activeQueryIdx, setActiveQueryIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const doc = PRESETS[selectedDocIdx];
  const query = doc.queries[activeQueryIdx];

  const triggerTypewriter = (text: string) => {
    setIsTyping(true);
    setTypedAnswer("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= text.length) {
        setTypedAnswer(text);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setTypedAnswer(text.slice(0, i));
      }
    }, 15);
  };

  const handleNextStep = () => {
    if (step < 5) {
      const next = step + 1;
      setStep(next);
      if (next === 5) {
        triggerTypewriter(query.answer);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const selectDoc = (idx: number) => {
    setSelectedDocIdx(idx);
    setActiveQueryIdx(0);
    setStep(1);
    setTypedAnswer("");
  };

  const selectQuery = (idx: number) => {
    setActiveQueryIdx(idx);
    if (step === 5) {
      triggerTypewriter(doc.queries[idx].answer);
    }
  };

  const stepTitles = [
    "1. Document Ingestion",
    "2. Semantic Chunking",
    "3. Embeddings & Storage",
    "4. Vector Retrieval",
    "5. Augmented Generation"
  ];

  return (
    <div className="w-full flex flex-col bg-black/40 border border-border/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative layout grid */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-grid-pattern bg-[size:15px_15px]" />
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Stepper Header Progress */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/20 pb-6 mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {stepTitles.map((title, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isCompleted = step > num;
            return (
              <div
                key={num}
                onClick={() => {
                  setStep(num);
                  if (num === 5) triggerTypewriter(query.answer);
                }}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/15" 
                    : isCompleted
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-muted/20 border-border/30 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {title}
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-3.5 py-1.5 rounded-lg bg-muted/40 border border-border hover:bg-muted text-foreground text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            disabled={step === 5}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 select-none cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Step Body (Dynamic View) */}
      <div className="min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Ingestion */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <FileText size={14} />
                <span>Step 1: Raw Document Ingestion</span>
              </div>
              <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">Select a source document to ingest</h3>
              
              <div className="flex gap-3">
                {PRESETS.map((p, idx) => (
                  <button
                    key={p.title}
                    onClick={() => selectDoc(idx)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      selectedDocIdx === idx 
                        ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5" 
                        : "bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>

              <div className="border border-border/40 rounded-2xl p-4 bg-muted/10 font-mono text-xs leading-relaxed text-muted-foreground select-text max-w-3xl">
                <span className="text-primary font-bold"># raw_text_stream</span>
                <p className="mt-2 text-foreground font-sans leading-relaxed">{doc.text}</p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Semantic Chunking */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Layers size={14} />
                <span>Step 2: Semantic Tokenizer Chunking</span>
              </div>
              <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">Dividing raw text into contextual chunks</h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                We break long texts down by sentences and paragraph overlaps so context is preserved for the semantic database.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {doc.chunks.map((c, i) => (
                  <div key={c.id} className="border border-border/40 rounded-2xl p-4 bg-muted/10 flex flex-col justify-between gap-4 group hover:border-primary/20 transition-all">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        CHUNK_{c.id}
                      </span>
                      <p className="text-xs text-foreground mt-3 leading-relaxed font-sans">{c.content}</p>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground">Length: {c.content.length} chars</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Vector Embeddings */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Database size={14} />
                <span>Step 3: Vector Embedding & Storage</span>
              </div>
              <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">Converting chunks into high-dimensional vector coordinates</h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                An embedding model translates context into mathematical vectors to enable cosine distance similarity search in the db.
              </p>

              <div className="space-y-3 max-w-4xl">
                {doc.chunks.map((c) => (
                  <div key={c.id} className="border border-border/40 rounded-xl p-4 bg-muted/15 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-2">
                      <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        CHUNK_{c.id}
                      </span>
                    </div>
                    <div className="md:col-span-5 text-[11px] leading-relaxed text-foreground font-sans line-clamp-1 italic text-muted-foreground">
                      &quot;{c.content}&quot;
                    </div>
                    <div className="md:col-span-5">
                      <div className="bg-black/40 border border-border/40 rounded-lg p-2 font-mono text-[10px] text-emerald-400 select-all overflow-x-auto whitespace-nowrap">
                        {c.vector}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Semantic Query Search */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Search size={14} />
                <span>Step 4: Vector Index Query Retrieval</span>
              </div>
              <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">Query matching via Cosine Distance Similarity</h3>
              
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select a Test Query:</span>
                <div className="flex gap-2">
                  {doc.queries.map((q, idx) => (
                    <button
                      key={q.question}
                      onClick={() => selectQuery(idx)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        activeQueryIdx === idx 
                          ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5" 
                          : "bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {q.question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl items-center pt-2">
                
                {/* Query representation */}
                <div className="md:col-span-5 border border-border/40 rounded-2xl p-4 bg-muted/10 space-y-3 h-full justify-between flex flex-col">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-primary"># query_term</span>
                    <p className="text-xs text-foreground font-mono mt-2 font-bold">&gt; {query.question}</p>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">Embedding generated dynamically...</span>
                </div>

                <div className="md:col-span-2 flex justify-center text-primary animate-pulse">
                  <ArrowRight size={24} className="rotate-90 md:rotate-0" />
                </div>

                {/* DB Match results */}
                <div className="md:col-span-5 border border-primary/20 rounded-2xl p-4 bg-primary/5 space-y-3 border-emerald-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-primary"># top_vector_match</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">SCORE: {query.score}</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-border/20 text-xs">
                    <span className="text-[9px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      CHUNK_{query.targetChunkId}
                    </span>
                    <p className="mt-2 text-foreground font-sans leading-relaxed text-[11px]">
                      {doc.chunks.find(c => c.id === query.targetChunkId)?.content}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 5: LLM Augmented Response */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider">
                <Cpu size={14} />
                <span>Step 5: Context-Augmented Prompt Completion</span>
              </div>
              <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">Generating the final answer with injection</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
                
                {/* Constructed Prompt Area */}
                <div className="border border-border/40 rounded-2xl p-4 bg-muted/10 space-y-3 flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-primary"># augmented_instruction_prompt</span>
                  <div className="bg-black/30 rounded-xl p-3 border border-border/20 font-mono text-[10px] leading-relaxed text-muted-foreground h-44 overflow-y-auto custom-scrollbar select-text">
                    <span className="text-primary font-bold">&lt;SYSTEM_INSTRUCTION&gt;</span>
                    <br />
                    Use the context to answer the user query:
                    <br />
                    <br />
                    <span className="text-primary font-bold">&lt;CONTEXT&gt;</span>
                    <br />
                    {doc.chunks.find(c => c.id === query.targetChunkId)?.content}
                    <br />
                    <br />
                    <span className="text-primary font-bold">&lt;USER_QUERY&gt;</span>
                    <br />
                    {query.question}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">Context is securely appended at runtime.</span>
                </div>

                {/* Model Console Output */}
                <div className="border border-primary/20 border-emerald-500/30 rounded-2xl p-4 bg-black/60 flex flex-col justify-between h-full">
                  <div className="flex items-center gap-2 border-b border-border/20 pb-2 text-[10px] font-mono text-muted-foreground">
                    <TermIcon size={12} className="text-primary" />
                    <span>LLM_ twin_ output</span>
                  </div>
                  
                  <div className="flex-1 p-3 font-mono text-xs leading-relaxed text-foreground select-text overflow-y-auto max-h-[140px] custom-scrollbar min-h-[100px]">
                    {typedAnswer}
                    {isTyping && (
                      <span className="w-1.5 h-3.5 bg-primary ml-1 inline-block animate-pulse align-middle" />
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10">
                    <CheckCircle size={10} />
                    <span>RAG pass success: Output verified against database vectors.</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
