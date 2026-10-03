import { Experience } from "@/components/experience";
import { PageWrapper } from "@/components/page-wrapper";
import { SiteText } from "@/components/site-content";

export const metadata = {
  title: "Professional Experience | Muhammad Daniyal Tallat",
  description:
    "Work history of Muhammad Daniyal Tallat, Full Stack Software Engineer.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/experience`,
  },
};

export default function ExperiencePage() {
  return (
    <PageWrapper titleKey="experiencePageTitle" title="Professional Journey">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <SiteText k="experiencePageBody" className="text-xl text-muted-foreground" />
      </div>
      <Experience isPage={true} />
    </PageWrapper>
  );
}
