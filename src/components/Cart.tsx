import { useCartStore } from "@/hooks/cart";
import { Product } from "@/models";
import { Dialog, Transition } from "@headlessui/react";
import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import currency from "currency.js";
import CartItem from "./CartItem";
import axios from "axios";
import getStripe from "@/lib/getStripe";
import { useAuthStore } from "@/hooks/auth";

const Cart: FC = () => {
  const user = useAuthStore((state) => state.user);
  const cart = useCartStore((state) => state.cart);
  const open = useCartStore((state) => state.open);
  const setOpen = useCartStore((state) => state.setOpen);

  const checkout = async () => {
    const response = await axios.post(
      "/api/checkout-session",
      {
        customerId: user.id,
        cartId: cart?.id,
        products: cart?.products.map((product) => ({
          price: product.stripe_price_id,
          quantity: product.pivot.quantity,
        })),
      },
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      }
    );

    if (response.status === 500) {
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: response.data.id,
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll pt-6">
                      <div className="px-6">
                        <Dialog.Title className="flex items-start justify-between">
                          <span className="text-2xl font-medium text-gray-900">
                            Your Cart
                          </span>

                          <button
                            type="button"
                            className="focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                          </button>
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 bg-gray-100 px-6 py-6">
                        <ul className="flex flex-col gap-y-4">
                          {cart?.products.map((product) => (
                            <CartItem
                              key={product.id}
                              cartId={cart.id}
                              productId={product.id}
                              title={product.title}
                              quantity={product.pivot.quantity}
                              price={product.price}
                              photoUrl={product.photoUrl}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-600">
                          Subtotal
                        </p>

                        <p className="text-lg font-medium">
                          {cart?.products.reduce(
                            (sum, product) =>
                              currency(sum, { symbol: "RM" })
                                .add(product.price * product.pivot.quantity)
                                .format(),
                            currency(0, { symbol: "RM" }).format()
                          )}
                        </p>
                      </div>

                      <button
                        className="mt-5 w-full rounded bg-black py-3 text-center font-medium text-white"
                        onClick={checkout}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Cart;
