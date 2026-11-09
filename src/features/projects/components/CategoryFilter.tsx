import Link from "next/link";
import { Locale, localizedPath } from "@/core/i18n/config";
import { categories } from "../projects";

type CategoryFilterProps = {
  locale: Locale;
  allCategoriesLabel: string;
  activeCategorySlug?: string;
};

export default function CategoryFilter({
  locale,
  allCategoriesLabel,
  activeCategorySlug,
}: CategoryFilterProps) {
  return (
    <nav aria-label="Categories" className="filter">
      <Link
        href={localizedPath(locale, "/projects")}
        className={!activeCategorySlug ? "pill active" : "pill"}
      >
        {allCategoriesLabel}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={localizedPath(locale, `/projects/category/${category.slug}`)}
          className={activeCategorySlug === category.slug ? "pill active" : "pill"}
        >
          {category.label[locale]}
        </Link>
      ))}
    </nav>
  );
}
