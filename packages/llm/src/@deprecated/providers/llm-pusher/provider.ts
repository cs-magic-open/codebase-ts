import Pusher from "pusher"
import { redis } from "@cs-magic/common"
import { pusherServerConfigs } from "@cs-magic/common/pusher/config"
import { PusherServerId } from "@cs-magic/common/pusher/schema"
import { initPusherServer } from "@cs-magic/common/pusher/server/init"
import {
  ITransEvent,
  ResponseFinalStatus,
  ResponseStatus,
} from "@cs-magic/common/sse/schema"

import { ILLMManagerPusher } from "./schema"

/**
 *
 * note:
 * - 因为server-action的机制， 所有state需要用redis等中心化管理
 */
export class PusherLLMManager implements ILLMManagerPusher {
  private pusher: Pusher
  private channel: string

  constructor(channelId: string, pusherServerId: PusherServerId) {
    this.channel = channelId
    this.pusher = initPusherServer(pusherServerConfigs[pusherServerId])
  }

  //////////////////////////////
  // state
  //////////////////////////////
  public get status() {
    return redis.get(this.channel)
  }

  public setStatus(status: ResponseStatus) {
    return redis.set(this.channel, status)
  }

  //////////////////////////////
  // server
  //////////////////////////////
  async onTriggerStarts() {
    await this.setStatus("responding")
    await this.push({ event: "init", data: {} })
  }

  async onTriggerEnds(reason: ResponseFinalStatus) {
    await this.setStatus(reason)
    await this.push({ event: "close", data: { reason } })
  }

  async onEvent(event: ITransEvent) {
    await this.push(event)
  }

  //////////////////////////////
  // client
  //////////////////////////////

  async onClientConnected(clientId: string) {
    await this.push({ event: "onClientConnected", data: { id: clientId } })
  }

  async onClientDisconnected(clientId: string) {
    await this.push({
      event: "onClientDisconnected",
      data: { id: clientId },
    })
  }

  //////////////////////////////
  // general
  //////////////////////////////

  private async push(event: ITransEvent) {
    // event.data = { time: Date.now(), ...event.data }
    console.log(`[PUSHER] >> ${this.channel}: `, event)
    await this.pusher.trigger(this.channel, event.event, event.data)
  }
}