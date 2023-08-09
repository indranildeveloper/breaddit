import { FC } from "react";
import Link from "next/link";
// import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import SignIn from "@/components/auth/SignIn";

const SignInPage: FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20",
          )}
        >
          {/* <ChevronLeft className="mr-2 h-4 w-4" /> */}
          Go Home
        </Link>

        <SignIn />
      </div>
    </div>
  );
};

export default SignInPage;
