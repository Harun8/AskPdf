"use client";
import { SITE_URL } from "@/util/endpoints";
import { stripe } from "@/util/stripe/stripe";
import { loadStripe } from "@stripe/stripe-js";

export default async function Pricing() {
  const { data: prices } = await stripe.prices.list();
  const plans = [];

  for (const price of prices) {
    const product = await stripe.products.retrieve(price.product);
    plans.push({
      name: product.name,
      id: price.id,
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
    });
  }
  async function onCheckout() {
    console.log("checkout FN called");
    const priceId = "price_1OdUr0BzVPtG7eO2qrV6Zn89";
    const response = await fetch(`/api/checkout/${priceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    await stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <div class="sm:flex sm:flex-col sm:align-center p-10">
      <div class="relative self-center  rounded-lg p-0.5 flex">
        <h2 class="text-xl leading-6 font-bold dark:text-slate-100 text-slate-900">
          Choose one of our incredible options
        </h2>
      </div>
      <div class="mt-6 relative self-center  rounded-lg p-0.5 flex">
        <button
          type="button"
          class="relative w-1/2 rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none sm:w-auto sm:px-8 bg-slate-50 border-slate-50 text-slate-900 shadow-sm">
          Monthly billing
        </button>
        <button
          type="button"
          class="dark:text-white ml-0.5 relative w-1/2 border rounded-md py-2 text-sm font-medium whitespace-nowrap focus:outline-none sm:w-auto sm:px-8 border-transparent text-slate-900">
          Yearly billing
        </button>
      </div>

      <div class="mt-12 space-y-3 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 md:max-w-5xl md:mx-auto xl:grid-cols-3">
        <div class=" bg-gray-200 dark:bg-gray-900 	 border border-slate-900 rounded-lg shadow-sm divide-y divide-slate-200">
          <div class="p-6">
            <h2 class="text-xl leading-6 font-bold dark:text-slate-100 text-slate-900">
              Starter
            </h2>
            <p class="mt-2 text-base dark:text-slate-100  text-slate-700 leading-tight">
              For new makers who want to fine-tune and test an idea. Will always
              be free
            </p>
            <p class="mt-8">
              <span class="text-4xl font-bold dark:text-slate-100  text-slate-900 tracking-tighter">
                0 kr
              </span>

              <span class="text-base font-medium dark:text-slate-100  text-slate-500">
                /måneden
              </span>
            </p>
            <a
              href="/sign-up"
              class="mt-8 block w-full dark:bg-slate-700 bg-slate-900 rounded-md py-2 text-sm font-semibold text-white text-center">
              Join as a Starter
            </a>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3 class="text-sm font-bold dark:text-slate-100  text-slate-900 tracking-wide uppercase">
              What's included
            </h3>
            <ul role="list" class="mt-4 space-y-3">
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  1 PDF upload
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  50 monthly questions limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  5MB max file limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  width="20"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path
                    fill="#ff0000"
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  />
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  GPT-4
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  width="20"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path
                    fill="#ff0000"
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  />
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  New feature early access
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  width="20"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path
                    fill="#ff0000"
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  />
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  Customer support
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class=" bg-gray-200 dark:bg-gray-900 	 border border-slate-900 rounded-lg shadow-sm divide-y divide-slate-200">
          <div class="p-6">
            <h2 class="text-xl leading-6 font-bold dark:text-slate-100 text-slate-900">
              {plans[1].name}
            </h2>
            <p class="mt-2 text-base dark:text-slate-100  text-slate-700 leading-tight">
              For new makers who want to fine-tune and test an idea.
            </p>
            <p class="mt-8">
              <span class="text-4xl font-bold dark:text-slate-100  text-slate-900 tracking-tighter">
                {plans[1].price} kr
              </span>

              <span class="text-base font-medium dark:text-slate-100  text-slate-500">
                /måneden
              </span>
            </p>
            <a
              href="/sign-up"
              class="mt-8 block w-full dark:bg-slate-700 bg-slate-900 rounded-md py-2 text-sm font-semibold text-white text-center">
              Join as a Premium user
            </a>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3 class="text-sm font-bold dark:text-slate-100  text-slate-900 tracking-wide uppercase">
              What's included
            </h3>
            <ul role="list" class="mt-4 space-y-3">
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  50 PDF uploads
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  100 monthly question limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  10MB max file limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  width="20"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512">
                  <path
                    fill="#ff0000"
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  />
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  GPT-4
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  New feature early access
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  Customer support (email)
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class=" bg-gray-200 dark:bg-gray-900 	 border border-slate-900 rounded-lg shadow-sm divide-y divide-slate-200">
          <div class="p-6">
            <h2 class="text-xl leading-6 font-bold dark:text-slate-100 text-slate-900">
              {plans[0].name}
            </h2>
            <p class="mt-2 text-base dark:text-slate-100  text-slate-700 leading-tight">
              For new makers who want to fine-tune and test an idea.
            </p>
            <p class="mt-8">
              <span class="text-4xl font-bold dark:text-slate-100  text-slate-900 tracking-tighter">
                {plans[0].price} kr
              </span>

              <span class="text-base font-medium dark:text-slate-100  text-slate-500">
                /måneden
              </span>
            </p>
            <button
              onClick={onCheckout}
              class="mt-8 block w-full dark:bg-slate-700 bg-slate-900 rounded-md py-2 text-sm font-semibold text-white text-center">
              Join as a ultimate user
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h3 class="text-sm font-bold dark:text-slate-100  text-slate-900 tracking-wide uppercase">
              What's included
            </h3>
            <ul role="list" class="mt-4 space-y-3">
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  100 PDF uploads
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  200 monthly question limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  50MB max file limit
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  GPT-4
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  New feature early access
                </span>
              </li>
              <li class="flex space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-shrink-0 h-5 w-5 text-green-400"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l5 5l10 -10"></path>
                </svg>
                <span class="text-base dark:text-slate-100  text-slate-700">
                  Customer support (email)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
