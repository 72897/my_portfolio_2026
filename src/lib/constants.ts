export const siteConfig = {
  name: "Kunal Singh",
  title: "AI Engineer | Full Stack Developer",
  description:
    "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications. B.Tech CSE student at Gautam Buddha University with hands-on experience in Python, React.js, Node.js, and modern AI/ML frameworks.",
  url: "https://kunalsingh.dev",
  email: "kunalsingh203001@gmail.com",
  phone: "9456473642",
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
      { name: "NumPy", icon: "calculator" },
      { name: "Pandas", icon: "bar-chart-3" },
      { name: "Streamlit", icon: "monitor" },
    ],
  },
  {
    category: "AI/ML Techniques",
    skills: [
      { name: "Fine-tuning", icon: "settings" },
      { name: "Vector Embeddings", icon: "scatter-chart" },
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
      { name: "Codex", icon: "sparkles" },
    ],
  },
];

export const experiences = [
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

export const projects = [
  {
    title: "StudyMate",
    slug: "studymate",
    description: "GenAI Powered Study Assistant with RAG, semantic search, and contextual PDF summarization.",
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
  },
  {
    title: "AlphaCare",
    slug: "alphacare",
    description: "AI-Powered Healthcare Chatbot with real-time symptom screening and voice interaction.",
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
  },
  {
    title: "StudyNotion",
    slug: "studynotion",
    description: "Course Selling Application with role-based dashboards, admin tools, and JWT authentication.",
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
  },
  {
    title: "Travel Planner",
    slug: "travel-planner",
    description: "Smart travel planning application for organizing trips and itineraries.",
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
  },
];

export const certificates = [
  { title: "Google Cloud GenAI", organization: "Google Cloud", date: "2024" },
  { title: "Advanced Software Engineering", organization: "Walmart USA - Forage", date: "2024" },
  { title: "Deloitte Australia Technology", organization: "Deloitte - Forage", date: "2024" },
  { title: "AWS Cloud Practitioner Essentials", organization: "Amazon Web Services", date: "2024" },
  { title: "Generative AI", organization: "HP Life", date: "2024" },
  { title: "API Certification", organization: "Postman", date: "2024" },
];

export const education = {
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
};

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
