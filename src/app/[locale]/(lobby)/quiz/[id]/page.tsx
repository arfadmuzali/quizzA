"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "@/components/layouts/Loading";
import authApi from "@/lib/axios";
import { Info, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export interface Result {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  grade: string;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("play");
  const locale = useLocale();

  const [quizId, setQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: number; answer: number | null }[]
  >([]);

  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [quizResult, setQuizResult] = useState<Result | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const resolveQuizId = async () => {
      const { id } = await params;
      setQuizId(id);
    };
    resolveQuizId();
  }, [params]);

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const response = await authApi.get(`/api/quiz/${quizId}`);
      return response.data;
    },
    enabled: !!quizId,
  });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isQuizFinished) {
        event.preventDefault();
        event.returnValue =
          "Quiz is in progress. If you leave, all progress will be lost.";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (isLoading || !quiz) {
    return <Loading />;
  }

  const questions = quiz?.question || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedAnswer !== null) {
      // Periksa apakah jawaban untuk pertanyaan ini sudah ada
      setAnswers((prev) => {
        const existingAnswerIndex = prev.findIndex(
          (answer) => answer.questionId === currentQuestion.id
        );

        if (existingAnswerIndex >= 0) {
          // Update jawaban jika sudah ada
          const updatedAnswers = [...prev];
          updatedAnswers[existingAnswerIndex] = {
            questionId: currentQuestion.id,
            answer: selectedAnswer,
          };
          return updatedAnswers;
        } else {
          // Tambahkan jawaban baru
          return [
            ...prev,
            { questionId: currentQuestion.id, answer: selectedAnswer },
          ];
        }
      });

      //   Jika ini adalah soal terakhir, kirim hasil quiz
      if (currentQuestionIndex === questions.length - 1) {
        // submitQuizResult();
        setShowAlert(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);

      const previousAnswer = answers.find(
        (answer) => answer.questionId === questions[currentQuestionIndex - 1].id
      );
      setSelectedAnswer(previousAnswer?.answer || null);
    }
  };

  const submitQuizResult = async () => {
    setIsLoadingScore(true);
    setIsQuizFinished(true);

    try {
      if (selectedAnswer !== null) {
        setAnswers((prev) => {
          const existingAnswerIndex = prev.findIndex(
            (answer) => answer.questionId === currentQuestion.id
          );

          if (existingAnswerIndex >= 0) {
            // Update jawaban jika sudah ada
            const updatedAnswers = [...prev];
            updatedAnswers[existingAnswerIndex] = {
              questionId: currentQuestion.id,
              answer: selectedAnswer,
            };
            return updatedAnswers;
          } else {
            // Tambahkan jawaban baru
            return [
              ...prev,
              { questionId: currentQuestion.id, answer: selectedAnswer },
            ];
          }
        });
      }

      const response = await authApi.post("/api/submit", {
        quizId: parseInt(quizId ?? "0"),
        answers,
      });

      setQuizResult(response.data);

      setIsLoadingScore(false);
      setShowAlert(false);
    } catch (error) {
      console.error("Error submitting quiz result", error);
      toast.error("Error submitting quiz result");
      setIsLoadingScore(false);
      setShowAlert(false);
    }
  };

  if (isQuizFinished) {
    if (isLoadingScore) {
      return <Loading />;
    }

    return (
      <div className="min-h-[88vh] bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-2xl bg-white/95 backdrop-blur">
          <CardContent className="p-8 space-y-6">
            {/* Motivational message displayed to the user after completing the quiz */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
                {t("resultTitle")}
              </h1>
            </div>
            {/* Display the quiz results */}
            <div className="grid gap-4">
              {[
                { label: t("grade"), value: quizResult?.grade || "F" },
                { label: t("totalQuestion"), value: questions.length || "0" },
                {
                  label: t("correctAnswer"),
                  value: quizResult?.correctAnswers || "0",
                },
                { label: t("score"), value: `${quizResult?.score || 0}%` },
                // { label: "Answered", value: answers.length || "0" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg border border-orange-100"
                >
                  <div
                    className={cn(
                      "flex justify-between items-center",
                      locale == "ar" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Action buttons for restarting or returning home */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 px-8 flex items-center gap-2"
                size="lg"
                onClick={() => {
                  setCurrentQuestionIndex(0); // Reset the quiz state
                  setAnswers([]); // Clear answers
                  setIsQuizFinished(false); // Mark quiz as not finished
                }}
              >
                <RotateCcw className="w-5 h-5" />
                {t("playAgain")}
              </Button>
              <Link
                className={buttonVariants({
                  variant: "secondary",
                  className: "py-6 px-8 ",
                })}
                href="/"
              >
                <Home className="w-5 h-5" />
                {t("backToHome")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-200 via-orange-50 to-blue-200">
      <Card className="max-w-3xl w-full shadow-lg bg-white">
        <div className="border-b p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-full">
                <Info className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-orange-500">
                {t("question")} {currentQuestionIndex + 1} {t("of")}{" "}
                {questions.length}
              </h2>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          {/* Display the current question text */}
          <div className="mb-6 text-lg font-medium">{currentQuestion.text}</div>
          <div className="space-y-4">
            {/* Display the options for the current question */}
            {currentQuestion.option.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full text-left p-4 ${
                  selectedAnswer === option.id
                    ? "border-orange-500 bg-orange-50"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => setSelectedAnswer(option.id)}
              >
                {option.text}
              </Button>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            {currentQuestionIndex !== 0 && (
              <Button
                variant="outline-secondary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                {t("previous")}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === questions.length - 1
                ? t("finish")
                : t("next")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={showAlert}
        onOpenChange={(e) => {
          setShowAlert(e);
        }}
      >
        {/* <AlertDialogTrigger asChild>
          <Button
            onClick={() => {}}
            type="button"
            variant="default"
            className={cn("w-full")}
            size="sm"
          >
            {t("delete")}
          </Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="">{t("alertTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("alertDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-orange-200">
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              onClick={async () => {
                await submitQuizResult();
              }}
            >
              {t("submit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
