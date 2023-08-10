import { FC } from "react";
import { Icons } from "../shared/Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignIn: FC = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm max-w-sm mx-auto">
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy policy.
        </p>
        <UserAuthForm className="flex justify-center" />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to Breadit?{" "}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
