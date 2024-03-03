"use client";
import { Menu } from "@headlessui/react";

import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import ToggleBtn from "./ToggleBtn";
import Settings from "@/public/settings.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "./ui/button";
import AskPDF from "@/public/askpdf2.png";
import { DropDown } from "./smNav";

const Nav = ({ session }) => {
  // const [session, setSession] = useState();
  const [loading, setLoading] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  // const [session, setSession] = useState(null);
  const router = useRouter();

  const supabase = createClientComponentClient();

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const {
  //         data: { session },
  //       } = await supabase.auth.getSession();
  //       console.log("session", session);
  //       setSession(session);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getUser();
  // }, []); // Removed session from dependencies
  // console.log("session", session);

  const handleToggle = (event) => {
    // event.stopPropagation();
    setToggleDropDown((prev) => !prev);
    console.log("toggleDropDown:", !toggleDropDown); // Add this line to check the state change
  };

  return (
    <>
      <nav class="relative px-4 py-4 flex justify-between items-center bg-white">
        <Link class="text-3xl font-bold leading-none" href="/">
          <Image src={AskPDF} width={50} height={50} alt="AskPDF logo"></Image>
        </Link>

        <div className=" md:hidden">
          <DropDown session={session}></DropDown>
        </div>
        <ul class="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 md:flex md:mx-auto md:flex md:items-center md:w-auto md:space-x-6">
          <li>
            <Link class=" text-blue-600 font-bold hover:text-black " href="/">
              Home
            </Link>
          </li>

          <li class="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              class="w-4 h-4 current-fill"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          {session ? (
            <>
              <li>
                <Link
                  class="text-sm text-gray-400 hover:text-gray-500 font-bold"
                  href="/chat">
                  Chat
                </Link>
              </li>

              <li class="text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  class="w-4 h-4 current-fill"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </li>
              <li>
                <Link
                  class="text-sm text-gray-400 hover:text-gray-500 font-bold"
                  href="/mychats">
                  My chats
                </Link>
              </li>
              <li class="text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  class="w-4 h-4 current-fill"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </li>
              <li>
                <Link
                  class="text-sm text-gray-400 hover:text-gray-500 font-bold"
                  href="/settings">
                  Settings
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  class="text-sm text-gray-400 hover:text-gray-500 font-bold"
                  href="/preview">
                  Preview
                </Link>
              </li>
              <li class="text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  class="w-4 h-4 current-fill"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </li>
              <li class="relative flex items-center">
                <Link
                  class=" text-sm text-red-400 hover:text-red-600 font-bold "
                  href="/pricing">
                  Pricing
                </Link>
                <span class="relative flex h-1 w-1 mb-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-1 w-1 bg-red-500"></span>
                </span>
              </li>

              <li class="text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  class="w-4 h-4 current-fill"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </li>
            </>
          )}
        </ul>
        {!session ? (
          <>
            <Link
              class="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
              href="/login">
              Login
            </Link>
            <Link
              class="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
              href="/signin">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <button
              class="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-blue-400 hover:bg-blue-900 text-sm text-white font-bold  rounded-xl transition duration-200"
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
            </button>
            {/* <Link
              href="/login">
              Login
            </Link> */}
          </>
        )}
      </nav>
      <div class="navbar-menu relative z-50 hidden">
        <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
          <div class="flex items-center mb-8">
            <Link class="mr-auto text-3xl font-bold leading-none" href="#">
              <svg class="h-12" alt="logo" viewBox="0 0 10240 10240">
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M8284 9162 c-2 -207 -55 -427 -161 -667 -147 -333 -404 -644 -733 -886 -81 -59 -247 -169 -256 -169 -3 0 -18 -9 -34 -20 -26 -19 -344 -180 -354 -180 -3 0 -29 -11 -58 -24 -227 -101 -642 -225 -973 -290 -125 -25 -397 -70 -480 -80 -22 -3 -76 -9 -120 -15 -100 -13 -142 -17 -357 -36 -29 -2 -98 -7 -153 -10 -267 -15 -436 -28 -525 -40 -14 -2 -45 -7 -70 -10 -59 -8 -99 -14 -130 -20 -14 -3 -41 -7 -60 -11 -19 -3 -39 -7 -45 -8 -5 -2 -28 -6 -50 -10 -234 -45 -617 -165 -822 -257 -23 -10 -45 -19 -48 -19 -7 0 -284 -138 -340 -170 -631 -355 -1107 -842 -1402 -1432 -159 -320 -251 -633 -308 -1056 -26 -190 -27 -635 -1 -832 3 -19 7 -59 10 -89 4 -30 11 -84 17 -120 6 -36 12 -77 14 -91 7 -43 33 -174 39 -190 3 -8 7 -28 9 -45 6 -35 52 -221 72 -285 7 -25 23 -79 35 -120 29 -99 118 -283 189 -389 67 -103 203 -244 286 -298 75 -49 178 -103 196 -103 16 0 27 16 77 110 124 231 304 529 485 800 82 124 153 227 157 230 3 3 28 36 54 74 116 167 384 497 546 671 148 160 448 450 560 542 14 12 54 45 90 75 88 73 219 172 313 238 42 29 77 57 77 62 0 5 -13 34 -29 66 -69 137 -149 405 -181 602 -7 41 -14 82 -15 90 -1 8 -6 46 -10 83 -3 37 -8 77 -10 88 -2 11 -7 65 -11 122 -3 56 -8 104 -9 107 -2 3 0 12 5 19 6 10 10 8 15 -10 10 -34 167 -346 228 -454 118 -210 319 -515 340 -515 4 0 40 18 80 40 230 128 521 255 787 343 118 40 336 102 395 113 28 5 53 11 105 23 25 5 59 12 75 15 17 3 41 8 55 11 34 7 274 43 335 50 152 18 372 29 565 29 194 0 481 -11 489 -19 2 -3 -3 -6 -12 -6 -9 -1 -20 -2 -24 -3 -33 -8 -73 -16 -98 -21 -61 -10 -264 -56 -390 -90 -649 -170 -1243 -437 -1770 -794 -60 -41 -121 -82 -134 -93 l-24 -18 124 -59 c109 -52 282 -116 404 -149 92 -26 192 -51 220 -55 17 -3 64 -12 105 -21 71 -14 151 -28 230 -41 19 -3 46 -7 60 -10 14 -2 45 -7 70 -10 25 -4 56 -8 70 -10 14 -2 53 -7 88 -10 35 -4 71 -8 81 -10 10 -2 51 -6 92 -9 101 -9 141 -14 147 -21 3 -3 -15 -5 -39 -6 -24 0 -52 -2 -62 -4 -21 -4 -139 -12 -307 -22 -242 -14 -700 -7 -880 13 -41 4 -187 27 -250 39 -125 23 -274 68 -373 111 -43 19 -81 34 -86 34 -4 0 -16 -8 -27 -17 -10 -10 -37 -33 -59 -52 -166 -141 -422 -395 -592 -586 -228 -257 -536 -672 -688 -925 -21 -36 -43 -66 -47 -68 -4 -2 -8 -7 -8 -11 0 -5 -24 -48 -54 -97 -156 -261 -493 -915 -480 -935 2 -3 47 -21 101 -38 54 -18 107 -36 118 -41 58 -25 458 -138 640 -181 118 -27 126 -29 155 -35 14 -2 45 -9 70 -14 66 -15 137 -28 300 -55 37 -7 248 -33 305 -39 28 -3 84 -9 125 -13 163 -16 792 -8 913 12 12 2 58 9 102 15 248 35 423 76 665 157 58 19 134 46 170 60 86 33 344 156 348 166 2 4 8 7 13 7 14 0 205 116 303 184 180 126 287 216 466 396 282 281 511 593 775 1055 43 75 178 347 225 455 100 227 236 602 286 790 59 220 95 364 120 485 6 28 45 245 50 275 2 14 7 41 10 60 3 19 8 49 10 65 2 17 6 46 9 65 15 100 35 262 40 335 3 39 8 89 10 112 22 225 33 803 21 1043 -3 41 -7 129 -11 195 -3 66 -8 136 -10 155 -2 19 -6 76 -10 125 -3 50 -8 101 -10 115 -2 14 -6 57 -10 95 -7 72 -12 113 -20 175 -2 19 -7 55 -10 80 -6 46 -43 295 -51 340 -2 14 -9 54 -15 90 -5 36 -16 97 -24 135 -8 39 -17 84 -20 100 -12 68 -18 97 -50 248 -19 87 -47 204 -61 260 -14 56 -27 109 -29 117 -30 147 -232 810 -253 832 -4 4 -7 -23 -8 -60z"></path>
              </svg>
            </Link>
            <button class="navbar-close">
              <svg
                class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Nav;

// <nav className=" ">
//   <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8 bg-zinc-200 ">
//     <div className="relative flex h-16 items-center justify-center">
//       <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
//         <button
//           onClick={() => setToggleDropDown((prev) => !prev)}
//           type="button"
//           className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//           aria-controls="mobile-menu"
//           aria-expanded="false">
//           <span className="absolute -inset-0.5"></span>
//           <span className="sr-only">Open main menu</span>

//           <svg
//             className="block h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             aria-hidden="true">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
//             />
//           </svg>

//           <svg
//             className="hidden h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             aria-hidden="true">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>
//       <div className="">
//         <div className="  hidden sm:ml-6 sm:block">
//           <div className="flex space-x-4">
//             <div className="flex flex-shrink-0 items-center mt-1">
//               <ToggleBtn></ToggleBtn>
//             </div>
//             <Link
//               href="/"
//               className=" text-xl  dark:bg-gray-800 dark:text-white hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium"
//               aria-current="page">
//               Home page
//             </Link>

//             {session ? (
//               <>
//                 <Link
//                   href="/chat"
//                   className=" text-xl dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
//                   New chat
//                 </Link>
//                 <Link
//                   href="/mychats"
//                   className=" text-xl dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
//                   My chats
//                 </Link>

//                 <Link
//                   href="/settings"
//                   className=" text-xl  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
//                   Settings
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/pricing"
//                   className=" text-xl  dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
//                   Pricing
//                 </Link>

//                 <Link
//                   href="/preview"
//                   className=" text-xl dark:bg-gray-800 dark:text-white  hover:text-slate-500	text-black rounded-md px-3 py-2 text-base font-medium">
//                   Preview
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
//         {session ? (
//           <>
//             {/* <p className=" dark:text-gray-300 font-semibold mr-24 text-gray-700 ">
//               Welcome, {session.user.email}
//             </p> */}
//             <button
//               className=" text-xl bg-slate-900 font-semibold rounded px-4 py-2 text-white"
//               onClick={async (e) => {
//                 e.preventDefault();
//                 setLoading(true);
//                 const { error } = await supabase.auth.signOut();
//                 setLoading(false);
//                 router.refresh();
//                 if (!error) setSession(null);
//               }}
//               disabled={loading}>
//               {loading ? "Loading" : "Logout"}
//             </button>{" "}
//           </>
//         ) : (
//           <>
//             <Link
//               href="/signin"
//               className=" text-xl text-gray-800 hover:dark:bg-gray-700 dark:text-white  hover:text-black dark:bg-gray-800 font-semibold rounded mr-3 px-4 py-2 ">
//               Sign up
//             </Link>
//             <Link
//               href="/login"
//               className=" text-xl bg-black text-white hover:bg-slate-800 hover:dark:bg-gray-700 dark:text-white  hover:text-white hover:font-bold dark:bg-gray-800 font-semibold  mr-3 px-4 py-2 ">
//               Get started
//             </Link>
//           </>
//         )}
//         {/* <Image
//           className="text-white ml-3"
//           src={Settings}
//           width={25}
//           height={25}
//           alt="settings"></Image> */}
//         {/* <button
//           type="button"
//           className=" ml-4 relative rounded-full bg-slate-300 dark:bg-gray-800 p-1 text-black dark:text-white hover:dark:text-slate-500 hover:bg-slate-400  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//           <span className="absolute -inset-1.5"></span>
//           <span className="sr-only">View notifications</span>
//           <svg
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             aria-hidden="true">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
//             />
//           </svg>
//         </button> */}
//       </div>
//     </div>
//   </div>

//   {toggleDropDown && (
//     <div className="sm:hidden" id="mobile-menu">
//       <div className="space-y-1 px-2 pb-3 pt-2">
//         <Link
//           href="/"
//           className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium"
//           aria-current="page">
//           Home page
//         </Link>
//         {session ? (
//           <Link
//             href="chat"
//             className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium">
//             Chat
//           </Link>
//         ) : (
//           <Link
//             href="/pricing"
//             className="block dark:bg-gray-800 dark:text-white hover:text-slate-500 text-black rounded-md px-3 py-2 text-base font-medium">
//             Pricing
//           </Link>
//         )}
//       </div>
//     </div>
//   )}
// </nav>
