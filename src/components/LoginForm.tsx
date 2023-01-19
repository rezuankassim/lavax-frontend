import { useAuthStore } from "@/hooks/auth";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Formik } from "formik";
import { FC } from "react";

const LoginForm: FC = () => {
  const login = useAuthStore((state) => state.login);
  const isSubmitError = useAuthStore((state) => state.isSubmitError);

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          login({
            email: values.email,
            password: values.password,
          });

          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form className="mt-6" onSubmit={handleSubmit}>
            {isSubmitError ? (
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
                      There is some issue performing this action. Please try
                      again.
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
    </>
  );
};

export default LoginForm;
