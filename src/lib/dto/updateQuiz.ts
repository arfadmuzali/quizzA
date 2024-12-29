import { z } from "zod";

// DTO for Option
export const UpdateOptionSchema = z.object({
  //   id: z.number(),
  text: z
    .string()
    .min(1, { message: "Option text must be at least 1 characters long" }),
  isCorrect: z.boolean().default(false),
});
export type UpdateOptionDTO = z.infer<typeof UpdateOptionSchema>;

// DTO for Question
export const UpdateQuestionSchema = z.object({
  //   id: z.number(),
  text: z.string(),
  options: z
    .array(UpdateOptionSchema)
    .min(1, { message: "A question must have at least one option" })
    .refine(
      (options) => options.filter((option) => option.isCorrect).length === 1,
      {
        message: "There must be exactly one correct answer",
      }
    ),
});
export type UpdateQuestionDTO = z.infer<typeof UpdateQuestionSchema>;

// DTO for Quiz
export const UpdateQuizSchema = z.object({
  //   id: z.number(),
  title: z
    .string()
    .min(3, { message: "Quiz title must be at least 3 characters long" }),
  description: z
    .string()
    // .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),
  questions: z
    .array(UpdateQuestionSchema)
    .min(1, { message: "Quiz must have at least one question" }),
});
export type UpdateQuizDTO = z.infer<typeof UpdateQuizSchema>;
