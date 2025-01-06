import { safeCallLLM } from "./safe-call-llm"

describe("", () => {
  it("test basic", async () => {
    const result = await safeCallLLM({
      // model: "gpt-3.5-turbo",
      // model: "moonshot-v1-8k",
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What's in this image?" },
            {
              type: "image_url",
              image_url: {
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
              },
            },
          ],
        },
      ],
    })

    console.log(JSON.stringify(result, null, 2))
  }, 30e3)
})
