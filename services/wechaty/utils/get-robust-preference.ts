import { type IWechatUserPreference } from "schema/wechat-user"

export const getRobustPreference = (row: {
  preference: any
}): IWechatUserPreference => {
  const preference = row.preference as IWechatUserPreference | null
  return {
    ...{
      lang: "en",
      model: "gpt-3.5-turbo",
      backend: "nodejs",
      chatEnabled: false,
      parserEnabled: false,
    },
    ...preference,
  }
}