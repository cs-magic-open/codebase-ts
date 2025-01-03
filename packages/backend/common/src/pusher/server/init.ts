import Pusher from "pusher"

import { env } from "@/env"
import type { IPusherServerConfig } from "@/pusher/schema"

export const initPusherServer = (config: IPusherServerConfig) => {
  const { port, useTLS, cluster, host } = config

  if (!env?.PUSHER_APP_ID || !env?.NEXT_PUBLIC_PUSHER_APP_KEY || !env?.PUSHER_APP_SECRET)
    throw new Error("invalid pusher config")

  return new Pusher({
    host,
    port: port === undefined ? undefined : port.toString(),
    useTLS,
    cluster,

    appId: env?.PUSHER_APP_ID,
    key: env?.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: env?.PUSHER_APP_SECRET,
  })
}
