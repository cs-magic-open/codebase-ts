import type { IUploadFile } from "@cs-magic/common/oss/schema"
import { cn } from "@cs-magic/shadcn/lib/utils"
import { AspectRatio } from "@cs-magic/shadcn/ui/aspect-ratio"
import { Check } from "lucide-react"
import Image from "next/image"
import { type HTMLAttributes } from "react"

import { FlexContainer } from "./flex-container"
import { Loading } from "./loading"

export const FileComp = ({
  file,
  className,
  ...props
}: { file: IUploadFile } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      <AspectRatio className={"relative"} ratio={1}>
        <FileCompInner file={file} />
      </AspectRatio>
    </div>
  )
}

const FileCompInner = ({ file }: { file: IUploadFile }) => {
  switch (file.status) {
    case "idle":
      return <span>idle</span>

    case "running":
      return <Loading />

    case "finished":
      if (!file.success)
        return (
          <FlexContainer orientation={"vertical"}>
            <div>{file.input.name}</div>
            <div>upload failed</div>
          </FlexContainer>
        )
      if (file.input.type.startsWith("image")) {
        return (
          <>
            <Image fill alt={file.input.name} sizes={"320px"} src={file.data} />
            <Check className={"text-green-500 absolute right-0 top-0"} />
          </>
        )
      }
      return <div>uploaded {file.input.name}</div>
  }
}
