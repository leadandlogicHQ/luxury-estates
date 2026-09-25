"use client";
import dynamic from "next/dynamic";

/* Hydrate after first paint — neither is needed for LCP/TBT */
const BackToTop = dynamic(() => import("./BackToTop"), { ssr: false });
const CookieBanner = dynamic(() => import("./CookieBanner"), { ssr: false });

export default function DeferredOverlays() {
  return (
    <>
      <BackToTop />
      <CookieBanner />
    </>
  );
}