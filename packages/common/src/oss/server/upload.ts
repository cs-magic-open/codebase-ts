import { api } from "../../api/api.js"
import type { IApiResult } from "../../api/schema.js"
import { getOssSignatureUrl } from "./actions.js"

export const uploadFile = async (file: File): Promise<IApiResult<string>> => {
  try {
    let signatureUrl = await getOssSignatureUrl(file.name)

    const isHttps = location.href.includes("https")
    if (isHttps) signatureUrl = signatureUrl.replace("http://", "https://")

    console.log("-- uploading fileUrl: ", signatureUrl)
    await api.put(signatureUrl, file, {
      headers: {
        "Content-Type": "image/png",
      },
    })

    const fileUrl = signatureUrl.split("?")[0] ?? signatureUrl
    console.log("-- uploaded fileUrl: ", fileUrl)
    return { success: true, data: fileUrl }
  } catch (error: any) {
    // 检查 error 对象是否包含 message 属性
    // 如果有 axios 响应信息（error.response），可以进一步提取信息
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred"
    return { success: false, message }
  }
}