"use client";

import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import ToggleBtn from "./ToggleBtn";
const Nav = ({ session }) => {
  // const [session, setSession] = useState();
  const [loading, setLoading] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const router = useRouter();

  return (
    <nav className="">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => setToggleDropDown((prev) => !prev)}
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false">
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="">
            <div className="  hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <div className="flex flex-shrink-0 items-center mt-1">
                  <ToggleBtn></ToggleBtn>
                </div>
                <Link
                  href="/"
                  className="  dark:bg-gray-800 dark:text-white hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium"
                  aria-current="page">
                  Home page
                </Link>

                {session ? (
                  <>
                    <Link
                      href="/chat"
                      className="  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
                      New chat
                    </Link>
                    <Link
                      href="/mychats"
                      className="  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
                      My chats
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pricing"
                      className="  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
                      Pricing
                    </Link>

                    <Link
                      href="/preview"
                      className="  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
                      Preview
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {session ? (
              <>
                {/* <p className=" dark:text-gray-300 font-semibold mr-24 text-gray-700 ">
                  Welcome, {session.user.email}
                </p> */}
                <button
                  className="bg-slate-900 font-semibold rounded px-4 py-2 text-white"
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const { error } = await supabase.auth.signOut();
                    setLoading(false);
                    router.refresh();
                    // if (!error) setSession(null);
                  }}
                  disabled={loading}>
                  {loading ? "Loading" : "Logout"}
                </button>{" "}
              </>
            ) : (
              <>
                
                <Link
                  href="/sigin"
                  className=" text-black hover:bg-slate-800 hover:dark:bg-gray-700 dark:text-white  hover:text-white hover:font-bold dark:bg-gray-800 font-semibold rounded mr-3 px-4 py-2 ">
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className=" bg-black text-white hover:bg-slate-800 hover:dark:bg-gray-700 dark:text-white  hover:text-white hover:font-bold dark:bg-gray-800 font-semibold  mr-3 px-4 py-2 ">
                  Get started
                </Link>
              </>
            )}
            {/* <button
              type="button"
              className=" ml-4 relative rounded-full bg-slate-300 dark:bg-gray-800 p-1 text-black dark:text-white hover:dark:text-slate-500 hover:bg-slate-400  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>

      {toggleDropDown && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium"
              aria-current="page">
              Home page
            </Link>
            {session ? (
              <Link
                href="chat"
                className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium">
                Chat
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium">
                Pricing
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
