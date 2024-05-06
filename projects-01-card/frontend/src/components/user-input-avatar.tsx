import { useDraftSession } from "../../../../packages-to-classify/hooks/use-user-draft-session";
import { uploadFile } from "../../../../packages-to-classify/oss/upload";
import { Label } from "../../../../packages-to-classify/ui-shadcn/components/label";
import { UserAvatar } from "./user-avatar";

export const UserInputAvatar = () => {
  const { draft, setDraft } = useDraftSession("image");

  return (
    <Label className={"h-12 shrink-0 hover:cursor-pointer"}>
      <UserAvatar user={{ id: "", image: draft ?? "", name: "" }} />

      <input
        hidden
        type={"file"}
        accept={"image/jpeg,image/png"}
        onChange={async (event) => {
          const files = event.currentTarget.files;
          if (!files?.length) return;

          const data = await uploadFile(files[0]!);
          if (data.success) setDraft(data.data);
        }}
      />
    </Label>
  );
};