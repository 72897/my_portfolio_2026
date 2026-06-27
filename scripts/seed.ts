import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Load .env manually to ensure it connects to MongoDB Atlas
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        if (key && !key.startsWith("#")) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env manually:", e);
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kunalsingh203001@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Import models
    const User = (await import("../src/models/User")).default;
    const Project = (await import("../src/models/Project")).default;
    const Certificate = (await import("../src/models/Certificate")).default;
    const Experience = (await import("../src/models/Experience")).default;
    const Skill = (await import("../src/models/Skill")).default;
    const Profile = (await import("../src/models/Profile")).default;
    const Resume = (await import("../src/models/Resume")).default;

    // Seed Admin User
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingUser) {
      await User.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: "Kunal Singh",
        role: "admin",
      });
      console.log("✅ Admin user created");
    } else {
      existingUser.password = ADMIN_PASSWORD;
      await existingUser.save();
      console.log("✅ Admin user password reset successfully");
    }

    // Seed Profile (Truncate and recreate to sync with resume)
    await Profile.deleteMany({});
    const newUrl = "https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing";
    await Profile.create({
      name: "Kunal Singh",
      title: "AI Engineer | Full Stack Developer",
      bio: "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications. Graduated with a B.Tech in Computer Science from Gautam Buddha University.",
      email: "kunalsingh203001@gmail.com",
      phone: "9456473642",
      location: "Greater Noida, Uttar Pradesh, India",
      logoColor1: "#6366f1",
      logoColor2: "#22d3ee",
      linkedinUrl: "https://www.linkedin.com/in/kunal-singh-454368289/",
      githubUrl: "https://github.com/72897",
      githubUsername: "72897",
      leetcodeUrl: "https://leetcode.com/u/kunal26_7/",
      leetcodeUsername: "kunal26_7",
      resumeUrl: newUrl,
    });
    console.log("✅ Profile seeded");

    // Seed Projects (Truncate and recreate to sync with resume)
    await Project.deleteMany({});
    await Project.insertMany([
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
        category: "AI",
        featured: true,
        order: 1,
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
        category: "AI",
        featured: true,
        order: 2,
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
        category: "FullStack",
        featured: true,
        order: 3,
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
        category: "FullStack",
        featured: false,
        order: 4,
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
    ]);
    console.log("✅ Projects seeded");

    // Seed Certificates (Truncate and recreate to sync with resume)
    await Certificate.deleteMany({});
    await Certificate.insertMany([
      { title: "Google Cloud GenAI", organization: "Google Cloud", issueDate: "2024-06-01", order: 1 },
      { title: "Advanced Software Engineering", organization: "Walmart USA - Forage", issueDate: "2024-05-01", order: 2 },
      { title: "Deloitte Australia Technology", organization: "Deloitte - Forage", issueDate: "2024-04-01", order: 3 },
      { title: "AWS Cloud Practitioner Essentials", organization: "Amazon Web Services", issueDate: "2024-03-01", order: 4 },
      { title: "Generative AI", organization: "HP Life", issueDate: "2024-02-01", order: 5 },
      { title: "API Certification", organization: "Postman", issueDate: "2024-01-01", order: 6 },
    ]);
    console.log("✅ Certificates seeded");

    // Seed Experience (Truncate and recreate to sync with resume)
    await Experience.deleteMany({});
    await Experience.insertMany([
      {
        company: "Manipal Business Solution",
        role: "AI Intern",
        type: "Internship",
        location: "Noida",
        startDate: "2026-04-01",
        endDate: "2026-06-30",
        current: false,
        bullets: [
          "Automated business workflows with Python, APIs, and Google Sheets, cutting manual reporting effort by 90%.",
          "Analyzed operational datasets and developed KPI reports to generate insights for leadership and process optimization.",
          "Refined conversational AI workflows through prompt optimization, intent validation, and response evaluation, increasing answer accuracy by 25%.",
          "Trained task-specific models on labeled datasets, error diagnostics, and performance benchmarking to strengthen output quality.",
        ],
        technologies: ["Python", "APIs", "Google Sheets", "AI/ML", "Prompt Engineering"],
        order: 1,
      },
      {
        company: "Thales Group",
        role: "Engineering Intern",
        type: "Internship",
        location: "Noida",
        startDate: "2025-06-01",
        endDate: "2025-07-31",
        current: false,
        bullets: [
          "Designed and deployed a Generative AI platform with Google Gemini and OpenAI APIs, embedding LLM capabilities into enterprise NLP pipelines.",
          "Formulated prompt templates and tuned inference processes to increase LLM output relevance by 30%.",
          "Produced a demo-ready capstone with technical documentation and cross-functional feedback integration.",
          "Conducted data analysis and model fine-tuning with Python and TensorFlow, reducing processing latency by 25% and supporting production-scale deployment.",
        ],
        technologies: ["Python", "TensorFlow", "Google Gemini", "OpenAI", "NLP", "LLM"],
        order: 2,
      },
      {
        company: "MI Matdar",
        role: "Full Stack Developer Intern",
        type: "Internship",
        location: "Maharashtra",
        startDate: "2025-02-01",
        endDate: "2025-04-30",
        current: false,
        bullets: [
          "Constructed a responsive frontend using React.js and Tailwind CSS, resolving UI/UX bugs and implementing lazy loading to optimize page load times.",
          "Built scalable backend REST APIs with Node.js and Express.js, boosting response time by 40%.",
          "Collaborated in Agile 7-member team with Vercel/Netlify deployment, 95% test coverage.",
          "Integrated MongoDB with schema design and query optimization, improving data retrieval by 35%.",
        ],
        technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Vercel"],
        order: 3,
      },
    ]);
    console.log("✅ Experience seeded");

    // Seed Skills (Always synchronized on seed)
    await Skill.deleteMany({});
    const skills = [
      { name: "C++", category: "Programming Languages", icon: "code-2", proficiency: 80, order: 1 },
      { name: "Python", category: "Programming Languages", icon: "terminal", proficiency: 90, order: 2 },
      { name: "SQL", category: "Programming Languages", icon: "database", proficiency: 75, order: 3 },
      { name: "React.js", category: "Frontend", icon: "atom", proficiency: 85, order: 4 },
      { name: "Next.js", category: "Frontend", icon: "layout", proficiency: 80, order: 5 },
      { name: "HTML/CSS", category: "Frontend", icon: "file-code", proficiency: 90, order: 6 },
      { name: "Tailwind CSS", category: "Frontend", icon: "wind", proficiency: 85, order: 7 },
      { name: "TypeScript", category: "Frontend", icon: "file-type", proficiency: 75, order: 8 },
      { name: "Node.js", category: "Backend", icon: "server", proficiency: 85, order: 9 },
      { name: "Express.js", category: "Backend", icon: "route", proficiency: 80, order: 10 },
      { name: "REST API Design", category: "Backend", icon: "network", proficiency: 85, order: 11 },
      { name: "MongoDB", category: "Database & Cloud", icon: "database", proficiency: 80, order: 12 },
      { name: "Firebase", category: "Database & Cloud", icon: "flame", proficiency: 70, order: 13 },
      { name: "ChromaDB", category: "Database & Cloud", icon: "search", proficiency: 65, order: 14 },
      { name: "TensorFlow", category: "AI/ML & Frameworks", icon: "brain", proficiency: 75, order: 15 },
      { name: "PyTorch", category: "AI/ML & Frameworks", icon: "cpu", proficiency: 70, order: 16 },
      { name: "LangChain", category: "AI/ML & Frameworks", icon: "link", proficiency: 80, order: 17 },
      { name: "Hugging Face", category: "AI/ML & Frameworks", icon: "smile", proficiency: 75, order: 18 },
      { name: "Large Language Models (LLMs)", category: "AI/ML & Frameworks", icon: "bot", proficiency: 90, order: 19 },
      { name: "Generative AI", category: "AI/ML & Frameworks", icon: "zap", proficiency: 90, order: 20 },
      { name: "Prompt Engineering", category: "AI/ML Techniques", icon: "terminal", proficiency: 95, order: 21 },
      { name: "Retrieval Augmented Generation (RAG)", category: "AI/ML Techniques", icon: "search", proficiency: 90, order: 22 },
      { name: "Vector Search & Embeddings", category: "AI/ML Techniques", icon: "scatter-chart", proficiency: 85, order: 23 },
      { name: "Fine-tuning", category: "AI/ML Techniques", icon: "settings", proficiency: 75, order: 24 },
      { name: "NLP", category: "AI/ML Techniques", icon: "message-square", proficiency: 80, order: 25 },
      { name: "Git/GitHub", category: "Tools & Platforms", icon: "git-merge", proficiency: 85, order: 26 },
      { name: "Postman", category: "Tools & Platforms", icon: "send", proficiency: 80, order: 27 },
      { name: "Codex", category: "Tools & Platforms", icon: "code-2", proficiency: 80, order: 28 },
    ];
    await Skill.insertMany(skills);
    console.log("✅ Skills seeded and synchronized");

    // Seed Blogs (Truncate and recreate to sync)
    const Blog = (await import("../src/models/Blog")).default;
    await Blog.deleteMany({});
    await Blog.insertMany([
      {
        title: "Supercharging recruitment workflows with custom AI agents!",
        slug: "linkedin-ai-recruitment",
        description: "Supercharging recruitment workflows with custom AI agents! Integrating LLMs for automated resume parsing, semantic skill validation, and pipeline status updates...",
        content: "Supercharging recruitment workflows with custom AI agents! Integrating LLMs for automated resume parsing, semantic skill validation, and pipeline status updates reduces manual hourly screening work by 90% while ensuring zero candidate dropout. 🚀\n\n#AI #Automation #RecruitmentAutomation #FutureOfWork",
        tags: ["LinkedIn", "AI", "Automation", "RecruitmentAutomation", "FutureOfWork"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_ai-automation-recruitmentautomation-activity-7468718216949714944-cb4u",
        linkedinPostId: "urn:li:share:7468718216949714944",
        published: true,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Deep dive into Graph Theory and DSA!",
        slug: "linkedin-graph-theory",
        description: "Deep dive into Graph Theory and DSA! Shortest path computations and network relationships require a strong grasp of Dijkstra, BFS/DFS tree traversals...",
        content: "Deep dive into Graph Theory and DSA! Shortest path computations and network relationships require a strong grasp of Dijkstra, BFS/DFS tree traversals, and dynamic relationships. Essential for competitive programming optimization. 💻\n\n#GraphTheory #DSA #CompetitiveProgramming #LeetCode",
        tags: ["LinkedIn", "GraphTheory", "DSA", "CompetitiveProgramming", "LeetCode"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_graphtheory-dsa-competitiveprogramming-activity-7438194693630230528-Wp6x",
        linkedinPostId: "urn:li:share:7438194693630230528",
        published: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Navigating AI Ethics and Tech Policy in content moderation",
        slug: "linkedin-ai-ethics",
        description: "Navigating AI Ethics and Tech Policy in content moderation. As systems scale, implementing guardrails, toxicity filtering, and bias evaluations is critical...",
        content: "Navigating AI Ethics and Tech Policy in content moderation. As systems scale, implementing guardrails, toxicity filtering, and bias evaluations is critical to maintain trusted digital communities and aligned outputs. ⚖️\n\n#AIEthics #ContentModeration #TechPolicy #ResponsibleAI",
        tags: ["LinkedIn", "AIEthics", "ContentModeration", "TechPolicy", "ResponsibleAI"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_aiethics-contentmoderation-techpolicy-activity-7416107484341276672-6IUs",
        linkedinPostId: "urn:li:share:7416107484341276672",
        published: true,
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Balancing AI productivity and digital wellbeing in the future of work",
        slug: "linkedin-wellbeing",
        description: "Balancing AI productivity and digital wellbeing in the future of work. While Copilots and automated workflows accelerate development...",
        content: "Balancing AI productivity and digital wellbeing in the future of work. While Copilots and automated workflows accelerate development, keeping human-centered boundaries ensures creative output and long-term developer focus. 🧘‍♂️\n\n#AI #DigitalWellbeing #FutureOfWork #Productivity",
        tags: ["LinkedIn", "AI", "DigitalWellbeing", "FutureOfWork", "Productivity"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_ai-digitalwellbeing-futureofwork-activity-7415273918506131456-YbC0",
        linkedinPostId: "urn:li:share:7415273918506131456",
        published: true,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Career Advice & Professional Development: Building positive workplace cultures",
        slug: "linkedin-career-advice",
        description: "Career Advice & Professional Development: Building positive workplace cultures starts with open engineering discussions, collaborative code reviews, and mentorship...",
        content: "Career Advice & Professional Development: Building positive workplace cultures starts with open engineering discussions, collaborative code reviews, and mentorship. Continuous learning is the best catalyst for growth. 📈\n\n#CareerAdvice #WorkplaceCulture #ProfessionalDevelopment #Mentorship",
        tags: ["LinkedIn", "CareerAdvice", "WorkplaceCulture", "ProfessionalDevelopment", "Mentorship"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_careeradvice-workplaceculture-professionaldevelopment-activity-7414706735522955265-P_09",
        linkedinPostId: "urn:li:share:7414706735522955265",
        published: true,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Reflecting on my experience building Generative AI models at Thales India",
        slug: "linkedin-thales-genai",
        description: "Reflecting on my experience building Generative AI models using Google Cloud Vertex AI and Gemini APIs at Thales India. Building secure prompting guidelines...",
        content: "Reflecting on my experience building Generative AI models using Google Cloud Vertex AI and Gemini APIs at Thales India. Building secure prompting guidelines and low-latency API integration frameworks was a fantastic learning milestone! ☁️\n\n#GoogleCloud #GenerativeAI #ThalesIndia #Internship",
        tags: ["LinkedIn", "GoogleCloud", "GenerativeAI", "ThalesIndia", "Internship"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_googlecloud-generativeai-thalesindia-activity-7361258257438367744-vnkM",
        linkedinPostId: "urn:li:share:7361258257438367744",
        published: true,
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Advice to freshers: Yes, your LeetCode and problem-solving practice matters!",
        slug: "linkedin-freshers-advice",
        description: "Advice to freshers: Yes, your LeetCode and problem-solving practice matters! Beyond cracking technical interviews, consistent DSA problem solving builds logic...",
        content: "Advice to freshers: Yes, your LeetCode and problem-solving practice matters! Beyond cracking technical interviews, consistent DSA problem solving builds logic patterns, complexity analysis skills, and memory optimization habits. 🚀\n\n#Advice #Freshers #LeetCode #SoftwareEngineering",
        tags: ["LinkedIn", "Advice", "Freshers", "LeetCode", "SoftwareEngineering"],
        source: "linkedin",
        externalUrl: "https://www.linkedin.com/posts/kunal-singh-454368289_advice-to-freshers-yes-your-leetcode-activity-7348739554058653699-GgYk",
        linkedinPostId: "urn:li:share:7348739554058653699",
        published: true,
        publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      },
      {
        title: "The Rise of Autonomous Agentic Workflows: A Hands-on Guide",
        slug: "rise-of-agentic-workflows",
        description: "A comprehensive breakdown of how LLM-based autonomous agents plan, execute, and reflect on tasks. From ReAct loop patterns to LangGraph-based state systems, we analyze the current state of agency.",
        content: "A comprehensive breakdown of how LLM-based autonomous agents plan, execute, and reflect on tasks. From ReAct loop patterns to LangGraph-based state systems, we analyze the current state of agency in production AI systems. Autonomous agents represent the next major shift in product engineering, transitioning software from passive tools to active reasoning partners.",
        tags: ["AI", "Agents", "LangChain", "SoftwareDesign"],
        source: "article",
        published: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ]);
    console.log("✅ Blogs and LinkedIn posts seeded");

    // Seed Resume
    const resumeCount = await Resume.countDocuments();
    if (resumeCount === 0) {
      await Resume.create({
        summary: "AI Engineer and Full Stack Developer with hands-on experience in Generative AI, LLM integration, and scalable web applications. B.Tech CSE student at Gautam Buddha University.",
        pdfUrl: newUrl,
        highlights: {
          experience: "3 internships at Manipal Business Solution, Thales Group, and MI Matdar",
          skills: "Python, React.js, Node.js, TensorFlow, LangChain, MongoDB",
          projects: "4 projects including AI-powered study assistant and healthcare chatbot",
          education: "B.Tech CSE (GBU), 12th PCM (St. Aerjay), 10th (Nirmala Convent)",
          certifications: "6 certifications from Google Cloud, AWS, Walmart, Deloitte, HP, Postman",
        },
        downloadCount: 0,
      });
      console.log("✅ Resume data seeded");
    } else {
      await Resume.updateMany({}, { $set: { pdfUrl: newUrl } });
      console.log("✅ Resume pdfUrl updated");
    }

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
