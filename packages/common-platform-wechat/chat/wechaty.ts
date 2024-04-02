import { isWechatArticleUrl } from "@/core/card-platform/wechat-article/utils"
import { downloadCardAction } from "@/core/download-card.action"
import { FileBox } from "file-box"
import pick from "lodash/pick"
import qrcodeTerminal from "qrcode-terminal"
import { WechatyBuilder } from "wechaty"
import { types } from "wechaty-puppet"
import moment from "../../common-datetime/moment"
import { parseUrlFromWechatUrlMessage } from "./utils"

const name = process.argv[2] ?? "default"
console.log({ name })

const bot = WechatyBuilder.build({
  name, // 加了名字后就可以自动存储了

  puppetOptions: {},
})

bot
  .on("scan", (value, status) => {
    console.log(
      `Scan the following  QR Code to login: ${status}\n[or from web]: https://wechaty.js.org/qrcode/${encodeURIComponent(value)} `,
    )
    qrcodeTerminal.generate(value, { small: true })
  })
  .on("login", (user) => console.log(`User logged in: `, user))
  .on("message", async (message) => {
    const text = message.text()
    const sender = message.talker()
    const senderPayload = pick(sender.payload, ["name", "avatar"])
    const room = message.room()
    const roomName = room ? await room.topic() : ""
    const isTest = /test/.test(roomName) && !message.self()
    console.log(`<< message: `, { ...message.payload, senderPayload, isTest })

    if (isTest) {
      await message.say(`@${sender.name()} ${moment().format("hh:mm")} 👌🏻`)
    }

    if (/CS魔法社|test/.test(roomName)) {
      // link
      if (message.type() === types.Message.Url) {
        const url = parseUrlFromWechatUrlMessage(text)
        console.log("-- url in message: ", url)
        if (!url) return

        if (isWechatArticleUrl(url)) {
          // avatar 在 padLocal 下是带domain的；web下不稳定
          const image = sender.payload?.avatar
          const user = image
            ? {
                id: sender.id,
                name: sender.name(),
                image,
              }
            : undefined
          console.log(`-- triggering...`)
          const result = await downloadCardAction(url, user)
          console.log("-- result: ", result)
          const { success, data } = result
          if (!success) return
          console.log("-- sending file")
          await message.say(FileBox.fromUrl(data.cardUrl))
          console.log("-- ✅ sent file")
          return
        }
      }
    }

    // await message.say("ok ~")
  })
  .start()
