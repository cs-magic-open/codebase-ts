import { OSS_DOMAIN } from "./const"

/**
 * based on ali oss, ref: https://help.aliyun.com/zh/oss/user-guide/resize-images-4
 * @param ossKeyWithSuffix
 * @param width
 * @param height
 */
export const getOssUrl = (
  ossKeyWithSuffix: string,
  params?: { width?: number; height?: number },
) => {
  if (!/^(?:\/|http)/.test(ossKeyWithSuffix)) {
    ossKeyWithSuffix = OSS_DOMAIN + ossKeyWithSuffix
  }

  const width = params?.width
  const height = params?.height

  let prefix = ""
  if (width && height) {
    prefix += "?x-oss-process=image/resize,"
    // 最常用，固定画幅
    if (width && height) prefix += `m_fill,h_${height},w_${width}`
    // 瀑布流需要，宽相等，高可变
    else if (width) prefix += `m_lfit，w_${width}`
    //     不常用，高相等，宽可变
    else if (height) prefix += `m_lfit，h_${height}`
  }

  return ossKeyWithSuffix + prefix
}
