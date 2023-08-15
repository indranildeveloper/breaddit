import { FC, Suspense } from "react";
import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";
import { LuLoader2 } from "react-icons/lu";
import { db } from "@/lib/db";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import PostVoteShell from "@/components/post/postVote/PostVoteShell";
import PostVoteServer from "@/components/post/postVote/PostVoteServer";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/post/EditorOutput";
import CommentsSection from "@/components/comments/CommentsSection";

interface SinglePostPageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SinglePostPage: FC<SinglePostPageProps> = async ({ params }) => {
  const { postId } = params;

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm shadow">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted By u/{post?.author.username ?? cachedPost.authorUsername}
            <span className="px-1">
              {formatTimeToNow(
                new Date(post?.createdAt ?? cachedPost.createdAt),
              )}
            </span>
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <LuLoader2 size={40} className="animate-spin text-zinc-500" />
            }
          >
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
