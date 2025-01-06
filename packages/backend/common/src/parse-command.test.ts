import { parseCommand } from "./parse-command"

describe("parseCommand", () => {
  it("should ", () => {
    const parser = parseCommand(
      `todo update 65
this.status="done"
this.notes.push("这个好像是张蔚加的，不知道为啥会在我这")`.replace(/\n/g, " "),
      {
        // configuration: {
        //   "duplicate-arguments-array": false,
        // },
      },
    )

    console.log({ parser })
  })

  it("", () => {
    const result = parseCommand(
      "87 false hhh -a -bbb -c=43 -d=43 -e=42da -f=false -g=false -hi=432 --bss=e2e --ss scscs",
      {
        string: ["d"],
        boolean: ["f"],
      },
    )

    expect(result).toStrictEqual({
      _: [87, "false", "hhh"],
      a: true,
      b: [true, true, true],
      c: 43,
      d: "43",
      e: "42da",
      f: false,
      g: "false",
      h: true,
      i: 432,
      bss: "e2e",
      ss: "scscs",
    })
  })
})
