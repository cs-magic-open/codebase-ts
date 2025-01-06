import { isServer } from "./is-server"

export const isClient = !isServer
