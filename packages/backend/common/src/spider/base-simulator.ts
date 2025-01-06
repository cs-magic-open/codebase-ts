import AsyncLock from "async-lock"
import { chromium } from "playwright"
import type { Browser, BrowserType, LaunchOptions, Page } from "playwright-core"

import logger from "../log"
import type { DriverType } from "./schema"

const lock = new AsyncLock()

export class BaseSimulator {
  public launchOptions: LaunchOptions
  protected driver: BrowserType
  protected browser: Browser | null = null
  protected page?: Page

  constructor(driverType: DriverType = "playwright", launchOptions?: LaunchOptions) {
    logger.info("-- init UniParserBot: ", { driverType })
    // Or 'firefox' or 'webkit'.
    this.driver = chromium
    this.launchOptions = launchOptions ?? {}

    process.on("exit", () => this.cleanup())
    process.on("SIGINT", () => this.cleanup())
    process.on("SIGTERM", () => this.cleanup())
  }

  async cleanup() {
    if (this.browser) await this.browser.close()

    process.exit()
  }

  async initBrowserSafe() {
    await lock.acquire("browser", async () => {
      if (!this.browser) {
        logger.info("-- opening browser")
        this.browser = await this.driver.launch({
          downloadsPath: "/tmp",
          ...this.launchOptions,
        })
      }
    })
    return this.browser!
  }

  async initPageSafe(url?: string) {
    await lock.acquire("page", async () => {
      if (!this.page) {
        logger.info("-- new page")
        const browser = await this.initBrowserSafe()
        this.page = await browser.newPage({
          screen: {
            width: 1080,
            height: 720,
          },
        })
        if (url) {
          logger.info(`-- goto ${url}`)
          await this.page.goto(url)
        }
      }
    })
    return this.page!
  }
}
