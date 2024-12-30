import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

const AnswerSchema = z.object({
  questionId: z.number(),
  answer: z.number(),
});

const SubmitDTOSchema = z.object({
  quizId: z.number(),
  answers: z.array(AnswerSchema),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      success,
      data: submitDto,
      error: DtoError,
    } = SubmitDTOSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { error: { message: "Bad request", details: DtoError } },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: quizData, error: quizError } = await supabase
      .from("quiz")
      .select("*, question(*, option(*))")
      .eq("id", submitDto.quizId)
      .returns<Quiz[]>()
      .single();

    if (quizError || !quizData) {
      return NextResponse.json(
        { error: { message: "Quiz not found" } },
        { status: 404 }
      );
    }

    let correctAnswers = 0;

    submitDto.answers.forEach((userAnswer) => {
      const question = quizData.question.find(
        (q) => q.id === userAnswer.questionId
      );
      if (question) {
        const correctOption = question.option.find((opt) => opt.is_correct);
        if (correctOption && correctOption.id === userAnswer.answer) {
          correctAnswers += 1;
        }
      }
    });

    const totalQuestions = quizData.question.length;
    const scorePercentage = (correctAnswers / totalQuestions) * 100;

    let grade = "F";
    if (scorePercentage >= 90) grade = "A";
    else if (scorePercentage >= 80) grade = "B";
    else if (scorePercentage >= 70) grade = "C";
    else if (scorePercentage >= 60) grade = "D";

    return NextResponse.json({
      correctAnswers,
      totalQuestions,
      score: scorePercentage.toFixed(1),
      grade,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}
