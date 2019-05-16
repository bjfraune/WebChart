import { Logger } from "../Common/Logger.js";
import { Model } from "../Model/Model.js";

export class Controller {
    constructor(model, keepViewUpdated) {
        this.logger = new Logger("Controller.js");

        this.model = model;
        this.keepViewUpdated = keepViewUpdated;

        if (this.keepViewUpdated) {
            this.model.setDataReceiptCallback(this.model.updateView);
        }
    }

    setViewWindow(newWindow) {
        this.viewWindow = newWindow;
        this.model.setViewWindow(this.viewWindow);
    }

    setKeepViewUpdated(keepViewUpdated) {
        this.keepViewUpdated = keepViewUpdated;
        if (this.keepViewUpdated) {
            this.model.setDataReceiptCallback(this.model.updateView);
        } else {
            this.model.setDataReceiptCallback(null);
        }
    }
}