"use client"

import { useAtom, useAtomValue } from "jotai"
import React from "react"
import { useSearchParam } from "../../packages/common-hooks/use-search-param"
import { backendEngineTypeSchema } from "../../packages/common-llm/schema/llm"
import { Input } from "../../packages/common-ui-shadcn/components/input"
import { Separator } from "../../packages/common-ui-shadcn/components/separator"
import { cn } from "../../packages/common-ui-shadcn/utils"
import {
  AtomSelector,
  AtomSwitcher,
} from "../../packages/common-ui/components/atom-switcher"
import { LabelLine } from "../../packages/common-ui/components/label-line"
import { Textarea } from "../../packages/common-ui/components/textarea-auto"
import { mapSpacingVerticalAtom } from "../../packages/common-visualization/store"
import { GenCardRenderType } from "../schema/card"
import {
  cardAtom,
  cardAuthorWithTitleAtom,
  cardFetchEngineAtom,
  cardInputAtom,
  cardLLMEnabledAtom,
  cardLLMTypeAtom,
  cardMdWithImgAtom,
  cardPreviewEngineAtom,
  cardRefetchCardAtom,
  cardRefetchCommentsAtom,
  cardRefetchPageAtom,
} from "../store/card.atom"
import { CardAction1 } from "./card-action1"
import { CardInputUrl } from "./card-input-url"
import { CardInputUser } from "./card-input-user"
import { CardPreview } from "./card-preview"
import { StandardCard } from "./standard-card"

export const Card = () => {
  const card = useAtomValue(cardAtom)
  const renderType =
    useSearchParam<GenCardRenderType>("renderType") ?? "frontend"

  const Input = renderType === "backend" ? InputBackend : InputFrontend

  return (
    <div
      className={cn(
        "w-full h-full mx-auto gap-4 p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-2",
      )}
    >
      <StandardCard title={"Input Control"}>
        <Input />
      </StandardCard>

      <StandardCard title={"Preview"} id={"card-previews"}>
        <AtomSelector
          atom={cardPreviewEngineAtom}
          name={"preview-engine"}
          vs={["html2image", "html2canvas", "modern-screenshot"]}
        />

        <Separator orientation={"horizontal"} />

        <CardPreview renderType={renderType} card={card} withActions />
      </StandardCard>
    </div>
  )
}

const InputFrontend = () => {
  const [mapSpacingVertical, setMapSpacingVertical] = useAtom(
    mapSpacingVerticalAtom,
  )
  return (
    <>
      <CardInputUrl />

      <CardInputUser />

      <Separator orientation={"horizontal"} />

      <AtomSwitcher atom={cardRefetchPageAtom} name={"refetch-page"} />

      <AtomSwitcher atom={cardLLMEnabledAtom} name={"llm-enabled"} />

      <AtomSelector
        atom={cardLLMTypeAtom}
        name={"llm-type"}
        vs={[
          "gpt-3.5-turbo",
          "gpt-4",
          "glm-4",
          "moonshot-v1-8k",
          "moonshot-v1-32k",
          "moonshot-v1-128k",
        ]}
      />

      <AtomSwitcher atom={cardRefetchCardAtom} name={"refetch-stat"} />

      <AtomSwitcher atom={cardRefetchCommentsAtom} name={"refetch-comments"} />

      <Separator orientation={"horizontal"} />

      <AtomSelector
        atom={cardFetchEngineAtom}
        name={"fetch engine"}
        vs={backendEngineTypeSchema.options.map((o) => o.value)}
      />

      <AtomSwitcher atom={cardMdWithImgAtom} name={"md-with-img"} />

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

const InputBackend = () => {
  const [cardInput, setCardInput] = useAtom(cardInputAtom)

  return (
    <>
      <CardInputUser />

      <Textarea
        id={"card-content"}
        minRows={10}
        maxRows={20}
        value={cardInput}
        onChange={(event) => {
          setCardInput(event.currentTarget.value)
        }}
      />
    </>
  )
}
