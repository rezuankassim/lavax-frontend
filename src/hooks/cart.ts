import { GET_CART_BY_USER_ID } from "@/graphql/query";
import axios from "@/lib/axios";
import { print } from "graphql";
import { create } from "zustand";

type Cart = {
  id: number;
  products: {
    id: number;
    title: string;
    slug: string;
    photoUrl: string;
    price: number;
    stripe_price_id: string;
    pivot: {
      quantity: number;
    };
  }[];
};

type CartState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cart: Cart | null;
  getCart: any;
};

export const useCartStore = create<CartState>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open: open })),
  cart: null,
  getCart: (userId: number | null) => {
    axios
      .post("/graphql", {
        query: print(GET_CART_BY_USER_ID),
        variables: {
          user_id: userId,
          status: 0,
        },
      })
      .then((res) =>
        set(() => ({ cart: res.data.data?.cart ? res.data.data.cart : null }))
      );
  },
}));
