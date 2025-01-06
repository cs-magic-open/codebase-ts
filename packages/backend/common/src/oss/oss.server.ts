"use server"

import OSS from "ali-oss"

import { type IApiResult, api } from "../api"
import { env } from "../env"
import { OSS_BUCKET_NAME, OSS_REGION } from "./const"

// ref: https://help.aliyun.com/zh/oss/developer-reference/initialization-10#783f1f604f969
const initAliOss = () => {
  if (!env?.ALI_AK || !env?.ALI_SK) throw new Error("no ali key error")

  return new OSS({
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    accessKeyId: env?.ALI_AK,
    accessKeySecret: env?.ALI_SK,
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: OSS_REGION,
    // yourBucketName填写Bucket名称。
    bucket: OSS_BUCKET_NAME,
  })
}

const ossServer = initAliOss()

export const getOssSignatureUrl = async (id: string) =>
  ossServer.signatureUrl(id, {
    method: "PUT",
    "Content-Type": "image/png",
    // expires: 0, // default 1800
  })

export const checkOssObjectExists = async (id: string) => {
  try {
    await ossServer.head(id)
    return true
  } catch (e) {
    return false
  }
}

// void checkOssObjectExists("p01/card/image.jpg").then(console.log)
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
    const message = error.response?.data?.message || error.message || "An unknown error occurred"
    return { success: false, message }
  }
}
