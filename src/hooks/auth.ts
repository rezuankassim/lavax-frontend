import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { create } from "zustand";

type AuthState = {
  user: any;
  open: boolean;
  isError: boolean;
  isSubmitError: boolean;
  isLoading: boolean;
  isRefetched: boolean;
  refetch: any;
  register: (props: any) => void;
  login: any;
  logout: any;
  setOpen: (open: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  open: false,
  isLoading: true,
  isError: false,
  isSubmitError: false,
  isRefetched: false,
  setOpen: (open) => set(() => ({ open: open })),
  refetch: () => {
    if (!get().isRefetched) {
      set(() => ({ isLoading: true, isRefetched: false }));

      axios
        .get("/api/user")
        .then((res) =>
          set(() => ({ user: res.data, isLoading: false, isRefetched: true }))
        )
        .catch((error) =>
          set(() => ({ isError: true, isLoading: false, isRefetched: true }))
        );
    }
  },
  register: async ({ ...props }) => {
    set(() => ({ isLoading: true }));

    // Need to call this before making post request
    // because of Laravel Sanctum need to verify
    // CSRF token, so need to attach the cookie
    // on every requests that is not 'GET'
    await axios.get("/sanctum/csrf-cookie");

    axios
      .post("/register", props, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(async () => {
        set(() => ({ isSubmitError: false }));

        axios
          .get("/api/user")
          .then((res) => set(() => ({ user: res.data, isLoading: false })))
          .catch((error) => set(() => ({ isError: true, isLoading: false })));
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        set(() => ({ isSubmitError: true, isLoading: false }));
      });
  },
  login: async ({ ...props }) => {
    set(() => ({ isLoading: true }));

    // Need to call this before making post request
    // because of Laravel Sanctum need to verify
    // CSRF token, so need to attach the cookie
    // on every requests that is not 'GET'
    await axios.get("/sanctum/csrf-cookie");

    axios
      .post("/login", props, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(async () => {
        set(() => ({ isSubmitError: false }));

        axios
          .get("/api/user")
          .then((res) => set(() => ({ user: res.data, isLoading: false })))
          .catch((error) => set(() => ({ isError: true, isLoading: false })));
      })
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        set(() => ({ isSubmitError: true, isLoading: false }));
      });
  },
  logout: async () => {
    set(() => ({ isLoading: true }));

    await axios
      .post("/logout")
      .then(() => set(() => ({ user: undefined, isLoading: false })));
  },
}));
