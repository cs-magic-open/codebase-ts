import anylogger from "anylogger"
import "ulog"

/**
 * ref: https://github.com/Download/ulog
 * @param loggerName
 */
export const getLogger = (loggerName: string) => {
  const log = anylogger(loggerName)
  // log("Logging is easy!")

  return log
}

export const uLogger = getLogger("default")
