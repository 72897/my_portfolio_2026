import type { IProject, ICertificate, IExperience } from "@/types";

export const siteConfig = {
  name: "Kunal Singh",
  title: "AI Engineer | Full Stack Developer",
  description:
    "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications. B.Tech CSE Graduate from Gautam Buddha University with hands-on experience in Python, React.js, Node.js, and modern AI/ML frameworks.",
  url: "https://kunalsingh.dev",
  email: "kunalsingh203001@gmail.com",
  phone: "9456473642",
  location: "Greater Noida, Uttar Pradesh, India",
  links: {
    github: "https://github.com/72897",
    linkedin: "https://www.linkedin.com/in/kunal-singh-454368289/",
    leetcode: "https://leetcode.com/u/kunal26_7/",
    resume: "https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing",
  },
  githubUsername: "72897",
  leetcodeUsername: "kunal26_7",
};

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "GitHub", href: "/github" },
  { name: "LeetCode", href: "/leetcode" },
  { name: "Certificates", href: "/certificates" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const skillCategories = [
  {
    category: "Programming Languages",
    skills: [
      { name: "C++", icon: "code-2" },
      { name: "Python", icon: "terminal" },
      { name: "SQL", icon: "database" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React.js", icon: "atom" },
      { name: "Next.js", icon: "layout" },
      { name: "HTML", icon: "file-code" },
      { name: "CSS", icon: "palette" },
      { name: "Tailwind CSS", icon: "wind" },
      { name: "TypeScript", icon: "file-type" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", icon: "server" },
      { name: "Express.js", icon: "route" },
      { name: "REST API Design", icon: "network" },
    ],
  },
  {
    category: "Database & Cloud",
    skills: [
      { name: "MongoDB", icon: "database" },
      { name: "SQL", icon: "table" },
      { name: "ChromaDB", icon: "search" },
      { name: "Firebase", icon: "flame" },
    ],
  },
  {
    category: "AI/ML & Frameworks",
    skills: [
      { name: "TensorFlow", icon: "brain" },
      { name: "PyTorch", icon: "cpu" },
      { name: "LangChain", icon: "link" },
      { name: "Hugging Face", icon: "smile" },
      { name: "Large Language Models (LLMs)", icon: "bot" },
      { name: "Generative AI", icon: "zap" },
      { name: "NumPy", icon: "calculator" },
      { name: "Pandas", icon: "bar-chart-3" },
      { name: "Streamlit", icon: "monitor" },
    ],
  },
  {
    category: "AI/ML Techniques",
    skills: [
      { name: "Prompt Engineering", icon: "terminal" },
      { name: "Retrieval Augmented Generation (RAG)", icon: "search" },
      { name: "Vector Search & Embeddings", icon: "scatter-chart" },
      { name: "Fine-tuning", icon: "settings" },
      { name: "NLP", icon: "message-square" },
      { name: "Neural Networks", icon: "git-branch" },
      { name: "Workflow Automation", icon: "workflow" },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git", icon: "git-merge" },
      { name: "GitHub", icon: "github" },
      { name: "Postman", icon: "send" },
      { name: "Google Sheets", icon: "sheet" },
      { name: "Codex", icon: "code-2" },
    ],
  },
];

export const experiences: IExperience[] = [
  {
    company: "Manipal Business Solution",
    role: "AI Intern",
    type: "Internship",
    location: "Noida",
    startDate: "Apr 2026",
    endDate: "Present",
    current: true,
    bullets: [
      "Automated business workflows with Python, APIs, and Google Sheets, cutting manual reporting effort by 90%.",
      "Analyzed operational datasets and developed KPI reports to generate insights for leadership and process optimization.",
      "Refined conversational AI workflows through prompt optimization, intent validation, and response evaluation, increasing answer accuracy by 25%.",
      "Trained task-specific models on labeled datasets, error diagnostics, and performance benchmarking to strengthen output quality.",
    ],
    technologies: ["Python", "APIs", "Google Sheets", "AI/ML", "Prompt Engineering"],
  },
  {
    company: "Thales Group",
    role: "Engineering Intern",
    type: "Internship",
    location: "Noida",
    startDate: "Jun 2025",
    endDate: "Jul 2025",
    current: false,
    bullets: [
      "Designed and deployed a Generative AI platform with Google Gemini and OpenAI APIs, embedding LLM capabilities into enterprise NLP pipelines.",
      "Formulated prompt templates and tuned inference processes to increase LLM output relevance by 30%.",
      "Produced a demo-ready capstone with technical documentation and cross-functional feedback integration.",
      "Conducted data analysis and model fine-tuning with Python and TensorFlow, reducing processing latency by 25%.",
    ],
    technologies: ["Python", "TensorFlow", "Google Gemini", "OpenAI", "NLP", "LLM"],
  },
  {
    company: "MI Matdar",
    role: "Full Stack Developer Intern",
    type: "Internship",
    location: "Maharashtra",
    startDate: "Feb 2025",
    endDate: "Apr 2025",
    current: false,
    bullets: [
      "Constructed a responsive frontend using React.js and Tailwind CSS, resolving UI/UX bugs and implementing lazy loading to optimize page load times.",
      "Built scalable backend REST APIs with Node.js and Express.js, boosting response time by 40%.",
      "Collaborated in an Agile 7-member team to deploy builds with Vercel and Netlify, maintaining 95% test coverage.",
      "Integrated MongoDB database with schema design and query optimization, handling user records while improving data retrieval efficiency by 35%.",
    ],
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Vercel"],
  },
];

export const projects: IProject[] = [
  {
    title: "StudyMate",
    slug: "studymate",
    description: "GenAI Powered Study Assistant with RAG, semantic search, and contextual PDF summarization.",
    longDescription: "A document intelligence application that leverages Retrieval Augmented Generation (RAG), semantic search, embeddings, and ChromaDB for contextual PDF summarization and question answering. Tuned retrieval pipelines with LLM and Hugging Face models enable 40% faster document review and 70% reduced review effort.",
    techStack: ["Python", "LangChain", "Groq", "Gradio", "ChromaDB", "Hugging Face"],
    features: [
      "Document intelligence with RAG and semantic search",
      "Embeddings and ChromaDB for contextual PDF Q&A",
      "40% faster document review with tuned retrieval pipelines",
      "70% reduced document review effort",
    ],
    githubUrl: "https://github.com/72897/study-mate",
    liveUrl: "",
    category: "AI",
    featured: true,
    image: "/studymate_dashboard.png",
    metrics: {
      latency: "140ms",
      costReduction: "70%",
      accuracy: "94.2%",
      throughput: "50 docs/min",
      guardrails: "LlamaGuard v2",
      tokensProcessed: "4.2M/mo"
    },
    challenges: "Processing dense, multi-format PDFs introduced noise, high LLM token costs, and slow response times due to unoptimized chunking strategies.",
    solutions: "Built a custom chunking pipeline using LangChain's recursive character text splitter. Cached semantic embeddings in ChromaDB to reduce LLM API roundtrips, and added a context routing mechanism to choose the best retriever.",
    architectureSteps: [
      { title: "PDF Ingestion", description: "Parser extracts raw text and elements from document upload." },
      { title: "Semantic Chunking", description: "Recursively chunks document text with dynamic overlap size." },
      { title: "Embedding Generation", description: "Hugging Face embeddings map text chunks into vector coordinates." },
      { title: "ChromaDB Storage", description: "Saves high-dimensional vectors for fast semantic query retrieval." },
      { title: "RAG Context Retrieval", description: "Filters relevant context chunks using cosine similarity." },
      { title: "LLM Orchestration & Guardrails", description: "Injects context and query into Groq/Gemini, validated via LlamaGuard." }
    ]
  },
  {
    title: "AlphaCare",
    slug: "alphacare",
    description: "AI-Powered Healthcare Chatbot with real-time symptom screening and voice interaction.",
    longDescription: "A real-time healthcare assistant powered by Google Gemini, Vapi API, Firebase, and TypeScript for symptom screening and voice interaction. Features a voice-first interface and personalized feedback system.",
    techStack: ["Next.js", "React.js", "Node.js", "Firebase", "Tailwind CSS", "Vapi API", "Google Gemini", "TypeScript"],
    features: [
      "Real-time healthcare assistant powered by Gemini",
      "Voice-first interface using Vapi API",
      "Personalized feedback system",
      "45% better voice-based interaction flow",
    ],
    githubUrl: "",
    liveUrl: "",
    category: "AI",
    featured: true,
    image: "/alphacare_dashboard.png",
    metrics: {
      latency: "280ms (Voice RT)",
      accuracy: "96.5% Screening",
      costReduction: "35% Support Cost",
      throughput: "120 active calls/min",
      guardrails: "NeMo Guardrails & Custom Regex",
      tokensProcessed: "12M/mo"
    },
    challenges: "Voice-based screening suffered from high audio latency, transcription errors for complex medical terms, and state synchronization across Gemini and Vapi APIs.",
    solutions: "Optimized speech-to-text configurations, integrated Vapi API for sub-second streaming audio loopback, built a structured fallback state machine in Node.js, and implemented a custom LLM symptom validation layer.",
    architectureSteps: [
      { title: "Voice Input (WebRTC/SIP)", description: "Captures user speech audio streaming through browser client." },
      { title: "Speech-To-Text (Vapi API)", description: "Performs low-latency acoustic transcription to text input." },
      { title: "Gemini Orchestrator", description: "Processes user dialogue, performs clinical intent matching and screening." },
      { title: "Firebase State Store", description: "Updates patient session, symptoms log, and screening progress." },
      { title: "Text-To-Speech Output", description: "Synthesizes low-latency natural human-sounding voice response." }
    ]
  },
  {
    title: "Notion - Course Selling Application",
    slug: "notion-course-selling",
    description: "Course Selling Application with role-based dashboards, admin tools, and JWT authentication.",
    longDescription: "A secure course-selling platform with role-based dashboards and admin tools. Supports 50+ instructors to monetize learning content and reach students in underserved areas.",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    features: [
      "Secure course-selling platform with role-based access",
      "50+ instructors supported",
      "JWT-authenticated sessions with 98% test success",
      "20% faster API response time",
    ],
    githubUrl: "https://github.com/72897/Studynotion_course",
    liveUrl: "",
    category: "FullStack",
    featured: true,
    metrics: {
      latency: "65ms (API)",
      accuracy: "98.2% JWT Auth Flow",
      costReduction: "40% Server Cost",
      throughput: "1,200 req/sec",
      guardrails: "Express Rate Limit & CORS Control",
      tokensProcessed: "N/A"
    },
    challenges: "Securing role-based course monetization while maintaining fast loading of media assets. Slow API routes due to deep MongoDB population queries.",
    solutions: "Created strict JSON Web Token (JWT) auth middleware, optimized MongoDB aggregate pipelines with indexed search, and integrated lazy loading/assets compression to maximize rendering speeds.",
    architectureSteps: [
      { title: "Client Application", description: "React.js client captures student requests and handles global state." },
      { title: "Express.js Router", description: "Routes incoming API calls, validated by JWT security middleware." },
      { title: "Aggregate Controller", description: "Fetches optimized courses data using MongoDB aggregate lookup pipelines." },
      { title: "MongoDB Database", description: "Persists transactional profiles, enrollment records, and course info." }
    ]
  },
  {
    title: "Travel Planner",
    slug: "travel-planner",
    description: "Smart travel planning application for organizing trips and itineraries.",
    longDescription: "Smart travel planning application for organizing trips and itineraries with interactive user interfaces and full-stack MERN capabilities.",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js"],
    features: [
      "Intelligent trip planning and itinerary management",
      "Interactive UI with modern design",
      "Full-stack MERN application",
    ],
    githubUrl: "https://github.com/72897/travel-planner",
    liveUrl: "",
    category: "FullStack",
    featured: false,
    metrics: {
      latency: "110ms (Map/API)",
      accuracy: "92% Recommendation",
      costReduction: "N/A",
      throughput: "350 plans/hr",
      guardrails: "Sanitize HTML & Query Limits",
      tokensProcessed: "N/A"
    },
    challenges: "Consolidating dynamic routes, weather data, and location markers into an unified itinerary structure without rate-limiting frontend performance.",
    solutions: "Utilized a MERN routing layout, implemented backend caching of external API responses to avoid rate limits, and created dynamic state managers for map display update hooks.",
    architectureSteps: [
      { title: "Itinerary Builder UI", description: "Accepts travel constraints, duration, and preferences." },
      { title: "API Gateway Cache", description: "Retrieves external travel guides, weather forecasts, cached in memory." },
      { title: "MERN Engine Controller", description: "Generates optimal travel day timelines and maps geolocation coordinates." },
      { title: "MongoDB Store", description: "Stores and links private itineraries for shared user access." }
    ]
  },
];

export const certificates: ICertificate[] = [
  { title: "Google Cloud GenAI", organization: "Google Cloud", issueDate: "2024" },
  { title: "Advanced Software Engineering", organization: "Walmart USA - Forage", issueDate: "2024" },
  { title: "Deloitte Australia Technology", organization: "Deloitte - Forage", issueDate: "2024" },
  { title: "AWS Cloud Practitioner Essentials", organization: "Amazon Web Services", issueDate: "2024" },
  { title: "Generative AI", organization: "HP Life", issueDate: "2024" },
  { title: "API Certification", organization: "Postman", issueDate: "2024" },
];

export interface IEducation {
  institution: string;
  degree: string;
  location?: string;
  period: string;
  coursework?: string[];
}

export const education: IEducation[] = [
  {
    institution: "Gautam Buddha University",
    degree: "Bachelor of Technology in Computer Science",
    location: "Greater Noida, Uttar Pradesh, India",
    period: "Aug 2022 – Jun 2026",
    coursework: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Database Management Systems",
      "Operating Systems",
      "Machine Learning",
      "Natural Language Processing",
    ],
  },
  {
    institution: "St. Aerjay Public School",
    degree: "12th (Senior Secondary) - PCM",
    period: "April 2020 – August 2022",
  },
  {
    institution: "Nirmala Convent School",
    degree: "10th (Secondary Education)",
    period: "March 2008 – March 2020",
  },
];

// Fallback GitHub data
export const fallbackGitHub = {
  username: "72897",
  name: "Kunal Singh",
  bio: "AI Engineer | Full Stack Developer",
  publicRepos: 15,
  followers: 10,
  following: 5,
  topRepos: [
    { name: "study-mate", description: "GenAI Powered Study Assistant", language: "Python", stars: 2 },
    { name: "travel-planner", description: "Smart Travel Planner", language: "JavaScript", stars: 1 },
    { name: "Studynotion_course", description: "Course Selling Platform", language: "JavaScript", stars: 3 },
  ],
  languages: { Python: 35, JavaScript: 30, TypeScript: 20, "C++": 10, HTML: 5 },
};

// Fallback LeetCode data
export const fallbackLeetCode = {
  username: "kunal26_7",
  totalSolved: 150,
  easySolved: 70,
  mediumSolved: 60,
  hardSolved: 20,
  ranking: 250000,
  totalQuestions: { easy: 800, medium: 1600, hard: 700 },
};
