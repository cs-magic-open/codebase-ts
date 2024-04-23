import {
  cardLlmModelTypeAtom,
  cardLlmEnabledAtom,
  cardSummaryWithImageAtom,
} from "@/store/card.summary.atom"
import {
  cardFetchEngineAtom,
  cardFetchWithCacheAtom,
  cardFetchStatEnabledAtom,
  cardFetchCommentsEnabledAtom,
} from "@/store/card.request.atom"
import { useAtom } from "jotai"
import React from "react"
import { backendTypeSchema } from "../../../../packages-to-classify/llm/schema/llm.base"
import { llmModelTypeSchema } from "../../../../packages-to-classify/llm/schema/llm.models"
import { Input } from "../../../../packages-to-classify/ui-shadcn/components/input"
import { Separator } from "../../../../packages-to-classify/ui-shadcn/components/separator"
import {
  AtomSelector,
  AtomSwitcher,
} from "../../../../packages-to-classify/ui/components/atom-switcher"
import { LabelLine } from "../../../../packages-to-classify/ui/components/label-line"
import { mapSpacingVerticalAtom } from "../../../../packages-to-classify/visualization/store"
import { cardAuthorWithTitleAtom } from "../store/card.atom"
import { CardAction1 } from "./card-action1"
import { CardInputUrl } from "./card-input-url"
import { CardInputUser } from "./card-input-user"

export const CardInputFrontend = () => {
  const [mapSpacingVertical, setMapSpacingVertical] = useAtom(
    mapSpacingVerticalAtom,
  )
  return (
    <>
      <CardInputUrl />

      <CardInputUser />

      <Separator orientation={"horizontal"} />

      <AtomSwitcher atom={cardFetchWithCacheAtom} name={"fetch-with-cache"} />

      <AtomSwitcher atom={cardLlmEnabledAtom} name={"llm-enabled"} />

      <AtomSelector
        atom={cardLlmModelTypeAtom}
        name={"llm-type"}
        vs={llmModelTypeSchema.options}
      />

      <AtomSwitcher atom={cardFetchStatEnabledAtom} name={"refetch-stat"} />

      <AtomSwitcher
        atom={cardFetchCommentsEnabledAtom}
        name={"refetch-comments"}
      />

      <Separator orientation={"horizontal"} />

      <AtomSelector
        atom={cardFetchEngineAtom}
        name={"fetch engine"}
        vs={backendTypeSchema.options}
      />

      <AtomSwitcher atom={cardSummaryWithImageAtom} name={"md-with-img"} />

      <Separator orientation={"horizontal"} />

      <AtomSwitcher atom={cardAuthorWithTitleAtom} name={"author.with-title"} />

      <LabelLine title={"map.vertical.space"}>
        <Input
          type={"number"}
          value={mapSpacingVertical ?? 0}
          onChange={(event) => {
            setMapSpacingVertical(Number(event.currentTarget.value))
          }}
        />
      </LabelLine>

      <Separator orientation={"horizontal"} />

      <div className={"flex items-center gap-2"}>
        <CardAction1 type={"generate"} />
        <CardAction1 type={"reset"} />
      </div>
    </>
  )
}
