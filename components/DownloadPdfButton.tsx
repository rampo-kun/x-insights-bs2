"use client";

import { useState, RefObject } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportNodeToPdf } from "@/lib/pdf";

export default function DownloadPdfButton({
  targetRef,
  filename,
}: {
  targetRef: RefObject<HTMLElement>;
  filename: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!targetRef.current || busy) return;
    setBusy(true);
    try {
      await exportNodeToPdf(targetRef.current, filename);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 text-ink font-semibold text-sm px-5 py-3 shadow-glow disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {busy ? "Generating PDF..." : "Download Report (PDF)"}
    </button>
  );
}
