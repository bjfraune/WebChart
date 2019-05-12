import { Logger } from "../Common/Logger.js";

export class Controller {
    logger;

    constructor() {
        this.logger = new Logger("Controller.js");
    }
}