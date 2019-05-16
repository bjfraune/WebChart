import { Logger } from "./Logger.js";

const DEFAULT_BUFFER_LENGTH = 16;

// DataQueue might be more accurately called a BufferedQueue
// queueRecursively - should this DataQueue hold an old buffer (DataQueue) object?
export class DataQueue {
    constructor(
        bufferLength,
        queueRecursively
    ) {
        this.logger = new Logger("DataQueue.js");

        this.bufferLength = (bufferLength > 0) ? bufferLength : DEFAULT_BUFFER_LENGTH;
        this.queueRecursively = queueRecursively ? queueRecursively : false;
        this.buffer = [];

        if (this.queueRecursively) {
            this.oldData = new DataQueue(Math.pow(this.bufferLength, 2), false);
        }
    }

    enqueue(datum) {
        if (this.buffer.length >= this.bufferLength) {
            if (this.queueRecursively) {
                this.oldData.enqueue(this.dequeue());
            }
        }

        if (datum.length) {
            // datum is given as an array, push individually
            this.buffer.push(...datum);
        } else {
            this.buffer.push(datum);
        }
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

    range = (start, end) => {
        // this.logger.logObject("range", this.buffer);
        let key = Object.keys(this.buffer[0])[0];
        var result = [];

        for (let i = 0; i < this.buffer.length; i++) {
            if (this.buffer[i][key] >= start && this.buffer[i][key] <= end) {
                result.push(this.buffer[i]);
            }
        }

        return result;
    }

    rangeRecent = (dataPoints) => {
        // this.logger.logObject("rangeRecent", this.buffer.slice(this.buffer.length - dataPoints));
        if (dataPoints >= this.buffer.length) {
            this.logger.log("rangeRecent", `dataPoints requested exceeds available: dataPoints == ${dataPoints}, this.buffer.length == ${this.buffer.length}.`);
            return this.buffer;
        }
        return this.buffer.slice(this.buffer.length - dataPoints);
    }

    setBufferLength(newLength) {
        if (newLength < 1) {
            this.logger.log("setBufferLength", `Invalid newLength = ${newLength}.`);
            return;
        }

        if (newLength == this.bufferLength) {
            return;
        }

        if (newLength < this.bufferLength) {
            let newBuffer = this.buffer.slice(this.buffer.length - newLength);
            if (this.queueRecursively) {
                this.oldData.enqueue(this.buffer);
            }
            this.buffer = newBuffer;
        }
    }

    toString(dataQueue) {
        if (dataQueue == null) {
            dataQueue = this;
        }

        let str = "[";
        if (!dataQueue.isEmpty()) {
            let i;
            for (i = 0; i < dataQueue.buffer.length - 1; i++) {
                str += `${dataQueue.printDatum(dataQueue.buffer[i])}, `;
            }
            str += dataQueue.printDatum(dataQueue.buffer[i]);
        }

        return `${str}]`;
    }

    printDatum(obj) {
        let keys = Object.keys(obj);

        let str = "{";
        if (keys.length >= 1) {
            let j;
            for (j = 0; j < keys.length - 1; j++) {
                str += `${keys[j]}: ${obj[keys[j]]}, `;
            }
            str += `${keys[j]}: ${obj[keys[j]]}`;
        }

        return `${str}}`;
    }
}