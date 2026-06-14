import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

    // Seed Profile
    const newUrl = "https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing";
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        name: "Kunal Singh",
        title: "AI Engineer | Full Stack Developer",
        bio: "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications. Currently pursuing B.Tech in Computer Science at Gautam Buddha University.",
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
      console.log("✅ Profile created");
    } else {
      existingProfile.resumeUrl = newUrl;
      await existingProfile.save();
      console.log("✅ Profile resumeUrl updated");
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
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
        },
        {
          title: "StudyNotion",
          slug: "studynotion",
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
          category: "FullStack",
          featured: false,
          order: 4,
        },
      ]);
      console.log("✅ Projects seeded");
    }

    // Seed Certificates
    const certCount = await Certificate.countDocuments();
    if (certCount === 0) {
      await Certificate.insertMany([
        { title: "Google Cloud GenAI", organization: "Google Cloud", issueDate: "2024-06-01", order: 1 },
        { title: "Advanced Software Engineering", organization: "Walmart USA - Forage", issueDate: "2024-05-01", order: 2 },
        { title: "Deloitte Australia Technology", organization: "Deloitte - Forage", issueDate: "2024-04-01", order: 3 },
        { title: "AWS Cloud Practitioner Essentials", organization: "Amazon Web Services", issueDate: "2024-03-01", order: 4 },
        { title: "Generative AI", organization: "HP Life", issueDate: "2024-02-01", order: 5 },
        { title: "API Certification", organization: "Postman", issueDate: "2024-01-01", order: 6 },
      ]);
      console.log("✅ Certificates seeded");
    }

    // Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        {
          company: "Manipal Business Solution",
          role: "AI Intern",
          type: "Internship",
          location: "Noida",
          startDate: "2026-04-01",
          endDate: "Present",
          current: true,
          bullets: [
            "Automated business workflows with Python, APIs, and Google Sheets, cutting manual reporting effort by 90%.",
            "Analyzed operational datasets and developed KPI reports for leadership and process optimization.",
            "Refined conversational AI workflows through prompt optimization, increasing answer accuracy by 25%.",
            "Trained task-specific models on labeled datasets to strengthen output quality.",
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
            "Designed and deployed a Generative AI platform with Google Gemini and OpenAI APIs.",
            "Formulated prompt templates and tuned inference processes to increase LLM output relevance by 30%.",
            "Produced a demo-ready capstone with technical documentation.",
            "Conducted data analysis and model fine-tuning with Python and TensorFlow, reducing latency by 25%.",
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
            "Built responsive frontend using React.js and Tailwind CSS with lazy loading optimization.",
            "Built scalable backend REST APIs with Node.js and Express.js, boosting response time by 40%.",
            "Collaborated in Agile 7-member team with Vercel/Netlify deployment, 95% test coverage.",
            "Integrated MongoDB with schema design and query optimization, improving data retrieval by 35%.",
          ],
          technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Vercel"],
          order: 3,
        },
      ]);
      console.log("✅ Experience seeded");
    }

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
