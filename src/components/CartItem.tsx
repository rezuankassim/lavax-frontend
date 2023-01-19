import { UPDATE_CART } from "@/graphql/mutation";
import { useAuthStore } from "@/hooks/auth";
import { useCartStore } from "@/hooks/cart";
import { useMutation } from "@apollo/client";
import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FC, memo, useCallback, useEffect, useState } from "react";

type CartItemProps = {
  cartId: number;
  productId: number;
  title: string;
  quantity: number;
  price: number;
  photoUrl: string;
};

const CartItem: FC<CartItemProps> = ({
  cartId,
  productId,
  title,
  quantity,
  price,
  photoUrl,
}) => {
  const getCart = useCartStore((state) => state.getCart);
  const user = useAuthStore((state) => state.user);
  const [updateCartItemMutation] = useMutation(UPDATE_CART);
  const [quantityState, setQuantityState] = useState(quantity);

  /**
   * Function to remove product in cart and will
   * update the cart state in store after
   * calling mutation to the database
   */
  const removeCartItem = async () => {
    await updateCartItemMutation({
      variables: {
        input: {
          id: cartId,
          products: {
            disconnect: [productId],
          },
        },
      },
    });

    getCart(user.id);
  };

  /**
   * Function to update quantity of the product in cart
   * and will update the cart state in store after
   * calling mutation to the database.
   */
  const updateQuantity = useCallback(async () => {
    await updateCartItemMutation({
      variables: {
        input: {
          id: cartId,
          products: {
            syncWithoutDetaching: [
              {
                id: productId,
                quantity: quantityState,
              },
            ],
          },
        },
      },
    });

    getCart(user.id);
  }, [cartId, productId, quantityState, user, getCart, updateCartItemMutation]);

  useEffect(() => {
    updateQuantity();
  }, [quantityState, updateQuantity]);

  return (
    <li>
      <div className="flex gap-x-4">
        <div className="relative h-[150px] w-[120px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL + photoUrl}`}
            alt="Product's Image"
            fill={true}
            className="object-cover"
          />
        </div>

        <div className="relative flex-1 pt-3 pb-6">
          <span className="font-medium">{title}</span>

          <div className="mt-4 flex items-center justify-between">
            <div className=" flex w-28 items-center justify-between rounded border border-gray-200 px-2 py-2">
              <button
                className="disabled:cursor-not-allowed"
                onClick={() => setQuantityState((curr) => curr - 1)}
                disabled={quantityState === 1}
              >
                <MinusIcon className="h-6 w-6" />
              </button>
              <span>{quantityState}</span>
              <button onClick={() => setQuantityState((curr) => curr + 1)}>
                <PlusIcon className="h-6 w-6" />
              </button>
            </div>

            <span className="text-gray-500">RM{price}</span>

            <button className="absolute top-0 right-0" onClick={removeCartItem}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

const CartItemMemo = memo(CartItem);

export default CartItemMemo;
