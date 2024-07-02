/**
 * Huan(202008): Like the GRPC, we must NOT change the number below.
 *  When we are adding new types, just increase the maximum number by +1!
 *
 * Huan(202201): rename it to DirtyType for a better name?
 */
export var DirtyType;
(function (DirtyType) {
    DirtyType[DirtyType["Unspecified"] = 0] = "Unspecified";
    DirtyType[DirtyType["Message"] = 1] = "Message";
    DirtyType[DirtyType["Contact"] = 2] = "Contact";
    DirtyType[DirtyType["Room"] = 3] = "Room";
    DirtyType[DirtyType["RoomMember"] = 4] = "RoomMember";
    DirtyType[DirtyType["Friendship"] = 5] = "Friendship";
    DirtyType[DirtyType["Post"] = 6] = "Post";
})(DirtyType || (DirtyType = {}));
