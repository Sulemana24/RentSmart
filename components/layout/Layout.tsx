import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  onSearch?: (searchData: { query: string; bedroomType: string }) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  return (
    <>
      <Header onSearch={onSearch} />
      <main className="min-h-screen my-10 mx-4">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
