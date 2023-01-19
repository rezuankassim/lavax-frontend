// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CREATE_ORDER } from "@/graphql/mutation";
import axios from "@/lib/axios";
import { print } from "graphql";
import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const signature = req.headers["stripe-signature"]!;
    const buf = await buffer(req);
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const object: any = event.data.object;
      if (object.payment_status === "paid") {
        const customerId = object.metadata.customer_id;
        const cartId = object.metadata.cart_id;

        await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql", {
          query: print(CREATE_ORDER),
          variables: {
            input: {
              user_id: customerId,
              cart_id: cartId,
              cart: {
                update: { id: cartId, status: 1 },
              },
            },
          },
        });
      }
    }

    res.send({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as any);
