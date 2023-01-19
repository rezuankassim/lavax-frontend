import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  from,
} from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { asyncMap } from "@apollo/client/utilities";
import axios from "@/lib/axios";
import { setContext } from "@apollo/client/link/context";
import PrivateRoute from "@/components/PrivateRoute";

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
  credentials: "include",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
  },
});

// Middleware to get CSRF cookies for Laravel Sanctum
// Need to attach CSRF cookies for GraphQL
const getCSRFTokenMiddleware = setContext(async (operation) => {
  if (!Cookies.get("XSRF-TOKEN")) {
    await axios.get("/sanctum/csrf-cookie");
  }

  return {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    },
  };
});

const client = new ApolloClient({
  link: from([getCSRFTokenMiddleware, httpLink]),
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // Add pages url that is required auth to this array
  // eg. '/products'
  const protectedRoutes: string[] = ["/orders"];

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <PrivateRoute protectedRoutes={protectedRoutes}>
          <Component {...pageProps} />
        </PrivateRoute>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
