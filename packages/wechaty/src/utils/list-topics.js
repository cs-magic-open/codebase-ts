import { prisma } from "@cs-magic/common";
import { parseLimitedCommand } from "./parse-command";
export const listTopics = async (convId) => {
    const listMessages = async (convId, take) => {
        const messages = await prisma.wechatMessage.findMany({
            where: {
                // 三者任一即可
                OR: [{ roomId: convId }, { listenerId: convId }, { talkerId: convId }],
            },
            orderBy: { createdAt: "asc" },
            take,
        });
        return messages;
    };
    const messages = await listMessages(convId);
    const topicDict = {};
    let lastTopic = null;
    const started = true; // todo: switch
    messages.forEach((row) => {
        const parsed = parseLimitedCommand(row.text ?? "", ["new-topic"]);
        if (parsed) {
            switch (parsed?.command) {
                case "new-topic":
                    lastTopic = parsed?.args ?? "默认";
                    if (!(lastTopic in topicDict))
                        topicDict[lastTopic] = 0;
                    break;
            }
        }
        else if (started && lastTopic !== null && !row.text?.startsWith("/")) {
            ++topicDict[lastTopic];
        }
        else {
            // don't do anything
        }
    });
    return topicDict;
};
