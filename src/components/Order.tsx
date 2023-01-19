import currency from "currency.js";
import Image from "next/image";
import { FC, memo, useState } from "react";
import { usePopper } from "react-popper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type OrderProps = {
  order: any;
};

dayjs.extend(relativeTime);

const Order: FC<OrderProps> = ({ order }) => {
  const [referenceEl, setReferenceEl] = useState<HTMLSpanElement | null>(null);
  const [popperEl, setPopperEl] = useState<HTMLDivElement | null>(null);
  const { styles, attributes, update } = usePopper(referenceEl, popperEl, {
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  });

  return (
    <>
      <div className="shadow-lg">
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="font-medium">Order ID. {order.uuid}</span>

          <div className="flex items-center gap-x-4">
            <span
              ref={setReferenceEl}
              onMouseEnter={() => {
                popperEl?.setAttribute("data-show", "true");

                if (update) {
                  update();
                }
              }}
              onMouseLeave={() => popperEl?.removeAttribute("data-show")}
            >
              {dayjs(order.created_at).fromNow()}
            </span>
            <div
              ref={setPopperEl}
              style={styles.popper}
              {...attributes.popper}
              className="hidden rounded bg-black px-1 py-2 font-medium text-white data-[show=true]:block"
            >
              {dayjs(order.created_at).format("ddd DD MMM hh:mm A")}
            </div>

            <span className="rounded-full bg-green-200 px-4 text-green-400">
              PAID
            </span>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-6">
          <ul className="flex flex-col gap-y-4">
            {order.cart.products.map((product: any) => (
              <li key={product.id}>
                <div className="flex gap-x-4">
                  <div className="relative h-[150px] w-[120px]">
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_BACKEND_URL + product.photoUrl
                      }`}
                      alt="Product's Image"
                      fill={true}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 pt-3 pb-6">
                    <span className="font-medium">{product.title}</span>

                    <div className="mt-4 flex items-center justify-between">
                      <span>x{product.pivot.quantity}</span>
                      <span className="text-gray-500">RM{product.price}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-600">Subtotal</p>

            <p className="text-lg font-medium">
              {order.cart?.products.reduce(
                (sum: string, product: any) =>
                  currency(sum, { symbol: "RM" })
                    .add(product.price * product.pivot.quantity)
                    .format(),
                currency(0, { symbol: "RM" }).format()
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const OrderMemo = memo(Order);

export default OrderMemo;
