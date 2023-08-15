import { FC } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/constants/config";
import MiniCreatePost from "@/components/post/MiniCreatePost";
import PostFeed from "@/components/post/PostFeed";

interface SubredditPageProps {
  params: {
    slug: string;
  };
}

const SubredditPage: FC<SubredditPageProps> = async ({ params }) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost />

      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default SubredditPage;
