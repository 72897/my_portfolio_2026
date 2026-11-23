import type {
  GitHubStats,
  ICertificate,
  IEducation,
  IExperience,
  ILanguage,
  IProject,
  LeetCodeStats,
} from "@/types";

/*
 * Site content. This file is the source of truth: pages fall back to it when
 * MongoDB is unreachable, and scripts/seed.ts writes it into the database.
 */

export const siteConfig = {
  name: "Kunal Singh",
  title: "Software Engineer: AI automation and full-stack web",
  description:
    "Software engineer at Technocratiq Digital, where I build the company's internal operations platform and the automations that run on it. I work across Python and TypeScript: REST integrations, scheduled jobs, LLM features and the dashboards people use every day. B.Tech in Computer Science, Gautam Buddha University (2026).",
  url: "https://www.kunaltechie.me",
  email: "kunalsingh203001@gmail.com",
  phone: "+91 9456473642",
  location: "Greater Noida, Uttar Pradesh, India",
  links: {
    github: "https://github.com/72897",
    linkedin: "https://www.linkedin.com/in/kunal-singh-454368289/",
    leetcode: "https://leetcode.com/u/kunal26_7/",
    resume: "/resume/Resume_Kunal_Singh.pdf",
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
    category: "Languages",
    skills: [
      { name: "Python", icon: "terminal" },
      { name: "TypeScript", icon: "file-type" },
      { name: "JavaScript", icon: "file-code" },
      { name: "C++", icon: "code-2" },
      { name: "SQL", icon: "database" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React.js", icon: "atom" },
      { name: "Next.js", icon: "layout" },
      { name: "Tailwind CSS", icon: "wind" },
      { name: "HTML", icon: "file-code" },
      { name: "CSS", icon: "palette" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", icon: "server" },
      { name: "Express.js", icon: "route" },
      { name: "REST API design", icon: "network" },
    ],
  },
  {
    category: "Data",
    skills: [
      { name: "MongoDB", icon: "database" },
      { name: "SQL", icon: "table" },
      { name: "ChromaDB", icon: "search" },
      { name: "Firebase", icon: "flame" },
    ],
  },
  {
    category: "AI/ML",
    skills: [
      { name: "LangChain", icon: "link" },
      { name: "Hugging Face Transformers", icon: "smile" },
      { name: "TensorFlow", icon: "brain" },
      { name: "PyTorch", icon: "cpu" },
      { name: "NumPy", icon: "calculator" },
      { name: "Pandas", icon: "bar-chart-3" },
      { name: "Streamlit", icon: "monitor" },
      { name: "RAG", icon: "search" },
      { name: "Vector embeddings", icon: "scatter-chart" },
      { name: "Prompt engineering", icon: "terminal" },
      { name: "Fine-tuning", icon: "settings" },
      { name: "NLP", icon: "message-square" },
    ],
  },
  {
    category: "Automation and integrations",
    skills: [
      { name: "n8n", icon: "workflow" },
      { name: "Dify", icon: "bot" },
      { name: "MCP servers", icon: "server" },
      { name: "Workflow automation", icon: "workflow" },
      { name: "GA4 and Search Console APIs", icon: "bar-chart-3" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: "git-merge" },
      { name: "GitHub", icon: "github" },
      { name: "Postman", icon: "send" },
      { name: "Google Sheets", icon: "sheet" },
      { name: "Vercel", icon: "zap" },
    ],
  },
];

export const experiences: IExperience[] = [
  {
    company: "Technocratiq Digital Pvt. Ltd. (TIQ)",
    role: "Software Engineer",
    type: "Full-time",
    location: "Delhi",
    startDate: "Jul 2026",
    endDate: "Present",
    current: true,
    bullets: [
      "Build and maintain TIQ, the agency's internal operations platform: one dashboard for clients and projects, analytics, SEO, leads, sales, HR and task automation, with per-page role-based access.",
      "Shipped 47+ automations across marketing, CRM, analytics, lead generation and internal operations, running as Python jobs, n8n and Dify workflows and an event outbox, each with run history and failure logs.",
      "Integrated Google Analytics 4, Google Search Console, SE Ranking, Publer, Flowlu (tasks and CRM) and Zoho Cliq through their REST APIs, with scheduled sync jobs and job locking to keep reporting data current.",
      "Built scheduled reporting on top of Flowlu tasks: morning and evening digests, a weekly workload report, reminders and sales pipeline snapshots delivered to the team.",
      "Built lead-generation tools: Google Maps and LinkedIn lead finders with batch jobs, enrichment, an approval step before each run and consent tracking, plus influencer discovery for social campaigns.",
      "Exposed the platform to AI assistants through an MCP server, so staff can query analytics and manage tasks in plain language; every write goes through a preview and an explicit approval, under the user's own permissions.",
      "Built the HR module: employee records, onboarding and offboarding checklists, access requests with approvals and an audit log.",
    ],
    technologies: [
      "Python",
      "TypeScript",
      "Node.js",
      "Next.js",
      "REST APIs",
      "n8n",
      "Dify",
      "MCP",
      "GA4 API",
      "Search Console API",
    ],
  },
  {
    company: "Manipal Business Solution",
    role: "AI Intern",
    type: "Internship",
    location: "Noida",
    startDate: "Apr 2026",
    endDate: "Jun 2026",
    current: false,
    bullets: [
      "Automated business workflows with Python, APIs and Google Sheets, cutting manual reporting effort by 90%.",
      "Analysed operational datasets and built KPI reports for leadership.",
      "Improved conversational AI flows through prompt changes, intent validation and response evaluation, raising answer accuracy by 25%.",
      "Trained task-specific models on labelled datasets and benchmarked them to find and fix error patterns.",
    ],
    technologies: ["Python", "REST APIs", "Google Sheets", "Prompt Engineering"],
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
      "Built and deployed a generative AI platform on Google Gemini and OpenAI APIs, adding LLM features to enterprise NLP pipelines.",
      "Wrote prompt templates and tuned inference settings, improving output relevance by 30%.",
      "Fine-tuned models and analysed data with Python and TensorFlow, reducing processing latency by 25%.",
      "Delivered a demo-ready capstone with technical documentation.",
    ],
    technologies: ["Python", "TensorFlow", "Google Gemini", "OpenAI API", "NLP"],
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
      "Built a responsive frontend in React.js and Tailwind CSS, fixed UI bugs and added lazy loading to cut page load times.",
      "Built REST APIs with Node.js and Express.js, improving response time by 40%.",
      "Designed MongoDB schemas and optimised queries, improving data retrieval by 35%.",
      "Worked in a 7-person Agile team, deploying to Vercel and Netlify with 95% test coverage.",
    ],
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Vercel"],
  },
];

