import { FC } from "react";
import Image from "next/image";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "../ui/Avatar";
// import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            src={user.image}
            fill
            alt={user.name || "Profile Photo"}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          {/* <Icons.user className="h-4 w-4" /> */}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
