export const Mydata = {
  Name: "Muhammad Daniyal Tallat",
  Role: "Full Stack Software Engineer",
  Address: "Lahore, Pakistan",
  Phone: "+92 316 4257645",
  Phone2: "",
  Email: "daniyaltallat0@gmail.com",
  Nationality: "Pakistani",
  Socials: {
    LinkedIn: "https://www.linkedin.com/in/muhammad-daniyal-tallat-baa602274/",
    GitHub: "https://github.com/Daniyal00001",
    Portfolio: "http://localhost:3000",
    Medium: ""
  },
  Summary:
    "Software Engineer with 1.5 years of production experience building scalable, high-performance applications from frontend to backend. Skilled in React, Next.js, Angular, Node.js, Express and Django (DRF), with solid command of MySQL, MongoDB, Redis, GraphQL and REST API design. Strong grounding in OOP, data structures and DBMS, with a focus on clean, maintainable code and full ownership of every feature, from database design to deployment.",
  Education: {
    Degree: "BS (Hons) in Computer Science",
    Period: "2022 – 2026",
    University: "Government College University, Lahore"
  },
  Experience: [
    {
      Company: "Devsinc",
      Position: "Software Engineer Intern",
      Location: "Lahore, Pakistan",
      Description: "Contributing to Agents Anywhere, an applied AI platform that helps mid-market and enterprise companies turn their knowledge into AI tools, agents and automated workflows, with human approval on sensitive actions. Built the client intake framework and dossier generation, connectors, plugins, MCP skills and Orbit features, and set up AWS deployment with GitHub Actions CI/CD. Also contributing to VeriCasa, an AI-powered legal-tech platform for real estate agencies, law firms and notaries in the Portuguese and US markets, running 100+ automated legal cross-checks and generating contracts in seconds. Developed full-stack features across document analysis, contract generation and KYC compliance workflows, with REST APIs, encrypted document storage and GDPR-compliant data handling.",
      Duration: "Aug 2026 – Present",
    },
    {
      Company: "Directorate of Information Technology, GCU",
      Position: "Junior Software Developer",
      Location: "Lahore, Pakistan",
      Description: "Contributed to core modules of the university LMS, serving 10,000+ students, faculty and staff, using Angular, Node.js, Express and MySQL. Built the Summer Enrollment Module, automating registration for about 1,000 students per cycle, the Teachers Billing Module, replacing a 3-month manual process for 1,000+ faculty, and the Teacher Evaluation Module. Contributed to attendance tracking, eligibility checks and grading with automated student progress reports, role-based access and PDF report generation. Built the GCU Societies Portal from scratch with 7-role access control, society registration, event approval, member management and society points tracking. Optimized MySQL queries and indexing on high-volume enrollment data. Developed the Student Scholarship and Student ID Card modules for the Student Facilitation Center, and reduced critical production bugs through manual SQA and regression testing.",
      Duration: "May 2025 – May 2026",
    },
  ],
  Projects: [
    {
      id: 1,
      Name: "Skill Bridge",
      Description: "AI-powered freelance marketplace with an autonomous hiring agent that turns a client's idea into structured scope, budget, tech stack and timeline, then matches and ranks freelancers, negotiates, and generates the contract. Role-based access for client, freelancer and admin, with real-time chat, reviews, Stripe escrow, bidding, skill tokens and dispute resolution.",
      Tech: ["React", "TypeScript", "Node.js", "Express", "Prisma", "MongoDB", "Redis", "Socket.IO", "Stripe", "FastAPI"],
      GitHub: "",
      Live: "https://skillbridge.ddns.net",
      Featured: true,
      Year: ""
    },
    {
      id: 2,
      Name: "Health Connect",
      Description: "Multi-role healthcare management platform for admins, clinics, front desk staff and super admins. Appointment workflows, front desk management and billing, with role-based dashboards, REST APIs, Prisma, JWT authentication and a React frontend deployed on Vercel.",
      Tech: ["React", "TypeScript", "Vite", "Node.js", "Express", "Prisma", "MySQL"],
      GitHub: "",
      Live: "https://health-connect-super.vercel.app",
      Featured: true,
      Year: ""
    },
    {
      id: 3,
      Name: "Lead Management System",
      Description: "CRM-style lead management engine that tracks sales leads through multi-phase technical evaluation to final sale conversion, with phase accept and decline workflows. Role-based access for Business Development, Technical Manager and Engineer, comments with image attachments, and automated commission calculation on converted sales.",
      Tech: ["Django", "Django REST Framework", "PostgreSQL", "Django Templates", "AJAX"],
      GitHub: "https://github.com/Daniyal00001/Leads-management-system",
      Live: "",
      Featured: true,
      Year: ""
    },
    {
      id: 4,
      Name: "The College Periodical",
      Description: "Academic publishing platform where authors submit articles anonymously and publish them through peer review. Reviewer and Super Admin portals, JWT authentication, bcrypt password hashing, protected admin routes and email notifications, deployed on Vercel.",
      Tech: ["Next.js", "React", "Tailwind CSS", "MySQL", "JWT", "Supabase", "Nodemailer"],
      GitHub: "",
      Live: "https://thecollegeperiodical.com",
      Featured: true,
      Year: ""
    }
  ],
  Skills: {
    Languages: ["JavaScript (ES6+)", "TypeScript", "Python", "C++", "HTML5", "CSS3"],
    Frontend: ["React.js", "Next.js", "Angular", "Redux", "Vite", "Tailwind CSS", "ShadCN UI", "Radix UI", "Responsive Design"],
    Backend: ["Node.js", "Express.js", "Django", "Django REST Framework", "FastAPI", "REST API design", "GraphQL", "Rate Limiting"],
    "Databases & ORM": ["MySQL", "MongoDB", "Redis", "Prisma ORM", "Mongoose", "Schema Design", "Query Optimization"],
    "Auth & Realtime": ["JWT Authentication", "Socket.io", "Nodemailer", "Multer", "JSPDF"],
    "Cloud & DevOps": ["AWS", "Docker", "CI/CD Pipelines", "GitHub Actions"],
    Tools: ["Git & GitHub", "Postman", "VS Code", "MySQL Workbench", "MongoDB Compass"],
    "Core Concepts": ["OOP", "Data Structures & Algorithms", "DBMS"],
    Practices: ["Manual SQA Testing", "Agile/Scrum", "Sprint Planning", "Code Reviews", "Role-Based Access Control"]
  }
};
