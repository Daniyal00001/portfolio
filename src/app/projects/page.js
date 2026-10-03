import { Projects } from "@/components/projects";
import { PageWrapper } from "@/components/page-wrapper";
import { SiteText } from "@/components/site-content";

export const metadata = {
  title: "Projects & Portfolio | Muhammad Daniyal Tallat",
  description:
    "Projects by Muhammad Daniyal Tallat. Web applications and software built across frontend, backend, and cloud.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
  },
};

export default function ProjectsPage() {
  return (
    <PageWrapper titleKey="projectsPageTitle" title="Featured Projects">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <SiteText k="projectsPageBody" className="text-xl text-muted-foreground" />
      </div>
      <Projects isPage={true} />
    </PageWrapper>
  );
}
