import { useState } from "react"
import { IUploadFile } from "../schema"
import { uploadFile } from "../upload"

export const useUploadFile = () => {
  const [status, setStatus] = useState<IUploadFile>({ status: "idle" })

  const upload = async (file: File) => {
    setStatus({ status: "running", input: file })
    const result = await uploadFile(file)
    setStatus({ status: "finished", input: file, ...result })
  }

  return { status, upload }
}