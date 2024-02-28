import { PusherConnectionState } from "@/lib/puser/schema"
import { create } from "zustand"
import { initPusherClient } from "@/lib/puser/client/init"
import { pusherConfig } from "@/lib/puser/config"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import PusherJS from "pusher-js"
import { toast } from "sonner"
import sum from "lodash/sum"
import { FixedArray } from "@/schema/array"

export interface ISocket {
  client: PusherJS | null
  state: PusherConnectionState
  lastPingTime: number | null
  lastPongTime: number | null
  latency: number
  latencies: FixedArray<number>

  init: () => void
  clean: () => void
}

export const useSocketStore = create<ISocket>()(
  devtools(
    immer((setState, getState, store) => ({
      client: null,
      state: "initialized",

      lastPingTime: null,
      lastPongTime: null,
      latencies: new FixedArray(10), // 每半分钟一次ping-pong
      latency: 0,

      init: () => {
        initPusherClient(pusherConfig, {
          onPing: () => {
            setState((state) => {
              state.lastPingTime = Date.now()
            })
          },
          onPong: () => {
            setState((state) => {
              state.lastPongTime = Date.now()
              const newLatency = state.lastPongTime - state.lastPingTime!
              state.latencies.push(newLatency)

              const latency = sum(state.latencies) / state.latencies.length
              state.latency = latency

              console.log("pong: ", {
                lastPingTime: state.lastPingTime,
                lastPongTime: state.lastPongTime,
                latency: state.latency,
                latencies: state.latencies,
              })
              toast.info("pong!")
            })
          },
          onInit: (pusherClient) => {
            setState((state) => {
              state.client = pusherClient
            })
          },
        })
      },
      clean: () =>
        setState((state) => {
          state.client?.disconnect()
          state.client = null
        }),
    })),
  ),
)
