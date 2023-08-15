"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/comment";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");

  const { loginToast } = useCustomToast();

  const { mutate: createComment, isLoading } = useMutation({
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
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      router.refresh();
      setComment("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={comment.length === 0}
            onClick={() => createComment({ postId, text: comment, replyToId })}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
