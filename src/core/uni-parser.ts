import { Page as PlaywrightPage } from "playwright-core"
import { Page as PuppetPage } from "puppeteer"
import { UnexpectedError } from "../../packages/common-common/schema"
import { ParserBase } from "../../packages/common-spider/parser"
import { env } from "../env"
import { IUserSummary } from "../schema/user.summary"

export class UniParser extends ParserBase {
  async genCard(
    content: string,
    user?: IUserSummary,
  ): Promise<{ cardUrl: string }> {
    await this.init()
    if (!this.browser) throw new UnexpectedError()

    console.log("-- opening page")
    const page = (await this.browser.newPage({
      screen: {
        width: 1080,
        height: 720,
      },
    })) as PuppetPage & PlaywrightPage
    page.on("console", (msg) => console.log("[console] ", msg.text()))

    const targetUrl = `${env.NEXT_PUBLIC_APP_URL}/card/gen?renderType=backend`
    console.log(`-- visiting: ${targetUrl}`)
    await page.goto(targetUrl)

    if (!page) throw new Error("page not inited")

    console.log("-- inputting user if necessary: ", user)
    if (user?.name && user.image) {
      await page.locator("#card-user-name").fill(user.name)
      await page.locator("#card-user-avatar").fill(user.image)
    }

    console.log(`-- inputting content(length=${content.length}) `)
    await page.locator("#card-content").fill(content)
    // const inputtedContent = await page.locator("#card-content").innerText()
    // console.log("-- inputted content length: ", {
    //   target: content.length,
    //   actual: inputtedContent,
    // })

    console.log("-- generating")
    await page.waitForSelector("#upload-card:not([disabled])") // 可能要很长（涉及到LLM）

    console.log("-- clicking upload button")
    await page.locator("#upload-card").click()

    console.log("-- parsing toast")
    const toastContent = await page.textContent(".toast div[data-title]")
    const cardUrl = /uploaded at (.*)/.exec(toastContent ?? "")?.[1]
    if (!cardUrl) throw new Error("no valid url parsed from toast")
    console.log(`-- parsed cardUrl: ${cardUrl}`)

    console.log("-- closing toast")
    await page.locator(".toast button").click()

    // await page.close()

    return { cardUrl }
  }
}