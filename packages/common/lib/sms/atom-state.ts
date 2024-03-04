import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { SmsProviderType, SmsStage } from "./schema"
import { Nullable } from "../../schema/base"
// import { atomWithImmer } from "jotai-immer"

/**
 * general
 */
export const smsProviderAtom = atomWithStorage<SmsProviderType>(
  "sms.provider.type",
  "ali",
)
export const smsStageAtom = atom<SmsStage>("toSendSms")

/**
 * send code
 */
export const smsNameAtom = atom("")
export const smsPhoneAtom = atom("")
export const smsCodeAtom = atom("")
export const smsSentOKAtom = atom<Nullable>(null)
export const smsDowntimeAtom = atom(0)

/**
 * sign in
 */

export const smsSignOKAtom = atom<Nullable>(null)
