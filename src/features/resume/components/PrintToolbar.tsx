"use client";

import { useEffect } from "react";
import Icon from "@/core/components/Icon";
import styles from "../resume.module.css";

type PrintToolbarProps = { printLabel: string };

const PRINT_QUERY_PARAM = "print";
const PRINT_QUERY_VALUE = "1";
const PRINT_DELAY_MS = 300;

export default function PrintToolbar({ printLabel }: PrintToolbarProps) {
  useEffect(() => {
    const shouldPrint = new URLSearchParams(window.location.search).get(PRINT_QUERY_PARAM) === PRINT_QUERY_VALUE;

    if (!shouldPrint) {
      return;
    }

    const printWhenReady = () => window.setTimeout(() => window.print(), PRINT_DELAY_MS);

    if (document.readyState === "complete") {
      printWhenReady();
    } else {
      window.addEventListener("load", printWhenReady, { once: true });
    }
  }, []);

  return (
    <div className={styles.toolbar}>
      <button type="button" className="btn btn-ghost icon-link" onClick={() => window.print()}>
        <Icon src="/icons/social/resume.svg" />
        {printLabel}
      </button>
    </div>
  );
}
