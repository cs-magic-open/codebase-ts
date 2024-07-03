import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

import { type AppRouter as _AppRouter } from "@cs-magic/swot/src/app/api/trpc"

export const transformer = superjson

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc"
}

export type AppRouter = _AppRouter
/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>