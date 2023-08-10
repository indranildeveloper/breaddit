"use client";

import { FC, ReactElement } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Icons } from "./Icons";
import { buttonVariants } from "../ui/Button";
import UserAccountNav from "../auth/UserAccountNav";

const Navbar: FC = (): ReactElement => {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Breadit
          </p>
        </Link>

        {/* search bar */}
        {session?.user ? (
          <UserAccountNav user={session?.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;