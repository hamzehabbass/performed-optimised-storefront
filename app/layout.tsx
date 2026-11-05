import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "hamzehabbass-accessible-ui/style.css";
import "@/app/globals.css";
import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/store-footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: {
    default: "Noma — thoughtful finds for everyday living",
    template: "%s | Noma",
  },
  description:
    "Discover considered everyday essentials, small comforts and thoughtful finds at Noma Market.",
  applicationName: "Noma Market",
  openGraph: {
    type: "website",
    siteName: "Noma",
    title: "Noma — thoughtful finds for everyday living",
    description: "Everyday things, chosen to make the everyday feel special.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noma Market",
    description: "Thoughtful finds for everyday living.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#181916" },
  ],
};

const themeScript = `
  try {
    if (localStorage.getItem("noma-theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (error) {
    console.warn("Theme preference is unavailable.", error);
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <StoreHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <StoreFooter />
      </body>
    </html>
  );
}
