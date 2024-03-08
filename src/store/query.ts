import { atom } from "jotai"

/**
 * 用户当前的输入，用于后续跳转
 */
export const userPromptAtom = atom("")

export type TransportType = "pusher" | "sse"
export const transportTypeAtom = atom<TransportType>("pusher")
