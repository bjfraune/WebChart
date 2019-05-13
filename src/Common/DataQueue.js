import { Logger } from "./Logger.js";

const DEFAULT_BUFFER_LENGTH = 16;

export class DataQueue {

    constructor(
        bufferLength,
    ) {
        this.logger = new Logger("DataQueue.js");

        this.bufferLength = (bufferLength > 0) ? bufferLength : DEFAULT_BUFFER_LENGTH;
        this.buffer = [];
    }

    enqueue(datum) {
        if (this.buffer.length >= this.bufferLength) {
            this.dequeue();
        }

        this.buffer.push(datum);
    }

    dequeue() {
        if (this.isEmpty()) {
            this.logger.log("dequeue", "Underflow.");
            return;
        }

        return this.buffer.shift();
    }

    front() {
        if (this.isEmpty()) {
            this.logger.log("front", "No elements in Queue.");
            return;
        }
        return this.buffer[0];
    }

    isEmpty() {
        return this.buffer.length == 0;
    }

    range(start, end) {
        let key = Object.keys(this.buffer[0])[0];
        var result = [];

        for (let i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i][key] >= start && this.buffer[i][key] <= end) {
                result.push(this.buffer[i]);
            }
        }

        return result;
    }

    toString(dataQueue) {
        if (dataQueue == null) {
            dataQueue = this;
        }

        let str = "{ ";
        if (!dataQueue.isEmpty()) {
            let i;
            for (i = 0; i < dataQueue.buffer.length - 1; i++) {
                str += `${dataQueue.printDatum(dataQueue.buffer[i])}, `;
            }
            str += dataQueue.printDatum(dataQueue.buffer[i]);
        }

        return `${str} }`;
    }

    printDatum(obj) {
        let keys = Object.keys(obj);

        let str = "[ ";
        if (keys.length >= 1) {
            let j;
            for (j = 0; j < keys.length - 1; j++) {
                str += `${keys[j]}: ${obj[keys[j]]}, `;
            }
            str += `${keys[j]}: ${obj[keys[j]]}`;
        }

        return `${str} ]`;
    }
}