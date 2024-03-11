import { useAtom } from "jotai"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"
import { useSnapshot } from "valtio"
import { IconContainer } from "../../packages/common-ui/components/icon-container"
import { buttonVariants } from "../../packages/common-ui/shadcn/shadcn-components/button"
import { cn } from "../../packages/common-ui/shadcn/utils"
import { IAppDetail } from "../schema/app.detail"
import { maxAppsOnScreenAtom } from "../store/system.atom"

import { coreValtio } from "../store/core.valtio"

export const SelectApp = ({
  app,
  type,
}: {
  app: IAppDetail
  type: "toAdd" | "toDel"
}) => {
  const [maxToAdd] = useAtom(maxAppsOnScreenAtom)

  // const [apps] = useAtom(appsPersistedAtom)
  // const [, pushApp] = useAtom(pushAppAtom)
  // const [, delApp] = useAtom(delAppAtom)

  // const apps = useConvStore.use.apps()
  // const pushApp = useConvStore.use.pushApp()
  // const delApp = useConvStore.use.delApp()

  const { apps } = useSnapshot(coreValtio)

  const disabled =
    (type === "toAdd" && apps.length >= maxToAdd) ||
    (type === "toDel" && apps.length <= 1)
  const Icon = type === "toDel" ? MinusCircleIcon : PlusCircleIcon

  return (
    <div
      key={app.id}
      className={cn(
        "w-full flex items-center p-2 rounded-lg group",
        buttonVariants({ variant: "ghost" }),
      )}
    >
      <IconContainer
        className={
          "w-6 h-6 invisible group-hover:visible hover:text-primary-foreground"
        }
        disabled={disabled}
        onClick={(event) => {
          if (disabled) return
          if (type === "toDel")
            // void convStore.
            coreValtio.delApp(app.id)
          // void convStore.
          else coreValtio.pushApp(app)
        }}
      >
        <Icon />
      </IconContainer>

      <span className={"mx-2"}>{app.model.title}</span>
      <span className={"mx-2 text-xs text-muted-foreground"}>{app.id}</span>

      <span className={"grow"} />
      <span className={"text-muted-foreground text-sm"}>
        {/*by {config.user}*/}
        by {app.model.company.title}
      </span>
    </div>
  )
}
