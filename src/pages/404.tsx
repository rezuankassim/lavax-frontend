import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Custom404: NextPage = () => {
  return (
    <>
      <Head>
        <title>404: This page could not be found</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main className="mt-[180px] mb-[240px] flex items-center justify-center">
          <div className="flex max-w-[430px] flex-col items-center justify-center text-center">
            <Image src="/404.png" alt="404 page" width={100} height={100} />

            <h1 className="mt-12 text-5xl font-medium">404 - Not Found!</h1>

            <p className="mt-6 max-w-[271px] text-center text-xl">
              This page could not be found. Continue to the
              <Link href="/" className="ml-1 underline">
                Home Page
              </Link>
            </p>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Custom404;