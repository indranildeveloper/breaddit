"use client";

import { FC, useRef } from "react";
import axios from "axios";
import { useIntersection } from "@mantine/hooks";
import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/constants/config";
import { useSession } from "next-auth/react";
import Post from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const { data: session } = useSession();
  const lastPostRef = useRef<HTMLElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULT}&page=${pageParam}` +
        (!!subredditName ? `&subredditname=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    },
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const voteAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;

          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmount={post.comments.length}
                currentVote={currentVote}
                votesAmount={voteAmount}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              subredditName={post.subreddit.name}
              post={post}
              commentAmount={post.comments.length}
              currentVote={currentVote}
              votesAmount={voteAmount}
            />
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
