import { Achievements } from "@/components/achievements";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Achievements & Certifications | Muhammad Daniyal Tallat",
  description: "Honors, awards, and writing by Muhammad Daniyal Tallat.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/achievements`,
  },
};

export default function AchievementsPage() {
  return (
    <PageWrapper titleKey="achievementsPageTitle" title="Awards & Recognitions">
      <Achievements />
    </PageWrapper>
  );
}