export const projects: IProject[] = [
  {
    title: "TIQ Platform",
    slug: "tiq-platform",
    description: "Internal operations platform for a digital marketing agency.",
    longDescription:
      "The internal operations platform of a digital marketing agency. It puts client records, analytics, SEO tracking, tasks, sales, leads, social scheduling and HR behind one dashboard, and includes an MCP server that exposes the platform to AI assistants with per-user permissions.",
    techStack: ["Next.js", "TypeScript", "Node.js", "Python", "n8n", "Dify", "MCP", "REST APIs"],
    features: [
      "Client Hub: client profiles, connected accounts, onboarding and saved analyses",
      "Analytics: GA4 and Search Console reporting with scheduled AI-written reports",
      "SE Ranking keyword tracking",
      "Flowlu tasks and scheduled reports",
      "Sales pipeline",
      "Leads, with Google Maps and LinkedIn finders",
      "Publer social scheduling",
      "Trend Intelligence and Influencer Discovery",
      "Employees/HR module",
      "Automations catalog",
      "MCP server that exposes the platform to AI assistants with per-user permissions",
    ],
    category: "FullStack",
    featured: true,
    role: "Software Engineer",
    year: "2026",
    status: "Internal",
  },
  {
    title: "StudyMate",
    slug: "studymate",
    description: "GenAI study assistant that summarises PDFs and answers questions about them.",
    longDescription:
      "A study assistant for PDF summarisation and question answering. It uses retrieval-augmented generation: documents are embedded, stored in ChromaDB and retrieved by semantic search before the LLM answers. It made document review 40% faster and cut review effort by 70%.",
    techStack: ["Python", "LangChain", "Groq", "Gradio", "ChromaDB", "Hugging Face"],
    features: [
      "PDF summarisation and Q&A with RAG",
      "Embeddings and ChromaDB semantic search",
      "40% faster document review",
      "70% less review effort",
    ],
    githubUrl: "https://github.com/72897/study-mate",
    category: "AI",
    featured: true,
    image: "/studymate_dashboard.png",
    year: "2025",
  },
  {
    title: "AlphaCare",
    slug: "alphacare",
    description: "AI healthcare assistant with real-time symptom screening and a voice-first interface.",
    longDescription:
      "A healthcare assistant that screens symptoms in real time through a voice-first interface and gives personalised feedback. I led the backend and the AI integration with Google Gemini and the Vapi API. The voice interaction flow improved by 45% and engagement rose by 35%.",
    techStack: [
      "Next.js",
      "React.js",
      "Node.js",
      "Firebase",
      "Tailwind CSS",
      "Vapi API",
      "Google Gemini",
      "TypeScript",
    ],
    features: [
      "Real-time symptom screening",
      "Voice-first interface built on the Vapi API",
      "Personalised feedback",
      "Voice interaction flow improved by 45%",
      "Engagement up 35%",
    ],
    githubUrl: "https://github.com/72897/alpha-care",
    liveUrl: "https://alpha-care.vercel.app",
    category: "AI",
    featured: true,
    image: "/alphacare_dashboard.png",
    role: "Backend and AI integration lead",
    year: "2025",
    status: "Live",
  },
  {
    title: "StudyNotion",
    slug: "notion-course-selling",
    description: "Course-selling platform with role-based dashboards, admin tools and JWT auth.",
    longDescription:
      "A course-selling platform with role-based dashboards, admin tools and JWT authentication that supports 50+ instructors. I built 70% of the core backend APIs and frontend modules, brought API response time down by 20% and reached a 98% test-case success rate across the auth flows.",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    features: [
      "Role-based dashboards and admin tools",
      "JWT authentication",
      "50+ instructors",
      "API response time down 20%",
      "98% test-case success across auth flows",
    ],
    githubUrl: "https://github.com/72897/Studynotion_course",
    liveUrl: "https://studynotion-course.vercel.app",
    category: "FullStack",
    featured: true,
    image: "/studynotion_preview.png",
    year: "2025",
    status: "Live",
  },
  {
    title: "Duli Interiors",
    slug: "duliinteriors",
    description: "Interior design and project management platform.",
    longDescription:
      "An interior design and project management platform. Clients explore AI concept moodboards, sketch rooms on a 2D floor planner with live area calculation, get area-based estimates and print-ready proposals, and book consultations.",
    techStack: [
      "Next.js",
      "Python",
      "Google Gemini",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "Three.js",
    ],
    features: [
      "AI concept moodboards",
      "2D floor planner with live area calculation",
      "Area-based estimates",
      "Print-ready proposals",
      "Consultation booking",
    ],
    githubUrl: "https://github.com/72897/duli-interiors",
    liveUrl: "https://duli-interiors.vercel.app",
    category: "FullStack",
    featured: true,
    year: "2026",
    status: "Live",
  },
  {
    title: "Buddhimaan",
    slug: "buddhimaan",
    description: "AI content creation platform for article writing and image generation.",
    longDescription:
      "An AI content creation platform for writing articles and generating images. Built with Next.js, Node.js, Express.js, MongoDB and the OpenAI API.",
    techStack: [
      "Next.js",
      "React.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "OpenAI API",
      "Tailwind CSS",
      "TypeScript",
    ],
    features: ["Article writing", "Image generation"],
    githubUrl: "https://github.com/72897/Bhuddhimaan",
    liveUrl: "https://bhuddhimaan-tpfp.vercel.app",
    category: "AI",
    featured: true,
    image: "/buddhimaan_preview.png",
    year: "2025",
    status: "Live",
  },
  {
    title: "BillFlow",
    slug: "billflow",
    description:
      "Invoicing app: build an invoice, send a link the client can pay without signing in, and track what is paid, outstanding and overdue.",
    longDescription:
      "An invoicing app that covers the full cycle from drafting an invoice to getting paid. Clients open a shareable link and pay without creating an account, and the dashboard shows earnings, outstanding amounts and overdue invoices.",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Gemini API", "Groq API"],
    features: [
      "Automated invoice numbering and server-side calculations",
      "Shareable invoices with payment and overdue tracking",
      "PDF generation and email reminders",
      "Dashboard analytics",
      "AI-assisted invoice composer",
    ],
    githubUrl: "https://github.com/72897/billflow-assessment",
    liveUrl: "https://billflow-assessment.vercel.app/",
    category: "Automation",
    featured: false,
    year: "2026",
    status: "Live",
  },
  {
    title: "Travel Planner",
    slug: "travel-planner",
    description: "Chatbot that generates personalised travel itineraries.",
    longDescription:
      "A chatbot that generates personalised travel itineraries, built with Python, LangChain and Groq behind a Gradio interface.",
    techStack: ["Python", "LangChain", "Groq", "Gradio"],
    features: ["Personalised itinerary generation", "Chat interface"],
    githubUrl: "https://github.com/72897/travel-planner",
    category: "AI",
    featured: false,
    year: "2025",
  },
];

