import { api } from "../api/api"
import type { IApiResult } from "../api/schema"
import { logger } from "../log"
import type { IBilibiliVideoDetail } from "./schema"

export const getBilibiliSummary = async (bvid: string) => {
  const { data } = await api.get(
    `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&jsonp=jsonp`,
  )
  logger.debug("getBilibiliDetail: %o", data)

  if (data.code !== 0) throw new Error(JSON.stringify(data))

  return data.data[0]
}

/**
 * @param url e.g. https://b23.tv/sbodfSp
 */
export const fetchBvidFromb23tv = async (url: string): Promise<IApiResult<string>> => {
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "manual",
  })

  if (res.status === 302) {
    const location = res.headers.get("location")
    if (location) {
      const m = /^.*?video\/(.*?)\?.*?$/.exec(location)
      const newUrl = m?.[0]
      const bvid = m?.[1]
      if (bvid) {
        console.log({ rawUrl: url, newUrl, bvid })
        return { success: true, data: bvid }
      }
    }
  }

  return { success: false, message: `not found bvid from ${url}` }
}

export const fetchBilibiliDetail = async (
  bvid: string,
): Promise<IApiResult<IBilibiliVideoDetail>> => {
  const url = `https://api.bilibili.com/x/web-interface/wbi/view/detail?bvid=${bvid}&need_view=1`
  console.debug("-- fetchBilibiliDetail:", url)

  const { data: resData } = await api.get<{
    code: number
    data: IBilibiliVideoDetail
  }>(url, {
    headers: {
      Cookie:
        "SESSDATA=e4af78fd%2C1726891541%2C3bae6%2A32CjD_F64Z3XX4qdJKQGL2z8q63OzAqcVkS15xyt_roEp3gF1_3jVXkGxGrjYyBiOTZlISVjlodklKckE5TlIzYmZZNHJsSWY1clZsLUxKcWJCMVJCV3RuWnhndWV2RVRfNVlJamZka1V0SmdZYTc4M1phd3VlYWJka0NncnFXZGRDVlhySVN4cjdnIIEC",
    },
  })
  // console.debug("getBilibiliDetail: ", JSON.stringify(json, null, 2))

  if (resData.code !== 0) return { success: false, message: JSON.stringify(resData, null, 2) }

  const data = resData.data
  console.log(
    "-- got bilibili detail",
    // data.View
  )
  return { success: true, data }
}
