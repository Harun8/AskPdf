import { SITE_URL } from "@/util/endpoints";
import { stripe } from "@/util/stripe/stripe";

export default async function handler(req, res) {
  console.log("post req, called", req.body);
  const body = await req.json();
  console.log("body", body.priceId);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: `${SITE_URL}/success`,
      cancel_url: `${SITE_URL}/pricing`,
    });

    const responseObject = {
      id: session.id,
    };
    const response = new Response(JSON.stringify(responseObject), {
      status: 200, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });

    return response;
  } catch (error) {
    console.error("Error:", error.message);

    const responseObject = {
      message: "req, faileed",
    };
    const response = new Response(JSON.stringify(responseObject), {
      status: 404, // Set the status code to 200 (OK)
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to 'application/json'
      },
    });

    return response;
  }
}
export { handler as POST };