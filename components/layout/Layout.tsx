import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main className="flex-grow my-10 mx-4 md:mx-8 lg:mx-16 xl:mx-auto xl:max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
