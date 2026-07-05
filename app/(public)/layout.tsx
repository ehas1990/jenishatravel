import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* Padding-top to account for fixed/sticky navbar */}
      <main className="flex-grow pt-[84px] md:pt-[96px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
