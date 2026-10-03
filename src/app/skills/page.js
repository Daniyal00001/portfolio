import { Skills } from "@/components/skills";
import { createClient } from "@supabase/supabase-js";
import { PageWrapper } from "@/components/page-wrapper";
import { SiteText } from "@/components/site-content";

export const metadata = {
  title: "Skills & Expertise | Muhammad Daniyal Tallat",
  description:
    "Technical skills of Muhammad Daniyal Tallat, Full Stack Software Engineer.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/skills`,
  },
};

export default function SkillsPage() {
  return (
    <PageWrapper titleKey="skillsPageTitle" title="Technical Expertise" className="bg-background/50">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <SiteText k="skillsPageBody" className="text-xl text-muted-foreground" />
      </div>
      <Skills isPage={true} />
    </PageWrapper>
  );
}
