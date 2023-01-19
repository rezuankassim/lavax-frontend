import { useAuthStore } from "@/hooks/auth";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Formik } from "formik";
import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Auth: FC = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const open = useAuthStore((state) => state.open);
  const setOpen = useAuthStore((state) => state.setOpen);

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
                        <Dialog.Title className="flex items-start justify-end">
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
                      <div className="relative mt-6 flex-1 px-6">
                        <div className="flex items-center gap-x-6">
                          <button
                            onClick={() => setTab("login")}
                            className="text-2xl text-gray-400 disabled:text-black"
                            disabled={tab === "login"}
                          >
                            <span>Login</span>
                          </button>

                          <button
                            onClick={() => setTab("signup")}
                            className="text-2xl text-gray-400 disabled:text-black"
                            disabled={tab === "signup"}
                          >
                            <span>Sign Up</span>
                          </button>
                        </div>

                        {tab === "login" ? <LoginForm /> : <SignUpForm />}
                      </div>
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

export default Auth;
