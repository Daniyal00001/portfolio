import {
  siReact,
  siNextdotjs,
  siAngular,
  siTypescript,
  siJavascript,
  siPython,
  siCplusplus,
  siHtml5,
  siCss,
  siRedux,
  siVite,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siDjango,
  siFastapi,
  siMysql,
  siMongodb,
  siRedis,
  siPrisma,
  siMongoose,
  siJsonwebtokens,
  siSocketdotio,
  siDocker,
  siGithubactions,
  siGit,
  siGithub,
  siPostman,
  siShadcnui,
  siRadixui,
} from "simple-icons"

const ICONS = {
  "javascript (es6+)": siJavascript,
  typescript: siTypescript,
  python: siPython,
  "c++": siCplusplus,
  html5: siHtml5,
  css3: siCss,
  "react.js": siReact,
  "next.js": siNextdotjs,
  angular: siAngular,
  redux: siRedux,
  vite: siVite,
  "tailwind css": siTailwindcss,
  "shadcn ui": siShadcnui,
  "radix ui": siRadixui,
  "node.js": siNodedotjs,
  "express.js": siExpress,
  django: siDjango,
  "django rest framework": siDjango,
  fastapi: siFastapi,
  mysql: siMysql,
  mongodb: siMongodb,
  redis: siRedis,
  "prisma orm": siPrisma,
  mongoose: siMongoose,
  "jwt authentication": siJsonwebtokens,
  "socket.io": siSocketdotio,
  docker: siDocker,
  "github actions": siGithubactions,
  git: siGit,
  github: siGithub,
  postman: siPostman,
}

function isDarkMark(hex) {
  const value = parseInt(hex, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return (red * 299 + green * 587 + blue * 114) / 1000 < 90
}

export function SkillPicture({ name, image, className = "h-9 w-9" }) {
  if (image) {
    return <img src={image} alt="" className={`${className} object-contain`} />
  }

  const icon = ICONS[String(name || "").toLowerCase()]
  if (!icon) {
    return (
      <span className={`${className} flex items-center justify-center text-base font-semibold text-primary`}>
        {String(name || "?").slice(0, 1)}
      </span>
    )
  }

  const dark = isDarkMark(icon.hex)
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} shrink-0 fill-[color:var(--logo)] dark:fill-[color:var(--logo-dark)]`}
      style={{
        "--logo": `#${icon.hex}`,
        "--logo-dark": dark ? "#FFFFFF" : `#${icon.hex}`,
      }}
    >
      <path d={icon.path} />
    </svg>
  )
}
