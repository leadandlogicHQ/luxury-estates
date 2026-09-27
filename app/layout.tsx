import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import ToastProvider from "@/components/Toast";
import { ShortlistProvider } from "@/components/ShortlistProvider";
import Deferred from "@/components/Deferred";
import DeferredOverlays from "@/components/DeferredOverlays";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Luxury Estates | Find Your Dream Home",
  description:
    "Discover exceptional luxury properties in the world's most desirable locations.",
  openGraph: {
    type: "website",
    siteName: "Luxury Estates",
    url: "/",
    /* og:image is injected automatically by app/opengraph-image.png —
       do NOT list images here or you'll emit duplicate tags */
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-off-white text-text">
        <ToastProvider>
          <ShortlistProvider>
            <PageLoader />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <Deferred>
              <DeferredOverlays />
            </Deferred>
          </ShortlistProvider>
        </ToastProvider>
</body>
    </html>
  );
}