import { PrismaAdapter } from "@auth/prisma-adapter"

import { CallbacksOptions, type NextAuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { prisma } from "../db/index.js"
import { env } from "../env/index.js"
import { tokenExpireSeconds } from "./config.js"

import { ProfileUpdateProvider } from "./providers/profile/provider.js"
import { SmsProvider } from "./providers/sms/provider.js"
import { WechatProvider } from "./providers/wechat/provider.js"
import { IWechatProfile } from "./providers/wechat/schema.js"

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,

  pages: {
    signIn: "/auth",
    // signOut: "/auth",
  },

  session: {
    // Credentials should use `jwt`, ref: https://github.com/nextauthjs/next-auth/issues/3970#issuecomment-1046347097
    strategy: "jwt",
    maxAge: tokenExpireSeconds,
  },

  // @ts-ignore // todo: ts profile for signin
  callbacks: {
    // compatible with credential providers
    jwt: ({ user, profile, token }) => {
      // console.log("[next-auth] jwt: ", { token, user, profile })

      // 首次注册入表 （user中有userId）
      if (user) {
        token.sub = user.id
        token.name = user.name
        token.image = user.image ?? null
        token.wxid = user.wxid
        token.phone = user.phone
      }

      // profile 中 只有 accountId，没有 id
      // todo: unify Profile
      // link 是自动的，link会在有session的时候登录其他平台拿到profile后更新
      if (profile) {
        token.name = profile.nickname
        token.image = profile.headimgurl
        token.wxid = profile.openid
      }

      return token
    },

    session: ({ session, user, token }) => {
      // console.log("[next-auth] session: ", { session, user })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? user.id,
          name: token.name,
          image: token.image,
          wxid: token.wxid,
          phone: token.phone,
          email: token.email,
        },
      }
    },
    // custom profile
  } as Partial<CallbacksOptions<IWechatProfile>>,
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  providers: [
    WechatProvider({
      clientId: env?.NEXT_PUBLIC_WECHAT_APP_ID!,
      clientSecret: env?.WECHAT_APP_SECRET!,
    }),

    SmsProvider,

    ProfileUpdateProvider,

    // DiscordProvider({
    //   clientId: env?.DISCORD_CLIENT_ID,
    //   clientSecret: env?.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}