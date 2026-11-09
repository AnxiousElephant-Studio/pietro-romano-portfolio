"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const DOCUMENT_PAGE_PATTERN = /^\/(pt|en)\/resume\/?$/;

type SiteFrameProps = { header: ReactNode; footer: ReactNode; children: ReactNode };

export default function SiteFrame({ header, footer, children }: SiteFrameProps) {
  const pathname = usePathname();
  const isDocumentPage = DOCUMENT_PAGE_PATTERN.test(pathname);

  return (
    <>
      {header}
      <main>{children}</main>
      {!isDocumentPage && footer}
    </>
  );
}
