"use client";

import MdEditor from "@uiw/react-md-editor";
import { produce } from "immer";
import { useAtom } from "jotai";
import { useState } from "react";
import { useDrop } from "react-use";
import { toast } from "sonner";
import { FileComp } from "../../../../packages-to-classify/file/components";
import { useUploadFiles } from "../../../../packages-to-classify/oss/hooks/use-upload-files";
import { IUploadFile } from "../../../../packages-to-classify/oss/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../packages-to-classify/ui-shadcn/components/tooltip";
import { cn } from "../../../../packages-to-classify/ui-shadcn/utils";
import { VerticalAspectRatio } from "../../../../packages-to-classify/ui/components/aspect-ratio";
import { ButtonWithLoading } from "../../../../packages-to-classify/ui/components/button-with-loading";
import { FlexContainer } from "../../../../packages-to-classify/ui/components/flex-container";
import { cardNewContentAtom } from "../store/card.atom";

export function NewCard() {
  const [v, setV] = useAtom(cardNewContentAtom);
  const [uploadFiles, setUploadFiles] = useState<IUploadFile[]>([]);
  const { upload, isUploading } = useUploadFiles({
    onUploadChange: (index, file) => {
      const n = uploadFiles.length;

      setUploadFiles((uploadFiles) =>
        produce(uploadFiles, (uploadFiles) => {
          uploadFiles[n + index] = file;
          if (file.status === "finished" && file.success) {
            setV((v) => v + `![${file.input.name}](${file.data})\n`);
          }
        }),
      );
    },
  });

  /**
   * ref:
   */
  useDrop({
    onFiles: async (files) => {
      console.log("files", files);

      if (isUploading)
        return toast.error("please waiting last uploading finished");

      setUploadFiles((uploadFiles) => [
        ...uploadFiles,
        ...files.map((f) => ({ status: "idle" }) as IUploadFile),
      ]);
      await upload(files);
    },
    onUri: (uri) => console.log("uri", uri),
    onText: (text) => console.log("text", text),
  });

  return (
    <FlexContainer
      className={cn(
        // "bg-cyan-950",
        " items-center",
      )}
    >
      <FlexContainer orientation={"vertical"}>
        <MdEditor
          className={"w-full grow overflow-auto"}
          value={v}
          onChange={(v) => setV(v ?? "")}
        />

        <div className={"flex h-12 w-full items-center gap-2"}>
          <div className={"flex h-full grow items-center gap-2 overflow-auto"}>
            {!!uploadFiles.length &&
              uploadFiles.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <VerticalAspectRatio
                      ratio={1}
                      key={index}
                      className={"shrink-0"}
                    >
                      <FileComp
                        key={index}
                        file={item}
                        className={"overflow-hidden rounded-xl border"}
                      />
                    </VerticalAspectRatio>
                  </TooltipTrigger>

                  <TooltipContent>hello</TooltipContent>
                </Tooltip>
              ))}
          </div>

          <ButtonWithLoading className={"ml-auto"} size={"sm"} disabled={!v}>
            Submit
          </ButtonWithLoading>
        </div>
      </FlexContainer>
    </FlexContainer>
  );
}