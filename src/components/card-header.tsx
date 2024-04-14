"use client"

import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { Label } from "../../packages/common-ui-shadcn/components/label"

import { config } from "../config"
import { IUserBasic } from "../schema/user.summary"
import { cardUserRenderedAtom } from "../store/card.atom"
import { UserAvatar } from "./user-avatar"

export const CardHeader = ({ user }: { user?: IUserBasic | null }) => {
  const setUserRendered = useSetAtom(cardUserRenderedAtom)
  useEffect(() => {
    setUserRendered(false)
  }, [user?.avatar])

  return (
    <div className={"text-xs flex items-center justify-between px-4 pb-2 pt-6"}>
      <div className={"flex gap-2 items-center justify-end h-8"}>
        {user ? (
          <>
            <UserAvatar
              user={user}
              imageProps={{
                onLoad: () => {
                  setUserRendered(true)
                },
              }}
            />

            <Label
              className={
                "text-primary-foreground w-full flex items-center gap-2"
              }
            >
              <span className={"font-bold text-lg mr-1 truncate"}>
                {user.name}
              </span>
              <span className={"text-nowrap"}>分享给你一张卡片</span>
              {/*{card?.id && `#${card.id}`}*/}
            </Label>
          </>
        ) : (
          "no user"
        )}
      </div>

      <div className={"flex items-center gap-2"}>
        {/*<span>{moment(card.updatedAt).format("MMMDo h:mm")}</span>*/}

        <div className={"text-primary-foreground text-lg font-medium shrink-0"}>
          {config.name}
        </div>
      </div>
    </div>
  )
}
