import { callLLM } from "./call-llm"

const f = async () => {
  await callLLM({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "hello",
      },
    ],
  })
}

// it("should ", f, 20e3)

void f()