import { QuizSchema } from "@/lib/dto/quiz";
import { validateAuth } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { error, user } = await validateAuth(request);

    if (error) {
      return NextResponse.json(
        { error: { message: "Unauthorization" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { error: responseError, data } = await QuizSchema.safeParseAsync(
      body
    );

    if (responseError) {
      return NextResponse.json(
        { error: { message: "Bad Request" } },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: quizData, error: quizError } = await supabase
      .from("quiz")
      .insert([
        {
          title: data.title,
          description: data.description,
          creator_id: user?.user.id,
        },
      ])
      .select();

    if (quizError) {
      return NextResponse.json(
        { error: { message: "Error when create Quiz" } },
        { status: 400 }
      );
    }

    const questionPromises = data.questions.map(async (question) => {
      const { data: questionData, error: questionError } = await supabase
        .from("question")
        .insert([
          {
            quiz_id: quizData[0].id,
            text: question.text,
          },
        ])
        .select();

      if (questionError) {
        return NextResponse.json(
          { error: { message: "Error when create question" } },
          { status: 500 }
        );
      }

      const optionPromises = question.options.map(async (option) => {
        const { error: optionError } = await supabase
          .from("option")
          .insert([
            {
              question_id: questionData?.[0].id,
              text: option.text,
              is_correct: option.isCorrect,
            },
          ])
          .select();

        if (optionError) {
          return NextResponse.json(
            { error: { message: "Error when create question" } },
            { status: 500 }
          );
        }
      });

      await Promise.all(optionPromises);
    });
    await Promise.all(questionPromises);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
