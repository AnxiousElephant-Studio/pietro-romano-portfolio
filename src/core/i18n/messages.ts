import type { Locale } from "./config";
import portugueseMessages from "./messages/pt.json";
import englishMessages from "./messages/en.json";

export type Messages = typeof portugueseMessages;

const messagesByLocale: Record<Locale, Messages> = {
  pt: portugueseMessages,
  en: englishMessages,
};

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in values ? String(values[key]) : placeholder,
  );
}
