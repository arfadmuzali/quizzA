"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface Quizzes {
  id: number;
  title: string;
  description: string;
  creator_id: string;
  created_at: Date;
  updated_at: Date;
  question: Question[];
}

interface Question {
  count: number;
}

export default function Quizzes() {
  const t = useTranslations("dashboard");

  const { data, isPending } = useQuery({
    queryKey: ["homeQuizzes"],
    queryFn: async () => {
      const response = await axios.get<Quizzes[]>("/api/quiz");
      return response.data;
    },
  });
  return (
    <div
      id="quizzes"
      className="lg:px-28 md:px-14 p-4 max-w-screen-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4">{t("quizzes")}</h2>
      <div className="flex flex-row flex-wrap lg:gap-8 md:gap-6 gap-4 w-full md:justify-between justify-center">
        {isPending &&
          new Array(6).fill(null).map((_, index) => {
            return (
              <Skeleton
                key={index}
                className="w-full lg:max-w-[31%] md:max-w-[48%] h-52 transition-all hover:shadow-lg"
              />
            );
          })}
        {data?.map((quiz, index) => {
          return (
            <Card
              key={index}
              className="w-full lg:max-w-[31%] md:max-w-[48%] transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xl leading-none tracking-tight">
                      {quiz.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span>
                      {quiz.question[0]?.count} {t("questions")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                {/* <Link
                  href={"/dashboard/edit/" + val.id}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full"
                  )}
                  // onClick={onStart}
                >
                  {t("edit")}
                </Link> */}

                <Link
                  href={"/quiz/" + quiz.id}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full"
                  )}
                >
                  {t("startQuiz")}
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
