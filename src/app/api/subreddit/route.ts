import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { name } = SubredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return NextResponse.json(
        { message: "Subreddit already exists" },
        { status: 409 },
      );
    }

    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return NextResponse.json(subreddit.name, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 422 });
    } else {
      return NextResponse.json(
        { message: "Could not create subreddit" },
        { status: 500 },
      );
    }
  }
}
