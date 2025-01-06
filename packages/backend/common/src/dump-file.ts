"use server"

import fs from "fs"
import path from "path"

import { formatAction } from "./utils/format-action"

export const dumpFile = async (
  content: string | object, // type: "json" | "text" = "json",
  options:
    | {
        fn: string
        dir?: string
      }
    | {
        fp: string
      },
) => {
  let fp: string = ""

  if ("fn" in options) {
    const fn = options.fn
    const dir = options.dir ?? "."
    if (!fs.existsSync(dir)) fs.mkdir(dir, () => null)
    fp = path.join(dir, fn)
  } else if ("fp" in options) {
    fp = options.fp
  }

  await formatAction(async () => {
    await fs.promises.writeFile(
      fp,
      typeof content === "string" ? content : JSON.stringify(content, null, 2),
    )
  }, `dumping JSON file into file://${fp}`)
}
