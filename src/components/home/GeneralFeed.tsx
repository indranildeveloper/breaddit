import { FC } from "react";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/constants/config";
import PostFeed from "../post/PostFeed";

const GeneralFeed: FC = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;
