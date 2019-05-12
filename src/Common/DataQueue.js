import { Logger } from "./Logger.js";

const DEFAULT_BUFFER = 16;

export class DataQueue {
    constructor(
        bufferSize,
    ) {
        this.logger = new Logger("DataQueue.js");

        this.bufferSize = bufferSize ? bufferSize : DEFAULT_BUFFER;
        this.buffer = []; // new Array(this.bufferSize);
        this.pointer = 0;
    }

    toString() {
        console.log("print data");
        let printed = 0;

        let i = this.pointer;
        while (printed < this.buffer.length) {
            if (i >= this.buffer.length) {
                i -= this.buffer.length;
            }

            ++printed;
            console.log(this.buffer[printed]);
        }
    }

    push(datum) {
        this.buffer[++this.pointer] = datum;
    }

    peek() {

    }

    remove() {

    }

    size() {

    }
}