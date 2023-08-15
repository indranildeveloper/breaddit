"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "../shared/UserAvatar";
import { useSession } from "next-auth/react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AiOutlineLink } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";

const MiniCreatePost: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <section className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full p-4 flex justify-between gap-1">
        <div className="relative mr-2">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input
          readOnly
          onClick={() => router.push(`${pathname}/submit`)}
          placeholder="Create Post"
        />

        <Button
          variant="ghost"
          onClick={() => router.push(`${pathname}/submit`)}
        >
          <BiImageAdd className="text-zinc-600" size={20} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push(`${pathname}/submit`)}
        >
          <AiOutlineLink className="text-zinc-600" size={20} />
        </Button>
      </div>
    </section>
  );
};

export default MiniCreatePost;
