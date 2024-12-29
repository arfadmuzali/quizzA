"use client";

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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import authApi from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, Brain, Plus, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  creator_id: string;
  created_at: Date;
  updated_at: Date;
  question: Question[];
}

export interface Question {
  count: number;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data, isPending, refetch } = useQuery<Quiz[]>({
    queryKey: ["quizDashboard"],
    queryFn: async () => {
      const response = await authApi.get("/api/quiz/admin");
      return response.data;
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const DeleteQuiz = useMutation({
    mutationFn: async (id: number | string) => {
      const response = await authApi.delete("/api/quiz/" + id);
      return response.data;
    },

    onSuccess: async () => {
      toast.success("Quiz Deleted");
      await refetch();
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Delete Quiz failed");
    },
  });
  if (isPending) {
    return (
      <div className="lg:px-28 md:px-14 p-4 min-h-[80vh] max-w-screen-2xl mx-auto">
        <div className="flex flex-row flex-wrap gap-10 w-full md:justify-between justify-center">
          {new Array(4).fill(null).map((_, index) => {
            return (
              <Skeleton key={index} className="w-full md:max-w-[47%]  h-44" />
            );
          })}
        </div>
      </div>
    );
  }

  if (data?.length == 0) {
    return (
      <div className="lg:px-28 md:px-14 p-4 min-h-[70vh] max-w-screen-2xl mx-auto flex justify-center items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-orange-100 p-3">
            <Trophy className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="mb-2 text-3xl font-semibold">{t("noneQuizTitle")}</h2>
          <p className="mb-6 max-w-md text-blue-950">
            {t("noneQuizDescription")}
          </p>
          <Link href={"/dashboard/create"} className={cn(buttonVariants())}>
            <Plus className="mr-2 h-5 w-5" />
            {t("noneQuizCta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-28 md:px-14 p-4 min-h-[60vh] max-w-screen-2xl mx-auto">
      <div className="flex justify-between md:gap-10 mb-12">
        <Card className="border-2 border-orange-200 bg-white/50 backdrop-blur w-full md:max-w-[48%]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium ">
              {t("totalQuizzes")}
            </CardTitle>
            <Brain className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-950">
              {data?.length}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={"/dashboard/create"} className={cn(buttonVariants())}>
              <Plus className="mr-2 h-5 w-5" />
              {t("createQuiz")}
            </Link>
          </CardFooter>
        </Card>
        {/* <div className="flex flex-col items-center text-center border-2 p-4 border-orange-200 bg-white/50 rounded-lg  w-full max-w-[48%]">
          <div className="mb-4 rounded-full bg-orange-100 p-3">
            <Trophy className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold ">
            {t("createQuizDescription")}
          </h2>
          <Link href={"/dashboard/create"} className={cn(buttonVariants())}>
            <Plus className="mr-2 h-5 w-5" />
            {t("createQuiz")}
          </Link>
        </div> */}
      </div>
      <h1 className="text-2xl font-semibold mb-4">{t("quizzes")}</h1>
      <div className="flex flex-row flex-wrap gap-10 w-full md:justify-between justify-center">
        {data?.map((val, index) => {
          return (
            <Card
              key={val.id}
              className="w-full md:max-w-[48%] transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xl leading-none tracking-tight">
                      {val.title}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {val.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span>
                      {val.question[0]?.count} {t("questions")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Link
                  href={"/dashboard/edit/" + val.id}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-full"
                  )}
                  // onClick={onStart}
                >
                  {t("edit")}
                </Link>
                <AlertDialog
                  open={isOpen}
                  onOpenChange={(e) => {
                    setIsOpen(e);
                  }}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => {}}
                      type="button"
                      variant="default"
                      className={cn("w-full")}
                      size="sm"
                    >
                      {t("delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="">
                        {t("deleteQuiz")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("deleteQuizDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-orange-200">
                        {t("cancel")}
                      </AlertDialogCancel>
                      <Button
                        disabled={DeleteQuiz.isPending}
                        onClick={async () => {
                          DeleteQuiz.mutateAsync(val.id);
                        }}
                      >
                        {DeleteQuiz.isPending ? (
                          <LoadingSpinner />
                        ) : (
                          t("delete")
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
