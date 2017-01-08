export abstract class BaseModel {

    /**
     * @param {Object} data The data to map to the model.
     */
    constructor(data?: Object) {
        if (data) {
            Object.keys(data).map((key) => {
                this[key] = data[key];
            });
        }
    }
}
