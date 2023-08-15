import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CommentValidator } from "@/lib/comment";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession();
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new NextResponse("OK", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data passed." },
        { status: 422 },
      );
    } else {
      return NextResponse.json(
        {
          message: "Could create comment at this time, please try again later.",
        },
        { status: 500 },
      );
    }
  }
}
