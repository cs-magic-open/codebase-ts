"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cs-magic/shadcn/ui/select"
import { Switch } from "@cs-magic/shadcn/ui/switch"
import { type Atom, type PrimitiveAtom, useAtom } from "jotai"

import { LabelLine } from "./label-line"

/**
 * @param atom
 * @param name todo: how to retrieve the name from input atom's variable name so that we can omit the name param
 * @constructor
 */
export const AtomSwitcher = ({
  atom,
  name,
}: {
  atom: any // todo: augment
  name: string
}) => {
  const [v, setV] = useAtom(atom as PrimitiveAtom<boolean>)

  return (
    <LabelLine title={name}>
      <Switch checked={v} onCheckedChange={setV} />
    </LabelLine>
  )
}

export const AtomSelector = <T extends string>({
  atom,
  name,
  vs,
}: {
  name: string
  vs: T[]
  atom: Atom<T>
}) => {
  const [v, setV] = useAtom(atom)
  return <BaseSelector name={name} setV={setV} v={v} vs={vs} />
}

export const BaseSelector = <T extends string>({
  name,
  v,
  setV,
  vs,
}: {
  name: string
  v: T
  setV: (v: T) => void
  vs: T[]
}) => {
  return (
    <LabelLine title={name}>
      <Select value={v} onValueChange={v => setV(v as T)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {vs.map(v => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </LabelLine>
  )
}
