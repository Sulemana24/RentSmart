import Layout from "@/components/layout/Layout";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { useEffect, useState } from "react";

function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>RentSmart </title>
        <meta
          name="description"
          content="Find and Book Your Perfect Rental Property Easily"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DarkModeWrapper>
        <ToastProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </DarkModeWrapper>
    </>
  );
}
