"use client";

import { FC, HTMLAttributes, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { Icons } from "../shared/Icons";
import { useToast } from "@/hooks/useToast";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "There was an error while log in with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size="default"
        className="w-full"
        variant="outline"
      >
        {isLoading ? null : <Icons.google className="h-5 w-5 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
