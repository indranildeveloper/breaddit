import Link from "next/link";
import { toast } from "./useToast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
          onClick={() => dismiss()}
        >
          Log In
        </Link>
      ),
    });
  };

  return { loginToast };
};
