import { Education } from "@/components/education";
import { PageWrapper } from "@/components/page-wrapper";
import { SiteText } from "@/components/site-content";

export const metadata = {
  title: "Education | Muhammad Daniyal Tallat",
  description:
    "Education of Muhammad Daniyal Tallat, Full Stack Software Engineer. BS Computer Science at Government College University, Lahore.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/education`,
  },
};

export default function EducationPage() {
  return (
    <PageWrapper titleKey="educationPageTitle" title="Education">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <SiteText k="educationPageBody" className="text-xl text-muted-foreground" />
      </div>
      <Education isPage={true} />
    </PageWrapper>
  );
}
