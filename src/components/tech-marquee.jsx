"use client";

import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiHtml5,
  SiCss3,
  SiPython,
  SiPhp,
  SiMysql,
  SiFirebase,
  SiMongodb,
  SiGit,
  SiFigma,
  SiWordpress,
} from "react-icons/si";

// Utility function to replace @motionone/utils wrap
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const techs = [
  { name: "React", icon: SiReact, color: "text-cyan-400" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-300" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "HTML5", icon: SiHtml5, color: "text-orange-500" },
  { name: "CSS3", icon: SiCss3, color: "text-blue-400" },
  { name: "Python", icon: SiPython, color: "text-blue-300" },
  { name: "PHP", icon: SiPhp, color: "text-indigo-400" },
  { name: "MySQL", icon: SiMysql, color: "text-blue-600" },
  { name: "Firebase", icon: SiFirebase, color: "text-yellow-500" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "Git", icon: SiGit, color: "text-orange-600" },
  { name: "Figma", icon: SiFigma, color: "text-pink-500" },
  { name: "WordPress", icon: SiWordpress, color: "text-blue-700" },
];

function MarqueeContent({ children, baseVelocity = -1 }) {
  const baseX = useMotionValue(0);
  const xVelocity = useMotionValue(baseVelocity);
  const smoothXVelocity = useSpring(xVelocity, {
    damping: 20, 
    stiffness: 50,
    mass: 1
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((t, delta) => {
    let moveBy = smoothXVelocity.get() * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div 
        className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap cursor-pointer"
        onMouseEnter={() => xVelocity.set(0)}
        onMouseLeave={() => xVelocity.set(baseVelocity)}
    >
      <motion.div className="flex font-semibold uppercase text-3xl whitespace-nowrap flex-nowrap" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section className="bg-background/50  overflow-hidden">
      <MarqueeContent baseVelocity={-1.5} >
        <div className="flex gap-12 sm:gap-24 pr-12 sm:pr-24 items-center">
            {techs.map((tech, index) => (
                <div key={index} className="flex flex-col items-center gap-3 group/icon py-8">
                    <tech.icon className={`w-10 h-10 sm:w-14 sm:h-14 ${tech.color} opacity-60 grayscale transition-all duration-500 group-hover/icon:grayscale-0 group-hover/icon:opacity-100 group-hover/icon:scale-110`} />
                    <span className="text-xs sm:text-sm font-mono font-normal tracking-wider text-muted-foreground opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover/icon:translate-y-0 text-center">{tech.name}</span>
                </div>
            ))}
        </div>
      </MarqueeContent>
    </section>
  );
}
