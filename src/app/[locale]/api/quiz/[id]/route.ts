import { QuizSchema } from "@/lib/dto/quiz";
import { UpdateQuizSchema } from "@/lib/dto/updateQuiz";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Quiz {
  id: number;
  title: string;
  description: string;
  creator_id: string;
  created_at: Date;
  updated_at: Date;
  question: Question[];
}

interface Question {
  id: number;
  text: string;
  option: Option[];
  quiz_id: number;
  created_at: Date;
}

interface Option {
  id: number;
  text: string;
  is_correct: boolean;
  question_id: number;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const { error } = await supabase
      .from("quiz")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      return NextResponse.json(
        {
          error: { message: "Failed when delete quiz" },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(id);
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz")
      .select("*, question(*, option(*))")
      .eq("id", parseInt(id))
      .returns<Quiz[]>();

    if (error) {
      return NextResponse.json(
        {
          error: { message: "error when get quiz", databaseError: error },
        },
        { status: 400 }
      );
    }
    console.log(data);
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = (await params) ?? {};
    if (!id) {
      return NextResponse.json(
        { error: { message: "ID is required" } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { data: updateDto, error } = await QuizSchema.safeParseAsync(body);

    console.log(updateDto?.questions);

    if (error) {
      return NextResponse.json(
        { error: { message: "Bad Request", details: error.errors } },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Step 1: Query Quiz to get related questions and options
    const { data: quizData, error: quizError } = await supabase
      .from("quiz")
      .select("id")
      .eq("id", id)
      .single();

    if (quizError || !quizData) {
      return NextResponse.json(
        { error: { message: "Quiz not found" } },
        { status: 404 }
      );
    }

    // Step 2: Delete all questions related to this quiz
    const { error: deleteQuestionsError } = await supabase
      .from("question")
      .delete()
      .eq("quiz_id", id);

    if (deleteQuestionsError) {
      return NextResponse.json(
        { error: { message: "Error deleting questions" } },
        { status: 500 }
      );
    }

    // Step 3: Delete all options related to this quiz

    const { data: questions, error: questionError } = await supabase
      .from("question")
      .select("id")
      .eq("quiz_id", id);

    if (questionError) {
      return NextResponse.json(
        { error: { message: "Error fetching questions" } },
        { status: 500 }
      );
    }

    // Extract question ids
    const questionIds = questions.map((q) => q.id);

    // Now, delete options related to these questions
    const { error: deleteOptionsError } = await supabase
      .from("option")
      .delete()
      .in("question_id", questionIds);

    if (deleteOptionsError) {
      return NextResponse.json(
        { error: { message: "Error deleting options" } },
        { status: 500 }
      );
    }

    // Step 4: Update the Quiz
    const { error: updateQuizError } = await supabase
      .from("quiz")
      .update({
        title: updateDto.title,
        description: updateDto.description,
      })
      .eq("id", id);

    if (updateQuizError) {
      return NextResponse.json(
        { error: { message: "Error updating quiz" } },
        { status: 500 }
      );
    }

    // Step 5: Insert new questions and options
    const insertQuestionsPromises = updateDto.questions.map(
      async (question) => {
        const { data: insertedQuestion, error: insertQuestionError } =
          await supabase
            .from("question")
            .insert({
              quiz_id: id,
              text: question.text,
            })
            .select();

        if (insertQuestionError) {
          throw new Error("Error inserting question");
        }

        const insertOptionPromises = question.options.map(async (option) => {
          const { error: insertOptionError } = await supabase
            .from("option")
            .insert({
              question_id: insertedQuestion[0]?.id,
              text: option.text,
              is_correct: option.isCorrect,
            });

          if (insertOptionError) {
            throw Error("Error inserting option");
          }
        });

        await Promise.all(insertOptionPromises);
      }
    );

    await Promise.all(insertQuestionsPromises);

    return NextResponse.json({ isSuccess: true });
  } catch (error: any) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      {
        error: {
          message: error?.message || "Internal Server Error",
          stack: error?.stack,
        },
      },
      { status: 500 }
    );
  }
}
