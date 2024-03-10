import { Prisma } from "@prisma/client"
import { appDetailSchema } from "./app.detail"
import { IBaseResponse } from "./query"

export const convSummarySchema = Prisma.validator<Prisma.ConvDefaultArgs>()({
  select: {
    id: true,
    updatedAt: true,
    titleResponse: {
      select: {
        content: true,
      },
    },
    currentRequestId: true,
  },
})
export type IConvBase = Prisma.ConvGetPayload<typeof convSummarySchema>

export const responseSchema = Prisma.validator<Prisma.ResponseDefaultArgs>()({
  include: {
    app: appDetailSchema,
  },
})
export type IResponse = Prisma.ResponseGetPayload<typeof responseSchema>

export const requestSchema = Prisma.validator<Prisma.RequestDefaultArgs>()({
  include: {
    responses: {
      ...responseSchema,
      // 这个要加，否则回答问题的时候会乱序
      // orderBy: {
      //   config: {
      //     createdAt: "asc",
      //   },
      // },
    },
  },
})
export type IRequest = Prisma.RequestGetPayload<typeof requestSchema>

export const convDetailSchema = Prisma.validator<Prisma.ConvDefaultArgs>()({
  include: {
    titleResponse: true,
    apps: {
      ...appDetailSchema,
      // 不要加这个，否则本地初始化后会乱序
      // orderBy: {
      //   createdAt: "asc",
      // },
    },
    requests: {
      ...requestSchema,
      orderBy: {
        updatedAt: "asc", // 增序
      },
    },
  },
})
export type IConvDetail = Prisma.ConvGetPayload<typeof convDetailSchema>

export type IUpdateResponse = (s: IBaseResponse) => void
