"use client";

import { FC, useRef, useState } from "react";
import { Comment, CommentVote, User } from "@prisma/client";
import UserAvatar from "../shared/UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "../ui/Button";
import { LuMessageSquare } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/comment";
import axios from "axios";
import { toast } from "@/hooks/useToast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  postId: string;
  comment: ExtendedComment;
  votesAmount: number;
  currentVote: CommentVote | undefined;
}

const PostComment: FC<PostCommentProps> = ({
  postId,
  comment,
  votesAmount,
  currentVote,
}) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [commentReply, setCommentReply] = useState<string>("");
  const { data: session } = useSession();

  const { mutate: createCommentReply, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload,
      );

      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description:
          "Your comment was not posted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setCommentReply("");
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center my-4 flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote}
        />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-label="Reply"
          className="flex gap-2 items-center justify-center"
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
        >
          <LuMessageSquare size={16} />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your Comment</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={commentReply}
                onChange={(e) => setCommentReply(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={commentReply.length === 0}
                  onClick={() => {
                    if (!commentReply) return;
                    createCommentReply({
                      postId,
                      text: commentReply,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
