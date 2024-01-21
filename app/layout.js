import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { cookies } from "next/headers";
import { Inter as FontSans } from "next/font/google";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const inter = Inter({ subsets: ["latin"] });

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({ children }) {
  const cookieStore = cookies();

  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session layout", session);

  return (
    <html class="dark" lang="en">
      <body className=" bg-slate-400	 dark:bg-gray-800 	">
        <Nav session={session}></Nav>
        {children}
      </body>
    </html>
  );
}
