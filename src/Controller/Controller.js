import { Logger } from "../Common/Logger.js";

export class Controller {
    constructor(model) {
        this.logger = new Logger("Controller.js");

        this.model = model;
    }

    setViewWindow(newWindow) {
        this.viewWindow = newWindow;
        this.model.setViewWindow(this.viewWindow);
    }

    keepViewWindowUpdated() {

    }
}