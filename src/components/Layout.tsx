import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { Menu, Transition } from "@headlessui/react";
import { useAuthStore } from "@/hooks/auth";
import { useCartStore } from "@/hooks/cart";
import Notification from "./Notification";
import Link from "next/link";
import dynamic from "next/dynamic";

const Cart = dynamic(() => import("./Cart"));
const Auth = dynamic(() => import("./Auth"));

type LayoutProps = {
  children: ReactNode;
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const setOpenCart = useCartStore((state) => state.setOpen);
  const [openAuth, setOpenAuth] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cart = useCartStore((state) => state.cart);
  const getCart = useCartStore((state) => state.getCart);

  useEffect(() => {
    getCart(user?.id || null);
  }, [user, getCart]);

  return (
    <>
      <main className="relative flex h-screen flex-col">
        <div className="mx-auto max-w-7xl">
          <nav className="flex w-[1280px] items-center justify-between px-5 py-9">
            <div className="flex items-center gap-x-10">
              <Link href="/">
                <Logo />
              </Link>

              <Link href="/products">Products</Link>
            </div>

            <ul className="flex items-center justify-between gap-x-6">
              <li className="relative h-7 w-7">
                <button aria-label="My Cart" onClick={() => setOpenCart(true)}>
                  <ShoppingBagIcon className="h-7 w-7" />
                </button>

                {cart?.products.length ? (
                  <span className="absolute -top-3 -right-5 h-6 w-6 origin-top-right rounded-full bg-black text-center text-white">
                    {cart.products.length}
                  </span>
                ) : null}
              </li>

              {user ? (
                <Menu as="li" className="relative inline-block h-7 w-7">
                  <div>
                    <Menu.Button aria-label="My Account">
                      <UserIcon className="h-7 w-7" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3">
                        <p className="text-sm">Signed in as</p>
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block w-full px-4 py-2 text-left text-sm"
                              )}
                              href="/orders"
                            >
                              My Orders
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block w-full px-4 py-2 text-left text-sm"
                              )}
                              onClick={() => logout()}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button aria-label="Login" onClick={() => setOpenAuth(true)}>
                  <ArrowRightOnRectangleIcon className="h-7 w-7" />
                </button>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex-1">{children}</div>

        <div className="border-t border-gray-200">
          <div className="flex gap-x-14 px-32 py-14">
            <div className="max-w-xs">
              <span className="text-lg font-medium">About Shop</span>

              <p className="mt-6 text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>

              <p className="mt-6">E. hello@email.com</p>
              <p className="mt-2">T. (00) 342 489 33</p>
            </div>

            <div className="flex flex-1 justify-between">
              <div className="flex flex-col gap-y-6">
                <span className="text-lg font-medium">Company</span>

                <div className="flex flex-col gap-y-3">
                  <span>About Us</span>
                  <span>Careers</span>
                  <span>Store Locator</span>
                  <span>Contact Us</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-6">
                <span className="text-lg font-medium">Customer Care</span>

                <div className="flex flex-col gap-y-3">
                  <span>Size Guide</span>
                  <span>Help & FAQs</span>
                  <span>Return My Order</span>
                  <span>Refer a Friend</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-6">
                <span className="text-lg font-medium">Terms & Policies</span>

                <div className="flex flex-col gap-y-3">
                  <span>Duties & Taxes</span>
                  <span>Shipping Info</span>
                  <span>Privacy Policy</span>
                  <span>Terms Conditions</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-6">
                <span className="text-lg font-medium">Follow Us</span>

                <div className="flex flex-col gap-y-3">
                  <span>Instagram</span>
                  <span>Facebook</span>
                  <span>Pintrest</span>
                  <span>Tiktok</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-10 px-32">
            <span className="text-gray-500">
              ©2023 January. All rights reserved
            </span>
          </div>
        </div>

        <Notification />
      </main>

      <Cart />
      <Auth open={openAuth} setOpen={setOpenAuth} />
    </>
  );
};

export default Layout;
