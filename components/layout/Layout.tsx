"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const hideLayout =
    router.pathname.startsWith("/admin") ||
    router.pathname.startsWith("/homeowner") ||
    router.pathname.startsWith("/hostel");
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {!hideLayout && <Header />}
      <main className="flex-grow my-10 mx-4 md:mx-8 xl:max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
