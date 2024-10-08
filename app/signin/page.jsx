"use client";
import Forms from "@/components/Form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const signUpp = async (values) => {
    setIsSubmitting(true);

    let { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      password: values.password,
      // options: {
      //   emailRedirectTo: "http://localhost:3000/auth/callback",

      // },
    });
    if (error) {
      setIsSubmitting(false);
      console.error("error", error);
    } else {
      setIsSubmitting(false);

      router.refresh();
    }
  };
  return (
    <>
      <title>Sign up | AskPDFs</title>

      <div class="flex justify-center md:grid md:grid-cols-2 md:gap-1 h-dvh">
        <div className="">
          <div className="flex justify-center">
            <div className="flex justify-center">
              <Forms
                isSubmitting={isSubmitting}
                onSubmit={signUpp}
                title="Sign up"
                link="login"
                redirect="Already have an account? Log in"></Forms>
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:justify-center md:items-center md:p-12 md:bg-indigo-800	">
          <div className="flex justify-center text-white">
            {isSubmitting
              ? "check your email :) (and spam folder!) "
              : "hello there :)"}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
