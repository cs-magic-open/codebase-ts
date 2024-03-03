import {
  convProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../packages/common/lib/trpc/trpc"
import { db } from "../../packages/common/lib/db"
import { z } from "zod"
import { modelViewSchema } from "@/schema/model"
import { convDetailSchema, convSummarySchema } from "@/schema/conv"
import { AppInDBSchema } from "@/schema/app"
import { llmMessageSchema } from "@/schema/message"
import { triggerLLM } from "@/app/api/llm/triggerLLM"

export const queryLLMRouter = createTRPCRouter({
  listModels: publicProcedure.query(() =>
    db.model.findMany({
      ...modelViewSchema,
      orderBy: {
        // todo: by hot or so
        updatedAt: "desc",
      },
    }),
  ),

  listApps: publicProcedure.query(() =>
    db.app.findMany({
      ...AppInDBSchema,
      orderBy: {
        // todo: by hot or so
        updatedAt: "desc",
      },
    }),
  ),

  listConv: protectedProcedure.query(() =>
    db.conv.findMany({
      orderBy: { updatedAt: "desc" },
      ...convSummarySchema,
    }),
  ),

  getQueryConv: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) =>
      db.conv.findUniqueOrThrow({
        where: input,
        ...convDetailSchema,
      }),
    ),

  addQueryConv: protectedProcedure
    // 不用加 queryConfig，这是后续本地生成，再上传的，在query的时候才会触发
    .input(
      z.object({ id: z.string().optional(), title: z.string().optional() }),
    )
    .mutation(({ input, ctx }) =>
      db.conv.create({
        data: { ...input, fromUserId: ctx.user.id },
        ...convDetailSchema,
      }),
    ),

  deleteQueryConvs: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => db.conv.delete({ where: input })),

  deleteAllQueryConvs: protectedProcedure.mutation(({ ctx }) =>
    db.conv.deleteMany({ where: { fromUserId: ctx.user.id } }),
  ),

  query: convProcedure
    .input(
      z.object({
        context: llmMessageSchema.array(),
        apps: z
          .object({
            id: z.string(),
            modelName: z.string(),
            title: z.string().nullable(),
            systemPrompt: z.string().nullable(),
            temperature: z.number().nullable(),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const context = input.context
      const request = await db.request.create({
        data: {
          conv: {
            connect: {
              id: ctx.conv.id,
            },
          },
          context,
          apps: {
            connectOrCreate: input.apps.map((app) => ({
              where: {
                id: app.id,
              },
              create: {
                ...app,
                user: ctx.user.id,
              },
            })),
          },
        },
        include: {
          apps: true,
        },
      })

      return Promise.all(
        request.apps.map(async (app) => {
          const requestId = `${input.convId}-${request.id}-${app.id}`
          return await triggerLLM({ app, context, requestId })
        }),
      )
    }),
})
