import type { Metadata } from "next";
import type { Locale } from "@/core/i18n/config";
import { getMessages } from "@/core/i18n/messages";
import { site } from "@/core/site/site";
import PrintToolbar from "@/features/resume/components/PrintToolbar";
import ResumeDocument from "@/features/resume/components/ResumeDocument";
import { getResume } from "@/features/resume/resume";
import styles from "@/features/resume/resume.module.css";

type ResumePageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
  const { locale } = await params;

  return { title: { absolute: `${getMessages(locale).home.resumeAction} · ${site.owner.fullName}` } };
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;

  return (
    <div className={styles.viewer}>
      <PrintToolbar printLabel={getMessages(locale).resume.printAction} />
      <ResumeDocument resume={getResume(locale)} />
    </div>
  );
}
