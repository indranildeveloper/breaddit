"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

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
      <MdClose size={20} />
    </Button>
  );
};

export default CloseModal;
