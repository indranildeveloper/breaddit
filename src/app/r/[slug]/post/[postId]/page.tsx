import { FC, Suspense } from "react";
import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { db } from "@/lib/db";
import PostVoteShell from "@/components/post/postVote/PostVoteShell";
import PostVoteServer from "@/components/post/postVote/PostVoteServer";

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
      </div>
    </div>
  );
};

export default SinglePostPage;
