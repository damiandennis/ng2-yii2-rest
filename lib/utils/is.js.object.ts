export default function isJsObject(o: any) {
    return o !== null && (typeof o === "function" || typeof o === "object");
}
