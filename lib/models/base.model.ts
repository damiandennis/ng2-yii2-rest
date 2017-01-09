export abstract class BaseModel {

    /**
     * @param {Object} data The data to map to the model.
     */
    constructor(data?: {[s: string]: string;}) {
        if (data) {
            Object.keys(data).map((key) => {
                this[key] = data[key];
            });
        }
    }
}
