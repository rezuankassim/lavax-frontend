import Image from "next/image";
import Link from "next/link";
import { FC, memo } from "react";

type ProductProps = {
  slug: string;
  title: string;
  photoUrl: string;
  price: number;
};

const Product: FC<ProductProps> = ({ slug, title, photoUrl, price }) => {
  return (
    <>
      <Link href={`/products/${slug}`}>
        <div className="relative h-[350px] w-[270px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL + photoUrl}`}
            alt="Product's Image"
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-5 font-medium">{title}</p>

        <p className="mt-1">RM{price}</p>
      </Link>
    </>
  );
};

const ProductMemo = memo(Product);

export default ProductMemo;
