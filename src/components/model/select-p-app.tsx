import { Button } from "@/components/ui/button"
import { IconContainer } from "@/components/containers"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"

import { IPApp } from "@/schema/conversation"
import { useSnapshot } from "valtio"
import {
  conversationsState,
  useAddPApp,
  useDelPApp,
} from "@/store/conversation"
import { nanoid } from "nanoid"

export const SelectPApp = ({
  pApp,
  type,
}: {
  pApp: IPApp
  type: "toAdd" | "toDel"
}) => {
  const { pApps } = useSnapshot(conversationsState)
  // console.log({ pApps, type, pApp })
  const addPApp = useAddPApp()
  const delPApp = useDelPApp()

  return (
    <Button
      variant={"ghost"}
      key={pApp.id}
      className={"w-full flex items-center p-2 rounded-lg group"}
      disabled={
        (type === "toAdd" && pApps.length >= 3) ||
        (type === "toDel" && pApps.length <= 1)
      }
    >
      <IconContainer
        className={
          "w-6 h-6 invisible group-hover:visible hover:text-primary-foreground"
        }
        onClick={(event) => {
          if (type === "toDel") void delPApp(pApp.id)
          else
            void addPApp({
              ...pApp,
              // a new id, in case of duplication
              id: nanoid(),
            })
        }}
      >
        {type === "toDel" ? <MinusCircleIcon /> : <PlusCircleIcon />}
      </IconContainer>

      <span className={"mx-2"}>{pApp.model.title}</span>
      <span className={"mx-2 text-xs text-muted-foreground"}>{pApp.id}</span>

      <span className={"grow"} />
      <span className={"text-muted-foreground text-sm"}>
        by {pApp.model.company.title}
      </span>
    </Button>
  )
}
