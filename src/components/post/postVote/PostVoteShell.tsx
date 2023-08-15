import { FC } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { LuArrowBigDown, LuArrowBigUp, LuLoader2 } from "react-icons/lu";

const PostVoteShell: FC = () => {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <LuArrowBigUp size={20} className="text-zinc-700" />
      </div>

      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <LuLoader2 size={20} className="animate-spin" />
      </div>

      <div className={buttonVariants({ variant: "ghost" })}>
        <LuArrowBigDown size={20} className="text-zinc-700" />
      </div>
    </div>
  );
};

export default PostVoteShell;
