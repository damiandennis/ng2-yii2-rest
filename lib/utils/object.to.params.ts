import isPrimitive from "./is.primative";

/**
 * Converts an object to a parametrised string.
 * @param object
 * @returns {string}
 */
export default function objectToParams(object: any) {
    return Object.keys(object).map((value) => {
        let objectValue = isPrimitive(object[value]) ? object[value] : JSON.stringify(object[value]);
        return `${value}=${objectValue}`;
    }).join("&");
}
