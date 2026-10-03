import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siPython,
  siTailwindcss,
  siPostgresql,
  siSupabase,
  siFirebase,
  siGit,
  siFigma,
} from "simple-icons"

// Current public copy. The admin Website screen overrides any of these.
export const DEFAULT_CONTENT = {
  location: "Islamabad, PK",
  availability: "Available to Work",
  viewProjects: "View Projects",
  downloadCv: "Download CV",
  experienceStat: "Experience:",
  projectsStat: "Projects:",
  stackStat: "Stack:",
  stackValue: "MERN / Next.js",
  logoLight: "/assets/mylogo/MFI-Black.png",
  logoDark: "/assets/mylogo/MFI-White.png",
  portraitFallback: "/assets/images/faheem506pk-2026.jpg",
  resumeFallback: "/assets/PDF/CV/Muhammad_Faheem_Iqbal_CV.pdf",
  mediumUrl: "https://faheem506pk.medium.com/",
  techEyebrow: "Stack",
  techTitle: "Technologies I build with",
  techBody:
    "The tools I reach for in production, across the front end, the back end and everything that ships them.",
  techs: "React\nNext.js\nTypeScript\nJavaScript\nNode.js\nPython\nTailwind\nPostgreSQL\nSupabase\nFirebase\nGit\nFigma",
  skillsTitle: "Technical Expertise",
  skillsBody: "The stack I build with, and the tools around it. Drag the stack to spin it.",
  skillsPageTitle: "Technical Expertise",
  skillsPageBody: "My technical toolkit and proficiency levels across various domains.",
  experienceTitle: "Experience",
  experienceBody: "My professional journey in the digital realm.",
  experienceDevHeading: "Software Development",
  experienceOtherHeading: "Other Professional Experience",
  experiencePageTitle: "Professional Journey",
  experiencePageBody: "A timeline of my professional career and key roles in the industry.",
  projectsTitle: "Selected Works",
  projectsBody: "A collection of projects exploring web technologies and design.",
  projectsPageTitle: "Featured Projects",
  projectsPageBody: "A selection of projects that showcase my skills and problem-solving abilities.",
  achievementsTitle: "Achievements & Media",
  achievementsBody: "Featured in interviews, news, and articles across the web.",
  achievementsPageTitle: "Awards & Recognitions",
  contactTitle: "Get In Touch",
  contactBody: "Ready to start your next project? Drop me a message.",
  contactInfoTitle: "Contact Information",
  contactInfoBody:
    "I'm always interested in new opportunities, collaborations, or just a chat about technology. Feel free to reach out via the form or my social channels.",
  contactPageTitle: "Get in Touch",
  contactPageBody: "Have a project in mind or want to discuss collaboration? I'd love to hear from you.",
  phone: "+92 332 5194976",
  whatsappUrl: "https://wa.me/923325194976",
  whatsappLabel: "Start a Chat",
  responseTime: "Usually within 24 hours",
}

const NAMED_ICONS = [
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs, darkHex: "FFFFFF" },
  { name: "TypeScript", icon: siTypescript },
  { name: "JavaScript", icon: siJavascript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Python", icon: siPython },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "Supabase", icon: siSupabase },
  { name: "Firebase", icon: siFirebase },
  { name: "Git", icon: siGit, darkHex: "FFFFFF" },
  { name: "Figma", icon: siFigma },
]

const ICON_BY_NAME = Object.fromEntries(NAMED_ICONS.map((item) => [item.name.toLowerCase(), item]))

export function mergeContent(stored) {
  return { ...DEFAULT_CONTENT, ...(stored || {}) }
}

// One entry per line. Optional image: Name|https://...
export function parseTechs(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, iconUrl] = line.split("|").map((part) => part.trim())
      const known = ICON_BY_NAME[name.toLowerCase()]
      return {
        name,
        iconUrl: iconUrl || "",
        icon: known?.icon || null,
        darkHex: known?.darkHex,
      }
    })
}
