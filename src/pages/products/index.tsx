import Layout from "@/components/Layout";
import { NextPage } from "next";
import Head from "next/head";
import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/graphql/query";
import Product from "@/components/Product";
import { Product as IProduct } from "@/models";
import { useEffect, useState } from "react";
import Link from "next/link";

const Products: NextPage = () => {
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrdering, setSelectedOrdering] = useState<"latest" | "title">(
    "latest"
  );
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: {
      title: `%${title}%`,
      orderBy: [
        // Just a simple condition to check for simple ordering filter
        // will need to improve on this if the ordering become
        // more complicated
        {
          column: selectedOrdering === "latest" ? "created_at" : "title",
          order: selectedOrdering === "latest" ? "DESC" : "ASC",
        },
      ],
      first: 12,
      page: page,
    },
  });

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <div className="bg-gray-100 px-32 pt-16 pb-44">
            <h1 className="text-5xl font-medium">Products</h1>
            <div className="mt-2 flex items-center gap-x-3">
              <Link href="/">Home</Link>
              <span className="text-gray-400">
                <ChevronRightIcon className="h-4 w-4" />
              </span>
              <span className="text-gray-400">Shop</span>
            </div>
          </div>

          <div className="px-32 pt-14 pb-24">
            <div className="flex items-center justify-between">
              <div className="relative">
                <input
                  type="text"
                  className="w-72 border border-gray-300 p-3 placeholder:text-gray-400"
                  placeholder="Search by title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <MagnifyingGlassIcon className="absolute top-0 right-0 mr-3 mt-3 h-6 w-6" />
              </div>

              <span className="text-gray-500">
                {!loading && !error && data.products.paginatorInfo ? (
                  <span>
                    Showing{" "}
                    {data.products.paginatorInfo.count < 10
                      ? data.products.paginatorInfo.count
                      : 10}{" "}
                    of {data.products.paginatorInfo.total}
                  </span>
                ) : null}
              </span>

              <select
                defaultValue={selectedOrdering}
                onChange={(e) =>
                  setSelectedOrdering(e.target.value as "latest" | "title")
                }
                className="focus:outline-none"
              >
                <option value="latest">Sort By Latest</option>
                <option value="title">Sort By Title</option>
              </select>
            </div>

            <div className="mt-9 grid grid-cols-4 gap-x-7 gap-y-10">
              {!loading && !error && data.products.data.length ? (
                data.products.data.map((product: IProduct) => (
                  <Product
                    key={`new-arrivals-${product.slug}`}
                    slug={product.slug}
                    title={product.title}
                    photoUrl={product.photoUrl!}
                    price={product.price!}
                  />
                ))
              ) : (
                <>
                  <div>
                    <div className="h-[350px] w-[270px] animate-pulse bg-gray-500"></div>

                    <div className="mt-4 h-4 w-36 animate-pulse bg-gray-500"></div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-20 flex items-center gap-x-3">
              <button
                className="rounded-full border border-black p-3 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-500"
                onClick={() => setPage((curr) => curr - 1)}
                disabled={
                  loading ||
                  error !== undefined ||
                  data.products.paginatorInfo.currentPage === 1
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
                  data.products.paginatorInfo.hasMorePages === false
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

export default Products;
