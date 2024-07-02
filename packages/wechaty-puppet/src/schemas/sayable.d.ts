import type { FileBoxInterface } from 'file-box';
import type { LocationPayload } from './location.js';
import type { UrlLinkPayload } from './url-link.js';
import type { MiniProgramPayload } from './mini-program.js';
import type { PostPayload, SayablePayloadPost } from './post.js';
/**
 * using `types` as a static typed string name list for `createAction`
 *
 *  Huan(202201): if we remove the `(() => ({}))()`, then the typing will fail.
 *    FIXME: remove the `(() => ({}))()` after we fix the issue.
 */
declare const sayableTypes: {
    readonly [x: number]: number;
    readonly Unknown: "Unknown";
    readonly Attachment: "Attachment";
    readonly Audio: "Audio";
    readonly Contact: "Contact";
    readonly ChatHistory: "ChatHistory";
    readonly Emoticon: "Emoticon";
    readonly Image: "Image";
    readonly Text: "Text";
    readonly Location: "Location";
    readonly MiniProgram: "MiniProgram";
    readonly GroupNote: "GroupNote";
    readonly Transfer: "Transfer";
    readonly RedEnvelope: "RedEnvelope";
    readonly Recalled: "Recalled";
    readonly Url: "Url";
    readonly Video: "Video";
    readonly Post: "Post";
    readonly System: "System";
};
/**
 * Huan(202201): Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 */
declare const sayablePayloadsNoPost: {
    readonly attatchment: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Attachment", {
        filebox: string | FileBoxInterface;
    }>;
    readonly audio: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Audio", {
        filebox: string | FileBoxInterface;
    }>;
    readonly contact: (contactId: string) => import("typesafe-actions").PayloadAction<"Contact", {
        contactId: string;
    }>;
    readonly emoticon: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Emoticon", {
        filebox: string | FileBoxInterface;
    }>;
    readonly image: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Image", {
        filebox: string | FileBoxInterface;
    }>;
    readonly location: (locationPayload: LocationPayload) => import("typesafe-actions").PayloadAction<"Location", {
        accuracy: number;
        address: string;
        latitude: number;
        longitude: number;
        name: string;
    }>;
    readonly miniProgram: (miniProgramPayload: MiniProgramPayload) => import("typesafe-actions").PayloadAction<"MiniProgram", {
        appid?: string | undefined;
        description?: string | undefined;
        pagePath?: string | undefined;
        iconUrl?: string | undefined;
        shareId?: string | undefined;
        thumbUrl?: string | undefined;
        title?: string | undefined;
        username?: string | undefined;
        thumbKey?: string | undefined;
    }>;
    readonly text: (text: string, mentions?: string[] | undefined) => import("typesafe-actions").PayloadAction<"Text", {
        text: string;
        mentions: string[];
    }>;
    readonly url: (urlLinkPayload: UrlLinkPayload) => import("typesafe-actions").PayloadAction<"Url", {
        description?: string | undefined;
        thumbnailUrl?: string | undefined;
        title: string;
        url: string;
    }>;
    readonly video: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Video", {
        filebox: string | FileBoxInterface;
    }>;
};
/**
 *
 * Huan(202201): Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 *  @link https://github.com/wechaty/puppet/issues/180
 */
declare const sayablePayloads: {
    readonly post: (postPayload: PostPayload) => import("typesafe-actions").PayloadAction<"Post", {
        id?: undefined;
        sayableList: SayablePayload[];
        parentId?: string | undefined;
        rootId?: string | undefined;
        type?: import("./post.js").PostType | undefined;
    } | {
        id: string;
        sayableList: string[];
        contactId: string;
        timestamp: number;
        counter: {
            children?: number | undefined;
            descendant?: number | undefined;
            taps?: {
                0?: number | undefined;
                1?: number | undefined;
            } | undefined;
        };
        parentId?: string | undefined;
        rootId?: string | undefined;
        type?: import("./post.js").PostType | undefined;
    }>;
    readonly attatchment: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Attachment", {
        filebox: string | FileBoxInterface;
    }>;
    readonly audio: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Audio", {
        filebox: string | FileBoxInterface;
    }>;
    readonly contact: (contactId: string) => import("typesafe-actions").PayloadAction<"Contact", {
        contactId: string;
    }>;
    readonly emoticon: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Emoticon", {
        filebox: string | FileBoxInterface;
    }>;
    readonly image: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Image", {
        filebox: string | FileBoxInterface;
    }>;
    readonly location: (locationPayload: LocationPayload) => import("typesafe-actions").PayloadAction<"Location", {
        accuracy: number;
        address: string;
        latitude: number;
        longitude: number;
        name: string;
    }>;
    readonly miniProgram: (miniProgramPayload: MiniProgramPayload) => import("typesafe-actions").PayloadAction<"MiniProgram", {
        appid?: string | undefined;
        description?: string | undefined;
        pagePath?: string | undefined;
        iconUrl?: string | undefined;
        shareId?: string | undefined;
        thumbUrl?: string | undefined;
        title?: string | undefined;
        username?: string | undefined;
        thumbKey?: string | undefined;
    }>;
    readonly text: (text: string, mentions?: string[] | undefined) => import("typesafe-actions").PayloadAction<"Text", {
        text: string;
        mentions: string[];
    }>;
    readonly url: (urlLinkPayload: UrlLinkPayload) => import("typesafe-actions").PayloadAction<"Url", {
        description?: string | undefined;
        thumbnailUrl?: string | undefined;
        title: string;
        url: string;
    }>;
    readonly video: (filebox: string | FileBoxInterface) => import("typesafe-actions").PayloadAction<"Video", {
        filebox: string | FileBoxInterface;
    }>;
};
type SayablePayloadNoPost = ReturnType<typeof sayablePayloadsNoPost[keyof typeof sayablePayloadsNoPost]>;
type SayablePayload = SayablePayloadNoPost | SayablePayloadPost;
type SayablePayloadUnsupportedType = 'ChatHistory' | 'GroupNote' | 'Recalled' | 'RedEnvelope' | 'Transfer' | 'Unknown' | 'System';
export { sayablePayloads, sayableTypes, type SayablePayloadNoPost, type SayablePayload, type SayablePayloadUnsupportedType, };
