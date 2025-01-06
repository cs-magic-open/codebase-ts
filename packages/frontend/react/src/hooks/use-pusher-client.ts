import { initPusherClient } from "@cs-magic/common/pusher/client/init"
import { pusherServerConfigs } from "@cs-magic/common/pusher/config"
import { useAtom } from "jotai"
import { sum } from "lodash-es"
import type PusherJS from "pusher-js"
import { useEffect, useRef } from "react"

import {
  pusherClientAtom,
  pusherLastPingTimeAtom,
  pusherLastPongTimeAtom,
  pusherLatenciesAtom,
  pusherLatencyAtom,
  pusherServerIdAtom,
} from "../store"

export const usePusherClient = () => {
  const [serverId] = useAtom(pusherServerIdAtom)
  const [, setPusherClient] = useAtom(pusherClientAtom)
  const [pusherLastPingTime, setPusherLastPingTime] = useAtom(pusherLastPingTimeAtom)
  const [pusherLastPongTime, setPusherLastPongTime] = useAtom(pusherLastPongTimeAtom)
  const [latencies] = useAtom(pusherLatenciesAtom)
  const [, setPusherLatency] = useAtom(pusherLatencyAtom)

  const refPusherClient = useRef<PusherJS>()

  useEffect(() => {
    refPusherClient.current = initPusherClient(pusherServerConfigs[serverId], {
      onInit: pusherClient => {
        setPusherClient(pusherClient)
      },
      onPing: () => {
        setPusherLastPingTime(Date.now())
      },
      onPong: () => {
        setPusherLastPongTime(Date.now())

        const newLatency = pusherLastPongTime! - pusherLastPingTime!
        latencies.push(newLatency)

        const latency = sum(latencies) / latencies.length
        setPusherLatency(latency)
      },
    })
  }, [])

  return refPusherClient.current
}
