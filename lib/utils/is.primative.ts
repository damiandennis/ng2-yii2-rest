import isJsObject from "./is.js.object";

export default function isPrimitive(obj: any) {
    return !isJsObject(obj);
}
