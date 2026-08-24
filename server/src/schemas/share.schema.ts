import { z } from "zod";

export const shareBoardSchema = z.object({
  email: z.email(),

  role: z.enum(["EDITOR", "VIEWER"]),
});

export type ShareBoardInput = z.infer<typeof shareBoardSchema>;
