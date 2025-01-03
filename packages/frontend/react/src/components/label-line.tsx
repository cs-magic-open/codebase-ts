import React, { type ReactNode } from "react"

export const LabelLine = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className={"w-full flex items-center justify-between gap-2 "}>
      <div className={"w-28 truncate shrink-0"}>{title}</div>
      <div className={"grow truncate overflow-auto"}>{children}</div>
    </div>
  )
}
