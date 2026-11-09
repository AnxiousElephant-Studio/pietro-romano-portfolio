import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk } from "next/font/google";
import { isLocale, locales } from "@/core/i18n/config";
import { formatMessage, getMessages } from "@/core/i18n/messages";
import CustomCursor from "@/core/components/CustomCursor";
import Footer from "@/core/components/layout/Footer";
import Header from "@/core/components/layout/Header";
import SiteFrame from "@/core/components/layout/SiteFrame";
import { site } from "@/core/site/site";
import { siteUrl } from "@/core/site/siteUrl";
import "../globals.css";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

type LayoutParams = { locale: string };

export const dynamicParams = false;

export function generateStaticParams(): LayoutParams[] {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<LayoutParams> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const messages = getMessages(locale);
  const defaultTitle = formatMessage(messages.meta.title, { ownerName: site.owner.name });

  return {
    metadataBase: new URL(siteUrl),
    title: { default: defaultTitle, template: `%s · ${site.owner.name}` },
    description: messages.meta.description,
    authors: [{ name: site.owner.fullName }],
    alternates: { canonical: `/${locale}`, languages: { "pt-BR": "/pt", en: "/en" } },
    openGraph: {
      type: "website",
      siteName: site.owner.fullName,
      title: defaultTitle,
      description: messages.meta.description,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: messages.meta.description },
  };
}

type RootLayoutProps = { children: React.ReactNode; params: Promise<LayoutParams> };

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"}>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <SiteFrame
          header={<Header locale={locale} navigationMessages={messages.navigation} />}
          footer={<Footer footerMessages={messages.footer} emailLabel={messages.about.emailLabel} />}
        >
          {children}
        </SiteFrame>
        <CustomCursor />
      </body>
    </html>
  );
}
