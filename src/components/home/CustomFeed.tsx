import { FC } from "react";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/constants/config";
import PostFeed from "../post/PostFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed: FC = async () => {
  const session = await getAuthSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULT,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
