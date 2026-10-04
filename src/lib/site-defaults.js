import {
  siReact,
  siNextdotjs,
  siAngular,
  siTypescript,
  siNodedotjs,
  siPython,
  siDjango,
  siTailwindcss,
  siMysql,
  siMongodb,
  siRedis,
  siDocker,
  siGit,
} from "simple-icons"

// Current public copy. The admin Website screen overrides any of these.
export const DEFAULT_CONTENT = {
  location: "Lahore, Pakistan",
  availability: "Available to Work",
  viewProjects: "View Projects",
  downloadCv: "Download CV",
  experienceStat: "Experience:",
  experienceValue: "2+ Years",
  projectsStat: "Projects:",
  stackStat: "Stack:",
  stackValue: "Open Stack",
  logoLight: "/assets/mylogo/MDT-Black.png",
  logoDark: "/assets/mylogo/MDT-White.png",
  portraitFallback: "/assets/images/daniyal-2026.jpg",
  resumeFallback: "/assets/PDF/CV/Muhammad%20Daniyal%20Tallat.pdf",
  mediumUrl: "",
  techEyebrow: "Stack",
  techTitle: "Technologies I work with",
  techBody:
    "Production-ready technologies I use across frontend, backend, databases, and deployment.",
  techs: "React\nNext.js\nAngular\nTypeScript\nNode.js\nPython\nDjango\nTailwind\nMySQL\nMongoDB\nRedis\nDocker\nGit",
  skillsTitle: "Technical Expertise",
  skillsBody: "Languages, interfaces, data, and delivery, grouped the way I actually use them.",
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
  educationTitle: "Education",
  educationBody: "My academic background and qualifications.",
  educationPageTitle: "Education",
  educationPageBody: "Degrees and results from my studies.",
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
  phone: "+92 316 4257645",
  whatsappUrl: "https://wa.me/923164257645",
  whatsappLabel: "Start a Chat",
  responseTime: "Usually within 24 hours",
}

const NAMED_ICONS = [
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs, darkHex: "FFFFFF" },
  { name: "Angular", icon: siAngular },
  { name: "TypeScript", icon: siTypescript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Python", icon: siPython },
  { name: "Django", icon: siDjango },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "MySQL", icon: siMysql },
  { name: "MongoDB", icon: siMongodb },
  { name: "Redis", icon: siRedis },
  { name: "Docker", icon: siDocker },
  { name: "Git", icon: siGit, darkHex: "FFFFFF" },
]

const ICON_BY_NAME = Object.fromEntries(NAMED_ICONS.map((item) => [item.name.toLowerCase(), item]))

const REPLACED_CONTENT = {
  location: new Set(["Islamabad, PK", "Islamabad, Pakistan", "Khanna Pul, Islamabad, Pakistan"]),
  phone: new Set(["+92 332 5194976", "+923325194976", "+92 (332) 5194976"]),
  whatsappUrl: new Set(["https://wa.me/923325194976"]),
  stackValue: new Set(["MERN / Next.js", "React / Node.js"]),
  techTitle: new Set(["Technologies I build with"]),
  techBody: new Set([
    "The tools I reach for in production, across the front end, the back end and everything that ships them.",
  ]),
  skillsBody: new Set([
    "The stack I build with, and the tools around it. Drag the stack to spin it.",
  ]),
  techs: new Set([
    "React\nNext.js\nTypeScript\nJavaScript\nNode.js\nPython\nTailwind\nPostgreSQL\nSupabase\nFirebase\nGit\nFigma",
  ]),
}

export function mergeContent(stored) {
  const merged = { ...DEFAULT_CONTENT, ...(stored || {}) }
  if (!merged.logoLight || String(merged.logoLight).includes("MFI-")) {
    merged.logoLight = DEFAULT_CONTENT.logoLight
  }
  if (!merged.logoDark || String(merged.logoDark).includes("MFI-")) {
    merged.logoDark = DEFAULT_CONTENT.logoDark
  }
  for (const key of Object.keys(REPLACED_CONTENT)) {
    if (REPLACED_CONTENT[key].has(merged[key])) merged[key] = DEFAULT_CONTENT[key]
  }
  return merged
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
