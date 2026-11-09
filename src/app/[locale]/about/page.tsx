import type { Metadata } from "next";
import AboutProfile from "@/features/about/components/AboutProfile";
import type { Locale } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";

type AboutPageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  return { title: getMessages(locale).about.title };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return <AboutProfile aboutMessages={getMessages(locale).about} />;
}
