import { validateAuth } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await validateAuth(request);

    if (error) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data: quizData, error: quizError } = await supabase
      .from("quiz")
      .select("*, question (count)")
      .eq("creator_id", user?.user.id);

    if (quizError) {
      return NextResponse.json(
        { error: { message: "error when get quiz" } },
        { status: 400 }
      );
    }

    return NextResponse.json(quizData);
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
