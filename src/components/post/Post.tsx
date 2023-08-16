import { FC, useRef } from "react";
import Link from "next/link";
import { FiMessageSquare } from "react-icons/fi";
import { Post, User, Vote } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./postVote/PostVoteClient";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmount: number;
  votesAmount: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className="px-1"> - </span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>
            <span className="px-1">
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />

            {postRef.current && postRef.current?.clientHeight >= 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 z-20 text-sm p-4 sm:px-6">
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <FiMessageSquare size={20} /> {commentAmount} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
