"use client"

import { useAtom } from "jotai"
import { first } from "lodash"
import { QRCodeSVG } from "qrcode.react"
import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from "react"
import { useMeasure } from "react-use"
import { MarkdownComp } from "../../packages/common-markdown/component"
import { AspectRatio } from "../../packages/common-ui-shadcn/components/aspect-ratio"
import { Label } from "../../packages/common-ui-shadcn/components/label"
import { cn } from "../../packages/common-ui-shadcn/utils"
import { CardType, cardTypeAtom } from "../app/(sub)/card/gen/store"
import { ICard, IMedia } from "../schema/card"
import { CardMedia } from "./card-media"
import { UserAvatar } from "./user-avatar"

export const Card = forwardRef<
  HTMLDivElement,
  { card: ICard } & HTMLAttributes<HTMLDivElement>
>(({ card, className, ...props }, ref) => {
  const [cardType] = useAtom(cardTypeAtom)
  const [content, setContent] = useState("")

  // 1. init content
  useEffect(() => {
    if (!card.body.content) return
    setContent(card.body.content)
  }, [card.body.content, cardType])

  // 2. overflow
  const refText = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!refText.current) return

    const { scrollHeight, clientHeight } = refText.current
    const overflow = scrollHeight > clientHeight
    // console.log({ content, scrollHeight, clientHeight, overflow })
    if (!overflow) return

    setContent(
      (content) => content?.slice(0, Math.min(content?.length - 5, 100)) + "…",
    )
  }, [content])

  console.log("-- card: ", card)

  const { type, body } = card
  const m: Partial<Record<CardType, IMedia[] | undefined>> = {
    "text-image": body.images,
    "text-iframe": body.iFrames,
    "text-video": body.videos,
  }
  const media = first(m[type])

  const [refMedia, { width, height }] = useMeasure<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg overflow-hidden corner-gradient p-6 w-[367px]",
        className,
      )}
      {...props}
    >
      <AspectRatio ratio={8 / 16}>
        <div className={"w-full h-full overflow-hidden flex flex-col"}>
          <h1 className={"text-black font-medium my-2 shrink-0"}>Area #1</h1>

          <div
            className={
              "w-full grow overflow-hidden rounded-lg flex flex-col bg-white text-black gap-2"
            }
          >
            {media && (
              <div className={"w-full shrink-0"}>
                <AspectRatio ratio={media.width / media.height} ref={refMedia}>
                  <CardMedia
                    width={width}
                    height={height}
                    url={media.url}
                    type={card.type}
                  />
                </AspectRatio>
              </div>
            )}

            <div className={"px-2 grow overflow-hidden relative flex flex-col"}>
              <div ref={refText} className={"grow overflow-hidden"}>
                <MarkdownComp>{content ?? "No Content Yet"}</MarkdownComp>
              </div>

              {card.body.sourceUrl && (
                <QRCodeSVG
                  value={card.body.sourceUrl}
                  className={"w-12 h-12 m-2 ml-auto shrink-0"}
                />
              )}
            </div>
          </div>

          <div
            className={
              "text-muted-foreground text-xs flex items-center justify-between p-2"
            }
          >
            <div className={"flex gap-2 items-center justify-end"}>
              {card.user ? (
                <>
                  <UserAvatar user={card.user} />
                  <Label>{card.user.name}</Label>
                </>
              ) : (
                "no user"
              )}
            </div>

            <div className={"flex items-center gap-2"}>
              {/*<span>{moment(card.updatedAt).format("MMMDo h:mm")}</span>*/}

              <span>PROJECT 1</span>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  )
})
Card.displayName = "Card"
