"use client"

import { cn } from "@/lib/utils"
import { SokkaBrand, V2AGIBrand } from "@/config/assets"
import { ImageEqualHeight } from "@/components/images"
import {
  INDIES_AVATARS,
  SHOW_PARTNERS,
  SPONSORS_BANNERS,
} from "@/config/system"
import { SeparatorContainer } from "@/components/containers"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HTMLAttributes } from "react"
import { BarChart } from "lucide-react"
import { useSocketStore } from "@/store/socket"
import { StatusIcon } from "@/components/icons"
import Link from "next/link"

export const BrandTitle = ({
  withDescription,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { withDescription?: boolean }) => {
  return (
    <Link
      href={"/"}
      className={cn(
        "flex justify-center",
        // "w-[240px] "
      )}
    >
      <h1
        className={cn(
          "text-6xl gap-4 font-bold primary-gradient flex",
          className,
        )}
        {...props}
      >
        搜 嘎
        <span
          className={
            "rotate-12 scale-150 inline-block primary-gradient bg-gradient-to-t"
          }
        >
          {" !"}
        </span>
      </h1>

      {/*{withDescription && <span className={"text-sm"}>全栈 AI 平台</span>}*/}
    </Link>
  )
}

export const BrandingFooter = () => {
  const enterprises: string[] = []

  return (
    <div className={"flex flex-col items-center gap-2 mt-auto p-4"}>
      {/*  founders */}
      <div className={"w-full flex items-center gap-4 mt-auto h-8"}>
        <div className={"grow"} />
        <SokkaBrand className={"h-full w-auto"} />

        <V2AGIBrand className={"h-full w-auto text-primary"} />

        {enterprises.map((item) => (
          <ImageEqualHeight src={item} key={item} />
        ))}

        <div className={"grow"} />

        <AppStatus />
      </div>

      {SHOW_PARTNERS && <Partners />}
    </div>
  )
}

export const AppStatus = () => {
  const latency = useSocketStore((state) => state.latency)

  return (
    <div className={cn("flex items-center gap-1 mt-2 shrink-0")}>
      {latency === 0 ? (
        <BarChart className={"animate-pulse w-4 h-4"} />
      ) : (
        <StatusIcon
          level={latency < 500 ? 3 : latency < 1000 ? 2 : 1}
          className={"w-4 h-4"}
        />
      )}
      <span className={"text-xs text-muted-foreground"}>
        {Math.floor(latency) + " ms"}
      </span>
    </div>
  )
}

export const Partners = () => {
  return (
    <>
      {!!SPONSORS_BANNERS.length && (
        <>
          <SeparatorContainer>合作伙伴</SeparatorContainer>
          <div className={"flex justify-center gap-4 mt-auto h-8"}>
            {SPONSORS_BANNERS.map((item) => (
              <ImageEqualHeight src={item} key={item} />
            ))}
          </div>
        </>
      )}

      {/*  individual */}
      {!!INDIES_AVATARS.length && (
        <>
          <SeparatorContainer>独立开发者</SeparatorContainer>
          <div className={"flex justify-center gap-4 mt-auto"}>
            {INDIES_AVATARS.map((item) => (
              <Avatar key={item}>
                <AvatarImage src={item} />
              </Avatar>
            ))}
          </div>
        </>
      )}
    </>
  )
}
