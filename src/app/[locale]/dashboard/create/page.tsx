"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import authApi from "@/lib/axios";
import { QuizDTO, QuizSchema } from "@/lib/dto/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Circle, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

async function createQuiz(data: QuizDTO) {
  const response = await authApi.post("/api/quiz", data);
  if (response.data?.error) {
    throw new Error(response.data?.error?.message || "Failed to submit quiz");
  }

  return response;
}

export default function CreateQuizPage() {
  const t = useTranslations("createQuiz");
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<QuizDTO>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          text: "",
          options: [{ text: "", isCorrect: false }],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const mutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      toast.success("Success create new quiz");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to create new quiz");

      console.error("Error submitting quiz:", error);
    },
  });

  const onSubmit = async (data: QuizDTO) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className="lg:px-28 md:px-14 p-4 min-h-[60vh] max-w-screen-2xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-8"
      >
        <Card className="border-2 border-orange-200">
          <CardContent className="pt-6">
            {/* Quiz Title */}
            <div className="mb-6">
              <Label htmlFor="title" className=" font-semibold">
                {t("quizTitle")}
              </Label>
              <Input
                id="title"
                {...register("title")}
                className="mt-2 border-2 border-orange-200 focus-visible:ring-blue-400"
                placeholder={t("quizTitlePlaceholder")}
              />
              {errors.title && (
                <p className="mt-2 text-orange-600 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Quiz Description */}
            <div>
              <Label htmlFor="description" className=" font-semibold">
                {t("quizDescription")}
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className="mt-2 min-h-[100px] border-2 border-orange-200 focus-visible:ring-blue-400"
                placeholder={t("quizDescriptionPlaceholder")}
              />
              {errors.description && (
                <p className="mt-2 text-orange-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold "> {t("question")}</h2>
            <Button
              type="button"
              onClick={() =>
                appendQuestion({
                  text: "",
                  options: [{ text: "", isCorrect: false }],
                })
              }
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("addQuestion")}
            </Button>
          </div>

          {questionFields.map((question, questionIndex) => (
            <Card
              key={question.id}
              className="border-2 border-blue-100 hover:border-orange-200 transition-all"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor={`questions.${questionIndex}.text`}
                      className=" font-semibold"
                    >
                      {t("question")}
                      {questionIndex + 1}
                    </Label>
                    <Input
                      id={`questions.${questionIndex}.text`}
                      {...register(`questions.${questionIndex}.text`)}
                      className="mt-2 border-2 border-orange-200 focus-visible:ring-blue-400"
                      placeholder={t("questionPlaceholder")}
                    />
                    {errors.questions?.[questionIndex]?.text && (
                      <p className="mt-2 text-orange-600 text-sm">
                        {errors.questions[questionIndex].text?.message}
                      </p>
                    )}
                  </div>

                  {/* Delete Question Button */}
                  {questionFields.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-blue-600 hover:text-orange-600 hover:bg-orange-50"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">
                            {t("deleteQuestion")} {questionIndex + 1}
                          </span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="">
                            {t("deleteQuestion")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteQuestionDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-orange-200">
                            {t("cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeQuestion(questionIndex)}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {t("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <div>
                  {errors.questions?.[questionIndex]?.options?.root && (
                    <p className="mt-2 text-orange-600 text-sm">
                      {errors.questions[questionIndex].options?.root?.message}
                    </p>
                  )}
                </div>

                {/* Options */}
                <Controller
                  control={control}
                  name={`questions.${questionIndex}.options`}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className=" font-semibold">
                          {" "}
                          {t("options")}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            field.onChange([
                              ...field.value,
                              { text: "", isCorrect: false },
                            ])
                          }
                          className="border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {t("addOption")}
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {field.value.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3"
                          >
                            <div className="flex-1">
                              <Input
                                placeholder={`${t("option")} ${
                                  optionIndex + 1
                                }`}
                                {...register(
                                  `questions.${questionIndex}.options.${optionIndex}.text`
                                )}
                                className="border-2 border-orange-200 focus-visible:ring-blue-400"
                              />
                            </div>
                            <Label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register(
                                  `questions.${questionIndex}.options.${optionIndex}.isCorrect`
                                )}
                                className="hidden"
                                checked={option.isCorrect}
                                onChange={() => {
                                  const updatedOptions = [...field.value];
                                  updatedOptions.forEach((opt, idx) => {
                                    if (idx !== optionIndex) {
                                      opt.isCorrect = false; // Uncheck other options
                                    }
                                  });
                                  updatedOptions[optionIndex].isCorrect =
                                    !option.isCorrect; // Toggle current option
                                  field.onChange(updatedOptions); // Update the field value
                                }}
                              />
                              {option.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-orange-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-blue-300" />
                              )}
                              <span className="sr-only">Correct answer</span>
                            </Label>

                            {/* Delete Option Button */}
                            {field.value.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-blue-600 hover:text-orange-600 hover:bg-orange-50 h-8 w-8 p-0"
                                onClick={() => {
                                  const newOptions = [...field.value];
                                  newOptions.splice(optionIndex, 1);
                                  field.onChange(newOptions);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  Delete option {optionIndex + 1}
                                </span>
                              </Button>
                            )}

                            {errors.questions?.[questionIndex]?.options?.[
                              optionIndex
                            ]?.text && (
                              <p className="text-orange-600 text-sm">
                                {
                                  errors.questions[questionIndex].options[
                                    optionIndex
                                  ].text?.message
                                }
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
          >
            {mutation.isPending ? <LoadingSpinner /> : t("createQuiz")}
          </Button>
        </div>
      </form>
    </div>
  );
}
