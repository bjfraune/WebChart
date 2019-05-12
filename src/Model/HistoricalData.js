import Logger from "../Common/Logger.js";

const DEFAULT_BUFFER = 16;
export class HistoricalData {
    constructor() {
        this.logger = new Logger("HistoricalData.js");
    }

    /*
        Data may arrive at an arbitrary frequency, so the data is buffered in an attempt to provide
        a smoother stream. Buffering incoming data will cause a lag between data
        received and the display of said data. The user of this class may specify the buffer, and the.
    */
    setInputBuffer(newValue) {
        if (newValue >= 1) {
            this.inputBuffer = newValue;
        }
    }
}