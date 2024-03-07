import { atomWithStorage } from "jotai/utils"

export const llmDelayAtom = atomWithStorage("llm.delay", 0) // ms

export const devEnabledAtom = atomWithStorage("dev.enabled", false)
