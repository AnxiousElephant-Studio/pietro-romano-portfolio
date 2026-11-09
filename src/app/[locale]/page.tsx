import type { Locale } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";
import CategoriesSection from "@/features/home/components/CategoriesSection";
import FeaturedProjectsSection from "@/features/home/components/FeaturedProjectsSection";
import HeroSection from "@/features/home/components/HeroSection";
import LampSpotlight from "@/features/home/components/LampSpotlight";
import SectionNavigator from "@/features/home/components/SectionNavigator";
import { getHomeSections, HOME_SECTION_IDS } from "@/features/home/sections";
import SkillsSection from "@/features/skills/components/SkillsSection";

type HomePageProps = { params: Promise<{ locale: Locale }> };

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const homeMessages = getMessages(locale).home;
  const homeSections = getHomeSections(locale);
  const navigatorItems = HOME_SECTION_IDS.map((sectionId) => ({
    id: sectionId,
    label: homeSections.sections[sectionId],
  }));

  return (
    <>
      <SectionNavigator items={navigatorItems} ariaLabel={homeSections.navigatorLabel} />
      <HeroSection locale={locale} homeMessages={homeMessages} scrollHint={homeSections.scrollHint} />
      <FeaturedProjectsSection locale={locale} homeMessages={homeMessages} />
      <SkillsSection locale={locale} />
      <CategoriesSection locale={locale} homeMessages={homeMessages} />
      <LampSpotlight firstSectionId="featured" lastSectionId="areas" />
    </>
  );
}
