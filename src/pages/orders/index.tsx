import Layout from "@/components/Layout";
import { GET_ORDERS_BY_USER_ID } from "@/graphql/query";
import { useAuthStore } from "@/hooks/auth";
import { useQuery } from "@apollo/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Order from "@/components/Order";

const Orders: NextPage = () => {
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables: {
      first: 10,
      page: page,
      orderBy: [{ column: "created_at", order: "DESC" }],
    },
  });

  return (
    <>
      <Head>
        <title>Orders</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <div className="bg-gray-100 px-32 pt-16 pb-44">
            <h1 className="text-5xl font-medium">My Orders</h1>
            <div className="mt-2 flex items-center gap-x-3">
              <Link href="/">Home</Link>
              <span className="text-gray-400">
                <ChevronRightIcon className="h-4 w-4" />
              </span>
              <span className="text-gray-400">My Account</span>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 px-32 pt-14 pb-24">
            <div className="flex items-center justify-center">
              <span className="text-gray-500">
                {!loading && !error && data.orders.paginatorInfo ? (
                  <span>
                    Showing{" "}
                    {data.orders.paginatorInfo.count < 10
                      ? data.orders.paginatorInfo.count
                      : 10}{" "}
                    of {data.orders.paginatorInfo.total}
                  </span>
                ) : null}
              </span>
            </div>

            {!loading && !error && data.orders.data.length
              ? data.orders.data.map((order: any) => (
                  <Order key={order.uuid} order={order} />
                ))
              : null}

            <div className="mt-10 flex items-center gap-x-3">
              <button
                className="rounded-full border border-black p-3 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-500"
                onClick={() => setPage((curr) => curr - 1)}
                disabled={
                  loading ||
                  error !== undefined ||
                  data.orders.paginatorInfo.currentPage === 1
                }
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>

              <button
                className="rounded-full border border-black p-3 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-500"
                onClick={() => setPage((curr) => curr + 1)}
                disabled={
                  loading ||
                  error !== undefined ||
                  data.orders.paginatorInfo.hasMorePages === false
                }
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Orders;