import { getEnv } from "@cs-magic/env"
import OSS from "ali-oss"
import { OSS_BUCKET_NAME, OSS_REGION } from "../const.js"

// ref: https://help.aliyun.com/zh/oss/developer-reference/initialization-10#783f1f604f969
export const initAliOss = () => {
  const env = getEnv()

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
