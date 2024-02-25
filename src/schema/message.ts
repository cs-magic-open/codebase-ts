import { z } from "zod"

export const createMessageSchema = z.object({
  id: z.string().nullable(),
  text: z.string(),
})
