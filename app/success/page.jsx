import Image from "next/image";
import Link from "next/link";
import Welcome from "@/public/Welcome.svg";
import { Button } from "@/components/ui/button";

const Success = () => {
  return (
    // <div className=" flex flex-nowrap justify-center bg-white">

    //   <div></div>
    //   <div>1</div>
    // </div>

    <div className="flex justify-center mt-12">
      <div className="grid grid-rows-3 grid-flow-col gap-10">
        <Image
          className="mx-auto"
          src={Welcome}
          alt="Welcome"
          width={400}
          height={400}></Image>
        <div>
          <Link className="dark:text-white border rounded" href="/signin ">
            {" "}
            You can now access to your AskPDF plan, get started now, by creating
            your account!
          </Link>

          <div className=" mt-6 flex justify-center">
            {/* css Taking from btn comp change so i can just use the btn */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-blue-700 text-white	hover:bg-blue-900 h-11 rounded-none p-7">
              Log in with your email now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
