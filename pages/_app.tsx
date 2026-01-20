import Layout from "@/components/layout/Layout";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>RentSmart</title>
        <meta
          name="description"
          content="Find and Book Your Perfect Rental Property Easily"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastProvider>
    </>
  );
}
