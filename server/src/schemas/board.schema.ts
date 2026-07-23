import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  title: z.string().optional(),
  elements: z.array(z.any()).optional(),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    })
    .optional(),
});

export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
