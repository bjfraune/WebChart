import { Logger } from "../Common/Logger.js";

const DEFAULT_BUFFER = 16;

export class DataQueue {
    logger; data; pointer;

    /*
        bufferSize: number - number of data elements to hold 
    */
    constructor(
        bufferSize,
        saveFile
    ) {
        this.logger = new Logger("DataQueue.js");
        this.bufferSize = bufferSize ? bufferSize : DEFAULT_BUFFER;
    }

    add(datum) {
        data.push(datum);
    }

    peek() {

    }

    remove() {

    }

    size() {

    }
}