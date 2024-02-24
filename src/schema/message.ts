import { z } from "zod"

export const createMessageSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
})
