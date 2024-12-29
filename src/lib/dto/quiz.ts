import { z } from "zod";

// DTO for Option
export const OptionSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Option text must be at least 1 characters long" }),
  isCorrect: z.boolean().default(false),
});
export type OptionDTO = z.infer<typeof OptionSchema>;

// DTO for Question
export const QuestionSchema = z.object({
  text: z.string(),
  options: z
    .array(OptionSchema)
    .min(1, { message: "A question must have at least one option" })
    .refine(
      (options) => options.filter((option) => option.isCorrect).length === 1,
      {
        message: "There must be exactly one correct answer",
      }
    ),
});
export type QuestionDTO = z.infer<typeof QuestionSchema>;

// DTO for Quiz
export const QuizSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Quiz title must be at least 3 characters long" }),
  description: z
    .string()
    // .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  questions: z
    .array(QuestionSchema)
    .min(1, { message: "Quiz must have at least one question" }),
});
export type QuizDTO = z.infer<typeof QuizSchema>;
