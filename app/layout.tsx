import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "VistaLuxe Travel | Premium Tour & Travel Agency",
  description: "Experience world-class luxury boutique travel. We create custom, premium, and unforgettable journeys to the earth's most spectacular destinations.",
  openGraph: {
    title: "VistaLuxe Travel | Premium Tour & Travel Agency",
    description: "Experience world-class luxury boutique travel. Custom, premium, and unforgettable journeys.",
    url: "/",
    siteName: "VistaLuxe Travel",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VistaLuxe Travel | Premium Tour & Travel Agency",
    description: "Experience world-class luxury boutique travel.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}


