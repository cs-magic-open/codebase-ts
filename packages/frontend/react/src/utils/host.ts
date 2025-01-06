import { beian } from "../config"

export const isCurUrlDomestic = () => {
  const hostname = typeof window !== "undefined" ? window.location.origin : ""
  return beian.domainMatch.test(hostname)
}
