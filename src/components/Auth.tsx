import { useAuthStore } from "@/hooks/auth";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Formik } from "formik";
import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";

type AuthProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Auth: FC<AuthProps> = ({ open, setOpen }) => {
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);

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
                        <span className="text-2xl">Login</span>

                        <Formik
                          initialValues={{ email: "", password: "" }}
                          onSubmit={async (values, { setSubmitting }) => {
                            login({
                              email: values.email,
                              password: values.password,
                            });

                            setError("");
                            setSubmitting(false);
                            setOpen(false);
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                          }) => (
                            <form className="mt-6" onSubmit={handleSubmit}>
                              {error ? (
                                <div className="mb-6 rounded bg-red-50 p-4">
                                  <div className="flex">
                                    <div className="flex-shrink-0">
                                      <XCircleIcon
                                        className="h-5 w-5 text-red-400"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div className="ml-3">
                                      <h3 className="text-sm font-medium text-red-800">
                                        {error}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              <div className="flex flex-col">
                                <label htmlFor="email">Email</label>
                                <input
                                  id="email"
                                  type="email"
                                  name="email"
                                  className="mt-1 rounded border border-gray-300 placeholder:text-gray-400"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.email}
                                  placeholder="you@email.com"
                                />
                              </div>

                              <div className="mt-6 flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input
                                  id="password"
                                  type="password"
                                  name="password"
                                  className="mt-1 rounded border border-gray-300 placeholder:text-gray-400"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.password}
                                />
                              </div>

                              <button
                                type="submit"
                                className="mt-6 w-full rounded bg-black py-3 text-white"
                              >
                                Login
                              </button>
                            </form>
                          )}
                        </Formik>
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