export const certificates: ICertificate[] = [
  { title: "Google Cloud GenAI", organization: "Google Cloud" },
  { title: "Advanced Software Engineering", organization: "Walmart USA (Forage)" },
  { title: "Technology Job Simulation", organization: "Deloitte Australia (Forage)" },
  { title: "AWS Cloud Practitioner Essentials", organization: "AWS" },
  { title: "Generative AI", organization: "HP LIFE" },
  { title: "Postman API certification", organization: "Postman" },
];

export const education: IEducation[] = [
  {
    institution: "Gautam Buddha University",
    degree: "B.Tech, Computer Science",
    location: "Greater Noida",
    period: "Aug 2022 - Jun 2026",
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
    degree: "Class 12 (Science)",
    period: "2022",
    grade: "87%",
  },
  {
    institution: "Nirmala Convent School",
    degree: "Class 10",
    period: "2020",
    grade: "85%",
  },
];

export const languages: ILanguage[] = [
  { name: "English", level: "Fluent" },
  { name: "Hindi", level: "Native" },
];

export const achievements: string[] = [
  "Led a team to the finals in 3+ hackathons",
  "Solved 150+ problems on LeetCode and GeeksforGeeks",
  "Volunteered at MotoGP Bharat 2023 (event and logistics coordination)",
];

/*
 * Returned by /api/github and /api/leetcode when the upstream API fails.
 * They carry no numbers on purpose: an empty state is better than a made-up one.
 */
export const fallbackGitHub: GitHubStats = {
  username: siteConfig.githubUsername,
  name: siteConfig.name,
  bio: "",
  publicRepos: 0,
  followers: 0,
  following: 0,
  topRepos: [],
  languages: {},
};

export const fallbackLeetCode: LeetCodeStats = {
  username: siteConfig.leetcodeUsername,
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  ranking: 0,
  totalQuestions: { easy: 0, medium: 0, hard: 0 },
};
