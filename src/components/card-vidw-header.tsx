import { Label } from "../../packages/common-ui-shadcn/components/label"
import { IUserSummary } from "../schema/user.summary"
import { PROJECT_NAME } from "./card"
import { UserAvatar } from "./user-avatar"

export const CardHeader = ({ user }: { user: IUserSummary | null }) => {
  return (
    <div
      className={
        "text-muted-foreground text-xs flex items-center justify-between p-2"
      }
    >
      <div className={"flex gap-2 items-center justify-end"}>
        {user ? (
          <>
            <UserAvatar user={user} />
            <Label>{user.name}</Label>
          </>
        ) : (
          "no user"
        )}{" "}
        {/*分享给你一张卡片*/}
        推荐一张卡片，理由：我真的是会谢！
      </div>

      <div className={"flex items-center gap-2"}>
        {/*<span>{moment(card.updatedAt).format("MMMDo h:mm")}</span>*/}

        <span className={"text-primary-foreground text-lg font-medium"}>
          {PROJECT_NAME}
        </span>
      </div>
    </div>
  )
}