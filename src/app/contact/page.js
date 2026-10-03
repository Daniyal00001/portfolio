import { Contact } from "@/components/contact";
import { PageWrapper } from "@/components/page-wrapper";
import { SiteText } from "@/components/site-content";

export const metadata = {
  title: "Contact | Muhammad Daniyal Tallat",
  description:
    "Get in touch with Muhammad Daniyal Tallat about software projects, freelance work, or collaboration.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/contact`,
  },
};

export default function ContactPage() {
  return (
    <PageWrapper titleKey="contactPageTitle" title="Get in Touch">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <SiteText k="contactPageBody" className="text-xl text-muted-foreground" />
      </div>
      <Contact />
    </PageWrapper>
  );
}
