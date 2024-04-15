import { Card } from "@prisma/client";
import { useAtom, useSetAtom } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { safeParseJson } from "../../../../packages/common-common/safe-parse-json";
import moment from "../../../../packages/common-datetime/moment";
import { cn } from "../../../../packages/common-ui-shadcn/utils";
import { VerticalAspectRatio } from "../../../../packages/common-ui/components/aspect-ratio";
import { getPlatformName } from "../core/utils";
import {
  cardAuthorRenderedAtom,
  cardAuthorWithTitleAtom,
} from "../store/card.atom";
import { UserAvatar } from "./user-avatar";

export const CardContentAuthor = ({ card }: { card?: Card | null }) => {
  // console.log("-- author: ", card?.author)

  const [withRawTitle] = useAtom(cardAuthorWithTitleAtom);

  const Line1 = () => (
    <div className={"truncate text-xs text-muted-foreground"}>
      原标题：{card?.title}
    </div>
  );

  const Line21 = () => (
    <span className={"mr-1 text-nowrap"}>
      {safeParseJson(card?.author)?.name}
    </span>
  );

  const Line22 = () => (
    <div>
      {!!card?.time && (
        <span>{moment(card.time).fromNow().replace(/\s+/g, "")}</span>
      )}

      <span>发表于</span>
      <span>{getPlatformName(card?.platformType)}</span>
    </div>
  );

  const Line2 = () => (
    <div
      className={cn(
        "flex gap-0.5 text-xs text-muted-foreground ",
        !withRawTitle && "flex-col",
      )}
    >
      <Line21 />
      <Line22 />
    </div>
  );

  const setAuthorRendered = useSetAtom(cardAuthorRenderedAtom);
  useEffect(() => {
    setAuthorRendered(false);
  }, [card?.author?.avatar]);

  return (
    <div className={"flex h-8 shrink-0 items-center"}>
      <VerticalAspectRatio ratio={1} className={"shrink-0"}>
        {!!card?.author && (
          <UserAvatar
            imageProps={{ onLoad: () => setAuthorRendered(true) }}
            user={card.author}
          />
        )}
      </VerticalAspectRatio>

      <div className={"mx-2 flex flex-col justify-center overflow-hidden"}>
        {withRawTitle ? (
          <>
            <Line1 />
            <Line2 />
          </>
        ) : (
          <Line2 />
        )}
      </div>

      <div className={"ml-auto flex h-full shrink-0 items-center"}>
        {card?.sourceUrl && (
          <>
            {/*<div className={"w-8 text-xs text-muted-foreground"}>查看原文</div>*/}
            <VerticalAspectRatio ratio={1}>
              <QRCodeSVG value={card.sourceUrl} className={"h-full w-full"} />
            </VerticalAspectRatio>
          </>
        )}
      </div>
    </div>
  );
};