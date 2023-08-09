"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
// import { X } from "lucide-react";
import { Button } from "../ui/Button";

const CloseModal: FC = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="h-6 w-6 p-0 rounded-md"
      aria-label="close-modal"
      onClick={() => router.back()}
    >
      {/* <X className="h-4 w-4" /> */}X
    </Button>
  );
};

export default CloseModal;
