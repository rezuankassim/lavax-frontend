import { useCartStore } from "@/hooks/cart";
import { useNotificationStore } from "@/hooks/notification";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";

const Notification: FC = () => {
  const productTitle = useNotificationStore((state) => state.productTitle);
  const message = useNotificationStore((state) => state.message);
  const status = useNotificationStore((state) => state.status);
  const setOpenCart = useCartStore((state) => state.setOpen);

  return (
    <>
      {message ? (
        <div
          className={`absolute top-24 right-12 flex items-start gap-x-4 rounded-lg px-5 py-5 shadow-lg ${
            status === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {status === "success" ? (
            <CheckCircleIcon className="h-12 w-12" />
          ) : (
            <ExclamationCircleIcon className="h-12 w-12" />
          )}

          <span className="max-w-[250px]">
            {productTitle ? (
              <span className="font-medium">{productTitle} </span>
            ) : null}
            <span>{message}</span>

            <button className="ml-2" onClick={() => setOpenCart(true)}>
              <span className="underline">View Cart</span>
            </button>
          </span>

          <button>
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Notification;
